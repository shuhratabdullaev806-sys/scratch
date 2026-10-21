# Ishlab Chiqarish va Tannarx Tizimi

Ushbu tizim mahsulot tannarxini hisoblash (Kalkulyatsiya) uchun mo'ljallangan.

## Joylashuvi
Fayl: `ishlab_chiqarish/index.html`

## Asosiy Tushunchalar

### 1. Xomashyo (2010)
Mahsulot tarkibiga kiradigan narsalar (Un, Shakar, Mato va h.k.).
- "Xomashyo Baza" bo'limida ularning narxini kiritasiz.
- Ishlab chiqarishda ularni tanlab ishlatasiz.

### 2. Ish Haqi (2070)
Aynan shu mahsulotni ishlab chiqarish bilan band bo'lgan ishchilarning oyligi.
- Ijtimoiy soliq (12%) avtomatik qo'shiladi va tannarxga kiradi.

### 3. Bilvosita Xarajatlar (2510)
Elektr, Gaz, Suv, Ijara va boshqa umumiy xarajatlar.
- Bularni mahsulotga taqsimlab kiritasiz.

## Qanday Ishlatiladi?
1.  **Xomashyo Baza**ga o'tib, kerakli materiallarni kiriting.
2.  **Ishlab Chiqarish** bo'limiga o'ting.
3.  Mahsulot nomi va sonini yozing (Masalan: 100 ta Non).
4.  Kerakli xomashyolarni qo'shing.
5.  Ishchilarga to'langan haqni va boshqa xarajatlarni kiriting.
6.  Tizim sizga **1 dona mahsulot tannarxini** hisoblab beradi.

## Ombor va provodkalar
- **Xomashyo Kirimi** (Xomashyo Baza oynasi): sana, xomashyo, miqdor, narx yoki jami summa, yetkazib beruvchi → Dt 1010 Kt 6010. Jadvalda qoldiq miqdor, summa va o'rtacha tannarx ko'rinadi.
- **Ishlab chiqarish** saqlanganda xomashyo qoldig'i tekshiriladi (yetmasa — saqlanmaydi), o'rtacha tannarx bo'yicha chiqariladi va provodkalar tuziladi: Dt 2010 Kt 1010 / 6710 / 6520 (12%) / 0230 / 2510, brak Dt 2610 Kt 2010, tayyor mahsulot Dt 2810 Kt 2010. Chala qoldiq 2010 da qoladi.
- **Tayyor Mahsulot (2810)** oynasi: mahsulot qoldiqlari va "Sotishga chiqim" (Dt 9110 Kt 2810).
- Yangi hujjatlarda `provodkalar: [{dt, kt, sum, izoh}]` saqlanadi. Qoldiqlar shu hujjatlardan hisoblanadi; faqat eng oxirgi ombor hujjatini o'chirish mumkin.

## Saqlash
Barcha tarix brauzer xotirasida saqlanadi.
