import numpy as np,json
db=np.load("db.npy"); v=np.convolve((db>52.0).astype(float),np.ones(6)/6,'same')>0.3
C=[(0.15,3.32,"Qaytarish|3 cheki|2 urildi_—|3 lekin|2 soliq|2 hisobotida|5 EMAS.|2"),
(3.72,4.48,"Kassir|2 chek|1 uradi.|3"),
(4.97,7.87,"Lekin|2 uni|2 sotish|2 chekiga|3 BIRIKTIRMAYDI.|5"),
(8.29,10.17,"Natija:|3 qaytarilgan|4 summadan|3 siz|1 soliq|2 to‘laysiz.|3"),
(10.85,12.33,"Biriktirish|4 2|2 usulda|3 bo‘ladi:|3"),
(12.80,14.80,"1.|3 QR-kodni|4 skanerlash_—|3 darhol.|2"),
(15.17,20.64,"2.|3 my.soliq.uz_da|7 qo‘lda_—|2 keyingi|3 oyning|2 10-sanasigacha.|8"),
(21.16,22.65,"Biriktirilgan|5 chek_—|1 ko‘k|1 rang.|1"),
(23.00,24.25,"Biriktirilmagan_—|6 qizil.|2"),
(24.66,25.86,"Shaxsiy|2 kabinetda|4 tekshiring.|3"),
(26.27,28.64,"XIZMAT|2 deb|1 yozing_—|2 buxgalteriyangizni|7 tekshiramiz.|4")]
out=[]
for ci,(a,b,s) in enumerate(C):
  i0,i1=int(a*100),int(b*100); vv=v[i0:i1].astype(float)+0.08
  cum=np.concatenate([[0],np.cumsum(vv)]); cum/=cum[-1]
  toks=[t.rsplit("|",1) for t in s.split(" ")]; tot=sum(int(n) for _,n in toks); c=0
  for w,n in toks:
    wa=a+np.searchsorted(cum,c/tot)/100; c+=int(n); wb=a+np.searchsorted(cum,c/tot)/100
    out.append(dict(c=ci,w=w.replace("_"," "),a=round(wa,2),b=round(min(wb,b),2)))
f=json.load(open("comp/face.json"))
open("comp/data.js","w").write("window.WORDS="+json.dumps(out,ensure_ascii=False)+";\nwindow.FACE="+json.dumps(f)+";\n")
print(len(out)); print(" ".join(f"{o['w']}@{o['a']}" for o in out))
