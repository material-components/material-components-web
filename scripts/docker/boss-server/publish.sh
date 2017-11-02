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

# Default to local builds for now. GCloud's version of Docker doesn't support the --chown option on COPY.
# It can be worked around, but doing so increases the number of layers and the size of the final container image.
# See https://stackoverflow.com/a/44766666/467582 for details.
if [[ "$1" == '--remote-build' ]]; then
  # Upload the build manifest to GCloud, and run the build remotely:
  gcloud container builds submit --config "cloudbuild.${MCW_ENV}.yaml" .
else
  # Build locally and upload the image to GCloud:
  docker build -t "${MCW_ENV}-boss-server:latest" -t "us.gcr.io/material-components-web/${MCW_ENV}-boss-server:latest" .
  gcloud docker -- push "us.gcr.io/material-components-web/${MCW_ENV}-boss-server:latest"
fi
