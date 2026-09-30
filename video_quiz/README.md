# Savol-javob video (Remotion)

Savol tepada animatsiya bilan chiqadi, javob variantlari pastda chiqadi,
to'g'ri javob yonib belgi bilan ko'rsatiladi. Format: 1080x1920 (9:16).

## Fayllar
- `public/audio/q00.mp3` kirish, `q01.mp3 ... q05.mp3` savol audiolari
- `SSENARIY.md` audio va video matni
- `public/video/javoblar.mp4` HeyGen javob videosi (pauzalar bilan)
- `src/quiz.json` savollar, javoblar va vaqtlar

## quiz.json
- `video`: `"video/javoblar.mp4"` (yo'q bo'lsa, fon gradient)
- `questions[].audio`: `"audio/q01.mp3"` (davomiylik avtomatik o'qiladi)
- `questions[].at`: savol chiqadigan soniya (yo'q bo'lsa ketma-ket)
- `questions[].answerAt`: javob yonadigan soniya (yo'q bo'lsa audio tugagach 1 s)
- `questions[].answer`: `togri | notogri | ahmoqlik | risk`
- `totalSeconds`: jami davomiylik (yo'q bo'lsa avtomatik)

## Buyruqlar
    npm install
    npm run studio   # brauzerda ko'rish
    npm run render   # out/quiz.mp4
