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
 *   changed: !ReportUiChangelistState,
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
 * CLI args
 */


/**
 * @typedef {{
 *   optionNames: !Array<string>,
 *   description: string,
 *   isRequired: ?boolean,
 *   type: ?string,
 *   defaultValue: ?*,
 *   exampleValue: ?string,
 * }}
 */
let CliOptionConfig;


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
 * TODO(acdvorak): Implement "selenium" properties
 * @typedef {{
 *   fullCbtApiName: string,
 *   alias: string,
 *   device: !CbtDevice,
 *   browser: !CbtBrowser,
 *   isRunnable: boolean,
 *   seleniumBrowserName: string,
 *   seleniumBrowserCapabilities: ?Object,
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
 *   device_type: ?string,
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
 *   webdriver_version: ?string,
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
 * ps-node API externs
 */


/**
 * @typedef {{
 *   pid: number,
 *   ppid: number,
 *   command: string,
 *   arguments: !Array<string>,
 * }}
 */
let PsNodeProcess;


/*
 * Node.js API
 */


/**
 * @typedef {{
 *   cwd: ?string,
 *   env: ?Object,
 *   argv0: ?string,
 *   stdio: ?Array<string>,
 *   detached: ?boolean,
 *   uid: ?number,
 *   gid: ?number,
 *   shell: ?boolean,
 *   windowsVerbatimArguments: ?boolean,
 *   windowsHide: ?boolean,
 * }}
 */
let ChildProcessSpawnOptions;

/**
 * @typedef {{
 *   status: number,
 *   signal: ?string,
 *   pid: number,
 * }}
 */
let ChildProcessSpawnResult;


/*
 * Image cropping
 */


/**
 * @typedef {{r: number, g: number, b: number, a: number}}
 */
let RGBA;
