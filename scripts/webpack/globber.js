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
 * @fileoverview Scans the filesystem for files whose path matches a glob pattern, and creates a Webpack chunk object to
 * compile those files.
 *
 * See https://github.com/isaacs/node-glob for supported glob syntax.
 */

'use strict';

const glob = require('glob');

module.exports = class {
  constructor({
    pathResolver,
    globLib = glob,
  } = {}) {
    /** @type {!PathResolver} */
    this.pathResolver_ = pathResolver;

    /** @type {!glob} */
    this.globLib_ = globLib;
  }

  /**
   * @param {...string} pathPatternParts One or more portions of a glob pattern to match against.
   *   If more than one pattern is passed, they will be joined with the OS's directory separator character.
   *   The first pattern should either be an absolute path or a path relative to the repository root.
   * @return {!Array<string>} Array of absolute paths to all files that match the full glob pattern.
   */
  getAbsolutePaths(...pathPatternParts) {
    return this.globLib_.sync(this.pathResolver_.getAbsolutePath(...pathPatternParts));
  }

  /**
   * Finds all files that match the given path glob pattern and returns a Webpack entry object containing each file as a
   * separate "chunk" (key/value pair).
   *
   * The "name" (key) of each chunk is the chunk's input file path (relative to the project root) without a file
   * extension, and the value is the absolute path to the input file.
   *
   * Import-only files (i.e., those with a leading underscore in their name) are excluded.
   *
   * E.g., the demo CSS chunks look like this:
   *
   * <code>
   *   > getChunks({filePathPattern: '**' + '/*.scss'})
   *   < {
   *       "button": "/absolute/path/to/mdc-web-repo/demos/button.scss",
   *       ...
   *       "theme/theme-baseline": "/absolute/path/to/mdc-web-repo/demos/theme/theme-baseline.scss",
   *       ...
   *     }
   * </code>
   *
   * @param {string} filePathPattern
   * @param {string=} inputDirectory
   * @return {!Object<string, string>} Map of chunk names to their absolute filesystem paths
   */
  getChunks({filePathPattern, inputDirectory = this.pathResolver_.getProjectRootAbsolutePath()}) {
    const chunks = {};
    const inputDirectoryAbsolutePath = this.pathResolver_.getAbsolutePath(inputDirectory);

    this.getAbsolutePaths(inputDirectory, filePathPattern).forEach((absolutePathToInputFile) => {
      const relativePath = this.pathResolver_.getRelativePath(absolutePathToInputFile, inputDirectoryAbsolutePath);
      const relativePathWithoutExtension = this.pathResolver_.removeFileExtension(relativePath);
      const filename = this.pathResolver_.getFilename(absolutePathToInputFile);

      // Ignore import-only file
      if (filename.charAt(0) === '_') {
        return;
      }

      chunks[relativePathWithoutExtension] = absolutePathToInputFile;
    });

    return chunks;
  }
};
