// usage: node tools/render.mjs <chapter 1..5> [maxFrames]   -> out/ch<N>.mp4 (frames piped to ffmpeg, sound rendered offline and muxed)
import { createRequire } from 'module'; import { execSync, spawn } from 'child_process'; import fs from 'fs';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
const ch = +process.argv[2], maxFrames = +process.argv[3] || 1e9, FPS = 30;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 400)));
await page.goto(`http://localhost:8766/out/medieval_local.html?render=1&chapter=${ch}`); await page.waitForFunction('window.READY || window.ERR', null, { timeout: 180000 });
const D = await page.evaluate('window.DURATION'), n = Math.min(maxFrames, Math.round(D * FPS));
const au = await page.evaluate('window.renderAudio()'); fs.writeFileSync(`out/ch${ch}.f32`, Buffer.from(au.b64, 'base64')); console.log('ch', ch, 'duration', D, 'frames', n, 'audio peak', au.peak.toFixed(3));
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `out/ch${ch}_video.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let i = 0; i < n; i++) {
  const url = await page.evaluate((t) => { window.seek(t); return document.getElementById('c').toDataURL('image/jpeg', 0.96); }, i / FPS);
  if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % 30 === 29) console.log('ch', ch, 'frame', i + 1, '/', n, ((Date.now() - t0) / (i + 1) / 1000).toFixed(2), 's/frame');
}
ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await browser.close();
// two-pass loudness to about -15 LUFS, then mux
const meas = execSync(`ffmpeg -hide_banner -f f32le -ar 48000 -ac 2 -i out/ch${ch}.f32 -af loudnorm=I=-15:TP=-1.5:LRA=11:print_format=json -f null - 2>&1`).toString(), j = JSON.parse(meas.slice(meas.lastIndexOf('{')));
execSync(`ffmpeg -y -loglevel error -i out/ch${ch}_video.mp4 -f f32le -ar 48000 -ac 2 -i out/ch${ch}.f32 -af loudnorm=I=-15:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=48000 -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/ch${ch}.mp4`);
console.log('ch', ch, 'done: measured', j.input_i, 'LUFS ->', execSync(`ffmpeg -hide_banner -i out/ch${ch}.mp4 -af ebur128 -f null - 2>&1 | grep -E "I:" | tail -1`).toString().trim());
