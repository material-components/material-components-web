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
 * @fileoverview Rewrites JS to match a goog.module format. That means
 *  * Add goog.module to the top of the source code
 *  * Rewrite export {foo, bar} to exports = {foo, bar}
 *  * Rewrite export default Foo, to exports = Foo
 *  * Rewrite import Foo from './foo' to const Foo = goog.require('mdc.foo')
 *  * Rewrite import {foo, bar} from './util' to const {foo, bar} = goog.require('mdc.util')
 *
 *
 * This script rewrites import statements such that:
 *
 * ```js
 * import [<SPECIFIERS> from] '@material/$PKG[/files...]';
 * ```
 * becomes
 * ```js
 * const [<SPECIFIERS>] = goog.require('mdc.$PKG.<RESOLVED_FILE_NAMESPACE>');
 * ```
 * The RESOLVED_FILE_NAMESPACE is a namespace matching the directory structure.
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
 * const {thing1, thing2} = goog.require('goog:mdc.thirdparty.thirdPartyLib');
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
 * const {someDefaultExport} = goog.require('goog:mdc.thirdparty.thirdPartyLib')
 * ```
 *
 * This is so closure is able to properly build and check our files without breaking when it encounters
 * node modules. Note that while closure does have a --module_resolution NODE flag
 * (https://github.com/google/closure-compiler/wiki/JS-Modules#node-resolution-mode), it has inherent problems
 * that prevents us from using it. See:
 * - https://github.com/google/closure-compiler/issues/2386
 *
 * Note that for third-party modules, they must be defined in closure_externs.js. See that file for more info.
 * Also note that this works on `export .... from ...` as well.
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
    ExportNamedDeclaration(path) {
      const properties = [];
      path.node.specifiers.forEach((specifier) => {
        properties.push(t.objectProperty(specifier.exported, specifier.exported, false, true, []));
      });
      const right = t.objectExpression(properties);
      const expression = t.assignmentExpression('=', t.identifier('exports'), right);
      path.replaceWith(t.expressionStatement(expression));
    },
  });

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const expression = t.assignmentExpression('=', t.identifier('exports'), path.node.declaration);
      path.replaceWith(t.expressionStatement(expression));
    },
  });

  traverse(ast, {
    ImportDeclaration(path) {
      const callee = t.memberExpression(t.identifier('goog'), t.identifier('require'), false);
      const packageStr = rewriteDeclarationSource(path.node, srcFile, rootDir);
      const callExpression = t.callExpression(callee, [t.stringLiteral(packageStr)]);

      let variableDeclaratorId;
      if (path.node.specifiers.length > 1 || (src.substr(path.node.specifiers[0].start - 1, 1) === '{')) {
        const properties = [];
        path.node.specifiers.forEach((specifier) => {
          properties.push(t.objectProperty(specifier.local, specifier.local, false, true, []));
        });
        variableDeclaratorId = t.objectPattern(properties);
      } else {
        variableDeclaratorId = path.node.specifiers[0].local;
      }

      const variableDeclarator = t.variableDeclarator(variableDeclaratorId, callExpression);
      const variableDeclaration = t.variableDeclaration('const', [variableDeclarator]);
      // Preserve comments above import statements, since this is most likely the license comment.
      if (path.node.comments && path.node.comments.length > 0) {
        const commentValue = path.node.comments[0].value;
        variableDeclaration.comments = variableDeclaration.comments || [];
        variableDeclaration.comments.push({type: 'CommentBlock', value: commentValue});
      }
      path.replaceWith(variableDeclaration);
    },
  });

  let {code: outputCode} = recast.print(ast, {
    objectCurlySpacing: false,
    quote: 'single',
    trailingComma: {
      objects: true,
      arrays: true,
      parameters: false,
    },
  });

  const relativePath = path.relative(rootDir, srcFile);
  const packageParts = relativePath.replace('mdc-', '').replace(/-/g, '').replace('.js', '').split('/');
  const packageStr = 'mdc.' + packageParts.join('.').replace('.index', '');

  outputCode = 'goog.module(\'' + packageStr + '\');\n' + outputCode;
  fs.writeFileSync(srcFile, outputCode, 'utf8');
  console.log(`[rewrite] ${srcFile}`);
}

function rewriteDeclarationSource(node, srcFile, rootDir) {
  let source = node.source.value;
  const pathParts = source.split('/');
  const isMDCImport = pathParts[0] === '@material';
  if (isMDCImport) {
    const modName = pathParts[1]; // @material/<modName>
    const atMaterialReplacementPath = `${rootDir}/mdc-${modName}`;
    const rewrittenSource = [atMaterialReplacementPath].concat(pathParts.slice(2)).join('/');
    source = rewrittenSource;
  }

  return patchNodeForDeclarationSource(source, srcFile, rootDir, node);
}

function patchNodeForDeclarationSource(source, srcFile, rootDir, node) {
  let resolvedSource = source;
  // See: https://nodejs.org/api/modules.html#modules_all_together (step 3)
  const wouldLoadAsFileOrDir = ['./', '/', '../'].some((s) => source.indexOf(s) === 0);
  const isThirdPartyModule = !wouldLoadAsFileOrDir;
  if (isThirdPartyModule) {
    assert(source.indexOf('@material') < 0, '@material/* import sources should have already been rewritten');
    patchDefaultImportIfNeeded(node);
    resolvedSource = `goog:mdc.thirdparty.${camelCase(source)}`;
  } else {
    const normPath = path.normalize(path.dirname(srcFile), source);
    const needsClosureModuleRootResolution = path.isAbsolute(source) || fs.statSync(normPath).isDirectory();
    if (needsClosureModuleRootResolution) {
      resolvedSource = path.relative(rootDir, resolve.sync(source, {
        basedir: path.dirname(srcFile),
      }));
    }
  }
  const packageParts = resolvedSource.replace('mdc-', '').replace(/-/g, '').replace('.js', '').split('/');
  const packageStr = 'mdc.' + packageParts.join('.').replace('.index', '');
  return packageStr;
}

function patchDefaultImportIfNeeded(node) {
  const defaultImportSpecifierIndex = node.specifiers.findIndex(t.isImportDefaultSpecifier);
  if (defaultImportSpecifierIndex >= 0) {
    const defaultImportSpecifier = node.specifiers[defaultImportSpecifierIndex];
    const defaultPropImportSpecifier = t.importSpecifier(defaultImportSpecifier.local, t.identifier('default'));
    node.specifiers[defaultImportSpecifierIndex] = defaultPropImportSpecifier;
  }
}
