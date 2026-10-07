import numpy as np, librosa, subprocess, json, os, sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from words import *
SR=16000
real,_=librosa.load("o.wav",sr=SR)
def tts(text,fn):
  if not os.path.exists(fn): subprocess.run(["espeak-ng","-v","uz","-s","165","-w",fn,text],check=True)
  y,_=librosa.load(fn,sr=SR); y,_=librosa.effects.trim(y,top_db=30); return y
def feat(y):
  m=librosa.feature.mfcc(y=y,sr=SR,n_mfcc=20,hop_length=160,n_fft=512)[1:]
  return (m-m.mean(1,keepdims=True))/(m.std(1,keepdims=True)+1e-6)
W=[];segs=[];bounds=[0]
for pi,p in enumerate(P):
  for j,t in enumerate(toks(p)):
    y=tts(spoken(t),f"tts/{pi}_{j}.wav"); segs.append(y); bounds.append(bounds[-1]+len(y)); W.append((pi,t))
syn=np.concatenate(segs)
F1=feat(syn); F2f=feat(real)
rms=librosa.feature.rms(y=real,frame_length=512,hop_length=160)[0]
db=20*np.log10(rms+1e-9); vm=db>np.percentile(db,25)+0.35*(np.percentile(db,95)-np.percentile(db,25))
vm=np.convolve(vm.astype(float),np.ones(5)/5,'same')>0.3
n=min(len(vm),F2f.shape[1]); vidx=np.where(vm[:n])[0]; F2=F2f[:,vidx]
D,wp=librosa.sequence.dtw(X=F1,Y=F2,metric='cosine'); wp=wp[::-1]
def m(s):
  i=min(np.searchsorted(wp[:,0],s/160),len(wp)-1); return vidx[min(wp[i,1],len(vidx)-1)]*160/SR
out=[dict(c=pi,w=disp(t),a=round(m(bounds[k]),2),b=round(m(bounds[k+1]),2)) for k,(pi,t) in enumerate(W)]
json.dump(out,open("w_global.json","w"),ensure_ascii=False)
last=-1
for o in out:
  if o['c']!=last: print(f"\n[{o['c']}] ",end=""); last=o['c']
  print(f"{o['w']}@{o['a']}",end=" ")
print()
