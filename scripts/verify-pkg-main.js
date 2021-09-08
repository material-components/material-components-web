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

/**
 * Verifies that a file exists at the `packagePropertyKey`. If it does not
 * this function will log an error to the console.
 * @param {object} packageJson package.json in JSON format
 * @param {string} jsonPath filepath (relative to the root directory) to a component's package.json
 * @param {string} packagePropertyKey property key of package.json
 */
function verifyPath(packageJson, jsonPath, packagePropertyKey) {
  const isAtRoot = packagePropertyKey === 'module';
  const packageJsonPropPath = path.join(path.dirname(jsonPath), packageJson[packagePropertyKey]);
  let isInvalid = false;
  if (!isAtRoot && packageJsonPropPath.indexOf('dist') === -1) {
    isInvalid = true;
    logError(`${jsonPath} ${packagePropertyKey} property does not reference a file under dist`);
  } else if (isAtRoot && packageJsonPropPath.indexOf('dist') !== -1) {
    isInvalid = true;
    logError(`${jsonPath} ${packagePropertyKey} property should not reference a file under dist`);
  }
  if (!fs.existsSync(packageJsonPropPath)) {
    isInvalid = true;
    logError(`${jsonPath} ${packagePropertyKey} property points to nonexistent ${packageJsonPropPath}`);
  }

  if (isInvalid) {
    // Multiple checks could have failed, but only increment the counter once for one package.

    switch (packagePropertyKey) {
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

function logError(message) {
  console.error(message);
  process.exitCode = 1;
}

if (!isValidCwd) {
  console.error(
    'Invalid CWD. Please ensure you are running this from the root of the repo, and that you have run ' +
    '`npm run dist` and `node scripts/cp-pkgs.js`',
  );
  process.exit(1);
}

let invalidMains = 0;
let invalidModules = 0;
let invalidTypes = 0;
globSync('packages/*/package.json').forEach((jsonPath) => {
  const packageJson = JSON.parse(fs.readFileSync(jsonPath));
  if (!packageJson.main) {
    return;
  }
  verifyPath(packageJson, jsonPath, 'main');
  verifyPath(packageJson, jsonPath, 'module');
  if (jsonPath.includes('material-components-web')) {
    verifyPath(packageJson, jsonPath, 'types');
  }
});

if (invalidMains > 0 || invalidModules > 0 || invalidTypes > 0) {
  if (invalidMains > 0) {
    logError(`${invalidMains} incorrect main property values found; please fix.`);
  }
  if (invalidModules > 0) {
    logError(`${invalidModules} incorrect module property values found; please fix.`);
  }
  if (invalidTypes > 0) {
    logError(`${invalidTypes} incorrect types property values found; please fix.`);
  }
} else {
  console.log('Success: All packages with main, module, types properties reference appropriate files!');
}
