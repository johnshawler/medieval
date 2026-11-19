// medieval.johnshawler.com
// Serves the player, the storyboard and the five videos straight from the public GitHub repository,
// so a push to main is what publishes. Cloudflare keeps a copy at the edge between requests.
const ORIGIN = 'https://raw.githubusercontent.com/johnshawler/medieval/main';

// Only these paths are public. ttl is how long the edge keeps a copy, in seconds.
const ROUTES = [
  { test: /^\/index\.html$/, type: 'text/html; charset=utf-8', ttl: 300 },
  { test: /^\/storyboard\.html$/, type: 'text/html; charset=utf-8', ttl: 300 },
  { test: /^\/video\/[a-z0-9-]+\.mp4$/, type: 'video/mp4', ttl: 3600 },
];

function plain(status, text, extra) {
  const headers = Object.assign({ 'content-type': 'text/plain; charset=utf-8' }, extra || {});
  return new Response(text + '\n', { status, headers });
}

// Returns null for no usable range, 'bad' for one outside the file, or { start, end }.
function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header || '');
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start;
  let end;
  if (m[1] === '') {
    const n = Number(m[2]);
    if (n === 0) return 'bad';
    start = Math.max(0, size - n);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start > end || start >= size) return 'bad';
  return { start, end };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return plain(405, 'Method not allowed', { allow: 'GET, HEAD' });
    }
    const url = new URL(request.url);
    const path = url.pathname === '/' ? '/index.html' : url.pathname;
    const route = ROUTES.find((r) => r.test.test(path));
    if (!route) return plain(404, 'Not found');

    const cache = caches.default;
    const keyUrl = url.origin + path;
    const range = request.headers.get('range');

    // A copy at the edge answers ranges and If-None-Match by itself.
    const lookup = new Headers();
    if (range) lookup.set('range', range);
    const inm = request.headers.get('if-none-match');
    if (inm) lookup.set('if-none-match', inm);
    const hit = await cache.match(new Request(keyUrl, { method: request.method, headers: lookup }));
    if (hit) return hit;

    const upstream = await fetch(ORIGIN + path, { method: request.method });
    if (upstream.status === 404) return plain(404, 'Not found');
    if (!upstream.ok) return plain(502, 'The site files could not be loaded. Try again in a minute.');

    const headers = new Headers({
      'content-type': route.type,
      'cache-control': 'public, max-age=' + route.ttl,
      'accept-ranges': 'bytes',
      'x-content-type-options': 'nosniff',
    });
    const etag = upstream.headers.get('etag');
    if (etag) headers.set('etag', etag);

    if (request.method === 'HEAD') return new Response(null, { headers });

    const key = new Request(keyUrl, { method: 'GET' });
    if (!range) {
      const [forCache, forClient] = upstream.body.tee();
      ctx.waitUntil(cache.put(key, new Response(forCache, { headers })));
      return new Response(forClient, { headers });
    }

    // First ranged request for a file: load it whole, keep a copy, answer the slice.
    const body = await upstream.arrayBuffer();
    ctx.waitUntil(cache.put(key, new Response(body.slice(0), { headers })));
    const r = parseRange(range, body.byteLength);
    if (r === 'bad') {
      return new Response(null, { status: 416, headers: { 'content-range': 'bytes */' + body.byteLength } });
    }
    if (!r) return new Response(body, { headers });
    headers.set('content-range', 'bytes ' + r.start + '-' + r.end + '/' + body.byteLength);
    return new Response(body.slice(r.start, r.end + 1), { status: 206, headers });
  },
};
