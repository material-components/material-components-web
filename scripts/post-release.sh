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
