# Loyiha qoidalari

## Viktorina Shorts videolari (ROST / YOLG'ON)

Bu yerda HeyGen avatar videolaridan "ROST yoki YOLG'ON" viktorina Shorts'lari
yig'iladi. Montaj kodi `montaj-src/` da.

### Format — MUHIM

**Besh savol.** Uchta emas.

**Javoblar videoda aytilmaydi.** Diktor faqat savollarni o'qiydi, har
biridan keyin pauza. Javoblar izohga (kommentariyaga) qo'yiladi — bu
odamlarni izohga kirishga va yozishga majbur qiladi.

Demak montajda **javob ochilishi yo'q**: tugma yonmaydi, ✓ chiqmaydi,
konfetti otilmaydi, izoh kartasi ko'rinmaydi. ROST va YOLG'ON tugmalari
butun video davomida bir xil turadi — ular savol, javob emas.

Har videoga ikkita fayl tayyorlanadi:
1. HeyGen uchun diktor matni
2. Izohga qo'yiladigan javoblar matni (qisqa izohlar bilan)

### Orqa fon — TEGILMAYDI

HeyGen videosidagi fon qanday bo'lsa, shunday qoladi. Fonni kesish,
almashtirish yoki rangini o'zgartirish **kerak emas** — sinab ko'rildi,
auditoriyaga tabiiy ko'rinmadi. Faqat ustiga grafika qo'yiladi.

### Pauza qoidasi — MUHIM

Diktor **4 soniyalik pauza** bilan yozib oladi, montajda esa pauzalar
**3 soniyaga qisqartiriladi**. Har safar shunday qilinadi, alohida
so'ramasdan.

Nima uchun ikki xil:

- **Yozishda 4 soniya** — `silencedetect` uzun jimlikni ishonchli ajratadi.
  Nutq ichidagi tabiiy to'xtashlar 1.3 soniyagacha yetadi, shuning uchun
  javob pauzasi ulardan aniq farq qilib turishi kerak.
- **Montajda 3 soniya** — tomoshabin uzoq jimlikda videoni tashlab ketadi.
  Javobni o'ylash kerak bo'lsa, o'zi to'xtatadi. Bu qoidani kanal
  bloggerlari tavsiya qilgan.

Amalda: har bir jimlikning **o'rtasidan 1 soniya** kesib tashlanadi
(chetlaridan emas — nafas olish tovushlari kesilmasin). Keyin vaqtlar
qaytadan aniqlanadi va `timeline.ts` yangilanadi.

### Murojaat shakli

Tomoshabinga **"siz"** deb murojaat qilinadi, "sen" emas. Auditoriya —
buxgalterlar va korxona rahbarlari.

### Faktlar

O'zbekiston qonunchiligiga oid raqamlar (Markaziy Bank qayta moliyalash
stavkasi, soliq foizlari, modda raqamlari) har videoda qayta tekshiriladi.
Ishonch hosil qilib bo'lmagan faktni videoga qo'yish o'rniga, o'sha savolni
boshqasiga almashtirish kerak.

### Sinab ko'rilgan va rad etilgan

Bular qaytadan taklif qilinmasin:

- **Fonni kesib, rangli fon qo'yish** (shaffof WebM + sariq/ko'k
  almashuvchi fon). Texnik jihatdan ishladi, lekin xodimlar va
  o'quvchilarga tabiiy ko'rinmadi.
- **Fonga rangli "sahna yorug'ligi"** qo'yish. Rang diktorning kiyimiga
  ham tushadi, yoqmadi.

### Renderlangan videolar

`.mp4` fayllar `.gitignore` da — ular artefakt. Manba `montaj-src/` da
saqlanadi va har safar qaytadan render qilinadi.
