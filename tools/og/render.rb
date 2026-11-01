#!/usr/bin/env ruby
# frozen_string_literal: true

# Renders the Open Graph images, images/og/<locale>.png (1200x630), that a link to folino.app shows in chats and
# social posts. Each one is the home page's hero in small: the wordmark, the hero title and subtitle from
# _data/home.yml, and the page's own iPad and iPhone screenshots from images/<locale>/.
#
# The type follows folino's App Store and Google Play screenshots: a serif for the title, a sans for the rest, one pair
# per language (the folino repo's fastlane/design/snippets/lint.js keeps the list).
#
#   ruby tools/og/render.rb          # every locale in _data/home.yml
#   ruby tools/og/render.rb ja en    # just these
#
# Needs Google Chrome (CHROME overrides its path) and a network connection, since the fonts come from Google Fonts.
# Run it again whenever the hero copy or those screenshots change.

require "erb"
require "json"
require "tmpdir"
require "yaml"

ROOT = File.expand_path("../..", __dir__)
CHROME = ENV.fetch("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
WIDTH = 1200
HEIGHT = 630

FONTS = {
  "en" => { serif: "Noto Serif", sans: "Inter" },
  "ja" => { serif: "Zen Old Mincho", sans: "Noto Sans JP" },
  "ko" => { serif: "Noto Serif KR", sans: "Noto Sans KR" },
  "zh-Hans" => { serif: "Noto Serif SC", sans: "Noto Sans SC" },
  "zh-Hant" => { serif: "Noto Serif TC", sans: "Noto Sans TC" },
}.freeze

# The longest title line has to fit the 520 px column; Latin and Hangul lines run wider than CJK ones.
TITLE_SIZE = { "en" => 48, "ko" => 48 }.freeze
DEFAULT_TITLE_SIZE = 52

TEMPLATE = ERB.new(File.read(File.join(__dir__, "card.html.erb")))

def font_css_url(fonts)
  families = [[fonts[:serif], 600], [fonts[:sans], 400]].map do |family, weight|
    "family=#{family.tr(' ', '+')}:wght@#{weight}"
  end
  "https://fonts.googleapis.com/css2?#{families.join('&')}&display=block"
end

def chrome(*args)
  # Chrome's headless mode logs display-link errors on macOS that mean nothing here.
  system(CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
         "--window-size=#{WIDTH},#{HEIGHT}", "--virtual-time-budget=20000", *args, exception: true, err: File::NULL)
end

home = YAML.load_file(File.join(ROOT, "_data/home.yml"))
locales = ARGV.empty? ? home.keys : ARGV
out_dir = File.join(ROOT, "images/og")
Dir.mkdir(out_dir) unless Dir.exist?(out_dir)

Dir.mktmpdir("folino-og") do |tmp|
  locales.each do |lang|
    hero = home.fetch(lang).fetch("hero")
    fonts = FONTS.fetch(lang)
    separator = hero.fetch("title_separator", "")
    html = TEMPLATE.result_with_hash(
      lang: lang,
      width: WIDTH,
      height: HEIGHT,
      font_css_url: font_css_url(fonts),
      serif: fonts[:serif],
      sans: fonts[:sans],
      title_size: TITLE_SIZE.fetch(lang, DEFAULT_TITLE_SIZE),
      title_lines: hero.fetch("title_groups").map { |group| group.join(separator) },
      subtitle: hero.fetch("subtitle"),
      wordmark_url: "file://#{File.join(__dir__, 'wordmark.png')}",
      ipad_url: "file://#{File.join(ROOT, 'images', lang, 'reader-ipad.webp')}",
      iphone_url: "file://#{File.join(ROOT, 'images', lang, 'reader-iphone.webp')}"
    )
    page = File.join(tmp, "#{lang}.html")
    File.write(page, html)

    dom = IO.popen([CHROME, "--headless=new", "--disable-gpu", "--virtual-time-budget=20000", "--dump-dom",
                    "file://#{page}"], err: File::NULL, &:read)
    fonts_state = dom[/data-fonts="([^"]*)"/, 1]
    abort "#{lang}: fonts #{fonts_state || 'never reported'}" unless fonts_state == "ok"

    out = File.join(out_dir, "#{lang}.png")
    chrome("--screenshot=#{out}", "file://#{page}")
    puts "#{lang}: #{out.delete_prefix("#{ROOT}/")}"
  end
end
