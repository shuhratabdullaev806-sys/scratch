import numpy as np, json, re, librosa
SR=16000
y,_=librosa.load("o.wav",sr=SR)
S=np.abs(librosa.stft(y,n_fft=512,hop_length=160))**2
f=librosa.fft_frequencies(sr=SR,n_fft=512)
hi=S[(f>2800)&(f<7500)].sum(0); lo=S[(f>150)&(f<1500)].sum(0)+1e-9
rat=10*np.log10(hi+1e-9)-10*np.log10(lo)
tot=10*np.log10(S.sum(0)+1e-9)
z=(rat-np.mean(rat[tot>np.percentile(tot,40)]))/np.std(rat[tot>np.percentile(tot,40)])
z[tot<np.percentile(tot,30)]=-1.5   # silence is not frication
T=np.arange(len(z))*160/SR
SP={"2023-yil":"ikki ming yigirma uchinchi yil","23-guruhida":"yigirma uchinchi guruhida","1C":"bir se","MChJning":"emchejening"}
def sp(w):
  w=w.replace(" "," ").strip()
  return SP.get(w, re.sub(r"[^a-z' ]","",w.lower().replace("‘","'").replace("’","'")))
def fric_pos(word):
  s=sp(word).replace(" ",""); out=[];i=0
  while i<len(s):
    if s[i:i+2] in ("sh","ch"): out.append((i+1)/len(s)); i+=2; continue
    if s[i] in "szxfj": out.append((i+.5)/len(s))
    i+=1
  return out
C=eval(re.search(r"C=(\[.*?\])\nold",open("align3.py").read(),re.S).group(1))
def load_js(fn): return json.loads(open(fn).read().split("window.WORDS=")[1].split(";\nwindow.FACE")[0])
cands={"old":load_js("comp/data_old.js"),"peak":load_js("comp/data.js"),"dtw":json.load(open("words_dtw.json")),"dtwv":json.load(open("words_dtw2.json"))}
def score(ws):
  vals=[]
  for w in ws:
    for p in fric_pos(w['w']):
      tt=w['a']+p*(w['b']-w['a']); m=(T>=tt-.07)&(T<=tt+.07)
      vals.append(z[m].max() if m.any() else -1.5)
  return np.mean(vals) if vals else np.nan, len(vals)
res={}
for ci,(a,b,sx) in enumerate(C):
  row=[]
  for k,ws in cands.items():
    idx=[i for i,w in enumerate(cands['peak']) if w['c']==ci]
    sel=[ws[i] for i in idx]
    row.append((k,)+score(sel))
  res[ci]=row
  print(f"chunk {ci:2d} {a:5.2f}-{b:5.2f} "+"  ".join(f"{k}:{s:+.2f}" for k,s,n in row)+f"  (n={row[0][2]})")
json.dump({str(k):max(v,key=lambda r:(r[1] if r[1]==r[1] else -9))[0] for k,v in res.items()},open("best.json","w"))
print(open("best.json").read())
