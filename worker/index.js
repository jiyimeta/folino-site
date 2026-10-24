// The site's Cloudflare Worker. It runs for `/` alone (`run_worker_first` in wrangler.jsonc); every other path is a
// static file from _site, served without it.
//
// `/` is the English home page, and it stays one: Google reads the site name from it, it is the hreflang x-default,
// and Googlebot sends no Accept-Language, so it always gets the page itself. A browser that asks for another language
// folino's home page is published in is sent to that page instead. The server makes that call, not a script in the
// page, because Google indexes a page that moves itself as a redirect and drops it.
//
// A language picked in the switcher is stored in the `folino-lang` cookie (_layouts/base.html) and outranks the
// browser's: someone who chose English is not sent back to Japanese for having a Japanese browser.

import { homePathFor } from './home.js';

// The answer depends on these two headers, so no cache may hand one visitor's answer to another.
const VARY = 'Accept-Language, Cookie';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' || request.method === 'HEAD') {
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
    const page = await env.ASSETS.fetch(request);
    const response = new Response(page.body, page);
    response.headers.append('Vary', VARY);
    // _headers does not reach a response the Worker makes, so the workers.dev copies' noindex is repeated here.
    if (url.hostname.endsWith('.workers.dev')) response.headers.set('X-Robots-Tag', 'noindex');
    return response;
  },
};
