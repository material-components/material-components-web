/**
 * @license
 * Copyright 2016 Google Inc.
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
 * @fileoverview Copies built assets from our build directory to each of their respective package's
 * dist/ folder.
 */

const path = require('path');
const fs = require('fs');
const cpFile = require('cp-file');
const toSlugCase = require('to-slug-case');
const {sync: globSync} = require('glob');

const PKG_RE = /(?:material\-components\-web)|(?:mdc\.[a-zA-Z\-]+)/;

const isValidCwd = (
  path.basename(process.cwd()) === 'material-components-web' &&
  fs.existsSync('packages') &&
  fs.existsSync('build')
);

if (!isValidCwd) {
  console.error(
    'Invalid CWD. Please ensure you are running this from the root of the repo, ' +
    'and that you have run `npm run dist`'
  );
  process.exit(0);
}

function getAssetEntry(asset) {
  const [entryName] = path.parse(asset).name.match(PKG_RE);
  const [MDC, componentName] = entryName.split('.');
  const dealingWithSubpackage = Boolean(MDC && componentName);
  if (!dealingWithSubpackage) {
    return entryName;
  }
  return [MDC, toSlugCase(componentName)].join('-');
}

function cpAsset(asset) {
  const assetPkg = path.join('packages', getAssetEntry(asset));
  if (!fs.existsSync(assetPkg)) {
    Promise.reject(new Error(`Non-existent asset package path ${assetPkg} for ${asset}`));
  }
  const destDir = path.join(assetPkg, 'dist', path.basename(asset));
  return cpFile(asset, destDir).then(() => console.log(`cp ${asset} -> ${destDir}`));
}

Promise.all(globSync('build/*.{css,js}').map(cpAsset)).catch((err) => {
  console.error(`Error encountered copying assets: ${err}`);
  process.exit(1);
});
