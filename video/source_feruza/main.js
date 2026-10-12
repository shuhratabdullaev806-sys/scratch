/* ------------------------------------------------------------------
   Feruza — o'quvchi fikri — deterministic frame renderer (GSAP timeline + tick fn)
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

const IRIS = { ccx: 517, ccy: 800 };
const CIRC = { cr: 250, ccx: 540, ccy: 400, tx: 540, ty: 425, s: 1.0 };
const SPLIT = { tx: 540, ty: 430, s: 1.35 };

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

/* ================= VIDEO 10 : Feruza — o'quvchi fikri ================= */
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
function toBfromC(t, panel) {
  tl.to(cam, { ...SPLIT, k: 1, inset: 960, cr: 1700, ccx: 540, ccy: 760, duration: .7, ease: 'power3.inOut' }, t);
  tl.to(cam, { ringA: 0, duration: .25, ease: 'none' }, t);
  tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'power3.inOut' }, t);
}
const ncUp = t => tl.to('#nc', { y: -722, duration: .7, ease: 'power3.inOut' }, t);
const ncDown = t => tl.to('#nc', { y: 0, duration: .6, ease: 'power3.inOut' }, t);

/* ---------- generated content ---------- */
const STAR = '<svg viewBox="0 0 100 100" width="50" height="50"><path d="M50 6l13 28 30 3-23 20 7 30-27-16-27 16 7-30L7 37l30-3z" fill="url(#gstar)" stroke="#ffd98a" stroke-width="4" stroke-linejoin="round"/></svg>';
for (let i = 0; i < 5; i++) { const d = document.createElement('div'); d.className = 'sstar'; d.innerHTML = STAR; $('#rcStars').appendChild(d); }
[[150, 360, 150], [360, 420, 110], [560, 350, 130], [790, 400, 120]].forEach(([x, y, w], i) => {
  const d = document.createElement('div'); d.className = 'abs firm'; d.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${w * 1.4}px`;
  d.innerHTML = `<svg width="${w}" height="${w * 1.4}" viewBox="0 0 100 140" style="stroke:#aebcff;stroke-width:4;fill:rgba(67,97,238,.15)"><path d="M10 136V20h56v116M66 50h24v86M4 136h92"/><path d="M22 36h10M44 36h10M22 56h10M44 56h10M22 76h10M44 76h10M22 96h10M44 96h10M74 66h8M74 86h8M74 106h8" stroke-linecap="round"/></svg>`;
  $('#a2Firms').appendChild(d);
});
[.35, .5, .62, .8, .95].forEach(h => { const b = document.createElement('div'); b.className = 'cbar'; b.style.height = h * 100 + '%'; $('#b1Chart').appendChild(b); });
[['#4361ee', '#7209b7'], ['#f72585', '#7209b7'], ['#4cc9f0', '#4361ee']].forEach(([a, b]) => {
  const d = document.createElement('div'); d.className = 'glass dark teach';
  d.innerHTML = `<div class="av" style="background:linear-gradient(135deg,${a},${b})"><svg width="64" height="64" viewBox="0 0 120 120" style="stroke:#fff;stroke-width:9;fill:none;stroke-linecap:round"><path d="M40 40a20 20 0 1 0 40 0a20 20 0 1 0-40 0M22 106c4-20 20-30 38-30s34 10 38 30"/></svg></div><div class="tst">★★★★★</div>`;
  $('#c2Teach').appendChild(d);
});
[['1', 'Asoslar', 'BOSHLANG‘ICH', 180, 'rgba(67,97,238,.35)'], ['2', 'Amaliyot', 'O‘RTA', 330, 'rgba(114,9,183,.4)'], ['3', 'Chuqur bilim', 'YUQORI', 480, 'linear-gradient(120deg,rgba(247,37,133,.55),rgba(114,9,183,.55))']].forEach(([n, s, d, top, bg], i) => {
  const e = document.createElement('div'); e.className = 'lv glass dark'; e.id = 'lv' + i;
  e.style.top = top + 'px'; e.style.width = (780 - i * 0) + 'px'; e.style.background = bg;
  e.innerHTML = `<div class="n">${n}</div><div>${s}</div><div class="d">${d}</div>`;
  $('#b3Lv').appendChild(e);
});

/* speaker zoom — she sits small in frame, so talking-head parts are pushed in */
tl.fromTo(cam, { zoom: 1.12 }, { zoom: 1.17, duration: 6.2, ease: 'none' }, 0);
tl.set(cam, { zoom: 1.12 }, 20.0);
tl.to(cam, { zoom: 1.16, duration: 3.4, ease: 'none' }, 20.05);
tl.set(cam, { zoom: 1.12 }, 31.3);
tl.to(cam, { zoom: 1.16, duration: 3.2, ease: 'none' }, 31.35);

/* ---------------- S0 3.9 → 6.05 ---------------- */
tl.fromTo('#s0Card', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 3.85);
draw('#s0Card .ln', 4.0, .8, .1);
tl.fromTo('.spark', { opacity: 0, scale: 0, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0, duration: .45, stagger: .12, ease: 'back.out(2.6)' }, 4.3);
tl.fromTo('#s0Heart', { scale: 0 }, { scale: 1, duration: .45, ease: 'back.out(2.6)' }, 5.0);
tl.to('#s0Heart', { keyframes: [{ scale: 1.2, duration: .12 }, { scale: 1, duration: .2 }, { scale: 1.15, duration: .12 }, { scale: 1, duration: .25 }] }, 5.5);
out('#s0Card', 5.95, { x: 60, filter: 'blur(10px)' }, .3);

/* ---------------- A1 6.3 → 9.3 ---------------- */
toA(6.1);
riseIn('#a1Kick', 6.45, .5, 20);
draw('#a1Bld .ln', 6.5, 1.0, .08, 'power2.out');
tl.fromTo('#a1Road', { opacity: 0 }, { opacity: 1, duration: .4, ease: 'none' }, 6.5);
draw('#a1Path', 6.6, 1.5, 0, 'power1.inOut');
popIn('#a1Logo', 7.0, { rotation: -30 }, .6, 'back.out(2)');
tl.fromTo('#a1Name', { opacity: 0, y: 50, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6 }, 6.75);
tl.fromTo('#a1Halo', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .6 }, 8.05);
tl.to('#a1Bld', { keyframes: [{ scale: 1.05, duration: .15 }, { scale: 1, duration: .35, ease: 'back.out(3)' }] }, 8.1);
popIn('#a1Ok', 8.15, { y: 20 }, .45, 'back.out(2.2)');
toBfromA(9.15, '#b1Panel', '#sA1');
ncUp(9.2);

/* ---------------- B1 9.3 → 15.2 ---------------- */
tl.fromTo('#b1c1', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 9.6);
tl.fromTo('#b1c1 .book', { opacity: 0, y: -260 }, { opacity: 1, y: 0, duration: .5, stagger: .28, ease: 'bounce.out' }, 10.4);
tl.fromTo('#b1c2', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 11.85);
popIn('#b1One', 12.05, { rotation: -20 }, .5, 'back.out(2.4)');
tl.fromTo('.cbar', { scaleY: 0 }, { scaleY: 1, duration: .45, stagger: .1, ease: 'back.out(1.6)' }, 13.0);
draw('#b1Trend', 13.3, .7, 0, 'power2.out');
popIn('#b1Up', 13.8, { y: 20 }, .45, 'back.out(2.2)');
toCfromB(15.15, '#b1Panel');
ncDown(15.15);

/* ---------------- C1 15.6 → 20.0 ---------------- */
riseIn('#c1Kick', 15.75, .5, 20);
riseIn('#c1Box', 15.9, .7, 60);
tl.fromTo('#c1Arc', { strokeDashoffset: 100 }, { strokeDashoffset: 22, duration: 3.0, ease: 'power1.inOut' }, 16.5);
tl.fromTo('.pk', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .5, stagger: .3 }, 17.55);
tl.fromTo('.pk .ick', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .25, ease: 'back.out(2.6)' }, 18.95);
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 19.95);
fromC(20.0);

/* ---------------- A2 23.5 → 27.0 ---------------- */
toA(23.35);
riseIn('#a2Kick', 23.65, .5, 20);
tl.fromTo('.firm', { opacity: 0, y: 80 }, { opacity: .8, y: 0, duration: .5, stagger: .1, ease: 'back.out(1.6)' }, 23.95);
tl.fromTo('#a2Cloud', { opacity: 0, scale: .7, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .6, ease: 'back.out(1.5)' }, 24.05);
tl.fromTo(['#a2t1', '#a2t2'], { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .3, stagger: .1, ease: 'back.out(2)' }, 24.2);
tl.fromTo('#a2Q', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45 }, 24.3);
tl.fromTo(['#a2q1', '#a2q2'], { opacity: 0, scale: 0, rotation: -30 }, { opacity: .85, scale: 1, rotation: 0, duration: .5, stagger: .15, ease: 'back.out(2.4)' }, 24.9);
tl.to('#a2Cloud', { keyframes: [{ scale: 1.04, duration: .15 }, { scale: 1, duration: .35, ease: 'back.out(3)' }] }, 25.75);
toBfromA(26.85, '#b2Panel', '#sA2');
ncUp(26.9);

/* ---------------- B2 27.0 → 31.35 ---------------- */
tl.fromTo('#b2l1', { opacity: 0, y: 80, rotation: -6 }, { opacity: 1, y: 0, rotation: 0, duration: .6, ease: 'back.out(1.6)' }, 27.45);
tl.fromTo('#b2l2', { opacity: 0, y: 80, rotation: 6 }, { opacity: 1, y: 0, rotation: 0, duration: .6, ease: 'back.out(1.6)' }, 27.85);
tl.fromTo('#b2Panel .ick', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .2, ease: 'back.out(2.6)' }, 28.4);
tl.fromTo('#b2Qm', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2)' }, 28.9);
tl.to('#b2Qm', { opacity: 0, scale: .3, rotation: 90, duration: .3, ease: 'power2.in' }, 30.0);
tl.fromTo('#b2Bulb', { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(2.2)' }, 30.2);
tl.fromTo('#b2Ans', { opacity: 0, y: 60, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6 }, 30.35);
fromB(31.3, '#b2Panel');
ncDown(31.3);

/* ---------------- REC 31.6 → 34.45 ---------------- */
tl.fromTo('#rc', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 31.95);
tl.fromTo('.sstar', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .1, ease: 'back.out(2.8)' }, 33.6);
tl.fromTo('#rcShine', { x: -300 }, { x: 1100, duration: .9, ease: 'power2.inOut' }, 34.0);
out('#rc', 34.4, { y: -50, filter: 'blur(10px)' }, .25);

/* ---------------- C2 34.6 → 37.05 ---------------- */
toC(34.5);
riseIn('#c2Kick', 34.7, .5, 20);
riseIn('#c2Board', 34.85, .6, 50);
draw('#c2Board .ln', 35.0, 1.4, .3, 'power1.inOut');
tl.fromTo('.teach', { opacity: 0, y: 70, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .5, stagger: .12, ease: 'back.out(1.8)' }, 35.15);
popIn('#c2Pro', 35.85, { y: 20 }, .45, 'back.out(2.2)');
tl.fromTo('#sC2', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 36.95);
toBfromC(37.0, '#b3Panel');
ncUp(37.0);

/* ---------------- B3 37.1 → 40.9 ---------------- */
tl.fromTo('#lv0', { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: .5 }, 37.45);
tl.fromTo('#lv1', { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: .5 }, 38.55);
tl.fromTo('#lv2', { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: .5 }, 39.6);
tl.to('#lv2', { boxShadow: '0 0 0 3px rgba(247,37,133,.9), 0 0 60px rgba(247,37,133,.45)', scale: 1.03, duration: .35 }, 39.95);
tl.fromTo('#b3Dive', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 37.5);
tl.fromTo('#b3Fill', { scaleY: 0 }, { scaleY: 1, duration: 2.8, ease: 'power1.inOut' }, 37.6);
tl.fromTo('#b3Arrow', { y: 0 }, { y: 430, duration: 2.8, ease: 'power1.inOut' }, 37.6);

/* speaker leaves — iris closes on her face, name card goes */
tl.set(cam, { ccx: SPLIT.tx, ccy: SPLIT.ty }, 40.8);
tl.to(cam, { cr: 0, duration: .3, ease: 'power2.in' }, 40.8);
out('#nc', 40.75, { x: -60, filter: 'blur(10px)' }, .3);
tl.fromTo('#sB3', { opacity: 1 }, { opacity: 0, duration: .35, ease: 'power2.in', immediateRender: false }, 40.95);

/* ---------------- END CARD 41.0 → 46.0 ---------------- */
tl.fromTo('#ecLogo', { opacity: 0, scale: .4, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.7)' }, 41.05);
tl.fromTo('#ecTitle', { opacity: 0, y: 50, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 41.25);
tl.fromTo('#ecLine', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power3.out' }, 41.45);
tl.fromTo('#ec', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 41.45);
tl.fromTo('#ec1', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 41.65);
draw('#ecPin .ln', 41.65, .7, .2, 'power2.out');
tl.fromTo('#ec2', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 41.9);
tl.fromTo('#ecShine', { x: -300 }, { x: 1250, duration: 1.0, ease: 'power2.inOut' }, 42.5);
tl.to('#ecPh', { keyframes: [{ rotation: -14, duration: .07 }, { rotation: 12, duration: .07 }, { rotation: -10, duration: .07 }, { rotation: 8, duration: .07 }, { rotation: 0, duration: .1 }] }, 42.9);
tl.to('#ecPin', { keyframes: [{ y: -14, duration: .2, ease: 'power2.out' }, { y: 0, duration: .45, ease: 'bounce.out' }] }, 43.3);
tl.fromTo('#ecShine', { x: -300 }, { x: 1250, duration: 1.0, ease: 'power2.inOut', immediateRender: false }, 44.6);
tl.to('#ecPh', { keyframes: [{ rotation: -14, duration: .07 }, { rotation: 12, duration: .07 }, { rotation: -10, duration: .07 }, { rotation: 8, duration: .07 }, { rotation: 0, duration: .1 }] }, 45.0);

tl.to({}, { duration: .01 }, 46.0);

/* ---------------- windows ---------------- */
const WIN = { sS0: [3.8, 6.3], sA1: [6.25, 9.6], sB1: [9.15, 15.9], sC1: [15.4, 20.3], sA2: [23.4, 27.3], sB2: [26.85, 32.0], sRec: [31.9, 34.7], sC2: [34.5, 37.4], sB3: [37.0, 41.35], sEnd: [41.0, 99] };
const SUB_HIDE = [[6.25, 9.25], [15.35, 20.0], [23.45, 26.95], [34.55, 37.05], [40.85, 99]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[9.4, 15.2], [27.1, 31.35], [37.2, 40.9]];

function sceneTick(t, blink) {
  { // A1: student dot travels the road to the centre
    const p = $('#a1Path'), L = p.getTotalLength(), k = eIO((t - 6.6) / 1.5), pt = p.getPointAtLength(L * k);
    $('#a1Me').style.transform = `translate(${pt.x - 48}px, ${220 + pt.y - 48}px) scale(${t < 8.1 ? 1 : 1 - .25 * eOut((t - 8.1) / .3)})`;
  }
  { const x = clamp((t - 16.5) / 3), e = x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; $('#c1Pct').textContent = Math.round(78 * e) + '%'; }
  $$('.qm').forEach((d, i) => { d.style.translate = `0 ${Math.sin(t * 2.2 + i * 2) * 12}px`; });
  $$('.spark').forEach((d, i) => { d.style.opacity = t > 4.8 ? .55 + .45 * Math.sin(t * 6 + i * 2) ** 2 : ''; });
  $('#b2Bulb').style.filter = t > 30.7 ? `brightness(${1 + .15 * Math.sin(t * 7) ** 2})` : '';
  $('#ecRing').style.transform = `rotate(${t * 40}deg)`;
  { const ph = ((t - 41.9) % 1.3 + 1.3) % 1.3 / 1.3; const pg = $('#ecPing'); pg.style.transform = `translate(-50%,-50%) scale(${1 + ph * 4.5})`; pg.style.opacity = t > 41.9 ? (1 - ph) * .9 : 0; }
  for (const [id, [a, b]] of Object.entries(WIN)) $('#' + id).style.visibility = (t >= a && t < b) ? 'visible' : 'hidden';
  $('#nc').style.visibility = (t >= .25 && t < 41.1) ? 'visible' : 'hidden';
}

/* ---------------- subtitles ---------------- */
const SIZES = [2, 3, 2, 1, 2, 1, 2, 1, 3, 1, 3, 2, 1, 3, 2, 2, 1, 1, 3, 2, 3, 2, 3, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 3, 2, 1, 2, 2, 2];
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
  const src = `../frames/${String(Math.min(frame + 1, 1057)).padStart(4, '0')}.jpg`;
  if (!img.src.endsWith(src.slice(2))) { img.src = src; await img.decode().catch(() => { }); }
  tl.seek(t, false);
  ambience(t, frame);
  applyCam(frame);
  subs(t);
  return t;
};
window.ready = (async () => { await document.fonts.ready; layoutSubs(); return true; })();
