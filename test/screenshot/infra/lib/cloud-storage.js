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

const Cli = require('./cli');
const ProcessManager = require('../lib/process-manager');
const glob = require('glob');
const {GCS_BUCKET} = require('./constants');

/**
 * A wrapper around the Google Cloud Storage API.
 */
class CloudStorage {
  constructor() {
    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();

    /**
     * @type {!ProcessManager}
     * @private
     */
    this.processManager_ = new ProcessManager();
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<void>}
   */
  async uploadAllAssets(reportData) {
    await this.uploadDirectory_('asset files', reportData, reportData.meta.local_asset_base_dir);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<void>}
   */
  async uploadAllScreenshotImages(reportData) {
    await this.uploadDirectory_('screenshot images', reportData, reportData.meta.local_screenshot_image_base_dir);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<void>}
   */
  async uploadAllDiffImages(reportData) {
    await this.uploadDirectory_('image diffs', reportData, reportData.meta.local_diff_image_base_dir);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<void>}
   */
  async uploadDiffReport(reportData) {
    await this.uploadDirectory_('diff report', reportData, reportData.meta.local_report_base_dir);
  }

  /**
   * @param {string} noun
   * @param {!mdc.proto.ReportData} reportData
   * @param {string} localSourceDir
   * @return {!Promise<void>}
   * @private
   */
  async uploadDirectory_(noun, reportData, localSourceDir) {
    const isSourceDirEmpty = glob.sync('**/*', {cwd: localSourceDir, nodir: true}).length === 0;
    const isOffline = this.cli_.isOffline();
    if (isSourceDirEmpty || isOffline) {
      return;
    }

    console.log(`Uploading ${noun} to GCS...\n`);
    this.spawnGsutilUploadProcess_(reportData, localSourceDir);
    console.log('');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {string} localSourceDir
   * @return {!SpawnSyncReturns}
   * @private
   */
  spawnGsutilUploadProcess_(reportData, localSourceDir) {
    const removeTrailingSlash = (filePath) => filePath.replace(new RegExp('/+$'), '');

    // Normalize directory paths by removing trailing slashes
    const remoteTargetDir = removeTrailingSlash(reportData.meta.remote_upload_base_dir);
    localSourceDir = removeTrailingSlash(localSourceDir);

    const cmd = 'gsutil';
    const args = [
      '-m', // multi-thread (upload files in parallel)
      'cp', // copy
      '-r', // recursive
      `${localSourceDir}/*`,
      `gs://${GCS_BUCKET}/${remoteTargetDir}/`,
    ];

    return this.processManager_.spawnChildProcessSync(cmd, args);
  }
}

module.exports = CloudStorage;
