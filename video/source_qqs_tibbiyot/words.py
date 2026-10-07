# display tokens per phrase (clause); "_" joins tokens shown as one word
P=["Tibbiy xizmatlar bo‘yicha qo‘shilgan qiymat solig‘i imtiyozi bekor qilindi.",
"Menga bitta xususiy tibbiyot markazi murojaat qildi —",
"«endi nima qilamiz?» deb.",
"Birinchi qadam:",
"Tovar-moddiy zaxiralar va uzoq muddatli aktivlarni inventarizatsiya qildik —",
"imtiyoz bekor qilingan sanadagi holatga ko‘ra.",
"Ikkinchi qadam:",
"bir yildan ko‘p bo‘lmagan vaqt oldin qo‘shilgan qiymat solig‘i bilan xarid qilingan tovar-moddiy zaxiralarni tanladik.",
"Uchinchi qadam:",
"har bir aktivning xarid sanasidagi qo‘shilgan qiymat solig‘i stavkasiga muvofiq soliqni ajratdik —",
"2023_yildan keyin xarid qilinganlar bo‘yicha 12_foiz.",
"To‘rtinchi qadam:",
"tuzatish summasini qo‘shilgan qiymat solig‘i hisob-kitobiga",
"5-ilovaning 1-jadvalida aks ettirdik,",
"3-ilovaning 0123-satriga tushdi.",
"Natija:",
"markaz o‘ziga tegishli qo‘shilgan qiymat solig‘ini hisobga oldi,",
"ortiqcha to‘lamadi.",
"Nazorat-kassa texnikasi sozlamalarini ham 12_foizga o‘zgartirdik.",
"Sizning korxonangizda ham imtiyoz bekor bo‘lganmi?",
"«XIZMAT» deb yozing —",
"tekshirib beramiz."]
SP={"2023_yildan":"ikki ming yigirma uchinchi yildan","12_foiz.":"o'n ikki foiz","12_foizga":"o'n ikki foizga",
"5-ilovaning":"beshinchi ilovaning","1-jadvalida":"birinchi jadvalida","3-ilovaning":"uchinchi ilovaning",
"0123-satriga":"nol bir yuz yigirma uchinchi satriga","Tovar-moddiy":"tovar moddiy","tovar-moddiy":"tovar moddiy",
"hisob-kitobiga":"hisob kitobiga","Nazorat-kassa":"nazorat kassa"}
import re
def toks(p): return [t for t in p.split(" ") if t!="—"]
def disp(t): return t.replace("_"," ")
def spoken(t):
  if t in SP: return SP[t]
  return re.sub(r"[,.:?!«»]","",t.replace("‘","'").replace("’","'")).strip()
