/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {ApprovalId} = mdcProto;

const argparse = require('argparse');
const checkIsOnline = require('is-online');

const CliColor = require('./logger').colors;
const Duration = require('./duration');
const {GOLDEN_JSON_RELATIVE_PATH} = require('./constants');

/** @type {?boolean} */
let isOnlineCached;

class Cli {
  constructor() {
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
    this.initIndexCommand_();
    this.initProtoCommand_();
    this.initServeCommand_();
    this.initTestCommand_();

    this.args_ = this.rootParser_.parseArgs();
  }

  /**
   * @param {string} url
   * @return {string}
   */
  colorizeUrl(url) {
    return url.replace(/^([^?]+)(\?.*)?$/, (substring, resourcePlain, queryPlain) => {
      const resourceColor = CliColor.reset(resourcePlain);
      if (queryPlain) {
        const queryColor = CliColor.dim(queryPlain);
        return `${resourceColor}${queryColor}`;
      }
      return resourceColor;
    });
  }

  /**
   * @return {!Promise<boolean>}
   */
  async checkIsOnline() {
    if (this.offline) {
      return false;
    }
    if (typeof isOnlineCached === 'undefined') {
      isOnlineCached = await checkIsOnline({timeout: Duration.seconds(5).toMillis()});
    }
    return isOnlineCached;
  }

  /**
   * @param {!ArgumentParser|!ActionContainer} parser
   * @param {!CliOptionConfig} config
   * @private
   */
  addArg_(parser, config) {
    const metaval = config.exampleValue || config.defaultValue;
    const metavar = metaval === 0 ? '0' : (metaval || (config.type || '').toUpperCase() || 'VALUE');
    parser.addArgument(config.optionNames, {
      help: config.description.trim(),
      dest: config.optionNames[config.optionNames.length - 1],
      type: config.type === 'integer' ? 'int' : undefined,
      action: config.type === 'array' ? 'append' : (config.type === 'boolean' ? 'storeTrue' : 'store'),
      required: config.isRequired || false,
      defaultValue: config.defaultValue,
      metavar,
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

  initIndexCommand_() {
    this.commandParsers_.addParser('index', {
      description: 'Generates static index.html directory listing files.',
    });
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
      optionNames: ['--parallels'],
      type: 'integer',
      description: `
Maximum number of browser VMs to run in parallel (subject to our CBT plan limit and VM availability).
If no value is specified, the default is to start 2 browsers if nobody else is running tests, or 1 browser if other
tests are already running.
IMPORTANT: To ensure that multiple developers can run their tests simultaneously, DO NOT set this value during normal
business hours.
`,
    });

    this.addArg_(subparser, {
      optionNames: ['--retries'],
      type: 'integer',
      description: `
Number of times to retry a screenshot that has diffs. Overrides values from 'test/screenshot/diffing.json'.
`,
    });

    this.addArg_(subparser, {
      optionNames: ['--diff-base'],
      defaultValue: GOLDEN_JSON_RELATIVE_PATH,
      description: `
File path, URL, or Git ref of a 'golden.json' file to diff against.
Typically a branch name or commit hash, but may also be a local file path or public URL.
Git refs may optionally be suffixed with ':path/to/golden.json' (the default is '${GOLDEN_JSON_RELATIVE_PATH}').
E.g., '${GOLDEN_JSON_RELATIVE_PATH}' (default), 'HEAD', 'master', 'origin/master', 'feat/foo/bar', '01abc11e0',
'/tmp/golden.json', 'https://storage.googleapis.com/.../golden.json'.
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

  /** @return {?number} */
  get parallels() {
    return this.args_['--parallels'];
  }

  /** @return {?number} */
  get retries() {
    return this.args_['--retries'];
  }

  /** @return {boolean} */
  get skipBuild() {
    return this.args_['--no-build'];
  }

  /** @return {boolean} */
  get skipFetch() {
    return this.args_['--no-fetch'];
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
   * @return {boolean}
   */
  isOnline() {
    return isOnlineCached === true;
  }

  /**
   * @return {boolean}
   */
  isOffline() {
    return !this.isOnline();
  }
}

module.exports = Cli;
