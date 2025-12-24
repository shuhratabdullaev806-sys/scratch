# Kadrlar va Ish Haqi (HR & Payroll System)
**Versiya:** 2.0  
**Tashkilot:** FAXR MADAD KONSALT  
**Muallif:** Suxrat Abdullaev

## Tizim Haqida
Ushbu dastur kichik va o'rta biznes subyektlari uchun **Xodimlar hisobi**, **Ish haqi (Tabel)** va **Soliq hisobotini** avtomatlashtirish uchun mo'ljallangan. Tizim internet talab qilmaydi va ma'lumotlarni kompyuter xotirasida (localStorage) saqlaydi.

---

## 🚀 Asosiy Imkoniyatlar

### 1. 👨‍💼 Xodimlar (Kadrlar)
*   **Xodim qo'shish:** F.I.SH, Lavozim, Oylik stavkasi va Ishga kirgan sanasi.
*   **Bandlik turlari:**
    *   **Shtat:** Doimiy xodimlar (Shtat jadvaliga bog'langan).
    *   **Ishbay:** Bajarilgan ish hajbiga qarab.
    *   **GPD:** Fuqaroviy huquqiy shartnoma.
*   **Imtiyozlar:**
    *   **SK 380-modda:** Nogironligi bo'lgan shaxslar (Daromaddan 1.41 * MHM chegiriladi).
    *   **SK 378-modda:** Kontrakt to'lovi yoki Ipoteka kreditlari uchun imtiyozlar.
*   **Aliment:** Sof daromaddan (Netto) % hisobida ushlash (25%, 33%, 50%).

### 2. 💰 Ish Haqi va Tabel
*   **Avtomatik Hisoblash:** Xodimning oylik stavkasi, plan va fakt soatlari asosida.
*   **Tabel Yuritish:**
    *   **Fact/Plan:** Ishlangan soatlarni kiritish.
    *   **Mukofot (Bonus):** Qo'shimcha rag'batlantirish.
    *   **Kasalik (Bolnichniy):** Vaqtincha mehnatga layoqatsizlik nafaqasi.
*   **Ajratmalar:**
    *   JShODS (12%)
    *   INPS (0.1%)
    *   Ijtimoiy Soliq (12%)
    *   Aliment (Netto summadan)

### 3. 📊 Soliq Hisoboti (Shakl 11101_13)
*   Oy yakunida "Hisobotni Yangilash" tugmasi orqali avtomatik shakllanadi.
*   **Soliq Kodeksi** talablariga mos (010, 020, 030 satrlar).
*   Chop etishga tayyor format.

### 4. 🏢 Shtat Jadvali
*   Tashkilot bo'limlari va lavozimlarini shakllantirish.
*   Oylik fondini rejalashtirish.

---

## 🛠 Ishlatish Bo'yicha Qo'llanma

1.  **Ishni Boshlash:** `index.html` faylini istalgan brauzerda (Chrome, Edge, Firefox) oching.
2.  **Xodimlarni Kiritish:** "Xodimlar" bo'limiga o'tib, barcha xodimlarni kiriting. Agar soliq imtiyozi yoki aliment bo'lsa, tegishli maydonlarni tanlang.
3.  **Oylik Hisoblash:**
    *   "Ish Haqi" bo'limiga o'ting.
    *   "Hisobot Oyi"ni tanlang.
    *   **"⚙️ Hisoblash"** tugmasini bosing.
4.  **Tabelni To'ldirish:**
    *   Jadvalda har bir xodim qatoridagi **"⚙️ Tabel"** tugmasini bosing.
    *   Haqiqiy ishlagan soati, Mukofot va Kasallik pullarini kiriting.
    *   Tizim avtomatik qayta hisoblaydi.
5.  **Hisobot:** "Soliq Hisoboti" bo'limiga o'tib, natijalarni ko'ring va chop eting.

## ⚠️ Eslatmalar
*   Ma'lumotlar faqat sizning kompyuteringizda (Brauzer xotirasida) saqlanadi.
*   Brauzer keshini tozalash ma'lumotlarni o'chirib yuborishi mumkin.

---
**© 2025 FAXR MADAD KONSALT**
