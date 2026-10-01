import numpy as np,json
db=np.load("db.npy"); v=np.convolve((db>70.7).astype(float),np.ones(6)/6,'same')>0.3
C=[(0.82,9.94,"Assalomu|4 alaykum,|3 men|1 Hasanov|3 Dadajon.|3 2023-yil|9 «Faxr_Madad_Konsalt»|5 MChJning|4 23-guruhida|9 1C|2 va|1 buxgalteriya|5 kursida|3 o‘qiganman.|4"),
(10.88,17.08,"Hozirda|3 Arnasoy|3 tumanidagi|5 «Arnasoy_teks»|4 mas’uliyati|5 cheklangan|3 jamiyatida|5 ishlab|2 kelaman.|3"),
(17.40,27.94,"Hozirgi|3 ish|1 faoliyatimda|6 kurs|1 davomida|4 o‘rgangan|3 bilimlarim,|4 xususan,|3 1C|2 dasturida|4 ishlash|2 bo‘yicha|3 ko‘nikmalarim|5 katta|2 yordam|2 beryapti.|3"),
(28.60,39.63,"Asosan,|3 statistika|4 va|1 soliq|2 hisobotlarini|6 topshirish|3 hamda|2 ish|1 haqini|3 hisoblash|3 jarayonlarida|6 bu|1 bilimlar|3 juda|2 asqotmoqda.|4"),
(40.76,48.87,"Barcha|2 yoshlarga|3 ushbu|2 o‘quv|2 markazida|4 o‘qib,|2 bilim|2 va|1 malakalarini|6 oshirishni|4 tavsiya|3 qilaman.|3")]
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
