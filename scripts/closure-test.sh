#!/bin/bash

##
# Copyright 2017 Google Inc.
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
  echo -e "\033[36m[closure-test]\033[0m" "$@"
}

CLOSURE_TMP=.closure-tmp
CLOSURE_PKGDIR=$CLOSURE_TMP/packages
CLOSURIZED_PKGS=$(node -e "console.log(require('./package.json').closureWhitelist.join(' '))")

if [ -z "$CLOSURIZED_PKGS" ]; then
  echo "No closurized packages to test!"
  exit 0
fi

./scripts/closure-rewrite.sh

log "Testing packages"
echo ''

set +e
for pkg in $CLOSURIZED_PKGS; do
  entry_point="goog:mdc.${pkg/mdc-/}"
  entry_point=${entry_point//-/}
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
