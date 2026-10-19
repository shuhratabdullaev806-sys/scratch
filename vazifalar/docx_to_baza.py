"""vazifalar/docx/*.docx fayllaridan vazifalar/baza.js ni yaratadi.

Ishlatish:  python vazifalar/docx_to_baza.py
Talab:      pip install python-docx

Har bir docx 2 qismdan iborat bo'lishi kerak:
  1-QISM: vazifalar (6–7 bo'lim)   2-QISM: yechimlar va javoblar kaliti
Bo'limlar "1. Ko'rgazmali masala" yoki "1-BO'LIM. KO'RGAZMALI MASALA" kabi yozilishi mumkin.
"""
import base64
import json
import re
import sys
from pathlib import Path

import docx
from docx.table import Table
from docx.text.paragraph import Paragraph

PAPKA = Path(__file__).resolve().parent
A = "['ʻʼ’`‘]"  # turli apostroflar
I = re.I

# Bo'lim raqami -> sarlavhada bo'lishi kerak bo'lgan kalit so'z.
BOLIM_SOZI = {
    1: rf"ko{A}rgazmali",
    2: r"test",
    3: r"muhokama",
    4: r"qisqa|mashq",
    5: r"amaliy",
    6: r"keys|tanqidiy",
    7: rf"test|o{A}tkazma|provodka",
}
BOLIM_NOMI = {1: 'masala', 2: 'test1', 3: 'muhokama', 4: 'mashqlar', 5: 'amaliy', 6: 'keyslar', 7: 'test2'}

BOSH = r"^\s*(?:[•\-–—]\s*)?"  # qator boshidagi belgi (•) bo'lishi mumkin
# "3.2." kabi bo'lim.raqam ko'rinishidagi raqamlash
ICHKI = r"[1-7]\.(\d+)\s*(?:-\s*javob\w*)?\s*[.:)]"
OXIRI = r"\w*(?:\s+yechimi)?\s*[.:)]?\s*"
ELEMENT_BOSHI = {
    'muhokama': BOSH + rf"(?:{ICHKI}|(\d+)\s*(?:-\s*(?:savol|javob)\w*(?:\s+javobi)?\s*[.:)]?|[.)]))\s*",
    'mashqlar': BOSH + rf"(?:{ICHKI}|(\d+)\s*-\s*(?:mashq|javob){OXIRI}|mashq\s+(\d+){OXIRI})",
    'amaliy': BOSH + rf"(?:{ICHKI}|(\d+)\s*-\s*(?:amaliy|masala|topshiriq|mashq|javob){OXIRI}|masala\s+(\d+){OXIRI})",
    'keyslar': BOSH + rf"(?:{ICHKI}|(\d+)\s*-\s*keys{OXIRI}|keys\s+(\d+){OXIRI})",
}
# Bir element tugab, boshqa turdagi element boshlanganini bildiradi (birlashgan bo'limlar uchun).
TOXTA = {
    'amaliy': BOSH + r"\d+\s*-\s*keys",
    'keyslar': BOSH + r"\d+\s*-\s*(?:amaliy|masala|topshiriq)",
}


def son(matn):
    return int(re.sub(r"\D", "", matn) or 0)


# ---------- docx ni o'qish ----------

def elementlar(fayl):
    """Hujjatni tartib bilan qaytaradi: ('p', qator) yoki ('t', [[katak, ...], ...])."""
    d = docx.Document(fayl)
    for el in d.element.body.iterchildren():
        teg = el.tag.split('}')[1]
        if teg == 'p':
            for qator in Paragraph(el, d).text.split('\n'):
                if qator.strip():
                    yield ('p', qator.strip())
        elif teg == 'tbl':
            qatorlar = []
            for r in Table(el, d).rows:
                kataklar = []
                for c in r.cells:
                    t = c.text.strip()
                    if not kataklar or kataklar[-1] != t:  # birlashtirilgan kataklar
                        kataklar.append(t)
                qatorlar.append(kataklar)
            yield ('t', qatorlar)


def bolim_sarlavhasi(matn, joriy, ikkinchi_qism):
    """Agar qator keyingi bo'lim sarlavhasi bo'lsa, uning raqamini qaytaradi."""
    if len(matn) > 200:
        return None
    m = re.match(rf"^\s*([1-7])\s*(-\s*BO{A}LIM\b\.?|\.)\s*(.*)$", matn, I)
    if not m:
        # Ba'zi hujjatlarda yechimlar sarlavhasi raqamsiz: "Test javoblari va tushuntirishlar"
        if ikkinchi_qism and joriy < 7 and len(matn) < 90 and re.match(r"^[A-Za-zʻ'’«]", matn) \
                and re.search(r"yechim|javob|kalit", matn, I) and not re.search(r"\d", matn) \
                and any(re.search(BOLIM_SOZI[n], matn, I) for n in BOLIM_SOZI):
            return joriy + 1
        return None
    n, bolim_soz, qolgan = int(m.group(1)), m.group(2) != '.', m.group(3)
    if not (joriy < n <= joriy + (2 if bolim_soz else 1)):
        return None
    if bolim_soz:
        return n
    if re.search(BOLIM_SOZI[n], qolgan[:90], I):
        return n
    if ikkinchi_qism and re.search(r"yechim|javob|kalit", qolgan[:90], I):
        return n
    return None


def yechim_bolimlari(sarlavha, n, test_bor):
    """2-qismdagi bo'lim qaysi vazifalarga tegishli ekanini sarlavhadagi so'zlardan aniqlaydi.
    Ba'zi hujjatlarda raqamlar 1-qismdagidan farq qiladi yoki ikki bo'lim birlashtirilgan."""
    if re.match(rf"^\s*\d\s*-\s*BO{A}LIM", sarlavha, I):
        return [BOLIM_NOMI[n]]
    s = sarlavha.lower()
    if n == 1 or re.search(rf"ko{A}rgazmali", s):
        return ['masala']
    if re.search(rf"test", s):
        return ['test2' if test_bor or re.search(rf"provodka|o{A}tkazma|7-bo{A}lim", s) else 'test1']
    nomlar = []
    if 'muhokama' in s:
        nomlar.append('muhokama')
    if re.search(r"amaliy|masala", s):
        nomlar.append('amaliy')
    elif re.search(r"mashq|moslik|moslashtir", s):
        nomlar.append('mashqlar')
    if re.search(r"keys|tanqidiy", s):
        nomlar.append('keyslar')
    return nomlar or [BOLIM_NOMI[n]]


def bolimlarga(elems, ikkinchi_qism):
    bolimlar, joriy, nomlar, kirish = {}, 0, [], []
    for tur, t in elems:
        if tur == 'p':
            n = bolim_sarlavhasi(t, joriy, ikkinchi_qism)
            if n:
                joriy = n
                nomlar = yechim_bolimlari(t, n, 'test1' in bolimlar) if ikkinchi_qism else [BOLIM_NOMI[n]]
                for nom in nomlar:
                    bolimlar.setdefault(nom, [])
                continue
        if joriy:
            for nom in nomlar:
                bolimlar[nom].append((tur, t))
        else:
            kirish.append((tur, t))
    return kirish, bolimlar


# ---------- yordamchilar ----------

def bloklar(elems):
    """Ketma-ket qatorlarni bitta paragrafga birlashtiradi; jadvallar alohida qoladi."""
    natija = []
    for tur, t in elems:
        if tur == 'p':
            if natija and 'p' in natija[-1]:
                natija[-1]['p'] += '\n' + t
            else:
                natija.append({'p': t})
        else:
            natija.append({'t': t})
    return natija


def matnga(elems):
    qismlar = []
    for tur, t in elems:
        qismlar.append(t if tur == 'p' else '\n'.join(' | '.join(q) for q in t))
    return '\n'.join(qismlar).strip()


def elementlarga_ajrat(elems, naqsh, toxta=None):
    """Bo'limni '1-mashq', '2-mashq' kabi elementlarga bo'ladi: (kirish, {n: [elems]})."""
    kirish, elementlar_, joriy = [], {}, None
    for tur, t in elems:
        if tur == 't' and len(t) == 1 and len(t[0]) == 1 and re.match(naqsh, t[0][0], I):
            tur, t = 'p', t[0][0]  # ramkaga olingan bitta katakli "1-KEYS: ..." matni
        if tur == 'p':
            if toxta and re.match(toxta, t, I):
                joriy = 'tashla'
                elementlar_.setdefault(joriy, [])
                continue
            m = re.match(naqsh, t, I)
            if m:
                n = int(next(g for g in m.groups() if g))
                if n not in elementlar_:
                    joriy = n
                    elementlar_[n] = []
                    qolgan = t[m.end():].strip()
                    if qolgan:
                        elementlar_[n].append(('p', qolgan))
                    continue
        (elementlar_[joriy] if joriy is not None else kirish).append((tur, t))
    elementlar_.pop('tashla', None)
    return kirish, elementlar_


def testlar(elems):
    savollar = []
    for tur, t in elems:
        if tur != 'p':
            continue
        v = re.match(r"^([A-Ea-e])\s*[).]\s*(.+)", t)
        s = re.match(r"^(\d+)\s*[.)]\s*(.+)", t)
        if v and savollar and not s:
            savollar[-1]['variantlar'].append({'harf': v.group(1).upper(), 'matn': v.group(2).strip()})
        elif s:
            savollar.append({'n': int(s.group(1)), 'savol': s.group(2).strip(), 'variantlar': []})
    return [s for s in savollar if len(s['variantlar']) >= 2]


def test_kaliti(elems):
    kalit = {}
    for tur, t in elems:
        if tur == 't':
            for q in t[1:]:
                if len(q) >= 2 and re.fullmatch(r"\d+", q[0].strip()):
                    h = re.match(r"^\s*([A-Ea-e])\b", q[1])
                    if h:
                        kalit.setdefault(int(q[0]), h.group(1).upper())
        else:
            m = re.match(rf"{BOSH}(\d+)\s*-\s*savol\W+to{A}g{A}ri javob\W+([A-E])\b", t, I)
            if m:
                kalit.setdefault(int(m.group(1)), m.group(2).upper())
            elif re.search(r"\d+\s*-\s*[A-E]\b\s*[|,;]", t):
                for n, h in re.findall(r"(\d+)\s*-\s*([A-E])\b", t):
                    kalit.setdefault(int(n), h)
    return kalit


def moslik_jadvali(elems):
    for tur, t in elems:
        if tur != 't' or len(t) < 3:
            continue
        atamalar, tariflar = [], []
        for q in t[1:]:
            if len(q) < 2:
                continue
            a = re.match(r"^\s*(\d+)\s*[.)]?\s*(.+)", q[0], re.S)
            h = re.match(r"^\s*([A-E])\s*[).]\s*(.+)", q[1], re.S)
            if a and h:
                atamalar.append(a.group(2).strip())
                tariflar.append({'harf': h.group(1), 'matn': h.group(2).strip()})
        if len(atamalar) >= 3 and len(atamalar) == len(t) - 1:
            tariflar.sort(key=lambda x: x['harf'])
            return {'atamalar': atamalar, 'tariflar': tariflar}
    return None


def moslik_kaliti(matn):
    return {int(n): h for n, h in re.findall(r"(?<!\d)([1-9])\s*[-—–]\s*([A-E])\b", matn)}


# ---------- provodkalar ----------

KOD = r"\d{4}"
SUMMA_RE = re.compile(r"\d{1,3}(?:[\s\u00a0.,]\d{3})+|\d+")


def summalar(matn):
    return [son(x) for x in SUMMA_RE.findall(matn) if son(x) >= 100]


def jadval_provodkalari(t):
    sarlavha = [k.lower() for k in t[0]]
    dt = next((i for i, k in enumerate(sarlavha) if re.search(r"debet|\bdt\b", k) and not re.search(r"kredit|\bkt\b", k)), None)
    kt = next((i for i, k in enumerate(sarlavha) if re.search(r"kredit|\bkt\b", k) and not re.search(r"debet|\bdt\b", k)), None)
    birga = next((i for i, k in enumerate(sarlavha) if re.search(r"provodka|o.tkazma|dt\s*/\s*kt|dt\s*[–-]\s*kt", k)), None)
    sm = next((i for i, k in enumerate(sarlavha) if 'summa' in k), None)
    if sm is None or (birga is None and (dt is None or kt is None)):
        return []
    natija = []
    for q in t[1:]:
        if len(q) != len(t[0]):
            continue
        if birga is not None and (dt is None or kt is None):
            d = re.findall(rf"Dt\s*({KOD})", q[birga]) or re.findall(KOD, q[birga].split('/')[0].split('Kt')[0])
            k = re.findall(rf"Kt\s*({KOD})", q[birga])
        else:
            d, k = re.findall(KOD, q[dt]), re.findall(KOD, q[kt])
        s = summalar(q[sm])
        if not d or not k or not s:
            continue
        # "0820 / 4410" | "6010" | "150 000 000 / 18 000 000" kabi murakkab o'tkazmalar
        juft = max(len(d), len(k))
        if len(s) != juft:
            continue
        for i in range(juft):
            natija.append({'dt': d[min(i, len(d) - 1)], 'kt': k[min(i, len(k) - 1)], 'summa': s[i]})
    return natija


# "Dt 1010 «Materiallar» Kt 6010 — 5 000 000 so'm". Dt va Kt orasida boshqa schyot bo'lsa (murakkab
# o'tkazma), u avtomatik tekshirilmaydi.
MATN_PROVODKA = re.compile(rf"Dt\s*({KOD})(?:\s*«[^»]*»)?\s*[,–—-]?\s*Kt\s*({KOD})(?:\s*«[^»]*»)?", I)
MATN_SUMMA = re.compile(r"(\d{1,3}(?:[\s\u00a0.,]\d{3})+|\d+(?:[.,]\d+)?)\s*(mlrd|mln)?", I)


def matn_summasi(qism):
    """Provodkadan keyingi matndan summani oladi: '— 20 × 10 000 = 200 000 so'm' → 200 000."""
    qism = re.sub(r"^\s*\([^)]*\)", '', qism)  # "Kt 6010 (yoki 6410) — ..." dagi izoh
    qism = re.split(r"\bDt\b|;|\.\s+(?=[A-Z])", qism)[0]
    if '=' in qism:
        qism = qism.rsplit('=', 1)[1]
    m = MATN_SUMMA.search(qism)
    if not m:
        return 0
    if m.group(2):
        kopaytma = 10**9 if m.group(2).lower() == 'mlrd' else 10**6
        return round(float(re.sub(r"[\s\u00a0]", '', m.group(1)).replace(',', '.')) * kopaytma)
    return son(m.group(1))


def provodkalar(elems):
    natija = []
    for tur, t in elems:
        if tur == 't':
            natija += jadval_provodkalari(t)
            continue
        for m in MATN_PROVODKA.finditer(t):
            summa = matn_summasi(t[m.end():])
            if summa >= 100:
                natija.append({'dt': m.group(1), 'kt': m.group(2), 'summa': summa})
    return natija


# ---------- asosiy ----------

def sarlavha_top(kirish):
    qatorlar = [re.sub(r"^MAVZU:\s*", '', t, flags=I) for tur, t in kirish
                if tur == 'p' and not re.match(r"^\s*1\s*-\s*QISM", t, I) and '|' not in t]
    for t in qatorlar:
        if re.match(r"^\d+\s*-\s*BOB", t, I):
            return t
    for t in qatorlar:
        harflar = [c for c in t if c.isalpha()]
        katta = sum(c.isupper() for c in harflar) / max(1, len(harflar))
        if katta > 0.8 and not re.search(r"RESPUBLIKASI|MAJMUA|TO.PLAMI|USLUBIY MANBA", t, I):
            return t
    return qatorlar[0] if qatorlar else ''


def docx_oqi(fayl):
    elems = list(elementlar(fayl))
    chegara = next((i for i, (tur, t) in enumerate(elems) if tur == 'p' and re.match(r"^\s*2\s*-\s*QISM", t, I)), None)
    if chegara is None:
        raise ValueError("'2-QISM' (yechimlar) topilmadi")
    kirish, b1 = bolimlarga(elems[:chegara], False)
    _, b2 = bolimlarga(elems[chegara + 1:], True)

    v = {'nomi': sarlavha_top(kirish)}
    v['masala'] = bloklar(b1.get('masala', []))
    v['test1'] = testlar(b1.get('test1', []))
    v['test2'] = testlar(b1.get('test2', []))

    _, muh = elementlarga_ajrat(b1.get('muhokama', []), ELEMENT_BOSHI['muhokama'])
    v['muhokama'] = [{'n': n, 'savol': matnga(e)} for n, e in muh.items()]

    _, mashq = elementlarga_ajrat(b1.get('mashqlar', []), ELEMENT_BOSHI['mashqlar'])
    v['moslik'] = moslik_jadvali(mashq.get(1, b1.get('mashqlar', [])))
    v['mashqlar'] = [{'n': n, 'bloklar': bloklar(e)} for n, e in mashq.items() if not (n == 1 and v['moslik'])]

    _, am = elementlarga_ajrat(b1.get('amaliy', []), ELEMENT_BOSHI['amaliy'], TOXTA['amaliy'])
    v['amaliy'] = [{'n': n, 'bloklar': bloklar(e)} for n, e in am.items()]

    kirish_k, ks = elementlarga_ajrat(b1.get('keyslar', []), ELEMENT_BOSHI['keyslar'], TOXTA['keyslar'])
    v['keyslar'] = [{'n': n, 'bloklar': bloklar(e)} for n, e in ks.items()] or \
        ([{'n': 1, 'bloklar': bloklar(kirish_k)}] if kirish_k else [])

    # ----- yechimlar -----
    _, muh_y = elementlarga_ajrat(b2.get('muhokama', []), ELEMENT_BOSHI['muhokama'])
    _, mashq_y = elementlarga_ajrat(b2.get('mashqlar', []), ELEMENT_BOSHI['mashqlar'])
    _, am_y = elementlarga_ajrat(b2.get('amaliy', []), ELEMENT_BOSHI['amaliy'], TOXTA['amaliy'])
    kirish_ky, ks_y = elementlarga_ajrat(b2.get('keyslar', []), ELEMENT_BOSHI['keyslar'], TOXTA['keyslar'])
    if not ks_y and kirish_ky:
        ks_y = {1: kirish_ky}

    kalit = {
        'test1': test_kaliti(b2.get('test1', [])),
        'test2': test_kaliti(b2.get('test2', [])),
        'moslik': moslik_kaliti(matnga(mashq_y.get(1, b2.get('mashqlar', [])))) if v['moslik'] else {},
        'masala_provodkalar': provodkalar(b2.get('masala', [])),
        'mashqlar': {n: {'yechim': matnga(e), 'provodkalar': provodkalar(e)} for n, e in mashq_y.items()},
        'amaliy': {n: {'yechim': matnga(e), 'provodkalar': provodkalar(e)} for n, e in am_y.items()},
        'namuna': {
            'masala': matnga(b2.get('masala', [])),
            'muhokama': {n: matnga(e) for n, e in muh_y.items()},
            'keyslar': {n: matnga(e) for n, e in ks_y.items()},
        },
    }
    if v['moslik']:
        kalit['mashqlar'].pop(1, None)

    # Qaysi topshiriqlarga provodka jadvali kerakligini o'quvchi qismiga belgilaymiz.
    v['masala_provodka'] = bool(kalit['masala_provodkalar'])
    for m in v['mashqlar']:
        m['provodka'] = bool(kalit['mashqlar'].get(m['n'], {}).get('provodkalar'))
    for m in v['amaliy']:
        m['provodka'] = bool(kalit['amaliy'].get(m['n'], {}).get('provodkalar'))
    return v, kalit


def hisobot(nomi, v, k):
    """Har bir fayl bo'yicha nimalar topilganini va muammolarni chiqaradi."""
    def kalitli(t):
        return sum(1 for s in v[t] if s['n'] in k[t])
    q = [f"test1 {kalitli('test1')}/{len(v['test1'])}"]
    if v['test2'] or k['test2']:
        q.append(f"test2 {kalitli('test2')}/{len(v['test2'])}")
    if v['moslik']:
        q.append(f"moslik {len(k['moslik'])}/{len(v['moslik']['atamalar'])}")
    q.append(f"muhokama {len(v['muhokama'])}/{len(k['namuna']['muhokama'])}")
    q.append(f"mashq {len(v['mashqlar'])}")
    q.append(f"amaliy {len(v['amaliy'])}/{len(k['amaliy'])}")
    q.append(f"keys {len(v['keyslar'])}/{len(k['namuna']['keyslar'])}")
    pr = len(k['masala_provodkalar']) + sum(len(x['provodkalar']) for x in list(k['mashqlar'].values()) + list(k['amaliy'].values()))
    q.append(f"provodka {pr}")
    muammo = []
    if not v['test1']:
        muammo.append("testlar topilmadi")
    for t in ('test1', 'test2'):
        yoq = [s['n'] for s in v[t] if s['n'] not in k[t]]
        if yoq:
            muammo.append(f"{t}: {yoq} savollarga kalit yo'q")
    if v['moslik'] and len(k['moslik']) != len(v['moslik']['atamalar']):
        muammo.append("moslik kaliti to'liq emas")
    belgi = '⚠️ ' if muammo else '✅'
    print(f"  {belgi} {nomi}: " + ', '.join(q) + (f"  ← {'; '.join(muammo)}" if muammo else ''))


def main():
    def tartib(f):
        m = re.match(r"\s*(\d+)", f.stem)
        return (int(m.group(1)) if m else 10**6, f.stem)
    fayllar = sorted((p for p in (PAPKA / 'docx').glob('*.docx') if not p.name.startswith('~$')), key=tartib)
    baza = []
    for f in fayllar:
        try:
            v, kalit = docx_oqi(f)
        except Exception as e:
            print(f"  ❌ {f.name}: o'qib bo'lmadi ({e})")
            continue
        raqam = re.match(r"\s*(\d+)", f.stem)
        v['raqam'] = int(raqam.group(1)) if raqam else None
        v['id'] = re.sub(r"[^0-9a-z]+", '-', f.stem.lower().replace('yechimi', '')).strip('-')
        hisobot(f.name, v, kalit)
        # Javoblar oddiy ko'z bilan o'qilmasligi uchun base64 qilinadi (kuchli himoya emas).
        v['k'] = base64.b64encode(json.dumps(kalit, ensure_ascii=False).encode()).decode()
        baza.append(v)

    js = ("// AVTOMATIK YARATILGAN — qo'lda o'zgartirmang.\n"
          "// Manba: vazifalar/docx/*.docx  →  python vazifalar/docx_to_baza.py\n"
          "window.VAZIFALAR_BAZASI = " + json.dumps(baza, ensure_ascii=False) + ";\n")
    (PAPKA / 'baza.js').write_text(js, encoding='utf-8')
    print(f"\nbaza.js yozildi: {len(baza)} ta mavzu")
    return 0 if baza or not fayllar else 1


if __name__ == '__main__':
    sys.exit(main())
