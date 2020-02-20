/**
 * @license
 * Copyright 2020 Google Inc.
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
 * @fileoverview Compiles and outputs all Sass test files ending with '.test.scss' in test/ folder in packages.
 * This helper file is executed before running jasmine node tests.
 */

// tslint:disable-next-line:no-var-requires dart-sass does not have type information, use require() instead.
const sass = require('dart-sass');
import fs from 'fs';
import glob from 'glob';
import path from 'path';

// NOTE: This assumes it is run from the top-level directory (which is always the case when using npm run)
const projectRoot = process.cwd();

// const tryAccess = (scssPath: string) => {
//   const fullPath = path.join(projectRoot, scssPath);
//   try {
//     fs.accessSync(fullPath);
//     return fullPath;
//   } catch (e) {
//     return undefined;
//   }
// };

// const materialImporter = (url: string) => {
//   if (url.startsWith('@material')) {
//     // Support omission of .scss extension
//     const normalizedUrl = url.endsWith('.scss') ? url : `${url}.scss`;
//     // Convert @material/foo to packages/mdc-foo to load directly from packages folder in repository
//     const scssPath = normalizedUrl.replace('@material/', 'packages/mdc-');
//     // Support omission of leading _ for partials
//     const resolved = tryAccess(scssPath) ||
//       tryAccess(path.join(path.dirname(scssPath), `_${path.basename(scssPath)}`));
//     return {file: resolved || url};
//   }
//   return {file: url};
// }

interface RenderOptions {
  outFile: string,
}

/**
 * Converts Sass to CSS.
 */
const render = (filePath: string, options: Partial<RenderOptions> = {}): string => {
  const result = sass.renderSync({
    file: filePath,
    // importer: materialImporter,
    includePaths: [path.join(projectRoot, 'packages/material-components-web/node_modules')],
    outFile: options.outFile || null,
  });
  return result.css.toString('utf8').trim();
};

const compileSassTestFiles = () => {
  const testFiles = glob.sync('packages/**/test/*.test.scss', {
    ignore: ['node_modules/**', '**/node_modules/**'],
  });

  for (const testFile of testFiles) {
    const outFile = testFile.replace('.scss', '.css');
    const css = render(testFile, {outFile});
    fs.writeFileSync(outFile, css);
  }
};

compileSassTestFiles();
