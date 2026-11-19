import sys
files = ['lib/stage.js', 'lib/sound.js', 'lib/ink.js', 'lib/props.js', 'lib/props_medieval.js', 'lib/tunes.js', 'lib/tunes_medieval.js'] + [f'scenes/m{i}.js' for i in range(1, 6)]
parts = ''
for f in files:
    v = open(f).read(); assert '</script' not in v, f
    parts += f'<script>(window.__parts = window.__parts || []).push(function () {{\n{v}\n}});</script>\n'
page = open('src/app.html').read().replace('<!--PARTS-->', parts)
open('medieval.html', 'w').write(page)
local = page.replace('https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js', '../lib/three.module.js')
open('out/medieval_local.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + local + '</body></html>')
HEAD = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
open('index.html', 'w').write(HEAD + page + '</body></html>\n')   # the complete page, for GitHub Pages or any web server
print(len(page) / 1e3, 'KB')
