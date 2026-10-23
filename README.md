# folino-site

folino's website, published at <https://folino.app> by Cloudflare Pages, which builds `main`: a push is a release.
Other branches get preview deployments at `<branch>.folino-site.pages.dev`, kept out of search by `_headers`.

- **Pages**: the home page (`/` in English, `/<locale>/` otherwise) and the FAQ (`/faq/<locale>/`), in folino's five
  languages. Their words are in `_data/home.yml` and `_data/faq.yml`; the structure is in `_layouts/`.
- **`/` and the browser's language**: `/` stays the English page for search engines, but a browser that asks for
  Japanese, Korean or Chinese is sent to that home page by `functions/index.js`, a Pages Function that runs for `/`
  alone (`_routes.json`). A language picked in the switcher is kept in the `folino-lang` cookie and wins over the
  browser's. Its tests: `node --test test/home-redirect.test.mjs`.
- **Not found**: `404.html` has to exist - without it Cloudflare Pages serves the home page, with a 200, for any
  address it does not have.
- **Privacy policy**: `/privacy-policy/<locale>/` in 13 languages, Markdown in `privacy-policy/`. The App Store, Google
  Play and the app link to it, so its URLs and heading ids are published - don't rename them.
- **Moved from harmolo.com**: the old `harmolo.com/folino/` home, FAQ and privacy-policy URLs redirect here, keeping the
  `#anchor`. Apps already shipped link to the old policy URLs, so those redirects stay for good.
- **Shared with harmolo.com**: `assets/css/style.css`, the store badges and the locale plumbing came from
  [jiyimeta.github.io](https://github.com/jiyimeta/jiyimeta.github.io). A fix to one of them may be owed to the other.
- **Screenshots** under `images/<locale>/` are captured with folino's `Scripts/capture-screenshots.sh --bare`.

## Preview locally

```sh
bundle install
bundle exec jekyll serve
```

The `github-pages` gem pins Jekyll and its plugins (it is how the site was built on GitHub Pages, where it started);
`.ruby-version` names the Ruby it needs, and Cloudflare's build reads it too.

## Cloudflare Pages settings

- Build command `bundle exec jekyll build`, output directory `_site`.
- Environment variables `JEKYLL_ENV=production` and `PAGES_REPO_NWO=jiyimeta/folino-site` - without the second,
  the github-metadata plugin stops the build with "No repo name found".
- Custom domains `folino.app` and `www.folino.app`; a Cloudflare redirect rule sends `www` to the bare domain.
