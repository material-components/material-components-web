#!/usr/bin/env bash

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

. /scripts/execute-args.sh
. /scripts/source-nvm.sh

set -e
set -x

# Nuke any modified or untracked files
git reset --hard HEAD
git clean -d --force

# Get the latest code and prune obsolete branches/tags
git fetch --tags
if [[ -n "${PR}" ]]; then
  git checkout -b "pr/${PR}" origin/master
elif [[ -n "${REMOTE_BRANCH}" ]] && [[ "${REMOTE_BRANCH}" != 'master' ]]; then
  git checkout -b "${REMOTE_BRANCH}"
else
  git checkout master
fi
git pull "${REMOTE_URL}" "${REMOTE_BRANCH}"
git fetch --prune

set +x

echo 'Installing node modules...'
npm install

echo 'Starting demo server...'
npm run dev
