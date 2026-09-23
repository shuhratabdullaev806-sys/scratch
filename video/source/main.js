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

const IRIS = { ccx: 520, ccy: 740 };
const CIRC = { cr: 250, ccx: 540, ccy: 400, tx: 540, ty: 418, s: 1.06 };
const SPLIT = { tx: 540, ty: 470, s: 1.12 };

function toA(t) {
  tl.set(cam, { ccx: IRIS.ccx, ccy: IRIS.ccy }, t);
  tl.to(cam, { cr: 0, duration: .55, ease: 'power3.in' }, t);
  tl.to(cam, { ringA: 1, duration: .12, ease: 'none' }, t);
  tl.to(cam, { ringA: 0, duration: .12, ease: 'none' }, t + .45);
}
function fromA(t) {
  tl.set(cam, { ccx: IRIS.ccx, ccy: IRIS.ccy, k: 0 }, t);
  tl.to(cam, { cr: 1400, duration: .7, ease: 'power3.inOut' }, t);
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

/* speaker zoom choreography for talking-head parts */
tl.fromTo(cam, { zoom: 1 }, { zoom: 1.045, duration: 7.5, ease: 'none' }, 0);
tl.to(cam, { zoom: 1.16, duration: .35, ease: 'expo.out' }, 7.62);
tl.to(cam, { zoom: 1.19, duration: 2.5, ease: 'none' }, 7.97);
tl.set(cam, { zoom: 1.06 }, 13.0);
tl.to(cam, { zoom: 1.08, duration: .6, ease: 'none' }, 13.85);
tl.set(cam, { zoom: 1.0 }, 18.4);
tl.to(cam, { zoom: 1.06, duration: 3.2, ease: 'none' }, 18.5);
tl.set(cam, { zoom: 1.1 }, 26.3);
tl.to(cam, { zoom: 1.13, duration: 2.6, ease: 'none' }, 26.4);
tl.set(cam, { zoom: 1.08 }, 32.3);
tl.to(cam, { zoom: 1.12, duration: 2, ease: 'none' }, 32.4);
tl.set(cam, { zoom: 1.0 }, 42.9);
tl.to(cam, { zoom: 1.07, duration: 3.8, ease: 'none' }, 43.0);

/* ---------------- NAME CARD 0.3 → 10.3 ---------------- */
tl.fromTo('#nc', { opacity: 0, x: -90, filter: 'blur(14px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .9 }, .3);
tl.fromTo('#ncLogo', { scale: 0, rotation: -35 }, { scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.8)' }, .45);
tl.fromTo('#ncName', { yPercent: 115 }, { yPercent: 0, duration: .8 }, .6);
tl.fromTo('#ncRole', { yPercent: 115 }, { yPercent: 0, duration: .8 }, .75);
tl.fromTo('#ncRole i', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .7 }, 1.0);
tl.to(['#ncName', '#ncRole'], { yPercent: -115, duration: .45, ease: 'power3.in', stagger: .05 }, 9.75);
tl.to('#nc', { opacity: 0, x: -60, filter: 'blur(10px)', duration: .4, ease: 'power3.in' }, 9.95);

/* ---------------- HOOK chip 0.85 → 7.35 ---------------- */
tl.fromTo('#hk', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, .85);
draw('#hk .ln', .95, .9, .07);
tl.fromTo('#hkStrike', { scaleX: 0 }, { scaleX: 1, duration: .4 }, 6.25);
popIn('#hkNo', 6.4, { rotation: -14 });
tl.to('#hk svg, #hk .mono', { opacity: .35, duration: .3, ease: 'none' }, 6.35);
out('#hk', 7.1, { y: -50, filter: 'blur(10px)' }, .35);

/* ---------------- A1  10.5 → 13.85  "001-schyotda bu aktiv yo‘q" ---------------- */
toA(10.45);
tl.fromTo('#a1Big', { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 1.6 }, 10.85);
riseIn('#a1Kick', 10.95, .6, 20);
draw('#a1MachSvg .ln', 10.8, 1.0, .07);
tl.fromTo('#a1Mach', { y: 30 }, { y: 0, duration: 1.2 }, 10.8);
popIn('#a1Tag', 11.25, { y: 20 });
tl.fromTo('#a1Arrow', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: .5 }, 11.45);
tl.fromTo('#a1Card', { opacity: 0, y: 140, rotationX: 30, transformPerspective: 1400 }, { opacity: 1, y: 0, rotationX: 0, duration: .9 }, 11.3);
tl.fromTo('#a1Scan', { y: -130, opacity: 1 }, { y: 560, duration: .9, ease: 'power1.inOut' }, 11.95);
tl.to('#a1Scan', { opacity: 0, duration: .15, ease: 'none' }, 12.8);
tl.fromTo('#a1RowM', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .4 }, 12.45);
tl.fromTo('#a1Tot', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 12.75);
tl.to('#a1Mach', { opacity: .28, filter: 'grayscale(1) blur(1px)', duration: .4, ease: 'none' }, 13.3);
tl.to('#a1Tag', { opacity: .35, duration: .4, ease: 'none' }, 13.3);
tl.fromTo('#a1Stamp', { opacity: 0, scale: 2.6, rotation: -22 }, { opacity: 1, scale: 1, rotation: -8, duration: .22, ease: 'power4.in' }, 13.42);
tl.fromTo('#a1Card', { x: 0 }, { keyframes: [{ x: -14, duration: .04 }, { x: 12, duration: .05 }, { x: -7, duration: .05 }, { x: 0, duration: .06 }], ease: 'none', immediateRender: false }, 13.64);
tl.fromTo('#a1Burst', { opacity: 0, width: 10, height: 10, x: 0, y: 0 }, { keyframes: [{ opacity: 1, duration: .01 }, { width: 760, height: 760, x: -375, y: -375, opacity: 0, duration: .6, ease: 'power2.out' }] }, 13.64);
tl.fromTo('#sA1', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.06, duration: .4, ease: 'power2.in', immediateRender: false }, 14.05);
fromA(14.05);

/* ---------------- B1  14.45 → 18.55  "21-sonli BHMS aniq aytgan" ---------------- */
toB(14.05, '#b1Panel');
tl.fromTo('#b1Doc', { opacity: 0, y: 90, rotationX: 24, rotationY: -16, transformPerspective: 1600 }, { opacity: 1, y: 0, rotationX: 0, rotationY: 0, duration: 1.1 }, 14.65);
popIn('#b1Seal', 14.9, { rotation: -60 }, .8);
tl.fromTo('#b1Doc .skel', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .8, stagger: .1 }, 15.3);
tl.fromTo('#b1Hl', { scaleX: 0 }, { scaleX: 1, duration: .55, ease: 'power2.inOut' }, 17.45);
popIn('#b1Badge', 17.95, { rotation: 10, y: 20 });
fromB(18.45, '#b1Panel');

/* ---------------- C1  21.6 → 26.5  "bino, uskuna, avtomobil — 001-schyotga kirim" ---------------- */
toC(21.55);
['#c1t0', '#c1t1', '#c1t2'].forEach((s, i) => {
  const t = [21.98, 22.34, 22.95][i];
  popIn(s, t, { y: 90, filter: 'blur(12px)' }, .6, 'back.out(1.4)');
  draw(s + ' .ln', t + .05, .8, .05);
});
riseIn('#c1Vault', 23.45, .8, 110);
draw('#c1p0, #c1p1, #c1p2', 24.3, .45, .1, 'power2.out');
tl.to('#c1t0, #c1t1, #c1t2', { y: 560, scale: .28, opacity: 0, duration: .6, stagger: .12, ease: 'power3.in' }, 24.4);
tl.to('#c1Paths', { opacity: 0, duration: .4, ease: 'none' }, 25.15);
tl.fromTo('.c1s', { opacity: 0, scale: .4, y: -40 }, { opacity: 1, scale: 1, y: 0, duration: .5, stagger: .12, ease: 'back.out(2)' }, 24.9);
popIn('#c1Kirim', 25.2, { rotation: -14 }, .6, 'back.out(2.2)');
tl.fromTo('#c1Flash', { opacity: 0 }, { keyframes: [{ opacity: 1, duration: .12 }, { opacity: 0, duration: .8, ease: 'power2.out' }] }, 25.22);
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .35, ease: 'power2.in', immediateRender: false }, 26.2);
fromC(26.25);

/* ---------------- Contract chip 26.9 → 29.0  "Shartnomaviy qiymat bo‘yicha" ---------------- */
tl.fromTo('#kc', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 26.9);
draw('#kSig', 28.15, .5, 0, 'power1.inOut');
out('#kc', 28.7, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- A2  29.0 → 32.5  "Debet 001, ikkiyoqlama yozuvsiz" ---------------- */
toA(28.85);
riseIn('#a2Kick', 29.3, .6, 20);
tl.fromTo('#a2Title', { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .8 }, 29.1);
draw('#a2T', 29.15, .8, 0);
riseIn('#a2DebH', 29.25, .6, 24);
riseIn('#a2KrH', 29.35, .6, 24);
tl.fromTo('#a2DebBg', { opacity: 0, scaleY: 0, transformOrigin: '50% 0' }, { opacity: 1, scaleY: 1, duration: .8 }, 29.4);
tl.to('#a2DebH', { color: '#8fe3ff', textShadow: '0 0 26px rgba(76,201,240,.9)', duration: .3, ease: 'none' }, 29.4);
tl.fromTo('#a2Amt', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5 }, 29.5);
tl.fromTo('#a2AmtS', { opacity: 0 }, { opacity: 1, duration: .4 }, 30.1);
tl.fromTo('#a2Link', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 30.35);
popIn('#a2Ghost', 30.5, { y: 10 });
draw('#a2Xp', 31.42, .3, 0, 'power2.out');
tl.to('#a2Ghost, #a2Link', { opacity: .18, duration: .3, ease: 'none' }, 31.6);
riseIn('#a2KrNo', 31.7, .5, 16);
tl.fromTo('#a2Pill', { opacity: 0, y: 40, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .6, ease: 'back.out(1.6)' }, 31.5);
riseIn('#a2Sub', 31.75, .5, 16);
tl.fromTo('#sA2', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.05, duration: .3, ease: 'power2.in', immediateRender: false }, 32.35);
fromA(32.35);

/* provodka bar: born in A2, stays as sticker over speaker */
riseIn('#prov', 29.55, .6, 40);
tl.to('#prov', { y: -1400, scale: .82, duration: .7, ease: 'expo.inOut' }, 32.3);
out('#prov', 34.1, { y: -1440, filter: 'blur(8px)' }, .3);

/* ---------------- B2  34.35 → 39.2  chain + audit ---------------- */
toB(34.3, '#b2Panel');
['#b2n0', '#b2n1', '#b2n2'].forEach((s, i) => {
  popIn(s, 34.55 + i * .14, { y: 30 }, .6, 'back.out(1.8)');
  draw(s + ' .ln', 34.6 + i * .14, .7, .05);
});
tl.fromTo('#b2L1p, #b2L2p', { opacity: 0, attr: { 'stroke-dasharray': '66 44 66' } }, { opacity: 1, duration: .4, ease: 'none' }, 34.8);
tl.fromTo('#b2Brk1, #b2Brk2', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2)' }, 34.95);
tl.to('#b2L1p, #b2L2p', { attr: { 'stroke-dasharray': '88 0 88' }, duration: .35, ease: 'back.out(3)' }, 36.08);
tl.to('#b2Brk1, #b2Brk2', { opacity: 0, scale: 0, duration: .2, ease: 'power2.in' }, 36.05);
tl.fromTo('#b2Pulse', { opacity: 0, attr: { cx: 160 } }, { keyframes: [{ opacity: 1, duration: .05 }, { attr: { cx: 920 }, duration: .7, ease: 'power2.inOut' }, { opacity: 0, duration: .1 }] }, 36.2);
tl.fromTo('#b2n0 .glass, #b2n1 .glass, #b2n2 .glass', { boxShadow: '0 0 0 0 rgba(76,201,240,0)' }, { boxShadow: '0 0 0 4px rgba(76,201,240,.9), 0 0 60px rgba(76,201,240,.7)', duration: .25, stagger: .2, ease: 'none' }, 36.25);
popIn('#b2Ok', 36.4, { y: 20 });
tl.to('#b2Chain', { opacity: 0, x: -140, duration: .4, ease: 'power3.in' }, 37.1);
tl.fromTo('#b2Audit', { opacity: 0, x: 160 }, { opacity: 1, x: 0, duration: .6 }, 37.3);
tl.fromTo('#b2Good', { opacity: 0 }, { opacity: 0, duration: .01 }, 0);
tl.fromTo('#b2Sweep', { x: -320 }, { x: 1100, duration: .55, ease: 'power2.inOut' }, 38.2);
tl.to('#b2Bad', { opacity: 0, duration: .2, ease: 'none' }, 38.4);
tl.fromTo('#b2Good', { opacity: 0, scale: .95 }, { opacity: 1, scale: 1, duration: .35, immediateRender: false }, 38.42);
tl.fromTo('#b2Stamp', { opacity: 0, scale: 2.6, rotation: -24 }, { opacity: 1, scale: 1, rotation: -8, duration: .22, ease: 'power4.in' }, 38.55);
tl.fromTo('#b2Rep', { x: 0 }, { keyframes: [{ x: -10, duration: .04 }, { x: 8, duration: .05 }, { x: 0, duration: .06 }], ease: 'none', immediateRender: false }, 38.77);

/* split → circle directly */
tl.to('#b2Panel', { yPercent: 100, duration: .65, ease: 'power3.inOut' }, 39.12);
toC(39.12);

/* ---------------- C2  39.3 → 43.1  "Hozir 1C ni oching, 001-schyotni tekshiring" ---------------- */
tl.set('#c2Win', { opacity: 0 }, 0);
popIn('#c2Icon', 39.65, {}, .6, 'back.out(2)');
tl.fromTo('#c2Cur', { x: 900, y: 1760, opacity: 0 }, { opacity: 1, duration: .2, ease: 'none' }, 39.8);
tl.to('#c2Cur', { x: 560, y: 1190, duration: .5, ease: 'power2.inOut' }, 39.85);
tl.fromTo('#c2Click', { opacity: 0, width: 20, height: 20, x: 555, y: 1185 }, { keyframes: [{ opacity: 1, duration: .01 }, { width: 120, height: 120, x: 505, y: 1135, opacity: 0, duration: .45, ease: 'power2.out' }] }, 40.35);
tl.to('#c2Icon', { keyframes: [{ scale: .88, duration: .08 }, { scale: 1, duration: .12 }] }, 40.35);
tl.fromTo('#c2Win', { opacity: 0, scale: .18, transformOrigin: '52% 55%' }, { opacity: 1, scale: 1, duration: .6, immediateRender: false }, 40.52);
tl.to('#c2Icon', { opacity: 0, scale: .6, duration: .3, ease: 'power2.in' }, 40.5);
tl.fromTo('.c2r', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .45, stagger: .06 }, 40.8);
tl.to('#c2Cur', { x: 420, y: 880, duration: .6, ease: 'power2.inOut' }, 40.9);
tl.to('.c2r:not(:first-child)', { opacity: .3, duration: .3, ease: 'none' }, 41.95);
tl.fromTo('#c2Sel', { opacity: 0, scaleX: .92 }, { opacity: 1, scaleX: 1, duration: .45 }, 41.95);
tl.fromTo('#c2Bal', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5 }, 42.25);
tl.to('#c2Cur', { x: 600, y: 1440, duration: .5, ease: 'power2.inOut' }, 42.2);
popIn('#c2Warn', 42.45, { rotation: 10, y: 20 });
tl.fromTo('#sC2', { opacity: 1 }, { opacity: 0, duration: .35, ease: 'power2.in', immediateRender: false }, 42.95);
fromC(43.0);

/* ---------------- CTA 43.2 → end  "izohda XIZMAT deb yozing" ---------------- */
tl.fromTo('#cta', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9 }, 43.4);
tl.to('#ctaSend', { keyframes: [{ scale: .82, duration: .1 }, { scale: 1.12, duration: .15 }, { scale: 1, duration: .2 }] }, 46.0);
tl.fromTo('#ctaBrand', { opacity: 0, y: -50, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, 45.2);

tl.to({}, { duration: .01 }, 47);

/* ---------------- scene windows ---------------- */
const WIN = {
  sHook: [.8, 7.5], sA1: [10.5, 14.5], sB1: [14.0, 19.1], sC1: [21.6, 26.6], sK: [26.85, 29.05],
  sA2: [28.95, 32.7], sProv: [29.5, 34.45], sB2: [34.25, 39.8], sC2: [39.3, 43.4], sCTA: [43.3, 99],
};
const SUB_HIDE = [[10.5, 14.2], [21.62, 26.5], [28.9, 32.55], [39.2, 43.2]];
const SPLIT_WIN = [[14.2, 18.9], [34.3, 39.2]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);

/* ---------------- subtitles ---------------- */
const SIZES = [1, 3, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 3, 1, 2, 2, 2, 2, 1, 3, 3, 3, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 4, 2, 2, 2, 2];
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

  counter($('#hkNum'), t, .95, 2.3, 500000000);
  counter($('#kNum'), t, 27.35, 28.4, 500000000);
  counter($('#a2Amt'), t, 29.5, 30.3, 500000000);
  const n21 = Math.round(21 * eOut((t - 14.7) / .8));
  $('#b1Num').textContent = n21; $('#b1SealNum').textContent = n21;
  $('#b1SealRing').setAttribute('transform', `rotate(${t * 18} 100 100)`);
  $('#a1ArrowLine').style.strokeDashoffset = -t * 60;
  $('#a2Link').style.strokeDashoffset = -t * 50;
  const fl = (t < 36.05) ? (Math.floor(t * 8) % 3 ? 1 : .35) : 1;
  $('#b2Brk1').style.color = $('#b2Brk2').style.color = fl < 1 ? '#ff9cc4' : '#ff4d97';
  $('#b2L1p').setAttribute('stroke', t < 36.1 ? '#ff4d97' : '#9fb8ff');
  $('#b2L2p').setAttribute('stroke', t < 36.1 ? '#ff4d97' : '#9fb8ff');
  $('#b2Dot').style.opacity = .4 + .6 * blink;

  typed($('#provTxt'), t, 29.7, 30.5, 'Dt 001 = 500 000 000');
  $('#provCar').style.opacity = t < 31 ? blink : 0;
  typed($('#c2Typed'), t, 41.5, 41.9, '001');
  $('#c2Caret').style.opacity = blink;
  typed($('#ctaTyped'), t, 45.4, 45.85, 'XIZMAT');
  $('#ctaPh').style.display = t >= 45.4 ? 'none' : '';
  $('#ctaCaret').style.opacity = t > 45.9 ? 0 : blink;
  $('#c2Bal').style.boxShadow = t > 42.3 ? `0 0 ${20 + 30 * Math.sin(t * 9) ** 2}px rgba(247,37,133,.55)` : 'none';

  for (const [id, [a, b]] of Object.entries(WIN)) $('#' + id).style.visibility = (t >= a && t < b) ? 'visible' : 'hidden';
  $('#nc').style.visibility = (t >= .25 && t < 10.5) ? 'visible' : 'hidden';
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
