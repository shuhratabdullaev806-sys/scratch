// O'qituvchi sahifalari (o'qituvchi paneli, kod yaratish) uchun alohida parol.
// O'quvchilarning oylik kodi bu sahifalarni ochmaydi. Parolning o'zi emas, faqat "izi" saqlanadi.
// Parolni almashtirish: natijalar/kod_yaratish.html → "O'qituvchi paroli" bo'limi → yangi izni shu yerga qo'ying.
// Kirish faqat brauzer oynasi yopilguncha eslab qolinadi (sessionStorage) — sinf kompyuterida
// o'qituvchi chiqib ketgach, o'quvchi panelni qayta ochsa, yana parol so'raladi.
window.USTOZ_KIRISH = {
    tuz: 'fmk-ustoz-2026',
    iter: 300000,
    h: 'a51c6fc62c5a33a5b08eefd74bc5ec6f31706ff0936eaf66319eeb9079336df6'
};
(function () {
    var CFG = window.USTOZ_KIRISH;
    var KALIT = 'fmk_ustoz';
    var root = document.documentElement;
    try { if (sessionStorage.getItem(KALIT) === CFG.h) { root.style.visibility = ''; return; } } catch (e) { }
    root.style.visibility = 'hidden';

    var kul = document.createElement('div');
    kul.id = 'fmk-ustoz';
    kul.style.cssText = 'visibility:visible;position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;background:linear-gradient(135deg,#0f172a,#7c3aed);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
    kul.innerHTML =
        '<form style="background:#fff;border-radius:18px;padding:28px;max-width:380px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center">' +
        '<div style="font-size:2.2rem">👨‍🏫</div>' +
        '<h2 style="margin:8px 0 4px;color:#1e293b;font-size:1.3rem">Faqat o\'qituvchi uchun</h2>' +
        '<p style="margin:0 0 16px;color:#64748b;font-size:.92rem">O\'qituvchi parolini kiriting.</p>' +
        '<input id="fmk-uparol" type="password" autocomplete="off" placeholder="Parol" style="width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #cbd5e1;border-radius:10px;font-size:1rem;text-align:center">' +
        '<div id="fmk-uxato" style="color:#dc2626;font-size:.88rem;min-height:20px;margin:8px 0"></div>' +
        '<button id="fmk-ubtn" type="submit" style="width:100%;padding:12px;border:none;border-radius:10px;background:#7c3aed;color:#fff;font-size:1rem;font-weight:600;cursor:pointer">Kirish</button>' +
        '</form>';
    root.appendChild(kul);

    var xato = function (m) { var e = document.getElementById('fmk-uxato'); if (e) e.textContent = m; };
    if (!window.crypto || !crypto.subtle) xato("Bu brauzer parolni tekshira olmaydi. Google Chrome yoki Microsoft Edge da oching.");

    function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }

    async function iz(p) {
        var enc = new TextEncoder();
        var kalit = await crypto.subtle.importKey('raw', enc.encode(norm(p)), 'PBKDF2', false, ['deriveBits']);
        var bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(CFG.tuz), iterations: CFG.iter, hash: 'SHA-256' }, kalit, 256);
        return Array.from(new Uint8Array(bits)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    kul.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault();
        var p = document.getElementById('fmk-uparol').value;
        var btn = document.getElementById('fmk-ubtn');
        if (!norm(p)) { xato('Parolni kiriting.'); return; }
        btn.disabled = true; btn.textContent = 'Tekshirilmoqda…'; xato('');
        try {
            if (await iz(p) === CFG.h) {
                try { sessionStorage.setItem(KALIT, CFG.h); } catch (e2) { }
                kul.remove();
                root.style.visibility = '';
            } else {
                xato("Parol noto'g'ri.");
            }
        } catch (err) {
            xato("Brauzer parolni tekshira olmadi. Google Chrome yoki Microsoft Edge da oching.");
        }
        btn.disabled = false; btn.textContent = 'Kirish';
    });

    document.addEventListener('DOMContentLoaded', function () {
        var i = document.getElementById('fmk-uparol'); if (i) i.focus();
    });
})();
