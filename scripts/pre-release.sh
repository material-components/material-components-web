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
  echo -e '\033[36m[pre-release]\033[0m' "$@"
}

function prompt() {
  local REPLY='...dummy value...'
  while [[ $REPLY != '' ]] && [[ ! $REPLY =~ ^[YyNn]$ ]]; do
    echo -e -n '\033[31m[pre-release]\033[0m' "$@" '[y/N]: '
    read -r
  done
  [[ $REPLY =~ ^[Yy]$ ]] && return 0 || return 1
}

log "Running pre-flight sanity checks..."

log "Checking out 'master' and pulling latest commits from GitHub..."
git checkout master
git pull --tags
LOCAL_CHANGE_COUNT=$(git status --porcelain=v1 | wc -l)
if [[ $LOCAL_CHANGE_COUNT -gt 0 ]]; then
  git status
  echo
  if prompt "WARNING: There are $LOCAL_CHANGE_COUNT locally modified files. Continue?"; then
    log 'YOU HAVE BEEN WARNED! Continuing...'
  else
    log 'Aborting!'
    exit 1
  fi
fi

log "Checking that you can publish to npm..."
NPM_USER=$(npm whoami)
if ! npm team ls material:developers | grep -q $NPM_USER; then
  echo "FAILURE: You are not (yet?) part of the material:developers org. Please get in touch" \
       "with the MDC Web core team to rectify this"
  exit 1
fi

log "Checking that you can access GitHub via SSH..."
if ! ssh -T git@github.com 2>&1 | grep -q "You've successfully authenticated"; then
  echo "FAILURE: It does not look like you can access github. Please ensure that the command" \
       "ssh -T git@github.com works for you"
  exit 1
fi

log "Checking that you can deploy the MDC Web demo site..."
if ! gcloud config get-value project 2>/dev/null | grep -q material-components-web; then
  echo "FAILURE: Your gcloud project is not configured for MDC Web. Please run gcloud config set" \
       "project material-components-web and ensure it exits successfully"
  exit 1
fi

log "Checking that all packages have correct dependency rules..."
sh ./scripts/dependency-test.sh

log "Running npm test to ensure no breakages..."
npm test
echo

log "Pre-release steps done! Next, you should run: ./scripts/release.sh"
echo
