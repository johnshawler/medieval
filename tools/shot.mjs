// usage: node tools/shot.mjs "<query>" out_prefix t1 t2 ...   (renders test.html?<query> at each time, saves PNGs)
import { createRequire } from 'module'; const require = createRequire('/opt/node22/lib/node_modules/'); const { chromium } = require('playwright');
const [query, prefix, ...times] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
const page = await browser.newPage({ viewport: { width: 1000, height: 600 } });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[' + m.type() + ']', m.text().slice(0, 600)); });
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 600)));
await page.goto('http://localhost:8766/test.html?' + query);
await page.waitForFunction('window.READY || window.ERR', null, { timeout: 180000 });
const err = await page.evaluate('window.ERR'); if (err) { console.log('ERR', err); await browser.close(); process.exit(1); }
for (const t of times.length ? times : ['0']) {
  const t0 = Date.now();
  const url = await page.evaluate((t) => { window.seek(+t); return document.getElementById('c').toDataURL('image/jpeg', 0.9); }, t);
  const fs = await import('fs'); fs.writeFileSync(`${prefix}_${t}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
  console.log('saved', `${prefix}_${t}.jpg`, Date.now() - t0, 'ms');
}
await browser.close();
