# Bank Tizimi (Bank-Client) - 5110

Buxgalteriya o'quvchilari uchun **"Bank va To'lovlar" (4 va 17-mavzular)** bo'yicha amaliy mashg'ulot veb-ilovasi. Ushbu ilova "Bank-Mijoz" dasturining simulyatori hisoblanadi.

## Xususiyatlar

*   🏛 **Bank Interfeysi**: Jiddiy va professional "Indigo" dizayn.
*   💸 **To'lov Topshiriqnomasi (Platyojka)**:
    *   Rasmiy O'zbekiston bank standarti bo'yicha (0903802-shakl) to'lov topshiriqnomalarni yaratish.
    *   Kontragentlarni tanlash va saqlash.
    *   Avtomatik raqamlash va chop etish.
*   📜 **Bank Ko'chirmasi (Vipiska)**:
    *   Barcha kirim va chiqim operatsiyalari tarixi.
    *   Hujjatlarni filtrlash va Excelga yuklab olish.
*   👥 **Kontragentlar Bazasi**: Doimiy hamkorlar ma'lumotlarini (Nomi, H/R, MFO, STIR) saqlash.
*   🧮 **Avtomatik Hisob**: 5110 (Hisob-kitob schyoti) qoldig'i real vaqtda o'zgaradi.

## Buxgalteriya Provodkalari
Dastur avtomatik ravishda quyidagi provodkalarni shakllantiradi:

*   **Yetkazib beruvchiga to'lov**: Dt 6010 - Kt 5110
*   **Byudjetga (Soliq) to'lov**: Dt 6400 - Kt 5110
*   **Ish haqi to'lash**: Dt 6700 - Kt 5110
*   **Boshqa to'lovlar**: Dt 6800 - Kt 5110

## Qanday ishlatiladi?

1.  `index.html` faylini oching.
2.  **Kontragentlar** bo'limiga kirib, hamkor korxona qo'shing (Masalan: "ARTEL" MCHJ).
3.  **To'lov (Platyojka)** bo'limiga o'ting va shaklni to'ldiring.
4.  "To'lash va Saqlash" tugmasini bosing.
5.  Tayyor to'lov topshiriqnomasini chop eting.

## Muallif
**Tashkilot**: FAXR MADAD KONSALT  
**Muallif**: Suxrat Abdullaev  
**Yil**: 2025
