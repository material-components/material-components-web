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
 * @fileoverview Rewrites JS to match relative path format. That means
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
 * import [<SPECIFIERS> from] '$PKG.<RESOLVED_FILE_NAMESPACE>';
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
 * import {default: someDefaultExport} from 'mdc.thirdparty.thirdPartyLib'
 * ```
 *
 * Note that for third-party modules, they must be defined in closure_externs.js. See that file for more info.
 * Also note that this works on `export .... from ...` as well.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {default: traverse} = require('babel-traverse');
const parser = require('@babel/parser');
const camelCase = require('camel-case');
const glob = require('glob');
const recast = require('recast');
const resolve = require('resolve');
const t = require('babel-types');

const THIRD_PARTY_PATH = 'mdc.thirdparty.';

main(process.argv);

function main(argv) {
  if (argv.length < 3) {
    console.error('Missing root directory path');
    process.exit(1);
  }

  const rootDir = path.resolve(process.argv[2]);
  const srcFiles = glob.sync(`${rootDir}/**/*.{js,ts}`);

  srcFiles.forEach((srcFile) => transform(srcFile, rootDir));
  // for debugging
  // srcFiles.forEach((srcFile, i) => console.log(srcFile, i));
  // srcFiles.forEach((srcFile, i) => {
  //   if (i === 27) {
  //     transform(srcFile, rootDir);
  //   }
  // });
  // logProgress('');
  console.log('\rTransform pass completed. ' + srcFiles.length + ' files written.\n');
}

function getAstFromCodeString(codeString) {
  return recast.parse(codeString, {
    parser: {
      parse: (code) => parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript'],
      }),
    },
  });
}

function transform(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  const ast = getAstFromCodeString(src);

  traverse(ast, {
    ImportDeclaration(path) {
      const packageStr = rewriteDeclarationSource(path.node, srcFile, rootDir);
      const {value: sourceValue} = path.node.source;
      
      // if 3rd p and contains mdc.thirdparty. return
      const hasThirdPartyTransformed = sourceValue.includes(THIRD_PARTY_PATH);
      if (sourceValue !== packageStr && !hasThirdPartyTransformed) {
        const importDeclaration = t.importDeclaration(path.node.specifiers, t.stringLiteral(packageStr));
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

  fs.writeFileSync(srcFile, outputCode, 'utf8');
  logProgress(`[rewrite] ${srcFile}`);
}

function rewriteDeclarationSource(node, srcFile, rootDir) {
  let source = node.source.value;
  const pathParts = source.split('/');
  const isMDCImport = pathParts[0] === '@material';

  // format `source` for @material/foo imports
  if (isMDCImport) {
    const modName = pathParts[1]; // @material/<modName>
    const atMaterialReplacementPath = `${rootDir}/mdc-${modName}`;
    const rewrittenSource = [atMaterialReplacementPath].concat(pathParts.slice(2)).join('/');
    source = rewrittenSource;
  }

  return patchNodeForDeclarationSource(source, srcFile, rootDir, node);
}

function isThirdPartyModule(source) {
  const wouldLoadAsFileOrDir = ['./', '/', '../'].some((s) => source.indexOf(s) === 0);
  return !wouldLoadAsFileOrDir;
}

function patchNodeForDeclarationSource(source, srcFile, rootDir, node) {
  let resolvedSource = source;
  const basedir = path.dirname(srcFile);
  // See: https://nodejs.org/api/modules.html#modules_all_together (step 3)
  if (isThirdPartyModule(source)) {
    // for focus-trap
    assert(source.indexOf('@material') < 0, '@material/* import sources should have already been rewritten');
    patchDefaultImportIfNeeded(node);
    resolvedSource = `${THIRD_PARTY_PATH}${camelCase(source)}`;
    return resolvedSource;
  } else {
    const fileDir = resolve.sync(source, {
      basedir,
      extensions: ['.ts', '.js'],
    });
    const srcDirectory = path.dirname(srcFile);
    resolvedSource = path.relative(srcDirectory, fileDir);

    const packageStr = resolvedSource
      .replace('.js', '')
      .replace('.ts', '')
      .replace('.index', '');
    return `./${packageStr}`;
  }
}

function patchDefaultImportIfNeeded(node) {
  const defaultImportSpecifierIndex =
      node.specifiers.findIndex(t.isImportDefaultSpecifier);
  if (defaultImportSpecifierIndex >= 0) {
    const defaultImportSpecifier = node.specifiers[defaultImportSpecifierIndex];
    const defaultPropImportSpecifier = t.importSpecifier(defaultImportSpecifier.local, t.identifier('default'));
    node.specifiers[defaultImportSpecifierIndex] = defaultPropImportSpecifier;
  }
}

function logProgress(msg) {
  if (logProgress.__prev_msg_length) {
    const lineClear = ' '.repeat(logProgress.__prev_msg_length + 10);
    process.stdout.write('\r' + lineClear);
  }
  logProgress.__prev_msg_length = msg.length;
  process.stdout.write('\r' + msg);
}
