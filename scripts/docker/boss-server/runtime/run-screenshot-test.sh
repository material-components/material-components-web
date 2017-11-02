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
set -x

cd "`dirname ${BASH_SOURCE[0]}`"

[[ -z "${MCW_ENV}" ]] && MCW_ENV='dev'

SCRIPT_ARGS=("$@")

echo ARGS: "$@"
echo SCRIPT_ARGS: "${SCRIPT_ARGS[@]}"

. /scripts/run-screenshot-test-args.sh

# https://stackoverflow.com/a/2173421/467582
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

DATE_SAFE="`date '+%Y-%m-%dt%H-%M-%S'`"

BOSS_CLUSTER_NAME="${MCW_ENV}-pr-boss-cluster"
BOSS_CLUSTER_ZONE='us-west1-b'
DEMO_CLUSTER_NAME="${MCW_ENV}-pr-demo-cluster"
DEMO_CLUSTER_ZONE='us-central1-b'
TEST_CLUSTER_NAME="${MCW_ENV}-pr-test-cluster"
TEST_CLUSTER_ZONE='us-east1-b'
#gcloud container clusters create "${BOSS_CLUSTER_NAME}" --num-nodes=1 --zone "${BOSS_CLUSTER_ZONE}"
#gcloud container clusters create "${DEMO_CLUSTER_NAME}" --num-nodes=8 --zone "${DEMO_CLUSTER_ZONE}"
#gcloud container clusters create "${TEST_CLUSTER_NAME}" --num-nodes=1 --zone "${TEST_CLUSTER_ZONE}"

DEPLOYMENT="${MCW_ENV}-pr-${PR}-test-deployment"
CBT_DEMO_HOST=''
INTERNAL_PORT=8080
EXTERNAL_PORT=80
LOCAL_DEMO_SERVER_NAME=

# TODO(acdvorak): Detect whether we are running locally, and if so, run docker commands instead
function kill-demo-server() {
  set +e

  if [[ "$HOST_ENV" == 'local' ]]; then
    sudo docker stop `sudo docker ps --quiet --all --latest --filter "label=${MCW_ENV}-demo-server"`
  else
    kubectl delete deployment,service "${DEPLOYMENT}"
    kubectl delete pod --selector="run=${DEPLOYMENT}"
  fi

  set -e
}

# TODO(acdvorak): Detect whether we are running locally, and if so, run docker commands instead
function start-demo-server() {
  if [[ "$HOST_ENV" == 'local' ]]; then
    sudo docker run -e HOST_ENV="$HOST_ENV" -p "${INTERNAL_PORT}:${INTERNAL_PORT}" --label "${MCW_ENV}-demo-server" "${MCW_ENV}-demo-server:latest" "${SCRIPT_ARGS[@]}" &
  else
    # Configure kubectl to use the previously-created cluster
    gcloud container clusters get-credentials --zone "${TEST_CLUSTER_ZONE}" "${TEST_CLUSTER_NAME}"

    # Deploy the application and create 1 pod with 1 cluster with 1 node
    kubectl run "${DEPLOYMENT}" --image="us.gcr.io/material-components-web/${MCW_ENV}-demo-server:latest" --port "${INTERNAL_PORT}" -- "${SCRIPT_ARGS[@]}"

    # Expose the server to the internet
    kubectl expose deployment "${DEPLOYMENT}" --type=LoadBalancer --port "${EXTERNAL_PORT}" --target-port "${INTERNAL_PORT}"
  fi
}

function get-demo-ip-address() {
  if [[ "$HOST_ENV" == 'local' ]]; then
    CBT_DEMO_HOST='local:8080'
    CLIENT_DEMO_HOST='localhost:8080'
  else
    echo -n "${DEPLOYMENT}: "

    ATTEMPT_COUNT=0
    while [[ $ATTEMPT_COUNT -lt 120 ]] && ! is-valid-host "${CBT_DEMO_HOST}"; do
      CBT_DEMO_HOST=`kubectl get -o go-template --template='{{if .status.loadBalancer.ingress}}{{index (index .status.loadBalancer.ingress 0) "ip"}}{{end}}' "service/${DEPLOYMENT}"`
      LOCAL_DEMO_HOST="$CBT_DEMO_HOST"
      ATTEMPT_COUNT=$(($ATTEMPT_COUNT + 1))

      if ! is-valid-host "${CBT_DEMO_HOST}"; then
        echo -n '.'
        sleep 1
      fi
    done

    # Clear the line
    # https://unix.stackexchange.com/a/26592/17460
    echo -n -e "\033[2K\r"
  fi
}

function run-screenshot-tests() {
  echo
  echo '======================================'
  echo

  if is-valid-host "${CBT_DEMO_HOST}"; then
    echo "${DEPLOYMENT}: ${CBT_DEMO_HOST}"
    echo

    if [[ "$HOST_ENV" == 'local' ]]; then
      sleep 60
    fi

    # While webpack-dev-server is compiling, an express server is already running in the background. It accepts HTTP
    # requests almost immediately after running `npm run dev`, but delays its response until compilation has finished.
    # By sending an initial HTTP request, we effectively pause the script until the server is ready to receive UI
    # tests without timing out.
    set +e
    curl "http://${LOCAL_DEMO_HOST}/" > /dev/null
    set -e

    # Run screenshot tests
    node /scripts/cbt/index.js --host "${CBT_DEMO_HOST}" "${SCRIPT_ARGS[@]}"

    # Tear down the container and its associated GCloud resources
    kill-demo-server
    # TODO(acdvorak): Notify boss container that server was downed, to add it back to the pool
  else
    echo "${DEPLOYMENT}: ERROR: External IP address not found after 120 seconds"
  fi

  echo
}

function is-valid-host() {
  [[ "$1" =~ ^local|^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]
  return $?
}

kill-demo-server
start-demo-server
get-demo-ip-address
run-screenshot-tests
