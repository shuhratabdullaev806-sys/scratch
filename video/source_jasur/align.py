import numpy as np,json
db=np.load("db.npy"); v=np.convolve((db>52.4).astype(float),np.ones(6)/6,'same')>0.3
C=[(0.79,2.39,"Salom,|2 mening|2 ismim|2 Jasur.|2"),
(2.96,5.85,"O‘zim|2 iqtisod|3 va|1 moliya|3 sohasida|4 o‘qiganim|4 sababli|3"),
(6.69,9.23,"«Faxr_Madad_Konsalt»da|6 buxgalteriya|5 kurslarida|4 o‘qidim.|3"),
(10.81,17.78,"Dastlab|2 buxgalteriyani|6 noldan|2 balansgacha,|4 undan|2 keyin|2 1C_ni|3 real|2 korxonalar|4 misolida|4 o‘rgandim.|3"),
(18.19,26.08,"Kursda|2 yaxshi|2 natijalar|4 qayd|1 etganim|3 uchun|2 hozirda|3 shu|1 yerda|2 qolib,|2 amaliy|3 darslarni|3 o‘rganib|3 kelmoqdaman.|4"),
(27.18,29.76,"Jizzaxda|3 yaxshi|2 o‘quv|2 markazi|3 qidirayotganlar|6"),
(30.16,32.02,"yoki|2 daromadli|4 kasbni|2 o‘rganaman,|4 deganlar|3 uchun|2"),
(32.57,35.92,"«Faxr_Madad_Konsalt»ni|6 tavsiya|3 qilib|2 qolaman.|3")]
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
