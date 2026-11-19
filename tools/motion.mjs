// low-sample frames every `step` seconds for each chapter -> out/m_<id>_<i>.jpg (for checking the in-betweens)
import { createRequire } from 'module'; import { execSync } from 'child_process'; import fs from 'fs';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
const ids = process.argv[2].split(','), step = +process.argv[3] || 0.4;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
await Promise.all(ids.map(async (id) => { const page = await browser.newPage(); page.on('pageerror', (e) => console.log('[pageerror]', id, String(e).slice(0, 300)));
  await page.goto(`http://localhost:8766/test.html?samples=3&js=scenes/${id}.js&style=${id}`); await page.waitForFunction('window.READY || window.ERR', null, { timeout: 180000 });
  const D = await page.evaluate(() => STYLES[0].play); let i = 0;
  for (let t = 0; t < D; t += step, i++) { const url = await page.evaluate((t) => { window.seek(t); const c = document.createElement('canvas'); c.width = 640; c.height = 360; c.getContext('2d').drawImage(document.getElementById('c'), 0, 0, 640, 360); return c.toDataURL('image/jpeg', 0.8); }, t); fs.writeFileSync(`out/m_${id}_${String(i).padStart(3, '0')}.jpg`, Buffer.from(url.split(',')[1], 'base64')); }
  console.log(id, i, 'frames'); }));
await browser.close();
