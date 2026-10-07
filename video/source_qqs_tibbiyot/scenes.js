/* ================= VIDEO 9 : "QQS — tibbiy xizmatlar imtiyozi bekor qilindi" ================= */
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
function toAfromC(t) {
  tl.to(cam, { cr: 0, duration: .45, ease: 'power3.in' }, t);
  tl.to(cam, { ringA: 0, duration: .15, ease: 'none' }, t + .3);
}

/* ---------- generated content ---------- */
{ // timeline ticks (C1)
  const box = $('#c1Ticks');
  for (let i = 0; i <= 12; i++) { const x = 60 + i * 70; const d = document.createElement('div'); d.className = 'tick'; d.style.left = x + 'px'; box.appendChild(d); }
  [['2 yil oldin', 130], ['1 yil oldin', 420]].forEach(([s, x]) => { const d = document.createElement('div'); d.className = 'tlab'; d.style.left = x + 'px'; d.textContent = s; box.appendChild(d); });
}
const INV = [[100, 0], [270, 0], [450, 1], [570, 1], [690, 1], [790, 1]];
const invEls = INV.map(([x, ok], i) => {
  const d = document.createElement('div'); d.className = 'inv ' + (ok ? 'in' : 'outw');
  d.style.left = (x - 52) + 'px'; d.style.top = (380 + (i % 2) * 0) + 'px';
  d.innerHTML = '<i style="width:70%"></i><i></i><i style="width:55%"></i><b>QQS</b><div class="st" style="background:' + (ok ? 'linear-gradient(135deg,#4cc9f0,#4361ee)' : 'linear-gradient(135deg,#f72585,#b5179e)') + '">' + (ok ? '✓' : '✕') + '</div>';
  $('#c1Inv').appendChild(d); return d;
});
const YRS = [[2019, 15], [2020, 15], [2021, 15], [2022, 15], [2023, 12], [2024, 12], [2025, 12]];
const yrEls = YRS.map(([y, r]) => {
  const d = document.createElement('div'); d.className = 'yr';
  const nw = r === 12;
  d.innerHTML = `<div class="bar" style="height:${r * 22}px;background:${nw ? 'linear-gradient(180deg,#4cc9f0,#4361ee)' : 'linear-gradient(180deg,rgba(150,120,255,.55),rgba(80,60,160,.35))'};${nw ? 'box-shadow:0 0 30px rgba(76,201,240,.45)' : ''}">${r}%</div><div class="y">${y}</div>`;
  $('#b2Years').appendChild(d); return d;
});
for (let i = 0; i < 12; i++) { const k = document.createElement('div'); k.className = 'key'; $('#b3Keys').appendChild(k); }
const CONF = [];
for (let i = 0; i < 34; i++) {
  const d = document.createElement('div'); d.className = 'cf';
  const r = (i * 9301 + 49297) % 233280 / 233280, r2 = (i * 7919 + 1237) % 1000 / 1000;
  d.style.background = ['#4cc9f0', '#4361ee', '#f72585', '#c77dff', '#ffd98a'][i % 5];
  $('#a3Conf').appendChild(d); CONF.push({ d, a: r * Math.PI * 2, v: 420 + r2 * 520, rot: r2 * 720 - 360 });
}

/* speaker zoom — gentle, the banner sits above the head */
tl.fromTo(cam, { zoom: 1 }, { zoom: 1.035, duration: 4.2, ease: 'none' }, 0);
tl.set(cam, { zoom: 1.0 }, 23.5);
tl.to(cam, { zoom: 1.02, duration: 1.2, ease: 'none' }, 23.55);
tl.set(cam, { zoom: 1.0 }, 53.7);
tl.to(cam, { zoom: 1.035, duration: 5, ease: 'none' }, 53.75);

/* ---------------- BANNER 0.35 → 14.8 ---------------- */
tl.fromTo('#banner', { opacity: 0, y: -70, scale: .9, filter: 'blur(14px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8 }, .35);
tl.fromTo('#bnIco', { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: .7, ease: 'back.out(2)' }, .55);
out('#banner', 14.75, { y: -50, filter: 'blur(10px)' }, .35);

/* name card rides up above the seam while the split is on */
tl.to('#nc', { y: -722, duration: .7, ease: 'power3.inOut' }, 8.4);

/* ---------------- S0 1.9 → 4.0 ---------------- */
tl.fromTo('#s0Card', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 1.9);
draw('#s0Card .ln', 2.05, .8, .1);
tl.fromTo('#s0Stamp', { opacity: 0, scale: 2.4, rotation: -4 }, { opacity: 1, scale: 1, rotation: -8, duration: .35, ease: 'power4.in' }, 2.75);
tl.fromTo('#s0Card', { x: 0 }, { keyframes: [{ x: -10, duration: .05 }, { x: 8, duration: .05 }, { x: 0, duration: .08 }] }, 3.1);
out('#s0Card', 3.85, { x: -60, filter: 'blur(10px)' }, .3);

/* ---------------- A1 4.3 → 8.45 ---------------- */
toA(4.1);
riseIn('#a1Kick', 4.55, .5, 20);
draw('#a1Clin .ln', 4.6, 1.1, .08, 'power2.out');
popIn('#a1Cross', 5.2, { rotation: -60 }, .6, 'back.out(2.2)');
tl.fromTo('.win', { background: 'rgba(143,227,255,.08)' }, { background: 'rgba(143,227,255,.75)', duration: .2, stagger: .08, ease: 'none' }, 5.35);
popIn('#a1Tag', 5.5, { y: 20 }, .5, 'back.out(2)');
tl.fromTo('#a1Fmk', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 5.75);
tl.fromTo('#a1Path', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 6.05);
tl.fromTo('#a1Env', { opacity: 0 }, { opacity: 1, duration: .1, ease: 'none' }, 6.2);
tl.to('#a1Env', { opacity: 0, duration: .1, ease: 'none' }, 6.9);
tl.fromTo('#a1Ping', { scale: 0 }, { scale: 1, duration: .35, ease: 'back.out(3)' }, 6.9);
tl.to('#a1Fmk', { keyframes: [{ scale: 1.05, duration: .12 }, { scale: 1, duration: .3, ease: 'back.out(3)' }] }, 6.9);
tl.fromTo('#a1Bub', { opacity: 0, y: 60, scale: .85, filter: 'blur(12px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .55, ease: 'back.out(1.6)' }, 6.6);
tl.fromTo('#a1Q', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .4 }, 7.2);
tl.fromTo('.qm', { opacity: 0, scale: 0, rotation: -30 }, { opacity: .85, scale: 1, rotation: 0, duration: .5, stagger: .12, ease: 'back.out(2.4)' }, 7.4);
toBfromA(8.35, '#b1Panel', '#sA1');

/* ---------------- B1 8.45 → 16.35 ---------------- */
tl.fromTo('#b1Step', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .6, ease: 'back.out(1.6)' }, 8.75);
riseIn('#b1c1', 9.5, .7, 60);
draw('#b1c1 .ln', 9.6, .8, .08);
riseIn('#b1c2', 11.3, .7, 60);
draw('#b1c2 .ln', 11.4, .8, .08);
tl.fromTo('.iscan', { opacity: 0, y: 140 }, { keyframes: [{ opacity: 1, duration: .05 }, { y: 400, duration: .7, ease: 'power1.inOut' }, { opacity: 0, duration: .05 }] }, 12.6);
tl.fromTo('.ick', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .3, stagger: .1, ease: 'back.out(2.6)' }, 12.8);
tl.fromTo('#b1Date', { opacity: 0, y: 60, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 13.95);
tl.fromTo('#b1Cal', { rotationX: 90 }, { rotationX: 0, duration: .6, ease: 'back.out(1.6)' }, 14.3);
tl.to('#b1Date', { boxShadow: '0 0 0 3px rgba(247,37,133,.85), 0 0 60px rgba(247,37,133,.4)', duration: .3, ease: 'none' }, 15.2);
toCfromB(16.3, '#b1Panel');

/* ---------------- C1 16.5 → 23.55 ---------------- */
tl.fromTo('#c1Step', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5, ease: 'back.out(1.8)' }, 16.7);
riseIn('#c1Box', 16.85, .7, 60);
tl.fromTo('#c1Axis', { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'power2.inOut' }, 17.0);
tl.fromTo('#c1Ticks', { opacity: 0 }, { opacity: 1, duration: .4, ease: 'none' }, 17.3);
tl.fromTo('#c1Mark', { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .5, ease: 'bounce.out' }, 17.35);
tl.fromTo('#c1MarkL', { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 17.6);
tl.fromTo('#c1Win', { opacity: 0, scaleX: 0, transformOrigin: '100% 50%' }, { opacity: 1, scaleX: 1, duration: .8, ease: 'power3.inOut' }, 17.85);
tl.fromTo('.inv', { opacity: 0, y: -80, rotation: -8 }, { opacity: 1, y: 0, rotation: 0, duration: .5, stagger: .22, ease: 'back.out(1.8)' }, 19.3);
tl.to('.inv.outw', { opacity: .35, filter: 'grayscale(1)', duration: .3, ease: 'none' }, 22.4);
tl.to('.inv.in', { y: -16, boxShadow: '0 0 0 4px #4cc9f0, 0 0 40px rgba(76,201,240,.7)', duration: .35, stagger: .08 }, 22.4);
tl.to('.inv .st', { opacity: 1, duration: .25, stagger: .06, ease: 'none' }, 22.45);
popIn('#c1Res', 22.95, { y: 20 }, .45, 'back.out(2.2)');
tl.fromTo('#sC1', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 23.45);
fromC(23.5);

/* ---------------- S3 23.85 → 24.55 ---------------- */
tl.fromTo('#s3Step', { opacity: 0, scale: .6, filter: 'blur(12px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .45, ease: 'back.out(2)' }, 23.85);
out('#s3Step', 24.45, { scale: .9 }, .2);

/* ---------------- A2 24.7 → 30.05 ---------------- */
toA(24.5);
tl.fromTo('#a2Step', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .5 }, 24.85);
tl.fromTo('#a2bk2', { opacity: 0, rotation: 0, y: 60 }, { opacity: .55, rotation: -7, y: 0, duration: .6 }, 24.9);
tl.fromTo('#a2bk1', { opacity: 0, rotation: 0, y: 60 }, { opacity: .75, rotation: 5, y: 0, duration: .6 }, 25.0);
tl.fromTo('#a2Card', { opacity: 0, y: 80, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 25.1);
tl.to('#a2Date', { borderColor: 'rgba(143,227,255,.95)', boxShadow: '0 0 30px rgba(76,201,240,.45)', duration: .3, ease: 'none' }, 25.85);
tl.to('#a2Vat', { width: '11%', duration: .7, ease: 'power3.inOut' }, 26.6);
tl.to('#a2Net', { width: '89%', duration: .7, ease: 'power3.inOut' }, 26.6);
tl.fromTo(['#a2l1', '#a2l2'], { opacity: 0 }, { opacity: 1, duration: .3, ease: 'none' }, 27.0);
tl.fromTo('#a2F', { opacity: 0, y: 50, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6 }, 27.95);
tl.fromTo('#a2Res', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2.6)' }, 28.5);
tl.fromTo('#a2Coin', { opacity: 0, y: -640, scale: .4 }, { opacity: 1, y: 0, scale: 1, duration: .6, ease: 'power3.out' }, 29.2);
popIn('#a2Ok', 29.6, { y: 20 }, .4, 'back.out(2.2)');
toBfromA(30.0, '#b2Panel', '#sA2');

/* ---------------- B2 30.1 → 34.0 ---------------- */
tl.fromTo('.yr .bar', { scaleY: 0 }, { scaleY: 1, duration: .5, stagger: .08, ease: 'back.out(1.4)' }, 30.4);
tl.fromTo('.yr .y', { opacity: 0 }, { opacity: 1, duration: .3, stagger: .08, ease: 'none' }, 30.5);
tl.fromTo('#b2Brk', { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power3.out' }, 31.6);
popIn('#b2Tag', 31.7, { y: 20 }, .45, 'back.out(2)');
tl.to(yrEls.slice(4).map(e => e.querySelector('.bar')), { y: -16, duration: .35, stagger: .07, ease: 'back.out(2)' }, 32.1);
tl.to(yrEls.slice(0, 4), { opacity: .45, duration: .3, ease: 'none' }, 32.1);
tl.fromTo('#b2Big', { opacity: 0, scale: .4, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .55, ease: 'back.out(1.8)' }, 33.1);
toCfromB(33.95, '#b2Panel');

/* ---------------- C2 34.1 → 44.1 ---------------- */
tl.fromTo('#c2Step', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5, ease: 'back.out(1.8)' }, 34.3);
popIn('#c2Sum', 35.15, { y: 20 }, .5, 'back.out(2)');
riseIn('#c2D5', 36.6, .7, 70);
riseIn('#c2D3', 36.8, .7, 70);
tl.to('#c2D5', { boxShadow: '0 0 0 4px rgba(76,201,240,.9), 0 0 60px rgba(76,201,240,.4)', scale: 1.03, duration: .35 }, 38.55);
tl.to('#c2R5', { backgroundColor: 'rgba(247,37,133,.2)', borderColor: 'rgba(247,37,133,.95)', duration: .3, ease: 'none' }, 39.5);
tl.to('#c2D5', { boxShadow: '0 0 0 0px rgba(76,201,240,0), 0 0 0px rgba(76,201,240,0)', scale: 1, opacity: .7, duration: .35 }, 41.25);
tl.to('#c2D3', { boxShadow: '0 0 0 4px rgba(76,201,240,.9), 0 0 60px rgba(76,201,240,.4)', scale: 1.03, duration: .35 }, 41.3);
tl.to('#c2R3', { backgroundColor: 'rgba(76,201,240,.2)', borderColor: 'rgba(76,201,240,.95)', duration: .3, ease: 'none' }, 42.25);
tl.fromTo('#c2Fly', { opacity: 0, x: 290, y: 1286, scale: .6 }, { opacity: 1, scale: 1, duration: .25, ease: 'back.out(2)' }, 42.55);
tl.to('#c2Fly', { x: 820, duration: .7, ease: 'power3.inOut' }, 42.8);
tl.to('#c2Fly', { opacity: 0, scale: .8, duration: .15, ease: 'none' }, 43.5);
popIn('#c2Ok', 43.6, { y: 20 }, .4, 'back.out(2.2)');
tl.to('#c2R3', { keyframes: [{ scale: 1.06, duration: .12 }, { scale: 1, duration: .3, ease: 'back.out(3)' }] }, 43.55);
tl.fromTo('#sC2', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power2.in', immediateRender: false }, 44.0);
toAfromC(44.0);

/* ---------------- A3 44.3 → 49.85 ---------------- */
riseIn('#a3Kick', 44.4, .5, 20);
tl.fromTo('#a3Halo', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: 1 }, 44.45);
draw('#a3Sh .ln', 44.5, 1.0, .35, 'power2.inOut');
tl.fromTo('#a3r0', { opacity: 0, x: -100, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 45.15);
popIn('#a3b0', 47.9, { x: 30 }, .45, 'back.out(2.2)');
tl.to('#a3Sh', { keyframes: [{ scale: 1.08, duration: .15 }, { scale: 1, duration: .4, ease: 'back.out(3)' }] }, 47.9);
tl.fromTo('#a3r1', { opacity: 0, x: 100, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .6 }, 48.6);
tl.fromTo('#a3Strike', { scaleX: 0 }, { scaleX: 1, duration: .3, ease: 'power2.out' }, 49.05);
popIn('#a3b1', 49.2, { scale: 2 }, .4, 'back.out(2.4)');
toBfromA(49.8, '#b3Panel', '#sA3');

/* ---------------- B3 49.9 → 53.75 ---------------- */
tl.fromTo('#b3Pos', { opacity: 0, y: 120 }, { opacity: 1, y: 0, duration: .7 }, 50.1);
tl.fromTo('#b3Scr', { opacity: .2 }, { opacity: 1, duration: .3, ease: 'none' }, 50.75);
tl.fromTo('#b3Set', { opacity: 0, x: 100, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .6 }, 51.25);
tl.fromTo('#b3o0', { borderColor: 'rgba(160,180,255,.25)' }, { borderColor: 'rgba(247,37,133,.9)', backgroundColor: 'rgba(247,37,133,.15)', duration: .3, ease: 'none' }, 51.6);
tl.to('#b3o0', { borderColor: 'rgba(160,180,255,.25)', backgroundColor: 'rgba(0,0,0,.25)', opacity: .5, duration: .25, ease: 'none' }, 52.3);
tl.to('#b3o1', { borderColor: 'rgba(76,201,240,.95)', backgroundColor: 'rgba(76,201,240,.2)', boxShadow: '0 0 40px rgba(76,201,240,.45)', scale: 1.04, duration: .3 }, 52.3);
tl.fromTo('#b3Rc', { y: 300 }, { y: 0, duration: .8, ease: 'power2.out' }, 52.95);
popIn('#b3Ok', 53.05, { y: 20 }, .4, 'back.out(2.2)');
fromB(53.7, '#b3Panel');

/* ---------------- CTA 54.0 → 58.6 ---------------- */
tl.fromTo('#ctaQ', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7 }, 54.15);
tl.to('#ctaQ', { keyframes: [{ scale: 1.05, duration: .15 }, { scale: 1, duration: .35, ease: 'back.out(3)' }] }, 56.0);
out('#ctaQ', 56.75, { x: -60, filter: 'blur(10px)' }, .3);
tl.fromTo('#cta', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6 }, 56.6);
tl.fromTo('#ctaSub', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .4 }, 57.95);
tl.to('#ctaSend', { keyframes: [{ scale: .82, duration: .1 }, { scale: 1.12, duration: .15 }, { scale: 1, duration: .2 }] }, 57.5);
out('#cta', 58.5, { y: 40, filter: 'blur(10px)' }, .25);

/* speaker leaves — iris closes on the face */
tl.set(cam, { ccx: IRIS.ccx, ccy: IRIS.ccy }, 58.55);
tl.to(cam, { cr: 0, duration: .3, ease: 'power2.in' }, 58.55);
tl.to(cam, { ringA: 1, duration: .08, ease: 'none' }, 58.55);
tl.to(cam, { ringA: 0, duration: .12, ease: 'none' }, 58.8);

/* ---------------- END CARD 58.8 → 61.8 ---------------- */
tl.fromTo('#ecLogo', { opacity: 0, scale: .4, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.7)' }, 58.8);
tl.fromTo('#ecTitle', { opacity: 0, y: 50, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 59.0);
tl.fromTo('#ecLine', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power3.out' }, 59.2);
tl.fromTo('#ec', { opacity: 0, y: 90, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 }, 59.2);
tl.fromTo('#ec1', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 59.4);
draw('#ecPin .ln', 59.4, .7, .2, 'power2.out');
tl.fromTo('#ec2', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5 }, 59.65);
tl.fromTo('#ecShine', { x: -300 }, { x: 1250, duration: 1.0, ease: 'power2.inOut' }, 60.2);
tl.to('#ecPh', { keyframes: [{ rotation: -14, duration: .07 }, { rotation: 12, duration: .07 }, { rotation: -10, duration: .07 }, { rotation: 8, duration: .07 }, { rotation: 0, duration: .1 }] }, 60.6);
tl.to('#ecPin', { keyframes: [{ y: -14, duration: .2, ease: 'power2.out' }, { y: 0, duration: .45, ease: 'bounce.out' }] }, 60.9);

tl.to({}, { duration: .01 }, 61.8);

/* ---------------- windows ---------------- */
const WIN = { sS0: [1.85, 4.2], sA1: [4.3, 8.75], sB1: [8.35, 17.0], sC1: [16.5, 23.8], sS3: [23.8, 24.7], sA2: [24.7, 30.4], sB2: [30.0, 34.6], sC2: [34.0, 44.35], sA3: [44.3, 50.2], sB3: [49.8, 54.4], sCTA: [54.1, 58.8], sEnd: [58.75, 99] };
const SUB_HIDE = [[4.35, 8.45], [16.55, 23.55], [24.75, 30.1], [34.15, 44.05], [44.3, 49.9], [58.55, 99]];
const inWin = (t, ws) => ws.some(([a, b]) => t >= a && t < b);
const SPLIT_WIN = [[8.6, 16.35], [30.2, 34.0], [49.95, 53.75]];

function sceneTick(t, blink) {
  // A1 envelope along its path
  {
    const p = $('#a1Path'), L = p.getTotalLength(), k = eIO((t - 6.2) / .7), pt = p.getPointAtLength(L * k);
    $('#a1Env').style.transform = `translate(${pt.x - 48}px, ${500 + pt.y - 36}px) rotate(${-14 + 28 * k}deg)`;
    $('#a1Path').style.strokeDashoffset = -t * 40;
  }
  $$('.tdot').forEach((d, i) => { d.style.transform = `translateY(${-14 * Math.max(0, Math.sin((t * 7) - i * .9))}px)`; });
  $('#a1Dots').style.opacity = t < 7.15 ? 1 : 0;
  $$('.qm').forEach((d, i) => { d.style.translate = `0 ${Math.sin(t * 2.2 + i * 2) * 12}px`; });
  $('#a1Ping').style.boxShadow = `0 0 ${10 + 20 * Math.sin(t * 9) ** 2}px #f72585`;
  // A2 net amount
  $('#a2NetT').textContent = t >= 26.85 ? '10 000 000' : '11 200 000';
  // B2 counter
  { const k = eOut((t - 33.1) / .6); $('#b2BigN').textContent = Math.round(lerp(15, 12, clamp(k))) + '%'; }
  // C2 typed values
  typed($('#c2V5'), t, 40.3, 40.9, '1 200 000');
  $('#c2V3').textContent = t >= 43.5 ? '1 200 000' : '';
  // A3 confetti
  CONF.forEach((c, i) => {
    const dt = t - 47.95;
    if (dt < 0 || dt > 1.8) { c.d.style.opacity = 0; return; }
    const x = 540 + Math.cos(c.a) * c.v * dt, y = 560 + Math.sin(c.a) * c.v * dt + 520 * dt * dt;
    c.d.style.opacity = 1 - dt / 1.8; c.d.style.transform = `translate(${x}px, ${y}px) rotate(${c.rot * dt}deg)`;
  });
  // B3 POS screen + gear
  $('#b3Scr').textContent = t >= 52.35 ? '12%' : '0%';
  $('#b3Gear').style.transform = `rotate(${t * 60}deg)`; $('#b3Gear').style.transformOrigin = '12px 12px';
  // CTA typing
  typed($('#ctaTyped'), t, 56.92, 57.35, 'XIZMAT');
  $('#ctaPh').style.display = t >= 56.92 ? 'none' : '';
  $('#ctaCaret').style.opacity = t > 57.5 ? 0 : blink;
  // end card life
  $('#ecRing').style.transform = `rotate(${t * 40}deg)`;
  { const ph = ((t - 59.6) % 1.3 + 1.3) % 1.3 / 1.3; const pg = $('#ecPing'); pg.style.transform = `translate(-50%,-50%) scale(${1 + ph * 4.5})`; pg.style.opacity = t > 59.6 ? (1 - ph) * .9 : 0; }
  $('#bnDot').style.opacity = .35 + .65 * Math.sin(t * 5) ** 2;
  for (const [id, [a, b]] of Object.entries(WIN)) $('#' + id).style.visibility = (t >= a && t < b) ? 'visible' : 'hidden';
  $('#nc').style.visibility = (t >= .25 && t < 10.5) ? 'visible' : 'hidden';
  $('#banner').style.visibility = (t >= .3 && t < 15.2) ? 'visible' : 'hidden';
}
