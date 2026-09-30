// Ishlatish: node render.js [overlay|preview|frame] [t] ["sarlavha"]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const FF = process.env.FFMPEG || 'ffmpeg', FPS = 30, TOTAL = 45;
const [mode='preview', arg, titleArg] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport:{width:1080,height:1920} });
  const q = new URLSearchParams({ mode: mode==='overlay'?'overlay':'preview' });
  if (titleArg) q.set('title', titleArg);
  await pg.goto('file://'+path.resolve('shablon.html')+'?'+q);
  await pg.evaluate(()=>document.fonts.ready);
  if (mode==='frame') {
    await pg.evaluate(t=>renderAt(t), +arg);
    await pg.screenshot({ path:`kadr_${arg}.png`, omitBackground: q.get('mode')==='overlay' });
    return b.close();
  }
  const dir = fs.mkdtempSync('frames_');
  for (let i=0;i<TOTAL*FPS;i++){
    await pg.evaluate(t=>renderAt(t), i/FPS);
    await pg.screenshot({ path:`${dir}/f${String(i).padStart(5,'0')}.png`, omitBackground: mode==='overlay' });
  }
  await b.close();
  const out = mode==='overlay'
    ? `-c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le titul_overlay.mov`
    : `-c:v libx264 -pix_fmt yuv420p -crf 18 preview.mp4`;
  execSync(`${FF} -y -framerate ${FPS} -i ${dir}/f%05d.png ${out}`, {stdio:'ignore'});
  fs.rmSync(dir,{recursive:true});
})();
