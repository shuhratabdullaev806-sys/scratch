# Buxgalteriya (Bosh Kitob) Tizimi

**"FAXR MADAD KONSALT"** uchun maxsus ishlab chiqilgan Bosh Kitob va Moliyaviy Hisobotlar moduli.

Ushbu dastur buxgalteriya provodkalarini yuritish, davrni yopish (Zakritiya perioda) va moliyaviy hisobotlarni (Forma-1, Forma-2) avtomatik shakllantirish uchun mo'ljallangan.

## 🚀 Asosiy Imkoniyatlar

### 1. 📖 Jurnal (Provodkalar)
- Barcha buxgalteriya operatsiyalarini kiritish.
- **Sana, Debet, Kredit, Summa va Izoh** maydonlari.
- Kiritilgan operatsiyalar asosida butun tizim ishlaydi.

### 2. ⚖️ Aylanma Qoldiq (Mizan)
- Schyotlar kesimida **Debet va Kredit aylanmalarini** ko'rish.
- Har bir schyotning yakuniy qoldig'ini avtomatik hisoblash.

### 3. 🔒 Davrni Yopish (Avtomatlashtirilgan)
Bir tugma orqali oyni yoki yilni yopish funksiyasi. Tizim quyidagi ishlarni bajaradi:
1.  **Daromadlarni yopish:** 90xx, 93xx schyotlaridagi qoldiqlar -> **9910** ga o'tkaziladi.
2.  **Xarajatlarni yopish:** 20xx, 94xx schyotlaridagi qoldiqlar -> **9910** ga o'tkaziladi.
3.  **Moliyaviy Natija:** 9910 schyotidagi foyda yoki zarar aniqlanadi.
4.  **Sof Foyda:** Natija **8710 (Taqsimlanmagan foyda)** schyotiga o'tkaziladi.

### 4. 📊 Hisobotlar
- **Buxgalteriya Balansi (Forma-1):** Aktiv va Passivlar holati.
- **Moliyaviy Natija (Forma-2):** Daromadlar, Xarajatlar va Sof foyda tahlili.

---

## 💡 Ishlatish Bo'yicha Qo'llanma

### Qadam 1: Boshlang'ich Qoldiqlarni Kiritish
Agar siz tizimni yil o'rtasida boshlayotgan bo'lsangiz, avval **Jurnal** bo'limiga kirib, schyotlarning **boshlang'ich qoldiqlarini** kiriting.
*   *Misol: Agar kassada 50 mln pul bo'lsa -> Dt 5010 Kt 0000 - 50,000,000 so'm.*

### Qadam 2: Joriy Operatsiyalar
Oylik barcha operatsiyalarni (sotish, xarajat, oylik hisoblash va boshqalar) Jurnalga kiriting.
*   *Sotish:* Dt 4010 Kt 9010
*   *Ijara:* Dt 9420 Kt 6910

### Qadam 3: Davrni Yopish
Oy tugagach, **"🔒 Davrni Yopish"** bo'limiga o'ting:
1.  Sanani tanlang (masalan, oyning oxirgi kuni).
2.  **"Davrni Yopish"** tugmasini bosing.
3.  Tizim avtomatik ravishda yopilish provodkalarini Jurnalga qo'shadi va natijani ko'rsatadi.

### Qadam 4: Hisobot Olish
Yopilishdan so'ng **"📊 Hisobotlar"** bo'limiga o'tib, Balans va Moliyaviy Natija hisobotlarini ko'rishingiz va chop etishingiz mumkin.

---

**Muallif:** Suxrat Abdullaev
**Versiya:** 1.0
