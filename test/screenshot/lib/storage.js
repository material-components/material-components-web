/**
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

const GitRepo = require('./git-repo');
const CloudStorage = require('@google-cloud/storage');

const GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH = process.env.MDC_GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH;
const GCLOUD_STORAGE_BUCKET_NAME = 'mdc-web-screenshot-tests';
const GCLOUD_STORAGE_BASE_URL = `https://storage.googleapis.com/${GCLOUD_STORAGE_BUCKET_NAME}/`;
const USERNAME = process.env.USER || process.env.USERNAME;

/**
 * A wrapper around the Google Cloud Storage API.
 */
class Storage {
  constructor() {
    const cloudStorage = new CloudStorage({
      credentials: require(GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH),
    });
    this.storageBucket_ = cloudStorage.bucket(GCLOUD_STORAGE_BUCKET_NAME);
    this.mdcGitRepo_ = new GitRepo();
  }

  /**
   * Generates a unique directory path for a batch of uploaded files.
   * @return {!Promise<string>}
   */
  async generateUniqueUploadDir() {
    const gitCommitShort = await this.mdcGitRepo_.getShortCommitHash();
    const {year, month, day, hour, minute, second, ms} = this.getUtcDateTime_();
    return `${USERNAME}/${year}/${month}/${day}/${hour}_${minute}_${second}_${ms}/${gitCommitShort}`;
  }

  /**
   * @param {!UploadableFile} uploadableFile
   * @return {!Promise<!UploadableFile>}
   */
  async uploadFile(uploadableFile) {
    // Attaching Git metadata to the uploaded files makes it easier to track down their source.
    const gitCommitShort = await this.mdcGitRepo_.getShortCommitHash();
    const gitBranchName = await this.mdcGitRepo_.getBranchName();

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

    console.log(`➡ Uploading ${uploadableFile.destinationAbsoluteFilePath} ...`);

    const cloudFile = this.storageBucket_.file(uploadableFile.destinationAbsoluteFilePath);
    return cloudFile
      .save(uploadableFile.fileContent, fileOptions)
      .then(
        () => this.handleUploadSuccess_(uploadableFile),
        (err) => this.handleUploadFailure_(uploadableFile, err)
      );
  }

  /**
   * @param {!UploadableFile} uploadableFile
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  handleUploadSuccess_(uploadableFile) {
    const publicUrl = `${GCLOUD_STORAGE_BASE_URL}${uploadableFile.destinationAbsoluteFilePath}`;
    uploadableFile.fileContent = null; // Free up memory
    uploadableFile.publicUrl = publicUrl;
    console.log(`✔︎ Uploaded ${publicUrl}`);
    return Promise.resolve(uploadableFile);
  }

  /**
   * @param {!UploadableFile} uploadableFile
   * @param {*} err
   * @return {!Promise<*>}
   * @private
   */
  handleUploadFailure_(uploadableFile, err) {
    const publicUrl = `${GCLOUD_STORAGE_BASE_URL}${uploadableFile.destinationAbsoluteFilePath}`;
    uploadableFile.fileContent = null; // Free up memory
    console.error(`✗︎ FAILED to upload ${publicUrl}:`);
    console.error(err);
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

/**
 * A file to be uploaded to Cloud Storage.
 */
class UploadableFile {
  constructor({
    destinationParentDirectory,
    destinationRelativeFilePath,
    fileContent,
    userAgent = null,
  }) {
    /** @type {string} */
    this.destinationParentDirectory = destinationParentDirectory;

    /** @type {string} */
    this.destinationRelativeFilePath = destinationRelativeFilePath;

    /** @type {string} */
    this.destinationAbsoluteFilePath = `${this.destinationParentDirectory}/${this.destinationRelativeFilePath}`;

    /** @type {?Buffer} */
    this.fileContent = fileContent;

    /** @type {?Object} */
    this.userAgent = userAgent;

    /** @type {?string} */
    this.publicUrl = null;
  }
}

/**
 * An HTML file with screenshots.
 */
class UploadableTestCase {
  constructor({htmlFile}) {
    /** @type {!UploadableFile} */
    this.htmlFile = htmlFile;

    /** @type {!Array<!UploadableFile>} */
    this.screenshotImageFiles = [];
  }
}

module.exports = {
  Storage,
  UploadableFile,
  UploadableTestCase,
};
