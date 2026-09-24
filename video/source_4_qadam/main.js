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

/* ================= VIDEO 2 : "Operativ ijarani hisobga olishning 4 qadami" ================= */
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

/* speaker zoom choreography (talking-head parts only) */
tl.fromTo(cam, { zoom: 1 }, { zoom: 1.035, duration: 4.6, ease: 'none' }, 0);
tl.to(cam, { zoom: 1.06, duration: .35 }, 4.75);
tl.to(cam, { zoom: 1.07, duration: 3.0, ease: 'none' }, 5.1);
tl.to(cam, { zoom: 1.1, duration: .35 }, 8.05);
tl.to(cam, { zoom: 1.11, duration: 2.2, ease: 'none' }, 8.4);
tl.set(cam, { zoom: 1.0 }, 19.0);
tl.to(cam, { zoom: 1.03, duration: 1.2, ease: 'none' }, 20.2);
tl.set(cam, { zoom: 1.04 }, 24.7);
tl.to(cam, { zoom: 1.08, duration: 1.8, ease: 'none' }, 24.8);
tl.set(cam, { zoom: 1.05 }, 31.0);
tl.to(cam, { zoom: 1.09, duration: 4.0, ease: 'none' }, 31.1);
tl.set(cam, { zoom: 1.03 }, 46.3);
tl.to(cam, { zoom: 1.07, duration: 1.4, ease: 'none' }, 46.4);
tl.set(cam, { zoom: 1.0 }, 52.4);
tl.to(cam, { zoom: 1.07, duration: 5.2, ease: 'none' }, 52.5);

/* ---------------- HOOK 0.3 → 4.4 ---------------- */
tl.fromTo('#hk', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, .35);
draw('#hkBm .ln', .6, .7, 0);
['#hkS0', '#hkS1', '#hkS2', '#hkS3'].forEach((s, i) =>
  tl.fromTo(s, { scale: 1, backgroundColor: 'rgba(67,97,238,0)', color: '#aab6ec', borderColor: 'rgba(160,180,255,.4)' },
    { keyframes: [{ scale: 1.25, backgroundColor: '#4361ee', color: '#ffffff', borderColor: '#9fb8ff', duration: .15, ease: 'power2.out' }, { scale: 1, duration: .25, ease: 'back.out(3)' }] }, 2.1 + i * .1));
tl.to('#hkBm .ln', { fill: 'rgba(76,201,240,.55)', duration: .2, ease: 'none' }, 3.45);
tl.fromTo('#hkBm', { scale: 1 }, { keyframes: [{ scale: 1.35, duration: .12 }, { scale: 1, duration: .3, ease: 'back.out(3)' }] }, 3.45);
popIn('#hkSave', 3.5, { rotation: 10, y: 10 });
out('#hk', 4.3, { y: -50, filter: 'blur(10px)' }, .35);

/* ---------------- WARN 4.7 → 10.2 ---------------- */
tl.fromTo('#wc', { opacity: 0, y: -70, scale: .92, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 4.75);
tl.fromTo('#w1', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .6 }, 4.9);
popIn('#w1c', 6.95, { x: -20 });
draw('#wc .ln', 5.0, .7, .08);
tl.fromTo('#w2', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .6 }, 8.05);
tl.fromTo('#w2s', { scaleX: 0 }, { scaleX: 1, duration: .45 }, 9.4);
popIn('#w2c', 9.55, { rotation: -12 });
out('#wc', 10.05, { y: -50, filter: 'blur(10px)' }, .35);

/* ---------------- A1 10.55 → 16.3  MJtK 175¹ ---------------- */
toA(10.5);
riseIn('#a1Kick', 10.95, .6, 20);
tl.fromTo('#a1Num', { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 1.6 }, 10.95);
tl.fromTo('#a1Cover, #a1Page', { opacity: 0, y: 220, rotationX: 32 }, { opacity: 1, y: 0, rotationX: 0, duration: 1.1 }, 11.0);
draw('#a1Cover .ln', 11.3, 1.0, .08);
tl.to('#a1Cover', { rotationY: -170, duration: 1.0, ease: 'power3.inOut' }, 12.75);
tl.fromTo('#a1Page .skel', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .7, stagger: .08 }, 13.3);
tl.fromTo('#a1Hl', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power2.inOut' }, 13.85);
tl.to('#a1Num', { webkitTextStroke: '3px rgba(247,37,133,.45)', duration: .4, ease: 'none' }, 13.9);
tl.fromTo('#a1Block', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5 }, 14.55);
tl.fromTo('#a1Gavel', { opacity: 0, rotation: 60, transformOrigin: '464px 120px' }, { opacity: 1, rotation: 35, duration: .5 }, 14.6);
tl.to('#a1Gavel', { rotation: 0, duration: .16, ease: 'power4.in' }, 15.3);
tl.to('#a1Gavel', { rotation: 14, duration: .35, ease: 'power2.out' }, 15.46);
tl.fromTo('#a1Burst', { opacity: 0, width: 10, height: 10, x: 0, y: 0 }, { keyframes: [{ opacity: 1, duration: .01 }, { width: 700, height: 700, x: -345, y: -345, opacity: 0, duration: .6, ease: 'power2.out' }] }, 15.46);
tl.fromTo('#a1Page', { x: 0 }, { keyframes: [{ x: -12, duration: .04 }, { x: 10, duration: .05 }, { x: -6, duration: .05 }, { x: 0, duration: .06 }], ease: 'none', immediateRender: false }, 15.46);
tl.fromTo('#sA1', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.05, duration: .35, ease: 'power2.in', immediateRender: false }, 16.0);
toCfromA(16.15);

/* ---------------- C1 16.2 → 20.3  JARIMA ---------------- */
riseIn('#c1AmtW', 16.4, .7, 50);
tl.fromTo('#c1Rec', { y: -720 }, { y: 0, duration: 1.4, ease: 'power2.out' }, 16.9);
tl.fromTo('#c1Stamp', { opacity: 0, scale: 2.6, rotation: -24 }, { opacity: 1, scale: 1, rotation: -9, duration: .22, ease: 'power4.in' }, 18.1);
tl.fromTo('#c1Rec', { x: 0 }, { keyframes: [{ x: -12, duration: .04 }, { x: 10, duration: .05 }, { x: 0, duration: .06 }], ease: 'none', immediateRender: false }, 18.32);
popIn('#c1Warn', 18.75, { y: 20 }, .5, 'back.out(2.4)');
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .35, ease: 'power2.in', immediateRender: false }, 19.95);
fromC(20.0);

/* ---------------- B1 21.0 → 24.9  QADAM 1 ---------------- */
toB(20.95, '#b1Panel');
tl.fromTo('#b1d0', { opacity: 0, y: 90, rotationY: 28, transformPerspective: 1600 }, { opacity: 1, y: 0, rotationY: 0, duration: .9 }, 21.55);
tl.fromTo('#b1d1', { opacity: 0, y: 90, rotationY: -28, transformPerspective: 1600 }, { opacity: 1, y: 0, rotationY: 0, duration: .9 }, 22.25);
draw('#b1d0 .ln', 21.7, .7, .05); draw('#b1d1 .ln', 22.4, .7, .05);
tl.fromTo('#b1d0 .skel', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .6, stagger: .08 }, 21.9);
tl.fromTo('#b1d1 .skel', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .6, stagger: .08 }, 22.6);
draw('#b1sig0', 22.95, .55, 0, 'power1.inOut'); draw('#b1sig1', 23.15, .55, 0, 'power1.inOut');
tl.fromTo('#b1st0', { opacity: 0, scale: 2.4, rotation: -30 }, { opacity: 1, scale: 1, rotation: -10, duration: .2, ease: 'power4.in' }, 23.4);
tl.fromTo('#b1st1', { opacity: 0, scale: 2.4, rotation: -30 }, { opacity: 1, scale: 1, rotation: -10, duration: .2, ease: 'power4.in' }, 23.6);
popIn('#b1Ok', 23.95, { y: 20 });
fromB(24.75, '#b1Panel');

/* ---------------- A2 26.4 → 31.3  QADAM 2 ---------------- */
toA(26.3);
riseIn('#a2Kick', 26.8, .6, 20);
riseIn('#a2Bal', 26.85, .8, 80);
tl.fromTo('#a2Bal .skel', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .6, stagger: .04 }, 27.1);
tl.fromTo('#a2Line', { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'power3.inOut' }, 27.2);
popIn('#a2LineLab', 27.5, { y: 10 });
riseIn('#a2Slot', 27.55, .7, 60);
tl.fromTo('#a2Chip', { opacity: 0, y: 60, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .6, ease: 'back.out(1.8)' }, 27.3);
tl.fromTo('#a2ChipTag', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .4 }, 27.75);
tl.to('#a2LineLab', { borderColor: '#4cc9f0', color: '#bff0ff', boxShadow: '0 0 30px rgba(76,201,240,.7)', duration: .3, ease: 'none' }, 28.4);
tl.to('#a2Chip', { y: -300, scale: .55, opacity: 0, duration: .5, ease: 'power3.in' }, 28.45);
tl.fromTo('#a2Val', { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2)' }, 28.9);
tl.fromTo('#a2Flash', { opacity: 0 }, { keyframes: [{ opacity: 1, duration: .12 }, { opacity: 0, duration: .8, ease: 'power2.out' }] }, 28.92);
popIn('#a2Same', 29.15, { x: 20 });
popIn('#a2Ok', 29.6, { rotation: -10 }, .6, 'back.out(2.2)');
tl.fromTo('#sA2', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.05, duration: .35, ease: 'power2.in', immediateRender: false }, 31.0);
fromA(31.0);

/* ---------------- K3 chip 31.7 → 35.1 ---------------- */
tl.fromTo('#k3', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 31.75);
draw('#k3 .ln', 31.9, .8, .08);
out('#k3', 34.85, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- C2 35.2 → 40.6  Dt 9420 — Kt 6910 ---------------- */
toC(35.05);
popIn('#c2a', 35.45, { y: 60 }, .6, 'back.out(1.5)');
tl.to('#c2a', { boxShadow: '0 0 0 3px rgba(143,227,255,.8), 0 0 60px rgba(67,97,238,.7)', duration: .3, ease: 'none' }, 35.6);
popIn('#c2b', 36.95, { y: 60 }, .6, 'back.out(1.5)');
tl.to('#c2b', { boxShadow: '0 0 0 3px rgba(199,125,255,.8), 0 0 60px rgba(114,9,183,.7)', duration: .3, ease: 'none' }, 37.1);
draw('#c2Arr', 37.8, .6, 0, 'power2.inOut');
tl.fromTo('#c2Head', { opacity: 0 }, { opacity: 1, duration: .2, ease: 'none' }, 38.35);
popIn('#c2Tag', 38.85, { y: 20 });
tl.fromTo('#c2MonL', { opacity: 0 }, { opacity: 1, duration: .5, ease: 'none' }, 36.1);
tl.fromTo('#sC2', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 40.4);

/* ---------------- B2 40.6 → 46.4  QQS ---------------- */
toBfromC(40.45, '#b2Panel');
riseIn('#b2Esf', 40.95, .7, 60);
draw('#b2Esf .ln', 41.1, .7, .08);
popIn('#b2a', 41.15, { y: 40 }, .6, 'back.out(1.6)');
popIn('#b2b', 42.95, { y: 40 }, .6, 'back.out(1.6)');
tl.fromTo('#b2Arr2', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 43.2);
tl.fromTo('#b2Hl', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power2.inOut' }, 44.55);
draw('#b2Arr', 45.0, .4, 0, 'power2.out');
tl.to('#b2a', { boxShadow: '0 0 0 3px rgba(143,227,255,.85), 0 0 60px rgba(76,201,240,.7)', duration: .3, ease: 'none' }, 45.35);
fromB(46.3, '#b2Panel');

/* ---------------- C3 47.6 → 52.5  QADAM 4 ---------------- */
toC(47.5);
riseIn('#c3Con', 47.95, .7, 60);
draw('#c3Con .ln', 48.1, .7, .08);
tl.fromTo('#c3Bar', { scaleX: 0 }, { scaleX: 1, duration: .9, ease: 'power1.inOut' }, 48.4);
popIn('#c3End', 49.1, { rotation: 10, y: 10 });
tl.fromTo('#c3Title', { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .6 }, 49.3);
draw('#c3T', 49.45, .6, 0);
riseIn('#c3DH', 49.55, .5, 20); riseIn('#c3KH', 49.6, .5, 20);
riseIn('#c3Dr', 49.7, .5, 20);
popIn('#c3Asset', 49.8, { y: 20 });
draw('#c3Asset .ln', 49.85, .7, .05);
tl.fromTo('#c3Cr', { opacity: 0, y: 20, scale: 1.2 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(2)' }, 50.0);
tl.to('#c3KH', { textShadow: '0 0 26px rgba(247,37,133,.9)', duration: .3, ease: 'none' }, 50.0);
tl.to('#c3Asset', { x: 720, y: -40, opacity: 0, scale: .6, rotation: 12, duration: .75, ease: 'power3.in' }, 51.2);
popIn('#c3Sal', 51.35, { y: 20 });
popIn('#c3Ok', 51.8, { y: 20 });
tl.fromTo('#sC3', { opacity: 1 }, { opacity: 0, duration: .35, ease: 'power2.in', immediateRender: false }, 52.3);
fromC(52.35);

/* ---------------- SHARE 52.9 → 54.6 ---------------- */
tl.fromTo('#sh', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, 52.95);
draw('#sh .ln', 53.05, .7, .08);
tl.fromTo('.shav', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .45, stagger: .1, ease: 'back.out(2.2)' }, 53.55);
tl.fromTo('#shPlane', { opacity: 0, x: 230, y: 190, rotation: 0 }, { keyframes: [{ opacity: 1, duration: .05 }, { x: 1120, y: -160, rotation: -8, duration: .8, ease: 'power2.in' }] }, 53.7);
out('#sh', 54.4, { y: -50, filter: 'blur(10px)' }, .3);

/* ---------------- CTA 54.8 → end ---------------- */
tl.fromTo('#cta', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9 }, 54.85);
tl.fromTo('#ctaBrand', { opacity: 0, y: -50, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, 55.0);
tl.to('#ctaSend', { keyframes: [{ scale: .82, duration: .1 }, { scale: 1.12, duration: .15 }, { scale: 1, duration: .2 }] }, 56.75);

tl.to({}, { duration: .01 }, 58);

/* ---------------- windows ---------------- */
const WIN = {
  sHook: [.3, 4.7], sWarn: [4.7, 10.45], sA1: [10.5, 16.4], sC1: [16.1, 20.4], sB1: [20.9, 25.4],
  sA2: [26.3, 31.4], sK3: [31.7, 35.2], sC2: [35.0, 40.75], sB2: [40.4, 47.0], sC3: [47.5, 52.7],
  sShare: [52.9, 54.8], sCTA: [54.8, 99],
};
const SUB_HIDE = [[10.55, 20.3], [26.4, 31.25], [35.1, 40.5], [47.6, 52.45]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[20.95, 24.95], [40.5, 46.4]];
const SIZES = [2, 2, 3, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 3, 1, 1, 3, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 3, 2, 2, 2, 2, 2];

/* months strip */
const MON = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
const monEls = MON.map(m => { const d = document.createElement('div'); d.className = 'mon'; d.textContent = m; $('#c2Mon').appendChild(d); return d; });

function sceneTick(t, blink) {
  counter($('#c1Amt'), t, 16.4, 17.7, 2200000);
  monEls.forEach((d, i) => {
    const ta = 36.1 + i * .05, tc = 37.0 + i * .27;
    const a = eOut((t - ta) / .4);
    const on = t >= tc, pop = on ? eOut((t - tc) / .2) : 0;
    d.style.opacity = a;
    d.style.transform = `translateY(${(1 - a) * 30}px) scale(${1 + .12 * Math.sin(Math.PI * pop)})`;
    d.style.background = on ? 'linear-gradient(120deg,#4361ee,#7209b7)' : 'rgba(255,255,255,.07)';
    d.style.color = on ? '#fff' : '#aab6ec';
    d.style.borderColor = on ? 'rgba(160,200,255,.8)' : 'rgba(160,180,255,.25)';
    d.style.boxShadow = on ? '0 8px 24px rgba(67,97,238,.45)' : 'none';
  });
  const arr = $('#c2Arr'), L = arr.getTotalLength();
  const cp = clamp((t - 38.4) % 1.1 / .9);
  const pt = arr.getPointAtLength(L * eIO(cp));
  const coin = $('#c2Coin');
  coin.setAttribute('cx', pt.x); coin.setAttribute('cy', pt.y);
  coin.style.opacity = t > 38.4 ? Math.sin(Math.PI * cp) : 0;
  $('#c1Warn').style.filter = `drop-shadow(0 0 ${10 + 20 * Math.sin(t * 8) ** 2}px #f72585)`;
  typed($('#ctaTyped'), t, 56.22, 56.6, 'XIZMAT');
  $('#ctaPh').style.display = t >= 56.22 ? 'none' : '';
  $('#ctaCaret').style.opacity = t > 56.7 ? 0 : blink;
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
