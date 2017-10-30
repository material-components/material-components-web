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

# Fetch the latest changes and prune obsolete branches/tags
git checkout master
git fetch --tags --prune origin
git pull

# Delete old remotes
git remote | grep -v '^origin$' | tr '\n' '\0' | xargs -0 -n1 --no-run-if-empty git remote rm

# Delete old branches
git branch | grep -v -E '^[*]' | tr -d ' ' | grep -v '^master$' | tr '\n' '\0' | xargs -0 -n1 --no-run-if-empty git branch -D

DATE_SAFE="`date '+%Y-%m-%d@%H-%M-%S'`"
REPO_NAME_SAFE="`echo "${REMOTE_URL}" | sed -E -e 's%.*github.com%%' -e 's%^[/:]|[.]git$%%g' -e 's%[^a-zA-Z0-9-]+%-%g' -e 's%-{2,}%-%g' -e 's%^-|-$%%g'`"

if [[ -n "${PR}" ]]; then
  REMOTE_NAME="pr-${PR}"
  LOCAL_BRANCH="pr/${PR}"
else
  REMOTE_NAME="temp_${REPO_NAME_SAFE}_${DATE_SAFE}"
  LOCAL_BRANCH="temp/${REPO_NAME_SAFE}/${DATE_SAFE}"
fi

git remote add -t "${REMOTE_BRANCH}" "${REMOTE_NAME}" "${REMOTE_URL}"
git fetch "${REMOTE_NAME}"
git checkout -b "${LOCAL_BRANCH}" "${REMOTE_NAME}/${REMOTE_BRANCH}"

set +e

# https://stackoverflow.com/a/1655389/467582
IFS='' read -r -d '' INFO_HTML <<EOF
<!doctype html>
<html>
  <head>
    <title>Demo Info - MDC-Web</title>
  </head>
  <body>
    <h1>MDC-Web Demo</h1>
    <table>
      <tbody>
        <tr>
          <td>--pr=</td>
          <td>'${PR}'</td>
        </tr>
        <tr>
          <td>--author=</td>
          <td>'${AUTHOR}'</td>
        </tr>
        <tr>
          <td>--remote-branch=</td>
          <td>'${REMOTE_BRANCH}'</td>
        </tr>
        <tr>
          <td>--remote-url=</td>
          <td>'${REMOTE_URL}'</td>
        </tr>
        <tr>
          <td>Remote name:</td>
          <td>'${REMOTE_NAME}'</td>
        </tr>
        <tr>
          <td>Local branch:</td>
          <td>'${LOCAL_BRANCH}'</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
EOF

mkdir -p demos/info/
echo "${INFO_HTML}" > demos/info/index.html

set -e
set +x

echo 'Installing node modules...'
npm install

echo 'Starting demo server...'
npm run dev
