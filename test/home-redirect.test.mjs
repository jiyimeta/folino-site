// Checks functions/index.js, the Function that serves `/`. Run with `node --test test/home-redirect.test.mjs`
// (Node 22 or later).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { HOME_PATHS, onRequest } from '../functions/index.js';

const HOME_HTML = '<!DOCTYPE html><title>folino</title>';

async function get(path, headers = {}, { host = 'folino.app', method = 'GET' } = {}) {
  const request = new Request(`https://${host}${path}`, { method, headers });
  let servedPage = false;
  const next = async () => {
    servedPage = true;
    return new Response(HOME_HTML, { status: 200, headers: { 'Content-Type': 'text/html', Vary: 'Accept-Encoding' } });
  };
  const response = await onRequest({ request, next });
  return { response, servedPage };
}

async function assertRedirect(path, headers, location) {
  const { response, servedPage } = await get(path, headers);
  assert.equal(response.status, 302, `expected a redirect for ${JSON.stringify(headers)}`);
  assert.equal(response.headers.get('Location'), location);
  assert.equal(servedPage, false);
}

async function assertHomePage(path, headers) {
  const { response, servedPage } = await get(path, headers);
  assert.equal(response.status, 200, `expected the page itself for ${JSON.stringify(headers)}`);
  assert.equal(servedPage, true);
  assert.equal(await response.text(), HOME_HTML);
}

test('a request with no Accept-Language - Googlebot - gets the English page', async () => {
  await assertHomePage('/', {});
});

test('an English browser stays, whatever comes after English', async () => {
  await assertHomePage('/', { 'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8' });
  await assertHomePage('/', { 'Accept-Language': 'en-GB' });
});

test('a browser that asks for a home page language first goes there', async () => {
  await assertRedirect('/', { 'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8' }, 'https://folino.app/ja/');
  await assertRedirect('/', { 'Accept-Language': 'ko-KR' }, 'https://folino.app/ko/');
});

test('the Chinese scripts are found by script, by region, and bare zh is Simplified', async () => {
  const cases = {
    'zh-Hans': '/zh-Hans/',
    'zh-CN': '/zh-Hans/',
    'zh-SG': '/zh-Hans/',
    'zh-Hans-CN': '/zh-Hans/',
    zh: '/zh-Hans/',
    'zh-Hant': '/zh-Hant/',
    'zh-TW': '/zh-Hant/',
    'zh-HK': '/zh-Hant/',
    'zh-MO': '/zh-Hant/',
    'zh-Hant-HK': '/zh-Hant/',
  };
  for (const [tag, path] of Object.entries(cases)) {
    await assertRedirect('/', { 'Accept-Language': tag }, `https://folino.app${path}`);
  }
});

test('a language without a home page is skipped for the next one', async () => {
  await assertRedirect('/', { 'Accept-Language': 'de-DE,de;q=0.9,ko;q=0.8,en;q=0.7' }, 'https://folino.app/ko/');
  await assertHomePage('/', { 'Accept-Language': 'de-DE,de;q=0.9,fr;q=0.8' });
});

test('quality values outrank the order they are listed in, and q=0 and * ask for nothing', async () => {
  await assertRedirect('/', { 'Accept-Language': 'en;q=0.5, ja' }, 'https://folino.app/ja/');
  await assertHomePage('/', { 'Accept-Language': 'ja;q=0, en' });
  await assertHomePage('/', { 'Accept-Language': '*' });
  await assertHomePage('/', { 'Accept-Language': 'ja;q=nonsense' });
});

test('a language picked in the switcher outranks the browser', async () => {
  await assertHomePage('/', { 'Accept-Language': 'ja-JP', Cookie: 'folino-lang=en' });
  await assertRedirect('/', { 'Accept-Language': 'en-US', Cookie: 'other=1; folino-lang=zh-Hant' }, 'https://folino.app/zh-Hant/');
});

test('a picked language the home page is not in stays on English rather than falling back to the browser', async () => {
  await assertHomePage('/', { 'Accept-Language': 'ja-JP', Cookie: 'folino-lang=de' });
});

test('the query string goes along', async () => {
  await assertRedirect('/?utm_source=app', { 'Accept-Language': 'ja' }, 'https://folino.app/ja/?utm_source=app');
});

test('the redirect is never cached and says what it depends on', async () => {
  const { response } = await get('/', { 'Accept-Language': 'ja' });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('Vary'), 'Accept-Language, Cookie');
});

test('the page itself keeps its own Vary and adds the two headers', async () => {
  const { response } = await get('/', {});
  assert.equal(response.headers.get('Vary'), 'Accept-Encoding, Accept-Language, Cookie');
  assert.equal(response.headers.get('Content-Type'), 'text/html');
});

test('only GET and HEAD are redirected', async () => {
  const { response, servedPage } = await get('/', { 'Accept-Language': 'ja' }, { method: 'POST' });
  assert.equal(servedPage, true);
  assert.equal(response.status, 200);
  const head = await get('/', { 'Accept-Language': 'ja' }, { method: 'HEAD' });
  assert.equal(head.response.status, 302);
});

test('the pages.dev copy is marked noindex and folino.app is not', async () => {
  const pagesDev = await get('/', {}, { host: 'folino-site.pages.dev' });
  assert.equal(pagesDev.response.headers.get('X-Robots-Tag'), 'noindex');
  const live = await get('/', {});
  assert.equal(live.response.headers.get('X-Robots-Tag'), null);
});

test('HOME_PATHS reaches exactly the home pages of the locales in _data/folino.yml', () => {
  const yaml = readFileSync(new URL('../_data/folino.yml', import.meta.url), 'utf8');
  const list = yaml.match(/^locales:\s*\[([^\]]*)\]/m);
  assert.ok(list, '_data/folino.yml has no `locales: [...]` line');
  const codes = list[1].split(',').map((code) => code.trim());
  const expected = new Set(codes.map((code) => (code === 'en' ? '/' : `/${code}/`)));
  assert.deepEqual(new Set(Object.values(HOME_PATHS)), expected);
  for (const code of codes) assert.equal(HOME_PATHS[code.toLowerCase()], code === 'en' ? '/' : `/${code}/`);
});
