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

/* eslint-disable no-unused-vars */


/*
 * Run Report
 */


/**
 * @typedef {{
 *   runTarget: !RunTarget,
 *   runResult: ?RunResult,
 * }}
 */
let RunReport;

/**
 * @typedef {{
 *   runnableUserAgents: !Array<!CbtUserAgent>,
 *   skippedUserAgents: !Array<!CbtUserAgent>,
 *   runnableTestCases: !Array<!UploadableTestCase>,
 *   skippedTestCases: !Array<!UploadableTestCase>,
 *   baseGoldenJsonData: !SnapshotSuiteJson,
 * }}
 */
let RunTarget;

/**
 * @typedef {{
 *   publicReportPageUrl: ?string,
 *   publicReportJsonUrl: ?string,
 *   diffs: !Array<!ImageDiffJson>,
 *   added: !Array<!ImageDiffJson>,
 *   removed: !Array<!ImageDiffJson>,
 *   unchanged: !Array<!ImageDiffJson>,
 *   skipped: !Array<!ImageDiffJson>,
 *   approvedGoldenJsonData: ?SnapshotSuiteJson,
 * }}
 */
let RunResult;

/**
 * @typedef {{
 *   htmlFilePath: string,
 *   userAgentAlias: string,
 *   goldenPageUrl: ?string,
 *   snapshotPageUrl: ?string,
 *   actualImageUrl: ?string,
 *   expectedImageUrl: ?string,
 *   diffImageBuffer ?Buffer,
 *   diffImageUrl: ?string,
 * }}
 */
let ImageDiffJson;


/*
 * Report UI
 */


/**
 * @typedef {{
 *   checkedBrowserCbEls: !Array<!HTMLInputElement>,
 *   uncheckedBrowserCbEls: !Array<!HTMLInputElement>,
 *   changelistDict: !ReportUiChangelistDict,
 *   reviewStatusCountDict: !ReportUiReviewStatusCountDict,
 * }}
 */
let ReportUiState;

/**
 * @typedef {{
 *   diffs: !ReportUiChangelistState,
 *   added: !ReportUiChangelistState,
 *   removed: !ReportUiChangelistState,
 * }}
 */
let ReportUiChangelistDict;

/**
 * @typedef {{
 *   cbEl: !HTMLInputElement,
 *   countEl: !HTMLElement,
 *   reviewStatusEl: !HTMLElement,
 *   checkedBrowserCbEls: !Array<!HTMLInputElement>,
 *   uncheckedBrowserCbEls: !Array<!HTMLInputElement>,
 *   reviewStatusCountDict: !ReportUiReviewStatusCountDict,
 *   pageDict: !ReportUiPageDict,
 * }}
 */
let ReportUiChangelistState;

/**
 * @typedef {!Object<string, !ReportUiPageState>}
 */
let ReportUiPageDict;

/**
 * @typedef {{
 *   cbEl: !HTMLInputElement,
 *   countEl: !HTMLElement,
 *   reviewStatusEl: !HTMLElement,
 *   checkedBrowserCbEls: !Array<!HTMLInputElement>,
 *   uncheckedBrowserCbEls: !Array<!HTMLInputElement>,
 *   reviewStatusCountDict: !ReportUiReviewStatusCountDict,
 * }}
 */
let ReportUiPageState;

/**
 * @typedef {!Object<string, number>}
 */
let ReportUiReviewStatusCountDict;


/*
 * Filesystem
 */


/**
 * An HTML file with screenshots.
 */
class UploadableTestCase {
  /**
   * @param {!UploadableFile} htmlFile
   * @param {boolean} isRunnable
   */
  constructor({
    htmlFile,
    isRunnable,
  }) {
    /** @type {!UploadableFile} */
    this.htmlFile = htmlFile;

    /** @type {boolean} */
    this.isRunnable = isRunnable;

    /** @type {!Array<!UploadableFile>} */
    this.screenshotImageFiles = [];
  }
}

/**
 * A file to be uploaded to Cloud Storage.
 */
class UploadableFile {
  constructor({
    destinationBaseUrl,
    destinationParentDirectory,
    destinationRelativeFilePath,
    queueIndex = null,
    queueLength = null,
    fileContent = null,
    userAgent = null,
  }) {
    /** @type {string} */
    this.destinationParentDirectory = destinationParentDirectory;

    /** @type {string} */
    this.destinationRelativeFilePath = destinationRelativeFilePath;

    /** @type {string} */
    this.destinationAbsoluteFilePath = `${this.destinationParentDirectory}/${this.destinationRelativeFilePath}`;

    /** @type {string} */
    this.publicUrl = `${destinationBaseUrl}${this.destinationAbsoluteFilePath}`;

    /** @type {?Buffer|?string} */
    this.fileContent = fileContent;

    /** @type {?CbtUserAgent} */
    this.userAgent = userAgent;

    /** @type {number} */
    this.queueIndex = queueIndex;

    /** @type {number} */
    this.queueLength = queueLength;
  }
}


/*
 * golden.json type definitions
 */


/**
 * Dictionary of HTML file paths (relative to `test/screenshot/`) that map to the screenshot capture data for that file.
 * E.g.:
 * ```json
 * {
 *   "mdc-button/classes/baseline.html": {
 *     "publicUrl": "https://storage.googleapis.com/.../baseline.html",
 *     "screenshots": {...}
 *   },
 *   "mdc-button/classes/dense.html": {
 *     "publicUrl": "https://storage.googleapis.com/.../dense.html",
 *     "screenshots": {...}
 *   },
 *   ...
 * }
 * ```
 * @typedef {!Object<string, !SnapshotPageJson>}
 */
let SnapshotSuiteJson;

/**
 * @typedef {{
 *   publicUrl: string,
 *   screenshots: !SnapshotResultJson,
 * }}
 */
let SnapshotPageJson;

/**
 * Dictionary of browser API names to public screenshot image URLs.
 * E.g.:
 * ```json
 * {
 *   "win10e15_chrome63x64_ltr": "https://storage.googleapis.com/.../baseline.html/win10e15_chrome63x64_ltr.png",
 *   "win10e16_edge16_ltr": "https://storage.googleapis.com/.../baseline.html/win10e16_edge16_ltr.png",
 * }
 * ```
 * @typedef {!Object<string, string>}
 */
let SnapshotResultJson;


/*
 * CLI args
 */


/**
 * @typedef {{
 *   publicUrl: ?string,
 *   localFilePath: ?string,
 *   gitRevision: ?GitRevision,
 * }}
 */
let DiffSource;

/**
 * @typedef {{
 *   snapshotFilePath: string,
 *   commit: string,
 *   remote: ?string,
 *   branch: ?string,
 *   tag: ?string,
 * }}
 */
let GitRevision;


/*
 * Resemble.js API externs
 */


/**
 * @typedef {{
 *   rawMisMatchPercentage: number,
 *   misMatchPercentage: string,
 *   diffBounds: !ResembleApiBoundingBox,
 *   analysisTime: number,
 *   getImageDataUrl: function(text: string): string,
 *   getBuffer: function(includeOriginal: boolean): !Buffer,
 * }}
 */
let ResembleApiComparisonResult;

/**
 * @typedef {{
 *   top: number,
 *   left: number,
 *   bottom: number,
 *   right: number,
 * }}
 */
let ResembleApiBoundingBox;


/*
 * CBT API
 */


/**
 * Represents a single browser/device combination.
 * E.g., "Chrome 62" on "Nexus 6P with Android 7.0".
 * This is a custom, MDC-specific data type; it does not come from the CBT API.
 * @typedef {{
 *   fullCbtApiName: string,
 *   alias: string,
 *   device: !CbtDevice,
 *   browser: !CbtBrowser,
 *   isRunnable: boolean,
 * }}
 */
let CbtUserAgent;

/**
 * A "physical" device (phone, tablet, or desktop) with a specific OS version.
 * E.g., "iPhone 8 with iOS 11", "Nexus 6P with Android 7.0", "macOS 10.13", "Windows 10".
 * Returned by the CBT API.
 * @typedef {{
 *   api_name: string,
 *   name: string,
 *   version: string,
 *   type: string,
 *   device: string,
 *   device_type: string,
 *   browsers: !Array<!CbtBrowser>,
 *   resolutions: !Array<!CbtDeviceResolution>,
 *   parsedVersionNumber: ?string,
 * }}
 */
let CbtDevice;

/**
 * A specific version of a browser vendor's software.
 * E.g., "Safari 11", "Chrome 63 (64-bit)", "Edge 17".
 * Returned by the CBT API.
 * @typedef {{
 *   api_name: string,
 *   name: string,
 *   version: string,
 *   type: string,
 *   device: string,
 *   icon_class: string,
 *   selenium_version: string,
 *   webdriver_type: string,
 *   webdriver_version: string,
 *   parsedVersionNumber: ?string,
 *   parsedIconUrl: ?string,
 * }}
 */
let CbtBrowser;

/**
 * A "physical" device pixel resolution.
 * E.g., "1125x2436 (portrait)", "2436x1125 (landscape)".
 * Returned by the CBT API.
 * @typedef {{
 *   name: string,
 *   width: number,
 *   height: number,
 *   orientation: string,
 *   default: boolean,
 * }}
 */
let CbtDeviceResolution;


/*
 * Image cropping
 */


/**
 * @typedef {{r: number, g: number, b: number, a: number}}
 */
let RGBA;


/*
 * Module exports
 */


module.exports = {
  UploadableTestCase,
  UploadableFile,
};
