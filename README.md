# folino-site

folino's website, published at <https://folino.app> by a Cloudflare Worker with static assets. Workers Builds builds
`main` and deploys it: a push is a release. Other branches get previews on `workers.dev`, which `_headers` and the
Worker keep out of search.

- **Pages**: the home page (`/` in English, `/<locale>/` otherwise) and the FAQ (`/faq/<locale>/`), in folino's five
  languages. Their words are in `_data/home.yml` and `_data/faq.yml`; the structure is in `_layouts/`.
- **`/` and the browser's language**: `/` stays the English page for search engines, but a browser that asks for
  Japanese, Korean or Chinese is sent to that home page by the Worker in `worker/`, which runs for `/` alone
  (`run_worker_first` in `wrangler.jsonc`). A language picked in the switcher is kept in the `folino-lang` cookie and
  wins over the browser's. Its tests: `node --test test/home-redirect.test.mjs`.
- **Not found**: an address with no file gets `404.html`, with a 404 (`not_found_handling` in `wrangler.jsonc`).
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

## Cloudflare settings

The Worker is named `folino-site`, the same as `name` in `wrangler.jsonc`, and its Workers Builds settings are:

- Build command `bundle install && bundle exec jekyll build`; the deploy and preview commands are left at their
  defaults, which deploy with `wrangler.jsonc`. No build variables: the output is the same without
  `JEKYLL_ENV`, and the explicit `baseurl` in `_config.yml` keeps github-metadata from needing the repository's name.
- Custom domains `folino.app` and `www.folino.app`; a Cloudflare redirect rule sends `www` to the bare domain.
