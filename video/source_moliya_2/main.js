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

const IRIS = { ccx: 620, ccy: 600 };
const CIRC = { cr: 250, ccx: 540, ccy: 400, tx: 540, ty: 418, s: .83 };
const SPLIT = { tx: 540, ty: 470, s: 1.2 };

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


/* ---------------- NAME CARD 0.3 → 10.3 ---------------- */
tl.fromTo('#nc', { opacity: 0, x: -90, filter: 'blur(14px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .9 }, .3);
tl.fromTo('#ncLogo', { scale: 0, rotation: -35 }, { scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.8)' }, .45);
tl.fromTo('#ncName', { yPercent: 115 }, { yPercent: 0, duration: .8 }, .6);
tl.fromTo('#ncRole', { yPercent: 115 }, { yPercent: 0, duration: .8 }, .75);
tl.fromTo('#ncRole i', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .7 }, 1.0);
tl.to(['#ncName', '#ncRole'], { yPercent: -115, duration: .45, ease: 'power3.in', stagger: .05 }, 9.75);
tl.to('#nc', { opacity: 0, x: -60, filter: 'blur(10px)', duration: .4, ease: 'power3.in' }, 9.95);

/* ================= VIDEO 4 : "Daromadni oshirishning ikki yo'li" ================= */
function toCfromB(t, panel) {
  tl.to(panel, { yPercent: 100, duration: .65, ease: 'power3.inOut' }, t);
  toC(t);
}
function toBfromC(t, panel) {
  tl.to(cam, { ...SPLIT, k: 1, inset: 960, cr: 1400, ccx: 540, ccy: 760, duration: .7, ease: 'power3.inOut' }, t);
  tl.to(cam, { ringA: 0, duration: .25, ease: 'none' }, t);
  tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'power3.inOut' }, t);
}

/* speaker zoom (talking-head parts) */
tl.fromTo(cam, { zoom: 1 }, { zoom: 1.04, duration: 7.7, ease: 'none' }, 0);
tl.to(cam, { zoom: 1.08, duration: .35 }, 7.78);
tl.to(cam, { zoom: 1.09, duration: 2.5, ease: 'none' }, 8.15);
tl.set(cam, { zoom: 1.0 }, 37.7);
tl.to(cam, { zoom: 1.07, duration: 6.4, ease: 'none' }, 37.8);

/* ---------------- HOOK 0.3 → 2.9 ---------------- */
tl.fromTo('#hk', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, .3);
draw('#hk .ln', .45, .8, .08);
out('#hk', 2.65, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- INVEST 2.95 → 10.1 ---------------- */
tl.fromTo('#iv', { opacity: 0, y: -70, scale: .92, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 2.95);
draw('#iv1 .ln', 3.05, .8, .08);
tl.fromTo('#iv2', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .5 }, 5.3);
tl.fromTo('#iv3', { opacity: 0 }, { opacity: 1, duration: .4, ease: 'none' }, 6.15);
tl.fromTo('#ivb0', { scaleY: 0 }, { scaleY: 1, duration: .5, ease: 'back.out(1.6)' }, 6.2);
tl.fromTo('#ivb1', { scaleY: 0 }, { scaleY: 1, duration: .7, ease: 'back.out(1.6)' }, 7.8);
popIn('#ivX', 8.3, { y: 20 }, .55, 'back.out(2.4)');
out('#iv', 10.0, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- A1 10.6 → 17.0  PUL OQIMI ---------------- */
toA(10.45);
riseIn('#a1Kick', 10.85, .6, 20);
['#a1n0', '#a1n1', '#a1n2'].forEach((s, i) => { popIn(s, 11.0 + i * .18, { y: 30 }, .6, 'back.out(1.8)'); draw(s + ' .ln', 11.05 + i * .18, .7, .05); });
tl.fromTo('#a1P1, #a1P2', { opacity: 0 }, { opacity: 1, duration: .4, ease: 'none' }, 11.4);
popIn('#a1Two', 12.55, { y: 20 }, .6, 'back.out(2)');
tl.fromTo('#a1c1', { opacity: 0, y: 100, rotationY: 20, transformPerspective: 1600 }, { opacity: 1, y: 0, rotationY: 0, duration: .8 }, 12.75);
tl.fromTo('#a1c2', { opacity: 0, y: 100, rotationY: -20, transformPerspective: 1600 }, { opacity: 1, y: 0, rotationY: 0, duration: .8 }, 12.9);
draw('#a1c1 .ln', 12.9, .7, 0); draw('#a1c2 .ln', 13.05, .7, 0);
tl.to('#a1c1', { boxShadow: '0 0 0 4px rgba(247,37,133,.9), 0 0 70px rgba(247,37,133,.55)', scale: 1.03, duration: .35, ease: 'power2.out' }, 14.43);
tl.to('#a1c2', { opacity: .35, scale: .97, duration: .35, ease: 'none' }, 14.43);
tl.to('#a1Exp', { scaleX: .6, duration: 1.1, ease: 'power2.inOut' }, 15.1);
tl.to('#a1n2', { scale: .72, duration: 1.1, ease: 'power2.inOut' }, 15.1);
tl.fromTo('#sA1', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.05, duration: .35, ease: 'power2.in', immediateRender: false }, 16.9);
fromA(16.9);
toB(16.9, '#b1Panel');

/* ---------------- B1 17.1 → 24.5  chegara bor / yo'q ---------------- */
riseIn('#b1L', 17.2, .7, 60);
tl.fromTo('#b1R', { opacity: 0, y: 60 }, { opacity: .35, y: 0, duration: .7 }, 17.35);
tl.fromTo('#b1Lbar', { scaleY: 1 }, { keyframes: [{ scaleY: .75, duration: .35 }, { scaleY: .58, duration: .35 }, { scaleY: .42, duration: .4, ease: 'power4.in' }] }, 17.7);
tl.fromTo('#b1Floor', { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: .45 }, 18.25);
tl.fromTo('#b1Lbar', { x: 0 }, { keyframes: [{ x: -8, duration: .04 }, { x: 7, duration: .05 }, { x: 0, duration: .06 }], ease: 'none', immediateRender: false }, 18.8);
popIn('#b1Lim', 18.85, { rotation: -8 }, .45, 'back.out(2.4)');
riseIn('#b1Lt', 19.5, .5, 16);
tl.to('#b1L', { opacity: .45, duration: .35, ease: 'none' }, 20.4);
tl.to('#b1R', { opacity: 1, boxShadow: '0 0 0 3px rgba(76,201,240,.7), 0 0 60px rgba(76,201,240,.4)', duration: .35, ease: 'none' }, 20.45);
draw('#b1Curve', 20.9, 1.3, 0, 'power2.in');
popIn('#b1Inf', 23.25, { filter: 'blur(14px)' }, .6, 'back.out(2)');
riseIn('#b1Rt', 23.9, .5, 16);

/* split → circle */
toCfromB(24.45, '#b1Panel');

/* ---------------- C1 24.6 → 32.8  Qanday? ---------------- */
popIn('#c1Q', 24.8, { filter: 'blur(12px)' }, .55, 'back.out(2)');
[['#c1k0', 25.6, '#ck0', 27.5], ['#c1k1', 28.7, '#ck1', 29.5], ['#c1k2', 30.1, '#ck2', 32.2]].forEach(([c, t, k, tk]) => {
  tl.fromTo(c, { opacity: 0, x: 120, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, t);
  draw(c + ' .ln', t + .1, .8, .06);
  tl.fromTo(k, { opacity: 0, scale: 0, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: .45, ease: 'back.out(2.6)' }, tk);
  tl.to(c, { boxShadow: '0 0 0 3px rgba(76,201,240,.75), 0 0 50px rgba(76,201,240,.35)', duration: .3, ease: 'none' }, tk);
});
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 32.7);

/* ---------------- B2 32.9 → 37.8  aloqa = taklif · malaka = maosh ---------------- */
toBfromC(32.75, '#b2Panel');
[['#e1a', 33.0], ['#e1s', 33.55], ['#e1b', 33.8], ['#e2a', 35.5], ['#e2s', 36.05], ['#e2b', 36.3]].forEach(([s, t]) => {
  popIn(s, t, { y: 30 }, .55, 'back.out(1.8)');
  draw(s + ' .ln', t + .05, .7, .06);
});
tl.to('#e1b', { boxShadow: '0 0 0 3px rgba(76,201,240,.75), 0 0 50px rgba(76,201,240,.35)', duration: .3, ease: 'none' }, 35.0);
tl.to('#e2b', { boxShadow: '0 0 0 3px rgba(76,201,240,.75), 0 0 50px rgba(76,201,240,.35)', duration: .3, ease: 'none' }, 37.2);
fromB(37.7, '#b2Panel');

/* ---------------- Q 38.0 → 41.4 ---------------- */
tl.fromTo('#qc', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 38.1);
draw('#qc .ln', 38.2, .7, 0);
out('#qc', 41.2, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- END 41.5 → end ---------------- */
tl.fromTo('#sv', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 41.55);
draw('#svBm .ln', 41.6, .6, 0);
tl.to('#svBm .ln', { fill: 'rgba(76,201,240,.55)', duration: .2, ease: 'none' }, 42.0);
tl.fromTo('#svBm', { scale: 1 }, { keyframes: [{ scale: 1.3, duration: .12 }, { scale: 1, duration: .3, ease: 'back.out(3)' }] }, 42.0);
tl.fromTo('#fm', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, 42.1);
tl.fromTo('#fm .fmp, #fm .fmo', { opacity: 0, scale: .5, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: .4, stagger: .12, ease: 'back.out(2.2)' }, 42.4);

tl.to({}, { duration: .01 }, 44.5);

/* ---------------- windows ---------------- */
const WIN = { sHook: [.3, 2.95], sInv: [2.9, 10.4], sA1: [10.45, 17.3], sB1: [16.85, 25.2], sC1: [24.4, 33.1], sB2: [32.7, 38.5], sQ: [38.0, 41.6], sEnd: [41.5, 99] };
const SUB_HIDE = [[10.55, 17.05], [24.6, 32.85]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[17.05, 24.6], [32.85, 37.9]];
const SIZES = [2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 3, 1, 2, 3, 1, 2, 3, 1, 2, 2, 3, 2, 2, 2, 3, 2, 2, 1, 1, 1, 2, 2];

function sceneTick(t, blink) {
  $('#hkNum').textContent = Math.round(31 * eOut((t - .3) / 1.1));
  $('#a1P1').style.strokeDashoffset = -t * 70;
  $('#a1P2').style.strokeDashoffset = -t * 70;
  const ep = t < 15.1 ? 100 : Math.round(100 - 40 * eIO((t - 15.1) / 1.1));
  $('#a1ExpP').textContent = ep + '%';
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
