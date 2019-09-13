#!/bin/sh

set -e

function log() {
  echo '\033[36m[canary-release]\033[0m' "$@"
}

function fail() {
  echo '\033[31mFAILURE:\033[0m' "$@"
}

log "Preparing for canary release..."

CURRENT_GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

log "Installing dependencies..."
if ! npm i; then
  fail "npm install failed."
  exit 1
fi

log "Running pre-release script..."
if ! ./scripts/pre-release.sh; then
  fail "Pre-release script failed"
  exit 1
fi

log "Bumping up MDC Web version to canary..."
if ! npx lerna version premajor --no-git-tag-version --no-push --preid canary.$(git rev-parse --short HEAD) --yes; then
  fail "lerna version command failed"
  exit 1
fi

CANARY_RELEASE_VERSION=$(npm run version --silent)

log "Creating temporary release branch..."
  git checkout -B release/v$(npm run version --silent)
  git commit -am "chore: Publish"
echo ""

log "Creating release..."
  git tag v$(npm run version --silent)
echo ""

log "Publishing packages to NPM..."
if ! npx lerna publish from-git --dist-tag canary; then
  fail "NPM Publish was not successful"
  exit 1
echo ""

log "Cleaning up..."
  git checkout $CURRENT_GIT_BRANCH
  git branch -D release/v$(npm run version --silent)
echo ""

log "MDC Web $CANARY_RELEASE_VERSION is successfully published!"
echo ""
