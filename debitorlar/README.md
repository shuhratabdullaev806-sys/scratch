# Debitorlar Bilan Ishlash Tizimi (O'quv Dasturi)

Ushbu loyiha **FAXR MADAD KONSALT** o'quv markazi tinglovchilari uchun maxsus ishlab chiqilgan bo'lib, **4010 - "Xaridorlar va buyurtmachilar"** buxgalteriya hisobvarag'i bilan ishlashni amaliy o'rganishga mo'ljallangan.

**Muallif:** Suxrat Abdullaev
**Versiya:** 1.0.0

---

## 🎯 Loyihaning Maqsadi
O'quvchilarga quyidagi ko'nikmalarni shakllantirish:
- Xaridorlar bazasini shakllantirish.
- Tovar va xizmatlarni sotishda **Hisob-faktura** rasmiylashtirish.
- Sotuvdan tushgan tushumlarni to'g'ri aks ettirish.
- Debitorlik qarzdorligini nazorat qilish va **Solishtirma dalolatnoma (Akt sverka)** tuzish.
- Buxgalteriya provodkalarini tushunish (Dt 4010, Kt 9010/9020/9030).

## 🚀 Asosiy Imkoniyatlar

### 1. Mijozlar (Debitorlar)
- Yangi korxona yoki jismoniy shaxsni ro'yxatga olish.
- STIR (INN), Manzil va aloqa ma'lumotlarini saqlash.

### 2. Hisob-fakturalar (Sotish)
- Avtomatik raqamlanadigan elektron hisob-faktura yaratish.
- Tovar/Xizmat nomi va narxini kiritish.
- **QQS (NDS)** hisoblash (0% yoki 12%).
- Bir nechta tovar/xizmat qatori ("Qator qo'shish").
- **Daromad turi:** 9010 Tayyor mahsulot / 9020 Tovarlar / 9030 Ish va xizmatlar.
- Avtomatik provodkalar: **Dt 4010 - Kt 9010/9020/9030** (QQSsiz summa), **Dt 4010 - Kt 6410** (QQS).
- Ixtiyoriy **Tannarx**: Dt 9110 - Kt 2810 / Dt 9120 - Kt 2910 / Dt 9130 - Kt 2010.
- **Chop etish:** Rasmiy tasdiqlangan shakldagi Hisob-faktura blankasini printerga chiqarish.

### 3. To'lovlar
- Bank yoki Kassa orqali tushgan to'lovlarni qayd etish: **Dt 5110 (5010) - Kt 4010**.
- Bo'nak (avans) olindi: **Dt 5110 (5010) - Kt 6310**; bo'nakni hisobga olish: **Dt 6310 - Kt 4010**.
- Har bir hujjat `provodkalar: [{dt, kt, sum, izoh}]` ko'rinishida saqlanadi (eski yozuvlar uchun avtomatik hisoblanadi).

### 4. Hisobotlar
- **Oborotka (Qoldiq):** Har bir mijoz bo'yicha qancha sotilgan, qancha to'langan va hozirgi qarzni ko'rish.
- **Akt Sverka:** Mijoz va davr tanlanadi: davr boshiga qoldiq, davrdagi hujjatlar (debet - hisob-fakturalar, kredit - to'lovlar va hisobga olingan bo'nak), aylanmalar, davr oxiriga qoldiq; ikki tomon imzosi bilan chop etish.

## 🛠 Texnik Ma'lumotlar
- **Texnologiyalar:** HTML5, CSS3, JavaScript (Vanilla).
- **Dizayn:** Zamonaviy Dashboard ko'rinishi (Responsive).
- **Ma'lumotlar bazasi:** Brauzer xotirasi (LocalStorage) - internet bo'lmasa ham ishlaydi va ma'lumotlar o'chib ketmaydi.
- **O'rnatish:** Shunchaki `index.html` faylini brauzerda ochish kifoya.

---

&copy; 2025 **FAXR MADAD KONSALT**. Barcha huquqlar himoyalangan.
Dasturchi va g'oya muallifi: **Suxrat Abdullaev**.
