#!/usr/bin/env bash

set -x
set -e

cd "`dirname ${BASH_SOURCE[0]}`"
cd ..

npm run build:demo
cd build/
firebase use --add mdc-web-gm2-card-demo
firebase deploy

cd "`dirname ${BASH_SOURCE[0]}`"

