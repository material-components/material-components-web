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
const uuidv4 = require('uuid/v4');

const Storage = require('@google-cloud/storage');
const glob = require('glob');
const simpleGit = require('simple-git/promise');

const USERNAME = process.env.USER || process.env.USERNAME;
const GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH = process.env.MDC_GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH;
const GCLOUD_STORAGE_BUCKET_NAME = 'mdc-web-screenshot-tests';
const GCLOUD_STORAGE_BASE_URL = `https://storage.googleapis.com/${GCLOUD_STORAGE_BUCKET_NAME}/`;
const LOCAL_DIRECTORY_PREFIX = 'test/screenshot/';
const SHORT_HASH_STRING_LENGTH = 8;

const gitRepo = simpleGit();
const storage = new Storage({
  credentials: require(GCLOUD_SERVICE_ACCOUNT_KEY_FILE_PATH),
});
const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET_NAME);

async function upload() {
  const promises = [];

  // Every batch of files gets stored in a unique directory to prevent collisions.
  const uuidFull = createUuid();
  const uuidShort = shorten(uuidFull);

  // Attaching Git metadata makes it easier to track down the source of uploaded files.
  const gitLocalBranchName = await git('revparse', ['--abbrev-ref', 'HEAD']);
  const gitBaseCommitFull = await git('revparse', ['HEAD']);
  const gitBaseCommitShort = shorten(gitBaseCommitFull);

  const absoluteGcsBaseDir = `${USERNAME}/${gitBaseCommitShort}/${uuidShort}/assets/`;
  const relativeLocalFilePaths = glob.sync(path.join(LOCAL_DIRECTORY_PREFIX, '**/*.*'));

  relativeLocalFilePaths.forEach((relativeLocalFilePath) => {
    const fileContents = fs.readFileSync(relativeLocalFilePath);
    const relativeGcsFilePath = relativeLocalFilePath.replace(LOCAL_DIRECTORY_PREFIX, '');
    const absoluteGcsFilePath = `${absoluteGcsBaseDir}${relativeGcsFilePath}`;

    console.log(`➡️ Uploading ${absoluteGcsFilePath} ...`);

    const file = bucket.file(absoluteGcsFilePath);

    // Note: The GCS API mutates this object, so we need to create a new object every time we call the API.
    const fileOptions = {
      contentType: 'auto',

      // The nested `metadata` object is not a typo - it's needed by the GCS `File#save()` API.
      metadata: {
        metadata: {
          'X-MDC-Git-Base-Commit': gitBaseCommitFull,
          'X-MDC-Git-Branch-Name': gitLocalBranchName,
        },
      },
    };

    promises.push(
      file.save(fileContents, fileOptions).then(
        () => handleUploadSuccess(absoluteGcsBaseDir, relativeGcsFilePath),
        (err) => handleUploadFailure(absoluteGcsBaseDir, relativeGcsFilePath, err)
      )
    );
  });

  return Promise.all(promises);
}

function handleUploadSuccess(absoluteGcsBaseDir, relativeGcsFilePath) {
  console.log(`✔︎ Uploaded ${GCLOUD_STORAGE_BASE_URL}${absoluteGcsBaseDir}${relativeGcsFilePath}`);
  return {
    status: 'SUCCESS',
    error: null,
    bucketUrl: GCLOUD_STORAGE_BASE_URL,
    parentDir: absoluteGcsBaseDir,
    relativePath: relativeGcsFilePath,
    fullUrl: `${GCLOUD_STORAGE_BASE_URL}${absoluteGcsBaseDir}${relativeGcsFilePath}`,
  };
}

function handleUploadFailure(absoluteGcsBaseDir, relativeGcsFilePath, err) {
  console.error(`❌︎ FAILED to upload ${GCLOUD_STORAGE_BASE_URL}${absoluteGcsBaseDir}${relativeGcsFilePath}:\n`, err);
  return {
    status: 'ERROR',
    error: err,
    bucketUrl: GCLOUD_STORAGE_BASE_URL,
    parentDir: absoluteGcsBaseDir,
    relativePath: relativeGcsFilePath,
    fullUrl: `${GCLOUD_STORAGE_BASE_URL}${absoluteGcsBaseDir}${relativeGcsFilePath}`,
  };
}

async function git(cmd, argList = []) {
  return (await gitRepo[cmd](argList) || '').trim();
}

function createUuid() {
  return uuidv4().replace(/\W+/g, '');
}

function shorten(hash) {
  return hash.substr(0, SHORT_HASH_STRING_LENGTH);
}

module.exports = {
  upload,
};
