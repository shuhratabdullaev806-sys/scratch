# Ekspert video qoidalari (9:16, 45 s)

Har mavzu uchun ikkita alohida matn beriladi (nusxalab joylash uchun):

## 1. Diktor matni (ElevenLabs → HeyGen)
- Qisqartma yo'q: "qo'shilgan qiymat solig'i" (QQS emas), "vazirlar mahkamasi qarori" (VMQ emas).
- Schyotlar probel bilan: 40 10, 64 10 (4010 emas).
- Summalar so'z bilan: "bir million ikki yuz ming so'm".
- Uzunligi 0–40 s (~90–100 so'z). Oxirida qisqa chaqiriq ("Saqlab qo'ying!").
- Vaqt belgilari matnga kirmaydi.

## 2. Hisob-kitob yozuvi (Instadoodle, typing, ovozsiz)
- Qisqartma va raqamlar mumkin: QQS, Dt/Kt, 10 000 000.
- Odatda 2 kadr, bitta video fayl qilib eksport qilinadi:
  - 1-kadr: formula, hisoblash qadamlari, natija (bir ekranda turadi).
  - 2-kadr: provodkalar yoki "eslab qoling" xulosasi.
- Kichik mavzu bitta kadrga sig'sa, 1 kadr. Hech qachon 2 tadan ko'p emas.
- Har kadrga vaqt yoziladi; diktor kadr almashadigan soniyada 2-kadr mavzusini boshlaydi.

## Ekran joylashuvi (1080×1920)
| Hudud | Piksel |
|---|---|
| Sarlavha + logotip (1 s dan 40 s gacha, yorug'lik chizig'i) | 0–250 |
| Hisob-kitob (Instadoodle) | 262–1198 (960×936) |
| Diktor (HeyGen, beldan tepasi) | 1210–1600 (960×390) |
| Instagram xavfsiz zonasi (bo'sh) | 1600–1920 |
| Yakuniy ekran (to'liq ekran) | 40–45 s |

Stavka va schyotlar chiqarishdan oldin amaldagi Soliq kodeksi va BHMS bo'yicha tekshiriladi.

## Doska matnini berishdan oldin majburiy tekshiruv
1. Har bir raqam diktor matnidagi raqam bilan bir xilmi (ziddiyat bo'lsa, matn berilmaydi — hisob tuzatiladi).
2. Summa QQS bilanmi yoki QQSsiz: QQS ichida bo'lsa × 12/112, ustiga bo'lsa × 12%.
3. Har bir schyot 21-sonli BHMS schyotlar rejasida bormi va mazmuni to'g'rimi
   (masalan: 10 10 xom ashyo, 44 10 bo'nak/kiruvchi QQS, 60 10 yetkazib beruvchi, 51 10 hisob-kitob schyoti, 64 10 byudjetga qarz).
4. Xarid yetkazib beruvchi orqali (Kt 60 10), to'lov alohida provodka.
5. Tuzatish provodkasi asl xatoni aniq teskari qiladimi.

## Montaj (avtomatik)
1. HeyGen diktor videosi (9:16) va Instadoodle doska videosi (16:9, oq fon) yuklanadi.
2. `xaritalar/NN.json` yoziladi: diktor gaplari vaqti -> doska vaqti, 2-kadr boshlanishi (k2) va kesish joylari (crop1, crop2).
3. `./montaj.sh diktor.mp4 doska.mp4 <diktor_tugash_soniyasi> "Sarlavha" chiqish.mp4 xaritalar/NN.json`
   Yakuniy ekran diktor tugagach 5 s turadi. Natija: 1080×1920, 30 fps, H.264 + AAC.

## Vaqtni moslash
- Diktor gaplari vaqti taxmin qilinmaydi: `silencedetect` (noise=-35dB, d=0.25) bilan pauzalar topiladi, gaplar shu pauzalarga bog'lanadi.
- Doska qatorlari boshlanishi siyoh profilidan (har 0.1 s dagi eng pastki qora qator) aniqlanadi.
- `<diktor_tugash_soniyasi>` — oxirgi so'z tugagan vaqt (oxirgi silence_start), video uzunligi emas.
- Doskaning eng oxirgi kadri bo'sh bo'lishi mumkin: ushlab turish uchun oxirgidan ~0.1 s oldingi kadr olinadi.

## Diktor video formati
HeyGen ba'zan 9:16 o'rniga 16:9 kadr ichida vertikal rasm beradi (yon tomonlari oq). Bunda `xaritalar/NN.json` ga
`dk_scale`, `dk_bg`, `dk_fg` (diktorni kesish joylari) yoziladi; oq chetlar kesib tashlanadi. Namuna: `xaritalar/04_mulk_soligi.json`.

Keng ofis sahnasi (16:9, logotip va yozuvlar bilan) — sahna doska kengligida to'liq ko'rsatiladi, yon chetlar bo'sh qolmaydi:
`"dk_bg": "1920:780:0:30", "dk_fg": "1920:780:0:30"` (960:390 nisbati; y=30 bosh va qo'llarni sig'diradi). Namuna: `xaritalar/05_qqs_imtiyoz.json`.
