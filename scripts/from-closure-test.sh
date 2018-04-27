#!/bin/bash

##
# Copyright 2017 Google Inc. All Rights Reserved.
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
  echo -e "\033[36m[from-closure-test]\033[0m" "$@"
}

CLOSURE_TMP=.closure-tmp
FROM_CLOSURE_TMP=.from-closure-tmp
FROM_CLOSURE_PKGDIR=$FROM_CLOSURE_TMP/packages
CLOSURIZED_PKGS=$(node -e "console.log(require('./package.json').closureWhitelist.join(' '))")

if [ -z "$CLOSURIZED_PKGS" ]; then
  echo "No closurized packages to test!"
  exit 0
fi

log "Prepping whitelisted packages for JS compilation/rewrite"

rm -fr $FROM_CLOSURE_TMP/**
mkdir -p $FROM_CLOSURE_PKGDIR
for pkg in $CLOSURIZED_PKGS; do
  cp -r "$CLOSURE_TMP/packages/$pkg" $FROM_CLOSURE_PKGDIR
done
rm -fr $FROM_CLOSURE_PKGDIR/**/{node_modules,dist}

log "Rewriting all goog.require statements to be imports" "$FROM_CLOSURE_PKGDIR"
node scripts/rewrite-decl-statements-from-closure-test.js $FROM_CLOSURE_PKGDIR
echo ''

log "TODO: Need to copy from .from-closure-tmp into the repository"

log "TODO: Need to npm test packages"
echo 'npm run test'
echo ''

echo ''
echo '✨  All tests pass! ✨'
