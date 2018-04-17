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

const fs = require('fs');
const path = require('path');

const Storage = require('@google-cloud/storage');
const glob = require('glob');
const simpleGit = require('simple-git/promise');

const USERNAME = process.env.USER || process.env.USERNAME;
const GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH = process.env.MDC_GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH;
const GCLOUD_STORAGE_BUCKET_NAME = 'mdc-web-screenshot-tests';
const GCLOUD_STORAGE_BASE_URL = `https://storage.googleapis.com/${GCLOUD_STORAGE_BUCKET_NAME}/`;
const LOCAL_DIRECTORY_PREFIX = 'test/screenshot/';

const gitRepo = simpleGit();
const storage = new Storage({
  credentials: require(GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH),
});
const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET_NAME);

async function upload() {
  const promises = [];

  // Attaching Git metadata to the uploaded files makes it easier to track down their source.
  const gitCommitShort = await git('revparse', ['--short', 'HEAD']);
  const gitBranchName = await git('revparse', ['--abbrev-ref', 'HEAD']);

  // Every batch of files gets uploaded to a unique timestamped directory to prevent collisions between developers.
  const {year, month, day, hour, minute, second, ms} = getUtcDateTime();
  const baseGcsDir = `${USERNAME}/${year}/${month}/${day}/${hour}_${minute}_${second}_${ms}/${gitCommitShort}/assets/`;
  const relativeLocalFilePaths = glob.sync(path.join(LOCAL_DIRECTORY_PREFIX, '**/*')).filter(isFile);

  relativeLocalFilePaths.forEach((relativeLocalFilePath) => {
    const fileContents = fs.readFileSync(relativeLocalFilePath);
    const relativeGcsFilePath = relativeLocalFilePath.replace(LOCAL_DIRECTORY_PREFIX, '');
    const absoluteGcsFilePath = `${baseGcsDir}${relativeGcsFilePath}`;

    console.log(`➡️ Uploading ${absoluteGcsFilePath} ...`);

    const file = bucket.file(absoluteGcsFilePath);

    // Note: The GCS API mutates this object, so we need to create a new object every time we call the API.
    const fileOptions = {
      contentType: 'auto',

      // The nested `metadata` object is not a typo - it's required by the GCS `File#save()` API.
      metadata: {
        metadata: {
          'X-MDC-Git-Commit': gitCommitShort,
          'X-MDC-Git-Branch': gitBranchName,
        },
      },
    };

    promises.push(
      file
        .save(fileContents, fileOptions)
        .then(
          () => handleUploadSuccess(baseGcsDir, relativeGcsFilePath),
          (err) => handleUploadFailure(baseGcsDir, relativeGcsFilePath, err)
        )
    );
  });

  return Promise.all(promises);
}

function getUtcDateTime() {
  const pad = (num) => String(num).padStart(2, '0');
  const date = new Date();

  return {
    year: date.getUTCFullYear(),
    month: pad(date.getUTCMonth() + 1), // getUTCMonth() returns a zero-based value (e.g., January is `0`)
    day: pad(date.getUTCDate()),
    hour: pad(date.getUTCHours()),
    minute: pad(date.getUTCMinutes()),
    second: pad(date.getUTCSeconds()),
    ms: pad(date.getUTCMilliseconds()),
  };
}

function handleUploadSuccess(baseGcsDir, relativeGcsFilePath) {
  console.log(`✔︎ Uploaded ${GCLOUD_STORAGE_BASE_URL}${baseGcsDir}${relativeGcsFilePath}`);
  return {
    status: 'SUCCESS',
    error: null,
    bucketUrl: GCLOUD_STORAGE_BASE_URL,
    parentDir: baseGcsDir,
    relativePath: relativeGcsFilePath,
    fullUrl: `${GCLOUD_STORAGE_BASE_URL}${baseGcsDir}${relativeGcsFilePath}`,
  };
}

function handleUploadFailure(baseGcsDir, relativeGcsFilePath, err) {
  console.error(`✗︎ FAILED to upload ${GCLOUD_STORAGE_BASE_URL}${baseGcsDir}${relativeGcsFilePath}:\n`, err);
  return {
    status: 'ERROR',
    error: err,
    bucketUrl: GCLOUD_STORAGE_BASE_URL,
    parentDir: baseGcsDir,
    relativePath: relativeGcsFilePath,
    fullUrl: `${GCLOUD_STORAGE_BASE_URL}${baseGcsDir}${relativeGcsFilePath}`,
  };
}

function isFile(path) {
  return fs.statSync(path).isFile();
}

async function git(cmd, argList = []) {
  return (await gitRepo[cmd](argList) || '').trim();
}

module.exports = {
  upload,
};
