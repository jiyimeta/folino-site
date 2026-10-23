// A Cloudflare Pages Function for `/` alone - every other path is a static file and never reaches it.
//
// `/` is the English home page, and it stays one: Google reads the site name from it, it is the hreflang x-default,
// and Googlebot sends no Accept-Language, so it always gets the page itself. A browser that asks for another language
// folino's home page is published in is sent to that page instead. The server makes that call, not a script in the
// page, because Google indexes a page that moves itself as a redirect and drops it.
//
// A language picked in the switcher is stored in the `folino-lang` cookie (_layouts/base.html) and outranks the
// browser's: someone who chose English is not sent back to Japanese for having a Japanese browser.

// Every tag that leads to a home page, lowercased. A tag that is not here is shortened from the right until one is
// (`ja-JP` finds `ja`, `zh-Hant-TW` finds `zh-hant`). English is `/` itself; the Chinese scripts also go by their
// regions, and bare `zh` means Simplified. Keep in step with `locales` in _data/folino.yml.
export const HOME_PATHS = {
  en: '/',
  ja: '/ja/',
  ko: '/ko/',
  'zh-hans': '/zh-Hans/',
  'zh-cn': '/zh-Hans/',
  'zh-sg': '/zh-Hans/',
  zh: '/zh-Hans/',
  'zh-hant': '/zh-Hant/',
  'zh-tw': '/zh-Hant/',
  'zh-hk': '/zh-Hant/',
  'zh-mo': '/zh-Hant/',
};

export const COOKIE_NAME = 'folino-lang';

// The home page for one language tag, or undefined when folino's home page is not published in it.
export function homePathForTag(tag) {
  let candidate = String(tag).trim().toLowerCase();
  while (candidate) {
    if (Object.hasOwn(HOME_PATHS, candidate)) return HOME_PATHS[candidate];
    const cut = candidate.lastIndexOf('-');
    if (cut < 0) return undefined;
    candidate = candidate.slice(0, cut);
  }
  return undefined;
}

// Accept-Language's tags, most wanted first; ties keep the browser's order. `*` and q=0 ask for nothing in particular.
export function acceptedTags(header) {
  if (!header) return [];
  return header
    .split(',')
    .map((entry, index) => {
      const [tag, ...params] = entry.split(';').map((part) => part.trim());
      const qParam = params.find((param) => param.toLowerCase().startsWith('q='));
      const q = qParam === undefined ? 1 : Number(qParam.slice(2));
      return { tag, q: Number.isFinite(q) ? q : 0, index };
    })
    .filter(({ tag, q }) => tag && tag !== '*' && q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
    .map(({ tag }) => tag);
}

export function cookieValue(header, name) {
  if (!header) return undefined;
  for (const pair of header.split(';')) {
    const eq = pair.indexOf('=');
    if (eq < 0) continue;
    if (pair.slice(0, eq).trim() === name) return pair.slice(eq + 1).trim();
  }
  return undefined;
}

// Where a request for `/` belongs. A stored choice decides on its own, even one the home page is not published in
// (a privacy-policy reader who picked Deutsch gets English, not their browser's language). Without one, the first
// accepted language that has a home page decides, English included.
export function homePathFor(request) {
  const chosen = cookieValue(request.headers.get('Cookie'), COOKIE_NAME);
  if (chosen !== undefined) return homePathForTag(chosen) ?? '/';
  for (const tag of acceptedTags(request.headers.get('Accept-Language'))) {
    const path = homePathForTag(tag);
    if (path !== undefined) return path;
  }
  return '/';
}

// The answer depends on these two headers, so no cache may hand one visitor's answer to another.
const VARY = 'Accept-Language, Cookie';

export async function onRequest(context) {
  const { request } = context;
  if (request.method === 'GET' || request.method === 'HEAD') {
    const url = new URL(request.url);
    const path = homePathFor(request);
    if (path !== url.pathname) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: new URL(path + url.search, url).href,
          'Cache-Control': 'no-store',
          Vary: VARY,
        },
      });
    }
  }
  const page = await context.next();
  const response = new Response(page.body, page);
  response.headers.append('Vary', VARY);
  // _headers does not reach a Function's response, so the pages.dev copy's noindex is repeated here.
  if (new URL(request.url).hostname.endsWith('.pages.dev')) response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}
