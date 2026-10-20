// Portalga kirish kodi (har oy yangilanadi). Internetdagi saytda ham, kompyuterdan fayl
// sifatida ochilganda ham so'raladi — saqlab olingan nusxa ham oy tugagach kodsiz ochilmaydi.
// Har bir sahifa <head> ida sahifani yashiradigan qator bor; uni faqat shu fayl ochadi,
// shuning uchun bu fayl bo'lmasa (masalan, "faqat HTML" saqlanganda) sahifa yopiq qoladi.
// Bu yengil to'siq: oddiy foydalanuvchini to'xtatadi, lekin dasturchini emas.
(function () {
    var CFG = window.KIRISH_KODLARI;
    var KALIT = 'fmk_kirish';
    var d = new Date();
    var oy = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    var kerak = CFG && CFG.oylar && CFG.oylar[oy];

    function oqi() { try { return JSON.parse(localStorage.getItem(KALIT)); } catch (e) { return null; } }
    function yoz(v) { try { localStorage.setItem(KALIT, JSON.stringify(v)); } catch (e) { } }

    var root = document.documentElement;
    var saqlangan = oqi();
    if (kerak && saqlangan && saqlangan.oy === oy && saqlangan.h === kerak) {
        root.style.visibility = '';
        return;
    }
    root.style.visibility = 'hidden';

    var kul = document.createElement('div');
    kul.id = 'fmk-kirish';
    kul.style.cssText = 'visibility:visible;position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;background:linear-gradient(135deg,#1e1b4b,#4361ee);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
    kul.innerHTML =
        '<form style="background:#fff;border-radius:18px;padding:28px;max-width:380px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center">' +
        '<div style="font-size:2.2rem">🔒</div>' +
        '<h2 style="margin:8px 0 4px;color:#1e293b;font-size:1.3rem">FAXR MADAD KONSALT</h2>' +
        '<p style="margin:0 0 16px;color:#64748b;font-size:.92rem">Kirish kodini kiriting. Kodni o\'qituvchingizdan oling — u har oy yangilanadi.</p>' +
        '<input id="fmk-kod" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Kirish kodi" style="width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #cbd5e1;border-radius:10px;font-size:1rem;text-align:center">' +
        '<div id="fmk-xato" style="color:#dc2626;font-size:.88rem;min-height:20px;margin:8px 0"></div>' +
        '<button id="fmk-btn" type="submit" style="width:100%;padding:12px;border:none;border-radius:10px;background:#4361ee;color:#fff;font-size:1rem;font-weight:600;cursor:pointer">Kirish</button>' +
        '</form>';
    root.appendChild(kul);

    var xato = function (m) { var e = document.getElementById('fmk-xato'); if (e) e.textContent = m; };
    if (!kerak) xato("Bu oy uchun kod belgilanmagan. O'qituvchiga murojaat qiling.");
    else if (!window.crypto || !crypto.subtle) xato("Bu brauzer kodni tekshira olmaydi. Google Chrome yoki Microsoft Edge da oching.");

    function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }

    async function iz(kod) {
        var enc = new TextEncoder();
        var kalit = await crypto.subtle.importKey('raw', enc.encode(norm(kod) + '|' + oy), 'PBKDF2', false, ['deriveBits']);
        var bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(CFG.tuz), iterations: CFG.iter, hash: 'SHA-256' }, kalit, 256);
        return Array.from(new Uint8Array(bits)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    kul.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault();
        var kod = document.getElementById('fmk-kod').value;
        var btn = document.getElementById('fmk-btn');
        if (!kerak) return;
        if (!norm(kod)) { xato('Kodni kiriting.'); return; }
        btn.disabled = true; btn.textContent = 'Tekshirilmoqda…'; xato('');
        try {
            var h = await iz(kod);
            if (h === kerak) {
                yoz({ oy: oy, h: h });
                kul.remove();
                root.style.visibility = '';
            } else {
                xato("Kod noto'g'ri. Qayta urinib ko'ring.");
            }
        } catch (err) {
            xato("Brauzer kodni tekshira olmadi. Google Chrome yoki Microsoft Edge da oching.");
        }
        btn.disabled = false; btn.textContent = 'Kirish';
    });

    document.addEventListener('DOMContentLoaded', function () {
        var i = document.getElementById('fmk-kod'); if (i) i.focus();
    });
})();
