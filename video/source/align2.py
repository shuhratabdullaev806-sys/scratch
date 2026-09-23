import numpy as np,json
db=np.load("db.npy"); v=np.convolve((db>48.2).astype(float),np.ones(6)/6,'same')>0.3
C=[(0.16,3.60,"Korxonangizda|5 500|3 million|3 so'mlik|2 uskuna|3 ishlaydi_—|3"),
(4.09,6.77,"lekin|2 buxgalteriya|5 hujjatlarida|5 bu|1 uskuna|3 mavjud|2 emas.|2"),
(7.64,8.58,"Xodim|2 shikastlasa_—|4"),
(9.10,10.29,"zararni|3 undirib|3 bo'lmaydi.|3"),
(10.69,13.77,"Chunki|2 001-schyotda|6 bu|1 aktiv|2 yo'q.|1"),
(14.70,18.26,"21-sonli|6 Buxgalteriya|5 hisobi|3 milliy|2 standarti|3 aniq|2 aytgan:|2"),
(19.14,21.35,"operativ|4 ijaraga|4 olingan|3 har|1 bir|1 aktiv_—|2"),
(22.05,23.80,"bino,|2 uskuna,|3 avtomobil_—|4"),
(24.33,26.29,"001-schyotga|6 kirim|2 qilinadi.|4"),
(27.31,28.65,"Shartnomaviy|4 qiymat|2 bo'yicha.|3"),
(29.09,32.12,"Debet|2 001,|3 ikkiyoqlama|4 yozuvsiz.|3"),
(32.99,34.07,"Shu|1 bitta|2 provodka_—|3"),
(34.56,36.62,"moddiy|2 javobgarlik|4 zanjirini|4 tiklaydi,|3"),
(37.44,38.94,"audit|2 xulosasini|4 tozalaydi.|4"),
(39.81,40.92,"Hozir|2 1C|2 ni|1 oching,|2"),
(41.52,42.92,"001-schyotni|6 tekshiring.|3"),
(43.65,44.42,"Xato|2 topsangiz_—|3"),
(45.00,46.38,"izohda|3 XIZMAT|2 deb|1 yozing.|2")]
out=[]
for ci,(a,b,s) in enumerate(C):
  i0,i1=int(a*100),int(b*100); vv=v[i0:i1].astype(float)+0.08
  cum=np.concatenate([[0],np.cumsum(vv)]); cum/=cum[-1]
  toks=[t.rsplit("|",1) for t in s.split(" ")]; tot=sum(int(n) for _,n in toks); c=0
  for w,n in toks:
    wa=a+np.searchsorted(cum,c/tot)/100; c+=int(n); wb=a+np.searchsorted(cum,c/tot)/100
    out.append(dict(c=ci,w=w.replace("_"," "),a=round(wa,2),b=round(min(wb,b),2)))
json.dump(out,open("comp/words.json","w"),ensure_ascii=False)
print(" ".join(f"{o['w']}@{o['a']}" for o in out))
