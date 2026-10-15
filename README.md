# folino-site

folino's website, published at <https://folino.app> by GitHub Pages from `main`: a push is a release.

- **Pages**: the home page (`/` in English, `/<locale>/` otherwise) and the FAQ (`/faq/<locale>/`), in folino's five
  languages. Their words are in `_data/home.yml` and `_data/faq.yml`; the structure is in `_layouts/`.
- **What stays on harmolo.com**: folino's privacy policy (`https://harmolo.com/folino/privacy-policy/<locale>/`), which
  the App Store, Google Play and the app link to, and Harmolo's own pages. The old `harmolo.com/folino/` home and FAQ
  URLs redirect here.
- **Shared with harmolo.com**: `assets/css/style.css`, the store badges and the locale plumbing came from
  [jiyimeta.github.io](https://github.com/jiyimeta/jiyimeta.github.io). A fix to one of them may be owed to the other.
- **Screenshots** under `images/<locale>/` are captured with folino's `Scripts/capture-screenshots.sh --bare`.

## Preview locally

```sh
bundle install
bundle exec jekyll serve
```

The `github-pages` gem pins Jekyll to the version GitHub Pages builds with; `.ruby-version` names the Ruby it needs.
