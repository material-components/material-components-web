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
 *   checkedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   uncheckedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   unreviewedUserAgentCbEls: !Array<!HTMLInputElement>,
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
 *   checkedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   uncheckedUserAgentCbEls: !Array<!HTMLInputElement>,
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
 *   checkedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   uncheckedUserAgentCbEls: !Array<!HTMLInputElement>,
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
