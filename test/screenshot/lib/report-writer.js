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

const mdcProto = require('../proto/types.pb').mdc.proto;
const {HbsTestPageData, ReportData, Screenshots, TestFile} = mdcProto;

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
      createDetailsElement: function(...allArgs) {
        const hbContext = this;
        const hbOptions = allArgs[allArgs.length - 1];
        const templateArgs = allArgs.slice(0, -1);
        return self.createTreeNode_({
          tagName: 'details',
          extraAttrs: ['data-fuck="yes"'],
          hbContext,
          hbOptions,
          templateArgs,
        });
      },
      createCheckboxElement: function(...allArgs) {
        const hbContext = this;
        const hbOptions = allArgs[allArgs.length - 1];
        const templateArgs = allArgs.slice(0, -1);
        return self.createTreeNode_({
          tagName: 'input',
          extraAttrs: ['type="checkbox"', 'data-review-status="unreviewed"'],
          hbContext,
          hbOptions,
          templateArgs,
        });
      },
      createApprovalStatusElement: function(...allArgs) {
        const hbContext = this;
        const templateArgs = allArgs.slice(0, -1);
        return self.createTreeNode_({
          tagName: 'span',
          extraAttrs: ['data-review-status="unreviewed"'],
          hbContext,
          hbOptions: {fn: () => new Handlebars.SafeString('unreviewed')},
          templateArgs,
        });
      },
    };

    for (const [name, helper] of Object.entries(helpers)) {
      Handlebars.registerHelper(name, helper);
    }
  }

  /**
   * @param {string} tagName
   * @param {!Array<string>=} extraAttrs
   * @param extraArgs
   * @param {!Object} hbContext
   * @param {{fn: function(context: !Object): !SafeString}} hbOptions
   * @param {!Array<string>} templateArgs
   * @return {!SafeString}
   * @private
   */
  createTreeNode_({tagName, extraAttrs = [], hbContext, hbOptions, templateArgs}) {
    const [
      baseClassName, hiddenClassName, isVisible,
      collectionType, htmlFilePath, userAgentAlias,
    ] = templateArgs;

    const classNames = [baseClassName];
    const attributes = [...extraAttrs];

    if (tagName === 'input') {
      if (isVisible) {
        attributes.push('checked');
      } else {
        classNames.push(hiddenClassName);
      }
    }
    if (tagName === 'details') {
      if (isVisible) {
        attributes.push('open');
      }
    }

    attributes.push(`data-collection-type="${collectionType}"`);
    if (htmlFilePath) {
      attributes.push(`data-html-file-path="${htmlFilePath}"`);
    }
    if (userAgentAlias) {
      attributes.push(`data-user-agent-alias="${userAgentAlias}"`);
    }

    let markup = `<${tagName} class="${classNames.join(' ')}" ${attributes.join(' ')}>${hbOptions.fn(hbContext)}`;
    if (!['input'].includes(tagName)) {
      markup += `</${tagName}>`;
    }

    return new Handlebars.SafeString(markup);
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

    // We can save ~5 MiB by stripping out data that can be recomputed.
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
}

module.exports = ReportWriter;
