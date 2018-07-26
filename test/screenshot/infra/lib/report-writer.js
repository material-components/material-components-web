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

const mdcProto = require('../proto/mdc.pb').mdc.proto;
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
    const goldenFileRelativePath = 'golden.json';

    const templateFileAbsolutePath = path.join(meta.local_asset_base_dir, templateFileRelativePath);
    const htmlFileAbsolutePath = path.join(meta.local_report_base_dir, htmlFileRelativePath);
    const jsonFileAbsolutePath = path.join(meta.local_report_base_dir, jsonFileRelativePath);
    const goldenFileAbsolutePath = path.join(meta.local_asset_base_dir, goldenFileRelativePath);

    const reportHtmlFile = TestFile.create({
      relative_path: htmlFileRelativePath,
      absolute_path: htmlFileAbsolutePath,
      public_url: this.getPublicUrl_(htmlFileRelativePath, meta),
    });

    const reportJsonFile = TestFile.create({
      relative_path: jsonFileRelativePath,
      absolute_path: jsonFileAbsolutePath,
      public_url: this.getPublicUrl_(jsonFileRelativePath, meta),
    });

    const goldenJsonFile = TestFile.create({
      relative_path: goldenFileRelativePath,
      absolute_path: goldenFileAbsolutePath,
      public_url: this.getPublicUrl_(goldenFileRelativePath, meta),
    });

    meta.report_html_file = reportHtmlFile;
    meta.report_json_file = reportJsonFile;
    meta.golden_json_file = goldenJsonFile;

    const jsonFileContent = this.stringify_(slimReportData);
    await this.localStorage_.writeTextFile(jsonFileAbsolutePath, jsonFileContent);

    const htmlFileContent = await this.generateHtml_(fullReportData, templateFileAbsolutePath);
    await this.localStorage_.writeTextFile(htmlFileAbsolutePath, htmlFileContent);

    // Copy all image and report files to the assets dir for offline mode.
    await this.localStorage_.copy(meta.local_report_base_dir, meta.local_asset_base_dir);
    await this.localStorage_.copy(meta.local_screenshot_image_base_dir, meta.local_asset_base_dir);
    await this.localStorage_.copy(meta.local_diff_image_base_dir, meta.local_asset_base_dir);
  }

  /** @private */
  registerHelpers_() {
    // Handlebars sets `this` to the current context, so we need to use functions instead of lambdas.
    const self = this;

    const helpers = {
      getPageTitle: function() {
        return self.getPageTitle_(this);
      },
      msToHumanShort: function(...args) {
        const [ms] = args;
        const [numDecimalDigits] = args.slice(1, args.length - 1);
        return Duration.millis(ms).toHumanShort(numDecimalDigits);
      },
      formatNumber: function(int) {
        return Number(int).toLocaleString();
      },
      forEachTestPage: function(screenshotPageMap, hbsOptions) {
        return self.forEachTestPage_(screenshotPageMap, hbsOptions.fn);
      },
      getHtmlFileLinks: function() {
        return self.getHtmlFileLinks_(this);
      },
      getDiffBaseMarkup: function(diffBase, meta) {
        return self.getDiffBaseMarkup_(diffBase, meta);
      },
      getLocalChangesMarkup: function(gitStatus) {
        return self.getLocalChangesMarkup_(gitStatus);
      },
      getFilteredUrlCountMarkup: function(screenshots) {
        return self.getFilteredCountMarkup_(
          screenshots.runnable_test_page_urls.length,
          screenshots.skipped_test_page_urls.length
        );
      },
      getFilteredBrowserIconsMarkup: function(userAgents) {
        return self.getFilteredBrowserIconsMarkup_(
          userAgents.runnable_user_agents,
          userAgents.skipped_user_agents
        );
      },
      getFilteredScreenshotCountMarkup: function(screenshots) {
        return self.getFilteredCountMarkup_(
          screenshots.runnable_screenshot_keys.length,
          screenshots.skipped_screenshot_keys.length
        );
      },
      createDetailsElement: function(...allArgs) {
        const hbContext = this;
        const hbOptions = allArgs[allArgs.length - 1];
        const templateArgs = allArgs.slice(0, -1);
        return self.createTreeNode_({
          tagName: 'details',
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
      baseClassName, hiddenClassName, numScreenshots, isVisible,
      collectionType, htmlFilePath, userAgentAlias,
    ] = templateArgs;

    const classNames = [baseClassName];
    const attributes = [...extraAttrs];

    if (tagName === 'input') {
      if (isVisible && numScreenshots > 0) {
        attributes.push('checked');
      } else {
        classNames.push(hiddenClassName);
      }
    } else if (tagName === 'details') {
      if (isVisible && numScreenshots > 0) {
        attributes.push('open');
      }
    } else {
      if (!isVisible || numScreenshots === 0) {
        classNames.push(hiddenClassName);
      }
    }

    attributes.push(`data-num-screenshots="${numScreenshots}"`);
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

  /** @private */
  registerPartials_() {
    const partialFilePaths = this.localStorage_.globFiles(path.join(TEST_DIR_RELATIVE_PATH, 'report/_*.hbs'));
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
   * @param {number} numRunnable
   * @param {number} numSkipped
   * @return {!SafeString}
   * @private
   */
  getFilteredCountMarkup_(numRunnable, numSkipped) {
    const numTotal = numRunnable + numSkipped;
    if (numSkipped > 0) {
      return new Handlebars.SafeString(`${numRunnable} of ${numTotal} (skipped ${numSkipped})`);
    }
    return new Handlebars.SafeString(numRunnable);
  }

  /**
   * @param {!Array<!mdc.proto.UserAgent>} runnableUserAgents
   * @param {!Array<!mdc.proto.UserAgent>} skippedUserAgents
   * @return {!SafeString}
   * @private
   */
  getFilteredBrowserIconsMarkup_(runnableUserAgents, skippedUserAgents) {
    /**
     * @param {!mdc.proto.UserAgent} userAgent
     * @return {string}
     */
    function getIconHtml(userAgent) {
      const title = userAgent.navigator ? userAgent.navigator.full_name : userAgent.alias;
      return `
<img src="${userAgent.browser_icon_url}" width="16" height="16" class="report-user-agent__icon" title="${title}">
`.trim();
    }

    const runnableHtml = runnableUserAgents.map(getIconHtml).join(' ');
    const numSkipped = skippedUserAgents.length;
    if (numSkipped > 0) {
      const skippedHtml = skippedUserAgents.map(getIconHtml).join(' ');
      return new Handlebars.SafeString(`${runnableHtml} (skipped ${skippedHtml})`);
    }
    return new Handlebars.SafeString(runnableHtml);
  }

  /**
   * @param {!mdc.proto.DiffBase} diffBase
   * @param {!mdc.proto.ReportMeta} meta
   * @return {!SafeString}
   * @private
   */
  getDiffBaseMarkup_(diffBase, meta) {
    if (diffBase.public_url) {
      return new Handlebars.SafeString(`<a href="${diffBase.public_url}">${diffBase.public_url}</a>`);
    }

    if (diffBase.local_file_path) {
      const localFilePathMarkup = diffBase.is_default_local_file
        ? `<a href="${meta.golden_json_file.public_url}">${diffBase.local_file_path}</a>`
        : diffBase.local_file_path
      ;
      return new Handlebars.SafeString(`${localFilePathMarkup} (local file)`);
    }

    const rev = diffBase.git_revision;
    if (rev) {
      const prMarkup = rev.pr_number
        ? `(PR <a href="${GITHUB_REPO_URL}/pull/${rev.pr_number}">#${rev.pr_number}</a>)`
        : '';

      if (rev.branch) {
        const branchDisplayName = rev.remote ? `${rev.remote}/${rev.branch}` : rev.branch;
        return new Handlebars.SafeString(`
<a href="${GITHUB_REPO_URL}/commit/${rev.commit}">${rev.commit.substr(0, 7)}</a>
on branch
<a href="${GITHUB_REPO_URL}/tree/${rev.branch}">${branchDisplayName}</a>
${prMarkup}
`);
      }

      if (rev.tag) {
        return new Handlebars.SafeString(`
<a href="${GITHUB_REPO_URL}/commit/${rev.commit}">${rev.commit.substr(0, 7)}</a>
on tag
<a href="${GITHUB_REPO_URL}/tree/${rev.tag}">${rev.tag}</a>
${prMarkup}
`);
      }

      if (rev.commit) {
        return new Handlebars.SafeString(`
<a href="${GITHUB_REPO_URL}/commit/${rev.commit}">${rev.commit.substr(0, 7)}</a>
${prMarkup}
`);
      }
    }

    const serialized = JSON.stringify({diffBase, meta}, null, 2);
    throw new Error(`Unable to generate markup for invalid diff source:\n${serialized}`);
  }

  /**
   * @param {!mdc.proto.GitStatus} gitStatus
   * @return {!SafeString}
   * @private
   */
  getLocalChangesMarkup_(gitStatus) {
    const fragments = [];
    const numUntracked = gitStatus.not_added.length;
    const numModified = gitStatus.files.length - numUntracked;

    if (numModified > 0) {
      fragments.push(`${numModified} locally modified file${numModified === 1 ? '' : 's'}`);
    }

    if (numUntracked > 0) {
      fragments.push(`${numUntracked} untracked file${numUntracked === 1 ? '' : 's'}`);
    }

    return new Handlebars.SafeString(fragments.length > 0 ? `(${fragments.join(', ')})` : '');
  }
}

module.exports = ReportWriter;
