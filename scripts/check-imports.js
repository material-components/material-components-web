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
 * @fileoverview Used when testing, this checks a component's import
 * statements to ensure that:
 * - The component is not importing any file outside of the root package
 *   directory.
 * - Any non-relative import (e.g. something imported from node_modules)
 *   is specified within the component's `package.json`
 *
 * If either of these conditions aren't satisfied, this script will fail
 * and exit with a non-zero status.
 *
 * This is needed due to the fact that our packages live in a monorepo, and
 * are built using webpack. Thus it's possible to use an improper import and
 * have it go unnoticed.
 */

const fs = require('fs');
const path = require('path');

const {sync: globSync} = require('glob');
const {default: traverse} = require('babel-traverse');
const parser = require('@babel/parser');

let exitCode = 0;
main();

function main() {
  globSync('packages/**/*.js')
    .filter((p) => !(/\/node_modules\/|\/dist\//).test(p))
    .forEach(check);
  process.exit(exitCode);
}

function check(srcFile) {
  const pkgRoot = findPkgRoot(srcFile);
  const src = fs.readFileSync(srcFile, 'utf8');
  const ast = parser.parse(src, {sourceType: 'module'});

  traverse(ast, {
    'ImportDeclaration'({node}) {
      const {value: source} = node.source;
      if (path.isAbsolute(source)) {
        return error('Import sources may never be absolute paths.', source, srcFile, node);
      }

      const isRelativeImport = ['./', '../'].some((p) => source.indexOf(p) === 0);
      if (isRelativeImport) {
        assertImportResolvesWithinPkgRoot(source, pkgRoot, srcFile, node);
      } else {
        assertModuleImportSpecifiedAsPkgDep(source, pkgRoot, srcFile, node);
      }
      assertNoLocalDirectoryImports(source, pkgRoot, srcFile, node);
    },
  });
}

function findPkgRoot(srcFile) {
  const packagesDir = 'packages';
  const pathFromPackagesDir = path.relative(packagesDir, srcFile);
  const pkgDir = pathFromPackagesDir.split(path.sep)[0];
  return path.join(packagesDir, pkgDir);
}

function assertImportResolvesWithinPkgRoot(source, pkgRoot, srcFile, node) {
  const srcDir = path.dirname(srcFile);
  const resolvedSrc = path.relative(process.cwd(), path.resolve(srcDir, source));
  const relPathFromPkgRoot = path.relative(pkgRoot, resolvedSrc);
  if (relPathFromPkgRoot.indexOf('../') === 0) {
    error(
      `Import source '${source}' is outside of the package root '${pkgRoot}'. ` +
      'Perhaps this should be a module import instead?', source, srcFile, node);
  }
}

function assertNoLocalDirectoryImports(source, pkgRoot, srcFile, node) {
  if (source.indexOf('@material') === -1 && source[0] !== '.') {
    return; // skip check for external dependencies
  }

  const srcDir = path.dirname(srcFile);
  const resolvedSrc = path.relative(process.cwd(), path.resolve(srcDir, source));
  const relPathFromPkgRoot = resolvedSrc.indexOf('@material') > -1 ?
    './packages/mdc-'+resolvedSrc.slice(resolvedSrc.indexOf('@material')+10) :
    './'+resolvedSrc;

  if (!fs.existsSync(path.extname(relPathFromPkgRoot) ?
    relPathFromPkgRoot :
    relPathFromPkgRoot+'.js') &&
    fs.existsSync(relPathFromPkgRoot) &&
    fs.statSync(relPathFromPkgRoot).isDirectory()) {
    error(
      `Import source '${source}' is pointing to a directory.  ` +
      'To maximize compatibility with different module loaders, be specific ' +
      'when importing files local to this project. (e.g. ' +
      `'${source}/index')`, source, srcFile, node);
  }
}

function assertModuleImportSpecifiedAsPkgDep(source, pkgRoot, srcFile, node) {
  const pkgJson = require(path.resolve(pkgRoot, 'package.json'));
  const dependencies = Object.keys(pkgJson.dependencies);
  // NOTE: We test on a partial path here to acommodate imports that resolve to sub-folders/sub-files
  // of deps. E.g. require('@material/foo/bar') where the dep is '@material/foo'
  const sourceSpecifiedAsDep = dependencies.some((dep) => source.indexOf(dep) === 0);
  if (!sourceSpecifiedAsDep) {
    error(
      'Source not specified as a dependency within the component package.json. ' +
      `Dependencies specified are ${dependencies.join(', ')}`, source, srcFile, node);
  }
}

function error(msg, source, srcFile, node) {
  console.error(
    `🚫  ${srcFile}:${node.loc.start.line}:${node.loc.start.column} ` +
    `Invalid import source '${source}': ${msg}`);
  exitCode += 1;
}
