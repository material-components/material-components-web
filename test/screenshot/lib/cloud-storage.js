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
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @return {!Promise<void>}
   */
  async uploadAllAssets(reportData) {
    await this.uploadDirectory_(reportData, reportData.meta.local_asset_base_dir);
  }

  /**
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @return {!Promise<void>}
   */
  async uploadAllScreenshots(reportData) {
    await this.uploadDirectory_(reportData, reportData.meta.local_screenshot_image_base_dir);
  }

  /**
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @return {!Promise<void>}
   */
  async uploadAllDiffs(reportData) {
    await this.uploadDirectory_(reportData, reportData.meta.local_diff_image_base_dir);
  }

  /**
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @param {string} localSourceDir
   * @return {!Promise<void>}
   * @private
   */
  async uploadDirectory_(reportData, localSourceDir) {
    const isSourceDirEmpty = glob.sync('**/*', {cwd: localSourceDir, nodir: true}).length === 0;
    const isOffline = !(await this.cli_.isOnline());
    if (isSourceDirEmpty || isOffline) {
      return;
    }

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
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @param {string} localSourceDir
   * @return {!Promise<!ChildProcessSpawnResult>}
   * @private
   */
  async spawnGsutilUploadProcess_(reportData, localSourceDir) {
    const cmd = 'gsutil';
    const args = [
      '-m', // multi-thread (upload files in parallel)
      'cp', // copy
      '-r', // recursive
      localSourceDir,
      `gs://${this.cli_.gcsBucket}/${reportData.meta.remote_upload_base_dir}`,
    ];

    console.log(`${cmd} ${args.join(' ')}\n`);

    return this.processManager_.spawnChildProcessSync(cmd, args);
  }
}

module.exports = CloudStorage;
