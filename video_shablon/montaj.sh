#!/usr/bin/env bash
# Ishlatish: ./montaj.sh diktor.mp4 doska.mp4 yakuniy_ekran_soniyasi "Sarlavha" chiqish.mp4
# Oldin doska_moslash.py dagi XARITA ni shu videoning diktor gaplariga moslang.
set -euo pipefail
D=$1; H=$2; END=$3; TITLE=$4; OUT=$5
TOTAL=$(python3 -c "print($END+5)")
export FFMPEG=${FFMPEG:-$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")}
W=$(mktemp -d)
cd "$(dirname "$0")"
node render.js frames "$W/ov" "$END" "$TITLE"
python3 doska_moslash.py "$H" "$W/doska.mp4" "$TOTAL"
K2=$(python3 -c "import re;print(re.search(r'\(([\d.]+), [\d.]+\),\s*\([\d.]+, [\d.]+\),\s*# 2-kadr',open('doska_moslash.py').read()).group(1))")
$FFMPEG -v error -y -i "$W/doska.mp4" -i "$D" -framerate 30 -i "$W/ov/f%05d.png" \
  -f lavfi -i "color=c=0x0b0f1f:s=1080x1920:r=30:d=$TOTAL" -filter_complex "
[0:v]split[h1][h2];
[h1]crop=1280:980:300:0,scale=920:-2,pad=960:936:20:(936-ih)/2:white[k1];
[h2]crop=860:470:620:180,scale=920:-2,pad=960:936:20:(936-ih)/2:white[k2];
[1:v]fps=30,scale=608:1080,tpad=stop_mode=clone:stop_duration=6,split[d1][d2];
[d1]crop=608:247:0:250,scale=960:390,boxblur=20:2,eq=brightness=-0.08[dbg];
[d2]crop=608:470:0:150,scale=-2:390[dfg];
[dbg][dfg]overlay=(W-w)/2:0[dk];
[3:v][k1]overlay=60:262:enable='lt(t,$K2)'[b1];
[b1][k2]overlay=60:262:enable='gte(t,$K2)'[b2];
[b2][dk]overlay=60:1210[b3];
[b3][2:v]overlay=0:0[v];
[1:a]apad[a]" -map "[v]" -map "[a]" -t "$TOTAL" -c:v libx264 -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart "$OUT"
rm -rf "$W"
