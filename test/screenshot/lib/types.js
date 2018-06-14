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

/**
 * @typedef {{
 *   htmlFilePath: string,
 *   goldenPageUrl: string,
 *   snapshotPageUrl: string,
 *   userAgentAlias: string,
 *   actualImageUrl: string,
 *   expectedImageUrl: string,
 *   diffImageBuffer ?Buffer,
 *   diffImageUrl: string,
 * }}
 */
let ImageDiffJson;

/**
 * @typedef {{
 *   diffs: !Array<!ImageDiffJson>,
 *   added: !Array<!ImageDiffJson>,
 *   removed: !Array<!ImageDiffJson>,
 *   unchanged: !Array<!ImageDiffJson>,
 *   testCases: !Array<!UploadableTestCase>,
 * }}
 */
let ReportData;


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
 * Image cropping
 */


/**
 * @typedef {{r: number, g: number, b: number, a: number}}
 */
let RGBA;
