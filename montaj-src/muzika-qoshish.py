import subprocess, numpy as np

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
MUSIC = "/root/.claude/uploads/667a72e6-91ab-5708-b97f-f12d4978d75a/699d05f6-unexplored-pathways_88370.mp3"
VIDEO = "/home/user/scratch/bux_asoslari.mp4"
OUT = "muzika_envelope.wav"
SR, CH, DUR = 48000, 2, 57.64
# Trekning eng tekis qismi — sokin boshlanishi chetlab o'tiladi.
OFFSET = 45.5

PAUSES = [(10.75,13.59),(19.93,22.99),(28.28,31.38),(37.73,40.76),(47.82,50.64),(54.55,57.64)]
LOW_REL, HIGH_REL, RAMP = -18.0, -7.0, 0.45
db = lambda d: 10 ** (d / 20)

def decode(path):
    cmd = [FF,"-v","quiet","-i",path,"-ar",str(SR),"-ac",str(CH),"-f","f32le","-"]
    return np.frombuffer(subprocess.run(cmd,capture_output=True,check=True).stdout,
                         dtype=np.float32).reshape(-1, CH).copy()

rms = lambda x: float(np.sqrt((x ** 2).mean())) if len(x) else 1e-9

def moving_rms(x, win):
    """Siljuvchi RMS — trekning o'z balandligi qayerda tushib ketishini topadi."""
    p = np.concatenate([np.zeros(1), np.cumsum(x ** 2)])
    i = np.arange(len(x))
    lo = np.maximum(i - win // 2, 0)
    hi = np.minimum(i + win // 2, len(x) - 1)
    return np.sqrt((p[hi + 1] - p[lo]) / np.maximum(hi - lo + 1, 1))

speech = decode(VIDEO)
mask = np.ones(len(speech), bool)
for s, e in PAUSES:
    mask[int(s*SR):int(e*SR)] = False
speech_rms = rms(speech[mask])

a = decode(MUSIC)[int(OFFSET * SR):]
n = int(DUR * SR)
if len(a) < n:
    a = np.tile(a, (n // len(a) + 1, 1))
a = a[:n]

# Trekni bir tekis darajaga keltirish: har 0.6 soniyalik oynaning o'z
# balandligiga bo'linadi. Sokin joylar ko'tariladi, baland joylar tushadi.
mono = a.mean(axis=1)
env = moving_rms(mono, int(0.6 * SR))
env = np.maximum(env, 0.08 * float(np.percentile(env, 90)))
env = moving_rms(env, int(0.8 * SR)) if False else env
lvl = float(np.median(env))
corr = np.clip(lvl / env, 0.25, 4.0).astype(np.float32)
# Tuzatishning o'zi silliq bo'lsin, aks holda "pulsatsiya" eshitiladi.
k = int(0.5 * SR)
corr = np.convolve(corr, np.ones(k) / k, mode="same").astype(np.float32)
a *= corr[:, None]
a *= speech_rms / rms(a)

t = np.arange(n) / SR
gain = np.full(n, db(LOW_REL), dtype=np.float32)
for s, e in PAUSES:
    w = np.minimum(np.clip((t-s)/RAMP, 0, 1), np.clip((e-t)/RAMP, 0, 1))
    w[(t < s) | (t > e)] = 0
    gain = np.maximum(gain, db(LOW_REL) + (db(HIGH_REL) - db(LOW_REL)) * w)

gain *= np.clip(t / 1.0, 0, 1)
gain *= np.clip((DUR - t) / 1.2, 0, 1)
a *= gain[:, None]

subprocess.run([FF,"-v","quiet","-y","-f","f32le","-ar",str(SR),"-ac",str(CH),
                "-i","-","-c:a","pcm_s16le",OUT], input=a.astype(np.float32).tobytes(), check=True)
print(f"nutq RMS {20*np.log10(speech_rms):.1f} dB | tekislash {20*np.log10(corr.min()):+.1f}..{20*np.log10(corr.max()):+.1f} dB")
