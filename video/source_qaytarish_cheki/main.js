/* ------------------------------------------------------------------
   001 Ijara — deterministic frame renderer (GSAP timeline + tick fn)
------------------------------------------------------------------- */
const FPS = 25, W = 1080, H = 1920;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const eOut = x => 1 - Math.pow(1 - clamp(x), 3);
const eIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/* inline <use> symbols so every icon can be animated on its own */
$$('svg use').forEach(u => {
  const sym = document.getElementById(u.getAttribute('href').slice(1));
  const svg = u.closest('svg');
  svg.setAttribute('viewBox', sym.getAttribute('viewBox'));
  svg.innerHTML = sym.innerHTML;
});

/* ---------------- camera (speaker) ---------------- */
const cam = { k: 0, tx: 540, ty: 500, s: 1, zoom: 1, cr: 1400, ccx: 540, ccy: 760, inset: 0, ringA: 0, tint: 0 };
const tl = gsap.timeline({ paused: true });
gsap.defaults({ ease: 'expo.out' });

const IRIS = { ccx: 552, ccy: 538 };
const CIRC = { cr: 220, ccx: 540, ccy: 570, tx: 540, ty: 585, s: .78 };
const SPLIT = { tx: 540, ty: 645, s: 1.03 };

function toA(t) {
  tl.set(cam, { ccx: IRIS.ccx, ccy: IRIS.ccy }, t);
  tl.to(cam, { cr: 0, duration: .55, ease: 'power3.in' }, t);
  tl.to(cam, { ringA: 1, duration: .12, ease: 'none' }, t);
  tl.to(cam, { ringA: 0, duration: .12, ease: 'none' }, t + .45);
}
function fromA(t) {
  tl.set(cam, { ccx: IRIS.ccx, ccy: IRIS.ccy, k: 0 }, t);
  tl.to(cam, { cr: 1650, duration: .7, ease: 'power3.inOut' }, t);
  tl.to(cam, { ringA: 1, duration: .1, ease: 'none' }, t);
  tl.to(cam, { ringA: 0, duration: .25, ease: 'none' }, t + .4);
}
function toC(t, fromSplit) {
  tl.to(cam, { ...CIRC, k: 1, inset: 0, duration: .75, ease: 'power3.inOut' }, t);
  tl.to(cam, { ringA: 1, duration: .4, ease: 'none' }, t + .2);
}
function fromC(t) {
  tl.to(cam, { cr: 1400, ccx: 540, ccy: 760, k: 0, duration: .75, ease: 'power3.inOut' }, t);
  tl.to(cam, { ringA: 0, duration: .3, ease: 'none' }, t);
}
function toB(t, panel) {
  tl.to(cam, { ...SPLIT, k: 1, inset: 960, duration: .65, ease: 'power3.inOut' }, t);
  tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: .65, ease: 'power3.inOut' }, t);
}
function fromB(t, panel) {
  tl.to(cam, { k: 0, inset: 0, duration: .6, ease: 'power3.inOut' }, t);
  tl.to(panel, { yPercent: 100, duration: .6, ease: 'power3.inOut' }, t);
}
const draw = (sel, t, d = .9, st = .06, ease = 'power2.inOut') =>
  tl.fromTo(sel, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, stagger: st, ease }, t);
const popIn = (sel, t, from = {}, d = .6, ease = 'back.out(1.6)') =>
  tl.fromTo(sel, { opacity: 0, scale: .6, ...from }, { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, filter: 'blur(0px)', duration: d, ease }, t);
const riseIn = (sel, t, d = .7, dy = 60) =>
  tl.fromTo(sel, { opacity: 0, y: dy, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: d }, t);
const out = (sel, t, to = {}, d = .3) => tl.to(sel, { opacity: 0, duration: d, ease: 'power2.in', ...to }, t);


/* ---------------- NAME CARD 0.3 → 10.3 ---------------- */
tl.fromTo('#nc', { opacity: 0, x: -90, filter: 'blur(14px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .9 }, .3);
tl.fromTo('#ncLogo', { scale: 0, rotation: -35 }, { scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.8)' }, .45);
tl.fromTo('#ncName', { yPercent: 115 }, { yPercent: 0, duration: .8 }, .6);
tl.fromTo('#ncRole', { yPercent: 115 }, { yPercent: 0, duration: .8 }, .75);
tl.fromTo('#ncRole i', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .7 }, 1.0);
tl.to(['#ncName', '#ncRole'], { yPercent: -115, duration: .45, ease: 'power3.in', stagger: .05 }, 9.75);
tl.to('#nc', { opacity: 0, x: -60, filter: 'blur(10px)', duration: .4, ease: 'power3.in' }, 9.95);

/* ================= VIDEO 7 : "Qaytarish cheki — biriktirish" ================= */
function toCfromA(t) {
  tl.set(cam, { ...CIRC, cr: 0, k: 1 }, t);
  tl.to(cam, { cr: CIRC.cr, duration: .65, ease: 'back.out(1.5)' }, t);
  tl.to(cam, { ringA: 1, duration: .3, ease: 'none' }, t + .05);
}
function toBfromC(t, panel) {
  tl.to(cam, { ...SPLIT, k: 1, inset: 960, cr: 1650, ccx: 540, ccy: 760, duration: .7, ease: 'power3.inOut' }, t);
  tl.to(cam, { ringA: 0, duration: .25, ease: 'none' }, t);
  tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'power3.inOut' }, t);
}

/* ---------- generated content ---------- */
const BN = [['Qaytarish', ''], ['chekini', ''], ['urasiz,', ''], ['lekin', ''], ['soliq', ''], ['hisobotida', ''], ['u', ''], ['ko‘rinmaydi.', 'bnE'], ['Sababi', ''], ['—', ''], ['bitta', 'bnC'], ['qadam', 'bnC'], ['tashlab', ''], ['ketilgan.', '']];
const bnEls = BN.map(([w, c]) => { const s = document.createElement('span'); s.textContent = w + ' '; if (c) s.className = c; $('#bnText').appendChild(s); return s; });

/* pseudo QR (decorative) */
{
  const c = $('#qrc').getContext('2d'), n = 25, u = 244 / n; let s = 12345;
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  c.fillStyle = '#fff'; c.fillRect(0, 0, 244, 244); c.fillStyle = '#0b1030';
  const finder = (x, y) => { c.fillRect(x * u, y * u, 7 * u, 7 * u); c.fillStyle = '#fff'; c.fillRect((x + 1) * u, (y + 1) * u, 5 * u, 5 * u); c.fillStyle = '#0b1030'; c.fillRect((x + 2) * u, (y + 2) * u, 3 * u, 3 * u); };
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    if (!inF && rnd() > .52) c.fillRect(x * u, y * u, u + .5, u + .5);
  }
  finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
}
const calEls = [];
for (let d = 1; d <= 15; d++) { const e = document.createElement('div'); e.className = 'cday' + (d === 10 ? ' dl' : ''); e.textContent = d; $('#c1Days').appendChild(e); calEls.push(e); }
const ROWS = [['№ 101', '09:14', '350 000', 1], ['№ 102', '10:02', '120 000', 0], ['№ 103', '11:47', '980 000', 1], ['№ 104', '13:25', '75 000', 1], ['№ 105', '15:08', '460 000', 0], ['№ 106', '16:40', '210 000', 1]];
const rowEls = ROWS.map(([n, tm, sm, ok]) => {
  const r = document.createElement('div'); r.className = 'crow ' + (ok ? 'ok' : 'bad');
  r.innerHTML = `<span class="mono" style="width:110px;font-weight:700">${n}</span><span class="mono" style="width:90px;color:#aab3de">${tm}</span><span class="mono" style="flex:1;font-weight:700">${sm}</span><span class="st">${ok ? 'Biriktirilgan' : 'Biriktirilmagan'}</span>`;
  $('#b2List').appendChild(r); return r;
});

/* speaker zoom — kept gentle so the head never slides under the banner */
tl.fromTo(cam, { zoom: 1 }, { zoom: 1.02, duration: 10.5, ease: 'none' }, 0);
tl.set(cam, { zoom: 1.0 }, 26.0);
tl.to(cam, { zoom: 1.02, duration: 3, ease: 'none' }, 26.1);

/* ---------------- BANNER (0.4 → end) ---------------- */
tl.fromTo('#banner', { opacity: 0, y: -60, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, .35);

/* ---------------- SIDE 1 3.7 → 8.0 ---------------- */
tl.fromTo('#rc1', { y: -560 }, { y: 0, duration: .9, ease: 'power2.out' }, 3.75);
tl.fromTo('#rcLink', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2.4)' }, 6.3);
popIn('#rcNo', 6.6, { y: 20 }, .5, 'back.out(2.2)');
tl.to('#rc1', { rotation: -3, duration: .2, ease: 'power2.out' }, 6.6);
tl.to('#rcWrap, #rcLink, #rcNo', { opacity: 0, x: 60, duration: .35, ease: 'power2.in' }, 7.85);

/* ---------------- SIDE 2 8.25 → 10.4 ---------------- */
tl.fromTo('#nt', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 8.3);
tl.fromTo('#ntCoin', { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: .6, ease: 'back.out(2)' }, 9.5);
out('#nt', 10.2, { x: 60, filter: 'blur(10px)' }, .3);

/* ---------------- A1 10.6 → 14.95 ---------------- */
toA(10.45);
riseIn('#a1Kick', 10.9, .5, 20);
popIn('#a1m1', 11.3, { y: 40 }, .6, 'back.out(1.6)');
popIn('#a1m2', 11.45, { y: 40 }, .6, 'back.out(1.6)');
tl.to('#a1m1', { boxShadow: '0 0 0 4px rgba(76,201,240,.9), 0 0 60px rgba(76,201,240,.5)', duration: .3, ease: 'none' }, 12.8);
tl.to('#a1m2', { opacity: .4, duration: .3, ease: 'none' }, 12.8);
tl.fromTo('#a1Phone', { opacity: 0, y: 200, rotation: 6 }, { opacity: 1, y: 0, rotation: 0, duration: .8 }, 12.9);
tl.fromTo('#a1Frame', { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .4 }, 13.3);
tl.fromTo('#a1Scan', { opacity: 0, y: 0 }, { keyframes: [{ opacity: 1, duration: .05 }, { y: 290, duration: .45, ease: 'power1.inOut' }, { y: 0, duration: .45, ease: 'power1.inOut' }, { opacity: 0, duration: .05 }] }, 13.45);
tl.fromTo('#a1Res', { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.2)' }, 14.45);
tl.fromTo('#a1t1', { scale: 1 }, { keyframes: [{ scale: 1.25, duration: .12 }, { scale: 1, duration: .3, ease: 'back.out(3)' }] }, 14.5);
tl.fromTo('#sA1', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.04, duration: .3, ease: 'power2.in', immediateRender: false }, 14.85);
toCfromA(15.0);

/* ---------------- C1 15.2 → 20.8 ---------------- */
riseIn('#c1Win', 15.4, .7, 60);
riseIn('#c1Cal', 15.6, .7, 60);
tl.fromTo('.cday', { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, stagger: .03, ease: 'back.out(2)' }, 15.8);
tl.fromTo('#c1Cur', { x: 560, y: 1700, opacity: 0 }, { opacity: 1, duration: .2, ease: 'none' }, 15.9);
tl.to('#c1Cur', { x: 470, y: 1020, duration: .5, ease: 'power2.inOut' }, 16.0);
tl.to('#f1', { borderColor: 'rgba(143,227,255,.9)', duration: .2, ease: 'none' }, 16.5);
tl.to('#c1Cur', { x: 350, y: 1215, duration: .5, ease: 'power2.inOut' }, 16.95);
tl.to('#c1Btn', { keyframes: [{ scale: .94, duration: .08 }, { scale: 1, duration: .15 }] }, 17.45);
popIn('#c1Ok', 17.6, { y: 20 }, .5, 'back.out(2.2)');
tl.to('#c1Cur', { x: 900, y: 1100, duration: .6, ease: 'power2.inOut' }, 18.0);
popIn('#c1Dl', 19.3, { y: 10 }, .5, 'back.out(2.4)');
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 20.75);

/* ---------------- B2 21.0 → 26.0 ---------------- */
toBfromC(20.8, '#b2Panel');
riseIn('#b2Cab', 21.05, .6, 50);
tl.fromTo('.crow', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .4, stagger: .07 }, 21.2);
tl.to('.crow.ok', { backgroundColor: 'rgba(67,97,238,.28)', borderColor: 'rgba(120,150,255,.9)', boxShadow: '0 0 30px rgba(67,97,238,.45)', duration: .3, stagger: .08, ease: 'none' }, 22.0);
tl.to('.crow.ok .st', { backgroundColor: '#4361ee', color: '#fff', duration: .3, ease: 'none' }, 22.0);
tl.to('.crow.bad', { backgroundColor: 'rgba(247,37,133,.22)', borderColor: 'rgba(247,37,133,.95)', boxShadow: '0 0 30px rgba(247,37,133,.45)', duration: .3, stagger: .1, ease: 'none' }, 23.4);
tl.to('.crow.bad .st', { backgroundColor: '#f72585', color: '#fff', duration: .3, ease: 'none' }, 23.4);
tl.to('.crow.ok', { opacity: .45, duration: .3, ease: 'none' }, 23.45);
tl.fromTo('#b2Lens', { opacity: 0, x: 700, y: 90 }, { opacity: 1, duration: .2, ease: 'none' }, 24.6);
tl.to('#b2Lens', { keyframes: [{ x: 540, y: 140, duration: .4, ease: 'power2.inOut' }, { x: 560, y: 460, duration: .5, ease: 'power2.inOut' }, { x: 520, y: 200, duration: .45, ease: 'power2.inOut' }] }, 24.7);
fromB(26.0, '#b2Panel');

/* ---------------- CTA ---------------- */
tl.fromTo('#cta', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 26.15);
tl.fromTo('#ctaSub', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .4 }, 27.0);
tl.to('#ctaSend', { keyframes: [{ scale: .82, duration: .1 }, { scale: 1.12, duration: .15 }, { scale: 1, duration: .2 }] }, 27.0);

tl.to({}, { duration: .01 }, 29.2);

/* ---------------- windows ---------------- */
const WIN = { sR1: [3.7, 8.3], sR2: [8.2, 10.6], sA1: [10.45, 15.2], sC1: [14.95, 21.1], sB2: [20.75, 26.8], sCTA: [26.1, 99] };
const SUB_HIDE = [[10.6, 14.95], [15.15, 20.8]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[20.95, 26.0]];
const SIZES = [2, 1, 2, 2, 3, 2, 2, 1, 1, 2, 3, 3, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1, 2, 1, 3, 1, 1];

function sceneTick(t, blink) {
  bnEls.forEach((s, i) => {
    const ta = .6 + i * .15, k = eOut((t - ta) / .35);
    s.style.opacity = k; s.style.filter = `blur(${(1 - k) * 8}px)`;
  });
  $('#f1v').textContent = t >= 16.5 ? '№ 1' : '';
  calEls.forEach((e, i) => {
    const d = i + 1, on = t >= 18.5 + i * .11 && d <= 10;
    e.style.background = d === 10 ? (t >= 19.3 ? 'linear-gradient(135deg,#f72585,#b5179e)' : 'rgba(247,37,133,.2)') : (on ? 'rgba(67,97,238,.55)' : 'rgba(255,255,255,.07)');
    e.style.color = on || (d === 10 && t >= 19.3) ? '#fff' : '#aab6ec';
    e.style.boxShadow = d === 10 && t >= 19.3 ? `0 0 ${16 + 14 * Math.sin(t * 8) ** 2}px rgba(247,37,133,.8)` : 'none';
  });
  typed($('#ctaTyped'), t, 26.3, 26.65, 'XIZMAT');
  $('#ctaPh').style.display = t >= 26.3 ? 'none' : '';
  $('#ctaCaret').style.opacity = t > 26.8 ? 0 : blink;
  for (const [id, [a, b]] of Object.entries(WIN)) $('#' + id).style.visibility = (t >= a && t < b) ? 'visible' : 'hidden';
  $('#nc').style.visibility = (t >= .25 && t < 10.5) ? 'visible' : 'hidden';
  $('#banner').style.visibility = t >= .3 ? 'visible' : 'hidden';
}

/* ---------------- subtitles ---------------- */
const groups = [];
{
  let i = 0;
  for (const n of SIZES) {
    const ws = WORDS.slice(i, i + n); i += n;
    const el = document.createElement('div');
    el.className = 'sg glass';
    const hl = document.createElement('div'); hl.className = 'hl'; el.appendChild(hl);
    const spans = ws.map(w => { const s = document.createElement('span'); s.className = 'sw'; s.textContent = w.w; el.appendChild(s); return s; });
    $('#subs').appendChild(el);
    groups.push({ el, hl, ws, spans, a: ws[0].a - .06, b: ws[ws.length - 1].b });
  }
  groups.forEach((g, j) => {
    const nx = groups[j + 1];
    g.end = Math.min(nx ? nx.a : 99, g.b + .55);
  });
}
function layoutSubs() {
  groups.forEach(g => {
    g.w = g.el.offsetWidth; g.h = g.el.offsetHeight;
    g.rects = g.spans.map(s => [s.offsetLeft - 14, s.offsetWidth + 28]);
  });
}
function subs(t) {
  const hide = inWin(t, SUB_HIDE);
  const yC = inWin(t, SPLIT_WIN) ? 960 : 1250;
  groups.forEach(g => {
    const on = !hide && t >= g.a && t < g.end;
    if (!on) { g.el.style.visibility = 'hidden'; return; }
    g.el.style.visibility = 'visible';
    const age = t - g.a, left = g.end - t;
    const pin = clamp(age / .22), pout = clamp(left / .1);
    const sc = .86 + .14 * (1 + 2.2 * Math.pow(pin - 1, 3) + 1.2 * Math.pow(pin - 1, 2)); // back-out
    g.el.style.opacity = Math.min(pin * 1.6, 1) * pout;
    g.el.style.filter = `blur(${(1 - pin) * 8}px)`;
    g.el.style.transform = `translate(-50%, ${yC - g.h / 2 + (1 - pin) * 26}px) scale(${sc})`;
    let k = 0; g.ws.forEach((w, i) => { if (t >= w.a) k = i; });
    const cur = g.rects[k], prev = g.rects[Math.max(0, k - 1)];
    const m = k === 0 ? 1 : eOut((t - g.ws[k].a) / .16);
    g.hl.style.left = lerp(prev[0], cur[0], m) + 'px';
    g.hl.style.width = lerp(prev[1], cur[1], m) + 'px';
    g.spans.forEach((s, i) => s.style.opacity = i <= k ? 1 : .55);
  });
}

if (SIZES.reduce((a,b)=>a+b,0)!==WORDS.length) console.log('SIZE MISMATCH', SIZES.reduce((a,b)=>a+b,0), WORDS.length);
/* ---------------- ambience ---------------- */
const dots = [];
for (let i = 0; i < 38; i++) {
  const d = document.createElement('div'); d.className = 'pt';
  const r = (i * 9301 + 49297) % 233280 / 233280, r2 = (i * 7919 + 1237) % 1000 / 1000, r3 = (i * 3571 + 17) % 997 / 997;
  dots.push({ d, x: r * W, y: r2 * 2000, sp: 20 + r3 * 60, sz: .4 + r3 * 1.1, ph: r * 6.28 });
  $('#dots').appendChild(d);
}
const gctx = $('#grain').getContext('2d');
const gimg = gctx.createImageData(640, 1140);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0;
  const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    const v = s & 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
  }
  gctx.putImageData(gimg, 0, 0);
  $('#grain').style.width = '1280px'; $('#grain').style.height = '2120px';
}

function counter(el, t, a, b, to) { const k = eOut((t - a) / (b - a)); el.textContent = fmt(to * k); }
function typed(el, t, a, b, str) { const n = Math.floor(clamp((t - a) / (b - a)) * str.length + (t >= b ? 0 : 0)); el.textContent = str.slice(0, t >= b ? str.length : n); }

function ambience(t, frame) {
  $('#b1').style.transform = `translate(${-120 + 160 * Math.sin(t * .31)}px, ${120 + 120 * Math.cos(t * .23)}px)`;
  $('#b2').style.transform = `translate(${520 + 140 * Math.cos(t * .27)}px, ${760 + 160 * Math.sin(t * .19)}px)`;
  $('#b3').style.transform = `translate(${200 + 200 * Math.sin(t * .17 + 1)}px, ${1300 + 140 * Math.cos(t * .29)}px)`;
  $('#floor').style.backgroundPosition = `0 ${t * 60}px`;
  dots.forEach(p => {
    const y = ((p.y - t * p.sp) % 2000 + 2000) % 2000 - 40;
    p.d.style.transform = `translate(${p.x + 30 * Math.sin(t * .6 + p.ph)}px, ${y}px) scale(${p.sz})`;
    p.d.style.opacity = .25 + .35 * Math.sin(t * 1.3 + p.ph) ** 2;
  });
  grain(frame);
  const blink = Math.floor(t * 2.6) % 2 ? 0 : 1;

  sceneTick(t, blink);
}

/* ---------------- speaker compositing ---------------- */
const FMEAN = FACE.reduce((a, f) => [a[0] + f[0] / FACE.length, a[1] + f[1] / FACE.length], [0, 0]);
function applyCam(frame) {
  const f = FACE[Math.min(frame, FACE.length - 1)];
  const fx = f[0], fy = f[1];
  const sc = lerp(cam.zoom, cam.s, cam.k);
  // in target modes keep half of the natural head motion so it still feels alive
  const px = lerp(fx, cam.tx + (fx - FMEAN[0]) * .45, cam.k);
  const py = lerp(fy, cam.ty + (fy - FMEAN[1]) * .45, cam.k);
  $('#v').style.transform = `translate(${px - sc * fx}px, ${py - sc * fy}px) scale(${sc})`;
  $('#spkCirc').style.clipPath = `circle(${Math.max(cam.cr, 0)}px at ${cam.ccx}px ${cam.ccy}px)`;
  $('#spkSplit').style.clipPath = `inset(0 0 ${cam.inset}px 0)`;
  const r = Math.max(cam.cr, 0) + 6;
  for (const id of ['#ring', '#ringGlow']) {
    const e = $(id);
    e.style.left = (cam.ccx - r) + 'px'; e.style.top = (cam.ccy - r) + 'px';
    e.style.width = e.style.height = 2 * r + 'px';
  }
  $('#ring').style.opacity = cam.ringA;
  $('#ringGlow').style.opacity = cam.ringA;
  $('#ring').style.transform = `rotate(${frame * 1.2}deg)`;
}

/* ---------------- public API ---------------- */
const img = $('#v');
window.renderFrame = async (frame) => {
  const t = frame / FPS;
  const src = `../frames/${String(frame + 1).padStart(4, '0')}.jpg`;
  if (!img.src.endsWith(src.slice(2))) { img.src = src; await img.decode().catch(() => { }); }
  tl.seek(t, false);
  ambience(t, frame);
  applyCam(frame);
  subs(t);
  return t;
};
window.ready = (async () => { await document.fonts.ready; layoutSubs(); return true; })();
