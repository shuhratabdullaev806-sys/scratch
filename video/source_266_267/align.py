import numpy as np,json
db=np.load("db.npy"); v=np.convolve((db>50.1).astype(float),np.ones(6)/6,'same')>0.3
C=[(0.21,1.84,"Korxona|3 uchun|2 avtomobil|4 oldingiz.|3"),
(2.00,4.68,"Buxgalter|3 qo‘shilgan|3 qiymat|2 solig‘ini|4 zachyotga|3 oldi_—|2"),
(5.32,6.10,"yo‘l|1 varaqasi|4 yo‘q,|1"),
(6.40,8.21,"yoqilg‘i-moylash|5 materiallari|6 akti|2 yo‘q.|1"),
(8.90,9.74,"Yoki|2 aksincha_—|3"),
(10.03,12.10,"hujjat|2 yuritdi,|3 lekin|2 zachyotga|3 olmay,|2"),
(12.58,13.06,"pulni|2 «yo‘qotdi».|3"),
(14.00,16.72,"Soliq|2 kodeksi|3 IKKITA|3 qonuniy|3 yo‘l|1 bergan:|2"),
(17.39,19.54,"1.|3 Qo‘shilgan|3 qiymat|2 solig‘ini|4 zachyotga|3 olasiz_—|3"),
(19.81,21.46,"lekin|2 har|1 kuni|2 yo‘l|1 varaqasi,|4"),
(21.84,23.87,"yoqilg‘i-moylash|5 materiallari|6 akti|2 yuritasiz.|4"),
(24.75,27.06,"266-modda.|10"),
(27.65,31.73,"2.|3 Qo‘shilgan|3 qiymat|2 solig‘ini|4 qiymatga|3 qo‘shib,|2 Foyda|2 solig‘idan|4 tejaysiz.|3"),
(32.24,33.04,"Qog‘ozbozlik|4 yo‘q.|1"),
(33.95,35.02,"267-modda.|10"),
(35.90,36.73,"Ikkalasi|4 qonuniy.|3"),
(37.29,38.58,"Buxgalteringiz|5 tanlaganmi?|4"),
(39.09,39.65,"«XIZMAT»|2 yozing.|2")]
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
