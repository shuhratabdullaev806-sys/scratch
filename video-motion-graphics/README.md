# Video Motion-Graphics Pipeline (SK-248 test)

Reklama/reels formatidagi (608x1080, 25fps) diktor videosiga avtomatik ravishda
quyidagilarni qo'shib beruvchi pipeline:

- **Liquid-glass subtitrlar** — matn brendbuk ranglarida (`#4361ee → #7209b7 → #f72585`,
  `Outfit` shrifti) frosted-glass kartochkalarda, video pastida.
- **Name card** — "Shuxrat Abdullaev · Buxgalter", videoning birinchi 10 soniyasida
  yuqori chap burchakda paydo bo'lib, fade bilan yo'qoladi.
- **3 xil animatsion qo'shimcha (vstavka)**, foydalanuvchi tasvirlagan variantlar:
  - `anim_a.html` — **to'liq ekran** almashinuvi (diktor 2-3 soniyaga butunlay
    yo'qoladi), raqam animatsiyasi + "stamp" effekti bilan.
  - `anim_b.html` — **ikkiga bo'lingan ekran**: tepada animatsion grafika
    (ustunli diagramma), pastda diktorning real videosi davom etadi.
  - `anim_c.html` — **doira (krujok) ichida diktor** + orqa fonda to'liq ekran
    huquqiy/infografika animatsiyasi.

## Qanday ishlaydi

1. `render.js` — Playwright (headless Chromium) orqali barcha subtitr
   kartochkalari, name card va 3 ta animatsiyani screenshot/video sifatida
   `out/` papkasiga chiqaradi (shaffof PNG yoki opaque WEBM).
2. `compose.js` — ffmpeg `filter_complex` orqali original videoga barcha
   qatlamlarni vaqt bo'yicha (`enable='between(t,start,end)'`) ustma-ust
   qo'yadi va yakuniy MP4 ni yig'adi.

```bash
npm install
CHROMIUM_PATH=/path/to/chrome npm run render      # asosiy assetlar
npm run render:extra                              # ring.png + anim_c yangilansa
node compose.js /path/to/original-video.mp4
```

`CHROMIUM_PATH` ko'rsatilmasa, Playwright o'zi yuklab olgan brauzerdan
foydalanadi (`npx playwright install` orqali).

## Vaqt jadvali (SK_248.mp4, 56.36s)

Vaqt chegaralari videodagi haqiqiy pauzalarga (`ffmpeg silencedetect`) qarab
tanlangan — bu **birinchi bosqich taxmini**, aniq lab-sync uchun ovozni
tinglab ±0.2-0.5s aniqlashtirish tavsiya etiladi (`compose.js` ichidagi
`beats` massivini va `A_START/B_START/C_START` qiymatlarini o'zgartirish
kifoya).

| # | Vaqt (s) | Matn | Qo'shimcha |
|---|----------|------|------------|
| 1 | 0.00–6.41 | Aksiyada tannarxdan arzon sotdingiz va QQS... | Name card (0-10s) |
| 2 | 6.41–9.71 | Auditda — 4 million so'm jarima. | **A: to'liq ekran** (6.6-9.2s) |
| 3 | 9.71–14.59 | Sababi? "Sotdim — shundan..." | — |
| 4 | 14.59–16.93 | Lekin bozor narxidan past sotuvda... | — |
| 5 | 16.93–24.47 | Ko'pchilik buxgalter: "Shartnomada..." | — |
| 6 | 24.47–31.96 | Aslida Soliq kodeksi 248-moddasi... | **C: doira + fon** (25.5-28.7s) |
| 7 | 31.96–37.95 | 30 milliondan hisoblangan QQS... | **B: split-screen** (33.0-36.2s) |
| 8 | 37.95–44.94 | Farq 20 million, jarima 4 million so'm... | — |
| 9 | 44.94–51.65 | Korxonangizda so'nggi aksiya tekshirilganmi? | — |
| 10 | 51.65–56.36 | Izohda XIZMAT deb yozing. | — |

## Keyingi qadamlar (agar yoqsa)

- Har bir gapga alohida "vstavka" qo'shish (hozir faqat 3 ta demo nuqta bor).
- Aniq lab-sync uchun ovozni real eshitib vaqtlarni ±0.3s aniqlashtirish.
- Circle inset uchun crop koordinatalarini (`compose.js`dagi `crop=420:420:94:140`)
  har bir videoning kadrlashuviga qarab moslashtirish.
- Subtitr kartochkasiga real backdrop-blur (video orqasidan xira ko'rinish)
  qo'shish — hozir frosted-panel yarim shaffof rang bilan simulyatsiya qilingan.
