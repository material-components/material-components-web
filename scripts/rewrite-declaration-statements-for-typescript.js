/**
 * @license
 * Copyright 2017 Google Inc.
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
 * @fileoverview Rewrites JS and TS to match relative path format. That means
 *  * Rewrite import FooConstants from '@material/foo/constants' to import FooConstants from './../foo/index'
 *  * Rewrite import {FooFoundation} from '@material/foo' to import {FooFoundation} from './mdc-foo/index'
 *
 *
 * This script rewrites import statements such that:
 *
 * ```js
 * import [<SPECIFIERS> from] '@material/$PKG[/files...]';
 * ```
 * becomes
 * ```js
 * import [<SPECIFIERS> from] '../<RELATIVE_PATH>/$PKG[/files...]';
 * ```
 * The RELATIVE_PATH is the path relative from the current working file.
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
 * import {thing1, thing2} from 'mdc.thirdparty.thirdPartyLib';
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
 * import {default as someDefaultExport} from 'mdc.thirdparty.thirdPartyLib'
 * ```
 */

const fs = require('fs');
const path = require('path');

const {default: traverse} = require('babel-traverse');
const parser = require('@babel/parser');
const camelCase = require('camel-case');
const glob = require('glob');
const recast = require('recast');
const resolve = require('resolve');
const types = require('babel-types');

const THIRD_PARTY_PATH = 'mdc.thirdparty.';

const alreadyRewrittenImportPaths = new Set();

main(process.argv);

function main(argv) {
  if (argv.length < 3) {
    console.error(`Usage: node ${path.basename(argv[1])} path/to/mdc-web/packages`);
    process.exit(1);
  }

  const packagesDir = path.resolve(process.argv[2]);

  /** @type {!Array<string>} */
  const srcFileAbsolutePaths = glob.sync(`${packagesDir}/**/*.{js,ts}`, {ignore: ['**/node_modules/**']});

  srcFileAbsolutePaths.forEach((srcFileAbsolutePath) => {
    transformSrc(srcFileAbsolutePath);
  });

  logProgress('');
  console.log('\rTransform pass completed. ' + srcFileAbsolutePaths.length + ' files written.\n');
}

function getAstFromCodeString(codeString) {
  return recast.parse(codeString, {
    parser: {
      parse: (code) => parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'classProperties'],
      }),
    },
  });
}

/**
 * @param {string} srcFileAbsolutePath
 */
function transformSrc(srcFileAbsolutePath) {
  const src = fs.readFileSync(srcFileAbsolutePath, 'utf8');
  const ast = getAstFromCodeString(src);

  traverse(ast, {
    ImportDeclaration(path) {
      const packageStr = rewriteDeclarationSource(path.node, srcFileAbsolutePath);
      const {value: sourceValue} = path.node.source;

      const hasThirdPartyTransformed = sourceValue.includes(THIRD_PARTY_PATH);
      if (sourceValue !== packageStr && !hasThirdPartyTransformed) {
        const importDeclaration = types.importDeclaration(path.node.specifiers, types.stringLiteral(packageStr));
        // Preserve comments above import statements, since this is most likely
        // the license comment.
        if (path.node.comments && path.node.comments.length > 0) {
          for (let i = 0; i < path.node.comments.length; i++) {
            const commentValue = path.node.comments[i].value;
            importDeclaration.comments = importDeclaration.comments || [];
            importDeclaration.comments.push({type: 'CommentBlock', value: commentValue});
          }
        }
        path.replaceWith(importDeclaration);
      }
    },
  });

  const {code: outputCode} = recast.print(ast, {
    objectCurlySpacing: false,
    quote: 'single',
    trailingComma: {
      objects: false,
      arrays: true,
      parameters: false,
    },
  });

  fs.writeFileSync(srcFileAbsolutePath, outputCode, 'utf8');
  logProgress(`[rewrite] ${srcFileAbsolutePath}`);
}

/**
 * @param {!Object} astNode
 * @param {string} srcFilePathAbsolute
 * @return {string} New import path
 */
function rewriteDeclarationSource(astNode, srcFilePathAbsolute) {
  const oldImportPath = astNode.source.value;
  let newImportPath = oldImportPath;
  const basedir = path.dirname(srcFilePathAbsolute);

  // TODO: This section of code will need to be revisited when a third party module is used internally.
  // currently we haven't built internal dialog or drawer to actually use this rewrite correctly.
  // Needed for focus-trap.
  if (isThirdPartyModule(oldImportPath)) {
    if (oldImportPath.indexOf('@material') > -1) {
      return oldImportPath;
    }
    patchDefaultImportIfNeeded(astNode);
    newImportPath = `${THIRD_PARTY_PATH}${camelCase(oldImportPath)}`;
    return newImportPath;
  } else {
    if (alreadyRewrittenImportPaths.has(oldImportPath)) {
      return oldImportPath;
    }
    const fileDir = resolve.sync(oldImportPath, {
      basedir,
      extensions: ['.ts', '.js'],
    });
    const srcDirectory = path.dirname(srcFilePathAbsolute);
    newImportPath = './' + getBazelFileNameOrPath(
      path.relative(srcDirectory, fileDir)
        .replace('.js', '')
        .replace('.ts', '')
    );
    alreadyRewrittenImportPaths.add(newImportPath);
    return newImportPath;
  }
}

function patchDefaultImportIfNeeded(astNode) {
  const defaultImportSpecifierIndex =
      astNode.specifiers.findIndex(types.isImportDefaultSpecifier);
  if (defaultImportSpecifierIndex >= 0) {
    const defaultImportSpecifier = astNode.specifiers[defaultImportSpecifierIndex];
    const defaultPropImportSpecifier = types.importSpecifier(defaultImportSpecifier.local, types.identifier('default'));
    astNode.specifiers[defaultImportSpecifierIndex] = defaultPropImportSpecifier;
  }
}

function isThirdPartyModule(importPath) {
  // See: https://nodejs.org/api/modules.html#modules_all_together (step 3)
  const wouldLoadAsFileOrDir = ['./', '/', '../'].some((s) => importPath.indexOf(s) === 0);
  return !wouldLoadAsFileOrDir;
}

function getBazelFileNameOrPath(ossFileNameOrPath) {
  return ossFileNameOrPath
    .replace(/mdc-?/g, '')
    .replace(/material-components-web/g, 'material_components_web')
    .replace(/selection-control/g, 'selection_control')
    .replace(/character-counter/g, 'character_counter')
    .replace(/helper-text/g, 'helper_text')
    .replace(/-/g, '')
  ;
}

function logProgress(msg) {
  console.log(msg);
}
