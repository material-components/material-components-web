#!/bin/sh

set -e

function log() {
  echo '\033[36m[canary-release]\033[0m' "$@"
}

function fail() {
  echo '\033[31mFAILURE:\033[0m' "$@"
}

log "Preparing for canary release..."

log "Installing dependencies..."
if ! npm i; then
  fail "npm install failed."
  exit 1
fi
echo ""

log "Running pre-release script..."
if ! ./scripts/pre-release.sh; then
  fail "Pre-release script failed"
  exit 1
fi

log "Bumping up MDC Web version to canary..."
if ! npx lerna version premajor --no-git-tag-version --no-push --preid canary.$(git rev-parse --short HEAD) --yes --exact; then
  fail "lerna version command failed"
  exit 1
fi
echo ""

PREVIOUS_GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CANARY_RELEASE_VERSION=$(npm run version --silent)
CANARY_RELEASE_BRANCH=release/v$CANARY_RELEASE_VERSION

log "Creating temporary release branch..."
  git checkout -B $CANARY_RELEASE_BRANCH
  git commit -am "chore: Publish"
echo ""

log "Publishing packages to NPM..."
if ! npx lerna publish from-package --dist-tag canary; then
  fail "NPM Publish was not successful"
  exit 1
fi
echo ""

log "Creating release..."
  git tag v$CANARY_RELEASE_VERSION
echo "Created git tag v$CANARY_RELEASE_VERSION."
echo ""

log "Cleaning up..."
  git checkout $PREVIOUS_GIT_BRANCH
  git branch -D $CANARY_RELEASE_BRANCH
echo ""

log "MDC Web v$CANARY_RELEASE_VERSION is successfully published!"
echo ""
echo "  Run git push origin v$CANARY_RELEASE_VERSION"
echo ""
