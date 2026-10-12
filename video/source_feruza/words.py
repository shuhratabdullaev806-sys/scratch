P=["Assalomu alaykum.","Mening ismim Feruza.",
"Men buxgalteriya yo‘nalishiga qiziqqanim uchun",
"«FAXR_MADAD_KONSALT» o‘quv markaziga keldim",
"va bu yerda buxgalteriya bilimlarini olib, 1C dasturida malakamni oshirdim.",
"Hozirgi vaqtda men buxgalteriya bo‘yicha amaliy ish ko‘nikmalarini o‘zlashtirmoqdaman.",
"Bu yerga kelishimdan oldin menda",
"«real firmalar bilan ishlay olamanmi?» degan savol bor edi",
"va men birinchi-ikkinchi darslardanoq o‘z savollarimga javob topdim.",
"Sizlarga ham «FAXR_MADAD_KONSALT» o‘quv markazini tavsiya qilaman.",
"Bu yerda professional ustozlardan dars olasiz",
"va buxgalteriya bilimlarini yanada chuqurroq o‘rganasiz."]
SP={"«FAXR_MADAD_KONSALT»":"faxr madad konsalt","1C":"bir se","birinchi-ikkinchi":"birinchi ikkinchi"}
import re
def toks(p): return [t for t in p.split(" ") if t!="—"]
def disp(t): return t.replace("_"," ")
def spoken(t):
  if t in SP: return SP[t]
  return re.sub(r"[,.:?!«»]","",t.replace("‘","'").replace("’","'")).strip()
