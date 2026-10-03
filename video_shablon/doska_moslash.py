"""Instadoodle videosini diktor gaplariga moslab qayta vaqtlaydi.
Ishlatish: python3 doska_moslash.py kirish.mp4 chiqish.mp4 umumiy_soniya xaritalar/NN.json
xarita: [chiqish_vaqti, manba_vaqti] nuqtalari; orasi chiziqli, teng manba = to'xtab turadi."""
import subprocess, sys, os, json
FF = os.environ.get('FFMPEG', 'ffmpeg')
W, H, FPS = 1920, 1080, 30
XARITA = json.load(open(sys.argv[4]))['xarita']
def manba(t):
    for (a, sa), (b, sb) in zip(XARITA, XARITA[1:]):
        if t <= b: return sa if b == a else sa + (sb - sa) * (t - a) / (b - a)
    return XARITA[-1][1]
kir, chiq, total = sys.argv[1], sys.argv[2], float(sys.argv[3])
dec = subprocess.Popen([FF, '-v', 'error', '-i', kir, '-vf', f'fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen([FF, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', chiq], stdin=subprocess.PIPE)
fs, idx, kadr = W * H * 3, -1, None
for k in range(int(round(total * FPS))):
    want = int(round(manba(k / FPS) * FPS))
    while idx < want:
        nxt = dec.stdout.read(fs)
        if len(nxt) < fs: break
        kadr, idx = nxt, idx + 1
    enc.stdin.write(kadr)
enc.stdin.close(); enc.wait(); dec.kill()
