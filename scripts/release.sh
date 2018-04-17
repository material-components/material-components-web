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
  echo -e '\033[36m[release]\033[0m' "$@"
}

log "Updating package version numbers..."
$(npm bin)/lerna publish --skip-git --skip-npm
echo

log "Building packages..."
npm run dist
echo

log "Moving built assets to package directories..."
node scripts/cp-pkgs.js
echo

log "Generating changelog..."
npm run changelog
echo

log "Release steps done! Next, you should run: ./scripts/post-release.sh"
echo
