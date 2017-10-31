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

ENV=dev

PRS=(1469 1485 1484)
AUTHORS=(iamJoeTaylor bonniezhou kfranqueiro)
REMOTE_URLS=(https://github.com/iamJoeTaylor/material-components-web.git https://github.com/material-components/material-components-web.git https://github.com/material-components/material-components-web.git)
REMOTE_BRANCHES=(joetaylor/issue-1435-textfield-hightlight-color rename-textfield fix/slider-up-events)

DATE_SAFE="`date '+%Y-%m-%dt%H-%M-%S'`"

BOSS_CLUSTER_NAME="${ENV}-pr-boss-cluster"
BOSS_CLUSTER_ZONE='us-west1-b'
DEMO_CLUSTER_NAME="${ENV}-pr-demo-cluster"
DEMO_CLUSTER_ZONE='us-central1-b'
TEST_CLUSTER_NAME="${ENV}-pr-test-cluster"
TEST_CLUSTER_ZONE='us-east1-b'
#gcloud container clusters create "${BOSS_CLUSTER_NAME}" --num-nodes=1 --zone "${BOSS_CLUSTER_ZONE}"
#gcloud container clusters create "${DEMO_CLUSTER_NAME}" --num-nodes=8 --zone "${DEMO_CLUSTER_ZONE}"
#gcloud container clusters create "${TEST_CLUSTER_NAME}" --num-nodes=1 --zone "${TEST_CLUSTER_ZONE}"

DEPLOYMENT_NAMES=()
IP_ADDRESSES=()

for i in `seq 0 1 2`; do
  DEPLOYMENT="${ENV}-pr-test-deployment-${i}"
  DEPLOYMENT_NAMES[$i]="${DEPLOYMENT}"

  # Configure kubectl to use the previously-created cluster
  gcloud container clusters get-credentials --zone "${TEST_CLUSTER_ZONE}" "${TEST_CLUSTER_NAME}"

  # Deploy the application and create 1 pod with 1 cluster with 1 node
  kubectl run "${DEPLOYMENT}" --image=us.gcr.io/material-components-web/dev-server:latest --port 8080 -- --pr "${PRS[$i]}" --author "${AUTHORS[$i]}" --remote-url "${REMOTE_URLS[$i]}" --remote-branch "${REMOTE_BRANCHES[$i]}" "$@"

  # Expose the server to the internet
  kubectl expose deployment "${DEPLOYMENT}" --type=LoadBalancer --port 80 --target-port 8080
done

set +x

function is-ip-address() {
  [[ "$1" =~ ^[0-9] ]]
  return $?
}

for i in `seq 0 1 2`; do
  echo -n "${DEPLOYMENT_NAMES[$i]}: "

  ATTEMPT_COUNT=0
  while [[ $ATTEMPT_COUNT -lt 120 ]] && ! is-ip-address "${IP_ADDRESSES[$i]}"; do
    IP_ADDRESSES[$i]=`kubectl get -o go-template --template='{{if .status.loadBalancer.ingress}}{{index (index .status.loadBalancer.ingress 0) "ip"}}{{end}}' "service/${DEPLOYMENT_NAMES[$i]}"`
    ATTEMPT_COUNT=$(($ATTEMPT_COUNT + 1))

    if ! is-ip-address "${IP_ADDRESSES[$i]}"; then
      echo -n '.'
      sleep 1
    fi
  done

  # Clear the line
  # https://unix.stackexchange.com/a/26592/17460
  echo -n -e "\033[2K\r"

  if is-ip-address "${IP_ADDRESSES[$i]}"; then
    echo "${DEPLOYMENT_NAMES[$i]}: ${IP_ADDRESSES[$i]}"

    # Run screenshot tests
    node ../../test/screenshot/cbt/index.js --pr "${PRS[$i]}" --author "${AUTHORS[$i]}" --commit `git rev-parse HEAD` --host "${IP_ADDRESSES[$i]}"

    # Tear down the container
    POD_ID=`kubectl get pods --selector="run=${DEPLOYMENT_NAMES[$i]}" --output=go-template --template='{{(index .items 0).metadata.name}}'`
    kubectl delete pod "${POD_ID}"
    kubectl delete deployment "${DEPLOYMENT_NAMES[$i]}"
    kubectl delete service "${DEPLOYMENT_NAMES[$i]}"
    # TODO(acdvorak): Notify boss container that server was downed, to add it back to the pool
  else
    echo "${DEPLOYMENT_NAMES[$i]}: ERROR: External IP address not found after 120 seconds"
  fi
done

set +x
