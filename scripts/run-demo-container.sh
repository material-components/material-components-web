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

function log() {
  echo '\033[36m[run-demo-container]\033[0m' "$@"
}

#REGISTRY_HOST='us.gcr.io'
#PROJECT_ID='material-components-web'
#CONTAINER_ID='dev-server'
#TAG='latest'
#REGISTRY_NAME="$REGISTRY_HOST/$PROJECT_ID/$CONTAINER_ID:$TAG"

export REGISTRY_HOST='us.gcr.io'
export PROJECT_ID='material-components-web'
export CONTAINER_ID='dev-server'
export TAG='latest'
export REGISTRY_NAME='us.gcr.io/material-components-web/dev-server:latest'

gcloud docker -- pull us.gcr.io/material-components-web/dev-server
gcloud container images list --repository us.gcr.io/material-components-web
docker ps -l
docker images
docker run -p 8080:8080 us.gcr.io/material-components-web/dev-server
DOCKER_ID=`docker ps -lq`
docker exec -t -i $DOCKER_ID /bin/bash
