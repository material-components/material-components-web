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

DEPLOYMENT="${MCW_ENV}-boss-deployment"
IP_ADDRESS=''

function release-gcloud-resources() {
  kubectl delete pod,service,deployment --all
}

function start-boss-server() {
  # Configure kubectl to use the previously-created cluster
  gcloud container clusters get-credentials --zone "${BOSS_CLUSTER_ZONE}" "${BOSS_CLUSTER_NAME}"

  # Deploy the application and create 1 pod with 1 cluster with 1 node
  kubectl run "${DEPLOYMENT}" --image="us.gcr.io/material-components-web/${MCW_ENV}-boss-server:latest" --port 3000 -- "$@"

  # Expose the server to the internet
  kubectl expose deployment "${DEPLOYMENT}" --type=LoadBalancer --port 80 --target-port 3000
}

function print-ip-address() {
  set +x

  echo -n "${DEPLOYMENT}: "

  ATTEMPT_COUNT=0
  while [[ $ATTEMPT_COUNT -lt 120 ]] && ! is-ip-address "${IP_ADDRESS}"; do
    IP_ADDRESS=`kubectl get -o go-template --template='{{if .status.loadBalancer.ingress}}{{index (index .status.loadBalancer.ingress 0) "ip"}}{{end}}' "service/${DEPLOYMENT}"`
    ATTEMPT_COUNT=$(($ATTEMPT_COUNT + 1))

    if ! is-ip-address "${IP_ADDRESS}"; then
      echo -n '.'
      sleep 1
    fi
  done

  # Clear the line
  # https://unix.stackexchange.com/a/26592/17460
  echo -n -e "\033[2K\r"

  echo
  echo '======================================'
  echo

  if is-ip-address "${IP_ADDRESS}"; then
    echo "${DEPLOYMENT}: ${IP_ADDRESS}"

    # While webpack-dev-server is compiling, an express server is already running in the background. It accepts HTTP
    # requests almost immediately after running `npm run dev`, but delays its response until compilation has finished.
    # By sending an initial HTTP request, we effectively pause the script until the server is ready to receive UI
    # tests without timing out.
    set +e
    curl "http://${IP_ADDRESS}/" > /dev/null
    set -e
  else
    echo "${DEPLOYMENT}: ERROR: External IP address not found after 120 seconds"
  fi

  echo
}

function is-ip-address() {
  [[ "$1" =~ ^[0-9] ]]
  return $?
}

release-gcloud-resources
start-boss-server
print-ip-address

set +x
