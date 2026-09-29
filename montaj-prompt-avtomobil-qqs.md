# Montaj prompti — Yengil avtomobil QQSi

HeyGen videosi tayyor bo'lgach, shu matnni video fayl bilan birga yuboring.

---

```
Yuklangan HeyGen videosidan "ROST yoki YOLG'ON" viktorina Shorts yasa.

MAVZU: Yengil avtomobil QQSi — zachet (SK 266) yoki tannarx (SK 267)

JAVOBLAR KALITI
{
  "savollar": [
    {"n": 1, "javob": "YOLGON", "ekran_matn": "Avtomobil QQSini zachetga olib bo'lmaydi"},
    {"n": 2, "javob": "ROST",   "ekran_matn": "To'rtta hujjat kerak — bittasi yetishmasa tushadi"},
    {"n": 3, "javob": "YOLGON", "ekran_matn": "Ikkala yo'l bir xil naf beradi"}
  ]
}

3-savol javobida hisob kartasi chiqsin:
  "Zachet: 24 mln qaytadi"
  "Tannarx: 3,6 mln tejam"
Oxirgi qator sariq bilan ajralsin.

Qolgan hamma narsa oldingi videodagidek: pauzalarni avtomatik top
(4 soniya yozilgan, 3 ga qisqartir), tugmalar, taymer, konfetti,
sariq/ko'k fon almashishi.
```

---

## Texnik eslatma

Manba `montaj-src/` da. Ish tartibi:

1. `./pauzani-qisqartir.sh <heygen-video>.mp4 public/source.mp4`
2. Skript bergan vaqtlarni `src/timeline.ts` ga ko'chirish
3. `answer`, `screenText`, `explain`, `calc` ni yuqoridagi kalitdan olish
4. Render

Batafsil: `montaj-src/README.md`
