import numpy as np,json
db=np.load("db.npy"); v=np.convolve((db>50.8).astype(float),np.ones(6)/6,'same')>0.3
C=[(0.17,1.06,"Har|1 oy|1 maosh|2 olasiz_—|3"),
(1.63,4.08,"lekin|2 oyning|2 o‘rtasiga|4 kelmay|2 hamyon|2 bo‘shaydi.|3"),
(4.67,5.09,"Sababi:|3"),
(5.39,8.67,"siz|1 avval|2 sarflayapsiz,|4 keyin|2 ortganini|4 saqlamoqchi|4 bo‘lyapsiz.|3"),
(9.27,9.69,"Ortmaydi.|3"),
(10.26,10.89,"To‘g‘ri|2 tartib:|2"),
(11.28,12.05,"maosh|2 tushdi_—|2"),
(12.30,14.59,"darhol|2 10%|5 alohida|4 hisobga|3 o‘tkazing.|3"),
(15.17,15.78,"Qolganini|4 sarflang.|2"),
(16.45,18.38,"Bir|1 oila|3 oyiga|3 8_million|5 so‘m|1 oladi.|3"),
(18.96,20.74,"Har|1 oy|1 800_mingni|5 ajratsa_—|3"),
(21.03,23.03,"yiliga|3 9_million|5 600_ming|4 to‘planadi.|4"),
(23.50,24.16,"Ajratmasa_—|4 nol.|1"),
(24.33,26.92,"SAQLANG_—|2 bu|1 qoidani|4 sinab|2 ko‘ring.|2")]
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
