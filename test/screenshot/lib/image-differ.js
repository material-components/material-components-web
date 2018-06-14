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

const compareImages = require('resemblejs/compareImages');

/**
 * Computes the difference between two screenshot images and generates an image that highlights the pixels that changed.
 */
class ImageDiffer {
  constructor({imageCache}) {
    /**
     * @type {!ImageCache}
     * @private
     */
    this.imageCache_ = imageCache;
  }

  /**
   * @param {!RunReport} runReport
   * @param {!SnapshotSuiteJson} actualSuite
   * @param {!SnapshotSuiteJson} expectedSuite
   * @return {!Promise<!RunReport>}
   */
  async compareAllPages({
    runReport,
    actualSuite,
    expectedSuite,
  }) {
    const added = this.getAddedToSuite_({expectedSuite, actualSuite});
    const removed = this.getRemovedFromSuite_({expectedSuite, actualSuite, runReport});
    const skipped = this.getSkipped_({expectedSuite, actualSuite, runReport});
    const {diffs, unchanged} = await this.getChangedFromSuite_({expectedSuite, actualSuite});

    [added, removed, diffs, unchanged, skipped].forEach((array) => {
      array.sort(this.sortDiffs_);
    });

    return {
      diffs,
      added,
      removed,
      unchanged,
      skipped,
    };
  }

  /**
   * @param {!SnapshotSuiteJson} expectedSuite
   * @param {!SnapshotSuiteJson} actualSuite
   * @return {!Array<!ImageDiffJson>}
   * @private
   */
  getAddedToSuite_({expectedSuite, actualSuite}) {
    const added = [];

    for (const [htmlFilePath, actualPage] of Object.entries(actualSuite)) {
      const expectedPage = expectedSuite[htmlFilePath];
      added.push(...this.getAddedToPage_({expectedPage, actualPage, htmlFilePath}));
    }

    return added;
  }

  /**
   * @param {?SnapshotPageJson} expectedPage
   * @param {!SnapshotPageJson} actualPage
   * @param {string} htmlFilePath
   * @return {!Array<!ImageDiffJson>}
   * @private
   */
  getAddedToPage_({expectedPage, actualPage, htmlFilePath}) {
    const added = [];

    for (const [userAgentAlias, actualImageUrl] of Object.entries(actualPage.screenshots)) {
      if (expectedPage && expectedPage.screenshots[userAgentAlias]) {
        continue;
      }

      added.push({
        htmlFilePath,
        userAgentAlias,
        goldenPageUrl: null,
        snapshotPageUrl: actualPage.publicUrl,
        actualImageUrl,
        expectedImageUrl: null,
        diffImageBuffer: null,
        diffImageUrl: null,
      });
    }

    return added;
  }

  /**
   * @param {!SnapshotSuiteJson} expectedSuite
   * @param {!SnapshotSuiteJson} actualSuite
   * @param {!RunReport} runReport
   * @return {!Array<!ImageDiffJson>}
   * @private
   */
  getRemovedFromSuite_({expectedSuite, actualSuite, runReport}) {
    const removed = [];

    for (const [htmlFilePath, expectedPage] of Object.entries(expectedSuite)) {
      const actualPage = actualSuite[htmlFilePath];
      removed.push(...this.getRemovedFromPage_({expectedPage, actualPage, runReport, htmlFilePath}));
    }

    return removed;
  }

  /**
   * @param {!SnapshotPageJson} expectedPage
   * @param {?SnapshotPageJson} actualPage
   * @param {!RunReport} runReport
   * @param {string} htmlFilePath
   * @return {!Array<!ImageDiffJson>}
   * @private
   */
  getRemovedFromPage_({expectedPage, actualPage, runReport, htmlFilePath}) {
    const removed = [];

    for (const [userAgentAlias, expectedImageUrl] of Object.entries(expectedPage.screenshots)) {
      if (this.isRemovedFromPage_({runReport, actualPage, userAgentAlias, htmlFilePath})) {
        removed.push({
          htmlFilePath,
          userAgentAlias,
          goldenPageUrl: expectedPage.publicUrl,
          snapshotPageUrl: null,
          actualImageUrl: null,
          expectedImageUrl,
          diffImageBuffer: null,
          diffImageUrl: null,
        });
      }
    }

    return removed;
  }

  /**
   * @param {!RunReport} runReport
   * @param {?SnapshotPageJson} actualPage
   * @param {string} userAgentAlias
   * @param {string} htmlFilePath
   * @return {boolean}
   * @private
   */
  isRemovedFromPage_({
    runReport,
    actualPage,
    userAgentAlias,
    htmlFilePath,
  }) {
    if (actualPage && actualPage.screenshots[userAgentAlias]) {
      return false;
    }

    const isSkippedTestCase = runReport.runTarget.skippedTestCases.some((skippedTestCase) => {
      return skippedTestCase.htmlFile.destinationRelativeFilePath === htmlFilePath;
    });

    const isSkippedUserAgent = runReport.runTarget.skippedUserAgents.some((skippedUserAgent) => {
      return skippedUserAgent.alias === userAgentAlias;
    });

    if (isSkippedTestCase || isSkippedUserAgent) {
      return false;
    }

    return true;
  }

  /**
   * @param {!SnapshotSuiteJson} expectedSuite
   * @param {!SnapshotSuiteJson} actualSuite
   * @param {!RunReport} runReport
   * @return {!Array<!ImageDiffJson>}
   * @private
   */
  getSkipped_({expectedSuite, actualSuite, runReport}) {
    /** @type {!Array<!ImageDiffJson>} */
    const skipped = [];

    const runTarget = runReport.runTarget;

    /** @type {!Array<!UploadableTestCase>} */
    const allTestCases = [].concat(runTarget.runnableTestCases, runTarget.skippedTestCases);

    /** @type {!Array<!CbtUserAgent>} */
    const allUserAgents = [].concat(runTarget.runnableUserAgents, runTarget.skippedUserAgents);

    allTestCases.forEach((testCase) => {
      allUserAgents.forEach((userAgent) => {
        const htmlFilePath = testCase.htmlFile.destinationRelativeFilePath;
        const userAgentAlias = userAgent.alias;

        if (actualSuite[htmlFilePath] && actualSuite[htmlFilePath].screenshots[userAgentAlias]) {
          return;
        }

        const expectedPage = expectedSuite[htmlFilePath];
        const goldenPageUrl = expectedPage ? expectedPage.publicUrl : null;
        const expectedImageUrl = expectedPage ? expectedPage.screenshots[userAgentAlias] : null;

        skipped.push({
          htmlFilePath,
          userAgentAlias,
          goldenPageUrl,
          snapshotPageUrl: null,
          actualImageUrl: null,
          expectedImageUrl,
          diffImageBuffer: null,
          diffImageUrl: null,
        });
      });
    });

    return skipped;
  }

  /**
   * @param {!SnapshotSuiteJson} expectedSuite
   * @param {!SnapshotSuiteJson} actualSuite
   * @return {!Promise<{diffs: !Array<!ImageDiffJson>, unchanged: !Array<!ImageDiffJson>}>}
   * @private
   */
  async getChangedFromSuite_({expectedSuite, actualSuite}) {
    /** @type {!Array<!ImageDiffJson>} */
    const diffs = [];

    /** @type {!Array<!ImageDiffJson>} */
    const unchanged = [];

    /** @type {!Array<!Promise<!Array<!ImageDiffJson>>>} */
    const pageComparisonPromises = [];

    for (const [htmlFilePath, actualPage] of Object.entries(actualSuite)) {
      // HTML file is not present in `golden.json` on `master`
      const expectedPage = expectedSuite[htmlFilePath];
      if (!expectedPage) {
        continue;
      }

      pageComparisonPromises.push(
        this.compareOnePage_({
          htmlFilePath,
          goldenPageUrl: expectedPage.publicUrl,
          snapshotPageUrl: actualPage.publicUrl,
          actualPage,
          expectedPage,
        })
      );
    }

    // Flatten the array of arrays
    const pageComparisonResults = [].concat(...(await Promise.all(pageComparisonPromises)));

    pageComparisonResults.forEach((diffResult) => {
      if (diffResult.diffImageBuffer) {
        diffs.push(diffResult);
      } else {
        unchanged.push(diffResult);
      }
    });

    return {diffs, unchanged};
  }

  /**
   * @param {string} htmlFilePath
   * @param {string} goldenPageUrl
   * @param {string} snapshotPageUrl
   * @param {!SnapshotPageJson} expectedPage
   * @param {!SnapshotPageJson} actualPage
   * @return {!Promise<!Array<!ImageDiffJson>>}
   * @private
   */
  async compareOnePage_({
    htmlFilePath,
    goldenPageUrl,
    snapshotPageUrl,
    actualPage,
    expectedPage,
  }) {
    /** @type {!Array<!Promise<!ImageDiffJson>>} */
    const imagePromises = [];

    const actualScreenshots = actualPage.screenshots;
    const expectedScreenshots = expectedPage.screenshots;

    for (const [userAgentAlias, actualImageUrl] of Object.entries(actualScreenshots)) {
      // Screenshot image for this browser is not present in `golden.json` on `master`
      const expectedImageUrl = expectedScreenshots[userAgentAlias];
      if (!expectedImageUrl) {
        continue;
      }

      imagePromises.push(
        this.compareOneImage_({actualImageUrl, expectedImageUrl})
          .then(
            (diffImageBuffer) => ({
              htmlFilePath,
              userAgentAlias,
              goldenPageUrl,
              snapshotPageUrl,
              expectedImageUrl,
              actualImageUrl,
              diffImageUrl: null, // populated by `Controller`
              diffImageBuffer,
            }),
            (err) => Promise.reject(err)
          )
      );
    }

    return Promise.all(imagePromises);
  }

  /**
   * @param {string} actualImageUrl
   * @param {string} expectedImageUrl
   * @return {!Promise<?Buffer>}
   * @private
   */
  async compareOneImage_({
    actualImageUrl,
    expectedImageUrl,
  }) {
    console.log(`➡ Comparing snapshot to golden: "${actualImageUrl}" vs. "${expectedImageUrl}"...`);

    const [actualImageBuffer, expectedImageBuffer] = await Promise.all([
      this.imageCache_.getImageBuffer(actualImageUrl),
      this.imageCache_.getImageBuffer(expectedImageUrl),
    ]);

    const diffResult = await this.computeDiff_({
      actualImageBuffer,
      expectedImageBuffer,
    });

    if (diffResult.rawMisMatchPercentage < 0.01) {
      console.log(`✔ No diffs found for "${actualImageUrl}"!`);
      return null;
    }

    console.log(`✗︎ Image "${actualImageUrl}" has changed!`);
    return diffResult.getBuffer();
  }

  /**
   * @param {!Buffer} actualImageBuffer
   * @param {!Buffer} expectedImageBuffer
   * @return {!Promise<!ResembleApiComparisonResult>}
   * @private
   */
  async computeDiff_({
    actualImageBuffer,
    expectedImageBuffer,
  }) {
    const options = require('../resemble.json');
    return await compareImages(
      actualImageBuffer,
      expectedImageBuffer,
      options
    );
  }

  /**
   * @param {!ImageDiffJson} a
   * @param {!ImageDiffJson} b
   * @return {number}
   */
  sortDiffs_(a, b) {
    return a.htmlFilePath.localeCompare(b.htmlFilePath, 'en-US') ||
      a.userAgentAlias.localeCompare(b.userAgentAlias, 'en-US');
  }
}

module.exports = ImageDiffer;
