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
const GitRepo = require('./git-repo');
const fs = require('mz/fs');
const path = require('path');
const ps = require('ps-node');

const HTTP_URL_REGEX = new RegExp('^https?://');

class CliArgParser {
  constructor() {
    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

    /**
     * @type {!ArgumentParser}
     * @private
     */
    this.parser_ = new ArgumentParser({
      addHelp: true,
      description: 'Run screenshot tests and display diffs.',

      // argparse throws an error if `process.argv[1]` is undefined, which happens when you run `node --interactive`.
      prog: process.argv[1] || '--interactive',
    });

    const subparsers = this.parser_.addSubparsers({
      title: 'Commands',
    });

    this.initCommonFlags_();
    this.initTestCommand_(subparsers);
    this.initApproveCommand_(subparsers);

    this.args_ = this.parser_.parseArgs();
  }

  initCommonFlags_() {
    this.parser_.addArgument(
      ['--mdc-test-dir'],
      {
        defaultValue: 'test/screenshot/',
        help: `
Relative path to a local directory containing static test assets (HTML/CSS/JS files) to be captured and diffed.
Relative to $PWD.
`
          .trim(),
      }
    );

    this.parser_.addArgument(
      ['--mdc-gcs-bucket'],
      {
        defaultValue: 'mdc-web-screenshot-tests',
        help: `
Name of the Google Cloud Storage bucket to use for public file uploads.
`
          .trim(),
      }
    );

    this.parser_.addArgument(
      ['--mdc-golden-path'],
      {
        defaultValue: 'test/screenshot/golden.json',
        help: `
Relative path to a local 'golden.json' file that will be written to when the golden screenshots are updated.
Relative to $PWD.
`
          .trim(),
      }
    );
  }

  initTestCommand_(subparsers) {
    const subparser = subparsers.addParser('test');

    subparser.addArgument(
      ['--mdc-include-url'],
      {
        action: 'append', // Argument may be passed multiple times. Transformed into an array of strings.
        help: `
Regular expression pattern. Only HTML files that match the pattern will be tested.
Multiple patterns can be 'OR'-ed together by passing more than one '--mdc-include-url'.
Can be overridden by '--mdc-exclude-url'.
`
          .trim(),
      }
    );

    subparser.addArgument(
      ['--mdc-exclude-url'],
      {
        action: 'append', // Argument may be passed multiple times. Transformed into an array of strings.
        help: `
Regular expression pattern. HTML files that match the pattern will be excluded from testing.
Multiple patterns can be 'OR'-ed together by passing more than one '--mdc-exclude-url'.
Takes precedence over '--mdc-include-url'.
`
          .trim(),
      }
    );

    subparser.addArgument(
      ['--mdc-include-browser'],
      {
        action: 'append', // Argument may be passed multiple times. Transformed into an array of strings.
        help: `
Regular expression pattern. Only browser aliases that match the pattern will be tested.
See 'test/screenshot/browser.json' for examples.
Multiple patterns can be 'OR'-ed together by passing more than one '--mdc-include-browser'.
Can be overridden by '--mdc-exclude-browser'.
`
          .trim(),
      }
    );

    subparser.addArgument(
      ['--mdc-exclude-browser'],
      {
        action: 'append', // Argument may be passed multiple times. Transformed into an array of strings.
        help: `
Regular expression pattern. Browser aliases that match the pattern will be excluded from testing.
See 'test/screenshot/browser.json' for examples.
Multiple patterns can be 'OR'-ed together by passing more than one '--mdc-exclude-browser'.
Takes precedence over '--mdc-include-browser'.
`
          .trim(),
      }
    );

    subparser.addArgument(
      ['--mdc-diff-base'],
      {
        defaultValue: 'origin/master',
        help: `
File path, URL, or Git ref of a 'golden.json' file to diff against.
Typically a branch name or commit hash, but may also be a local file path or public URL.
Git refs may optionally be suffixed with ':path/to/golden.json' (the default is to use '--mdc-golden-path').
E.g., 'origin/master' (default), 'HEAD', 'feat/foo/bar', 'fad7ed3:path/to/golden.json',
'/tmp/golden.json', 'https://storage.googleapis.com/.../test/screenshot/golden.json'.
`
          .trim(),
      }
    );

    subparser.addArgument(
      ['--mdc-skip-build'],
      {
        action: 'storeTrue', // Boolean value. `true` if argument is present, or `false` if omitted.
        help: `
If this flag is present, JS and CSS files will not be compiled prior to running screenshot tests.
The default behavior is to always build assets before running the tests.
`
          .trim(),
      }
    );
  }

  initApproveCommand_(subparsers) {
    const subparser = subparsers.addParser('approve');

    subparser.addArgument(
      ['--report'],
      {
        required: true,
        help: 'Public URL of a `report.json` file generated by a previous `npm run screenshot:test` run.',
      }
    );

    subparser.addArgument(
      ['--diffs'],
      {
        action: 'append', // Argument may be passed multiple times. Transformed into an array of strings.
        help: 'Comma-separated list of screenshot diffs to approve',
      }
    );

    subparser.addArgument(
      ['--added'],
      {
        action: 'append', // Argument may be passed multiple times. Transformed into an array of strings.
        help: 'Comma-separated list of added screenshots to approve',
      }
    );

    subparser.addArgument(
      ['--removed'],
      {
        action: 'append', // Argument may be passed multiple times. Transformed into an array of strings.
        help: 'Comma-separated list of removed screenshots to approve',
      }
    );

    subparser.addArgument(
      ['--all-diffs'],
      {
        action: 'storeTrue', // Boolean value. `true` if argument is present, or `false` if omitted.
        help: 'Approve all screenshot diffs',
      }
    );

    subparser.addArgument(
      ['--all-added'],
      {
        action: 'storeTrue', // Boolean value. `true` if argument is present, or `false` if omitted.
        help: 'Approve all added screenshots',
      }
    );

    subparser.addArgument(
      ['--all-removed'],
      {
        action: 'storeTrue', // Boolean value. `true` if argument is present, or `false` if omitted.
        help: 'Approve all removed screenshots',
      }
    );

    subparser.addArgument(
      ['--all'],
      {
        action: 'storeTrue', // Boolean value. `true` if argument is present, or `false` if omitted.
        help: 'Approve all diffs, additions, and removals',
      }
    );
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
  get testDir() {
    // Ensure that the path has a trailing slash
    return path.format(path.parse(this.args_['mdc_test_dir'])) + path.sep;
  }

  /** @return {string} */
  get goldenPath() {
    return this.args_['mdc_golden_path'];
  }

  /** @return {string} */
  get diffBase() {
    return this.args_['mdc_diff_base'];
  }

  /** @return {boolean} */
  get skipBuild() {
    return this.args_['mdc_skip_build'];
  }

  /** @return {string} */
  get gcsBucket() {
    return this.args_['mdc_gcs_bucket'];
  }

  /** @return {string} */
  get gcsBaseUrl() {
    return `https://storage.googleapis.com/${this.gcsBucket}/`;
  }

  /** @return {string} */
  get runReportJsonUrl() {
    return this.args_['report'];
  }

  /** @return {!Set<string>} */
  get diffs() {
    return this.parseApprovedChangeTargets_(this.args_['diffs']);
  }

  /** @return {!Set<string>} */
  get added() {
    return this.parseApprovedChangeTargets_(this.args_['added']);
  }

  /** @return {!Set<string>} */
  get removed() {
    return this.parseApprovedChangeTargets_(this.args_['removed']);
  }

  /** @return {boolean} */
  get allDiffs() {
    return this.args_['all_diffs'];
  }

  /** @return {boolean} */
  get allAdded() {
    return this.args_['all_added'];
  }

  /** @return {boolean} */
  get allRemoved() {
    return this.args_['all_removed'];
  }

  /** @return {boolean} */
  get all() {
    return this.args_['all'];
  }

  /**
   * @param {!Array<string>} list
   * @return {!Set<string>}
   * @private
   */
  parseApprovedChangeTargets_(list) {
    list = list || [];
    return new Set([].concat(...list.map((value) => value.split(','))));
  }

  /**
   * @param {string} rawDiffBase
   * @param {string} defaultGoldenPath
   * @return {!Promise<!DiffSource>}
   */
  async parseDiffBase({
    rawDiffBase = this.diffBase,
    defaultGoldenPath = this.goldenPath,
  } = {}) {
    // Diff against a public `golden.json` URL.
    // E.g.: `--mdc-diff-base=https://storage.googleapis.com/.../golden.json`
    const isUrl = HTTP_URL_REGEX.test(rawDiffBase);
    if (isUrl) {
      return this.createPublicUrlDiffSource_(rawDiffBase);
    }

    // Diff against a local `golden.json` file.
    // E.g.: `--mdc-diff-base=/tmp/golden.json`
    const isLocalFile = await fs.exists(rawDiffBase);
    if (isLocalFile) {
      return this.createLocalFileDiffSource_(rawDiffBase);
    }

    const [inputGoldenRef, inputGoldenPath] = rawDiffBase.split(':');
    const goldenFilePath = inputGoldenPath || defaultGoldenPath;
    const fullGoldenRef = await this.gitRepo_.getFullSymbolicName(inputGoldenRef);

    // Diff against a specific git commit.
    // E.g.: `--mdc-diff-base=abcd1234`
    if (!fullGoldenRef) {
      return this.createCommitDiffSource_(inputGoldenRef, goldenFilePath);
    }

    const {remoteRef, localRef, tagRef} = this.getRefType_(fullGoldenRef);

    // Diff against a remote git branch.
    // E.g.: `--mdc-diff-base=origin/master` or `--mdc-diff-base=origin/feat/button/my-fancy-feature`
    if (remoteRef) {
      return this.createRemoteBranchDiffSource_(remoteRef, goldenFilePath);
    }

    // Diff against a remote git tag.
    // E.g.: `--mdc-diff-base=v0.34.1`
    if (tagRef) {
      return this.createRemoteTagDiffSource_(tagRef, goldenFilePath);
    }

    // Diff against a local git branch.
    // E.g.: `--mdc-diff-base=master` or `--mdc-diff-base=HEAD`
    return this.createLocalBranchDiffSource_(localRef, goldenFilePath);
  }

  async shouldBuild() {
    if (await this.isAlreadyBuilding_()) {
      return false;
    }
    return !this.skipBuild;
  }

  async isAlreadyBuilding_() {
    return new Promise((resolve, reject) => {
      ps.lookup(
        {
          command: 'node',
          arguments: 'screenshot:build|screenshot:watch', // Regular expression
        },
        (err, resultList) => {
          if (err) {
            reject(err);
            return;
          }
          const buildProcsInPwd = resultList.filter((proc) => proc['arguments'][0].startsWith(process.env.PWD));
          resolve(buildProcsInPwd.length > 0);
        });
    });
  }

  /**
   * @param {string} publicUrl
   * @return {!DiffSource}
   * @private
   */
  createPublicUrlDiffSource_(publicUrl) {
    return {
      publicUrl,
      localFilePath: null,
      gitRevision: null,
    };
  }

  /**
   * @param {string} localFilePath
   * @return {!DiffSource}
   * @private
   */
  createLocalFileDiffSource_(localFilePath) {
    return {
      publicUrl: null,
      localFilePath,
      gitRevision: null,
    };
  }

  /**
   * @param {string} commit
   * @param {string} snapshotFilePath
   * @return {!DiffSource}
   * @private
   */
  createCommitDiffSource_(commit, snapshotFilePath) {
    return {
      publicUrl: null,
      localFilePath: null,
      gitRevision: {
        commit,
        snapshotFilePath,
        remote: null,
        branch: null,
        tag: null,
      },
    };
  }

  /**
   * @param {string} remoteRef
   * @param {string} snapshotFilePath
   * @return {!DiffSource}
   * @private
   */
  async createRemoteBranchDiffSource_(remoteRef, snapshotFilePath) {
    const allRemoteNames = await this.gitRepo_.getRemoteNames();
    const remote = allRemoteNames.find((curRemoteName) => remoteRef.startsWith(curRemoteName + '/'));
    const branch = remoteRef.substr(remote.length + 1); // add 1 for forward-slash separator
    const commit = await this.gitRepo_.getShortCommitHash(remoteRef);

    return {
      publicUrl: null,
      localFilePath: null,
      gitRevision: {
        snapshotFilePath,
        commit,
        remote,
        branch,
        tag: null,
      },
    };
  }

  /**
   * @param {string} tagRef
   * @param {string} snapshotFilePath
   * @return {!DiffSource}
   * @private
   */
  async createRemoteTagDiffSource_(tagRef, snapshotFilePath) {
    const commit = await this.gitRepo_.getShortCommitHash(tagRef);
    return {
      publicUrl: null,
      localFilePath: null,
      gitRevision: {
        snapshotFilePath,
        commit,
        remote: 'origin',
        branch: null,
        tag: tagRef,
      },
    };
  }

  /**
   * @param {string} branch
   * @param {string} snapshotFilePath
   * @return {!DiffSource}
   * @private
   */
  async createLocalBranchDiffSource_(branch, snapshotFilePath) {
    const commit = await this.gitRepo_.getShortCommitHash(branch);
    return {
      publicUrl: null,
      localFilePath: null,
      gitRevision: {
        snapshotFilePath,
        commit,
        remote: null,
        branch,
        tag: null,
      },
    };
  }

  /**
   * @param {string} fullRef
   * @return {{remoteRef: string, localRef: string, tagRef: string}}
   * @private
   */
  getRefType_(fullRef) {
    const getShortGoldenRef = (type) => {
      const regex = new RegExp(`^refs/${type}s/(.+)$`);
      const match = regex.exec(fullRef) || [];
      return match[1];
    };

    const remoteRef = getShortGoldenRef('remote');
    const localRef = getShortGoldenRef('head');
    const tagRef = getShortGoldenRef('tag');

    return {remoteRef, localRef, tagRef};
  }
}

module.exports = CliArgParser;
