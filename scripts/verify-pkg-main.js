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

const fs = require('fs');
const path = require('path');
const {sync: globSync} = require('glob');

const isValidCwd = fs.existsSync('packages') && fs.existsSync(path.join('packages', 'material-components-web', 'dist'));

if (!isValidCwd) {
  console.error(
    'Invalid CWD. Please ensure you are running this from the root of the repo, and that you have run ' +
    '`npm run dist` and `node scripts/cp-pkgs.js`'
  );
  process.exit(1);
}

let invalidMains = 0;
globSync('packages/*/package.json').forEach((jsonPath) => {
  const packageInfo = JSON.parse(fs.readFileSync(jsonPath));
  if (!packageInfo.main) {
    return;
  }

  const mainPath = path.join(path.dirname(jsonPath), packageInfo.main);
  let isInvalid = false;
  if (mainPath.indexOf('dist') < 0) {
    isInvalid = true;
    console.error(`${jsonPath} main property does not reference a file under dist`);
  }
  if (!fs.existsSync(mainPath)) {
    isInvalid = true;
    console.error(`${jsonPath} main property points to nonexistent ${mainPath}`);
  }

  if (isInvalid) {
    // Multiple checks could have failed, but only increment the counter once for one package.
    invalidMains++;
  }
});

if (invalidMains > 0) {
  console.error(`${invalidMains} incorrect main property values found; please fix.`);
} else {
  console.log('Success: All packages with main properties reference valid files under dist!');
}
