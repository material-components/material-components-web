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

/**
 * An Express-based Web server for static files.
 * Automatically generates a readable directory listing when no index.html file is present.
 */
class StaticServer {
  /**
   * @param {!PathResolver} pathResolver
   * @param {!express=} expressLib
   * @param {!fs=} fsLib
   * @param {!serveIndex=} serveIndexLib
   */
  constructor({
    pathResolver,
    expressLib = express,
    fsLib = fs,
    serveIndexLib = serveIndex,
  } = {}) {
    this.pathResolver_ = pathResolver;
    this.expressLib_ = expressLib;
    this.fsLib_ = fsLib;
    this.serveIndexLib_ = serveIndexLib;
  }

  /**
   * Starts a static file server asynchronously and returns immediately.
   * @param {string} path Relative or absolute path to a filesystem directory to serve
   * @param {number} port
   * @param {!Array<string>=} fileExtensions List of file extensions to show in directory indexes. If left empty, all
   *   files will be shown.
   * @param {string} stylesheetAbsolutePath Absolute path to a CSS file containing styles for the directory index
   */
  start({
    path,
    port,
    directoryIndex: {
      fileExtensions = [],
      stylesheetAbsolutePath,
    } = {},
  }) {
    const app = this.expressLib_();
    const indexOpts = {
      filter: (filename, index, files, dir) => {
        return this.shouldShowFile_(dir, filename, fileExtensions);
      },
      stylesheet: stylesheetAbsolutePath,
      icons: true,
    };

    const absolutePath = this.pathResolver_.getAbsolutePath(path);
    app.use(
      '/',
      this.expressLib_.static(absolutePath),
      this.serveIndexLib_(absolutePath, indexOpts)
    );

    app.listen(port, () => this.logRunning_(port));
  }

  /**
   * Determines whether the given filesystem path (parentPath + filename) should be listed in the directory index page.
   * @param {string} parentPath
   * @param {string} filename
   * @param {!Array<string>} fileExtensions List of file extensions to show. If left empty, all files will be shown.
   * @return {boolean}
   * @private
   */
  shouldShowFile_(parentPath, filename, fileExtensions) {
    // No file extension restrictions were specified, so show all files
    if (fileExtensions.length === 0) {
      return true;
    }
    // Matching file extension
    if (fileExtensions.some((ext) => filename.endsWith(ext))) {
      return true;
    }
    // Always show directories
    if (this.isDirectory_(parentPath, filename) && filename !== 'out') {
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
    const message = `Local development server running on http://localhost:${port}/`;
    const ch = '=';
    const border = ch.repeat(message.length + 8);
    const spacer = ' '.repeat(message.length);

    console.log(colors.green.bold(`
${border}
${ch}   ${spacer}   ${ch}
${ch}   ${message}   ${ch}
${ch}   ${spacer}   ${ch}
${border}
`));
  }
}

module.exports = StaticServer;
