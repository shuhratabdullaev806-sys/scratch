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

## Montaj (avtomatik)
1. HeyGen diktor videosi (9:16) va Instadoodle doska videosi (16:9, oq fon) yuklanadi.
2. `xaritalar/NN.json` yoziladi: diktor gaplari vaqti -> doska vaqti, 2-kadr boshlanishi (k2) va kesish joylari (crop1, crop2).
3. `./montaj.sh diktor.mp4 doska.mp4 <diktor_tugash_soniyasi> "Sarlavha" chiqish.mp4 xaritalar/NN.json`
   Yakuniy ekran diktor tugagach 5 s turadi. Natija: 1080×1920, 30 fps, H.264 + AAC.
