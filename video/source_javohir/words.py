P=["Assalomu alaykum.","Mening ismim Javohir.",
"Men buxgalteriya yo‘nalishida o‘qiyotganligim sababli,",
"o‘z bilim va ko‘nikmalarimni oshirish maqsadida",
"Faxr_Madad_Konsalt o‘quv markazi va konsaltingini tanladim.",
"Bu yerda men buxgalteriyaga oid amaliy va nazariy bilimlarni chuqur egalladim.",
"Ustozlarimdan kerakli bilim va ko‘nikmalarni olib,",
"hozirda amaliyotni o‘rganib kelmoqdaman.",
"Bu yerga kelganimdan so‘ng,",
"buxgalteriyaga bo‘lgan qiziqishim yanada oshdi.",
"Sizlarga ham ushbu o‘quv markazi va konsaltingini tavsiya qilib qolaman."]
SP={"Faxr_Madad_Konsalt":"faxr madad konsalt"}
import re
def toks(p): return [t for t in p.split(" ") if t!="—"]
def disp(t): return t.replace("_"," ")
def spoken(t):
  if t in SP: return SP[t]
  return re.sub(r"[,.:?!«»]","",t.replace("‘","'").replace("’","'")).strip()
