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

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {ApprovalId, DiffBase, GitRevision} = mdcProto;

const argparse = require('argparse');
const checkIsOnline = require('is-online');
const fs = require('mz/fs');
const {GOLDEN_JSON_RELATIVE_PATH} = require('./constants');

const Duration = require('./duration');
const GitRepo = require('./git-repo');

const HTTP_URL_REGEX = new RegExp('^https?://');

class Cli {
  constructor() {
    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

    /**
     * @type {?boolean}
     * @private
     */
    this.isOnlineCached_ = null;

    /**
     * @type {!ArgumentParser}
     * @private
     */
    this.rootParser_ = new argparse.ArgumentParser({
      // argparse throws an error if `process.argv[1]` is undefined, which happens when you run `node --interactive`.
      prog: process.argv[1] || 'node',
    });

    /**
     * @type {!ActionSubparsers}
     * @private
     */
    this.commandParsers_ = this.rootParser_.addSubparsers({
      title: 'Commands',
    });

    this.initApproveCommand_();
    this.initBuildCommand_();
    this.initCleanCommand_();
    this.initDemoCommand_();
    this.initProtoCommand_();
    this.initServeCommand_();
    this.initTestCommand_();

    this.args_ = this.rootParser_.parseArgs();
  }

  /**
   * @param {!ArgumentParser|!ActionContainer} parser
   * @param {!CliOptionConfig} config
   * @private
   */
  addArg_(parser, config) {
    parser.addArgument(config.optionNames, {
      help: config.description.trim(),
      dest: config.optionNames[config.optionNames.length - 1],
      type: config.type === 'integer' ? 'int' : undefined,
      action: config.type === 'array' ? 'append' : (config.type === 'boolean' ? 'storeTrue' : 'store'),
      required: config.isRequired || false,
      defaultValue: config.defaultValue,
      metavar: config.exampleValue || config.defaultValue,
    });
  }

  addNoBuildArg_(parser) {
    this.addArg_(parser, {
      optionNames: ['--no-build'],
      type: 'boolean',
      description: `
If this flag is present, JS and CSS files will not be compiled prior to running screenshot tests.
The default behavior is to always build assets before running the tests.
`,
    });
  }

  addNoFetchArg_(parser) {
    this.addArg_(parser, {
      optionNames: ['--no-fetch'],
      type: 'boolean',
      description: `
If this flag is present, remote commits will not be fetched from GitHub.
The default behavior is to always run 'git fetch' before comparing screenshots to ensure that CLI options like
'--diff-base=origin/master' work as expected.
`,
    });
  }

  addOfflineArg_(parser) {
    this.addArg_(parser, {
      optionNames: ['--offline'],
      type: 'boolean',
      description: `
If this flag is present, all external API requests will be disabled, including git fetch, GCS file upload, and CBT.
If a local dev server is not already running, one will be started for the duration of the test.
`,
    });
  }

  initApproveCommand_() {
    const subparser = this.commandParsers_.addParser('approve', {
      description: 'Approves screenshots from a previous `npm run screenshot:test` report. ' +
        'Updates your local `golden.json` file with the new screenshots.',
    });

    this.addArg_(subparser, {
      optionNames: ['--report'],
      exampleValue: 'URL',
      isRequired: true,
      description: 'Public URL of a `report.json` file generated by a previous `npm run screenshot:test` run.',
    });

    this.addArg_(subparser, {
      optionNames: ['--changed'],
      exampleValue: 'mdc-foo/baseline-button-with-icons.html:desktop_windows_chrome@latest,...',
      type: 'array',
      description: 'Comma-separated list of screenshot diffs to approve.',
    });

    this.addArg_(subparser, {
      optionNames: ['--added'],
      exampleValue: 'mdc-foo/baseline-button-with-icons.html:desktop_windows_chrome@latest,...',
      type: 'array',
      description: 'Comma-separated list of added screenshots to approve.',
    });

    this.addArg_(subparser, {
      optionNames: ['--removed'],
      exampleValue: 'mdc-foo/baseline-button-with-icons.html:desktop_windows_chrome@latest,...',
      type: 'array',
      description: 'Comma-separated list of removed screenshots to approve.',
    });

    this.addArg_(subparser, {
      optionNames: ['--all-changed'],
      type: 'boolean',
      description: 'Approve all screenshot diffs.',
    });

    this.addArg_(subparser, {
      optionNames: ['--all-added'],
      type: 'boolean',
      description: 'Approve all added screenshots.',
    });

    this.addArg_(subparser, {
      optionNames: ['--all-removed'],
      type: 'boolean',
      description: 'Approve all removed screenshots.',
    });

    this.addArg_(subparser, {
      optionNames: ['--all'],
      type: 'boolean',
      description: 'Approve all diffs, additions, and removals.',
    });
  }

  initBuildCommand_() {
    const subparser = this.commandParsers_.addParser('build', {
      description: 'Compiles source files and writes output files to disk.',
    });

    this.addArg_(subparser, {
      optionNames: ['--watch'],
      type: 'boolean',
      description: 'Recompile source files whenever they change.',
    });
  }

  initCleanCommand_() {
    this.commandParsers_.addParser('clean', {
      description: 'Deletes all output files generated by the build.',
    });
  }

  initDemoCommand_() {
    const subparser = this.commandParsers_.addParser('demo', {
      description: 'Uploads compiled screenshot test assets to a unique public URL.',
    });

    this.addNoBuildArg_(subparser);
  }

  initProtoCommand_() {
    this.commandParsers_.addParser('proto', {
      description: 'Compiles Protocol Buffer source files (*.proto) to JavaScript (*.pb.js).',
    });
  }

  initServeCommand_() {
    const subparser = this.commandParsers_.addParser('serve', {
      description: 'Starts an HTTP server for local development.',
    });

    this.addArg_(subparser, {
      optionNames: ['--port'],
      type: 'integer',
      defaultValue: '8080',
      description: 'TCP port number for the HTTP server.',
    });
  }

  initTestCommand_() {
    const subparser = this.commandParsers_.addParser('test', {
      description: 'Captures screenshots of test pages and diffs them against "golden" images.',
    });

    this.addNoBuildArg_(subparser);
    this.addNoFetchArg_(subparser);
    this.addOfflineArg_(subparser);

    this.addArg_(subparser, {
      optionNames: ['--diff-base'],
      defaultValue: GOLDEN_JSON_RELATIVE_PATH,
      description: `
File path, URL, or Git ref of a 'golden.json' file to diff against.
Typically a branch name or commit hash, but may also be a local file path or public URL.
Git refs may optionally be suffixed with ':path/to/golden.json' (the default is '${GOLDEN_JSON_RELATIVE_PATH}').
E.g., '${GOLDEN_JSON_RELATIVE_PATH}' (default), 'HEAD', 'master', 'origin/master', 'feat/foo/bar', '01abc11e0',
'/tmp/golden.json', 'https://storage.googleapis.com/.../test/screenshot/golden.json'.
`,
    });

    this.addArg_(subparser, {
      optionNames: ['--url'],
      exampleValue: 'REGEX[,-REGEX,...]',
      type: 'array',
      description: `
Comma-separated list of regular expression patterns.
Only HTML files that match at least one pattern will be tested.
To negate a pattern, prefix it with a '-' character.
E.g.: '--url=button,-mixins' will test all 'mdc-button' pages _except_ mixins.
Passing this option more than once is equivalent to passing a single comma-separated value.
E.g.: '--url=button,-mixins' is the same as '--url=button --url=-mixins'.
`,
    });

    this.addArg_(subparser, {
      optionNames: ['--browser'],
      exampleValue: 'REGEX[,-REGEX,...]',
      type: 'array',
      description: `
Comma-separated list of regular expression patterns.
Only browser aliases that match at least one pattern will be tested. (See 'test/screenshot/browser.json'.)
To negate a pattern, prefix it with a '-' character.
E.g.: '--browser=chrome,-mobile' will test Chrome on desktop, but not on mobile.
Passing this option more than once is equivalent to passing a single comma-separated value.
E.g.: '--browser=chrome,-mobile' is the same as '--browser=chrome --browser=-mobile'.
`,
    });

    this.addArg_(subparser, {
      optionNames: ['--max-parallels'],
      type: 'boolean',
      description: `
If this option is present, CBT tests will run the maximum number of parallel browser VMs allowed by our plan.
The default behavior is to start 3 browsers if nobody else is running tests, or 1 browser if other tests are running.
IMPORTANT: To ensure that other developers can run their tests too, only use this option during off-peak hours when you
know nobody else is going to be running tests.
This option is capped by A) our CBT account allowance, and B) the number of available VMs.
`,
    });

    this.addArg_(subparser, {
      optionNames: ['--retries'],
      type: 'integer',
      defaultValue: 3,
      description: `
Number of times to retry a screenshot that comes back with diffs. If you're not expecting any diffs, automatically
retrying screenshots can help decrease noise from flaky browser rendering. However, if you're making a change that
intentionally affects the rendered output, there's no point slowing down the test by retrying a bunch of screenshots
that you know are going to have diffs.
`,
    });
  }

  /** @return {string} */
  get command() {
    return process.argv[2];
  }

  /** @return {!Array<!RegExp>} */
  get includeUrlPatterns() {
    return this.parseRegexList_(this.args_['--url'], 'include');
  }

  /** @return {!Array<!RegExp>} */
  get excludeUrlPatterns() {
    return this.parseRegexList_(this.args_['--url'], 'exclude');
  }

  /** @return {!Array<!RegExp>} */
  get includeBrowserPatterns() {
    return this.parseRegexList_(this.args_['--browser'], 'include');
  }

  /** @return {!Array<!RegExp>} */
  get excludeBrowserPatterns() {
    return this.parseRegexList_(this.args_['--browser'], 'exclude');
  }

  /** @return {string} */
  get diffBase() {
    return this.args_['--diff-base'];
  }

  /** @return {boolean} */
  get maxParallels() {
    return this.args_['--max-parallels'];
  }

  /** @return {number} */
  get retries() {
    return this.args_['--retries'];
  }

  /** @return {boolean} */
  get skipBuild() {
    return this.args_['--no-build'];
  }

  /** @return {boolean} */
  get shouldFetch() {
    return !this.args_['--no-fetch'];
  }

  /** @return {?string} */
  get runReportJsonUrl() {
    // Users often copy/paste the report page URL, but we actually need the JSON file URL instead, so let's FTFY :-)
    return (this.args_['--report'] || '').replace(/\.html$/, '.json') || null;
  }

  /** @return {!Array<mdc.proto.ApprovalId>} */
  get changed() {
    return this.parseApprovalIds_(this.args_['--changed']);
  }

  /** @return {!Array<mdc.proto.ApprovalId>} */
  get added() {
    return this.parseApprovalIds_(this.args_['--added']);
  }

  /** @return {!Array<mdc.proto.ApprovalId>} */
  get removed() {
    return this.parseApprovalIds_(this.args_['--removed']);
  }

  /** @return {boolean} */
  get allChanged() {
    return this.args_['--all-changed'];
  }

  /** @return {boolean} */
  get allAdded() {
    return this.args_['--all-added'];
  }

  /** @return {boolean} */
  get allRemoved() {
    return this.args_['--all-removed'];
  }

  /** @return {boolean} */
  get all() {
    return this.args_['--all'];
  }

  /** @return {boolean} */
  get watch() {
    return this.args_['--watch'];
  }

  /** @return {number} */
  get port() {
    return this.args_['--port'];
  }

  /** @return {boolean} */
  get offline() {
    return this.args_['--offline'];
  }

  /**
   * @param {!Array<string>} list
   * @return {!Array<string>}
   * @private
   */
  parseStringList_(list) {
    const unprocessed = list || [];
    return [].concat(...unprocessed.map((url) => url.split(',')));
  }

  /**
   * @param {!Array<string>} list
   * @param {string} inclusiveness
   * @return {!Array<string>}
   * @private
   */
  parseRegexList_(list, inclusiveness) {
    const unprocessed = list || [];
    return this.parseStringList_(unprocessed)
      .filter((pattern) => {
        if (inclusiveness === 'exclude') {
          return pattern.startsWith('-');
        }
        return !pattern.startsWith('-');
      })
      .map((pattern) => {
        return new RegExp(pattern.replace(/^-/, ''));
      })
    ;
  }

  /**
   * @param {?Array<string>} ids
   * @return {!Array<!mdc.proto.ApprovalId>}
   * @private
   */
  parseApprovalIds_(ids) {
    ids = ids || []; // avoid NPE (the underlying CLI parser returns `null` instead of an empty array)
    ids = [].concat(...ids.map((value) => value.split(','))); // flatten array of arrays
    ids = Array.from(new Set(ids)); // de-duplicate
    return ids.map((id) => {
      const [htmlFilePath, userAgentAlias] = id.split(':'); // TODO(acdvorak): Document the ':' separator format
      return ApprovalId.create({
        html_file_path: htmlFilePath,
        user_agent_alias: userAgentAlias,
      });
    });
  }

  /**
   * @return {!Promise<boolean>}
   */
  async isOnline() {
    if (this.offline) {
      return false;
    }

    if (typeof this.isOnlineCached_ !== 'boolean') {
      this.isOnlineCached_ = await checkIsOnline({timeout: Duration.seconds(5).toMillis()});
    }

    return this.isOnlineCached_;
  }

  /**
   * TODO(acdvorak): Move this method out of Cli class - it doesn't belong here.
   * @return {!Promise<!mdc.proto.DiffBase>}
   */
  async parseGoldenDiffBase() {
    /** @type {?mdc.proto.GitRevision} */
    const travisGitRevision = await this.getTravisGitRevisition_();
    if (travisGitRevision) {
      return DiffBase.create({
        type: DiffBase.Type.GIT_REVISION,
        git_revision: travisGitRevision,
      });
    }
    return this.parseDiffBase();
  }

  /**
   * @return {?Promise<!mdc.proto.GitRevision>}
   * @private
   */
  async getTravisGitRevisition_() {
    const travisBranch = process.env.TRAVIS_BRANCH;
    const travisTag = process.env.TRAVIS_TAG;
    const travisPrNumber = Number(process.env.TRAVIS_PULL_REQUEST);
    const travisPrBranch = process.env.TRAVIS_PULL_REQUEST_BRANCH;
    const travisPrSha = process.env.TRAVIS_PULL_REQUEST_SHA;

    if (travisPrNumber) {
      return GitRevision.create({
        type: GitRevision.Type.PR,
        golden_json_file_path: GOLDEN_JSON_RELATIVE_PATH,
        commit: travisPrSha,
        branch: await this.gitRepo_.getShortCommitHash(travisPrBranch),
        pr: travisPrNumber,
      });
    }

    if (travisTag) {
      return GitRevision.create({
        type: GitRevision.Type.REMOTE_TAG,
        golden_json_file_path: GOLDEN_JSON_RELATIVE_PATH,
        commit: await this.gitRepo_.getShortCommitHash(travisTag),
        tag: travisTag,
      });
    }

    if (travisBranch) {
      return GitRevision.create({
        type: GitRevision.Type.LOCAL_BRANCH,
        golden_json_file_path: GOLDEN_JSON_RELATIVE_PATH,
        commit: await this.gitRepo_.getShortCommitHash(travisBranch),
        branch: travisBranch,
      });
    }

    return null;
  }

  /**
   * TODO(acdvorak): Move this method out of Cli class - it doesn't belong here.
   * @param {string} rawDiffBase
   * @return {!Promise<!mdc.proto.DiffBase>}
   */
  async parseDiffBase(rawDiffBase = this.diffBase) {
    // Diff against a public `golden.json` URL.
    // E.g.: `--diff-base=https://storage.googleapis.com/.../golden.json`
    const isUrl = HTTP_URL_REGEX.test(rawDiffBase);
    if (isUrl) {
      return this.createPublicUrlDiffBase_(rawDiffBase);
    }

    // Diff against a local `golden.json` file.
    // E.g.: `--diff-base=/tmp/golden.json`
    const isLocalFile = await fs.exists(rawDiffBase);
    if (isLocalFile) {
      return this.createLocalFileDiffBase_(rawDiffBase);
    }

    const [inputGoldenRef, inputGoldenPath] = rawDiffBase.split(':');
    const goldenFilePath = inputGoldenPath || GOLDEN_JSON_RELATIVE_PATH;
    const fullGoldenRef = await this.gitRepo_.getFullSymbolicName(inputGoldenRef);

    // Diff against a specific git commit.
    // E.g.: `--diff-base=abcd1234`
    if (!fullGoldenRef) {
      return this.createCommitDiffBase_(inputGoldenRef, goldenFilePath);
    }

    const {remoteRef, localRef, tagRef} = this.getRefType_(fullGoldenRef);

    // Diff against a remote git branch.
    // E.g.: `--diff-base=origin/master` or `--diff-base=origin/feat/button/my-fancy-feature`
    if (remoteRef) {
      return this.createRemoteBranchDiffBase_(remoteRef, goldenFilePath);
    }

    // Diff against a remote git tag.
    // E.g.: `--diff-base=v0.34.1`
    if (tagRef) {
      return this.createRemoteTagDiffBase_(tagRef, goldenFilePath);
    }

    // Diff against a local git branch.
    // E.g.: `--diff-base=master` or `--diff-base=HEAD`
    return this.createLocalBranchDiffBase_(localRef, goldenFilePath);
  }

  /**
   * @param {string} publicUrl
   * @return {!mdc.proto.DiffBase}
   * @private
   */
  createPublicUrlDiffBase_(publicUrl) {
    return DiffBase.create({
      input_string: publicUrl,
      type: DiffBase.Type.PUBLIC_URL,
      public_url: publicUrl,
    });
  }

  /**
   * @param {string} localFilePath
   * @return {!mdc.proto.DiffBase}
   * @private
   */
  createLocalFileDiffBase_(localFilePath) {
    return DiffBase.create({
      input_string: localFilePath,
      type: DiffBase.Type.FILE_PATH,
      local_file_path: localFilePath,
      is_default_local_file: localFilePath === GOLDEN_JSON_RELATIVE_PATH,
    });
  }

  /**
   * @param {string} commit
   * @param {string} goldenJsonFilePath
   * @return {!mdc.proto.DiffBase}
   * @private
   */
  createCommitDiffBase_(commit, goldenJsonFilePath) {
    return DiffBase.create({
      type: DiffBase.Type.GIT_REVISION,
      git_revision: GitRevision.create({
        input_string: `${commit}:${goldenJsonFilePath}`, // TODO(acdvorak): Document the ':' separator format
        golden_json_file_path: goldenJsonFilePath,
        commit: commit,
      }),
    });
  }

  /**
   * @param {string} remoteRef
   * @param {string} goldenJsonFilePath
   * @return {!mdc.proto.DiffBase}
   * @private
   */
  async createRemoteBranchDiffBase_(remoteRef, goldenJsonFilePath) {
    const allRemoteNames = await this.gitRepo_.getRemoteNames();
    const remote = allRemoteNames.find((curRemoteName) => remoteRef.startsWith(curRemoteName + '/'));
    const branch = remoteRef.substr(remote.length + 1); // add 1 for forward-slash separator
    const commit = await this.gitRepo_.getShortCommitHash(remoteRef);

    return DiffBase.create({
      type: DiffBase.Type.GIT_REVISION,
      git_revision: GitRevision.create({
        input_string: `${remoteRef}:${goldenJsonFilePath}`, // TODO(acdvorak): Document the ':' separator format
        golden_json_file_path: goldenJsonFilePath,
        commit,
        remote,
        branch,
      }),
    });
  }

  /**
   * @param {string} tagRef
   * @param {string} goldenJsonFilePath
   * @return {!mdc.proto.DiffBase}
   * @private
   */
  async createRemoteTagDiffBase_(tagRef, goldenJsonFilePath) {
    const commit = await this.gitRepo_.getShortCommitHash(tagRef);

    return DiffBase.create({
      type: DiffBase.Type.GIT_REVISION,
      git_revision: GitRevision.create({
        input_string: `${tagRef}:${goldenJsonFilePath}`, // TODO(acdvorak): Document the ':' separator format
        golden_json_file_path: goldenJsonFilePath,
        commit,
        remote: 'origin',
        tag: tagRef,
      }),
    });
  }

  /**
   * @param {string} branch
   * @param {string} goldenJsonFilePath
   * @return {!mdc.proto.DiffBase}
   * @private
   */
  async createLocalBranchDiffBase_(branch, goldenJsonFilePath) {
    const commit = await this.gitRepo_.getShortCommitHash(branch);
    return DiffBase.create({
      type: DiffBase.Type.GIT_REVISION,
      git_revision: GitRevision.create({
        input_string: `${branch}:${goldenJsonFilePath}`, // TODO(acdvorak): Document the ':' separator format
        golden_json_file_path: goldenJsonFilePath,
        commit,
        branch,
      }),
    });
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

module.exports = Cli;
