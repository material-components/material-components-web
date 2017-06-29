#!/bin/bash

# Rewrites our .scss files to be compatible with closure-stylesheets 
# in our internal Blaze infrastructure.

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
  echo -e "\033[36m[closure-rewriter]\033[0m" "$@"
}

CLOSURE_TMP=.closure-tmp
CLOSURE_PKGDIR=$CLOSURE_TMP/packages

log "Prepping packages for rewrite"

rm -fr $CLOSURE_TMP/**
mkdir -p $CLOSURE_PKGDIR
PACKAGE_NAMES=$(ls packages)
for pkg in $PACKAGE_NAMES ; do
  if [[ $pkg != *"mdc-"* ]]; then
    continue
  fi
  cp -r "packages/$pkg" $CLOSURE_PKGDIR
done
rm -fr $CLOSURE_PKGDIR/**/{node_modules,dist}

log "Rewriting all import statements to be closure compatible"
node scripts/rewrite-sass-import-statements-for-closure.js $CLOSURE_PKGDIR
