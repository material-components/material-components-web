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

# GitHub pull request number
export PR=''
# GitHub username of the author of the pull request
export AUTHOR=''
# URL of the remote Git repository to pull
export REMOTE_URL='https://github.com/material-components/material-components-web.git'
# name of the remote branch to checkout
export REMOTE_BRANCH='master'

getopt --test > /dev/null
if [[ $? -ne 4 ]]; then
  echo 'Error: `getopt --test` failed in this environment.'
  exit 1
fi

# A single colon after an option char/name (e.g, `a:`) means that it has a REQUIRED argument;
# Two colons after an option char/name (e.g, `a::`) means that it has an OPTIONAL argument.
OPTIONS=p:a:u:b:
LONGOPTIONS=pr:,author:,remote-url:,remote-branch:

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
    -p|--pr)
      export PR="$2"
      shift 2
      ;;
    -a|--author)
      export AUTHOR="$2"
      shift 2
      ;;
    -u|--remote-url)
      export REMOTE_URL="$2"
      shift 2
      ;;
    -b|--remote-branch)
      export REMOTE_BRANCH="$2"
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

if [[ -n "${PR}" ]] && [[ ! "${PR}" =~ ^[1-9][0-9]*$ ]]; then
  echo 'Error: --pr must be a positive integer value'
  exit 4
fi

if [[ -z "$REMOTE_URL" ]]; then
  echo 'Error: --remote-url is required (URL of remote Git repository to pull)'
  exit 3
fi

if [[ -z "$REMOTE_BRANCH" ]]; then
  echo 'Error: --remote-branch is required (name of remote branch to checkout)'
  exit 3
fi
