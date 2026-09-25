# Montaj prompti — SK 299-modda viktorinasi

HeyGen videosi tayyor bo'lgach, quyidagi matnni nusxalab, video fayl bilan
birga Cowork'ga yuboring.

---

```
Yuklangan HeyGen videosidan "ROST yoki YOLG'ON" viktorina Shorts yasa.

MAVZU: Soliq kodeksi 299-modda — foizsiz qarz va foyda solig'i

JAVOBLAR KALITI
{
  "savollar": [
    {"n": 1, "javob": "YOLGON", "ekran_matn": "Foizsiz qarzdan soliq chiqmaydi"},
    {"n": 2, "javob": "ROST",   "ekran_matn": "100 mln x 14% = jami daromadga"},
    {"n": 3, "javob": "YOLGON", "ekran_matn": "2026-yildan 299-modda bekor"}
  ]
}

BIRINCHI QADAM — PAUZALARNI AVTOMATIK TOPISH
Videoning audiosini tahlil qil va 4 soniyalik jimliklarni top
(ffmpeg silencedetect: noise=-35dB, d=3.0).
Aynan 3 ta shunday jimlik bo'lishi kerak. Ularni P1, P2, P3 deb belgila.
3 tadan farq chiqsa — menga ayt, o'zing taxmin qilma.

Har bir jimlikning TUGASH vaqti = o'sha savolning javob momenti.
Javob animatsiyasi P1_end, P2_end, P3_end da boshlanadi.

FORMAT
  1080x1920, 9:16, 30fps, MP4 (H.264 + AAC)
  Avatar ovozi va lip-sync o'zgarmaydi. Videoni kesma, qisqartirma.
  Kutilayotgan uzunlik: ~43 soniya.

VIZUAL QATLAMLAR

1) Orqa fon
   Avatarning foni olib tashlanadi. Orqasiga iliq sariq gradient
   (#FFD23F -> #FFB400), ustida sekin suzuvchi yumshoq doiralar.
   Avatar pastki-markazda, ko'krakdan yuqorisi, ekran balandligining ~45%.

2) Doimiy tugmalar (butun video davomida, chap tomonda, tik ustma-ust)
   Yuqori: "ROST"    — yashil #2ECC71
   Past:   "YOLG'ON" — qizil  #E74C3C
   Yumaloq burchakli, pastida soya (bosiladigandek ko'rinsin).
   Tinch holatda: 100% -> 103% scale, 2 soniyalik nafas olish sikli.

3) Savol raqami
   Har savol boshida katta raqam markazga sakrab chiqadi (bounce),
   0.6s turadi, keyin yuqoridagi "N/3" indikatoriga kichrayib kiradi.

4) Savol matni
   Ekranning yuqori-o'rta qismida, JSON'dagi "ekran_matn".
   So'zma-so'z chiqadi, avatar aytayotgan so'zga sinxron (karaoke):
   aytilayotgan so'z sariq fonda qora harf bilan ajraladi.
   Max 3 qator, qatoriga 6 so'zdan ko'p emas.

5) PAUZA paytidagi taymer
   Har bir aniqlangan jimlik boshlanganda:
     - savol matni ekranda qoladi
     - o'ng tomonda doiraviy taymer: 4 -> 3 -> 2 -> 1
       (doira chetidagi chiziq 4 soniyada to'liq aylanib tugaydi)
     - har raqamda yumshoq "tik" ovozi, oxirgi soniyada tezroq
     - ikkala tugma navbatma-navbat sekin yonib-o'chadi (ikkilanish effekti)

6) Javob ochilishi — jimlik TUGAGAN soniyada, aniq
   JSON'dagi "javob" qiymatiga qarab:
     - TO'G'RI tugma: 100% -> 120% scale (0.3s, overshoot ease),
       atrofida yorug'lik, ustida katta ✔, "ding" ovozi,
       qisqa konfetti otilishi
     - NOTO'G'RI tugma: 40% shaffoflikka o'tadi, biroz kichrayadi
   Keyingi savol boshlanganda ikkala tugma normal holatga qaytadi.

7) Hisob kartochkasi — faqat 2-savolda
   Javob paytida o'ng tomonda hisob birin-ketin chiqadi:
     "100 mln x 14% = 14 mln"
     "14 mln x 15% = 2,1 mln"
   Oxirgi natija sariq bilan ajralsin, 2 soniya ekranda tursin.

8) Subtitrlar
   Avatar aytayotgan hamma narsa pastki uchdan birida, 2-4 so'zdan,
   qalin, oq, qora kontur bilan, sinxron.

9) Intro (birinchi 3 soniya)
   "FOIZSIZ QARZ = SOLIQ?" sakrab chiqadi,
   ostida kichikroq: "SK 299-modda — 3 savol"

10) Outro (oxirgi 3 soniya)
   "Nechta to'g'ri topdingiz? Izohda yozing!"
   + pulsatsiyalanuvchi "Obuna bo'ling" tugmasi va qo'ng'iroq ikonkasi

SHRIFT VA HARAKAT
  Shrift: Montserrat ExtraBold yoki shunga o'xshash qalin yumaloq sans.
  Asosiy matn oq, qalin qora kontur (#1A1A1A), yumshoq soya.
  Har element 0.3-0.4s bounce/overshoot bilan kiradi, tez scale-down bilan chiqadi.

TOPSHIRISH
  1. Avval faqat aniqlangan pauza vaqtlarini ko'rsat
     (P1: 0:07.2-0:10.1 ko'rinishida), tasdiqlashimni kut.
  2. Tasdiqlaganimdan keyin to'liq videoni render qil.
  3. Tayyor MP4 faylni menga yubor.
```
