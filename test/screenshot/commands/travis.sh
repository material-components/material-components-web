#!/usr/bin/env bash

if [ "$TEST_SUITE" == 'screenshot' ]; then
  if [ ! -d $HOME/google-cloud-sdk ]; then
    curl -o /tmp/gcp-sdk.bash https://sdk.cloud.google.com
    chmod +x /tmp/gcp-sdk.bash
    /tmp/gcp-sdk.bash --disable-prompts
  fi

  export PATH=$PATH:$HOME/google-cloud-sdk/bin
  export CLOUDSDK_CORE_DISABLE_PROMPTS=1

  openssl aes-256-cbc -K $encrypted_2fd1810d2cb7_key -iv $encrypted_2fd1810d2cb7_iv \
    -in travis-gcs.tar.gz.enc -out travis-gcs.tar.gz -d
  tar -xzf travis-gcs.tar.gz

  gcloud auth activate-service-account --key-file travis-gcs.json
  gcloud config set project material-components-web

  # TODO(acdvorak): Figure out why this doesn't work
  #gcloud components install gsutil

  curl -o /tmp/gsutil.tar.gz https://storage.googleapis.com/pub/gsutil.tar.gz
  tar -xfz /tmp/gsutil.tar.gz -C $HOME
  export PATH=${PATH}:$HOME/gsutil
fi
