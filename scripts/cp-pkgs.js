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

const cpFile = require('cp-file');
const dts = require('dts-bundle');
const fs = require('fs');
const path = require('path');
const toSlugCase = require('to-slug-case');
const {spawnSync} = require('child_process');
const {sync: globSync} = require('glob');

const ALL_IN_ONE_PACKAGE = 'material-components-web';
const DECLARATION_FILE_PREFIX = 'mdc-';
const D_TS_DIRECTORY = path.resolve(__dirname, '../build/packages');
const PKG_RE = /(?:material\-components\-web)|(?:mdc\.[a-zA-Z\-]+)/;

const isValidCwd = (
  path.basename(process.cwd()) === ALL_IN_ONE_PACKAGE &&
  fs.existsSync('packages') &&
  fs.existsSync('build')
);

if (!isValidCwd) {
  console.error(
    'Invalid CWD. Please ensure you are running this from the root of the repo, and that you have run `npm run dist`'
  );
  process.exit(1);
}


/**
 * @param {string} dashedName A dash-separated package name. E.g., "mdc-linear-progress".
 * @return {string} dashedName converted to camelCase. E.g., "mdcLinearProgress".
 */
function toCamelCase(dashedName) {
  return dashedName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Cleans the /dist directory of each package.
 */
function cleanPkgDistDirs() {
  const statuses = globSync('packages/*/dist').map(
    (distPath) => spawnSync('rm', ['-r', distPath], {stdio: 'inherit'}).status);

  if (statuses.find((status) => status > 0)) {
    console.error('Failed to clean package dist folders prior to copying');
    process.exit(1);
  }
}

/**
 * @param {string} asset filepath relative to the root directory
 * @returns {string} destination package name
 */
function getAssetEntry(asset) {
  const [entryName] = path.parse(asset).name.match(PKG_RE);
  const [MDC, componentName] = entryName.split('.');
  const dealingWithSubpackage = Boolean(MDC && componentName);
  if (!dealingWithSubpackage) {
    return entryName;
  }
  return [MDC, toSlugCase(componentName)].join('-');
}

/**
 * @param {string} asset filepath relative to the root directory
 * @returns {Promise<void>}
 */
async function cpAsset(asset) {
  const assetPkg = path.join('packages', getAssetEntry(asset));
  if (!fs.existsSync(assetPkg)) {
    return Promise.reject(new Error(`Non-existent asset package path ${assetPkg} for ${asset}`));
  }
  const destDir = path.join(assetPkg, 'dist', path.basename(asset));
  return cpFile(asset, destDir).then(
    () => console.log(`cp ${asset} -> ${destDir}`),
    (err) => {
      throw err;
    }
  );
}

/**
 * Imports all files in index.d.ts and compiles a bundled .d.ts file for
 * UMD files.
 */
function dtsBundler() {
  const packageDirectories = fs.readdirSync(D_TS_DIRECTORY);
  packageDirectories.forEach((packageDirectory) => {
    const main = path.resolve(D_TS_DIRECTORY, packageDirectory, './index.d.ts');
    dts.bundle({
      name: packageDirectory,
      main,
    });
  });
}

/**
 * @param {string} asset filepath relative to the root directory
 * @param {string} assetPkg directory path to destination package
 * @returns {string} destination filepath for UMD declaration file.
 */
function getDeclarationFileName(asset, assetPkg) {
  const packageName = path.parse(asset).name.replace(/^mdc-|\.d$/g, '');
  const isAllInOne = packageName === ALL_IN_ONE_PACKAGE;
  const destFileName = isAllInOne ? packageName : `mdc.${toCamelCase(packageName)}`;
  return path.join(assetPkg, 'dist', `${destFileName}.d.ts`);
}

/**
 * Copies the declaration file from the /build directory to its respective
 * destination directory.
 * @param {string} asset filepath relative to the root directory
 * @returns {Promise<void>}
 */
async function cpDeclarationAsset(asset) {
  const assetPkg = path.parse(asset.split('build/')[1]).dir;
  if (!fs.existsSync(assetPkg)) {
    return Promise.reject(new Error(`Non-existent asset package path ${assetPkg} for ${asset}`));
  }

  const destDir = getDeclarationFileName(asset, assetPkg);
  return cpFile(asset, destDir).then(
    () => console.log(`cp ${asset} -> ${destDir}`),
    (err) => {
      throw err;
    }
  );
}

/*
 * 1. Cleans all /dist directories in each package
 * 2. Copies generated css, js, and map files to the respective packages
 * 3. Bundles the declaration files into one file for the UMD index.js file
 * 4. Copies the generated declaration file from step 3, into the respective pacakge
 */
cleanPkgDistDirs();

Promise.all(globSync('build/*.{css,js,map}').map(cpAsset)).catch((err) => {
  console.error('Error encountered copying assets:', err);
  process.exit(1);
});

// this method builds the files that the next lines copy to each package
dtsBundler();

Promise.all(
  globSync(`build/packages/**/{${DECLARATION_FILE_PREFIX},${ALL_IN_ONE_PACKAGE}}*.d.ts`)
    .map(cpDeclarationAsset)
).catch((err) => {
  console.error('Error encountered copying assets:', err);
  process.exit(1);
});
