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

class UploadableFile {
  constructor({
    destinationParentDirectory,
    destinationRelativeFilePath,
    fileContent,
  }) {
    /** @type {string} */
    this.destinationParentDirectory = destinationParentDirectory;

    /** @type {string} */
    this.destinationRelativeFilePath = destinationRelativeFilePath;

    /** @type {string} */
    this.destinationAbsoluteFilePath = this.destinationParentDirectory + this.destinationRelativeFilePath;

    /** @type {string|!Buffer} */
    this.fileContent = fileContent;

    /** @type {?string} */
    this.publicUrl = null;
  }
}

class TestCase {
  constructor({
    assetFile,
  }) {
    /** @type {!UploadableFile} */
    this.assetFile = assetFile;

    /** @type {!Array<UploadableFile>} */
    this.screenshotImageFiles = [];
  }
}

class TestSuite {
  constructor() {
    /** @type {!Map<string, !TestCase>} */
    this.testCaseStatusMap_ = new Map();
  }

  /**
   * @param {!TestCase} testCase
   */
  addTestCase(testCase) {
    this.testCaseStatusMap_.set(testCase.assetFile.destinationRelativeFilePath, testCase);
  }

  /**
   * @return {!Array<!TestCase>}
   */
  getTestCases() {
    return Array.from(this.testCaseStatusMap_.values());
  }
}

module.exports = {
  UploadableFile,
  TestCase,
  TestSuite,
};
