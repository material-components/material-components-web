#!/usr/bin/env bash

function print_error() {
  echo -e "\033[31m\033[1m$@\033[0m"
}

function exit_if_external_pr() {
  if [[ -n "$TRAVIS_PULL_REQUEST_SLUG" ]] && [[ ! "$TRAVIS_PULL_REQUEST_SLUG" =~ ^material-components/ ]]; then
    echo
    print_error "Error: $TEST_SUITE tests are not supported on external PRs."
    print_error "Skipping $TEST_SUITE tests."
    exit 19
  fi
}

function extract_api_credentials() {
  openssl aes-256-cbc -K $encrypted_eead2343bb54_key -iv $encrypted_eead2343bb54_iv \
    -in test/screenshot/infra/auth/travis.tar.enc -out test/screenshot/infra/auth/travis.tar -d

  tar -xf test/screenshot/infra/auth/travis.tar -C test/screenshot/infra/auth/

  echo
  echo 'git status:'
  echo
  git status
  echo
  env | grep TRAVIS
  echo
}

function install_google_cloud_sdk() {
  if [[ ! -d $HOME/google-cloud-sdk ]]; then
    curl -o /tmp/gcp-sdk.bash https://sdk.cloud.google.com
    chmod +x /tmp/gcp-sdk.bash
    /tmp/gcp-sdk.bash --disable-prompts
  fi

  export PATH=$PATH:$HOME/google-cloud-sdk/bin
  export CLOUDSDK_CORE_DISABLE_PROMPTS=1

  gcloud auth activate-service-account --key-file test/screenshot/infra/auth/gcs.json
  gcloud config set project material-components-web
  gcloud components install gsutil

  which gsutil 2>&1 > /dev/null
  if [[ $? != 0 ]]; then
    pip install --upgrade pip
    pip install gsutil
  fi
}

if [[ "$TEST_SUITE" == 'screenshot' ]] || [[ "$TEST_SUITE" == 'unit' ]]; then
  exit_if_external_pr
fi

if [[ "$TEST_SUITE" == 'screenshot' ]]; then
  extract_api_credentials
  install_google_cloud_sdk
fi
