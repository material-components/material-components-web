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

const SOURCE_DIR = 'test/screenshot/';

const Controller = require('./lib/controller');
const controller = new Controller({sourceDir: SOURCE_DIR});

controller.initialize()
  .then(() => controller.uploadAllAssets(), handleError)
  .then((testCases) => controller.captureAllPages(testCases), handleError)
  .then((testCases) => controller.diffGoldenJson(testCases), handleError)
  .then(({testCases, diffs}) => controller.uploadDiffReport({testCases, diffs}), handleError)
;

function handleError(err) {
  console.error(err);
  process.exit(1);
}
