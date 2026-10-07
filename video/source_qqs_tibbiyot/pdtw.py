import numpy as np, librosa, json, os, sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from words import *
SR=16000
real,_=librosa.load("o.wav",sr=SR)
SEG=[(0.13,3.68),(4.24,6.66),(7.22,8.11),(8.63,9.14),(9.53,13.51),(14.01,16.15),(16.64,17.23),(17.65,23.37),(23.89,24.45),(24.83,29.83),(30.34,33.65),(34.17,34.76),(35.14,38.23),(38.55,40.84),(41.31,43.77),(44.39,44.83),(45.17,48.36),(48.72,49.53),(49.95,53.44),(54.05,56.52),(56.92,57.56),(58.01,58.53)]
def feat(y):
  m=librosa.feature.mfcc(y=y,sr=SR,n_mfcc=20,hop_length=160,n_fft=512)[1:]
  return (m-m.mean(1,keepdims=True))/(m.std(1,keepdims=True)+1e-6)
def ld(fn): y,_=librosa.load(fn,sr=SR); y,_=librosa.effects.trim(y,top_db=30); return y
out=[]
for pi,(p,(a,b)) in enumerate(zip(P,SEG)):
  T=toks(p)
  if len(T)==1: out.append(dict(c=pi,w=disp(T[0]),a=a,b=b)); continue
  segs=[ld(f"tts/{pi}_{j}.wav") for j in range(len(T))]
  bd=np.concatenate([[0],np.cumsum([len(s) for s in segs])])
  r=real[int(a*SR):int(b*SR)]
  F1,F2f=feat(np.concatenate(segs)),feat(r)
  rms=librosa.feature.rms(y=r,frame_length=512,hop_length=160)[0]
  db=20*np.log10(rms+1e-9); vm=db>np.percentile(db,20)+0.3*(np.percentile(db,95)-np.percentile(db,20))
  vm=np.convolve(vm.astype(float),np.ones(5)/5,'same')>0.3
  n=min(len(vm),F2f.shape[1]); vidx=np.where(vm[:n])[0]; F2=F2f[:,vidx]
  D,wp=librosa.sequence.dtw(X=F1,Y=F2,metric='cosine'); wp=wp[::-1]
  def m(s):
    i=min(np.searchsorted(wp[:,0],s/160),len(wp)-1); return a+vidx[min(wp[i,1],len(vidx)-1)]*160/SR
  for j,t in enumerate(T):
    wa=a if j==0 else m(bd[j]); wb=b if j==len(T)-1 else m(bd[j+1])
    out.append(dict(c=pi,w=disp(t),a=round(wa,2),b=round(max(wb,wa+.08),2)))
json.dump(out,open("w_phr.json","w"),ensure_ascii=False)
last=-1
for o in out:
  if o['c']!=last: print(f"\n[{o['c']}] ",end=""); last=o['c']
  print(f"{o['w']}@{o['a']}",end=" ")
print(); print(len(out))
