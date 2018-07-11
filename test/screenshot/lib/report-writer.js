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

const Handlebars = require('handlebars');
const path = require('path');
const stringify = require('json-stable-stringify');

const proto = require('../proto/types.pb').mdc.proto;
const {HbsTestPageData, ReportData, Screenshots, TestFile} = proto;

const Duration = require('./duration');
const LocalStorage = require('./local-storage');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

const GITHUB_REPO_URL = 'https://github.com/material-components/material-components-web';

class ReportWriter {
  constructor() {
    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();

    this.registerHelpers_();
    this.registerPartials_();
  }

  /** @private */
  registerHelpers_() {
    // Handlebars sets `this` to the current context, so we need to use functions instead of lambdas.
    const self = this;

    const helpers = {
      getPageTitle: function() {
        return self.getPageTitle_(this);
      },
      msToHuman: function(ms) {
        return self.msToHuman_(ms);
      },
      forEachTestPage: function(screenshotPageMap, hbsOptions) {
        return self.forEachTestPage_(screenshotPageMap, hbsOptions.fn);
      },
      getHtmlFileLinks: function() {
        return self.getHtmlFileLinks_(this);
      },
    };

    for (const [name, helper] of Object.entries(helpers)) {
      Handlebars.registerHelper(name, helper);
    }
  }

  /**
   * @param {!mdc.proto.HbsTestPageData} hbsTestPageData
   * @return {!SafeString}
   * @private
   */
  getHtmlFileLinks_(hbsTestPageData) {
    const expectedHtmlFileUrl = hbsTestPageData.expected_html_file_url;
    const actualHtmlFileUrl = hbsTestPageData.actual_html_file_url;
    const fragments = [];
    if (expectedHtmlFileUrl) {
      fragments.push(`<a href=${expectedHtmlFileUrl}>golden</a>`);
    }
    if (actualHtmlFileUrl) {
      fragments.push(`<a href=${actualHtmlFileUrl}>snapshot</a>`);
    }
    return new Handlebars.SafeString(`(${fragments.join(' | ')})`);
  }

  /* eslint-disable max-len */
  /**
   * @param {!Object<string, !mdc.proto.ScreenshotList>} screenshotPageMap
   * @param {function(context: !mdc.proto.HbsTestPageData): !SafeString} childTemplateFn
   * @return {!SafeString}
   * @private
   */
  forEachTestPage_(screenshotPageMap, childTemplateFn) {
    /* eslint-enable max-len */
    /**
     * @param {!Array<!mdc.proto.Screenshot>} screenshotArray
     * @param {string} htmlFilePropertyKey
     * @return {?string}
     */
    const getHtmlFileUrl = (screenshotArray, htmlFilePropertyKey) => {
      const [firstScreenshot] = screenshotArray;
      if (!firstScreenshot) {
        return null;
      }
      const htmlFile = firstScreenshot[htmlFilePropertyKey];
      if (!htmlFile) {
        return null;
      }
      return htmlFile.public_url;
    };

    let html = '';
    for (const [htmlFilePath, screenshotList] of Object.entries(screenshotPageMap)) {
      const expectedHtmlFileUrl = getHtmlFileUrl(screenshotList.screenshots, 'expected_html_file');
      const actualHtmlFileUrl = getHtmlFileUrl(screenshotList.screenshots, 'actual_html_file');

      html += childTemplateFn(HbsTestPageData.create({
        html_file_path: htmlFilePath,
        expected_html_file_url: expectedHtmlFileUrl,
        actual_html_file_url: actualHtmlFileUrl,
        screenshot_array: screenshotList.screenshots,
      }));
    }
    return new Handlebars.SafeString(html);
  }

  /**
   * @param {number} ms
   * @return {string}
   * @private
   */
  msToHuman_(ms) {
    return Duration.millis(ms).toHuman();
  }

  /** @private */
  registerPartials_() {
    const partialFilePaths = this.localStorage_.glob(path.join(TEST_DIR_RELATIVE_PATH, 'report/_*.hbs'));
    for (const partialFilePath of partialFilePaths) {
      // TODO(acdvorak): What about hyphen/dash characters?
      const name = path.basename(partialFilePath)
        .replace(/^_/, '') // Remove leading underscore
        .replace(/\.\w+$/, '') // Remove file extension
      ;
      const content = this.localStorage_.readTextFileSync(partialFilePath);
      Handlebars.registerPartial(name, content);
    }
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @private
   */
  getPageTitle_(reportData) {
    const numChanged = reportData.screenshots.changed_screenshot_list.length;
    const numAdded = reportData.screenshots.added_screenshot_list.length;
    const numRemoved = reportData.screenshots.removed_screenshot_list.length;
    const numUnchanged = reportData.screenshots.unchanged_screenshot_list.length;
    const numSkipped = reportData.screenshots.skipped_screenshot_list.length;

    return [
      `${numChanged} Diff${numChanged !== 1 ? 's' : ''}`,
      `${numAdded} Added`,
      `${numRemoved} Removed`,
      `${numUnchanged} Unchanged`,
      `${numSkipped} Skipped`,
    ].join(', ');
  }

  /**
   * @param {!mdc.proto.ReportData} fullReportData
   * @return {!Promise<void>}
   */
  async generateReportPage(fullReportData) {
    const meta = fullReportData.meta;

    meta.end_time_iso_utc = new Date().toISOString();
    meta.duration_ms = meta.end_time_iso_utc - meta.start_time_iso_utc;

    // Remove derived data to save bytes (~3 MiB)
    // TODO(acdvorak): Make sure the report page and `screenshot:approve` don't need this data.
    const slimReportData = ReportData.create(fullReportData);
    slimReportData.screenshots = Screenshots.create({
      changed_screenshot_list: slimReportData.screenshots.changed_screenshot_list,
      unchanged_screenshot_list: slimReportData.screenshots.unchanged_screenshot_list,
      skipped_screenshot_list: slimReportData.screenshots.skipped_screenshot_list,
      added_screenshot_list: slimReportData.screenshots.added_screenshot_list,
      removed_screenshot_list: slimReportData.screenshots.removed_screenshot_list,
    });

    const templateFileRelativePath = 'report/report.hbs';
    const htmlFileRelativePath = 'report/report.html';
    const jsonFileRelativePath = 'report/report.json';

    const templateFileAbsolutePath = path.join(meta.local_asset_base_dir, templateFileRelativePath);
    const htmlFileAbsolutePath = path.join(meta.local_report_base_dir, htmlFileRelativePath);
    const jsonFileAbsolutePath = path.join(meta.local_report_base_dir, jsonFileRelativePath);

    const htmlFileUrl = this.getPublicUrl_(htmlFileRelativePath, meta);
    const jsonFileUrl = this.getPublicUrl_(jsonFileRelativePath, meta);

    const reportHtmlFile = TestFile.create({
      relative_path: htmlFileRelativePath,
      absolute_path: htmlFileAbsolutePath,
      public_url: htmlFileUrl,
    });

    const reportJsonFile = TestFile.create({
      relative_path: jsonFileRelativePath,
      absolute_path: jsonFileAbsolutePath,
      public_url: jsonFileUrl,
    });

    meta.report_html_file = reportHtmlFile;
    meta.report_json_file = reportJsonFile;

    const jsonFileContent = this.stringify_(slimReportData);
    const htmlFileContent = await this.generateHtml_(fullReportData, templateFileAbsolutePath);

    await this.localStorage_.writeTextFile(jsonFileAbsolutePath, jsonFileContent);
    await this.localStorage_.writeTextFile(htmlFileAbsolutePath, htmlFileContent);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {string} templateFileAbsolutePath
   * @return {!Promise<string>}
   */
  async generateHtml_(reportData, templateFileAbsolutePath) {
    const templateContent = await this.localStorage_.readTextFile(templateFileAbsolutePath);
    const templateFunction = Handlebars.compile(templateContent);
    return templateFunction(reportData);
  }

  /**
   * @param {string} relativePath
   * @param {!mdc.proto.ReportMeta} meta
   * @return {string}
   * @private
   */
  getPublicUrl_(relativePath, meta) {
    // TODO(acdvorak): Centralize this
    return `${meta.remote_upload_base_url}${meta.remote_upload_base_dir}${relativePath}`;
  }

  /**
   * @param {!Array<*>|!Object<string, *>} object
   * @return {string}
   * @private
   */
  stringify_(object) {
    return stringify(object, {space: '  '}) + '\n';
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<string>}
   */
  async generateHtml2(reportData) {
    const numDiffs = runResult.diffs.length;
    const numAdded = runResult.added.length;
    const numRemoved = runResult.removed.length;
    const numUnchanged = runResult.unchanged.length;
    const numSkipped = runResult.skipped.length;

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
      changeGroupId: 'changed',
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

    const {runnableTestPages, skippedTestPages, runnableUserAgents, skippedUserAgents} = this.runReport_.runTarget;

    const numRunnableTestPages = runnableTestPages.length;
    const numSkippedTestPages = skippedTestPages.length;
    const numTotalTestPages = numRunnableTestPages + numSkippedTestPages;

    const numRunnableUserAgents = runnableUserAgents.length;
    const numSkippedUserAgents = skippedUserAgents.length;
    const numTotalUserAgents = numRunnableUserAgents + numSkippedUserAgents;

    const numTotalScreenshots = numTotalTestPages * numTotalUserAgents;
    const numRunnableScreenshots = numRunnableTestPages * numRunnableUserAgents;
    const numSkippedScreenshots = numTotalScreenshots - numRunnableScreenshots;

    const testPageCountMarkup = this.getMetadataFilterCountMarkup_(numRunnableTestPages, numSkippedTestPages);
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

    const goldenDiffBase = await this.cli_.parseDiffBase();
    const snapshotDiffBase = await this.cli_.parseDiffBase({
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
          <td class="report-metadata__cell report-metadata__cell--val">${testPageCountMarkup}</td>
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
            ${await this.getMetadataCommitLinkMarkup_(goldenDiffBase)}
          </td>
        </tr>
        <tr>
          <th class="report-metadata__cell report-metadata__cell--key">Snapshot Base:</th>
          <td class="report-metadata__cell report-metadata__cell--val">
            ${await this.getMetadataCommitLinkMarkup_(snapshotDiffBase)}
            ${await this.getMetadataLocalChangesMarkup_(snapshotDiffBase)}
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
   * @param {!DiffBase} DiffBase
   * @return {!Promise<string>}
   * @private
   */
  async getMetadataCommitLinkMarkup_(DiffBase) {
    if (DiffBase.publicUrl) {
      return `<a href="${DiffBase.publicUrl}">${DiffBase.publicUrl}</a>`;
    }

    if (DiffBase.localFilePath) {
      return `${DiffBase.localFilePath} (local file)`;
    }

    if (DiffBase.gitRevision) {
      const rev = DiffBase.gitRevision;

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
   * @param {!Array<!ImageComparison>} changelist
   * @param {!Map<string, !Array<!ImageComparison>>} map
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
   * @param {!Array<!ImageComparison>} changelist
   * @param {!Map<string, !Array<!ImageComparison>>} map
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
      return this.getTestPageMarkup_({htmlFilePath, map, isCheckable, changeGroupId, headingPluralized});
    }).join('\n');
  }

  /**
   * @param {string} htmlFilePath
   * @param {!Map<string, !Array<!ImageComparison>>} map
   * @param {boolean} isCheckable
   * @param {string} changeGroupId
   * @param {string} headingPluralized
   * @return {string}
   * @private
   */
  getTestPageMarkup_({htmlFilePath, map, isCheckable, changeGroupId, headingPluralized}) {
    const diffs = map.get(htmlFilePath);
    const expectedTestPageUrl = diffs[0].expectedTestPageUrl;
    const actualTestPageUrl = diffs[0].actualTestPageUrl;

    return `
<details class="report-file" open
  data-change-group-id="${changeGroupId}"
  data-html-file-path="${htmlFilePath}"
>
  <summary class="report-file__heading">
    ${this.getCheckboxMarkup_({changeGroupId, htmlFilePath, isCheckable, numScreenshots: diffs.length})}
    ${diffs.length} ${headingPluralized} in ${htmlFilePath}
    ${this.getGoldenAndSnapshotLinkMarkup_({expectedTestPageUrl, actualTestPageUrl})}
    ${this.getReviewStatusMarkup_({changeGroupId, htmlFilePath, isCheckable, numScreenshots: diffs.length})}
  </summary>
  <div class="report-file__content">
    ${diffs.map((diff) => this.getDiffRowMarkup_({diff, changeGroupId, htmlFilePath, isCheckable})).join('\n')}
  </div>
</details>
`;
  }

  /**
   * @param {string} expectedTestPageUrl
   * @param {string} actualTestPageUrl
   * @return {string}
   * @private
   */
  getGoldenAndSnapshotLinkMarkup_({expectedTestPageUrl, actualTestPageUrl}) {
    const fragments = [];
    if (expectedTestPageUrl) {
      fragments.push(`<a href="${expectedTestPageUrl}">golden</a>`);
    }
    if (actualTestPageUrl) {
      fragments.push(`<a href="${actualTestPageUrl}">snapshot</a>`);
    }
    if (fragments.length === 0) {
      return '';
    }
    return `(${fragments.join(' | ')})`;
  }

  /**
   * @param {!ImageComparison} diff
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
    ${this.getDiffCellMarkup_('Golden', diff.expectedScreenshotImageUrl)}
    ${this.getDiffCellMarkup_('Diff', diff.diffImageUrl)}
    ${this.getDiffCellMarkup_('Snapshot', diff.actualScreenshotImageUrl)}
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

module.exports = ReportWriter;
