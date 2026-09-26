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

const IRIS = { ccx: 540, ccy: 640 };
const CIRC = { cr: 250, ccx: 540, ccy: 400, tx: 540, ty: 415, s: .74 };
const SPLIT = { tx: 540, ty: 470, s: 1.03 };

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

/* ================= VIDEO 3 : "Moliya — 10% qoidasi" ================= */
/* generated elements first, so the timeline can target them */
const coins = [];
for (let i = 0; i < 10; i++) {
  const c = document.createElement('div');
  c.className = 'coin' + (i === 9 ? ' hot' : '');
  c.style.left = (i * (74 + 16.9)) + 'px';
  c.innerHTML = i === 9 ? '10%' : '';
  $('#b1Coins').appendChild(c); coins.push(c);
}
const bars = [];
for (let i = 0; i < 12; i++) {
  const b = document.createElement('div'); b.className = 'bar';
  b.style.height = ((i + 1) / 12 * 100) + '%';
  $('#c1Bars').appendChild(b); bars.push(b);
}

/* speaker zoom (talking-head parts) */
tl.fromTo(cam, { zoom: 1 }, { zoom: 1.04, duration: 4.5, ease: 'none' }, 0);
tl.to(cam, { zoom: 1.07, duration: .35 }, 4.62);
tl.to(cam, { zoom: 1.08, duration: 4.2, ease: 'none' }, 5.0);
tl.to(cam, { zoom: 1.1, duration: .3 }, 9.25);
tl.set(cam, { zoom: 1.02 }, 23.9);
tl.to(cam, { zoom: 1.08, duration: 3.2, ease: 'none' }, 24.1);

/* ---------------- HOOK 0.3 → 4.3 ---------------- */
tl.fromTo('#hk', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, .35);
draw('#hk .ln', .5, .8, .08);
popIn('#hkEmpty', 3.75, { rotation: -12 });
out('#hk', 4.25, { y: -50, filter: 'blur(10px)' }, .35);

/* ---------------- ORDER 4.6 → 10.1 ---------------- */
tl.fromTo('#od', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 4.65);
tl.fromTo('#od2', { opacity: .45 }, { opacity: 1, duration: .3, ease: 'none' }, 6.7);
tl.to('#od1', { backgroundColor: 'rgba(247,37,133,.22)', borderColor: 'rgba(247,37,133,.85)', duration: .3, ease: 'none' }, 5.8);
tl.fromTo('#od1', { scale: 1 }, { keyframes: [{ scale: 1.06, duration: .12 }, { scale: 1, duration: .25, ease: 'back.out(3)' }] }, 5.8);
tl.to('#od2', { backgroundColor: 'rgba(67,97,238,.25)', borderColor: 'rgba(143,170,255,.85)', duration: .3, ease: 'none' }, 6.7);
tl.fromTo('#od2v', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.4)' }, 9.27);
tl.to('#od2', { borderColor: 'rgba(247,37,133,.9)', backgroundColor: 'rgba(247,37,133,.15)', duration: .2, ease: 'none' }, 9.3);
out('#od', 10.0, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- A1 10.1 → 16.1  TO'G'RI TARTIB ---------------- */
toA(9.95);
riseIn('#a1Kick', 10.35, .6, 20);
riseIn('#a1Note', 11.2, .7, -60);
draw('#a1Note .ln', 11.3, .6, .06);
tl.fromTo('#a1BarW', { scaleX: 0, transformOrigin: '0 50%', opacity: 0 }, { scaleX: 1, opacity: 1, duration: .8, ease: 'power3.out' }, 11.6);
tl.to('#a1B10', { boxShadow: 'inset 0 2px 0 rgba(255,255,255,.5), 0 0 60px rgba(76,201,240,1)', y: -18, duration: .25, ease: 'power2.out' }, 12.3);
popIn('#a1Big', 12.55, { filter: 'blur(14px)' }, .6, 'back.out(1.8)');
riseIn('#a1Safe', 12.3, .7, 70);
draw('#a1Safe .ln', 12.45, .8, .06);
tl.fromTo('#a1Spend', { opacity: 0, y: 70 }, { opacity: .45, y: 0, duration: .7 }, 12.45);
draw('#a1Spend .ln', 12.6, .8, .06);
tl.to('#a1B10', { x: -641, y: 540, scale: .5, opacity: 0, duration: .65, ease: 'power3.in' }, 12.75);
tl.fromTo('#a1Safe', { boxShadow: '0 0 0 0 rgba(76,201,240,0)' }, { keyframes: [{ boxShadow: '0 0 0 4px rgba(76,201,240,.95), 0 0 80px rgba(76,201,240,.8)', duration: .12 }, { boxShadow: '0 0 0 3px rgba(76,201,240,.6), 0 0 40px rgba(76,201,240,.35)', duration: .6 }] }, 13.38);
tl.to('#a1Big', { opacity: 0, scale: .8, duration: .3, ease: 'power2.in' }, 14.9);
tl.to('#a1Spend', { opacity: 1, duration: .25, ease: 'none' }, 15.15);
tl.to('#a1B90', { x: 281, y: 560, scale: .3, opacity: 0, duration: .55, ease: 'power3.in' }, 15.15);
popIn('#a1Tag', 15.45, { y: 30 });
tl.fromTo('#sA1', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.05, duration: .35, ease: 'power2.in', immediateRender: false }, 16.0);
fromA(16.0);
toB(16.0, '#b1Panel');

/* ---------------- B1 16.2 → 20.9  oila 8 mln / 800 ming ---------------- */
riseIn('#b1Fam', 16.4, .7, 60);
draw('#b1Fam .ln', 16.5, .8, .08);
tl.fromTo('.coin', { opacity: 0, scale: 0, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: .45, stagger: .06, ease: 'back.out(2.2)' }, 18.0);
tl.fromTo('#b1Lab', { opacity: 0 }, { opacity: 1, duration: .4, ease: 'none' }, 18.4);
riseIn('#b1Jar', 18.8, .6, 50);
draw('#b1Jar .ln', 18.9, .7, .06);
tl.to(coins[9], { y: -34, scale: 1.25, boxShadow: '0 0 0 3px #bff4ff, 0 0 50px rgba(76,201,240,1)', duration: .35, ease: 'back.out(2)' }, 19.3);
riseIn('#b1Txt', 19.35, .6, 30);
tl.to(coins[9], { x: -144, y: 250, scale: .5, opacity: 0, duration: .5, ease: 'power3.in' }, 20.2);
tl.fromTo('#b1Jar', { boxShadow: '0 0 0 0 rgba(76,201,240,0)' }, { keyframes: [{ boxShadow: '0 0 0 4px rgba(76,201,240,.95), 0 0 70px rgba(76,201,240,.8)', duration: .12 }, { boxShadow: '0 0 0 3px rgba(76,201,240,.5), 0 0 30px rgba(76,201,240,.3)', duration: .5 }] }, 20.68);

/* split → circle */
tl.to('#b1Panel', { yPercent: 100, duration: .65, ease: 'power3.inOut' }, 20.85);
toC(20.85);

/* ---------------- C1 21.0 → 24.2  9 600 000 / 0 ---------------- */
riseIn('#c1Chart', 21.1, .7, 70);
tl.fromTo('.bar', { scaleY: 0, opacity: .3 }, { scaleY: 1, opacity: 1, duration: .45, stagger: .13, ease: 'back.out(1.6)' }, 21.3);
riseIn('#c1Tot', 21.25, .6, 40);
popIn('#c1Year', 22.9, { x: 20 });
tl.fromTo('#c1Zero', { scaleX: 0, transformOrigin: '0 50%', opacity: 0 }, { scaleX: 1, opacity: 1, duration: .45, ease: 'power3.out' }, 23.5);
tl.to('.bar', { opacity: .28, filter: 'grayscale(1)', duration: .35, ease: 'none' }, 23.5);
popIn('#c1No', 23.6, { y: 20 }, .5, 'back.out(2.4)');
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .35, ease: 'power2.in', immediateRender: false }, 24.05);
fromC(24.1);

/* ---------------- CTA 24.3 → end ---------------- */
tl.fromTo('#sv', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 24.35);
draw('#svBm .ln', 24.45, .6, 0);
tl.to('#svBm .ln', { fill: 'rgba(76,201,240,.55)', duration: .2, ease: 'none' }, 24.9);
tl.fromTo('#svBm', { scale: 1 }, { keyframes: [{ scale: 1.3, duration: .12 }, { scale: 1, duration: .3, ease: 'back.out(3)' }] }, 24.9);
tl.fromTo('#rule', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9 }, 25.1);

tl.to({}, { duration: .01 }, 27.5);

/* ---------------- windows ---------------- */
const WIN = { sHook: [.3, 4.7], sOrd: [4.6, 10.4], sA1: [9.95, 16.5], sB1: [16.0, 21.6], sC1: [20.8, 24.5], sCTA: [24.3, 99] };
const SUB_HIDE = [[10.1, 16.2], [20.95, 24.2]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[16.2, 20.9]];
const SIZES = [3, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2, 3, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2];

function sceneTick(t, blink) {
  /* hook wallet: fill up on "maosh", drain to zero by mid-month */
  let bal;
  if (t < 2.3) bal = 8000000 * eOut((t - .45) / .65);
  else bal = 8000000 * (1 - eIO((t - 2.3) / 1.6));
  $('#hkNum').textContent = fmt(Math.max(0, bal));
  const k = bal / 8000000;
  $('#hkBar').style.transform = `scaleX(${clamp(k)})`;
  $('#hkBar').style.background = k < .3 ? 'linear-gradient(90deg,#ff7ab6,#f72585)' : 'linear-gradient(90deg,#4cc9f0,#4361ee)';
  $('#hkNum').style.color = k < .15 && t > 3 ? '#ff5c9e' : '#fff';
  $('#hkDay').textContent = Math.round(1 + 14 * eIO((t - 2.3) / 1.6));

  counter($('#a1In'), t, 11.3, 11.9, 8000000);
  counter($('#a1Save'), t, 13.3, 13.9, 800000);
  counter($('#a1Sp'), t, 15.35, 15.95, 7200000);
  counter($('#b1Num'), t, 17.2, 17.9, 8000000);
  counter($('#b1Jn'), t, 20.7, 21.0, 800000);
  $('#c1Num').textContent = fmt(Math.round(9600000 * clamp((t - 21.3) / 1.75) / 800000) * 800000);

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
