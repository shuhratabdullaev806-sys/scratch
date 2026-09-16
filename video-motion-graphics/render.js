const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML = path.join(__dirname, 'html');
const OUT = path.join(__dirname, 'out');

const subtitles = [
  `Aksiyada tannarxdan arzon sotdingiz va <b class="hl">Qo'shilgan qiymat solig'i</b>ni sotuv summasidan hisobladingiz.`,
  `Auditda &mdash; <b class="hl">4 million so'm</b> jarima.`,
  `Sababi? &laquo;Sotdim &mdash; shundan soliq chiqadi&raquo; deb o'ylaysiz.`,
  `Lekin bozor narxidan past sotuvda qonun boshqacha ishlaydi.`,
  `Ko'pchilik buxgalter: &laquo;Shartnomada shu narx yozilgan, demak soliq ham shundan&raquo; deydi &mdash; shartnomani asosiy hujjat deb bilib.`,
  `Aslida <b class="hl">Soliq kodeksi 248-moddasi</b> bo'yicha tovar bozor narxidan past yoki tekin berilsa, soliq bazasi bozor narxi (kamida tannarx) bo'ladi.`,
  `30 milliondan hisoblangan QQS &mdash; noto'g'ri, baza <b class="hl">50 million</b> bo'lishi kerak edi.`,
  `Farq <b class="hl">20 million</b>, jarima <b class="hl">4 million so'm</b> (223-modda, 20%).`,
  `Korxonangizda so'nggi aksiya tekshirilganmi?`,
  `Izohda <b class="hl">XIZMAT</b> deb yozing.`,
];

async function recordAnim(browser, url, w, h, durationMs, outName) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    recordVideo: { dir: OUT, size: { width: w, height: h } },
  });
  const page = await context.newPage();
  await page.goto(url);
  await page.waitForTimeout(durationMs);
  const video = page.video();
  await context.close();
  const savedPath = await video.path();
  fs.renameSync(savedPath, path.join(OUT, outName));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox'],
  });

  // subtitle cards
  const page2 = await browser.newPage({ viewport: { width: 560, height: 260 } });
  for (let i = 0; i < subtitles.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    await page2.goto('file://' + path.join(HTML, 'subtitle.html'));
    await page2.evaluate((html) => { document.getElementById('txt').innerHTML = html; }, subtitles[i]);
    await page2.waitForTimeout(100);
    const el = await page2.$('.card');
    await el.screenshot({ path: path.join(OUT, `sub_${n}.png`), omitBackground: true });
  }
  await page2.close();

  // name card
  const page3 = await browser.newPage({ viewport: { width: 340, height: 100 } });
  await page3.goto('file://' + path.join(HTML, 'namecard.html'));
  await page3.waitForTimeout(150);
  const nc = await page3.$('.card');
  await nc.screenshot({ path: path.join(OUT, 'namecard.png'), omitBackground: true });
  await page3.close();

  // animations (opaque, full coverage -> record as video)
  await recordAnim(browser, 'file://' + path.join(HTML, 'anim_a.html'), 608, 1080, 2700, 'anim_a.webm');
  await recordAnim(browser, 'file://' + path.join(HTML, 'anim_b.html'), 608, 540, 3300, 'anim_b.webm');
  await recordAnim(browser, 'file://' + path.join(HTML, 'anim_c.html'), 608, 1080, 3300, 'anim_c.webm');

  await browser.close();
  console.log('done');
})();
