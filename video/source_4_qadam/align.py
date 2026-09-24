import numpy as np,json
db=np.load("db.npy"); v=np.convolve((db>45.6).astype(float),np.ones(6)/6,'same')>0.3
C=[(0.11,2.68,"Operativ|4 ijarani|4 to‘g‘ri|2 hisobga|3 olishning|3 4|1 qadami.|3"),
(3.46,3.99,"Saqlab|2 qo‘yin­g.|2"),
(4.79,7.91,"Faqat|2 elektron|3 hisob-fakturani|6 xarajatga|4 yozib,|2"),
(8.07,9.98,"001-hisob|5 raqamni|3 unutish_—|3"),
(10.94,15.92,"Ma’muriy|3 javobgarlik|4 to‘g‘risidagi|5 kodeksining|4 175-1-moddasi|11 bo‘yicha|3"),
(16.40,19.90,"2_200_000|8 so‘mdan|2 jarimaga|4 sabab|2 bo‘ladi.|3"),
(21.31,24.66,"1.|3 Shartnoma|3 va|1 dalolatnomani|6 rasmiylashtiring.|5"),
(25.48,30.94,"2.|3 Debet|2 001_—|3 shartnoma|3 qiymatida|4 balansdan|3 tashqari|3 kirim|2 qiling.|2"),
(31.86,34.93,"3.|3 Har|1 oylik|2 elektron|3 hisob-faktura|5 bo‘yicha|3 provodkalar:|4"),
(35.51,40.12,"Debet|2 9420_—|6 Kredit|2 6910|5 (ijara|3 haqi)|2"),
(41.04,46.22,"Debet|2 4410_—|6 Kredit|2 6910|5 (qo‘shilgan|3 qiymat|2 solig‘i)|3"),
(47.11,52.40,"4.|3 Shartnoma|3 tugagach_—|3 Kredit|2 001|3 bilan|2 hisobdan|3 chiqaring.|3"),
(53.01,53.98,"Hamkasblarga|4 ulashing.|3"),
(54.80,57.24,"Savol|2 bo‘lsa_—|2 izohda|3 XIZMAT|2 deb|1 yozing.|2")]
out=[]
for ci,(a,b,s) in enumerate(C):
  s=s.replace("­","")
  i0,i1=int(a*100),int(b*100); vv=v[i0:i1].astype(float)+0.08
  cum=np.concatenate([[0],np.cumsum(vv)]); cum/=cum[-1]
  toks=[t.rsplit("|",1) for t in s.split(" ")]; tot=sum(int(n) for _,n in toks); c=0
  for w,n in toks:
    wa=a+np.searchsorted(cum,c/tot)/100; c+=int(n); wb=a+np.searchsorted(cum,c/tot)/100
    out.append(dict(c=ci,w=w.replace("_"," "),a=round(wa,2),b=round(min(wb,b),2)))
f=json.load(open("comp/face.json"))
open("comp/data.js","w").write("window.WORDS="+json.dumps(out,ensure_ascii=False)+";\nwindow.FACE="+json.dumps(f)+";\n")
print(len(out)); print(" ".join(f"{o['w']}@{o['a']}" for o in out))
