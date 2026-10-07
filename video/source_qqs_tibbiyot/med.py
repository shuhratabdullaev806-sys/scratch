import numpy as np, json, re, os, sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from words import *
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"pdtw.py")).read().split("def feat")[0].split("real,_=")[0])
SEG=eval(re.search(r"SEG=(\[.*?\])\n",open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"pdtw.py")).read()).group(1))
db=np.load("db.npy"); v=np.convolve((db>np.percentile(db,30)+8).astype(float),np.ones(6)/6,'same')>0.3
g=json.load(open("w_global.json")); p=json.load(open("w_phr.json"))
def syl(t): return max(1,len(re.findall(r"[aeiouo‘']",spoken(t).lower().replace("o'","o"))))
out=[];k=0
for pi,(ph,(a,b)) in enumerate(zip(P,SEG)):
  T=toks(ph); i0,i1=int(a*100),int(b*100); vv=v[i0:i1].astype(float)+.08
  cum=np.concatenate([[0],np.cumsum(vv)]); cum/=cum[-1]; tot=sum(syl(t) for t in T); c=0
  for j,t in enumerate(T):
    sa=a+np.searchsorted(cum,c/tot)/100; c+=syl(t)
    cand=[sa,p[k]['a'],min(max(g[k]['a'],a),b-.1)]
    wa=a if j==0 else float(np.median(cand))
    out.append(dict(c=pi,w=disp(t),a=round(wa,2),b=b)); k+=1
for i in range(len(out)-1):
  if out[i+1]['c']==out[i]['c']:
    out[i+1]['a']=max(out[i+1]['a'],out[i]['a']+.12); out[i]['b']=out[i+1]['a']
f=json.load(open("comp/face.json")) if os.path.exists("comp/face.json") else []
open("words_final.json","w").write(json.dumps(out,ensure_ascii=False))
last=-1
for o in out:
  if o['c']!=last: print(f"\n[{o['c']}] ",end=""); last=o['c']
  print(f"{o['w']}@{o['a']}",end=" ")
print()
