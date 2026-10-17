/* ================= VIDEO 12 : Javohir — o'quvchi fikri ================= */
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
const ORBS = [];
for (let i = 0; i < 6; i++) { const o = document.createElement('div'); o.className = 'orb'; $('#b2Orbs').appendChild(o); ORBS.push(o); }

/* speaker — small in frame, talking-head parts are pushed in */
tl.fromTo(cam, { zoom: 1.45 }, { zoom: 1.5, duration: 2.6, ease: 'none' }, 0);
tl.set(cam, { zoom: 1.45 }, 14.0);
tl.to(cam, { zoom: 1.48, duration: 1.6, ease: 'none' }, 14.05);
tl.set(cam, { zoom: 1.45 }, 25.7);
tl.to(cam, { zoom: 1.5, duration: 4.2, ease: 'none' }, 25.75);

/* ---------------- A1 2.75 → 7.5 ---------------- */
toA(2.55);
riseIn('#a1Kick', 2.9, .5, 20);
draw('#a1Hero .ln', 3.0, 1.0, .15, 'power2.out');
tl.fromTo('#a1Halo', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .8 }, 3.0);
tl.fromTo('#a1Cap', { opacity: 0, y: -140, rotation: -20 }, { opacity: 1, y: 0, rotation: 0, duration: .6, ease: 'bounce.out' }, 3.25);
tl.fromTo('#a1Dir', { opacity: 0, y: 40, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .55 }, 3.4);
tl.to('#a1Cap', { keyframes: [{ y: -50, rotation: 12, duration: .25, ease: 'power2.out' }, { y: 0, rotation: 0, duration: .45, ease: 'bounce.out' }] }, 3.85);
tl.fromTo('#a1Sk', { opacity: 0, y: 70, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6 }, 4.75);
tl.fromTo(['#a1b1', '#a1b2'], { scaleX: 0 }, { scaleX: .4, duration: .6, stagger: .15 }, 5.1);
tl.to('#a1b1', { scaleX: .92, duration: .8, ease: 'power2.inOut' }, 6.35);
tl.to('#a1b2', { scaleX: .88, duration: .8, ease: 'power2.inOut' }, 6.5);
tl.fromTo('#a1Up', { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: .45, ease: 'back.out(2.6)' }, 6.35);
toBfromA(7.45, '#b1Panel', '#sA1');
ncUp(7.5);

/* ---------------- B1 7.6 → 10.05 ---------------- */
tl.fromTo('#b1Brand', { opacity: 0, y: -40, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .55, ease: 'back.out(1.8)' }, 7.75);
tl.fromTo('#b1o1', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .55 }, 8.05);
tl.fromTo('#b1o2', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .55 }, 8.5);
tl.fromTo('#b1Panel .ick', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .12, ease: 'back.out(2.6)' }, 8.9);
tl.to(['#b1o1', '#b1o2'], { boxShadow: '0 0 0 3px rgba(76,201,240,.85), 0 0 60px rgba(76,201,240,.4)', duration: .3, ease: 'none' }, 8.9);
popIn('#b1Ok', 9.0, { y: 20 }, .4, 'back.out(2.2)');
toCfromB(10.0, '#b1Panel');
ncDown(10.0);

/* ---------------- C1 10.15 → 14.0 ---------------- */
riseIn('#c1Kick', 10.3, .5, 20);
tl.fromTo('#c1a', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .55 }, 11.75);
tl.fromTo('#c1b', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .55 }, 12.2);
tl.fromTo('#c1Deep', { opacity: 0, y: 60, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .45 }, 12.75);
tl.fromTo('#c1Bar', { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'power2.inOut' }, 13.0);
tl.fromTo('#sC1 .ick', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .3, stagger: .1, ease: 'back.out(2.6)' }, 13.3);
tl.fromTo('#c1Ok', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(2.4)' }, 13.35);
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 13.95);
fromC(14.0);

/* ---------------- B2 15.6 → 20.65 ---------------- */
toB(15.55, '#b2Panel');
ncUp(15.55);
tl.fromTo('#b2T', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .6 }, 15.8);
tl.fromTo('#b2Me', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .6 }, 16.4);
tl.fromTo('#b2Me .chip', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .35, stagger: .5, ease: 'back.out(2.4)' }, 17.1);
tl.fromTo('.astep', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4, stagger: .15 }, 18.65);
tl.fromTo('#b2RunF', { scaleX: 0 }, { scaleX: .72, duration: 1.4, ease: 'power1.inOut' }, 19.2);
tl.fromTo('#b2RunL', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 19.65);
tl.fromTo('.astep .ick', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .3, stagger: .4, ease: 'back.out(2.6)' }, 19.3);
tl.to('.astep', { color: '#fff', borderColor: 'rgba(76,201,240,.85)', backgroundColor: 'rgba(76,201,240,.14)', duration: .25, stagger: .4, ease: 'none' }, 19.3);
fromB(20.6, '#b2Panel');
ncDown(20.6);

/* ---------------- A2 20.75 → 25.7 ---------------- */
toA(20.55);
riseIn('#a2Kick', 20.9, .5, 20);
tl.fromTo('#a2c0', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 21.2);
tl.fromTo('#a2g0', { scaleY: 0 }, { scaleY: 1, duration: .6, ease: 'back.out(1.4)' }, 21.2);
tl.fromTo('#a2c1', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 22.95);
tl.fromTo('#a2g1', { scaleY: 0 }, { scaleY: .55, duration: .7, ease: 'power2.out' }, 22.95);
tl.to('#a2g1', { scaleY: 1, duration: .7, ease: 'back.out(1.6)' }, 24.65);
draw('#a2Arr', 24.65, .7, .1, 'power2.out');
tl.fromTo('#a2Tag', { opacity: 0, y: 50, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(2)' }, 25.1);
tl.fromTo('#sA2', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.04, duration: .3, ease: 'power2.in', immediateRender: false }, 25.62);
fromA(25.7);

/* ---------------- REC 25.95 → 29.85 ---------------- */
tl.fromTo('#rc', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .7 }, 25.95);
popIn('#rcT1', 27.3, { y: 10 }, .4, 'back.out(2.4)');
popIn('#rcT2', 28.05, { y: 10 }, .4, 'back.out(2.4)');
tl.fromTo('.sstar', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .3, stagger: .08, ease: 'back.out(2.8)' }, 28.65);
tl.fromTo('#rcShine', { x: -300 }, { x: 1100, duration: .8, ease: 'power2.inOut' }, 29.1);
out('#rc', 29.8, { y: -40, filter: 'blur(10px)' }, .25);

/* speaker leaves — iris closes on his face */
tl.set(cam, { ccx: IRIS.ccx, ccy: IRIS.ccy }, 29.85);
tl.to(cam, { cr: 0, duration: .3, ease: 'power2.in' }, 29.85);
tl.to(cam, { ringA: 1, duration: .08, ease: 'none' }, 29.85);
tl.to(cam, { ringA: 0, duration: .12, ease: 'none' }, 30.05);
out('#nc', 29.8, { x: -60, filter: 'blur(10px)' }, .3);

/* ---------------- END CARD 30.05 → 35.0 ---------------- */
const E = 30.05 - 35.05;
tl.fromTo('#ecLogo', { opacity: 0, scale: .4, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.7)' }, 35.05 + E);
tl.fromTo('#ecTitle', { opacity: 0, y: 50, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 35.25 + E);
tl.fromTo('#ecLine', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power3.out' }, 35.45 + E);
tl.fromTo('#ec', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 35.45 + E);
tl.fromTo('#ec1', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 35.65 + E);
draw('#ecPin .ln', 35.65 + E, .7, .2, 'power2.out');
tl.fromTo('#ec2', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 35.9 + E);
tl.fromTo('#ecShine', { x: -300 }, { x: 1250, duration: 1.0, ease: 'power2.inOut' }, 36.5 + E);
tl.to('#ecPh', { keyframes: [{ rotation: -14, duration: .07 }, { rotation: 12, duration: .07 }, { rotation: -10, duration: .07 }, { rotation: 8, duration: .07 }, { rotation: 0, duration: .1 }] }, 36.9 + E);
tl.to('#ecPin', { keyframes: [{ y: -14, duration: .2, ease: 'power2.out' }, { y: 0, duration: .45, ease: 'bounce.out' }] }, 37.3 + E);
tl.fromTo('#ecShine', { x: -300 }, { x: 1250, duration: 1.0, ease: 'power2.inOut', immediateRender: false }, 38.6 + E);
tl.to('#ecPh', { keyframes: [{ rotation: -14, duration: .07 }, { rotation: 12, duration: .07 }, { rotation: -10, duration: .07 }, { rotation: 8, duration: .07 }, { rotation: 0, duration: .1 }] }, 39.0 + E);

tl.to({}, { duration: .01 }, 35.0);

/* ---------------- windows ---------------- */
const WIN = { sA1: [2.7, 7.85], sB1: [7.45, 10.7], sC1: [10.1, 14.3], sB2: [15.55, 21.3], sA2: [20.7, 26.0], sRec: [25.9, 30.1], sEnd: [30.0, 99] };
const SUB_HIDE = [[2.75, 7.5], [10.15, 14.0], [20.75, 25.7], [29.9, 99]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[7.65, 10.05], [15.75, 20.65]];

function sceneTick(t, blink) {
  $('#a1n1').textContent = Math.round(100 * parseFloat(gsap.getProperty('#a1b1', 'scaleX'))) + '%';
  $('#a1n2').textContent = Math.round(100 * parseFloat(gsap.getProperty('#a1b2', 'scaleX'))) + '%';
  ORBS.forEach((o, i) => { // knowledge orbs: teachers → me
    const dt = t - 16.6 - i * .28, k = clamp(dt / .9), e = eIO(k);
    const x = lerp(370, 650, e), y = 200 + Math.sin(Math.PI * e) * -110 + (i % 3 - 1) * 30;
    o.style.transform = `translate(${x}px, ${y}px) scale(${.6 + .4 * Math.sin(Math.PI * e)})`;
    o.style.opacity = dt > 0 && k < 1 ? 1 : 0;
  });
  $('#a2Tag').style.boxShadow = t > 25.2 ? `0 0 ${20 + 30 * Math.sin(t * 6) ** 2}px rgba(247,37,133,.5)` : '';
  $('#ecRing').style.transform = `rotate(${t * 40}deg)`;
  { const ph = ((t - 30.9) % 1.3 + 1.3) % 1.3 / 1.3; const pg = $('#ecPing'); pg.style.transform = `translate(-50%,-50%) scale(${1 + ph * 4.5})`; pg.style.opacity = t > 30.9 ? (1 - ph) * .9 : 0; }
  for (const [id, [a, b]] of Object.entries(WIN)) $('#' + id).style.visibility = (t >= a && t < b) ? 'visible' : 'hidden';
  $('#nc').style.visibility = (t >= .25 && t < 30.15) ? 'visible' : 'hidden';
}
