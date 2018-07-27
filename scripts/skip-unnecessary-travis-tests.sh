#!/usr/bin/env bash

CHANGED_FILE_PATHS=$(git diff --name-only "$TRAVIS_COMMIT_RANGE")

if [[ -n "$CHANGED_FILE_PATHS" ]]; then
  CHANGED_FILE_COUNT=$(echo "$CHANGED_FILE_PATHS" | wc -l | tr -d ' ')
else
  CHANGED_FILE_COUNT=0
fi

function log_success() {
  if [[ $# -gt 0 ]]; then
    echo -e "\033[32m\033[1m$@\033[0m"
  else
    echo
  fi
}

function print_travis_env_vars() {
  echo
  env | grep TRAVIS
  echo
}

function print_all_changed_files() {
  echo
  echo "$CHANGED_FILE_COUNT files changed between commits $TRAVIS_COMMIT_RANGE:"
  echo
  echo "$CHANGED_FILE_PATHS"
  echo
}

function check_for_testable_files() {
  # Always run tests if any build-related files changed.
  # E.g., top-level files like `.travis.yml`; files in `scripts/`; and `package.json` files.
  local CRITICAL_FILE_PATHS=$(echo "$CHANGED_FILE_PATHS" | grep -E -e '^[^/]+$' -e '^scripts/' -e 'package.json$' | grep -v -E '^[^/]+\.md$')
  local CRITICAL_FILE_COUNT=$(echo "$CRITICAL_FILE_PATHS" | wc -l | tr -d ' ')

#  if [[ -n "$CRITICAL_FILE_PATHS" ]] && [[ "$CRITICAL_FILE_COUNT" -gt 0 ]]; then
#    return 0
#  fi

  for CUR_PATH_PATTERN in "$@"; do
    local MATCHING_FILE_PATHS=$(echo "$CHANGED_FILE_PATHS" | grep -E "$CUR_PATH_PATTERN")
    local MATCHING_FILE_COUNT=$(echo "$MATCHING_FILE_PATHS" | wc -l | tr -d ' ')

    if [[ -n "$MATCHING_FILE_PATHS" ]] && [[ "$MATCHING_FILE_COUNT" -gt 0 ]]; then
      return 0
    fi
  done

  return 1
}

function exit_if_files_not_changed() {
  check_for_testable_files "$@"

  if [[ $? != 0 ]]; then
    log_success "No testable source files were found between commits $TRAVIS_COMMIT_RANGE."
    log_success
    log_success "Skipping $TEST_SUITE tests."
    exit
  fi
}

print_travis_env_vars
print_all_changed_files

if [[ "$TEST_SUITE" == 'unit' ]]; then
  # Only run unit tests if JS files changed
  exit_if_files_not_changed '^packages/.+\.js$' '^test/unit/.+\.js$'
fi

if [[ "$TEST_SUITE" == 'lint' ]]; then
  # Only run linter if package JS/Sass files changed
  exit_if_files_not_changed '\.(js|css|scss)$'
fi

if [[ "$TEST_SUITE" == 'closure' ]]; then
  # Only run closure test if package JS files changed
  exit_if_files_not_changed '^packages/.+\.js$'
fi

if [[ "$TEST_SUITE" == 'site-generator' ]]; then
  # Only run site-generator test if docs, Markdown, or image files changed
  exit_if_files_not_changed '^docs/' '\.md$' '\.(png|jpg|jpeg|gif|svg)$'
fi

if [[ "$TEST_SUITE" == 'screenshot' ]]; then
  # Only run screenshot tests if package JS/Sass files, non-Markdown screenshot test files, or image files changed.
  check_for_testable_files '^packages/.+\.(js|css|sass)$' '^test/screenshot/.+[^m][^d]$' '\.(png|jpg|jpeg|gif|svg)$'

  if [[ $? != 0 ]]; then
    # Don't exit here. Set a flag to tell the screenshot JS to exit after building source files.
    export BUILD_AND_EXIT=true
  fi
fi
