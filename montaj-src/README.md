# SK 299 viktorina — Remotion montaji

HeyGen avatar videosi ustiga ROST/YOLG'ON viktorina grafikasini qo'yadi.

## Ishlatish

```bash
npm install
mkdir -p public && cp <heygen-video>.mp4 public/source.mp4
npx remotion render src/index.ts Quiz out/quiz.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  --codec=h264 --crf=20 --concurrency=4
```

## Yangi video uchun nima o'zgartiriladi

Faqat `src/timeline.ts`:

1. Pauzalarni top:
   ```bash
   ffmpeg -i public/source.mp4 -af silencedetect=noise=-35dB:d=3.0 -f null -
   ```
2. `DURATION_S` ni manba uzunligiga qo'y.
3. Har savol uchun `pauseFrom` / `pauseTo` ni aniqlangan jimlikdan ol.
4. Jumla chegaralari uchun mayda jimliklarni ko'r
   (`d=0.35`) va `labelAt`, `textFrom`, `explainFrom`, `explainTo` ni belgila.
5. `answer`, `screenText`, `explain` ni yangi savollarga moslashtir.

Qolgan hamma narsa — tugmalar, taymer, konfetti, kartochkalar — o'zgarmaydi.

## Tuzilishi

- `timeline.ts` — barcha vaqtlar, javoblar, matnlar, ranglar
- `parts.tsx` — tugma, taymer, savol matni, kartochkalar, konfetti
- `Main.tsx` — video qatlami, intro, outro, tugmalar mantig'i
