import numpy as np, librosa, subprocess, json, re, os
SR=16000
real,_=librosa.load("o.wav",sr=SR)   # original (unprocessed) mono 16k
SPOKEN={"2023-yil":"ikki ming yigirma uchinchi yil","23-guruhida":"yigirma uchinchi guruhida","1C":"bir se","«Faxr Madad Konsalt»":"Faxr Madad Konsalt",
        "«Arnasoy teks»":"Arnasoy teks","MChJning":"em che je ning"}
def spoken(w):
  w=w.replace(" "," ").strip()
  if w in SPOKEN: return SPOKEN[w]
  w=w.replace("‘","'").replace("’","'").replace("«","").replace("»","")
  return re.sub(r"[,.:?!—]","",w).strip()
def tts(text,fn):
  if not os.path.exists(fn):
    subprocess.run(["espeak-ng","-v","uz","-s","150","-w",fn,text],check=True)
  y,_=librosa.load(fn,sr=SR)
  y,_=librosa.effects.trim(y,top_db=30)
  return y
def feat(y):
  m=librosa.feature.mfcc(y=y,sr=SR,n_mfcc=20,hop_length=160,n_fft=512)[1:]
  m=(m-m.mean(1,keepdims=True))/(m.std(1,keepdims=True)+1e-6)
  return m
words=json.loads(open("comp/data.js").read().split("window.WORDS=")[1].split(";\nwindow.FACE")[0])
C=eval(re.search(r"C=(\[.*?\])\nold",open("align3.py").read(),re.S).group(1))
out=[]; wi=0
for ci,(a,b,sx) in enumerate(C):
  toks=[tt.rsplit("|",1)[0].replace("_"," ") for tt in sx.split(" ")]
  segs=[]; bounds=[0]
  for j,tk in enumerate(toks):
    y=tts(spoken(tk),f"tts/{ci}_{j}.wav"); segs.append(y); bounds.append(bounds[-1]+len(y))
  syn=np.concatenate(segs)
  r=real[int(a*SR):int(b*SR)]
  F1,F2full=feat(syn),feat(r)
  rms=librosa.feature.rms(y=r,frame_length=512,hop_length=160)[0]
  db=20*np.log10(rms+1e-9); vm=db>np.percentile(db,25)+0.35*(np.percentile(db,95)-np.percentile(db,25))
  vm=np.convolve(vm.astype(float),np.ones(5)/5,'same')>0.3
  n=min(len(vm),F2full.shape[1]); vidx=np.where(vm[:n])[0]
  F2=F2full[:,vidx]
  D,wp=librosa.sequence.dtw(X=F1,Y=F2,metric='cosine',subseq=False)
  wp=wp[::-1]
  def map_s(sample):
    fr=sample/160
    i=np.searchsorted(wp[:,0],fr)
    i=min(i,len(wp)-1)
    return a+vidx[min(wp[i,1],len(vidx)-1)]*160/SR
  for j,tk in enumerate(toks):
    wa=map_s(bounds[j]); wb=map_s(bounds[j+1])
    o=dict(words[wi]); o['a']=round(wa,2); o['b']=round(max(wb,wa+.1),2); out.append(o); wi+=1
assert wi==len(words)
for o,n in zip(words,out):
  print(f"{n['w']:<24} prev {o['a']:6.2f}  dtw {n['a']:6.2f}{'  <<' if abs(n['a']-o['a'])>.35 else ''}")
json.dump(out,open("words_dtw2.json","w"),ensure_ascii=False)
