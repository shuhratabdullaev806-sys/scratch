const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT = path.join(__dirname, 'out');
const SRC = process.argv[2] || process.env.SRC_VIDEO;
if (!SRC) {
  console.error('Usage: node compose.js <path-to-source-video.mp4>');
  process.exit(1);
}
const FFMPEG = require('ffmpeg-static');

function pngSize(f) {
  const b = fs.readFileSync(f);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

const beats = [
  [0.00, 6.41, 'sub_01.png'],
  [6.41, 9.71, 'sub_02.png'],
  [9.71, 14.59, 'sub_03.png'],
  [14.59, 16.93, 'sub_04.png'],
  [16.93, 24.47, 'sub_05.png'],
  [24.47, 31.96, 'sub_06.png'],
  [31.96, 37.95, 'sub_07.png'],
  [37.95, 44.94, 'sub_08.png'],
  [44.94, 51.65, 'sub_09.png'],
  [51.65, 56.36, 'sub_10.png'],
];

const A_START = 6.6, A_DUR = 2.6;
const C_START = 25.5, C_DUR = 3.2;
const B_START = 33.0, B_DUR = 3.2;

const inputs = [];
inputs.push(['-i', SRC]);                              // 0
inputs.push(['-loop', '1', '-i', path.join(OUT, 'namecard.png')]); // 1
beats.forEach(([, , f]) => inputs.push(['-loop', '1', '-i', path.join(OUT, f)])); // 2..11
inputs.push(['-loop', '1', '-i', path.join(OUT, 'ring.png')]); // 12
inputs.push(['-itsoffset', String(A_START), '-i', path.join(OUT, 'anim_a.webm')]); // 13
inputs.push(['-itsoffset', String(B_START), '-i', path.join(OUT, 'anim_b.webm')]); // 14
inputs.push(['-itsoffset', String(C_START), '-i', path.join(OUT, 'anim_c.webm')]); // 15

let fc = [];
fc.push(`[13:v]tpad=stop_mode=clone:stop_duration=60,format=yuv420p[ovA]`);
fc.push(`[base0][ovA]overlay=0:0:enable='between(t,${A_START},${A_START + A_DUR})'[s1]`);
fc.push(`[15:v]tpad=stop_mode=clone:stop_duration=60,format=yuv420p[ovC]`);
fc.push(`[s1][ovC]overlay=0:0:enable='between(t,${C_START},${C_START + C_DUR})'[s2]`);
fc.push(`[14:v]tpad=stop_mode=clone:stop_duration=60,format=yuv420p[ovB]`);
fc.push(`[s2][ovB]overlay=0:0:enable='between(t,${B_START},${B_START + B_DUR})'[s3a]`);

// bottom half of the split-screen must show the presenter's actual face, not
// whatever happens to sit in the lower half of the raw frame (chest/hands) —
// crop a face-height slice of the source and place it in the bottom half.
fc.push(`[0:v]crop=608:540:0:130,format=yuv420p[faceB]`);
fc.push(`[s3a][faceB]overlay=0:540:enable='between(t,${B_START},${B_START + B_DUR})'[s3]`);

// circle-masked live presenter, composited on top during the C window
fc.push(`[0:v]crop=420:420:94:140,scale=380:380,format=rgba,geq=r='r(X\\,Y)':g='g(X\\,Y)':b='b(X\\,Y)':a='if(lte(pow(X-190\\,2)+pow(Y-190\\,2)\\,36100)\\,255\\,0)'[circle]`);
fc.push(`[s3][circle]overlay=114:80:enable='between(t,${C_START},${C_START + C_DUR})'[s4]`);
fc.push(`[12:v]format=rgba[ringv]`);
fc.push(`[s4][ringv]overlay=104:70:enable='between(t,${C_START},${C_START + C_DUR})'[s5]`);

// name card, top-left, 0-10s with fade
fc.push(`[1:v]format=rgba,fade=t=in:st=0:d=0.4:alpha=1,fade=t=out:st=9.4:d=0.5:alpha=1[ovName]`);
fc.push(`[s5][ovName]overlay=24:40[s6]`);

// subtitles
let prev = 's6';
beats.forEach(([start, end, file], i) => {
  const idx = 2 + i;
  const [w, h] = pngSize(path.join(OUT, file));
  const y = 1080 - 70 - h;
  const subLabel = `sub${i}`;
  const outLabel = i === beats.length - 1 ? 'vout' : `s7_${i}`;
  fc.push(`[${idx}:v]format=rgba[${subLabel}]`);
  fc.push(`[${prev}][${subLabel}]overlay=24:${y}:enable='between(t,${start},${end})'[${outLabel}]`);
  prev = outLabel;
});

fc.unshift(`[0:v]format=yuv420p[base0]`);

const filterScript = fc.join(';\n');
fs.writeFileSync(path.join(OUT, 'filter.txt'), filterScript);

const args = [];
inputs.forEach((i) => args.push(...i));
args.push(
  '-filter_complex_script', path.join(OUT, 'filter.txt'),
  '-map', '[vout]',
  '-map', '0:a',
  '-t', '56.36',
  '-r', '25',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '160k',
  '-movflags', '+faststart',
  '-y', path.join(OUT, 'final_preview.mp4'),
);

console.log(FFMPEG, args.join(' '));
execFileSync(FFMPEG, args, { stdio: 'inherit' });
