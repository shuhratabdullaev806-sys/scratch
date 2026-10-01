import wave,numpy as np
w=wave.open("hp.wav");sr=w.getframerate();x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
N=2048;H=512;win=np.hanning(N).astype(np.float32)
nf=(len(x)-N)//H+1
X=np.stack([np.fft.rfft(x[i*H:i*H+N]*win) for i in range(nf)])
M=np.abs(X); t=np.arange(nf)*H/sr
pm=np.zeros(nf,bool)
for a,b in [(0.05,0.75),(4.5,5.6),(9.95,10.85),(19.4,20.1),(37.1,37.9)]: pm|=(t>=a)&(t<b)
noise=np.median(M[pm],0)*1.0
alpha,floor=2.0,0.1
G=np.maximum(1-alpha*(noise[None,:]/(M+1e-9))**2,0)
G=np.sqrt(G); G=np.maximum(G,floor)
# smooth gains in time and freq to avoid musical noise
from numpy.lib.stride_tricks import sliding_window_view
k=5; Gp=np.pad(G,((k//2,k//2),(1,1)),mode='edge')
G=sliding_window_view(Gp,(k,3)).mean(axis=(2,3))
Y=X*G
y=np.zeros(len(x),np.float32); ws=np.zeros(len(x),np.float32)
for i in range(nf):
  y[i*H:i*H+N]+=np.fft.irfft(Y[i],N).astype(np.float32)*win; ws[i*H:i*H+N]+=win**2
y/=np.maximum(ws,1e-6)
o=wave.open("dn.wav","wb");o.setnchannels(1);o.setsampwidth(2);o.setframerate(sr)
o.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes());o.close()
print("noise frames",pm.sum())
