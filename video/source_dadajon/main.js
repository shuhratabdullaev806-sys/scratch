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

const IRIS = { ccx: 626, ccy: 832 };
const CIRC = { cr: 250, ccx: 540, ccy: 400, tx: 540, ty: 425, s: 1.3 };
const SPLIT = { tx: 540, ty: 540, s: 1.4 };

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

/* ================= VIDEO 8 : Hasanov Dadajon — o'quvchi fikri ================= */
function toCfromB(t, panel) {
  tl.to(panel, { yPercent: 100, duration: .65, ease: 'power3.inOut' }, t);
  toC(t);
}
const STAR = '<svg viewBox="0 0 100 100" width="46" height="46"><path d="M50 6l13 28 30 3-23 20 7 30-27-16-27 16 7-30L7 37l30-3z" fill="url(#gstar)" stroke="#ffd98a" stroke-width="4" stroke-linejoin="round"/></svg>';
for (let i = 0; i < 5; i++) { const d = document.createElement('div'); d.className = 'sstar'; d.innerHTML = STAR; $('#rcStars').appendChild(d); }
const fdots = [];
for (let i = 0; i < 5; i++) { const d = document.createElement('div'); d.className = 'fdot'; $('#b1Dots').appendChild(d); fdots.push(d); }

/* speaker zoom — he sits small in frame, so talking-head parts are pushed in */
tl.fromTo(cam, { zoom: 1.12 }, { zoom: 1.18, duration: 10.5, ease: 'none' }, 0);
tl.set(cam, { zoom: 1.12 }, 39.6);
tl.to(cam, { zoom: 1.18, duration: 10.6, ease: 'none' }, 39.7);

const chipIn = (s, t) => tl.fromTo(s, { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, t);

/* ---------------- COURSE 2.5 → 10.4 ---------------- */
chipIn('#hk', 2.5);
popIn('#hkY', 2.75, { rotation: -12 }, .55, 'back.out(2.4)');
tl.fromTo('#hk1', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 6.4);
tl.fromTo('#hk2', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 7.6);
draw('#hk1 .ln', 6.45, .6, .05); draw('#hk2 .ln', 7.65, .6, .05);
tl.fromTo('#hk2 .okb', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2.6)' }, 9.3);
out('#hk', 10.1, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- A1 10.6 → 17.2 ---------------- */
toA(10.45);
riseIn('#a1Kick', 10.85, .5, 20);
riseIn('#a1Map', 10.9, .7, 60);
draw('#a1Roads', 11.05, .9, 0, 'power2.out');
tl.fromTo('#a1Pin', { opacity: 0, y: -160 }, { opacity: 1, y: 0, duration: .5, ease: 'bounce.out' }, 11.75);
tl.fromTo('#a1Ping', { opacity: 0, width: 10, height: 10, x: 0, y: 0 }, { keyframes: [{ opacity: 1, duration: .01 }, { width: 260, height: 260, x: -125, y: -125, opacity: 0, duration: .8, ease: 'power2.out' }] }, 12.25);
popIn('#a1Dist', 12.7, { x: -20 }, .5, 'back.out(2.2)');
riseIn('#a1Co', 13.3, .7, 70);
draw('#a1Co .ln', 13.4, .9, .05);
tl.fromTo('#a1Mchj', { opacity: 0 }, { opacity: 1, duration: .4, ease: 'none' }, 14.2);
popIn('#a1Work', 16.4, { y: 20 }, .5, 'back.out(2.2)');
tl.fromTo('#sA1', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.04, duration: .35, ease: 'power2.in', immediateRender: false }, 17.1);
fromA(17.2);
toB(17.2, '#b1Panel');

/* ---------------- B1 17.4 → 28.2 ---------------- */
popIn('#b1k', 17.5, { x: -40 }, .6, 'back.out(1.6)');
draw('#b1k .ln', 17.6, .6, .05);
draw('#b1Arr', 18.0, .4, 0, 'power2.out');
tl.fromTo('#b1Head', { opacity: 0 }, { opacity: 1, duration: .2, ease: 'none' }, 18.35);
popIn('#b1w', 18.0, { x: 40 }, .6, 'back.out(1.6)');
draw('#b1w .ln', 18.1, .6, .05);
riseIn('#b1Sk', 23.8, .6, 30);
tl.fromTo('#b1Bar', { scaleX: 0 }, { scaleX: 1, duration: 2.7, ease: 'power2.inOut' }, 24.1);
tl.to('#b1w', { boxShadow: '0 0 0 3px rgba(76,201,240,.8), 0 0 60px rgba(76,201,240,.45)', duration: .3, ease: 'none' }, 26.9);
popIn('#b1Help', 26.9, { y: 20 }, .5, 'back.out(2.2)');
toCfromB(28.3, '#b1Panel');

/* ---------------- C1 28.5 → 39.7 ---------------- */
[['#tk0', 29.3, '#tc0', 31.85], ['#tk1', 30.7, '#tc1', 32.05], ['#tk2', 34.0, '#tc2', 35.0]].forEach(([c, t, k, tk]) => {
  tl.fromTo(c, { opacity: 0, x: 120, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, t);
  draw(c + ' .ln', t + .1, .8, .06);
  tl.fromTo(k, { opacity: 0, scale: 0, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: .45, ease: 'back.out(2.6)' }, tk);
});
tl.to('.tk', { boxShadow: '0 0 0 3px rgba(76,201,240,.8), 0 0 60px rgba(76,201,240,.4)', scale: 1.02, duration: .3, stagger: .12, ease: 'power2.out' }, 38.8);
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 39.6);
fromC(39.65);

/* ---------------- RECOMMEND 40.7 → 48.9 ---------------- */
chipIn('#rc', 40.75);
tl.fromTo('.sstar', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .1, ease: 'back.out(2.8)' }, 41.4);
tl.fromTo('#rcShine', { x: -300 }, { x: 1100, duration: .9, ease: 'power2.inOut' }, 42.2);
tl.fromTo('#rcShine', { x: -300 }, { x: 1100, duration: .9, ease: 'power2.inOut', immediateRender: false }, 46.0);

/* ---------------- speaker out at 48.9 (before he looks away) ---------------- */
tl.set(cam, { ccx: IRIS.ccx, ccy: IRIS.ccy }, 48.68);
tl.to(cam, { cr: 0, duration: .22, ease: 'power2.inOut' }, 48.68);
tl.to(cam, { ringA: 1, duration: .06, ease: 'none' }, 48.68);
tl.to(cam, { ringA: 0, duration: .06, ease: 'none' }, 48.86);
out('#rc', 48.6, { y: -40, filter: 'blur(10px)' }, .25);
out('#nc', 48.6, { x: -60, filter: 'blur(10px)' }, .25);

/* ---------------- END CARD 49.2 → 54.2 ---------------- */
tl.fromTo('#ecLogo', { opacity: 0, scale: .5, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.8)' }, 48.95);
tl.fromTo('#ecTitle', { opacity: 0, y: 40, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 49.15);
tl.fromTo('#ec', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, 49.35);
tl.fromTo('#ec1', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 49.65);
tl.fromTo('#ec2', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 49.90);
tl.fromTo('#ecShine', { x: -300 }, { x: 1200, duration: 1.0, ease: 'power2.inOut' }, 50.70);

tl.to({}, { duration: .01 }, 54.00);

/* ---------------- windows ---------------- */
const WIN = { sHk: [2.45, 10.5], sA1: [10.45, 17.5], sB1: [17.1, 29.0], sC1: [28.2, 39.95], sRec: [40.7, 48.9], sEnd: [48.9, 99] };
const SUB_HIDE = [[10.65, 17.25], [28.5, 39.7], [48.92, 99]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[17.4, 28.35]];
const SIZES = [2, 3, 1, 1, 2, 3, 2, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2];

function sceneTick(t, blink) {
  const k = clamp((t - 24.1) / 2.7), pk = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  $('#b1Pct').textContent = Math.round(pk * 100) + '%';
  fdots.forEach((d, i) => {
    const ph = ((t - 19.2) * .9 + i / 5) % 1;
    d.style.transform = `translateX(${ph * 110}px)`;
    d.style.opacity = t > 19.2 && t < 23.4 ? Math.sin(Math.PI * ph) : 0;
  });
  for (const [id, [a, b]] of Object.entries(WIN)) $('#' + id).style.visibility = (t >= a && t < b) ? 'visible' : 'hidden';
  $('#nc').style.visibility = (t >= .25 && t < 48.9) ? 'visible' : 'hidden';
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
