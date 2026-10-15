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
