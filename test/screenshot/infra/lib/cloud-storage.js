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
  async uploadAllScreenshots(reportData) {
    await this.uploadDirectory_('screenshot images', reportData, reportData.meta.local_screenshot_image_base_dir);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<void>}
   */
  async uploadAllDiffs(reportData) {
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

    console.log(`\nUploading ${noun} to GCS...\n`);

    /** @type {!ChildProcessSpawnResult} */
    const gsutilProcess = await this.spawnGsutilUploadProcess_(reportData, localSourceDir);

    /** @type {number} */
    const exitCode = gsutilProcess.status;

    console.log('');

    if (exitCode !== 0) {
      throw new Error(`gsutil processes exited with code ${exitCode}`);
    }
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {string} localSourceDir
   * @return {!Promise<!ChildProcessSpawnResult>}
   * @private
   */
  async spawnGsutilUploadProcess_(reportData, localSourceDir) {
    const removeTrailingSlash = (filePath) => filePath.replace(new RegExp('/+$'), '');

    // Normalize directory paths by removing trailing slashes
    const remoteTargetDir = removeTrailingSlash(reportData.meta.remote_upload_base_dir);
    localSourceDir = removeTrailingSlash(localSourceDir);

    const cmd = 'gsutil';
    const args = [
      '-m', // multi-thread (upload files in parallel)w
      'cp', // copy
      '-r', // recursive
      `${localSourceDir}/*`,
      `gs://${GCS_BUCKET}/${remoteTargetDir}/`,
    ];

    return this.processManager_.spawnChildProcessSync(cmd, args);
  }
}

module.exports = CloudStorage;
