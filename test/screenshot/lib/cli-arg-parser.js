/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const ArgumentParser = require('argparse').ArgumentParser;

class CliArgParser {
  constructor() {
    this.parser_ = new ArgumentParser({
      addHelp: true,
      description: 'Run screenshot tests and display diffs.',
    });

    this.parser_.addArgument(
      ['--mdc-include-url'],
      {
        action: 'append',
        help: `
Regular expression pattern. Only HTML files that match the pattern will be tested.
Multiple patterns can be 'OR'-ed together by passing more than one '--mdc-include-url'.
Can be overridden by '--mdc-exclude-url'.
`
          .trim(),
      }
    );

    this.parser_.addArgument(
      ['--mdc-exclude-url'],
      {
        action: 'append',
        help: `
Regular expression pattern. HTML files that match the pattern will be excluded from testing.
Multiple patterns can be 'OR'-ed together by passing more than one '--mdc-exclude-url'.
Takes precedence over '--mdc-include-url'.
`
          .trim(),
      }
    );

    this.parser_.addArgument(
      ['--mdc-include-browser'],
      {
        action: 'append',
        help: `
Regular expression pattern. Only browser aliases that match the pattern will be tested.
See 'test/screenshot/browser.json' for examples.
Multiple patterns can be 'OR'-ed together by passing more than one '--mdc-include-browser'.
Can be overridden by '--mdc-exclude-browser'.
`
          .trim(),
      }
    );

    this.parser_.addArgument(
      ['--mdc-exclude-browser'],
      {
        action: 'append',
        help: `
Regular expression pattern. Browser aliases that match the pattern will be excluded from testing.
See 'test/screenshot/browser.json' for examples.
Multiple patterns can be 'OR'-ed together by passing more than one '--mdc-exclude-browser'.
Takes precedence over '--mdc-include-browser'.
`
          .trim(),
      }
    );

    this.parser_.addArgument(
      ['--mdc-diff-base'],
      {
        defaultValue: 'origin/master',
        help: `
Git ref to diff against. Typically a branch name or commit hash.
E.g., 'origin/master' (default), 'HEAD', 'feat/foo/bar', 'fad7ed3'.
`
          .trim(),
      }
    );

    this.args_ = this.parser_.parseArgs();
  }

  /** @return {!Array<!RegExp>} */
  get includeUrlPatterns() {
    return (this.args_['mdc_include_url'] || []).map((pattern) => new RegExp(pattern));
  }

  /** @return {!Array<!RegExp>} */
  get excludeUrlPatterns() {
    return (this.args_['mdc_exclude_url'] || []).map((pattern) => new RegExp(pattern));
  }

  /** @return {!Array<!RegExp>} */
  get includeBrowserPatterns() {
    return (this.args_['mdc_include_browser'] || []).map((pattern) => new RegExp(pattern));
  }

  /** @return {!Array<!RegExp>} */
  get excludeBrowserPatterns() {
    return (this.args_['mdc_exclude_browser'] || []).map((pattern) => new RegExp(pattern));
  }

  /** @return {string} */
  get diffBase() {
    return this.args_['mdc_diff_base'];
  }
}

module.exports = CliArgParser;
