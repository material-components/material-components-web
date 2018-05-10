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
const child_process = require('mz/child_process'); // eslint-disable-line

class ReportGenerator {
  constructor({testCases, diffs}) {
    /**
     * @type {!Array<!UploadableTestCase>}
     * @private
     */
    this.testCases_ = testCases;

    /**
     * @type {!Array<!ImageDiffJson>}
     * @private
     */
    this.diffList_ = diffs;

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

    /**
     * @type {!Map<string, !Array<!ImageDiffJson>>}
     * @private
     */
    this.diffMap_ = new Map();

    diffs.forEach((diff) => {
      if (!this.diffMap_.has(diff.htmlFilePath)) {
        this.diffMap_.set(diff.htmlFilePath, []);
      }
      this.diffMap_.get(diff.htmlFilePath).push(diff);
    });
  }

  async generateHtml() {
    const numDiffs = this.diffList_.length;

    return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${numDiffs} Diffs - Screenshot Test Report - MDC Web</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${this.getStyleMarkup_()}
  </head>
  <body class="report-body">
    <h1>
      Screenshot Test Report for
      <a href="https://github.com/material-components/material-components-web" target="_blank">MDC Web</a>
    </h1>
    ${await this.getMetadataMarkup_()}
    <h2>
      ${numDiffs} Diff${numDiffs !== 1 ? 's' : ''}
      ${this.getCollapseButtonMarkup_()}
    </h2>
    <div>
      ${this.getDiffListMarkup_()}
    </div>
  </body>
</html>
`;
  }

  async getMetadataMarkup_() {
    const timestamp = (new Date()).toISOString();
    const numTestCases = this.testCases_.length;
    const numScreenshots = this.testCases_
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

    const gitHeadBranch = await this.gitRepo_.getBranchName();
    const gitHeadCommit = await this.gitRepo_.getShortCommitHash();
    const gitGoldenBranch = await this.gitRepo_.getBranchName(this.cliArgs_.diffBase);
    const gitGoldenCommit = await this.gitRepo_.getShortCommitHash(this.cliArgs_.diffBase);
    const gitUserName = await this.gitRepo_.getUserName();
    const gitUserEmail = await this.gitRepo_.getUserEmail();
    const gitUser = `&lt;${gitUserName}&gt; ${gitUserEmail}`;

    const getVersion = async (cmd) => {
      const options = {cwd: process.env.PWD, env: process.env};
      const stdOut = await child_process.exec(`${cmd} --version`, options);
      return stdOut[0].trim();
    };

    const nodeVersion = await getVersion('node');
    const npmVersion = await getVersion('npm');

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
          <th class="report-metadata__cell report-metadata__cell--key">User:</th>
          <td class="report-metadata__cell report-metadata__cell--val">${gitUser}</td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Golden Commit:</th>
          <td class="report-metadata__cell report-metadata__cell--val">
            ${this.getCommitLinkMarkup_(gitGoldenCommit, gitGoldenBranch)}
          </td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Snapshot Commit:</th>
          <td class="report-metadata__cell report-metadata__cell--val">
            ${this.getCommitLinkMarkup_(gitHeadCommit, gitHeadBranch)}
          </td>
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

  getCommitLinkMarkup_(commit, branch) {
    const GITHUB_REPO_URL = 'https://github.com/material-components/material-components-web';
    return `
<a href="${GITHUB_REPO_URL}/commit/${commit}">${commit}</a>
on
<a href="${GITHUB_REPO_URL}/tree/${branch.replace('origin/', '')}">${branch}</a>
`;
  }

  getCollapseButtonMarkup_() {
    const numDiffs = this.diffList_.length;
    if (numDiffs === 0) {
      return '';
    }

    return `
<button onclick="Array.from(document.querySelectorAll('.report-file, .report-browser')).forEach((e) => e.open = false)">
  collapse all
</button>
`;
  }

  getDiffListMarkup_() {
    const numDiffs = this.diffList_.length;
    if (numDiffs === 0) {
      return '<div class="report-congrats">Woohoo! 🎉</div>';
    }

    const htmlFilePaths = Array.from(this.diffMap_.keys());
    return htmlFilePaths.map((htmlFilePath) => this.getTestCaseMarkup_(htmlFilePath)).join('\n');
  }

  getTestCaseMarkup_(htmlFilePath) {
    const diffs = this.diffMap_.get(htmlFilePath);
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
  <summary class="report-browser__heading">${diff.browserKey}</summary>
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
  <a href="${url}" class="report-browser__image-link">
    <img class="report-browser__image" src="${url}">
  </a>
</div>
`;
  }

  getStyleMarkup_() {
    return `
<style>
/* https://www.paulirish.com/2012/box-sizing-border-box-ftw/ */
/* apply a natural box layout model to all elements, but allowing components to change */
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}

.report-body {
  font-family: "Roboto Mono", Consolas, monospace;
  font-size: smaller;
}

.report-metadata__content {
  padding: 0 24px;
}

.report-metadata__table {
  border-collapse: collapse;
}

.report-metadata__cell {
  padding: 2px 10px 2px 0;
  text-align: left;
  font-weight: normal;
}

.report-metadata__cell--key {
  font-style: italic;
}

.report-file {
  margin-bottom: 20px;
  border: 1px solid #aaa;
  border-radius: 3px;
  background-color: #eee;
}

.report-file__heading {
  font-size: larger;
}

.report-metadata__heading,
.report-file__heading,
.report-browser__heading {
  font-weight: bold;
  padding: 8px 10px;
  cursor: pointer;
}

.report-metadata__heading:hover,
.report-file__heading:hover,
.report-browser__heading:hover {
  background-color: #ddd;
}

.report-file__content {
  padding: 0 24px;
}

.report-browser__content {
  display: flex;
  padding: 10px 24px;
}

.report-browser__image-cell {
  width: calc(33% - 5px);
}

.report-browser__image-cell + .report-browser__image-cell {
  margin-left: 5px;
}

.report-browser__image-link {
  display: block;
}

.report-browser__image {
  max-width: 100%;
  vertical-align: top;
}

.report-congrats {
  font-size: 3rem;
  color: green;
}
</style>
`;
  }
}

module.exports = ReportGenerator;
