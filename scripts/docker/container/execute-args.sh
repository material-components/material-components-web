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

set +e

# Adapted from https://stackoverflow.com/a/29754866/467582

AUTHOR=''
PR=''
REMOTE_URL='https://github.com/material-components/material-components-web.git'
REMOTE_BRANCH='master'

getopt --test > /dev/null
if [[ $? -ne 4 ]]; then
  echo 'Error: `getopt --test` failed in this environment.'
  exit 1
fi

OPTIONS=a:p:u:b:
LONGOPTIONS=author:,pr:,remote-url:,remote-branch:

# -temporarily store output to be able to check for errors
# -activate advanced mode getopt quoting e.g. via “--options”
# -pass arguments only via   -- "$@"   to separate them correctly
PARSED=$(getopt --options=$OPTIONS --longoptions=$LONGOPTIONS --name "$0" -- "$@")
if [[ $? -ne 0 ]]; then
  # e.g. $? == 1
  #  then getopt has complained about wrong arguments to stdout
  exit 2
fi
# use eval with "$PARSED" to properly handle the quoting
eval set -- "$PARSED"

set -e

# now enjoy the options in order and nicely split until we see --
while true; do
  case "$1" in
    -a|--author)
      AUTHOR="$2"
      shift 2
      ;;
    -p|--pr)
      PR="$2"
      shift 2
      ;;
    -u|--remote-url)
      REMOTE_URL="$2"
      shift 2
      ;;
    -b|--remote-branch)
      REMOTE_BRANCH="$2"
      shift 2
      ;;
    --)
      shift
      break
      ;;
    *)
      echo "Programming error"
      exit 3
      ;;
  esac
done

if [[ -z "$AUTHOR" ]]; then
  echo 'Error: --author is required (GitHub username of pull request author)'
  exit 3
fi

if [[ -z "$PR" ]]; then
  echo 'Error: --pr is required (GitHub pull request number)'
  exit 3
fi

if [[ -z "$REMOTE_URL" ]]; then
  echo 'Error: --remote-url is required (URL of remote Git repository to pull)'
  exit 3
fi

if [[ -z "$REMOTE_BRANCH" ]]; then
  echo 'Error: --remote-branch is required (name of remote branch to checkout)'
  exit 3
fi
