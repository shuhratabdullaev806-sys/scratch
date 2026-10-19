// Har bir modul localStorage'da qaysi kalitlar bilan saqlaydi.
// Kalit = prefix + o'quvchi ismi (masalan: 'kassa_history_Aliyev Vali').
const MODULLAR = [
    { id: 'trenajyor', nomi: 'Buxgalteriya Trenajyori', prefixlar: ['trenajyor_data_'] },
    { id: 'simulyator', nomi: 'Buxgalteriya Simulyatori', prefixlar: ['sim_data_'] },
    { id: 'kassa', nomi: 'Kassa Tizimi', prefixlar: ['kassa_history_'] },
    { id: 'bank', nomi: 'Bank Tizimi', prefixlar: ['bank_transactions_', 'bank_counterparties_', 'bank_balance_'] },
    { id: 'fifo', nomi: 'Ombor (FIFO)', prefixlar: ['ombor_materials_fifo_', 'ombor_history_fifo_', 'ombor_materials_', 'ombor_history_'] },
    { id: 'aveco', nomi: 'Ombor (AVECO)', prefixlar: ['ombor_materials_aveco_', 'ombor_history_aveco_'] },
    { id: 'kadrlar', nomi: 'Kadrlar', prefixlar: ['k_employees_', 'k_shtat_', 'k_tabel_', 'k_payrolls_'] },
    { id: 'safari', nomi: 'Xizmat Safari', prefixlar: ['safari_trips_', 'safari_employees_', 'safari_expenses_'] },
    { id: 'av', nomi: 'Asosiy Vositalar', prefixlar: ['av_assets_', 'av_logs_'] },
    { id: 'na', nomi: 'Nomoddiy Aktivlar', prefixlar: ['na_assets_', 'na_logs_'] },
    { id: 'debitor', nomi: 'Debitorlar', prefixlar: ['debitor_clients_', 'debitor_invoices_', 'debitor_payments_'] },
    { id: 'kreditor', nomi: 'Kreditorlar', prefixlar: ['kred_vendors_', 'kred_txs_', 'kred_employees_', 'kred_proxies_'] },
    { id: 'mfg', nomi: 'Ishlab Chiqarish', prefixlar: ['mfg_materials_', 'mfg_history_'] },
    { id: 'soliq', nomi: 'Soliq', prefixlar: ['soliq_reports_multi_'] },
    { id: 'bk', nomi: 'Bosh Kitob (Jurnal)', prefixlar: ['b_journal_'] },
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
