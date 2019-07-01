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
 * @fileoverview Deletes all *.css.js files from the output directory after Webpack has finished compiling.
 *
 * Webpack 4.x emits ALL bundles as JavaScript files - even CSS. To get a plain .css file, we have to use
 * `mini-css-extract-plugin` to yank the CSS out of the .css.js file and write it to a .css file.
 * This is done by `createCssExtractorPlugin()` in `plugin-factory.js`.
 *
 * However, we still end up with bunch of unneeded .css.js files in the output directory, so this plugin deletes them.
 */

'use strict';

const fsx = require('fs-extra');

class CssCleanupPlugin {
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
}

module.exports = CssCleanupPlugin;
