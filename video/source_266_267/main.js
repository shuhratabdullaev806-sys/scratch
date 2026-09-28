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

const IRIS = { ccx: 550, ccy: 544 };
const CIRC = { cr: 250, ccx: 540, ccy: 400, tx: 540, ty: 420, s: .88 };
const SPLIT = { tx: 540, ty: 470, s: 1.15 };

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

/* ================= VIDEO 5 : "266 va 267-moddalar — avtomobil QQS" ================= */
function toCfromA(t) {
  tl.set(cam, { ...CIRC, cr: 0, k: 1 }, t);
  tl.to(cam, { cr: CIRC.cr, duration: .65, ease: 'back.out(1.5)' }, t);
  tl.to(cam, { ringA: 1, duration: .3, ease: 'none' }, t + .05);
}
function toBfromC(t, panel) {
  tl.to(cam, { ...SPLIT, k: 1, inset: 960, cr: 1400, ccx: 540, ccy: 760, duration: .7, ease: 'power3.inOut' }, t);
  tl.to(cam, { ringA: 0, duration: .25, ease: 'none' }, t);
  tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'power3.inOut' }, t);
}

/* generated elements */
const coinEls = [];
for (let i = 0; i < 14; i++) {
  const c = document.createElement('div'); c.className = 'coin2';
  const col = i % 2, row = Math.floor(i / 2);
  c.style.left = (150 + col * 250 + (row % 2) * 8) + 'px';
  c.style.top = (310 - row * 36) + 'px';
  $('#a1Coins').appendChild(c); coinEls.push(c);
}
const DAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
const dayEls = DAYS.map(d => {
  const e = document.createElement('div'); e.className = 'day';
  e.innerHTML = `<span class="dn">${d}</span><div class="dm"></div><div class="dv"></div>`;
  $('#b1Days').appendChild(e); return e;
});

/* speaker zoom (talking-head parts) */
tl.fromTo(cam, { zoom: 1 }, { zoom: 1.03, duration: 5, ease: 'none' }, 0);
tl.to(cam, { zoom: 1.06, duration: .35 }, 5.3);
tl.to(cam, { zoom: 1.07, duration: 3.4, ease: 'none' }, 5.65);
tl.to(cam, { zoom: 1.02, duration: .4 }, 8.85);
tl.set(cam, { zoom: 1.02 }, 24.4);
tl.to(cam, { zoom: 1.07, duration: 2.8, ease: 'none' }, 24.5);
tl.set(cam, { zoom: 1.04 }, 33.0);
tl.to(cam, { zoom: 1.08, duration: 2.5, ease: 'none' }, 33.1);
tl.set(cam, { zoom: 1.0 }, 38.5);
tl.to(cam, { zoom: 1.05, duration: 1.5, ease: 'none' }, 38.6);

const chipIn = (s, t) => tl.fromTo(s, { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, t);

/* ---------------- CAR 0.25 → 4.9 ---------------- */
chipIn('#car', .3);
draw('#car .ln', .45, .9, .08);
tl.fromTo('#carRow', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .5 }, 2.4);
popIn('#carZ', 3.9, { x: -20 }, .5, 'back.out(2.4)');
out('#car', 4.8, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- NO DOCS 5.15 → 8.7 ---------------- */
chipIn('#nd', 5.15);
tl.fromTo('#nd1', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 5.3);
tl.fromTo('#nd2', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 6.4);
draw('#nd1 .ln', 5.35, .6, .06); draw('#nd2 .ln', 6.45, .6, .06);
tl.fromTo('#nd1 .nox', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2.6)' }, 5.95);
tl.fromTo('#nd2 .nox', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2.6)' }, 8.05);
out('#nd', 8.6, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- YOKI AKSINCHA 8.85 → 10.4 ---------------- */
chipIn('#ak', 8.85);
tl.fromTo('#akArr', { rotation: 0, transformOrigin: '50% 50%' }, { rotation: 180, duration: .7, ease: 'power3.inOut' }, 9.3);

/* ---------------- A1 10.4 → 13.7 ---------------- */
toA(10.3);
riseIn('#a1Kick', 10.65, .5, 20);
riseIn('#a1Docs', 10.7, .6, 60);
draw('#a1Docs .ln', 10.8, .6, .05);
tl.fromTo('#a1Docs .okb', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .4, stagger: .15, ease: 'back.out(2.6)' }, 10.95);
popIn('#a1Z', 11.35, { y: 20 }, .5, 'back.out(2.2)');
riseIn('#a1Money', 11.2, .6, 80);
tl.fromTo('.coin2', { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .3, stagger: .03, ease: 'power2.out' }, 11.3);
tl.fromTo('#a1Crack', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: .3, ease: 'power3.out' }, 12.5);
tl.to('.coin2', { y: 700, rotation: (i) => ((i * 37) % 80) - 40, opacity: 0, duration: .7, stagger: { each: .025, from: 'end' }, ease: 'power2.in' }, 12.6);
tl.fromTo('#a1Stamp', { opacity: 0, scale: 2.6, rotation: -24 }, { opacity: 1, scale: 1, rotation: -8, duration: .22, ease: 'power4.in' }, 12.9);
tl.fromTo('#sA1', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.05, duration: .35, ease: 'power2.in', immediateRender: false }, 13.55);
toCfromA(13.7);

/* ---------------- C1 13.8 → 17.1  Soliq kodeksi · IKKITA yo'l ---------------- */
popIn('#c1Book', 13.95, { y: 30 }, .6, 'back.out(1.8)');
draw('#c1Book .ln', 14.0, .7, .06);
draw('#c1Fork', 14.9, .8, 0, 'power2.inOut');
popIn('#c1Two', 14.95, { y: 20 }, .5, 'back.out(2.4)');
popIn('#c1b0', 15.55, { y: 40 }, .6, 'back.out(1.6)');
popIn('#c1b1', 15.7, { y: 40 }, .6, 'back.out(1.6)');
tl.fromTo('.c1b .qok', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .4, stagger: .12, ease: 'back.out(2.4)' }, 16.1);
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 16.95);

/* ---------------- B1 17.2 → 24.5  1-yo'l ---------------- */
toBfromC(17.0, '#b1Panel');
riseIn('#b1Head', 17.4, .6, 30);
tl.fromTo('#b1Q', { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.2)' }, 18.3);
riseIn('#b1Lab', 19.8, .5, 16);
tl.fromTo('.day', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .45, stagger: .06 }, 20.1);
dayEls.forEach((d, i) => {
  tl.fromTo(d.querySelector('.dv'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: .3, ease: 'back.out(2)' }, 20.65 + i * .2);
  tl.fromTo(d.querySelector('.dm'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: .3, ease: 'back.out(2)' }, 21.85 + i * .2);
});
riseIn('#b1Leg', 20.6, .5, 16);
fromB(24.45, '#b1Panel');

/* ---------------- chip 266 ---------------- */
chipIn('#k266', 24.7);
tl.fromTo('#k266 .kseal', { rotation: -90, scale: .5 }, { rotation: 0, scale: 1, duration: .8, ease: 'back.out(1.8)' }, 24.8);
out('#k266', 27.0, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- A2 27.3 → 33.2  2-yo'l ---------------- */
toA(27.2);
riseIn('#a2Kick', 27.6, .5, 20);
riseIn('#a2Card', 27.65, .7, 70);
draw('#a2Card .ln', 27.8, .7, .05);
tl.fromTo('#a2Bar', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .6 }, 27.9);
popIn('#a2Q', 28.4, { y: -30 }, .5, 'back.out(2.2)');
tl.to('#a2Q', { x: -126, duration: .45, ease: 'power3.inOut' }, 29.3);
tl.to('#a2Q', { borderRadius: '0 24px 24px 0', duration: .1, ease: 'none' }, 29.7);
tl.to('#a2Bar', { borderRadius: '24px 0 0 24px', duration: .1, ease: 'none' }, 29.7);
riseIn('#a2Sum', 29.8, .5, 16);
tl.fromTo('#a2Chain .chn, #a2Chain svg', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .4, stagger: .12 }, 30.35);
riseIn('#a2Save', 31.1, .6, 50);
draw('#a2Save .ln', 31.2, .7, .06);
tl.fromTo('#a2Papers', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .4 }, 32.1);
draw('#a2X', 32.5, .3, 0, 'power2.out');
tl.to('#a2Papers .ppr', { y: -60, x: (i) => (i - 1) * 90, rotation: (i) => (i - 1) * 30, opacity: 0, duration: .5, stagger: .05, ease: 'power2.in' }, 32.8);
popIn('#a2No', 32.7, { y: 20 }, .5, 'back.out(2.2)');
tl.fromTo('#sA2', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.05, duration: .3, ease: 'power2.in', immediateRender: false }, 33.1);
fromA(33.1);

/* ---------------- chip 267 ---------------- */
chipIn('#k267', 33.55);
tl.fromTo('#k267 .kseal', { rotation: -90, scale: .5 }, { rotation: 0, scale: 1, duration: .8, ease: 'back.out(1.8)' }, 33.9);
out('#k267', 35.3, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- C2 35.6 → 38.6 ---------------- */
toC(35.45);
popIn('#c2o0', 35.9, { y: 40 }, .6, 'back.out(1.6)');
popIn('#c2o1', 36.05, { y: 40 }, .6, 'back.out(1.6)');
tl.fromTo('#c2q0, #c2q1', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .4, stagger: .1, ease: 'back.out(2.6)' }, 36.4);
riseIn('#c2Ask', 37.25, .6, 40);
tl.fromTo('#sC2', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 38.5);
fromC(38.5);

/* ---------------- CTA ---------------- */
tl.fromTo('#cta', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 38.55);
tl.to('#ctaSend', { keyframes: [{ scale: .82, duration: .08 }, { scale: 1.12, duration: .12 }, { scale: 1, duration: .15 }] }, 39.6);

tl.to({}, { duration: .01 }, 40.2);

/* ---------------- windows ---------------- */
const WIN = { sCar: [.25, 5.15], sNo: [5.1, 8.95], sAks: [8.8, 10.9], sA1: [10.3, 13.95], sC1: [13.6, 17.3], sB1: [16.9, 25.2],
  sK266: [24.6, 27.4], sA2: [27.2, 33.5], sK267: [33.4, 35.7], sC2: [35.4, 38.9], sCTA: [38.5, 99] };
const SUB_HIDE = [[10.4, 17.05], [27.3, 33.15], [35.55, 38.6]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[17.05, 24.5]];
const SIZES = [2, 2, 1, 2, 2, 1, 3, 1, 1, 2, 2, 2, 2, 1, 2, 2, 1, 3, 2, 2, 2, 3, 2, 1, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 2];

function sceneTick(t, blink) {
  let n = 0;
  dayEls.forEach((d, i) => { if (t >= 20.8 + i * .2) n++; if (t >= 22.0 + i * .2) n++; });
  $('#b1Cnt').textContent = n + ' hujjat';
  typed($('#ctaTyped'), t, 39.1, 39.45, 'XIZMAT');
  $('#ctaPh').style.display = t >= 39.1 ? 'none' : '';
  $('#ctaCaret').style.opacity = t > 39.55 ? 0 : blink;
  for (const [id, [a, b]] of Object.entries(WIN)) $('#' + id).style.visibility = (t >= a && t < b) ? 'visible' : 'hidden';
  $('#nc').style.visibility = (t >= .25 && t < 10.5) ? 'visible' : 'hidden';
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
