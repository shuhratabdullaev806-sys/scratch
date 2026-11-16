// Har bir modul localStorage'da qaysi kalitlar bilan saqlaydi.
// Kalit = prefix + o'quvchi ismi (masalan: 'kassa_history_Aliyev Vali').
const MODULLAR = [
    { id: 'trenajyor', nomi: 'Buxgalteriya Trenajyori', prefixlar: ['trenajyor_data_'] },
    { id: 'simulyator', nomi: 'Buxgalteriya Simulyatori', prefixlar: ['sim_data_'] },
    { id: 'kassa', nomi: 'Kassa Tizimi', prefixlar: ['kassa_history_'] },
    { id: 'bank', nomi: 'Bank Tizimi', prefixlar: ['bank_transactions_', 'bank_counterparties_', 'bank_balance_'] },
    // FIFO: ombor_tizimi/ (portaldagi asosiy havola) 'ombor_materials_'/'ombor_history_' yozadi,
    // FIFO/ papkasi (eski nusxa) esa '..._fifo_' yozadi — ikkalasi ham bitta modul sifatida hisoblanadi.
    { id: 'fifo', nomi: 'Ombor (FIFO)', prefixlar: ['ombor_materials_fifo_', 'ombor_history_fifo_', 'ombor_materials_', 'ombor_history_'] },
    { id: 'aveco', nomi: 'Ombor (AVECO)', prefixlar: ['ombor_materials_aveco_', 'ombor_history_aveco_'] },
    { id: 'kadrlar', nomi: 'Kadrlar', prefixlar: ['k_employees_', 'k_shtat_', 'k_tabel_', 'k_payrolls_', 'k_provodkalar_'] },
    { id: 'safari', nomi: 'Xizmat Safari', prefixlar: ['safari_trips_', 'safari_employees_', 'safari_expenses_'] },
    { id: 'av', nomi: 'Asosiy Vositalar', prefixlar: ['av_assets_', 'av_logs_'] },
    { id: 'na', nomi: 'Nomoddiy Aktivlar', prefixlar: ['na_assets_', 'na_logs_'] },
    { id: 'debitor', nomi: 'Debitorlar', prefixlar: ['debitor_clients_', 'debitor_invoices_', 'debitor_payments_'] },
    { id: 'kreditor', nomi: 'Kreditorlar', prefixlar: ['kred_vendors_', 'kred_txs_', 'kred_employees_', 'kred_proxies_'] },
    { id: 'mfg', nomi: 'Ishlab Chiqarish', prefixlar: ['mfg_materials_', 'mfg_history_', 'mfg_recipes_'] },
    { id: 'soliq', nomi: 'Soliq', prefixlar: ['soliq_reports_multi_'] },
    { id: 'bk', nomi: 'Bosh Kitob (Jurnal)', prefixlar: ['b_journal_'] },
    { id: 'profil', nomi: 'Korxona Profili', prefixlar: ['company_profile_'] },
    { id: 'vazifa', nomi: 'Mavzu vazifalari (testlar)', prefixlar: ['vazifa_natija_'] },
];

// Uzunroq prefikslar avval tekshiriladi ('ombor_materials_fifo_' > 'ombor_materials_').
const BARCHA_PREFIXLAR = MODULLAR
    .flatMap(m => m.prefixlar.map(p => ({ p, modul: m.id })))
    .sort((a, b) => b.p.length - a.p.length);

const NAZORAT_TUZI = 'FMK-natija-v1';

function kalitniAjrat(kalit) {
    for (const { p, modul } of BARCHA_PREFIXLAR) {
        if (kalit.startsWith(p) && kalit.length > p.length) {
            return { modul, prefix: p, ism: kalit.slice(p.length) };
        }
    }
    return null;
}

function qiymatniOch(matn) {
    try { return JSON.parse(matn); } catch (e) { return matn; }
}

function yozuvlarSoni(qiymat) {
    if (Array.isArray(qiymat)) return qiymat.length;
    if (qiymat && typeof qiymat === 'object') return Object.keys(qiymat).length;
    return qiymat === null || qiymat === '' ? 0 : 1;
}

// Shu brauzerdagi barcha o'quvchilar: { ism: { modulId: { prefix: qiymat } } }
function brauzerdagiOquvchilar() {
    const natija = {};
    for (let i = 0; i < localStorage.length; i++) {
        const kalit = localStorage.key(i);
        const a = kalitniAjrat(kalit);
        if (!a) continue;
        natija[a.ism] = natija[a.ism] || {};
        natija[a.ism][a.modul] = natija[a.ism][a.modul] || {};
        natija[a.ism][a.modul][a.prefix] = qiymatniOch(localStorage.getItem(kalit));
    }
    return natija;
}

function modulXulosasi(modulMalumot) {
    const xulosa = {};
    for (const m of MODULLAR) {
        const d = modulMalumot[m.id];
        xulosa[m.id] = d ? Object.values(d).reduce((s, v) => s + yozuvlarSoni(v), 0) : 0;
    }
    return xulosa;
}

// Oddiy nazorat kodi: faylni qo'lda o'zgartirilganini aniqlash uchun (kuchli himoya emas).
// file:// orqali ochilganda ham ishlashi uchun crypto.subtle ishlatilmaydi.
function nazoratKodi(obj) {
    const matn = NAZORAT_TUZI + JSON.stringify(obj);
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < matn.length; i++) {
        const c = matn.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 2654435761);
        h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

function htmlXavfsiz(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// --- Natijani matn (kod) ko'rinishida uzatish ---
// Telegram bitta xabarga ~4096 belgi sig'diradi, shuning uchun natija siqiladi va
// «FMK:id:1/3:Z:....» ko'rinishidagi qismlarga bo'linadi. Qismlar orasidagi har qanday
// boshqa matn (Telegram sarlavhalari, sana, ism) o'qishda e'tiborga olinmaydi.
const QISM_UZUNLIGI = 3000;

function baytdanBase64(b) {
    let s = '';
    for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return btoa(s);
}
function base64danBayt(t) {
    const s = atob(t);
    const b = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
}
async function oqimdanOt(bayt, oqim) {
    const res = new Response(new Blob([bayt]).stream().pipeThrough(oqim));
    return new Uint8Array(await res.arrayBuffer());
}

async function natijaniKodla(matn) {
    const bayt = new TextEncoder().encode(matn);
    let tur = 'J', tana = bayt;
    if (typeof CompressionStream === 'function') {
        try { tana = await oqimdanOt(bayt, new CompressionStream('deflate-raw')); tur = 'Z'; } catch (e) { tana = bayt; tur = 'J'; }
    }
    const b64 = baytdanBase64(tana);
    const id = Math.random().toString(36).slice(2, 6).padEnd(4, '0');
    const n = Math.max(1, Math.ceil(b64.length / QISM_UZUNLIGI));
    const qismlar = [];
    for (let i = 0; i < n; i++) qismlar.push(`FMK:${id}:${i + 1}/${n}:${tur}:${b64.slice(i * QISM_UZUNLIGI, (i + 1) * QISM_UZUNLIGI)}`);
    return qismlar;
}

// Joylangan matndan natijalarni ajratadi: FMK-kodlar va/yoki oddiy JSON matn.
// Natija: { natijalar: [obyekt...], xatolar: ['...'] }
async function matndanNatijalar(matn) {
    const natijalar = [], xatolar = [];
    const guruhlar = {};
    const re = /FMK:([a-z0-9]{4}):(\d+)\/(\d+):([ZJ]):([A-Za-z0-9+\/=]+)/g;
    // Telegram Desktop nusxasidagi sarlavha qatorlari: «Ism, [16.11.2026 17:30]» — olib tashlanadi
    const toza = matn.replace(/\r/g, '').split('\n')
        .filter(q => !/^[^\n]{0,120}\[\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}[ ,]+\d{1,2}:\d{2}(:\d{2})?( ?[APap][Mm])?\]\s*$/.test(q))
        .join('\n');
    const b64 = /^[A-Za-z0-9+\/=]+$/;
    let m;
    while ((m = re.exec(toza))) {
        // Qism Telegramda bir necha qatorga/xabarga bo'linib qolgan bo'lsa — davomini ham yig'amiz
        const keyingi = toza.indexOf('FMK:', re.lastIndex);
        const qolgan = toza.slice(re.lastIndex, keyingi === -1 ? undefined : keyingi);
        let tana = m[5];
        const tokenlar = qolgan.split(/\s+/).filter(Boolean);
        if (/^\s/.test(qolgan) || !qolgan) {
            for (const t of tokenlar) { if (b64.test(t)) tana += t; else break; }
        }
        const g = guruhlar[m[1]] || (guruhlar[m[1]] = { n: +m[3], tur: m[4], q: {}, qat: {} });
        if (!g.q[+m[2]] || tana.length > g.q[+m[2]].length) { g.q[+m[2]] = tana; g.qat[+m[2]] = m[5]; }
    }
    for (const [id, g] of Object.entries(guruhlar)) {
        const yoq = [];
        for (let i = 1; i <= g.n; i++) if (!g.q[i]) yoq.push(i);
        if (yoq.length) {
            xatolar.push(`${id} kodining ${yoq.join(', ')}-qismi yetishmayapti (jami ${g.n} qism). O'quvchi tugmani qayta bosgan bo'lsa, yangi kod chiqadi — hamma qismlarini bitta koddan yuborsin`);
            continue;
        }
        // Oxirgisidan boshqa har bir qism aynan QISM_UZUNLIGI belgidan iborat bo'ladi
        const kalta = [];
        const qism = [];
        for (let i = 1; i <= g.n; i++) {
            let t = g.q[i];
            if (i < g.n) {
                if (t.length < QISM_UZUNLIGI) kalta.push(`${i}-qism (${t.length}/${QISM_UZUNLIGI} belgi)`);
                t = t.slice(0, QISM_UZUNLIGI);
            }
            qism.push(t);
        }
        if (kalta.length) { xatolar.push(`${id} kodida to'liq nusxalanmagan: ${kalta.join(', ')}`); continue; }
        // Oxirgi qism oxiriga ortiqcha so'z yopishgan bo'lishi mumkin — qisqartirib sinaymiz
        const oxirgi = qism.pop();
        const variantlar = [oxirgi, g.qat[g.n]];
        for (let k = oxirgi.length - 1; k > Math.max(0, oxirgi.length - 400); k--) if (oxirgi[k - 1] === '=' || k % 4 === 0) variantlar.push(oxirgi.slice(0, k));
        let topildi = null, sabab = "to'liq nusxalanmagan";
        for (const v of [...new Set(variantlar)]) {
            try {
                let bayt = base64danBayt(qism.join('') + v);
                if (g.tur === 'Z') {
                    if (typeof DecompressionStream !== 'function') { sabab = "brauzer eski — Chrome'ni yangilang"; break; }
                    bayt = await oqimdanOt(bayt, new DecompressionStream('deflate-raw'));
                }
                topildi = JSON.parse(new TextDecoder().decode(bayt));
                break;
            } catch (e) { }
        }
        if (topildi) natijalar.push(topildi);
        else xatolar.push(`${id} kodi o'qilmadi (${sabab}). O'quvchidan qismlarni qaytadan, har birini alohida xabar qilib yuborishini so'rang`);
    }
    // Kodlardan tashqari joylangan oddiy JSON matnlar ham o'qiladi
    {
        const t = toza.replace(re, ' ').trim();
        if (t) {
            try { natijalar.push(JSON.parse(t)); }
            catch (e) {
                // Bir nechta JSON qatorma-qator joylangan bo'lishi mumkin
                for (const qator of t.split(/\n+/)) {
                    const q = qator.trim();
                    if (!q.startsWith('{')) continue;
                    try { natijalar.push(JSON.parse(q)); } catch (e2) { xatolar.push("bir matn to'liq nusxalanmagan"); }
                }
                if (!natijalar.length && !xatolar.length && !Object.keys(guruhlar).length) xatolar.push("matnda natija topilmadi");
            }
        }
    }
    return { natijalar, xatolar };
}
