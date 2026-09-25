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

## Yangi video uchun

### 1. Pauzalarni qisqartir (majburiy)

Diktor 4 soniyalik pauza bilan yozadi, videoda esa 3 soniya bo'lishi kerak.
Sabablari `../CLAUDE.md` da.

```bash
./pauzani-qisqartir.sh <heygen-video>.mp4 public/source.mp4
```

Skript har jimlikning o'rtasidan 1 soniya kesadi, so'ng `timeline.ts` uchun
kerakli hamma vaqtni chop etadi. Nechta pauza topilganini tekshiring —
savollar soniga teng bo'lishi shart.

### 2. `src/timeline.ts` ni yangila

Skript bergan qiymatlardan:

- `DURATION_S` — yangi uzunlik
- `pauseFrom` / `pauseTo` — uzun jimliklardan, har savolga bittadan
- `labelAt`, `textFrom`, `explainFrom`, `explainTo` — mayda jimliklar
  ro'yxatidan. Tartib: savol raqami aytiladi → savol matni → PAUZA →
  "Javob — ..." → izoh.

Keyin `answer`, `screenText`, `explain` va kerak bo'lsa `calc` ni yangi
savollarga moslashtiring.

### 3. Render

Qolgan hamma narsa — tugmalar, taymer, konfetti, kartochkalar, intro,
outro — o'zgarmaydi.

## Tuzilishi

- `timeline.ts` — barcha vaqtlar, javoblar, matnlar, ranglar
- `parts.tsx` — tugma, taymer, savol matni, kartochkalar, konfetti
- `Main.tsx` — video qatlami, intro, outro, tugmalar mantig'i
