/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
const babylon = require('babylon');

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
  const ast = babylon.parse(src, {sourceType: 'module'});

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
