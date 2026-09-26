import numpy as np,json
db=np.load("db.npy"); v=np.convolve((db>40.4).astype(float),np.ones(6)/6,'same')>0.3
C=[(0.14,2.15,"31|3 yillik|2 tajribamda|4 ko‘rganim_—|3"),
(2.97,9.34,"bilimiga|4 investitsiya|5 qilgan|2 inson|2 2–3|3 yilda|2 daromadini|5 kamida|3 1,5|3 barobar|3 oshirgan.|3"),
(11.00,14.01,"Pul|1 oqimini|4 yaxshilashning|4 ikki|2 yo‘li|2 bor.|1"),
(14.43,16.96,"Birinchisi_—|4 xarajatni|4 qisqartirish.|4"),
(17.82,19.80,"Uning|2 chegarasi|4 bor.|1"),
(20.48,22.10,"Ikkinchisi_—|4 daromadni|4 oshirish.|3"),
(22.89,24.23,"Uning|2 chegarasi|4 yo‘q.|1"),
(24.81,28.10,"Qanday?|2 O‘z|1 sohangizda|4 kurs|1 o‘qing,|2"),
(28.73,29.77,"yangi|2 malaka|3 oling,|2"),
(30.11,32.64,"Sohadoshlar|4 bilan|2 aloqada|4 bo‘ling.|2"),
(32.97,37.54,"Yaxshi|2 aloqa_—|3 yaxshi|2 ish|1 taklifi.|3 Yaxshi|2 malaka_—|3 yuqori|3 maosh.|2"),
(38.04,40.61,"Daromadingizni|6 oshirmoqchimisiz?|6"),
(41.58,43.99,"SAQLANG_—|2 bu|1 formulani|4 eslab|2 qoling.|2")]
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
