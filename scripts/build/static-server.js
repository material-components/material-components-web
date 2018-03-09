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

const colors = require('colors');
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

  runLocalDevServer({
    relativeDirectoryPaths,
    port = process.env.MDC_PORT || 8090,
  }) {
    const app = this.expressLib_();
    relativeDirectoryPaths.forEach((relativeDirectoryPath) => {
      this.serveStatic_(app, relativeDirectoryPath);
    });
    app.get('/', (req, res) => {
      res.redirect('test/screenshot/');
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
    const content = `Local development server running on http://localhost:${port}/`;
    const border = '=';
    const divider = border.repeat(content.length + 8);
    const spacer = ' '.repeat(content.length);

    console.log(colors.green.bold(`
${divider}
${border}   ${spacer}   ${border}
${border}   ${content}   ${border}
${border}   ${spacer}   ${border}
${divider}
`));
  }
}

module.exports = StaticServer;
