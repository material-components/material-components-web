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

set -e

cd "`dirname ${BASH_SOURCE[0]}`"

[[ -z "${MCW_ENV}" ]] && MCW_ENV='dev'

# https://stackoverflow.com/a/2173421/467582
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

cbt_tunnels --username "${CBT_USERNAME}" --authkey "${CBT_AUTHKEY}" > /dev/null &
docker run -e HOST_ENV=local -v /var/run/docker.sock:/var/run/docker.sock --interactive --tty -p 3000:3000 --label "${MCW_ENV}-boss-server" "${MCW_ENV}-boss-server:latest" "$@"
