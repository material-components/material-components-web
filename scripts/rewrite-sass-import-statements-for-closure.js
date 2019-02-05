/**
 * @license
 * Copyright 2017 Google Inc.
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
 * @fileoverview Rewrites import statements such that:
 *
 * ```js
 * import [<SPECIFIERS> from] '@material/$PKG[/files...]';
 * ```
 * becomes
 * ```js
 * import [<SPECIFIERS> from] 'mdc-$PKG/<RESOLVED_FILE_PATH>';
 * ```
 * The RESOLVED_FILE_PATH is the file that node's module resolution algorithm would have resolved the import
 * source to.
 */

const fs = require('fs');
const path = require('path');

const glob = require('glob');

main(process.argv);

function main(argv) {
  if (argv.length < 3) {
    console.error('Missing root directory path');
    process.exit(1);
  }

  const rootDir = path.resolve(process.argv[2]);
  const srcFiles = glob.sync(`${rootDir}/**/*.scss`);
  srcFiles.forEach((srcFile) => transform(srcFile, rootDir));
}

function transform(srcFile, rootDir) {
  console.log(`[rewrite] ${srcFile}`);
  let src = fs.readFileSync(srcFile, 'utf8');

  src = src.replace(/@import "@material\/([^/]+)\/([^"]+)"/g, (match, modName, remainder) => {
    const atMaterialReplacementPath = `${rootDir}/${modName}`;
    const importSource = `${atMaterialReplacementPath}/${remainder}`;

    let resolvedImportSource = importSource;
    const needsClosureModuleRootResolution = path.isAbsolute(importSource);
    if (needsClosureModuleRootResolution) {
      const pathToImport = importSource.replace('@material', rootDir);
      resolvedImportSource = path.relative(path.dirname(srcFile), pathToImport);
    }

    return `@import "${resolvedImportSource}"`;
  });

  fs.writeFileSync(srcFile, src, 'utf8');
}
