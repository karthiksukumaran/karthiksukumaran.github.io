#!/usr/bin/env bash
# Build the site locally exactly like GitHub Pages does (needs Docker).
# Output goes to _site/. Preview with: python -m http.server 8000 --directory _site
cd "$(dirname "$0")"
MSYS_NO_PATHCONV=1 docker run --rm \
  -v "$(pwd -W 2>/dev/null || pwd):/srv/site" \
  -v jekyll-gems:/usr/local/bundle \
  -w /srv/site ruby:3.3 \
  bash -c "bundle install --quiet && bundle exec jekyll build $*"
