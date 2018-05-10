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

const fs = require('fs');
const glob = require('glob');
const jimp = require('jimp');
const path = require('path');
const request = require('request-promise-native');
const stringify = require('json-stable-stringify');
const util = require('util');

const CbtUserAgent = require('./cbt-user-agent');
const CliArgParser = require('./cli-arg-parser');
const Screenshot = require('./screenshot');
const {Storage, UploadableFile, UploadableTestCase} = require('./storage');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

/**
 * High-level screenshot workflow controller that provides composable async methods to:
 * 1. Upload files to GCS
 * 2. Capture screenshots with CBT
 * 3. [COMING SOON] Update local golden.json with new screenshot URLs
 * 4. [COMING SOON] Diff captured screenshots against existing golden.json
 */
class Controller {
  /**
   * @param {string} sourceDir Relative or absolute path to the local `test/screenshot/` directory.
   */
  constructor({sourceDir}) {
    /**
     * @type {string}
     * @private
     */
    this.sourceDir_ = sourceDir;

    /**
     * @type {!Storage}
     * @private
     */
    this.storage_ = new Storage();

    /**
     * Unique timestamped directory path to prevent collisions between developers.
     * @type {?string}
     * @private
     */
    this.baseUploadDir_ = null;
  }

  async initialize() {
    this.baseUploadDir_ = await this.storage_.generateUniqueUploadDir();
    this.cliArgs_ = new CliArgParser();
  }

  /**
   * @return {!Promise<!Array<!UploadableTestCase>>}
   */
  async uploadAllAssets() {
    /** @type {!Array<!UploadableTestCase>} */
    const testCases = [];

    /**
     * Relative paths of all asset files (HTML, CSS, JS) that will be uploaded.
     * @type {!Array<string>}
     */
    const assetFileRelativePaths = glob.sync('**/*', {cwd: this.sourceDir_, nodir: true});

    /** @type {!Array<!Promise<!UploadableFile>>} */
    const uploadPromises = assetFileRelativePaths.map((assetFileRelativePath) => {
      return this.uploadOneAsset_(assetFileRelativePath, testCases);
    });

    return Promise.all(uploadPromises)
      .then(
        () => {
          this.logUploadAllAssetsSuccess_(testCases);
          return testCases;
        },
        (err) => Promise.reject(err)
      );
  }

  /**
   * @param {string} assetFileRelativePath
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  async uploadOneAsset_(assetFileRelativePath, testCases) {
    const assetFile = new UploadableFile({
      destinationParentDirectory: this.baseUploadDir_,
      destinationRelativeFilePath: assetFileRelativePath,
      fileContent: await readFileAsync(`${this.sourceDir_}/${assetFileRelativePath}`),
    });

    return this.storage_.uploadFile(assetFile)
      .then(
        () => this.handleUploadOneAssetSuccess_(assetFile, testCases),
        (err) => this.handleUploadOneAssetFailure_(err)
      );
  }

  /**
   * @param {!UploadableFile} assetFile
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  async handleUploadOneAssetSuccess_(assetFile, testCases) {
    const relativePath = assetFile.destinationRelativeFilePath;
    const isHtmlFile = relativePath.endsWith('.html');
    const isIncluded =
      this.cliArgs_.includeUrlPatterns.length === 0 ||
      this.cliArgs_.includeUrlPatterns.some((pattern) => pattern.test(relativePath));
    const isExcluded = this.cliArgs_.excludeUrlPatterns.some((pattern) => pattern.test(relativePath));
    const shouldInclude = isIncluded && !isExcluded;

    if (isHtmlFile && shouldInclude) {
      testCases.push(new UploadableTestCase({htmlFile: assetFile}));
    }

    return assetFile;
  }

  /**
   * @param {!T} err
   * @return {!Promise<!T>}
   * @template T
   * @private
   */
  async handleUploadOneAssetFailure_(err) {
    return Promise.reject(err);
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!Array<!UploadableTestCase>>}
   */
  async captureAllPages(testCases) {
    const capturePromises = testCases.map((testCase) => {
      return this.captureOnePage_(testCase);
    });

    return Promise.all(capturePromises)
      .then(
        () => {
          this.logCaptureAllPagesSuccess_(testCases);
          return testCases;
        },
        (err) => Promise.reject(err)
      );
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @return {!Promise<!Array<!UploadableFile>>}
   * @private
   */
  async captureOnePage_(testCase) {
    return Screenshot
      .captureOneUrl(testCase.htmlFile.publicUrl)
      .then(
        (cbtInfo) => this.handleCapturePageSuccess_(testCase, cbtInfo),
        (err) => this.handleCapturePageFailure_(testCase, err)
      );
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {!Object} cbtScreenshotInfo
   * @return {!Promise<!Array<!UploadableFile>>}
   * @private
   */
  async handleCapturePageSuccess_(testCase, cbtScreenshotInfo) {
    // We don't use CBT's screenshot versioning features, so there should only ever be one version.
    // Each "result" is an individual browser screenshot for a single URL.
    return Promise.all(cbtScreenshotInfo.versions[0].results.map((cbtResult) => {
      return this.uploadScreenshotImage_(testCase, cbtResult);
    }));
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {!T} err
   * @return {!Promise<!T>}
   * @template T
   * @private
   */
  async handleCapturePageFailure_(testCase, err) {
    console.error('\n\n\nERROR capturing screenshot with CrossBrowserTesting:\n\n');
    console.error(`  - ${testCase.htmlFile.publicUrl}`);
    console.error(err);
    return Promise.reject(err);
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {!Object} cbtResult
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  async uploadScreenshotImage_(testCase, cbtResult) {
    const osApiName = cbtResult.os.api_name;
    const browserApiName = cbtResult.browser.api_name;

    const imageName = `${osApiName}_${browserApiName}.png`.toLowerCase().replace(/[^\w.]+/g, '');
    const imageData = await this.downloadImage_(cbtResult.images.chromeless);
    const imageFile = new UploadableFile({
      destinationParentDirectory: this.baseUploadDir_,
      destinationRelativeFilePath: `${testCase.htmlFile.destinationRelativeFilePath}.${imageName}`,
      fileContent: imageData,
      userAgent: await CbtUserAgent.fetchBrowserByApiName(osApiName, browserApiName),
    });

    testCase.screenshotImageFiles.push(imageFile);

    return this.storage_.uploadFile(imageFile);
  }

  /**
   * @param {string} uri
   * @return {!Promise<!Buffer>}
   * @private
   */
  async downloadImage_(uri) {
    // For binary data, set `encoding: null` to return the response body as a `Buffer` instead of a `string`.
    // https://github.com/request/request#requestoptions-callback
    return request({uri, encoding: null})
      .then(
        (body) => this.autoCropImage_(body),
        (err) => {
          console.error(`FAILED to download "${uri}"`);
          return Promise.reject(err);
        }
      );
  }

  /**
   * @param {!Buffer} imageData Uncropped image buffer
   * @return {!Promise<!Buffer>} Cropped image buffer
   * @private
   */
  async autoCropImage_(imageData) {
    return jimp.read(imageData)
      .then(
        (image) => {
          return new Promise((resolve, reject) => {
            const {rows, cols} = this.getCropMatches_(image);
            const cropRect = this.getCropRect_({rows, cols});
            const {x, y, w, h} = cropRect;

            image
              .crop(x, y, w, h)
              .getBuffer(jimp.MIME_PNG, (err, buffer) => {
                return err ? reject(err) : resolve(buffer);
              })
            ;
          });
        },
        (err) => Promise.reject(err)
      );
  }

  getCropMatches_(image) {
    const trimColors = [0x333333FF];
    const rows = [];
    const cols = [];

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      if (!rows[y]) {
        rows[y] = [];
      }
      if (!cols[x]) {
        cols[x] = [];
      }
      const isMatch = trimColors.includes(image.getPixelColor(x, y));
      rows[y][x] = isMatch;
      cols[x][y] = isMatch;
    });

    return {rows, cols};
  }

  getCropRect_({rows, cols}) {
    const HIGH_MATCH_PERCENTAGE = 0.95;
    const LOW_MATCH_PERCENTAGE = 0.67;

    const amounts = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };

    for (const row of rows) {
      if (matchPercentage(row) > HIGH_MATCH_PERCENTAGE) {
        amounts.top++;
      } else {
        break;
      }
    }

    for (const row of rows.concat().reverse()) {
      if (matchPercentage(row) > HIGH_MATCH_PERCENTAGE) {
        amounts.bottom++;
      } else {
        break;
      }
    }


    for (const col of cols) {
      if (matchPercentage(skipCroppedRows(col)) > HIGH_MATCH_PERCENTAGE) {
        amounts.left++;
      } else {
        break;
      }
    }

    /* eslint-disable max-len */
    for (const col of cols.concat().reverse()) {
      // Use a lower match percentage on the right side of the image in order to crop Edge popovers:
      // https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/05/08/20_40_45_142/c6cc25f87/mdc-button/classes/baseline.html.win10e17_edge17.png
      if (matchPercentage(skipCroppedRows(col)) > LOW_MATCH_PERCENTAGE) {
        amounts.right++;
      } else {
        break;
      }
    }
    /* eslint-enable max-len */

    return {
      x: amounts.left,
      y: amounts.top,
      w: cols.length - amounts.right - amounts.left,
      h: rows.length - amounts.bottom - amounts.top,
    };

    function skipCroppedRows(col) {
      const startRowIndex = amounts.top;
      const endRowIndex = rows.length - amounts.bottom;
      return col.slice(startRowIndex, endRowIndex);
    }

    function matchPercentage(matchList) {
      const numMatchingPixelsInRow = matchList.filter((isMatch) => isMatch).length;
      return numMatchingPixelsInRow / matchList.length;
    }
  }

  /**
   * @param {!Jimp} jimpImage
   * @return {{rows: !Array<!Array<boolean>, cols: !Array<!Array<boolean>}}
   * @private
   */
  getCropMatches_(jimpImage) {
    const trimColors = [0x333333FF];
    const rows = [];
    const cols = [];

    jimpImage.scan(0, 0, jimpImage.bitmap.width, jimpImage.bitmap.height, (x, y) => {
      if (!rows[y]) {
        rows[y] = [];
      }
      if (!cols[x]) {
        cols[x] = [];
      }
      const isMatch = trimColors.includes(jimpImage.getPixelColor(x, y));
      rows[y][x] = isMatch;
      cols[x][y] = isMatch;
    });

    return {rows, cols};
  }

  /**
   * @param {!Array<!Array<boolean>>} rows
   * @param {!Array<!Array<boolean>>} cols
   * @return {{x: number, y: number, w: number, h: number}}
   * @private
   */
  getCropRect_({rows, cols}) {
    const HIGH_MATCH_PERCENTAGE = 0.95;
    const LOW_MATCH_PERCENTAGE = 0.67;

    const amounts = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };

    for (const row of rows) {
      if (matchPercentage(row) > HIGH_MATCH_PERCENTAGE) {
        amounts.top++;
      } else {
        break;
      }
    }

    // `reverse()` mutates the array in-place, so we call `concat()` first to create a copy of the array.
    for (const row of rows.concat().reverse()) {
      if (matchPercentage(row) > HIGH_MATCH_PERCENTAGE) {
        amounts.bottom++;
      } else {
        break;
      }
    }


    for (const col of cols) {
      if (matchPercentage(skipCroppedRows(col)) > HIGH_MATCH_PERCENTAGE) {
        amounts.left++;
      } else {
        break;
      }
    }

    /* eslint-disable max-len */
    // `reverse()` mutates the array in-place, so we call `concat()` first to create a copy of the array.
    for (const col of cols.concat().reverse()) {
      // Use a lower match percentage on the right side of the image in order to crop Edge popovers:
      // https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/05/08/20_40_45_142/c6cc25f87/mdc-button/classes/baseline.html.win10e17_edge17.png
      if (matchPercentage(skipCroppedRows(col)) > LOW_MATCH_PERCENTAGE) {
        amounts.right++;
      } else {
        break;
      }
    }
    /* eslint-enable max-len */

    return {
      x: amounts.left,
      y: amounts.top,
      w: cols.length - amounts.right - amounts.left,
      h: rows.length - amounts.bottom - amounts.top,
    };

    function skipCroppedRows(col) {
      const startRowIndex = amounts.top;
      const endRowIndex = rows.length - amounts.bottom;
      return col.slice(startRowIndex, endRowIndex);
    }

    function matchPercentage(matchList) {
      const numMatchingPixelsInRow = matchList.filter((isMatch) => isMatch).length;
      return numMatchingPixelsInRow / matchList.length;
    }
  }

  /**
   * Writes the given `testCases` to a `golden.json` file in `sourceDir_`.
   * If the file already exists, it will be overwritten.
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<{goldenFilePath:string, goldenData:!Object}>}
   */
  async updateGoldenJson(testCases) {
    const goldenData = {};

    testCases.forEach((testCase) => {
      const htmlFileKey = testCase.htmlFile.destinationRelativeFilePath;
      const htmlFileUrl = testCase.htmlFile.publicUrl;

      goldenData[htmlFileKey] = {
        publicUrl: htmlFileUrl,
        screenshots: {},
      };

      testCase.screenshotImageFiles.forEach((screenshotImageFile) => {
        const screenshotKey = screenshotImageFile.userAgent.alias;
        const screenshotUrl = screenshotImageFile.publicUrl;

        goldenData[htmlFileKey].screenshots[screenshotKey] = screenshotUrl;
      });
    });

    const goldenFilePath = path.join(this.sourceDir_, 'golden.json');
    const goldenFileContent = stringify(goldenData, {space: '  '}) + '\n';

    return writeFileAsync(goldenFilePath, goldenFileContent)
      .then(
        () => {
          console.log(`\n\nDONE updating "${goldenFilePath}"!\n\n`);
          return {goldenFilePath, goldenData};
        },
        (err) => Promise.reject(err)
      );
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @private
   */
  logUploadAllAssetsSuccess_(testCases) {
    const publicHtmlFileUrls = testCases.map((testCase) => testCase.htmlFile.publicUrl).sort();
    console.log('\n\nDONE uploading asset files to GCS!\n\n');
    console.log(publicHtmlFileUrls.join('\n'));
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @private
   */
  logCaptureAllPagesSuccess_(testCases) {
    console.log('\n\nDONE capturing screenshot images!\n\n');

    testCases.forEach((testCase) => {
      console.log(`${testCase.htmlFile.publicUrl}:`);
      testCase.screenshotImageFiles.forEach((screenshotImageFile) => {
        console.log(`  - ${screenshotImageFile.publicUrl}`);
      });
      console.log('');
    });
  }
}

module.exports = Controller;
