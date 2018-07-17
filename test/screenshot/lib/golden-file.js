/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {GoldenScreenshot, GoldenSuite, TestFile} = mdcProto;

class GoldenFile {
  /**
   * @param {!mdc.proto.GoldenSuite=} suiteJson
   */
  constructor(suiteJson = GoldenSuite.create()) {
    /**
     * @type {!mdc.proto.GoldenSuite}
     * @private
     */
    this.suiteJson_ = JSON.parse(JSON.stringify(suiteJson)); // deep copy to avoid mutating shared state

    this.migrateToNewSyntax_();
  }

  migrateToNewSyntax_() {
    // Maintain backward compatibility with older camelCase golden JSON naming convention (pre-protobuf).
    for (const htmlFilePath of Object.keys(this.suiteJson_)) {
      if (!this.suiteJson_[htmlFilePath]['publicUrl']) {
        continue;
      }
      this.suiteJson_[htmlFilePath].public_url = this.suiteJson_[htmlFilePath]['publicUrl'];
      delete this.suiteJson_[htmlFilePath]['publicUrl'];
    }
  }

  /**
   * @param {string} htmlFilePath
   * @return {?mdc.proto.TestFile}
   */
  findHtmlFile(htmlFilePath) {
    /** @type {?GoldenPage} */
    const goldenPage = this.suiteJson_[htmlFilePath];
    if (!goldenPage) {
      return null;
    }

    return TestFile.create({
      relative_path: htmlFilePath,
      public_url: goldenPage.public_url,
    });
  }

  /**
   * @param {string} htmlFilePath
   * @param {string} userAgentAlias
   * @return {?string}
   */
  getScreenshotImageUrl({htmlFilePath, userAgentAlias}) {
    userAgentAlias = String(userAgentAlias);
    return this.suiteJson_[htmlFilePath] ? this.suiteJson_[htmlFilePath].screenshots[userAgentAlias] : null;
  }

  /**
   * @param {!mdc.proto.GoldenScreenshot} goldenScreenshot
   */
  setScreenshotImageUrl(goldenScreenshot) {
    const htmlFilePath = goldenScreenshot.html_file_path;
    const htmlFileUrl = goldenScreenshot.html_file_url;
    const userAgentAlias = goldenScreenshot.user_agent_alias;
    const screenshotImageUrl = goldenScreenshot.screenshot_image_url;

    if (!this.suiteJson_[htmlFilePath]) {
      this.suiteJson_[htmlFilePath] = {
        public_url: htmlFileUrl,
        screenshots: {},
      };
    }

    this.suiteJson_[htmlFilePath].screenshots[userAgentAlias] = screenshotImageUrl;
  }

  /**
   * @param {string} htmlFilePath
   * @param {string} userAgentAlias
   */
  removeScreenshotImageUrl({htmlFilePath, userAgentAlias}) {
    if (!this.suiteJson_[htmlFilePath]) {
      return;
    }

    delete this.suiteJson_[htmlFilePath].screenshots[userAgentAlias];

    if (Object.keys(this.suiteJson_[htmlFilePath].screenshots).length === 0) {
      delete this.suiteJson_[htmlFilePath];
    }
  }

  /**
   * @return {!Array<!mdc.proto.GoldenScreenshot>}
   */
  getGoldenScreenshots() {
    /** @type {!Array<!mdc.proto.GoldenScreenshot>} */
    const goldenScreenshots = [];

    /** @type {!Array<string>} */
    const htmlFilePaths = Object.keys(this.suiteJson_);

    for (const htmlFilePath of htmlFilePaths) {
      /** @type {!mdc.proto.GoldenPage} */
      const testPage = this.suiteJson_[htmlFilePath];
      const htmlFileUrl = testPage.public_url;

      for (const userAgentAlias of Object.keys(testPage.screenshots)) {
        const screenshotImageUrl = testPage.screenshots[userAgentAlias];

        // TODO(acdvorak): Document this hack
        const screenshotImagePath = screenshotImageUrl.replace(/.*\/spec\/mdc-/, 'spec/mdc-');

        goldenScreenshots.push(GoldenScreenshot.create({
          html_file_path: htmlFilePath,
          html_file_url: htmlFileUrl,
          user_agent_alias: userAgentAlias,
          screenshot_image_path: screenshotImagePath,
          screenshot_image_url: screenshotImageUrl,
        }));
      }
    }

    return goldenScreenshots;
  }

  toJSON() {
    // Deep copy to avoid mutating shared state
    return JSON.parse(JSON.stringify(this.suiteJson_));
  }
}

module.exports = GoldenFile;
