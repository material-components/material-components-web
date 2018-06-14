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

const GitRepo = require('./git-repo');
const CliArgParser = require('./cli-arg-parser');
const childProcess = require('mz/child_process');

const GITHUB_REPO_URL = 'https://github.com/material-components/material-components-web';

class ReportGenerator {
  /**
   * @param {!RunReport} runReport
   */
  constructor(runReport) {
    /**
     * @type {!RunReport}
     * @private
     */
    this.runReport_ = runReport;

    /**
     * @type {{
     *   diffs: !Map<string, !Array<!ImageDiffJson>>,
     *   added: !Map<string, !Array<!ImageDiffJson>>,
     *   removed: !Map<string, !Array<!ImageDiffJson>>,
     *   unchanged: !Map<string, !Array<!ImageDiffJson>>,
     * }}
     * @private
     */
    this.reportMaps_ = {
      diffs: new Map(),
      added: new Map(),
      removed: new Map(),
      unchanged: new Map(),
    };

    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

    /**
     * @type {!CliArgParser}
     * @private
     */
    this.cliArgs_ = new CliArgParser();

    this.groupAllChangelistsByFile_();
  }

  /**
   * @private
   */
  groupAllChangelistsByFile_() {
    // TODO(acdvorak): Move most of the logic out of this file so that we can serialize all the data displayed on
    // the page to `report.json`.
    this.groupOneChangelistByFile_(this.runReport_.runResult.diffs, this.reportMaps_.diffs);
    this.groupOneChangelistByFile_(this.runReport_.runResult.added, this.reportMaps_.added);
    this.groupOneChangelistByFile_(this.runReport_.runResult.removed, this.reportMaps_.removed);
    this.groupOneChangelistByFile_(this.runReport_.runResult.unchanged, this.reportMaps_.unchanged);
  }

  /**
   * @param {!Array<!ImageDiffJson>} changelist
   * @param {!Map<string, !Array<!ImageDiffJson>>} map
   * @private
   */
  groupOneChangelistByFile_(changelist, map) {
    changelist.forEach((diff) => {
      if (!map.has(diff.htmlFilePath)) {
        map.set(diff.htmlFilePath, []);
      }
      map.get(diff.htmlFilePath).push(diff);
    });
  }

  /**
   * @return {!Promise<string>}
   */
  async generateHtml() {
    const numDiffs = this.runReport_.runResult.diffs.length;
    const numAdded = this.runReport_.runResult.added.length;
    const numRemoved = this.runReport_.runResult.removed.length;
    const numUnchanged = this.runReport_.runResult.unchanged.length;

    const title = [
      `${numDiffs} Diff${numDiffs !== 1 ? 's' : ''}`,
      `${numAdded} Added`,
      `${numRemoved} Removed`,
      `${numUnchanged} Unchanged`,
    ].join(', ');

    /* eslint-disable indent */
    return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title} - Screenshot Test Report - MDC Web</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="./out/report.css">
    <script src="./report.js"></script>
  </head>
  <body class="report-body">
    <h1>
      Screenshot Test Report for
      <a href="https://github.com/material-components/material-components-web" target="_blank">MDC Web</a>
    </h1>
    ${this.getCollapseButtonMarkup_()}
    ${await this.getMetadataMarkup_()}
    ${await this.getChangelistMarkup_({
      changelist: this.runReport_.runResult.diffs,
      map: this.reportMaps_.diffs,
      isOpen: true,
      heading: 'Diff',
      pluralize: true,
    })}
    ${await this.getChangelistMarkup_({
      changelist: this.runReport_.runResult.added,
      map: this.reportMaps_.added,
      isOpen: true,
      heading: 'Added',
      pluralize: false,
    })}
    ${await this.getChangelistMarkup_({
      changelist: this.runReport_.runResult.removed,
      map: this.reportMaps_.removed,
      isOpen: true,
      heading: 'Removed',
      pluralize: false,
    })}
    ${await this.getChangelistMarkup_({
      changelist: this.runReport_.runResult.unchanged,
      map: this.reportMaps_.unchanged,
      isOpen: false,
      heading: 'Unchanged',
      pluralize: false,
    })}
  </body>
</html>
`;
    /* eslint-enable indent */
  }

  /**
   * @param {!Array<!ImageDiffJson>} changelist
   * @param {!Map<string, !Array<!ImageDiffJson>>} map
   * @param {boolean} isOpen
   * @param {string} heading
   * @param {boolean} pluralize
   * @return {!Promise<string>}
   * @private
   */
  async getChangelistMarkup_({changelist, map, isOpen, heading, pluralize}) {
    const numDiffs = changelist.length;

    return `
<details class="report-changelist" ${isOpen && numDiffs > 0 ? 'open' : ''}>
  <summary class="report-changelist__heading">${numDiffs} ${heading}${pluralize && numDiffs !== 1 ? 's' : ''}</summary>
  <div class="report-changelist__content">
    ${this.getDiffListMarkup_({changelist, map})}
  </div>
</details>
`;
  }

  async getMetadataMarkup_() {
    const timestamp = (new Date()).toISOString();
    const numTestCases = this.runReport_.runTarget.runnableTestCases.length;
    const numScreenshots = this.runReport_.runTarget.runnableTestCases
      .map((testCase) => testCase.screenshotImageFiles.length)
      .reduce((total, current) => total + current, 0)
    ;

    const [nodeBinPath, scriptPath, ...scriptArgs] = process.argv;
    const nodeBinPathRedacted = nodeBinPath.replace(process.env.HOME, '~');
    const scriptPathRedacted = scriptPath.replace(process.env.PWD, '.');
    const nodeArgs = process.execArgv;
    const cliInvocation = [nodeBinPathRedacted, ...nodeArgs, scriptPathRedacted, ...scriptArgs]
      .map((arg) => {
        // Heuristic for "safe" characters that don't need to be escaped or wrapped in single quotes to be copy/pasted
        // and run in a shell. This includes the letters a-z and A-Z, the numbers 0-9,
        // See https://ascii.cl/
        if (/^[,-9@-Z_a-z=~]+$/.test(arg)) {
          return arg;
        }
        return `'${arg.replace(/'/g, "\\'")}'`;
      })
      .join(' ')
    ;

    const goldenDiffSource = await this.cliArgs_.parseDiffBase();
    const snapshotDiffSource = await this.cliArgs_.parseDiffBase({
      rawDiffBase: 'HEAD',
    });

    const gitUserName = await this.gitRepo_.getUserName();
    const gitUserEmail = await this.gitRepo_.getUserEmail();
    const gitUser = `${gitUserName} &lt;${gitUserEmail}&gt;`;

    const getExecutableVersion = async (cmd) => {
      const options = {cwd: process.env.PWD, env: process.env};
      const stdOut = await childProcess.exec(`${cmd} --version`, options);
      return stdOut[0].trim();
    };

    const mdcVersion = require('../../../lerna.json').version;
    const mdcVersionDistance = await this.getCommitDistanceMarkup_(mdcVersion);
    const nodeVersion = await getExecutableVersion('node');
    const npmVersion = await getExecutableVersion('npm');

    return `
<details class="report-metadata" open>
  <summary class="report-metadata__heading">Metadata</summary>
  <div class="report-metadata__content">
    <table class="report-metadata__table">
      <tbody>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Timestamp:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${timestamp}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Screenshots:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${numScreenshots}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Test Cases:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${numTestCases}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Golden:</th>
          <td class="report-metadata__cell report-metadata__cell--val">
            ${await this.getCommitLinkMarkup_(goldenDiffSource)}
          </td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Snapshot Base:</th>
          <td class="report-metadata__cell report-metadata__cell--val">
            ${await this.getCommitLinkMarkup_(snapshotDiffSource)}
            ${await this.getLocalChangesMarkup_(snapshotDiffSource)}
          </td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">User:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${gitUser}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">MDC Version:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${mdcVersion} ${mdcVersionDistance}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Node Version:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${nodeVersion}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">NPM Version:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${npmVersion}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">CLI Invocation:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${cliInvocation}</td>
        </tr>
      </tbody>
    </table>
  </div>
</details>
`;
  }

  /**
   * @param {!DiffSource} diffSource
   * @return {!Promise<string>}
   * @private
   */
  async getCommitLinkMarkup_(diffSource) {
    if (diffSource.publicUrl) {
      return `<a href="${diffSource.publicUrl}">${diffSource.publicUrl}</a>`;
    }

    if (diffSource.localFilePath) {
      return `${diffSource.localFilePath} (local file)`;
    }

    if (diffSource.gitRevision) {
      const rev = diffSource.gitRevision;

      if (rev.branch) {
        const branchDisplayName = rev.remote ? `${rev.remote}/${rev.branch}` : rev.branch;
        return `
<a href="${GITHUB_REPO_URL}/blob/${rev.commit}/${rev.snapshotFilePath}">${rev.commit}</a>
on branch
<a href="${GITHUB_REPO_URL}/blob/${rev.branch}/${rev.snapshotFilePath}">${branchDisplayName}</a>
`;
      }

      if (rev.tag) {
        return `
<a href="${GITHUB_REPO_URL}/blob/${rev.commit}/${rev.snapshotFilePath}">${rev.commit}</a>
on tag
<a href="${GITHUB_REPO_URL}/blob/${rev.tag}/${rev.snapshotFilePath}">${rev.tag}</a>
`;
      }
    }

    throw new Error('Unable to generate markup for invalid diff source');
  }

  /**
   * @param {string} mdcVersion
   * @return {!Promise<string>}
   */
  async getCommitDistanceMarkup_(mdcVersion) {
    const mdcCommitCount = (await this.gitRepo_.getLog([`v${mdcVersion}..HEAD`])).length;
    return mdcCommitCount > 0 ? `+ ${mdcCommitCount} commit${mdcCommitCount === 1 ? '' : 's'}` : '';
  }

  async getLocalChangesMarkup_() {
    const fragments = [];
    const gitStatus = await this.gitRepo_.getStatus();
    const numUntracked = gitStatus.not_added.length;
    const numModified = gitStatus.files.length - numUntracked;

    if (numModified > 0) {
      fragments.push(`${numModified} locally modified file${numModified === 1 ? '' : 's'}`);
    }

    if (numUntracked > 0) {
      fragments.push(`${numUntracked} untracked file${numUntracked === 1 ? '' : 's'}`);
    }

    return fragments.length > 0 ? `(${fragments.join(', ')})` : '';
  }

  getCollapseButtonMarkup_() {
    return `
<p>
  <button onclick="mdc.report.collapseAll()">
    collapse all
  </button>
</p>
`;
  }

  getDiffListMarkup_({changelist, map}) {
    const numDiffs = changelist.length;
    if (numDiffs === 0) {
      return '<div class="report-congrats">Woohoo! 🎉</div>';
    }

    const htmlFilePaths = Array.from(map.keys());
    return htmlFilePaths.map((htmlFilePath) => this.getTestCaseMarkup_({htmlFilePath, map})).join('\n');
  }

  getTestCaseMarkup_({htmlFilePath, map}) {
    const diffs = map.get(htmlFilePath);
    const goldenPageUrl = diffs[0].goldenPageUrl;
    const snapshotPageUrl = diffs[0].snapshotPageUrl;

    return `
<details class="report-file" open>
  <summary class="report-file__heading">
    ${htmlFilePath}
    (<a href="${goldenPageUrl}">golden</a> | <a href="${snapshotPageUrl}">snapshot</a>)
  </summary>
  <div class="report-file__content">
    ${diffs.map((diff) => this.getDiffRowMarkup_(diff)).join('\n')}
  </div>
</details>
`;
  }

  getDiffRowMarkup_(diff) {
    return `
<details class="report-browser" open>
  <summary class="report-browser__heading">${diff.userAgentAlias}</summary>
  <div class="report-browser__content">
    ${this.getDiffCellMarkup_('Golden', diff.expectedImageUrl)}
    ${this.getDiffCellMarkup_('Diff', diff.diffImageUrl)}
    ${this.getDiffCellMarkup_('Snapshot', diff.actualImageUrl)}
  </div>
</details>
`;
  }

  getDiffCellMarkup_(description, url) {
    return `
<div class="report-browser__image-cell">
  ${description}:
  ${this.getDiffImageLinkMarkup_(url)}
</div>
`;
  }

  getDiffImageLinkMarkup_(url) {
    if (url) {
      return `
  <a href="${url}" class="report-browser__image-link">
    <img class="report-browser__image" src="${url}">
  </a>
`;
    }

    return '<div>(null)</div>';
  }
}

module.exports = ReportGenerator;
