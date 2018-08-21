/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @fileoverview Parses and resolves filesystem paths.
 */

'use strict';

const fs = require('fs');
const path = require('path');

class PathResolver {
  constructor({
    pathLib = path,
    fsLib = fs,
  } = {}) {
    /** @type {!path} */
    this.pathLib_ = pathLib;

    /** @type {!fs} */
    this.fsLib_ = fsLib;
  }

  /**
   * Returns the absolute path to the repository's root directory on the local filesystem.
   * @return {string}
   */
  getProjectRootAbsolutePath() {
    return this.pathLib_.resolve(this.pathLib_.join(__dirname, '../../'));
  }

  /**
   * Resolves zero or more path portions (relative to the project root) into a single absolute filesystem path.
   *
   * Examples:
   *
   * // First argument is a relative directory path
   * > getAbsolutePath('/test/screenshot', 'out/main', 'foo.css')
   *     === '/Users/betty/mdc-web/test/screenshot/out/main/foo.css'
   *
   * // First argument is an absolute directory path
   * > getAbsolutePath('/Users/betty/mdc-web', '/test/screenshot', 'out/main', 'foo.css')
   *     === '/Users/betty/mdc-web/test/screenshot/out/main/foo.css'
   *
   * // No arguments (returns the project root)
   * > getAbsolutePath()
   *     === '/Users/betty/mdc-web'
   *
   * @param {...string} pathPartsRelativeToProjectRoot Zero or more portions of a filesystem path.
   *   The first argument must be either a path relative to the project root (e.g., '/test/screenshot'),
   *   or an absolute path to an existing directory (e.g., '/Users/betty/mdc-web/test/screenshot').
   *   All subsequent arguments are concatenated onto the first argument, with each part separated by a single
   *   OS-specific directory separator character (`/` on *nix, `\` on Windows).
   * @return {string}
   */
  getAbsolutePath(...pathPartsRelativeToProjectRoot) {
    // First argument is already an absolute path
    if (this.fsLib_.existsSync(pathPartsRelativeToProjectRoot[0])) {
      return this.pathLib_.resolve(this.pathLib_.join(...pathPartsRelativeToProjectRoot));
    }

    // First argument is a path relative to the repo root
    const projectRootAbsolutePath = this.getProjectRootAbsolutePath();
    return this.pathLib_.resolve(this.pathLib_.join(projectRootAbsolutePath, ...pathPartsRelativeToProjectRoot));
  }

  /**
   * Returns the path to a file relative to the given root.
   * @param absolutePathToFile
   * @param absolutePathToRoot
   * @return {string}
   */
  getRelativePath(absolutePathToFile, absolutePathToRoot = this.getProjectRootAbsolutePath()) {
    return this.pathLib_.relative(absolutePathToRoot, absolutePathToFile);
  }

  /**
   * Concatenates the given `pathParts`, separated by an OS-specific directory separator character
   * (`/` on *nix, `\` on Windows).
   * @param pathParts
   * @return {string}
   */
  join(...pathParts) {
    return this.pathLib_.join(...pathParts);
  }

  /**
   * Returns the name of the last file or directory in a path.
   * @param {string} filePath
   * @return {string}
   */
  getFilename(filePath) {
    return this.pathLib_.basename(filePath);
  }

  /**
   * Removes the file extension from a path.
   * @param {string} filePath
   * @return {string}
   */
  removeFileExtension(filePath) {
    return filePath.replace(/\.\w+$/, '');
  }
}

module.exports = PathResolver;
