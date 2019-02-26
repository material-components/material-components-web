/**
 * @license
 * Copyright 2019 Google Inc.
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
 * @fileoverview Custom linter script that warns us when we deviate from best practices.
 */

const fs = require('fs');
const glob = require('glob');
const parser = require('@babel/parser');
const path = require('path');
const recast = require('recast');
const resolve = require('resolve');
const colors = require('colors/safe');
const {default: traverse} = require('babel-traverse');

let violationCount = 0;

const packagesDir = path.resolve(__dirname, '../packages');

lintAllFiles();

function lintAllFiles() {
  const searchPattern = path.join(packagesDir, '**/*.ts');
  const inputFilePaths = glob.sync(searchPattern, {nodir: true, ignore: ['**/node_modules/**']});

  const customLinterAnsi = colors.bold.yellow('Custom Linter');
  console.log(`${customLinterAnsi}: Checking ${inputFilePaths.length.toLocaleString()} TypeScript files...\n`);

  for (const inputFilePath of inputFilePaths) {
    const inputCode = fs.readFileSync(inputFilePath, 'utf8');
    lintOneFile(inputFilePath, inputCode);
  }

  const violationCountAnsi = colors.bold(violationCount);
  const plural = violationCount === 1 ? '' : 's';
  console.log(`\n${violationCountAnsi} Custom Linter error${plural}\n`);
}

/**
 * @param {string} inputFilePath
 * @param {string} inputCode
 */
function lintOneFile(inputFilePath, inputCode) {
  checkAllImportPaths(inputFilePath, inputCode);
}

/**
 * @param {string} inputFilePath
 * @param {string} inputCode
 */
function checkAllImportPaths(inputFilePath, inputCode) {
  const ast = getAstFromCodeString(inputCode);

  traverse(ast, {
    ExportDeclaration(oldExportDeclaration) {
      checkOneImportPath(oldExportDeclaration, inputFilePath);
    },
    ImportDeclaration(oldImportDeclaration) {
      checkOneImportPath(oldImportDeclaration, inputFilePath);
    },
  });
}

/**
 * @param {!Object} importOrExportDeclaration
 * @param {string} inputFilePath
 */
function checkOneImportPath(importOrExportDeclaration, inputFilePath) {
  // Ensure exports have a `from '...'` qualifier.
  if (!importOrExportDeclaration.node.source) {
    return;
  }

  const inputFileDir = path.dirname(inputFilePath);

  /** @type {string} */
  const importPath = importOrExportDeclaration.node.source.value;
  const importPathAnsi = colors.bold(importPath);

  if (new RegExp('^@material/[^/]+$').test(importPath)) {
    logLinterViolation(
      inputFilePath,
      // eslint-disable-next-line max-len
      `Import path '${importPathAnsi}' resolves to a transpiled JS file instead of a TS source file. Please include the extension-less filename of the specific file you wish to import. E.g.: '${importPath}/index'`
    );
  }

  if (importPath.indexOf('../mdc-') > -1 || importPath.indexOf('../material-components-web') > -1) {
    logLinterViolation(
      inputFilePath,
      // eslint-disable-next-line max-len
      `Import path '${importPathAnsi}' appears to be a relative path to another package. Please use a @material import instead. E.g.: import '@material/foo/types' instead of import '../mdc-foo/types'.`
    );
  }

  if (importPath.indexOf('./') > -1) {
    /** @type {string} */
    const resolvedPath = resolve.sync(importPath, {basedir: inputFileDir, extensions: ['.ts', '.js']});
    let relativePath = path.relative(inputFileDir, resolvedPath);
    if (!relativePath.startsWith('./') && !relativePath.startsWith('../')) {
      relativePath = `./${relativePath}`;
    }
    const pointsToTSFile = relativePath === `${importPath}.ts`;
    if (!pointsToTSFile) {
      logLinterViolation(
        inputFilePath,
        // eslint-disable-next-line max-len
        `Import path '${importPathAnsi}' should point directly to a specific TypeScript file. E.g.: import '${relativePath.replace('.ts', '')}'`
      );
    }
  }

  const importPathIsComponent = importPath.endsWith('/index') || importPath.endsWith('/component');
  const inputFileIsComponent = inputFilePath.endsWith('/index.ts') || inputFilePath.endsWith('/component.ts');
  if (importPathIsComponent && !inputFileIsComponent) {
    logLinterViolation(
      inputFilePath,
      // eslint-disable-next-line max-len
      `Import path '${importPathAnsi}' is only allowed in component.ts and index.ts files. Please import a more specific file (e.g., adapter.ts, foundation.ts, or types.ts). This keeps bite sizes smaller for wrapper libraries that only use our foundations.`
    );
  }
}

// TODO(acdvorak): Add `fix:custom` support for rewriting the AST?
function logLinterViolation(inputFilePath, message) {
  const errorAnsi = colors.red('ERROR');
  const inputFilePathAnsi = colors.bold(path.relative(packagesDir, inputFilePath));
  console.error(`[${errorAnsi}] ${inputFilePathAnsi}: ${message}`);
  process.exitCode = 1;
  violationCount++;
}

/**
 * @param {string} inputCode
 * @return {!Object} AST for inputCode
 */
function getAstFromCodeString(inputCode) {
  return recast.parse(inputCode, {
    parser: {
      parse: (code) => parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'classProperties'],
      }),
    },
  });
}
