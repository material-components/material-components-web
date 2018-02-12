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
 * @fileoverview Deletes all *.css.js files from the output directory after Webpack has finished compiling.
 *
 * Webpack 3.x emits ALL bundles as JavaScript files - even CSS. To get a plain .css file, we have to use
 * `extract-text-webpack-plugin` to yank the CSS out of the .css.js file and write it to a .css file.
 * This is done by `createCssExtractorPlugin()` in `plugin-factory.js`.
 *
 * However, we still end up with bunch of unneeded .css.js files in the output directory, so this plugin deletes them.
 */

'use strict';

const fsx = require('fs-extra');

module.exports = class {
  constructor({
    cleanupDirRelativePath,
    globber,
    fsExtraLib = fsx,
  } = {}) {
    /** @type {string} */
    this.cleanupDirRelativePath = cleanupDirRelativePath;

    // Prevent private properties from being serialized into *.golden.json test files.
    Object.defineProperties(this, {
      globber_: {value: globber},
      fsExtraLib_: {value: fsExtraLib},
    });
  }

  apply(compiler) {
    compiler.plugin('done', () => this.nukeEm_());
  }

  // https://youtu.be/SNAK21fcVzU
  nukeEm_() {
    // The trailing `*` at the end of the glob pattern is needed to clean up sourcemap files (e.g., `foo.css.js.map`).
    this.globber_.getAbsolutePaths(this.cleanupDirRelativePath, '**/*.css.js*').forEach((absolutePath) => {
      this.fsExtraLib_.removeSync(absolutePath);
    });
  }
};
