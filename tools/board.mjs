// renders every storyboard still in headless Chrome and writes out/board.json = [{...meta, stills: [dataURL...]}]
import { createRequire } from 'module'; const require = createRequire('/opt/node22/lib/node_modules/'); 
import fs from 'fs';
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { const { execSync } = await import('child_process'); ({ chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright')); }
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('[error]', m.text().slice(0, 500)); });
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 500)));
await page.goto('http://localhost:8766/board_render.html'); await page.waitForFunction('window.READY', null, { timeout: 120000 });
const meta = await page.evaluate('window.META');
for (const m of meta) { const t0 = Date.now(); m.stills = await page.evaluate((id) => window.renderStyle(id, 16), m.id); console.log(m.id, m.stills.length, 'stills', Date.now() - t0, 'ms'); }
fs.writeFileSync('out/board.json', JSON.stringify(meta)); await browser.close();
