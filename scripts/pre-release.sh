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
  echo '\033[36m[pre-release]\033[0m' "$@"
}

log "Running pre-flight sanity checks..."

log "Checking that you can publish to npm..."
NPM_USER=$(npm whoami)
if ! npm team ls material:developers | grep -q $NPM_USER; then
  echo "FAILURE: You are not (yet?) part of the material:developers org. Please get in touch" \
       "with the MDC-Web core team to rectify this"
  exit 1
fi

log "Checking that you can access GitHub via SSH..."
if ! ssh -T git@github.com 2>&1 | grep -q "You've successfully authenticated"; then
  echo "FAILURE: It does not look like you can access github. Please ensure that the command" \
       "ssh -T git@github.com works for you"
  exit 1
fi

log "Checking that you can deploy the MDC-Web demo site..."
if ! gcloud config get-value project 2>/dev/null | grep -q material-components-web; then
  echo "FAILURE: Your gcloud project is not configured for mdc-web. Please run gcloud config set" \
       "project material-components-web and ensure it exits successfully"
  exit 1
fi

log "Checking that all packages have correct dependency rules..."
sh ./scripts/dependency-test.sh

log "Running npm test to ensure no breakages..."
npm test
echo ""

log "Building packages..."
npm run dist
echo ""

log "Moving built assets to package directories..."
node scripts/cp-pkgs.js
echo ""

# Don't immediately exit without end message if changelog commit goes wrong
set +e

log "Generating and committing changelog" \
  "(if this says no changes added to commit, something is probably wrong)"
npm run changelog
git add CHANGELOG.md
git commit -m "docs: Update CHANGELOG.md"
echo ""

log "Pre-release steps done! First, please confirm that the changelog looks" \
    "correct (git show should show the changelog commit),"
log "and amend if necessary (edit CHANGELOG.md, git add CHANGELOG.md, and" \
    "git commit --amend, assuming there _was_ a changelog commit). "
log "Next, you should run:" \
    "\$(npm bin)/lerna publish -m \"chore: Publish\""
echo ""
