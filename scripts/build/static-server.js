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

class StaticServer {
  constructor({
    pathResolver,
    expressLib = express,
    serveIndexLib = serveIndex,
  } = {}) {
    this.pathResolver_ = pathResolver;
    this.expressLib_ = expressLib;
    this.serveIndexLib_ = serveIndexLib;
  }

  runLocalDevServer({relativeDirectoryPaths, port = process.env.MDC_PORT || 8090}) {
    const app = this.expressLib_();
    relativeDirectoryPaths.forEach((relativeDirectoryPath) => {
      this.serveStatic_(app, relativeDirectoryPath);
    });
    app.listen(port, () => this.logLocalDevServerRunning_(port));
  }

  serveStatic_(app, urlPath, fsRelativePath = urlPath) {
    const fsAbsolutePath = this.pathResolver_.getAbsolutePath(fsRelativePath);
    const indexOpts = {
      icons: true,
    };
    app.use(urlPath, this.expressLib_.static(fsAbsolutePath), this.serveIndexLib_(fsAbsolutePath, indexOpts));
  }

  logLocalDevServerRunning_(port) {
    const message = `Local development server running on http://localhost:${port}/`;
    const ch = '=';
    const divider = ch.repeat(message.length + 6);
    const spacer = ' '.repeat(message.length);

    console.log(`
${divider}
${ch}  ${spacer}  ${ch}
${ch}  ${message}  ${ch}
${ch}  ${spacer}  ${ch}
${divider}
`);
  }
}

module.exports = StaticServer;
