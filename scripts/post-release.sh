#!/bin/sh

##
# Copyright 2016 Google Inc. All Rights Reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#

set -e

function log() {
  echo -e '\033[36m[post-release]\033[0m' "$@"
}

# Extract repo version from updated lerna.json
REPO_VERSION=$(grep 'version' lerna.json | sed -E 's/[^0-9.]+//g')
export SEMVER_TAG="v$REPO_VERSION"

# Get list of package directories that have new version numbers
PACKAGE_DIRS=$(git status --porcelain=v1 packages/*/package.json | sed 's/^ M //' | xargs dirname)

function npm_publish() {
  log "Publishing $1..."
  npm publish "$1" --tag $SEMVER_TAG
}

log "Committing new package versions..."
git add lerna.json packages/*/package.json
git commit -m "chore: Publish"
echo

log "Committing changelog..."
git add CHANGELOG.md
git commit -m "docs: Update CHANGELOG.md"
echo

log "Tagging repo using semver tag $SEMVER_TAG..."
git tag $SEMVER_TAG -m "Material Components for the Web release $SEMVER_TAG"
echo

log "Pushing commits to GitHub..."
git push && git push --tags
echo

log "Publishing to NPM..."
export -f log
export -f npm_publish
echo "$PACKAGE_DIRS" | xargs -I '{}' /bin/sh -c 'npm_publish "$@"' _ '{}'
echo

log "Deploying catalog server..."
MDC_ENV=development npm run build:demos && gcloud app deploy
echo

log "Post-release steps done! $SEMVER_TAG has been published to NPM, GitHub, and the catalog server"
