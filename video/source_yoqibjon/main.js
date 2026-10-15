/* ------------------------------------------------------------------
   Yoqibjon — o'quvchi fikri — deterministic frame renderer (GSAP timeline + tick fn)
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

const IRIS = { ccx: 540, ccy: 780 };
const TALK = { tx: 540, ty: 800 };
const CIRC = { cr: 250, ccx: 540, ccy: 400, tx: 540, ty: 425, s: .95 };
const SPLIT = { tx: 540, ty: 440, s: 1.5 };

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

/* ================= VIDEO 11 : Yoqibjon — o'quvchi fikri ================= */
function toBfromA(t, panel, sceneSel) {
  if (sceneSel) tl.fromTo(sceneSel, { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.04, duration: .35, ease: 'power2.in', immediateRender: false }, t);
  tl.set(cam, { ...SPLIT, k: 1, inset: 960, ccx: SPLIT.tx, ccy: SPLIT.ty, cr: 0 }, t + .05);
  tl.to(cam, { cr: 1700, duration: .8, ease: 'power3.inOut' }, t + .05);
  tl.to(cam, { ringA: 1, duration: .1, ease: 'none' }, t + .05);
  tl.to(cam, { ringA: 0, duration: .25, ease: 'none' }, t + .5);
  tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'power3.inOut' }, t + .05);
}
function toCfromB(t, panel) {
  tl.to(panel, { yPercent: 100, duration: .65, ease: 'power3.inOut' }, t);
  tl.to(cam, { ...CIRC, k: 1, inset: 0, duration: .75, ease: 'power3.inOut' }, t);
  tl.to(cam, { ringA: 1, duration: .4, ease: 'none' }, t + .2);
}
const ncUp = t => tl.to('#nc', { y: -722, duration: .7, ease: 'power3.inOut' }, t);
const ncDown = t => tl.to('#nc', { y: 0, duration: .6, ease: 'power3.inOut' }, t);

/* ---------- generated content ---------- */
const STAR = '<svg viewBox="0 0 100 100" width="50" height="50"><path d="M50 6l13 28 30 3-23 20 7 30-27-16-27 16 7-30L7 37l30-3z" fill="url(#gstar)" stroke="#ffd98a" stroke-width="4" stroke-linejoin="round"/></svg>';
for (let i = 0; i < 5; i++) { const d = document.createElement('div'); d.className = 'sstar'; d.innerHTML = STAR; $('#rcStars').appendChild(d); }
const MAT = [['Xomashyo', '120', '85'], ['Ehtiyot qism', '64', '40'], ['Yoqilg‘i', '900', '650'], ['Inventar', '35', '22']];
MAT.forEach(([n, a, b]) => {
  const r = document.createElement('div'); r.className = 'mrow';
  r.innerHTML = `<div class="nm"><i class="ick" style="width:34px;height:34px;font-size:20px">✓</i>${n}</div><div class="q in">+${a}</div><div class="q out">−${b}</div>`;
  $('#b2Rows').appendChild(r);
});

/* speaker — he sits low and small, so talking-head parts are pushed in */
tl.fromTo(cam, { zoom: 1.45 }, { zoom: 1.5, duration: 4.6, ease: 'none' }, 0);
tl.set(cam, { zoom: 1.45 }, 20.2);
tl.to(cam, { zoom: 1.48, duration: 1.7, ease: 'none' }, 20.25);
tl.set(cam, { zoom: 1.45 }, 32.25);
tl.to(cam, { zoom: 1.5, duration: 2.6, ease: 'none' }, 32.3);

/* ---------------- A1 4.75 → 10.25 ---------------- */
toA(4.55);
riseIn('#a1Kick', 4.9, .5, 20);
draw('#a1Inst .ln', 4.95, 1.0, .08, 'power2.out');
tl.fromTo('#a1Cap', { opacity: 0, y: -120, rotation: -20 }, { opacity: 1, y: 0, rotation: 0, duration: .6, ease: 'bounce.out' }, 5.3);
popIn('#a1InstL', 5.45, { y: 20 }, .45, 'back.out(2)');
tl.fromTo('#a1Dip', { opacity: 0, y: 60, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6 }, 5.85);
tl.to('#a1Cap', { keyframes: [{ y: -140, rotation: 25, duration: .35, ease: 'power2.out' }, { y: 0, rotation: 0, duration: .5, ease: 'bounce.out' }] }, 6.85);
draw('#a1Path', 7.45, 1.2, 0, 'power1.inOut');
tl.fromTo('#a1Me', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)' }, 7.4);
draw('#a1Fmk .ln', 7.8, .9, .08, 'power2.out');
popIn('#a1Logo', 8.1, { rotation: -30 }, .6, 'back.out(2)');
tl.fromTo('#a1Name', { opacity: 0, y: 50, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6 }, 8.0);
tl.to(['#a1Inst', '#a1Dip'], { opacity: .4, duration: .4, ease: 'none' }, 8.7);
tl.fromTo('#a1Halo', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .6 }, 8.75);
tl.to('#a1Fmk', { keyframes: [{ scale: 1.05, duration: .15 }, { scale: 1, duration: .35, ease: 'back.out(3)' }] }, 8.8);
popIn('#a1Ok', 9.4, { y: 20 }, .45, 'back.out(2.2)');
toBfromA(10.15, '#b1Panel', '#sA1');
ncUp(10.2);

/* ---------------- B1 10.35 → 15.1 ---------------- */
tl.fromTo('#b1c1', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 11.5);
tl.fromTo('#b1p1', { scaleX: 0 }, { scaleX: 1, duration: 2.6, ease: 'power1.inOut' }, 12.0);
tl.fromTo('#b1c2', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 12.95);
tl.fromTo('#b1p2', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power1.inOut' }, 13.4);
tl.to(['#b1c1', '#b1c2'], { boxShadow: '0 0 0 3px rgba(76,201,240,.85), 0 0 60px rgba(76,201,240,.4)', duration: .3, ease: 'none' }, 14.65);
popIn('#b1Ok', 14.7, { y: 20 }, .4, 'back.out(2.2)');
toCfromB(15.0, '#b1Panel');
ncDown(15.0);

/* ---------------- C1 15.25 → 20.2 ---------------- */
riseIn('#c1Kick', 15.35, .5, 20);
tl.fromTo('#c1T', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 15.4);
tl.fromTo('#c1C', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 17.05);
tl.fromTo('#c1Path', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 17.9);
tl.fromTo('#c1Let', { opacity: 0 }, { opacity: 1, duration: .1, ease: 'none' }, 18.2);
tl.to('#c1Let', { opacity: 0, duration: .1, ease: 'none' }, 19.2);
tl.to('#c1C', { keyframes: [{ scale: 1.05, duration: .15 }, { scale: 1, duration: .35, ease: 'back.out(3)' }], boxShadow: '0 0 0 3px rgba(76,201,240,.85), 0 0 60px rgba(76,201,240,.4)' }, 19.2);
tl.fromTo('#c1Stamp', { opacity: 0, scale: 2.4, rotation: -4 }, { opacity: 1, scale: 1, rotation: -6, duration: .35, ease: 'power4.in' }, 19.6);
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 20.1);
fromC(20.15);

/* ---------------- B2 21.9 → 26.15 ---------------- */
toB(21.85, '#b2Panel');
ncUp(21.85);
tl.fromTo('#b2Id', { opacity: 0, y: 80, rotation: -5 }, { opacity: 1, y: 0, rotation: 0, duration: .7, ease: 'back.out(1.6)' }, 22.15);
tl.fromTo('#b2Role', { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.4)' }, 23.2);
tl.fromTo('#b2Led', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .6 }, 22.6);
draw('#b2Led .ln', 22.7, .7, .1);
tl.fromTo('.mrow', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .4, stagger: .35 }, 23.7);
tl.fromTo('.mrow .ick', { scale: 0 }, { scale: 1, duration: .3, stagger: .35, ease: 'back.out(2.6)' }, 24.0);
fromB(26.1, '#b2Panel');
ncDown(26.1);

/* ---------------- A2 26.45 → 32.25 ---------------- */
toA(26.3);
riseIn('#a2Kick', 26.6, .5, 20);
tl.fromTo('#a2Map', { opacity: 0, scale: .9, filter: 'blur(12px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .6 }, 26.65);
draw('#a2Map .ln', 26.8, 1.0, .15, 'power2.out');
tl.fromTo('#a2Pin', { opacity: 0, y: -200 }, { opacity: 1, y: 0, duration: .6, ease: 'bounce.out' }, 27.0);
popIn('#a2City', 27.35, { x: -20 }, .5, 'back.out(2.2)');
tl.fromTo('#a2Q', { opacity: 0, y: 70, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6 }, 27.85);
tl.to('#a2Q', { keyframes: [{ scale: 1.04, duration: .15 }, { scale: 1, duration: .35, ease: 'back.out(3)' }] }, 29.1);
tl.to('#a2Q', { boxShadow: '0 0 0 3px rgba(247,37,133,.85), 0 0 60px rgba(247,37,133,.4)', duration: .3, ease: 'none' }, 31.05);
tl.fromTo('#sA2', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.04, duration: .3, ease: 'power2.in', immediateRender: false }, 32.15);
fromA(32.25);

/* ---------------- REC 32.5 → 34.8 ---------------- */
tl.fromTo('#rc', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .7 }, 32.5);
tl.fromTo('.sstar', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .3, stagger: .08, ease: 'back.out(2.8)' }, 33.8);
tl.fromTo('#rcShine', { x: -300 }, { x: 1100, duration: .8, ease: 'power2.inOut' }, 34.2);
out('#rc', 34.75, { y: -40, filter: 'blur(10px)' }, .25);

/* speaker leaves — iris closes on his face */
tl.set(cam, { ccx: IRIS.ccx, ccy: IRIS.ccy }, 34.8);
tl.to(cam, { cr: 0, duration: .3, ease: 'power2.in' }, 34.8);
tl.to(cam, { ringA: 1, duration: .08, ease: 'none' }, 34.8);
tl.to(cam, { ringA: 0, duration: .12, ease: 'none' }, 35.0);
out('#nc', 34.75, { x: -60, filter: 'blur(10px)' }, .3);

/* ---------------- END CARD 35.0 → 40.0 ---------------- */
tl.fromTo('#ecLogo', { opacity: 0, scale: .4, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.7)' }, 35.05);
tl.fromTo('#ecTitle', { opacity: 0, y: 50, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 35.25);
tl.fromTo('#ecLine', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power3.out' }, 35.45);
tl.fromTo('#ec', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 35.45);
tl.fromTo('#ec1', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 35.65);
draw('#ecPin .ln', 35.65, .7, .2, 'power2.out');
tl.fromTo('#ec2', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 35.9);
tl.fromTo('#ecShine', { x: -300 }, { x: 1250, duration: 1.0, ease: 'power2.inOut' }, 36.5);
tl.to('#ecPh', { keyframes: [{ rotation: -14, duration: .07 }, { rotation: 12, duration: .07 }, { rotation: -10, duration: .07 }, { rotation: 8, duration: .07 }, { rotation: 0, duration: .1 }] }, 36.9);
tl.to('#ecPin', { keyframes: [{ y: -14, duration: .2, ease: 'power2.out' }, { y: 0, duration: .45, ease: 'bounce.out' }] }, 37.3);
tl.fromTo('#ecShine', { x: -300 }, { x: 1250, duration: 1.0, ease: 'power2.inOut', immediateRender: false }, 38.6);
tl.to('#ecPh', { keyframes: [{ rotation: -14, duration: .07 }, { rotation: 12, duration: .07 }, { rotation: -10, duration: .07 }, { rotation: 8, duration: .07 }, { rotation: 0, duration: .1 }] }, 39.0);

tl.to({}, { duration: .01 }, 40.0);

/* ---------------- windows ---------------- */
const WIN = { sA1: [4.7, 10.55], sB1: [10.15, 15.7], sC1: [15.2, 20.45], sB2: [21.85, 26.8], sA2: [26.4, 32.5], sRec: [32.45, 35.05], sEnd: [35.0, 99] };
const SUB_HIDE = [[4.75, 10.25], [15.25, 20.2], [26.45, 32.3], [34.85, 99]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[10.5, 15.05], [22.05, 26.15]];

function sceneTick(t, blink) {
  { // A1: dot travels institute → centre
    const p = $('#a1Path'), L = p.getTotalLength(), k = eIO((t - 7.45) / 1.2), pt = p.getPointAtLength(L * k);
    $('#a1Me').style.transform = `translate(${pt.x - 42}px, ${380 + pt.y - 42}px)`;
  }
  { // C1: letter flies teacher → company
    const p = $('#c1Path'), L = p.getTotalLength(), k = eIO((t - 18.2) / 1.0), pt = p.getPointAtLength(L * k);
    $('#c1Let').style.transform = `translate(${pt.x - 50}px, ${960 + pt.y - 37}px) rotate(${-12 + 24 * k}deg)`;
    $('#c1Path').style.strokeDashoffset = -t * 40;
  }
  { const x = clamp((t - 12.0) / 2.6), e = x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; $('#b1n1').textContent = Math.round(100 * e) + '%'; }
  { const x = clamp((t - 13.4) / 1.3), e = x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; $('#b1n2').textContent = Math.round(100 * e) + '%'; }
  { const ph = ((t - 27.4) % 1.2 + 1.2) % 1.2 / 1.2; const pg = $('#a2Ping'); pg.style.transform = `translate(-50%,-50%) scale(${1 + ph * 9})`; pg.style.opacity = t > 27.4 ? (1 - ph) * .9 : 0; }
  $('#ecRing').style.transform = `rotate(${t * 40}deg)`;
  { const ph = ((t - 35.9) % 1.3 + 1.3) % 1.3 / 1.3; const pg = $('#ecPing'); pg.style.transform = `translate(-50%,-50%) scale(${1 + ph * 4.5})`; pg.style.opacity = t > 35.9 ? (1 - ph) * .9 : 0; }
  for (const [id, [a, b]] of Object.entries(WIN)) $('#' + id).style.visibility = (t >= a && t < b) ? 'visible' : 'hidden';
  $('#nc').style.visibility = (t >= .25 && t < 35.1) ? 'visible' : 'hidden';
}

/* ---------------- subtitles ---------------- */
const SIZES = [3, 1, 2, 1, 1, 2, 1, 2, 1, 3, 2, 3, 2, 3, 1, 2, 2, 3, 3, 2, 3, 2, 1, 1, 1, 1, 2, 2];
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
  // talking head: face parked at TALK (he sits low in the source frame)
  const px = lerp(TALK.tx + (fx - FMEAN[0]) * .6, cam.tx + (fx - FMEAN[0]) * .45, cam.k);
  const py = lerp(TALK.ty + (fy - FMEAN[1]) * .6, cam.ty + (fy - FMEAN[1]) * .45, cam.k);
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
  const src = `../frames/${String(Math.min(frame + 1, 909)).padStart(4, '0')}.jpg`;
  if (!img.src.endsWith(src.slice(2))) { img.src = src; await img.decode().catch(() => { }); }
  tl.seek(t, false);
  ambience(t, frame);
  applyCam(frame);
  subs(t);
  return t;
};
window.ready = (async () => { await document.fonts.ready; layoutSubs(); return true; })();
