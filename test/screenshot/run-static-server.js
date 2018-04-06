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

const express = require('express');
const serveIndex = require('serve-index');

const PathResolver = require('../../scripts/build/path-resolver');
const pathResolver = new PathResolver();

const absolutePath = pathResolver.getAbsolutePath('/test/screenshot');
const app = express();

app.use('/', express.static(absolutePath), serveIndex(absolutePath));

app.listen(8080, () => {
  console.log(`
==========================================================
Local development server running on http://localhost:8080/
==========================================================
`);
});
