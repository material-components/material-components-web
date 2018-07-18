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

function print_travis_env_vars() {
  echo
  env | grep TRAVIS
  echo
}

function extract_api_credentials() {
  openssl aes-256-cbc -K $encrypted_eead2343bb54_key -iv $encrypted_eead2343bb54_iv \
    -in test/screenshot/infra/auth/travis.tar.enc -out test/screenshot/infra/auth/travis.tar -d

  tar -xf test/screenshot/infra/auth/travis.tar -C test/screenshot/infra/auth/
}

function install_google_cloud_sdk() {
  export PATH=$PATH:$HOME/google-cloud-sdk/bin
  export CLOUDSDK_CORE_DISABLE_PROMPTS=1

  which gcloud 2>&1 > /dev/null

  if [[ $? == 0 ]]; then
    echo 'gcloud already installed'
    echo
  else
    echo 'gcloud not installed'
    echo

    rm -rf $HOME/google-cloud-sdk
    curl -o /tmp/gcp-sdk.bash https://sdk.cloud.google.com
    chmod +x /tmp/gcp-sdk.bash

    # The gcloud installer runs `tar -C "$install_dir" -zxvf "$download_dst"`, which generates a lot of noisy output.
    # Filter out all lines from `tar`.
    /tmp/gcp-sdk.bash | grep -v -E '^google-cloud-sdk/'
  fi

  gcloud auth activate-service-account --key-file test/screenshot/infra/auth/gcs.json
  gcloud config set project material-components-web
  gcloud components install gsutil
  gcloud components update gsutil
}

if [[ "$TEST_SUITE" == 'unit' ]]; then
  exit_if_external_pr
elif [[ "$TEST_SUITE" == 'screenshot' ]]; then
  exit_if_external_pr
  print_travis_env_vars
  extract_api_credentials
  install_google_cloud_sdk
fi
