import wave,numpy as np,json
w=wave.open("b.wav");x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float);sr=32000
hop=160;N=512;win=np.hanning(N);f=np.fft.rfftfreq(N,1/sr);band=(f>300)&(f<2500)
e=np.array([np.sum((np.abs(np.fft.rfft(x[i:i+N]*win))**2)[band]) for i in range(0,len(x)-N,hop)])
d=10*np.log10(e+1); k=np.hanning(9);k/=k.sum(); s=np.convolve(d,k,'same'); t=np.arange(len(s))*hop/sr; th=np.percentile(s,35)
pk=[]
for i in range(1,len(s)-1):
  if s[i]>=s[i-1] and s[i]>s[i+1] and s[i]>th and s[i]-s[max(0,i-16):i].min()>2.0 and s[i]-s[i+1:i+17].min()>2.0:
    if pk and t[i]-pk[-1]<.08: continue
    pk.append(t[i])
pk=np.array(pk)
C=[(0.82,9.94,"Assalomu|4 alaykum,|3 men|1 Hasanov|3 Dadajon.|3 2023-yil|9 «Faxr_Madad_Konsalt»|5 MChJning|4 23-guruhida|9 1C|2 va|1 buxgalteriya|5 kursida|3 o‘qiganman.|4"),
(10.88,14.76,"Hozirda|3 Arnasoy|3 tumanidagi|5 «Arnasoy_teks»|4 mas’uliyati|5"),
(15.44,17.08,"cheklangan|3 jamiyatida|5 ishlab|2 kelaman.|3"),
(17.40,19.34,"Hozirgi|3 ish|1 faoliyatimda|6 kurs|1"),
(20.19,23.17,"davomida|4 o‘rgangan|3 bilimlarim,|4 xususan,|3"),
(23.85,27.94,"1C|2 dasturida|4 ishlash|2 bo‘yicha|3 ko‘nikmalarim|5 katta|2 yordam|2 beryapti.|3"),
(28.60,29.16,"Asosan,|3"),
(29.31,30.46,"statistika|4 va|1"),
(30.74,31.65,"soliq|2 hisobotlarini|6"),
(31.80,34.84,"topshirish|3 hamda|2 ish|1 haqini|3"),
(35.00,36.63,"hisoblash|3 jarayonlarida|6"),
(37.97,39.63,"bu|1 bilimlar|3 juda|2 asqotmoqda.|4"),
(40.76,48.87,"Barcha|2 yoshlarga|3 ushbu|2 o‘quv|2 markazida|4 o‘qib,|2 bilim|2 va|1 malakalarini|6 oshirishni|4 tavsiya|3 qilaman.|3")]
old=json.loads(open("comp/data.js").read().split("window.WORDS=")[1].split(";\nwindow.FACE")[0])
out=[]
for ci,(a,b,sx) in enumerate(C):
  p=pk[(pk>=a-.05)&(pk<=b+.05)]
  toks=[tt.rsplit("|",1) for tt in sx.split(" ")]; tot=sum(int(n) for _,n in toks); c=0
  if len(p)>=2:
    P=np.concatenate([[a+.06],p,[b+.06]]); idx=np.linspace(0,tot,len(P))
    at=lambda sy: float(np.interp(sy,idx,P))-.06
  else:
    at=lambda sy: a+(b-a)*sy/tot
  for wd,n in toks:
    wa=max(a,at(c)); c+=int(n); wb=min(b,at(c))
    out.append(dict(c=ci,w=wd.replace("_"," "),a=round(wa,2),b=round(max(wb,wa+.12),2)))
assert len(out)==len(old)
for o,n in zip(old,out):
  if 10<o['a']<41: print(f"{n['w']:<24} old {o['a']:6.2f} new {n['a']:6.2f}{'  <<' if abs(n['a']-o['a'])>.35 else ''}")
f=json.loads(open("comp/data.js").read().split("window.FACE=")[1].rstrip().rstrip(';'))
open("comp/data.js","w").write("window.WORDS="+json.dumps(out,ensure_ascii=False)+";\nwindow.FACE="+json.dumps(f)+";\n")
