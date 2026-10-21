# Kreditorlar bilan Hisob-kitob (6010)

Buxgalteriya o'quvchilari uchun **"Majburiyatlar va Kreditorlar"** mavzusini o'rganish uchun mo'ljallangan amaliy web-ilova.

Ushbu dastur orqali siz **6010-schyot** ("Mol yetkazib beruvchilarga to'lanadigan qarzlar") bilan ishlashni va eng asosiysi **Solishtirma Dalolatnoma (Akt Sverka)** tuzishni o'rganasiz.

## Asosiy Imkoniyatlar

*   **🏢 Ta'minotchilar Bazasi**: Hamkor firmalarni kiritish va boshqarish.
*   **📉 Xarid va Qarz (Dt 1010 - Kt 6010)**: Tovar yoki xizmat sotib olganda qarzdorlikning paydo bo'lishini qayd etish.
*   **🧾 QQS**: Kirim fakturasida summa QQSsiz kiritiladi, QQS (12% / 0%) va Jami avtomatik hisoblanadi. QQS to'lovchisi bo'lsa: Dt <schyot> Kt 6010 (QQSsiz) + Dt 4410 Kt 6010 (QQS); aks holda Dt <schyot> Kt 6010 (QQS bilan). Schyotlar: 1010, 2910, 0820, 0830, 2010, 9410, 9420.
*   **💳 To'lov Qilish (Dt 6010 - Kt 5110/5010)**: Pul o'tkazganda qarzdorlikning kamayishini aks ettirish. Bo'nak: Dt 4310 Kt 5110/5010; bo'nakni hisobga olish: Dt 6010 Kt 4310.
*   **📒 Provodkalar**: har bir hujjat `provodkalar: [{dt, kt, sum, izoh}]` ko'rinishida saqlanadi va ro'yxatda ko'rsatiladi.
*   **📑 Akt Sverka (Eng muhim)**:
    *   Istalgan vaqt oralig'i uchun avtomatik solishtirma dalolatnoma tuzish.
    *   Boshlang'ich va yakuniy qoldiqni hisoblash.
    *   Tayyor rasmiy hujjatni chop etish.
*   **📊 Dashboard**: Jami qarz miqdori va eng katta kreditorlarni ko'rsatib turuvchi panel.

## Qanday Ishlatiladi?

1.  `index.html` faylini brauzerda oching.
2.  **Ta'minotchilar** bo'limida yangi firma qo'shing (Masalan: "BEST CEMENT" MCHJ).
3.  **Kiruvchi Fakturalar** bo'limida ushbu firmadan qarzga tovar oling ("Xarid" tugmasi).
4.  Keyinroq **To'lovlar** bo'limida shu firmaga pul to'lang yoki bo'nak bering.
5.  **Akt Sverka** bo'limida ushbu firma bilan hisob-kitobni tekshiring va hujjatni chop eting.

## Muallif
**Tashkilot**: FAXR MADAD KONSALT  
**Muallif**: Suxrat Abdullaev  
**Yil**: 2025
