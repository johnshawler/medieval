import json, html
d = json.load(open('out/board.json'))
esc = html.escape
src = {k: open(p).read() for k, p in [('stage', 'lib/stage.js'), ('ink', 'lib/ink.js'), ('props', 'lib/props.js'), ('medieval', 'lib/props_medieval.js'), ('tunes', 'lib/tunes.js')] + [(f'm{i}', f'scenes/m{i}.js') for i in range(1, 6)]}
for k, v in src.items(): assert '</script' not in v, k
total_pts = sum(m['quiz']['points'] for m in d); total_t = sum(m['play'] for m in d); n_stills = sum(len(m['stills']) for m in d)

def panel(m, i, b, img):
    texts = ''.join(f'<span class="say">{esc(t)}</span>' for t in b['text'])
    return f'''<article class="panel">
  <img data-style="{m['id']}" data-i="{i}" src="{img}" alt="Still of beat {i + 1}: {esc(b['moves'][:110])}" width="960" height="540">
  <div class="pbody">
    <p class="when"><b>Beat {i + 1}</b><span>{b['t0']:.1f}–{b['t1']:.1f} s</span></p>
    <p class="says"><i>On screen</i>{texts}</p>
    <dl><dt>Moves</dt><dd>{esc(b['moves'])}</dd><dt>Camera</dt><dd>{esc(b['camera'])}</dd><dt>Sound</dt><dd>{esc(b['sound'])}</dd></dl>
  </div>
</article>'''

def check(m, img):
    q = m['quiz']; i = len(m['beats'])
    return f'''<article class="panel check">
  <div class="shot"><img data-style="{m['id']}" data-i="{i}" src="{img}" alt="The table as it stands for the graded check" width="960" height="540"><p class="prompt">{esc(q['prompt'])}</p></div>
  <div class="pbody">
    <p class="when"><b>Graded check</b><span>{q['points']} points</span></p>
    <p class="says"><i>After the animation</i><span class="say">{esc(q['prompt'])}</span></p>
    <dl><dt>How</dt><dd>{esc(q['how'])}</dd><dt>Camera</dt><dd>Holds on this framing; the scene is live 3D, so taps land on the objects themselves.</dd><dt>Sound</dt><dd>A ding and the object’s own sound for a right answer, a low buzz for a wrong one.</dd></dl>
  </div>
</article>'''

sections = ''
for k, m in enumerate(d):
    panels = ''.join(panel(m, i, b, m['stills'][i]) for i, b in enumerate(m['beats'])) + check(m, m['stills'][-1])
    sections += f'''<section class="exp" id="experience-{k + 1}">
  <header class="exphead">
    <span class="num">{k + 1}</span>
    <div><h2>{esc(m['title'])}</h2>
    <p class="meta"><span>{esc(m['slides'])}</span><span>{m['play']:.1f} s, {len(m['beats'])} beats</span><span>{m['quiz']['points']} points</span></p>
    <p class="asks">Answers the deck’s question: “{esc(m['question'])}”</p></div>
  </header>
  <div class="grid">{panels}</div>
</section>'''

rows = ''.join(f"<tr><td>{k + 1}</td><td>{esc(m['title'])}</td><td>{esc(m['slides'])}</td><td class='r'>{m['play']:.1f} s</td><td class='r'>{m['quiz']['points']}</td></tr>" for k, m in enumerate(d))

ASSUME = [
  ('Scope', 'As with the 1950s deck, I used the slide faces, not the speaker notes, and built one experience for each of the five questions on the "Check your knowledge" slide, drawing on slides 2, 3, 4, 6, 9, 10 and 11. Slides 5 (Guido of Arezzo), 7 (troubadours), 8 (four more genres), 12 (video list) and 13 (then and now) are not animated. Guido\u2019s staff appears only as the c. 1025 stop on the timeline.'),
  ('Scoring', f'{total_pts} points in all, split as in the table above. The split and the tap-to-answer mechanics are my proposal. Wrong options in the multiple-choice questions come from elsewhere in the deck (estampie, motet, Machaut).'),
  ('Wording', 'Captions are shortened or joined from the slide text: "music for worship: prayer and church services", "sung in Latin by monks, nuns, and choirs", "chant, c. 500\u2013900: one line for everyone", "from c. 900: a second voice travels along with the chant", "shawm, a double reed, and nakers, small kettledrums", "like most strings: played indoors", "about 900 years, between ancient Rome and the Renaissance".'),
  ('Numbers', 'All from the slides: 476, 800, c. 1025, c. 1200, 1360s, c. 1400; c. 500\u20131400 and "about 900 years"; chant alone c. 500\u2013900, organum from c. 900, Notre Dame c. 1160\u20131250; the four composers\u2019 dates. The timeline in experience 1 is drawn to scale (38 years to one unit) until the last beat, where everything closes up into one row that is not to scale.'),
  ('People', 'People are shown as plain turned figures, like chess pawns, with a hood, veil, cap or hat and no portrait: monks for chant, an abbess for Hildegard, clerics for L\u00e9onin and P\u00e9rotin, a poet for Machaut. The deck shows manuscript pictures instead; say so if you would rather have objects only.'),
  ('Symbols', 'A Roman column that breaks stands for 476; a crown on a cushion for 800; a four-line sheet with six stepping notes for Guido\u2019s staff; a block model of Notre Dame\u2019s west front for Paris; a bound book with a cross for the Mass; a rising sun for the Renaissance; hearts for Machaut\u2019s love songs; three juggling balls for minstrels (juggling is on slide 7). Voices are rows of square notes in four colours.'),
  ('Instruments', 'Five of the eleven instruments are shown: harp, vielle, hurdy-gurdy, shawm and nakers. Lute, psaltery, bagpipe, recorder, portative organ and pipe and tabor are left out to keep the piece short. The models are simplified; the vielle stands upright so its strings and bow can be seen.'),
  ('Build', f'Final piece: one self-contained HTML file with five chapters, each with play/pause, scrub, time, sound toggle and loop, then its check and a score card at the end (name, mark per question, total out of {total_pts}). Plus one MP4 per chapter. Panels here are block-outs: secondary motion, sound and the checks come after your OK.'),
]
assume = ''.join(f'<li><b>{esc(a)}</b><span>{esc(b)}</span></li>' for a, b in ASSUME)

parts = ''.join(f'<script>(window.__parts = window.__parts || []).push(function () {{\n{v}\n}});</script>\n' for v in src.values())

page = f'''<title>Medieval Music Storyboard</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@700&family=Work+Sans:wght@400;500;600&display=swap">
<style>
/* layout: a printed storyboard sheet. One column of five strips; each strip is a row of inked panels with notes under them. */
:root {{ color-scheme: light; --paper: #f7ecd6; --card: #fffaf0; --ink: #1c1622; --soft: #5a5266; --rule: #1c162233; --teal: #1c7376; --persimmon: #c9402a; --mustard: #f6b63c; --navy: #3b4568;
  --display: "Anton", "Impact", "Arial Narrow", sans-serif; --hand: "Caveat", "Segoe Print", cursive; --body: "Work Sans", system-ui, -apple-system, "Segoe UI", sans-serif; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--paper); color: var(--ink); font: 15px/1.5 var(--body); padding-block: 28px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }}
.wrap {{ max-width: 1500px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }}
h1, h2, h3 {{ font-family: var(--display); font-weight: 400; letter-spacing: .01em; margin: 0; text-wrap: balance; line-height: 1.05; }}
p {{ margin: 0; }}
.top {{ display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 32px; align-items: end; border-bottom: 3px solid var(--ink); padding-bottom: 24px; }}
.eyebrow {{ font-size: 12px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--persimmon); margin-bottom: 10px; }}
h1 {{ font-size: clamp(34px, 5.2vw, 64px); text-transform: uppercase; }}
.lede {{ margin-top: 14px; max-width: 62ch; color: var(--soft); font-size: 16px; }}
table {{ border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; font-size: 14px; }}
th {{ text-align: left; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--soft); font-weight: 600; padding: 0 8px 6px 0; }}
td {{ padding: 7px 8px 7px 0; border-top: 1px solid var(--rule); vertical-align: top; }}
td.r, th.r {{ text-align: right; padding-right: 0; }}
tfoot td {{ border-top: 2px solid var(--ink); font-weight: 600; }}
.exp {{ display: flex; flex-direction: column; gap: 16px; }}
.exphead {{ display: flex; gap: 16px; align-items: flex-start; }}
.num {{ font: 400 44px/1 var(--display); background: var(--mustard); border: 3px solid var(--ink); border-radius: 50%; width: 64px; height: 64px; display: grid; place-items: center; flex: none; box-shadow: 4px 4px 0 var(--ink); }}
h2 {{ font-size: clamp(26px, 3.2vw, 38px); text-transform: uppercase; }}
.meta {{ display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 13px; font-weight: 600; color: var(--teal); margin-top: 6px; }}
.asks {{ color: var(--soft); margin-top: 2px; }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 18px; }}
.panel {{ background: var(--card); border: 2px solid var(--ink); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; min-width: 0; }}
.panel img {{ display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; background: #2a9d94; border-bottom: 2px solid var(--ink); }}
.shot {{ position: relative; }}
.prompt {{ position: absolute; left: 6%; right: 6%; bottom: 9%; background: var(--paper); border: 2px solid var(--ink); box-shadow: 3px 3px 0 var(--ink); font: 700 clamp(15px, 1.5vw, 19px)/1.15 var(--hand); padding: 5px 10px; text-align: center; }}
.pbody {{ padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 9px; }}
.when {{ display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }}
.when b {{ font: 400 19px/1 var(--display); text-transform: uppercase; letter-spacing: .03em; }}
.when span {{ font-size: 13px; font-weight: 600; color: var(--teal); font-variant-numeric: tabular-nums; }}
.says {{ display: flex; flex-wrap: wrap; gap: 5px 6px; align-items: center; }}
.says i {{ font-style: normal; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--soft); font-weight: 600; width: 100%; }}
.say {{ font: 700 19px/1.1 var(--hand); background: var(--paper); border: 1.5px solid var(--ink); padding: 2px 8px 3px; }}
dl {{ margin: 0; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 6px 10px; font-size: 13.5px; line-height: 1.42; }}
dt {{ font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--soft); font-weight: 600; padding-top: 3px; }}
dd {{ margin: 0; }}
.check {{ border-color: var(--persimmon); box-shadow: 4px 4px 0 var(--persimmon); }}
.check .when b {{ color: var(--persimmon); }}
.notes {{ border-top: 3px solid var(--ink); padding-top: 22px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 32px 40px; }}
.notes h3 {{ font-size: 24px; text-transform: uppercase; margin-bottom: 12px; }}
.notes ul, .notes ol {{ margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }}
.notes li {{ display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 12px; }}
.notes li b {{ font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--teal); padding-top: 3px; }}
.notes ol {{ counter-reset: q; }}
.notes ol li {{ grid-template-columns: 30px minmax(0, 1fr); counter-increment: q; }}
.notes ol li::before {{ content: counter(q); font: 400 22px/1 var(--display); color: var(--persimmon); }}
.live {{ display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; margin-top: 14px; }}
button {{ font: 600 14px/1 var(--body); color: var(--ink); background: var(--mustard); border: 2px solid var(--ink); border-radius: 4px; padding: 10px 14px; box-shadow: 3px 3px 0 var(--ink); cursor: pointer; }}
button:active {{ transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); }}
button:focus-visible {{ outline: 3px solid var(--teal); outline-offset: 2px; }}
button[disabled] {{ opacity: .55; cursor: default; }}
#status {{ font-size: 13px; color: var(--soft); }}
@media (max-width: 860px) {{ .top, .notes {{ grid-template-columns: minmax(0, 1fr); }} }}
</style>
<div class="wrap">
  <header class="top">
    <div>
      <p class="eyebrow">Storyboard for your OK · stills only, no motion or sound yet</p>
      <h1>Music of the Medieval Period in five graded experiences</h1>
      <p class="lede">Each experience is a short Ink and Toon animation built from your slides, followed by a check the student answers by tapping the objects in the scene. Every panel below is that beat’s key frame, rendered from the real scene code with the STAGE kit at 16 samples.</p>
      <div class="live"><button id="rerender" type="button">Render the {n_stills} stills live in this browser</button><span id="status">Shown now: the same frames, rendered ahead of time.</span></div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Experience</th><th>From</th><th class="r">Runs</th><th class="r">Points</th></tr></thead>
      <tbody>{rows}</tbody>
      <tfoot><tr><td></td><td>Five chapters, one file</td><td></td><td class="r">{total_t:.0f} s</td><td class="r">{total_pts}</td></tr></tfoot>
    </table>
  </header>
  {sections}
  <section class="notes">
    <div><h3>What I assumed</h3><ul>{assume}</ul></div>
    <div><h3>Three things to decide</h3><ol>
      <li><span><b style="display:block;font-size:14px;letter-spacing:0;text-transform:none;color:inherit">Is five the right set?</b>I can add experiences for slide 5 (Guido makes music readable), slide 7 (troubadours), slide 8 (four more genres) or slide 13 (then and now), or drop any of these.</span></li>
      <li><span><b style="display:block;font-size:14px;letter-spacing:0;text-transform:none;color:inherit">Where should it go?</b>Same score card as the 1950s set unless you say otherwise. Tell me the repository to push to (a new one, or a folder in <code>johnshawler/50s</code>); I will not push until you say.</span></li>
      <li><span><b style="display:block;font-size:14px;letter-spacing:0;text-transform:none;color:inherit">Any beat, caption or object to change?</b>Name the experience and beat number. On your OK I build the full animations, sound and checks exactly as boarded here.</span></li>
    </ol></div>
  </section>
</div>
<script type="importmap">{{ "imports": {{ "three": "https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js" }} }}</script>
{parts}<script type="module">
// Live render: the same block-out scenes, drawn one after another on one canvas with S.seek(time) at 16 samples and copied into the panels.
const btn = document.getElementById('rerender'), status = document.getElementById('status');
btn.addEventListener('click', async () => {{
  btn.disabled = true; status.textContent = 'Loading three.js…';
  try {{
    const THREE = await import('three'); window.THREE = THREE;
    if (!window.K) for (const part of window.__parts) part();
    if (document.fonts) await Promise.all(['260px "Anton"', '700 150px "Caveat"'].map((f) => document.fonts.load(f).catch(() => null)));
    const small = document.createElement('canvas'); small.width = 960; small.height = 540; const ctx = small.getContext('2d'); let done = 0;
    for (const style of STYLES) {{
      const cv = document.createElement('canvas'); cv.width = 1920; cv.height = 1080;
      const S = await K.run(cv, style, {{ samples: 16 }}), times = [...style.beats.map((b) => b.key), style.quiz.key];
      for (let i = 0; i < times.length; i++) {{
        S.pose = i === times.length - 1 && style.check[0].pose ? style.check[0].pose : 0; S.seek(times[i]); ctx.drawImage(cv, 0, 0, 960, 540);
        const img = document.querySelector('img[data-style="' + style.id + '"][data-i="' + i + '"]'); if (img) img.src = small.toDataURL('image/jpeg', 0.86);
        status.textContent = 'Rendered ' + (++done) + ' of {n_stills} stills live…'; await new Promise((r) => requestAnimationFrame(r));
      }}
      S.renderer.dispose(); S.renderer.forceContextLoss();
    }}
    status.textContent = 'All {n_stills} stills rendered live in this browser.';
  }} catch (e) {{ status.textContent = 'Live render did not run here (' + (e && e.message ? e.message : e) + '). The stills shown were rendered ahead of time from the same code.'; btn.disabled = false; }}
}});
</script>
'''
open('storyboard.html', 'w').write(page)
print(len(page) / 1e6, 'MB')
