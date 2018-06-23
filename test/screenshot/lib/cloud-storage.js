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

const Duration = require('./duration');
const GitRepo = require('./git-repo');
const GoogleCloudStorage = require('@google-cloud/storage');
const LocalStorage = require('./local-storage');
const ProcessManager = require('../lib/process-manager');
const {ExitCode, GCS_BUCKET} = require('../lib/constants');

/** Maximum number of times to retry a failed HTTP request. */
const API_MAX_RETRIES = 5;

/** Maximum amount of time to wait for the GCS API to fire a "finish" event after it fires a "response" event. */
const API_FINISH_EVENT_TIMEOUT_DURATION = Duration.minutes(10);

const MDC_GCS_CREDENTIALS = process.env.MDC_GCS_CREDENTIALS;
const USERNAME = process.env.USER || process.env.USERNAME;

/**
 * A wrapper around the Google Cloud Storage API.
 */
class CloudStorage {
  constructor() {
    if (!MDC_GCS_CREDENTIALS) {
      console.error(`
ERROR: Required environment variable 'MDC_GCS_CREDENTIALS' is not set.

Please add the following to your ~/.bash_profile or ~/.bashrc file:

    export MDC_GCS_CREDENTIALS=$(< path/to/gcp-credentials.json)

Credentials can be found on the GCP Service Accounts page:
https://console.cloud.google.com/iam-admin/serviceaccounts?project=material-components-web
`);
      process.exit(ExitCode.MISSING_ENV_VAR);
    }

    /**
     * @type {!Object}
     * @private
     */
    this.gcsCredentials_ = JSON.parse(MDC_GCS_CREDENTIALS);

    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();

    /**
     * @type {!Object<string, !Bucket>}
     * @private
     */
    this.gcsBucketCache_ = {};

    /**
     * @type {!ProcessManager}
     * @private
     */
    this.processManager_ = new ProcessManager();
  }

  /**
   * @return {!Bucket}
   * @private
   */
  getGcsBucket_() {
    const name = GCS_BUCKET;

    if (!this.gcsBucketCache_[name]) {
      const gcs = new GoogleCloudStorage({
        credentials: this.gcsCredentials_,
      });
      this.gcsBucketCache_[name] = gcs.bucket(name);
    }

    return this.gcsBucketCache_[name];
  }

  /**
   * Generates a unique directory path for a batch of uploaded files.
   * @return {!Promise<string>}
   */
  async generateUniqueUploadDir() {
    const {year, month, day, hour, minute, second, ms} = this.getUtcDateTime_();
    return `${USERNAME}/${year}/${month}/${day}/${hour}_${minute}_${second}_${ms}`;
  }

  /**
   * @param {string} baseUploadDir
   * @return {!Promise<void>}
   */
  async uploadAllAssets(baseUploadDir) {
    return new Promise(async (resolve, reject) => {
      /** @type {!ChildProcessSpawnResult} */
      const gsutilProcess = await this.spawnGsutilUploadProcess_(baseUploadDir);

      /** @type {number} */
      const exitCode = gsutilProcess.status;

      console.log('');

      if (exitCode === 0) {
        resolve();
      } else {
        reject(new Error(`gsutil processes exited with code ${exitCode}`));
      }
    });
  }

  /**
   * @param {string} baseUploadDir
   * @return {!Promise<!ChildProcessSpawnResult>}
   * @private
   */
  async spawnGsutilUploadProcess_(baseUploadDir) {
    const topLevelAssetFilesAndDirs = await this.localStorage_.fetchAllTopLevelAssetFileAndDirPaths();
    const cmd = 'gsutil';
    const args = [
      '-m', 'cp', '-r', ...topLevelAssetFilesAndDirs, `gs://${GCS_BUCKET}/${baseUploadDir}/`,
    ];

    console.log(`${cmd} ${args.join(' ')}\n`);

    return this.processManager_.spawnChildProcessSync(cmd, args);
  }

  /**
   * @param {!UploadableFile} uploadableFile
   * @param {number=} retryCount
   * @return {!Promise<!UploadableFile>}
   */
  async uploadFile(uploadableFile, retryCount = 0) {
    const queueIndex = uploadableFile.queueIndex;
    const queueLength = uploadableFile.queueLength;
    const queueIndexStr = String(queueIndex + 1).padStart(String(queueLength).length, '0');
    const queuePosition = `${queueIndexStr} of ${queueLength}`;
    const gcsAbsoluteFilePath = uploadableFile.destinationAbsoluteFilePath;

    if (retryCount > API_MAX_RETRIES) {
      throw new Error(
        `Failed to upload file ${queuePosition} after ${API_MAX_RETRIES} retry attempts - ${gcsAbsoluteFilePath}`
      );
    }

    // Attaching Git metadata to the uploaded files makes it easier to track down their source.
    const gitCommitShort = await this.gitRepo_.getShortCommitHash();
    const gitBranchName = await this.gitRepo_.getBranchName();

    // Note: The GCS API mutates this object, so we need to create a new object every time we call the API.
    const fileOptions = {
      // Automatically set the file's HTTP `Content-Type` response header to the correct value.
      contentType: 'auto',

      // The nested `metadata` object is not a typo - it's required by the GCS `File#save()` API.
      metadata: {
        metadata: {
          'X-MDC-Git-Commit': gitCommitShort,
          'X-MDC-Git-Branch': gitBranchName,
        },
      },
    };


    const cloudFile = this.getGcsBucket_().file(gcsAbsoluteFilePath);
    const [cloudFileExists] = await cloudFile.exists();

    if (cloudFileExists) {
      console.warn([
        `WARNING: GCS file ${queuePosition} already exists - ${gcsAbsoluteFilePath}`,
        'This is a bug in the screenshot testing logic. Tell acdvorak to fix it.',
        'The file will NOT be overwritten. Continuing.',
      ].join('\n'));
      return this.handleUploadSuccess_(uploadableFile);
    }

    const uploadPromise = new Promise(((resolve, reject) => {
      console.log(`➡ Uploading file ${queuePosition} - ${gcsAbsoluteFilePath}`);

      let timer;

      cloudFile.createWriteStream(fileOptions)
        .on('error', (err) => reject(err))
        .on('finish', () => {
          clearTimeout(timer);
          resolve();
        })
        .on('response', () => {
          // Workaround for a bug in the Google Cloud Storage `File.createWriteStream()` API.
          //
          // If you send a lot of parallel upload requests to GCS, the 'finish' event is not always fired - even if the
          // file was successfully uploaded.
          //
          // A brief delay before resolving the promise allows us to:
          // 1. Avoid resolving the promise prematurely (e.g., if an 'error' event is fired after the 'response' event)
          // 2. Prevent Node.js from exiting prematurely (see https://stackoverflow.com/a/46916601/467582)
          timer = setTimeout(() => {
            console.warn([
              `WARNING: The GCS API did not fire a "finish" event for file ${queuePosition} - ${gcsAbsoluteFilePath}`,
              `after ${API_FINISH_EVENT_TIMEOUT_DURATION.toHuman()}.`,
              'This is a bug in GCS. The file has probably finished uploading.',
            ].join('\n'));
            resolve();
          }, API_FINISH_EVENT_TIMEOUT_DURATION.toMillis());
        })
        .end(uploadableFile.fileContent);
    }));

    return uploadPromise.then(
      () => this.handleUploadSuccess_(uploadableFile),
      (err) => this.handleUploadFailure_(uploadableFile, err, retryCount)
    );
  }

  /**
   * @param {!UploadableFile} uploadableFile
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  handleUploadSuccess_(uploadableFile) {
    uploadableFile.fileContent = null; // Free up memory
    const publicUrl = uploadableFile.publicUrl;
    const queueIndex = uploadableFile.queueIndex;
    const queueLength = uploadableFile.queueLength;
    const queueIndexStr = String(queueIndex + 1).padStart(String(queueLength).length, '0');
    console.log(`✔︎ Uploaded file ${queueIndexStr} of ${queueLength} - ${publicUrl}`);
    return Promise.resolve(uploadableFile);
  }

  /**
   * @param {!UploadableFile} uploadableFile
   * @param {*} err
   * @param {number} retryCount
   * @return {!Promise<*>}
   * @private
   */
  handleUploadFailure_(uploadableFile, err, retryCount) {
    const {publicUrl} = uploadableFile;
    uploadableFile.fileContent = null; // Free up memory
    const queueIndex = uploadableFile.queueIndex;
    const queueLength = uploadableFile.queueLength;
    console.error(`✗︎ FAILED to upload file ${queueIndex + 1} of ${queueLength} - ${publicUrl}:`);
    console.error(err);
    if (err.code >= 500 && err.code < 600) {
      console.error(`ERROR: GCP server returned HTTP ${err.code}. Retrying upload request...`);
      return this.uploadFile(uploadableFile, retryCount + 1);
    }
    return Promise.reject(err);
  }

  /**
   * Returns the date and time in UTC as a map of component parts. Each part value is padded with leading zeros.
   * @return {{year: string, month: string, day: string, hour: string, minute: string, second: string, ms: string}}
   * @private
   */
  getUtcDateTime_() {
    const pad = (number, length = 2) => String(number).padStart(length, '0');
    const date = new Date();

    return {
      year: pad(date.getUTCFullYear()),
      month: pad(date.getUTCMonth() + 1), // getUTCMonth() returns a zero-based value (e.g., January is `0`)
      day: pad(date.getUTCDate()),
      hour: pad(date.getUTCHours()),
      minute: pad(date.getUTCMinutes()),
      second: pad(date.getUTCSeconds()),
      ms: pad(date.getUTCMilliseconds(), 3),
    };
  }
}

module.exports = CloudStorage;
