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
