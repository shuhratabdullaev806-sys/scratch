const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [mode, a, b, c] = process.argv.slice(2); const outDir = mode === 'still' ? b : c;
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', m => console.log('console:', m.text()));
  page.on('pageerror', e => console.log('pageerror:', e.message));
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  await page.evaluate(() => window.ready);
  const frames = mode === 'still' ? a.split(',').map(x => Math.round(parseFloat(x) * 25)) : [];
  if (mode === 'seq') for (let f = +a; f < +b; f++) frames.push(f);
  const t0 = Date.now();
  for (const f of frames) {
    await page.evaluate(f => window.renderFrame(f), f);
    const name = mode === 'still' ? `s_${(f / 25).toFixed(2)}.jpg` : `${String(f).padStart(5, '0')}.jpg`;
    await page.screenshot({ path: path.join(outDir, name), type: 'jpeg', quality: 93 });
  }
  console.log('done', frames.length, (Date.now() - t0) / frames.length, 'ms/frame');
  await browser.close();
})();
