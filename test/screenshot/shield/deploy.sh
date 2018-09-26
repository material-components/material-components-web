#!/usr/bin/env bash

gcloud functions deploy screenshot-shield-svg --entry-point=screenshotShieldSvg --runtime nodejs8 --trigger-http
gcloud functions deploy screenshot-shield-url --entry-point=screenshotShieldUrl --runtime nodejs8 --trigger-http
