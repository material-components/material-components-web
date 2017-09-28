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
  echo -e "\033[36m[closure-test]\033[0m" "$@"
}

CLOSURE_TMP=.closure-tmp
CLOSURE_PKGDIR=$CLOSURE_TMP/packages
CLOSURIZED_PKGS=$(node -e "console.log(require('./package.json').closureWhitelist.join(' '))")

if [ -z "$CLOSURIZED_PKGS" ]; then
  echo "No closurized packages to test!"
  exit 0
fi

log "Prepping whitelisted packages for JS compilation"

rm -fr $CLOSURE_TMP/**
mkdir -p $CLOSURE_PKGDIR
for pkg in $CLOSURIZED_PKGS; do
  cp -r "packages/$pkg" $CLOSURE_PKGDIR
done
rm -fr $CLOSURE_PKGDIR/**/{node_modules,dist}

log "Rewriting all import statements to be closure compatible"
node scripts/rewrite-decl-statements-for-closure-test.js $CLOSURE_PKGDIR

log "Testing packages"
echo ''

set +e
for pkg in $CLOSURIZED_PKGS; do
  entry_point="goog:mdc.${pkg/mdc-/}"
  # Note that the jscomp_error flags turn all default warnings into errors, so that
  # closure exits with a non-zero status if any of them are caught.
  # Also note that we disable accessControls checks due to
  # https://github.com/google/closure-compiler/issues/2261
  CMD="java -jar node_modules/google-closure-compiler/compiler.jar \
  --externs closure_externs.js \
  --compilation_level ADVANCED \
  --js $(find $CLOSURE_PKGDIR -type f -name "*.js") \
  --language_out ECMASCRIPT5_STRICT \
  --dependency_mode STRICT \
  --module_resolution LEGACY \
  --js_module_root $CLOSURE_PKGDIR \
  --entry_point $entry_point \
  --checks_only \
  --jscomp_error checkTypes \
  --jscomp_error conformanceViolations \
  --jscomp_error functionParams \
  --jscomp_error globalThis \
  --jscomp_error invalidCasts \
  --jscomp_error misplacedTypeAnnotation \
  --jscomp_error nonStandardJsDocs \
  --jscomp_error suspiciousCode \
  --jscomp_error uselessCode \
  --jscomp_off accessControls
  "
  $CMD

  if [ $? -eq 0 ]; then
    echo -e "\033[32;1mPASS\033[0m" "$pkg"
  else
    # Add extra space after compiler output
    echo ''
    echo -e "\033[31;1mFAIL\033[0m" "$pkg"
    echo "Failed with the following command:"
    echo $CMD
    exit 1
  fi
done
set -e

echo ''
echo '✨  All tests pass! ✨'
