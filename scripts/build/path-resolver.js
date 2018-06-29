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
