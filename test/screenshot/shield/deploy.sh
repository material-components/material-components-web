#!/usr/bin/env bash

# Dev
#functions start
#functions deploy screenshot-shield-svg --entry-point=screenshotShieldSvg --trigger-http
#functions deploy screenshot-shield-url --entry-point=screenshotShieldUrl --trigger-http

# Prod
gcloud functions deploy screenshot-shield-svg --entry-point=screenshotShieldSvg --runtime nodejs8 --trigger-http
gcloud functions deploy screenshot-shield-url --entry-point=screenshotShieldUrl --runtime nodejs8 --trigger-http
