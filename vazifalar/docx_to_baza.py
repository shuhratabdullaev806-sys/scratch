"""vazifalar/docx/*.docx fayllaridan vazifalar/baza.js ni yaratadi.

Ishlatish:  python vazifalar/docx_to_baza.py
Talab:      pip install python-docx

Har bir docx 2 qismdan iborat bo'lishi kerak:
  1-QISM: vazifalar (7 bo'lim)   2-QISM: yechimlar va javoblar kaliti
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
APOS = "['ʻʼ’`‘]"

BOLIMLAR = [
    ('masala', rf"Ko{APOS}rgazmali masala"),
    ('test1', rf"O{APOS}z-o{APOS}zini tekshirish"),
    ('muhokama', r"Muhokama savollari"),
    ('mashqlar', r"Qisqa mashqlar"),
    ('amaliy', r"Amaliy mashqlar"),
    ('keyslar', r"Tanqidiy fikrlash"),
]

PROVODKA_RE = re.compile(r"Dt\s*(\d{4})\s*(?:\([^)]*\))?\s*Kt\s*(\d{4})[^\d\n]{0,40}?(\d[\d\s .,]*\d)\s*so", re.I)


def son(matn):
    return int(re.sub(r"\D", "", matn) or 0)


def elementlar(fayl):
    d = docx.Document(fayl)
    for el in d.element.body.iterchildren():
        teg = el.tag.split('}')[1]
        if teg == 'p':
            t = Paragraph(el, d).text.strip()
            if t:
                yield ('p', t)
        elif teg == 'tbl':
            jadval = Table(el, d)
            qatorlar = []
            for r in jadval.rows:
                kataklar = []
                for c in r.cells:
                    t = c.text.strip()
                    if not kataklar or kataklar[-1] != t:  # birlashtirilgan kataklarni bir marta olamiz
                        kataklar.append(t)
                qatorlar.append(kataklar)
            yield ('t', qatorlar)


def bolim_turi(matn, ikkinchi_test=False):
    m = re.match(r"^([1-7])\.\s+(.*)", matn)
    if not m:
        return None
    raqam, qolgan = m.group(1), m.group(2)
    if raqam == '7' and re.match(BOLIMLAR[1][1], qolgan):
        return 'test2'
    for kalit, naqsh in BOLIMLAR:
        if re.match(naqsh, qolgan):
            return kalit
    return None


def testlarni_ajrat(elems):
    savollar = []
    for tur, t in elems:
        if tur != 'p':
            continue
        v = re.match(r"^([A-E])\)\s*(.*)", t, re.S)
        s = re.match(r"^(\d+)\.\s*(.*)", t, re.S)
        if v and savollar:
            savollar[-1]['variantlar'].append({'harf': v.group(1), 'matn': v.group(2).strip()})
        elif s:
            savollar.append({'n': int(s.group(1)), 'savol': s.group(2).strip(), 'variantlar': []})
    return savollar


def bolaklarga(matn, naqsh):
    """'1-Keys: ... 2-Keys: ...' kabi matnni raqam bo'yicha bo'laklaydi."""
    qismlar = re.split(naqsh, matn)
    natija = {}
    for i in range(1, len(qismlar) - 1, 2):
        natija[int(qismlar[i])] = qismlar[i + 1].strip()
    return natija


def provodkalar(matn):
    return [{'dt': a, 'kt': b, 'summa': son(c)} for a, b, c in PROVODKA_RE.findall(matn)]


def kalit_ajrat(matn):
    return {int(n): h for n, h in re.findall(r"(\d+)\s*-\s*([A-E])\b", matn)}


def birinchi_qism(elems):
    bolim, guruh = None, {}
    sarlavha, izoh = None, None
    for tur, t in elems:
        if tur == 'p':
            b = bolim_turi(t)
            if b:
                bolim = b
                guruh[b] = []
                continue
            if bolim is None:
                if sarlavha is None:
                    sarlavha = t
                elif izoh is None and not t.startswith('1-QISM'):
                    izoh = t
                continue
        if bolim:
            guruh[bolim].append((tur, t))

    vazifa = {'nomi': sarlavha, 'izoh': izoh}
    vazifa['masala'] = '\n'.join(t for tur, t in guruh.get('masala', []) if tur == 'p')
    vazifa['test1'] = testlarni_ajrat(guruh.get('test1', []))
    vazifa['test2'] = testlarni_ajrat(guruh.get('test2', []))
    vazifa['muhokama'] = [
        {'n': int(m.group(1)), 'savol': m.group(2).strip()}
        for tur, t in guruh.get('muhokama', []) if tur == 'p'
        for m in [re.match(r"^(\d+)\.\s*(.*)", t, re.S)] if m
    ]

    moslik, mashqlar = None, []
    for tur, t in guruh.get('mashqlar', []):
        if tur == 't' and moslik is None:
            atamalar, tariflar = [], []
            for q in t[1:]:
                if len(q) < 2:
                    continue
                atamalar.append(re.sub(r"^\d+\.\s*", '', q[0]))
                h = re.match(r"^([A-E])\)\s*(.*)", q[1], re.S)
                if h:
                    tariflar.append({'harf': h.group(1), 'matn': h.group(2).strip()})
            moslik = {'atamalar': atamalar, 'tariflar': tariflar}
        elif tur == 'p':
            for n, m in bolaklarga(t, r"Mashq\s+(\d+)\.").items():
                if n != 1:  # 1-mashq — moslashtirish jadvali
                    mashqlar.append({'n': n, 'matn': m})
    vazifa['moslik'] = moslik
    vazifa['mashqlar'] = mashqlar

    vazifa['amaliy'] = []
    for tur, t in guruh.get('amaliy', []):
        if tur == 'p':
            for n, m in bolaklarga(t, r"(\d+)-amaliy topshiriq").items():
                vazifa['amaliy'].append({'n': n, 'matn': m.lstrip(':').strip()})
    vazifa['keyslar'] = []
    for tur, t in guruh.get('keyslar', []):
        if tur == 'p':
            for n, m in bolaklarga(t, r"(\d+)-Keys").items():
                vazifa['keyslar'].append({'n': n, 'matn': m.lstrip(':').strip()})
    return vazifa


def ikkinchi_qism(elems):
    yechim = {'masala_matn': [], 'masala_provodkalar': [], 'masala_jadvallar': []}
    bolim = None
    for tur, t in elems:
        if tur == 'p':
            b = bolim_turi(t)
            if b:
                bolim = b
            if bolim == 'masala':
                yechim['masala_matn'].append(t)
            elif bolim == 'test1':
                yechim['test1'] = kalit_ajrat(t.split(':', 1)[-1])
            elif bolim == 'test2':
                yechim['test2'] = kalit_ajrat(t.split(':', 1)[-1].split('Izohlar')[0])
                izohlar = t.split('Izohlar:', 1)
                if len(izohlar) == 2:
                    yechim['test2_izoh'] = izohlar[1].strip()
            elif bolim == 'muhokama':
                yechim['muhokama'] = bolaklarga(t, r"(\d+)-savol javobi:")
            elif bolim == 'mashqlar':
                mos = re.search(r"Moslik kaliti:([^\n]*)", t)
                yechim['moslik'] = kalit_ajrat(mos.group(1)) if mos else {}
                yechim['mashqlar'] = bolaklarga(t, r"Mashq\s+(\d+)\s+yechimi:")
            elif bolim == 'amaliy':
                yechim['amaliy'] = bolaklarga(t, r"(\d+)-amaliy topshiriq yechimi:")
            elif bolim == 'keyslar':
                yechim['keyslar'] = bolaklarga(t, r"(\d+)-Keys yechimi:")
        elif bolim == 'masala':
            if t and any('Debet' in k or 'Dt' in k for k in t[0]):
                for q in t[1:]:
                    if len(q) >= 3 and re.fullmatch(r"\d{4}", q[0]) and re.fullmatch(r"\d{4}", q[1]):
                        yechim['masala_provodkalar'].append({'dt': q[0], 'kt': q[1], 'summa': son(q[2]), 'izoh': q[3] if len(q) > 3 else ''})
            else:
                yechim['masala_jadvallar'].append(t)
    yechim['masala_matn'] = '\n'.join(yechim['masala_matn'])
    return yechim


def docx_oqi(fayl):
    elems = list(elementlar(fayl))
    chegara = next((i for i, (tur, t) in enumerate(elems) if tur == 'p' and t.startswith('2-QISM')), None)
    if chegara is None:
        raise ValueError("'2-QISM' (yechimlar) topilmadi")
    v = birinchi_qism(elems[:chegara])
    y = ikkinchi_qism(elems[chegara + 1:])

    # O'quvchiga ko'rinadigan qism va javoblar kaliti alohida saqlanadi.
    kalit = {
        'test1': y.get('test1', {}),
        'test2': y.get('test2', {}),
        'moslik': y.get('moslik', {}),
        'masala_provodkalar': y['masala_provodkalar'],
        'mashqlar': {n: {'yechim': m, 'provodkalar': provodkalar(m)} for n, m in y.get('mashqlar', {}).items() if n != 1},
        'amaliy': {n: {'yechim': m, 'provodkalar': provodkalar(m)} for n, m in y.get('amaliy', {}).items()},
        'namuna': {
            'masala': y['masala_matn'],
            'masala_jadvallar': y['masala_jadvallar'],
            'muhokama': y.get('muhokama', {}),
            'keyslar': y.get('keyslar', {}),
            'test2_izoh': y.get('test2_izoh', ''),
        },
    }
    # Qaysi topshiriqlarga provodka jadvali kerakligini o'quvchi qismiga belgilaymiz.
    v['masala_provodka_soni'] = len(kalit['masala_provodkalar'])
    for m in v['mashqlar']:
        m['provodka'] = bool(kalit['mashqlar'].get(m['n'], {}).get('provodkalar'))
    for m in v['amaliy']:
        m['provodka'] = bool(kalit['amaliy'].get(m['n'], {}).get('provodkalar'))
    return v, kalit


def tekshir(nomi, v, kalit):
    ogohlar = []
    for t in ('test1', 'test2'):
        if len(v[t]) == 0:
            ogohlar.append(f"{t}: savollar topilmadi")
        for s in v[t]:
            if s['n'] not in kalit[t]:
                ogohlar.append(f"{t} {s['n']}-savol: javob kaliti yo'q")
            if len(s['variantlar']) < 2:
                ogohlar.append(f"{t} {s['n']}-savol: variantlar topilmadi")
    if v['moslik'] and len(kalit['moslik']) != len(v['moslik']['atamalar']):
        ogohlar.append("moslik: kalit soni atamalar soniga teng emas")
    if not kalit['masala_provodkalar']:
        ogohlar.append("masala: provodkalar jadvali topilmadi")
    for o in ogohlar:
        print(f"  ⚠️  {nomi}: {o}")


def main():
    fayllar = sorted((PAPKA / 'docx').glob('*.docx'))
    baza = []
    for f in fayllar:
        if f.name.startswith('~$'):
            continue
        try:
            v, kalit = docx_oqi(f)
        except Exception as e:
            print(f"  ❌ {f.name}: o'qib bo'lmadi ({e})")
            continue
        v['id'] = f.stem
        tekshir(f.name, v, kalit)
        # Javoblar oddiy ko'z bilan o'qilmasligi uchun base64 qilinadi (kuchli himoya emas).
        v['k'] = base64.b64encode(json.dumps(kalit, ensure_ascii=False).encode()).decode()
        baza.append(v)
        print(f"  ✅ {f.name}: {v['nomi']}")

    js = ("// AVTOMATIK YARATILGAN — qo'lda o'zgartirmang.\n"
          "// Manba: vazifalar/docx/*.docx  →  python vazifalar/docx_to_baza.py\n"
          "window.VAZIFALAR_BAZASI = " + json.dumps(baza, ensure_ascii=False, indent=1) + ";\n")
    (PAPKA / 'baza.js').write_text(js, encoding='utf-8')
    print(f"\nbaza.js yozildi: {len(baza)} ta mavzu")
    return 0 if baza or not fayllar else 1


if __name__ == '__main__':
    sys.exit(main())
