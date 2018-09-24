#!/bin/sh

##
# Copyright 2016 Google Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#

set -e

function log() {
  echo '\033[36m[post-release]\033[0m' "$@"
}

if [[ $(git diff --cached CHANGELOG.md) ]]; then
  log "Found modified CHANGELOG; committing as-is"
else
  if [[ $(git diff CHANGELOG.md) ]]; then
    log "Found modified CHANGELOG; committing as-is"
  else
    log "Generating changelog"
    npm run changelog
  fi
  git add CHANGELOG.md
fi
git commit -m "docs: Update CHANGELOG.md"
echo ""

# Extract repo version from updated lerna.json
REPO_VERSION=$(grep 'version' lerna.json | sed 's/ *"version": "//' | sed 's/",//')
SEMVER_TAG="v$REPO_VERSION"
log "Tagging repo using semver tag $SEMVER_TAG"
git tag $SEMVER_TAG -m "Material Components for the web release $SEMVER_TAG"
echo ""

log "Post-release steps done! Next, continue with the Push step in the Release Process documentation:"
echo "https://github.com/material-components/material-components-web/blob/master/docs/open_source/release-process.md#push"
echo ""
