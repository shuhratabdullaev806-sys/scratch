const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const HTML = path.join(__dirname, 'html');
const OUT = path.join(__dirname, 'out');

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
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox'],
  });

  // ring.png
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
  await page.goto('file://' + path.join(HTML, 'ring.html'));
  await page.waitForTimeout(100);
  const el = await page.$('.wrap');
  await el.screenshot({ path: path.join(OUT, 'ring.png'), omitBackground: true });
  await page.close();

  // re-record anim_c (edited)
  await recordAnim(browser, 'file://' + path.join(HTML, 'anim_c.html'), 608, 1080, 3300, 'anim_c.webm');

  await browser.close();
  console.log('done');
})();
