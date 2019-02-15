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
const {spawnSync} = require('child_process');
const {sync: globSync} = require('glob');
const {dtsBundler} = require('./build/dts-bundler.js');

const PKG_RE = /(?:material\-components\-web)|(?:mdc\.[a-zA-Z\-]+)/;
const DECLARATION_FILE_PREFIX = 'mdc-';

const isValidCwd = (
  path.basename(process.cwd()) === 'material-components-web' &&
  fs.existsSync('packages') &&
  fs.existsSync('build')
);

if (!isValidCwd) {
  console.error(
    'Invalid CWD. Please ensure you are running this from the root of the repo, and that you have run `npm run dist`'
  );
  process.exit(1);
}

function toCamelCase(name) {
  const nameParts = name.split('-');
  if (nameParts.length <= 1) {
    return name;
  }

  return nameParts.reduce((finalName, part, index) => {
    if (index === 0) return part;
    return finalName + part[0].toUpperCase() + part.slice(1);
  }, '');
}

function cleanPkgDistDirs() {
  const statuses = globSync('packages/*/dist').map(
    (distPath) => spawnSync('rm', ['-r', distPath], {stdio: 'inherit'}).status);

  if (statuses.find((status) => status > 0)) {
    console.error('Failed to clean package dist folders prior to copying');
    process.exit(1);
  }
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
  return cpFile(asset, destDir).then(
    () => console.log(`cp ${asset} -> ${destDir}`),
    (err) => {
      throw err;
    }
  );
}

function cpDeclarationAsset(asset) {
  const assetPkg = path.parse(asset.split('build/')[1]).dir;
  if (!fs.existsSync(assetPkg)) {
    Promise.reject(new Error(`Non-existent asset package path ${assetPkg} for ${asset}`));
  }
  const destFileName = toCamelCase(path.parse(asset).name.replace(/^mdc-|\.d$/g, ''));
  const destDir = path.join(assetPkg, 'dist', `mdc.${destFileName}.d.ts`);
  return cpFile(asset, destDir).then(
    () => console.log(`cp ${asset} -> ${destDir}`),
    (err) => {
      throw err;
    }
  );
}

cleanPkgDistDirs();

Promise.all(globSync('build/*.{css,js,map}').map(cpAsset)).catch((err) => {
  console.error(`Error encountered copying assets: ${err}`);
  process.exit(1);
});

/**
 * this method builds the files that the next lines copy to each package
 */
dtsBundler();

Promise.all(globSync(`build/packages/**/${DECLARATION_FILE_PREFIX}*.d.ts`).map(cpDeclarationAsset)).catch((err) => {
  console.error(`Error encountered copying assets: ${err}`);
  process.exit(1);
});
