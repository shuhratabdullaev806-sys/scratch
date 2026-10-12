import numpy as np, librosa, json, os, sys, re, subprocess
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from words import *
SR=16000
real,_=librosa.load("o.wav",sr=SR)
# groups of phrase indices -> speech segment
G=[([0,1,2],1.11,5.91),([3],6.43,8.73),([4],9.42,14.62),([5],15.78,19.70),([6],21.17,23.45),([7],23.70,26.73),([8],27.14,31.22),([9,10],31.47,36.81),([11],37.23,40.81)]
def feat(y):
  m=librosa.feature.mfcc(y=y,sr=SR,n_mfcc=20,hop_length=160,n_fft=512)[1:]
  return (m-m.mean(1,keepdims=True))/(m.std(1,keepdims=True)+1e-6)
def tts(text,fn):
  if not os.path.exists(fn): subprocess.run(["espeak-ng","-v","uz","-s","165","-w",fn,text],check=True)
  y,_=librosa.load(fn,sr=SR); y,_=librosa.effects.trim(y,top_db=30); return y
db=np.load("db.npy"); v=np.convolve((db>np.percentile(db,30)+8).astype(float),np.ones(6)/6,'same')>0.3
def syl(t): return max(1,len(re.findall(r"[aeiou]",spoken(t).lower())))
out=[]
for gi,(pis,a,b) in enumerate(G):
  T=[(pi,t) for pi in pis for t in toks(P[pi])]
  segs=[tts(spoken(t),f"tts2/{pi}_{j}.wav") for j,(pi,t) in enumerate(T)]
  bd=np.concatenate([[0],np.cumsum([len(s) for s in segs])])
  r=real[int(a*SR):int(b*SR)]
  F1,F2f=feat(np.concatenate(segs)),feat(r)
  rms=librosa.feature.rms(y=r,frame_length=512,hop_length=160)[0]
  d=20*np.log10(rms+1e-9); vm=d>np.percentile(d,20)+0.3*(np.percentile(d,95)-np.percentile(d,20))
  vm=np.convolve(vm.astype(float),np.ones(5)/5,'same')>0.3
  n=min(len(vm),F2f.shape[1]); vidx=np.where(vm[:n])[0]
  D,wp=librosa.sequence.dtw(X=F1,Y=F2f[:,vidx],metric='cosine'); wp=wp[::-1]
  def m(s):
    i=min(np.searchsorted(wp[:,0],s/160),len(wp)-1); return a+vidx[min(wp[i,1],len(vidx)-1)]*160/SR
  i0,i1=int(a*100),int(b*100); vv=v[i0:i1].astype(float)+.08
  cum=np.concatenate([[0],np.cumsum(vv)]); cum/=cum[-1]; tot=sum(syl(t) for _,t in T); c=0
  for j,(pi,t) in enumerate(T):
    sa=a+np.searchsorted(cum,c/tot)/100; c+=syl(t)
    wa=a if j==0 else 0.5*(sa+m(bd[j]))
    out.append(dict(c=pi,w=disp(t),a=round(wa,2),b=b))
for i in range(len(out)-1):
  out[i+1]['a']=max(out[i+1]['a'],out[i]['a']+.12)
  if out[i+1]['a']-out[i]['b']<0 or out[i+1]['c']==out[i]['c'] or out[i+1]['a']<out[i]['b']: out[i]['b']=min(out[i]['b'],out[i+1]['a'])
json.dump(out,open("words_final.json","w"),ensure_ascii=False)
last=-1
for o in out:
  if o['c']!=last: print(f"\n[{o['c']}] ",end=""); last=o['c']
  print(f"{o['w']}@{o['a']}",end=" ")
print()
