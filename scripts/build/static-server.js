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
const fs = require('fs');
const serveIndex = require('serve-index');

class StaticServer {
  constructor({
    pathResolver,
    expressLib = express,
    serveIndexLib = serveIndex,
    fsLib = fs,
  } = {}) {
    this.pathResolver_ = pathResolver;
    this.expressLib_ = expressLib;
    this.fsLib_ = fsLib;
    this.serveIndexLib_ = serveIndexLib;
  }

  /**
   * Starts a static file server asynchronously and returns immediately.
   * @param {!Array<string>} relativeDirectoryPaths
   * @param {!Array<string>=} fileExtensions
   * @param {string} stylesheetAbsolutePath
   * @param {number=} port
   */
  run({
    relativeDirectoryPaths,
    directoryListing: {
      fileExtensions = [],
      stylesheetAbsolutePath,
    } = {},
    port = process.env.MDC_PORT || 8090,
  }) {
    const app = this.expressLib_();
    const indexOpts = {
      // eslint-disable-next-line no-unused-vars
      filter: (filename, index, files, dir) => {
        return this.shouldShowFile_(dir, filename, fileExtensions);
      },
      stylesheet: stylesheetAbsolutePath,
      icons: true,
    };

    relativeDirectoryPaths.forEach((relativeDirectoryPath) => {
      const fsAbsolutePath = this.pathResolver_.getAbsolutePath(relativeDirectoryPath);
      app.use(
        // Mirror filesystem paths in the URL
        relativeDirectoryPath,
        this.expressLib_.static(fsAbsolutePath),
        this.serveIndexLib_(fsAbsolutePath, indexOpts)
      );
    });

    // Redirect to the screenshot test directory if no path is specified in the URL.
    app.get('/', (req, res) => {
      res.redirect('test/screenshot/');
    });

    app.listen(port, () => this.logRunning_(port));
  }

  /**
   * Determines whether the given filesystem path (parentPath + filename) should be listed in the directory index page.
   * @param {string} parentPath
   * @param {string} filename
   * @param {!Array<string>} fileExtensions
   * @return {boolean}
   * @private
   */
  shouldShowFile_(parentPath, filename, fileExtensions) {
    // Directory
    if (this.isDirectory_(parentPath, filename)) {
      return true;
    }
    // File with whitelisted file extension
    if (fileExtensions.some((ext) => filename.endsWith(ext))) {
      return true;
    }
    // No file extensions specified; show all files
    if (fileExtensions.length === 0) {
      return true;
    }
    return false;
  }

  /**
   * Determines whether the given filename points to a directory.
   * @param {string} parentPath
   * @param {string} filename
   * @return {boolean}
   * @private
   */
  isDirectory_(parentPath, filename) {
    const fullAbsolutePath = this.pathResolver_.join(parentPath, filename);
    return this.fsLib_.statSync(fullAbsolutePath).isDirectory();
  }

  /**
   * @param {number} port
   * @private
   */
  logRunning_(port) {
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
