#!/usr/bin/env bash

function print_to_stderr() {
  echo "$@" >&2
}

function log_error() {
  if [[ $# -gt 0 ]]; then
    print_to_stderr -e "\033[31m\033[1m$@\033[0m"
  else
    print_to_stderr
  fi
}

function print_travis_env_vars() {
  echo
  env | grep TRAVIS
  echo
}

function maybe_extract_api_credentials() {
  if [[ -z "$encrypted_eead2343bb54_key" ]] || [[ -z "$encrypted_eead2343bb54_iv" ]]; then
    log_error
    log_error "Missing decryption keys for API credentials."
    log_error

    if [[ -n "$TRAVIS_PULL_REQUEST_SLUG" ]] && [[ ! "$TRAVIS_PULL_REQUEST_SLUG" =~ ^material-components/ ]]; then
      log_error "See https://docs.travis-ci.com/user/pull-requests/#Pull-Requests-and-Security-Restrictions for more information"
      log_error
    fi

    return
  fi

  openssl aes-256-cbc -K "$encrypted_eead2343bb54_key" -iv "$encrypted_eead2343bb54_iv" \
    -in test/screenshot/infra/auth/travis.tar.enc -out test/screenshot/infra/auth/travis.tar -d

  tar -xf test/screenshot/infra/auth/travis.tar -C test/screenshot/infra/auth/
}

function install_and_authorize_gcloud_sdk() {
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

function maybe_install_gcloud_sdk() {
  export PATH=$PATH:$HOME/google-cloud-sdk/bin
  export CLOUDSDK_CORE_DISABLE_PROMPTS=1

  if [[ -f test/screenshot/infra/auth/gcs.json ]]; then
    install_and_authorize_gcloud_sdk
  else
    log_error
    log_error "Missing Google Cloud credentials file: test/screenshot/infra/auth/gcs.json"
    log_error

    if [[ -n "$TRAVIS_PULL_REQUEST_SLUG" ]] && [[ ! "$TRAVIS_PULL_REQUEST_SLUG" =~ ^material-components/ ]]; then
      log_error "See https://docs.travis-ci.com/user/pull-requests/#Pull-Requests-and-Security-Restrictions for more information"
      log_error
    fi
  fi
}

if [[ "$TEST_SUITE" == 'screenshot' ]]; then
  print_travis_env_vars
  maybe_extract_api_credentials
  maybe_install_gcloud_sdk
fi
