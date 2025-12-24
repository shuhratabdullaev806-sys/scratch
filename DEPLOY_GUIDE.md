# 🚀 GitHub Pages Deploy Qo'llanmasi

## Muammo
GitHub Pages 404 xatosi bermoqda. Bu loyiha to'g'ri deploy qilinmaganligini bildiradi.

## Yechim: Qadam-baqadam Deploy

### 1️⃣ GitHub Repozitoriyasini Tekshirish

Avval GitHub'da repozitoriya mavjudligini tekshiring:
- GitHub'ga kiring: https://github.com
- Repozitoriyalar ro'yxatini ko'ring
- Agar `portal` yoki `buxgalteriya-portal` nomli repo bo'lmasa, yangi yarating

### 2️⃣ To'g'ri Repozitoriya Yaratish

**Variant A: Shaxsiy Sayt (username.github.io)**
- Repozitoriya nomi: `shuxratabdullayev-cloud.github.io`
- URL: `https://shuxratabdullayev-cloud.github.io`
- Barcha fayllar `main` branch'da bo'lishi kerak

**Variant B: Loyiha Sayti (project)**
- Repozitoriya nomi: `buxgalteriya-portal`
- URL: `https://shuxratabdullayev-cloud.github.io/buxgalteriya-portal`
- Fayllar `main` yoki `gh-pages` branch'da

### 3️⃣ Fayllarni To'g'ri Joylashtirish

**MUHIM:** GitHub Pages uchun quyidagi struktura kerak:

```
repozitoriya/
├── index.html          (Bosh sahifa - portal)
├── manifest.json
├── sw.js
├── buxgalteriya_trenajyor/
│   └── index.html
├── buxgalteriya_simulyator/
│   └── index.html
├── kassa_tizimi/
│   └── index.html
├── bank_tizimi/
│   └── index.html
├── ombor_tizimi/
│   └── index.html
├── ombor_tizimi_aveco/
│   └── index.html
├── kadrlar/
│   └── index.html
├── tabel/
│   └── index.html
├── xizmat_safari/
│   └── index.html
├── asosiy_vositalar/
│   └── index.html
├── nomoddiy_aktivlar/
│   └── index.html
├── debitorlar/
│   └── index.html
├── kreditorlar/
│   └── index.html
├── ishlab_chiqarish/
│   └── index.html
├── soliq/
│   └── index.html
├── buxgalteriya/
│   └── index.html
└── korxona_profili/
    └── index.html
```

### 4️⃣ Git Orqali Yuklash

PowerShell'da quyidagi buyruqlarni bajaring:

```powershell
# 1. Loyiha papkasiga o'ting
cd C:\Users\Admin\.gemini\antigravity\scratch

# 2. Git repozitoriyasini boshlang (agar boshlanmagan bo'lsa)
git init

# 3. Barcha fayllarni qo'shing
git add .

# 4. Commit qiling
git commit -m "Initial commit: Buxgalteriya Amaliyot Portali"

# 5. GitHub repozitoriyasiga ulang (o'z username va repo nomingizni kiriting)
git remote add origin https://github.com/shuxratabdullayev-cloud/shuxratabdullayev-cloud.github.io.git

# 6. Main branch'ga push qiling
git branch -M main
git push -u origin main
```

### 5️⃣ GitHub Pages Sozlamalarini Yoqish

1. GitHub'da repozitoriyangizga kiring
2. **Settings** → **Pages** ga o'ting
3. **Source** ni `main` branch ga o'zgartiring
4. **Folder** ni `/ (root)` qilib qoldiring
5. **Save** tugmasini bosing
6. 2-3 daqiqa kuting

### 6️⃣ Portal Faylini Tuzatish

Agar siz **Variant B** (loyiha sayti) ni tanlaganingizda, `bosh_sahifa/index.html` faylidagi barcha havolalarni tuzatish kerak:

**Eski:**
```html
<a href="../buxgalteriya_trenajyor/index.html">
```

**Yangi:**
```html
<a href="./buxgalteriya_trenajyor/index.html">
```

### 7️⃣ Tekshirish

Deploy tugagach (2-3 daqiqa):
- Variant A: `https://shuxratabdullayev-cloud.github.io` ni oching
- Variant B: `https://shuxratabdullayev-cloud.github.io/buxgalteriya-portal` ni oching

## 🎯 Tavsiya

**Men sizga Variant A ni tavsiya qilaman** - bu oddiyroq va URL qisqaroq:
1. Repozitoriya nomi: `shuxratabdullayev-cloud.github.io`
2. `bosh_sahifa/index.html` ni asosiy `index.html` ga ko'chiring
3. Barcha modullarni bir xil darajaga joylashtiring

## ❓ Savol-Javob

**S: Nega 404 xatosi chiqyapti?**
J: Chunki GitHub Pages fayl topololmayapti. Fayllar to'g'ri joyda emasligini bildiradi.

**S: Qancha vaqt kutish kerak?**
J: Birinchi deploy 2-5 daqiqa oladi. Keyingi o'zgarishlar 1-2 daqiqada ko'rinadi.

**S: LocalStorage ma'lumotlari saqlanadimi?**
J: Ha! Har bir foydalanuvchi o'z brauzerida mustaqil ma'lumotlarni saqlaydi.

## 🔧 Keyingi Qadamlar

Deploy muvaffaqiyatli bo'lgach:
1. ✅ Barcha modullarni tekshiring
2. ✅ PWA funksiyasini sinab ko'ring (Install tugmasi)
3. ✅ Talabalar bilan ulashing
4. ✅ Dokumentatsiya yarating
