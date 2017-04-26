/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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
 * @fileoverview Rewrites import statements such that:
 *
 * ```js
 * import [<SPECIFIERS> from] '@material/$PKG[/files...]';
 * ```
 * becomes
 * ```js
 * import [<SPECIFIERS> from] 'mdc-$PKG/<RESOLVED_FILE_PATH>';
 * ```
 * The RESOLVED_FILE_PATH is the file that node's module resolution algorithm would have resolved the import
 * source to.
 *
 * This script also handles third-party dependencies, e.g.
 *
 * ```js
 * import {thing1, thing2} from 'third-party-lib';
 * ```
 *
 * becomes
 *
 * ```js
 * import {thing1, thing2} from 'goog:mdc.thirdparty.thirdPartyLib';
 * ```
 *
 * and
 *
 * ```js
 * import someDefaultExport from 'third-party-lib';
 * ```
 *
 * becomes
 *
 * ```js
 * import {default as someDefaultExport} from 'goog:mdc.thirdparty.thirdPartyLib'
 * ```
 *
 * This is so closure is able to properly build and check our files without breaking when it encounters
 * node modules. Note that while closure does have a --module_resolution NODE flag
 * (https://github.com/google/closure-compiler/wiki/JS-Modules#node-resolution-mode), it has inherent problems
 * that prevents us from using it. See:
 * - https://github.com/google/closure-compiler/issues/2386
 *
 * Note that for third-party modules, they must be defined in closure_externs.js. See that file for more info.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {default: traverse} = require('babel-traverse');
const babylon = require('babylon');
const camelCase = require('camel-case');
const glob = require('glob');
const recast = require('recast');
const resolve = require('resolve');
const t = require('babel-types');

main(process.argv);

function main(argv) {
  if (argv.length < 3) {
    console.error('Missing root directory path');
    process.exit(1);
  }

  const rootDir = path.resolve(process.argv[2]);
  const srcFiles = glob.sync(`${rootDir}/**/*.js`);
  srcFiles.forEach((srcFile) => transform(srcFile, rootDir));
}

function transform(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse: (code) => babylon.parse(code, {sourceType: 'module'}),
    },
  });

  traverse(ast, {
    'ImportDeclaration'({node}) {
      rewriteImportDeclaration(node, srcFile, rootDir);
    },
  });

  const {code: outputCode} = recast.print(ast, {
    objectCurlySpacing: false,
    quote: 'single',
    trailingComma: {
      objects: true,
      arrays: true,
      parameters: false,
    },
  });

  fs.writeFileSync(srcFile, outputCode, 'utf8');
  console.log(`[rewrite] ${srcFile}`);
}

function rewriteImportDeclaration(node, srcFile, rootDir) {
  let importSource = node.source.value;
  const pathParts = importSource.split('/');
  const isMDCImport = pathParts[0] === '@material';
  if (isMDCImport) {
    const modName = pathParts[1];  // @material/<modName>
    const atMaterialReplacementPath = `${rootDir}/mdc-${modName}`;
    const rewrittenImportSource = [atMaterialReplacementPath].concat(pathParts.slice(2)).join('/');
    importSource = rewrittenImportSource;
  }

  patchNodeForImportSource(importSource, srcFile, node);
}

function patchNodeForImportSource(importSource, srcFile, node) {
  let resolvedImportSource = importSource;
  // See: https://nodejs.org/api/modules.html#modules_all_together (step 3)
  const wouldLoadAsFileOrDir = ['./', '/', '../'].some((s) => importSource.indexOf(s) === 0);
  const isThirdPartyModule = !wouldLoadAsFileOrDir;
  if (isThirdPartyModule) {
    assert(importSource.indexOf('@material') < 0, '@material/* import sources should have already been rewritten');
    patchDefaultImportIfNeeded(node);
    resolvedImportSource = `goog:mdc.thirdparty.${camelCase(importSource)}`;
  } else {
    const needsClosureModuleRootResolution = path.isAbsolute(importSource);
    if (needsClosureModuleRootResolution) {
      resolvedImportSource = path.relative(rootDir, resolve.sync(importSource, {
        basedir: path.dirname(srcFile),
      }));
    }
  }
  node.source = t.stringLiteral(resolvedImportSource);
}

function patchDefaultImportIfNeeded(node) {
  const defaultImportSpecifierIndex = node.specifiers.findIndex(t.isImportDefaultSpecifier);
  if (defaultImportSpecifierIndex >= 0) {
    const defaultImportSpecifier = node.specifiers[defaultImportSpecifierIndex];
    const defaultPropImportSpecifier = t.importSpecifier(defaultImportSpecifier.local, t.identifier('default'));
    node.specifiers[defaultImportSpecifierIndex] = defaultPropImportSpecifier;
  }
}
