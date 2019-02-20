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
let invalidModules = 0;
let invalidTypes = 0;
globSync('packages/*/package.json').forEach((jsonPath) => {
  const packageInfo = JSON.parse(fs.readFileSync(jsonPath));
  if (!packageInfo.main) {
    return;
  }
  verifyPath(packageInfo, jsonPath, 'main');
  verifyPath(packageInfo, jsonPath, 'module');
  verifyPath(packageInfo, jsonPath, 'type');
});

if (invalidMains > 0 || invalidModules > 0 || invalidTypes > 0) {
  if (invalidMains > 0) {
    console.error(`${invalidMains} incorrect main property values found; please fix.`);
  }
  if (invalidModules > 0) {
    console.error(`${invalidModules} incorrect module property values found; please fix.`);
  }
  if (invalidTypes > 0) {
    console.error(`${invalidTypes} incorrect type property values found; please fix.`);
  }
} else {
  console.log('Success: All packages with main, module, type properties reference valid files under dist!');
}

function verifyPath(packageInfo, jsonPath, type) {
  const packageJsonPropPath = path.join(path.dirname(jsonPath), packageInfo[type]);
  let isInvalid = false;
  if (packageJsonPropPath.indexOf('dist') < 0) {
    isInvalid = true;
    console.error(`${jsonPath} ${type} property does not reference a file under dist`);
  }
  if (!fs.existsSync(packageJsonPropPath)) {
    isInvalid = true;
    console.error(`${jsonPath} ${type} property points to nonexistent ${packageJsonPropPath}`);
  }

  if (isInvalid) {
    // Multiple checks could have failed, but only increment the counter once for one package.

    switch (types) {
      case 'main':
        invalidMains++;
        break;
      case 'module':
        invalidModules++;
        break;
      case 'types':
        invalidTypes++;
        break;
    }
  }
}
