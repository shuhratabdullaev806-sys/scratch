P=["Salom, mening ismim Yoqibjon.",
"Men institutda iqtisodiyot yo‘nalishida o‘qiganim sababli",
"«FAXR_MADAD_KONSALT» o‘quv markaziga keldim",
"va bu yerda buxgalteriya kursi hamda 1C dasturini to‘liq o‘rgandim.",
"Ustozim Shuhrat aka tomonidan «Jizzax_EPA» MChJga tavsiya qilindim",
"va hozirda men u yerda materiallar buxgalteri sifatida ish olib boryapman.",
"Jizzaxda agar buxgalteriyani o‘rganmoqchi bo‘lsangiz,",
"«FAXR_MADAD_KONSALT» o‘quv markazini tavsiya qilaman."]
SP={"«FAXR_MADAD_KONSALT»":"faxr madad konsalt","1C":"bir se","«Jizzax_EPA»":"jizzax epa","MChJga":"emchejega"}
import re
def toks(p): return [t for t in p.split(" ") if t!="—"]
def disp(t): return t.replace("_"," ")
def spoken(t):
  if t in SP: return SP[t]
  return re.sub(r"[,.:?!«»]","",t.replace("‘","'").replace("’","'")).strip()
