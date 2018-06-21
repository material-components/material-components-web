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

const CbtUserAgent = require('./cbt-user-agent');
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
     *   skipped: !Map<string, !Array<!ImageDiffJson>>,
     * }}
     * @private
     */
    this.reportMaps_ = {
      diffs: new Map(),
      added: new Map(),
      removed: new Map(),
      unchanged: new Map(),
      skipped: new Map(),
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
    this.groupOneChangelistByFile_(this.runReport_.runResult.skipped, this.reportMaps_.skipped);
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
    const runResult = this.runReport_.runResult;

    const numDiffs = runResult.diffs.length;
    const numAdded = runResult.added.length;
    const numRemoved = runResult.removed.length;
    const numUnchanged = runResult.unchanged.length;
    const numSkipped = runResult.skipped.length;

    this.iconUrlMap_ = {};
    const allUserAgents = (await CbtUserAgent.fetchUserAgents()).allUserAgents;
    for (const userAgent of allUserAgents) {
      this.iconUrlMap_[userAgent.alias] = userAgent.browser.parsedIconUrl;
    }

    const title = [
      `${numDiffs} Diff${numDiffs !== 1 ? 's' : ''}`,
      `${numAdded} Added`,
      `${numRemoved} Removed`,
      `${numUnchanged} Unchanged`,
      `${numSkipped} Skipped`,
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
  </head>
  <body class="report-body">
    <h1>
      Screenshot Test Report for
      <a href="https://github.com/material-components/material-components-web" target="_blank">MDC Web</a>
    </h1>
    ${await this.getMetadataMarkup_()}
    ${await this.getChangelistMarkup_({
      changelist: runResult.skipped,
      map: this.reportMaps_.skipped,
      isOpen: false,
      isCheckable: false,
      changeGroupId: 'skipped',
      heading: 'Skipped',
      pluralize: false,
    })}
    ${await this.getChangelistMarkup_({
      changelist: runResult.diffs,
      map: this.reportMaps_.diffs,
      isOpen: true,
      isCheckable: true,
      changeGroupId: 'diffs',
      heading: 'Diff',
      pluralize: true,
    })}
    ${await this.getChangelistMarkup_({
      changelist: runResult.added,
      map: this.reportMaps_.added,
      isOpen: true,
      isCheckable: true,
      changeGroupId: 'added',
      heading: 'Added',
      pluralize: false,
    })}
    ${await this.getChangelistMarkup_({
      changelist: runResult.removed,
      map: this.reportMaps_.removed,
      isOpen: true,
      isCheckable: true,
      changeGroupId: 'removed',
      heading: 'Removed',
      pluralize: false,
    })}
    ${await this.getChangelistMarkup_({
      changelist: runResult.unchanged,
      map: this.reportMaps_.unchanged,
      isOpen: false,
      isCheckable: false,
      changeGroupId: 'unchanged',
      heading: 'Unchanged',
      pluralize: false,
    })}
    ${this.getFloatingToolbarMarkup_()}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js"></script>
    <script src="./report.js"></script>
  </body>
</html>
`;
    /* eslint-enable indent */
  }

  getCollapseButtonMarkup_() {
    return `
<p>
  <button onclick="mdc.reportUi.collapseAll()">
    collapse all
  </button>
</p>
`;
  }

  async getMetadataMarkup_() {
    const timestamp = (new Date()).toISOString();

    const {runnableTestCases, skippedTestCases, runnableUserAgents, skippedUserAgents} = this.runReport_.runTarget;

    const numRunnableTestCases = runnableTestCases.length;
    const numSkippedTestCases = skippedTestCases.length;
    const numTotalTestCases = numRunnableTestCases + numSkippedTestCases;

    const numRunnableUserAgents = runnableUserAgents.length;
    const numSkippedUserAgents = skippedUserAgents.length;
    const numTotalUserAgents = numRunnableUserAgents + numSkippedUserAgents;

    const numTotalScreenshots = numTotalTestCases * numTotalUserAgents;
    const numRunnableScreenshots = numRunnableTestCases * numRunnableUserAgents;
    const numSkippedScreenshots = numTotalScreenshots - numRunnableScreenshots;

    const testCaseCountMarkup = this.getMetadataFilterCountMarkup_(numRunnableTestCases, numSkippedTestCases);
    const browserCountMarkup = this.getMetadataFilterCountMarkup_(numRunnableUserAgents, numSkippedUserAgents);
    const screenshotCountMarkup = this.getMetadataFilterCountMarkup_(numRunnableScreenshots, numSkippedScreenshots);

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
    const mdcVersionDistance = await this.getMetadataCommitDistanceMarkup_(mdcVersion);
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
          <th class="report-metadata__cell report-metadata__cell--key">Test Cases:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${testCaseCountMarkup}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Browsers:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${browserCountMarkup}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Screenshots:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${screenshotCountMarkup}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Golden:</th>
          <td class="report-metadata__cell report-metadata__cell--val">
            ${await this.getMetadataCommitLinkMarkup_(goldenDiffSource)}
          </td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Snapshot Base:</th>
          <td class="report-metadata__cell report-metadata__cell--val">
            ${await this.getMetadataCommitLinkMarkup_(snapshotDiffSource)}
            ${await this.getMetadataLocalChangesMarkup_(snapshotDiffSource)}
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

  getMetadataFilterCountMarkup_(numRunnable, numSkipped) {
    const numTotal = numRunnable + numSkipped;
    if (numSkipped > 0) {
      return `${numRunnable} of ${numTotal} (skipped ${numSkipped})`;
    }
    return String(numRunnable);
  }

  /**
   * @param {!DiffSource} diffSource
   * @return {!Promise<string>}
   * @private
   */
  async getMetadataCommitLinkMarkup_(diffSource) {
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
<a href="${GITHUB_REPO_URL}/commit/${rev.commit}">${rev.commit}</a>
on branch
<a href="${GITHUB_REPO_URL}/tree/${rev.branch}">${branchDisplayName}</a>
`;
      }

      if (rev.tag) {
        return `
<a href="${GITHUB_REPO_URL}/commit/${rev.commit}">${rev.commit}</a>
on tag
<a href="${GITHUB_REPO_URL}/tree/${rev.tag}">${rev.tag}</a>
`;
      }
    }

    throw new Error('Unable to generate markup for invalid diff source');
  }

  /**
   * @param {string} mdcVersion
   * @return {!Promise<string>}
   */
  async getMetadataCommitDistanceMarkup_(mdcVersion) {
    const mdcCommitCount = (await this.gitRepo_.getLog([`v${mdcVersion}..HEAD`])).length;
    return mdcCommitCount > 0 ? `+ ${mdcCommitCount} commit${mdcCommitCount === 1 ? '' : 's'}` : '';
  }

  async getMetadataLocalChangesMarkup_() {
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

  /**
   * @param {!Array<!ImageDiffJson>} changelist
   * @param {!Map<string, !Array<!ImageDiffJson>>} map
   * @param {boolean} isOpen
   * @param {boolean} isCheckable
   * @param {string} changeGroupId
   * @param {string} heading
   * @param {boolean} pluralize
   * @return {!Promise<string>}
   * @private
   */
  async getChangelistMarkup_({changelist, map, isOpen, isCheckable, changeGroupId, heading, pluralize}) {
    const numDiffs = changelist.length;
    const headingPluralized = `${heading}${pluralize && numDiffs !== 1 ? 's' : ''}`;

    return `
<details class="report-changelist" ${isOpen && numDiffs > 0 ? 'open' : ''}
  data-change-group-id="${changeGroupId}"
>
  <summary class="report-changelist__heading">
    ${this.getCheckboxMarkup_({changeGroupId, isCheckable, numScreenshots: numDiffs})}
    ${numDiffs} ${headingPluralized}
    ${this.getReviewStatusMarkup_({changeGroupId, isCheckable, numScreenshots: numDiffs})}
  </summary>
  <div class="report-changelist__content">
    ${this.getDiffListMarkup_({changelist, map, isCheckable, changeGroupId, headingPluralized})}
  </div>
</details>
`;
  }

  /**
   * @param {!Array<!ImageDiffJson>} changelist
   * @param {!Map<string, !Array<!ImageDiffJson>>} map
   * @param {boolean} isCheckable
   * @param {string} changeGroupId
   * @param {string} headingPluralized
   * @return {string}
   * @private
   */
  getDiffListMarkup_({changelist, map, isCheckable, changeGroupId, headingPluralized}) {
    const numDiffs = changelist.length;
    if (numDiffs === 0) {
      return '<div class="report-congrats">Woohoo! 🎉</div>';
    }

    const htmlFilePaths = Array.from(map.keys());
    return htmlFilePaths.map((htmlFilePath) => {
      return this.getTestCaseMarkup_({htmlFilePath, map, isCheckable, changeGroupId, headingPluralized});
    }).join('\n');
  }

  /**
   * @param {string} htmlFilePath
   * @param {!Map<string, !Array<!ImageDiffJson>>} map
   * @param {boolean} isCheckable
   * @param {string} changeGroupId
   * @param {string} headingPluralized
   * @return {string}
   * @private
   */
  getTestCaseMarkup_({htmlFilePath, map, isCheckable, changeGroupId, headingPluralized}) {
    const diffs = map.get(htmlFilePath);
    const goldenPageUrl = diffs[0].goldenPageUrl;
    const snapshotPageUrl = diffs[0].snapshotPageUrl;

    return `
<details class="report-file" open
  data-change-group-id="${changeGroupId}"
  data-html-file-path="${htmlFilePath}"
>
  <summary class="report-file__heading">
    ${this.getCheckboxMarkup_({changeGroupId, htmlFilePath, isCheckable, numScreenshots: diffs.length})}
    ${diffs.length} ${headingPluralized} in ${htmlFilePath}
    ${this.getGoldenAndSnapshotLinkMarkup_({goldenPageUrl, snapshotPageUrl})}
    ${this.getReviewStatusMarkup_({changeGroupId, htmlFilePath, isCheckable, numScreenshots: diffs.length})}
  </summary>
  <div class="report-file__content">
    ${diffs.map((diff) => this.getDiffRowMarkup_({diff, changeGroupId, htmlFilePath, isCheckable})).join('\n')}
  </div>
</details>
`;
  }

  /**
   * @param {string} goldenPageUrl
   * @param {string} snapshotPageUrl
   * @return {string}
   * @private
   */
  getGoldenAndSnapshotLinkMarkup_({goldenPageUrl, snapshotPageUrl}) {
    const fragments = [];
    if (goldenPageUrl) {
      fragments.push(`<a href="${goldenPageUrl}">golden</a>`);
    }
    if (snapshotPageUrl) {
      fragments.push(`<a href="${snapshotPageUrl}">snapshot</a>`);
    }
    if (fragments.length === 0) {
      return '';
    }
    return `(${fragments.join(' | ')})`;
  }

  /**
   * @param {!ImageDiffJson} diff
   * @param {string} changeGroupId
   * @param {string} htmlFilePath
   * @param {boolean} isCheckable
   * @return {string}
   * @private
   */
  getDiffRowMarkup_({diff, changeGroupId, htmlFilePath, isCheckable}) {
    const {userAgentAlias} = diff;
    const browserIconUrl = this.iconUrlMap_[userAgentAlias];
    return `
<details class="report-browser" open
  data-change-group-id="${changeGroupId}"
  data-html-file-path="${htmlFilePath}"
  data-user-agent-alias="${userAgentAlias}"
>
  <summary class="report-browser__heading">
    ${this.getCheckboxMarkup_({changeGroupId, htmlFilePath, userAgentAlias, isCheckable, numScreenshots: 1})}
    <img src="${browserIconUrl}" class="report-browser__icon">
    ${diff.userAgentAlias}
    ${this.getReviewStatusMarkup_({changeGroupId, htmlFilePath, userAgentAlias, isCheckable, numScreenshots: 1})}
  </summary>
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

    return '<div>(none)</div>';
  }

  getFloatingToolbarMarkup_() {
    /* eslint-disable max-len */
    return `
<footer class="report-toolbar">
  <div class="report-toolbar__column">
    <button class="report-toolbar__button report-toolbar__button--approve"
            id="report-toolbar__approve-selected-button"
            onclick="mdc.reportUi.approveSelected()">
      Approve
    </button>
    <button class="report-toolbar__button report-toolbar__button--retry"
            id="report-toolbar__retry-selected-button"
            onclick="mdc.reportUi.retrySelected()">
      Retry
    </button>
    <span id="report-toolbar__selected-count"></span> selected screenshots
  </div>
  <div class="report-toolbar__column">
    Select:
    <button class="report-toolbar__button" id="report-toolbar__select-all-button" onclick="mdc.reportUi.selectAll()">All</button>
    <button class="report-toolbar__button" id="report-toolbar__select-none-button" onclick="mdc.reportUi.selectNone()">None</button>
    <button class="report-toolbar__button" id="report-toolbar__select-inverse-button" onclick="mdc.reportUi.selectInverse()">Inverse</button>
  </div>
  <div class="report-toolbar__column">
    Collapse:
    <button class="report-toolbar__button" onclick="mdc.reportUi.collapseAll()">All</button>
    <button class="report-toolbar__button" onclick="mdc.reportUi.collapseNone()">None</button>
    <button class="report-toolbar__button" onclick="mdc.reportUi.collapseImages()">Images</button>
  </div>
</footer>

<aside class="report-cli-modal" id="report-cli-modal" data-state="closed">
  <div class="report-cli-modal__window">
    <div class="report-cli-modal__title">
      CLI Command
    </div>
    <div class="report-cli-modal__content">  
      <textarea class="report-cli-modal__command" id="report-cli-modal__command" readonly></textarea>
    </div>
    <div class="report-cli-modal__footer">  
      <button class="report-cli-modal__button report-cli-modal__button--copy"
              id="report-cli-modal__button--copy">Copy</button>
      <button class="report-cli-modal__button report-cli-modal__button--close"
              id="report-cli-modal__button--close">Close</button>
    </div>
  </div>
</aside>
`;
    /* eslint-enable max-len */
  }

  /**
   * @param {string} changeGroupId
   * @param {string=} htmlFilePath
   * @param {string=} userAgentAlias
   * @param {boolean} isCheckable
   * @param {number} numScreenshots
   * @return {string}
   * @private
   */
  getCheckboxMarkup_({changeGroupId, htmlFilePath = '', userAgentAlias = '', isCheckable, numScreenshots}) {
    const isVisible = isCheckable && numScreenshots > 0;
    const checkboxAttribute = isVisible ? 'checked' : 'disabled';

    let checkboxClassName;
    let eventHandlerJs;

    if (htmlFilePath && userAgentAlias) {
      checkboxClassName = 'report-browser__checkbox' + (isVisible ? '' : ' report-browser__checkbox--hidden');
      eventHandlerJs = 'mdc.reportUi.browserCheckboxChanged(this)';
    } else if (htmlFilePath) {
      checkboxClassName = 'report-file__checkbox' + (isVisible ? '' : ' report-file__checkbox--hidden');
      eventHandlerJs = 'mdc.reportUi.fileCheckboxChanged(this)';
    } else {
      checkboxClassName = 'report-changelist__checkbox' + (isVisible ? '' : ' report-changelist__checkbox--hidden');
      eventHandlerJs = 'mdc.reportUi.changelistCheckboxChanged(this)';
    }

    return `
<input type="checkbox" class="${checkboxClassName}"
  ${checkboxAttribute}
  data-change-group-id="${changeGroupId}"
  data-html-file-path="${htmlFilePath}"
  data-user-agent-alias="${userAgentAlias}"
  data-review-status="unreviewed"
  onchange="${eventHandlerJs}"
>
`.trim();
  }

  /**
   * @param {string} changeGroupId
   * @param {string=} htmlFilePath
   * @param {string=} userAgentAlias
   * @param {boolean} isCheckable
   * @param {number} numScreenshots
   * @return {string}
   * @private
   */
  getReviewStatusMarkup_({changeGroupId, htmlFilePath = '', userAgentAlias = '', isCheckable, numScreenshots}) {
    const isVisible = isCheckable && numScreenshots > 0;

    let reviewStatusClassName;

    if (htmlFilePath && userAgentAlias) {
      reviewStatusClassName = 'report-review-status report-review-status--browser' +
        (isVisible ? '' : ' report-review-status--hidden');
    } else if (htmlFilePath) {
      reviewStatusClassName = 'report-review-status report-review-status--file' +
        (isVisible ? '' : ' report-review-status--hidden');
    } else {
      reviewStatusClassName = 'report-review-status report-review-status--changelist' +
        (isVisible ? '' : ' report-review-status--hidden');
    }

    return `
<span class="${reviewStatusClassName}"
  data-change-group-id="${changeGroupId}"
  data-html-file-path="${htmlFilePath}"
  data-user-agent-alias="${userAgentAlias}"
  data-review-status="unreviewed"
>unreviewed</span>
`.trim();
  }
}

module.exports = ReportGenerator;
