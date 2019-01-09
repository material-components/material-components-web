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
 * (https://github.com/google/closure-compiler/wiki/JS-Modules#node-resolution-mode),
 * it has inherent problems that prevents us from using it. See:
 * - https://github.com/google/closure-compiler/issues/2386
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
const defaultTypesMap = {};

main(process.argv);

function main(argv) {
  if (argv.length < 3) {
    console.error('Missing root directory path');
    process.exit(1);
  }

  const rootDir = path.resolve(process.argv[2]);
  const srcFiles = glob.sync(`${rootDir}/**/*.{js,ts}`);

  // first pass, construct a map of default exports (adapters, foundations,
  // components).
  srcFiles.forEach((srcFile) => visit(srcFile, rootDir));
  logProgress('');
  console.log('\rVisit pass completed. ' + Object.keys(defaultTypesMap).length + ' default types found.\n');

  // second pass rewrite imports with relative file path declarations
  srcFiles.forEach((srcFile) => transform(srcFile, rootDir));
  logProgress('');
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

function visit(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  logProgress(`[processing] ${srcFile}`);
  const ast = getAstFromCodeString(src);

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const pathbasedPackageName = getPathbasedPackage(rootDir, srcFile);
      const packageNameParts = pathbasedPackageName.split('.');
      packageNameParts.pop();
      packageNameParts.push(path.node.declaration.name);
      const packageName = packageNameParts.join('.');
      defaultTypesMap[pathbasedPackageName] = packageName;
    },
  });
}

function transform(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  const ast = getAstFromCodeString(src);

  traverse(ast, {
    ImportDeclaration(path) {
      const callee = t.memberExpression(t.identifier('goog'), t.identifier('require'), false);
      const packageStr = rewriteDeclarationSource(path.node, srcFile, rootDir);
      // console.log(' ')
      // console.log(packageStr)
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

      // Preserve comments above import statements, since this is most likely
      // the license comment.
      if (path.node.comments && path.node.comments.length > 0) {
        for (let i = 0; i < path.node.comments.length; i++) {
          const commentValue = path.node.comments[i].value;
          variableDeclaration.comments = variableDeclaration.comments || [];
          variableDeclaration.comments.push({type: 'CommentBlock', value: commentValue});
        }
      }
      // console.log('')
      // console.log(variableDeclaration)

      path.replaceWith(variableDeclaration);
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

  let packageStr = '';
  const pathbasedPackageName = getPathbasedPackage(rootDir, srcFile);
  if (pathbasedPackageName in defaultTypesMap) {
    packageStr = defaultTypesMap[pathbasedPackageName];
  } else {
    packageStr = pathbasedPackageName;
  }

  // Specify goog.module after the @license comment and append newline at the end of the file.
  // First, get the first occurrence of a multiline comment terminator with 0 or more preceding whitespace characters.
  const result = /\s*\*\//.exec(outputCode);

  if (!result) {
    const data = JSON.stringify({
      srcFile,
      pathbasedPackageName,
      packageStr,
      outputCode,
    }, null, 2);

    const message = `
Missing multiline comment terminator!

${data}
`.trim();

    throw new Error(message);
  }

  // Then, get the index of that first matching character set plus the length of the matching characters, plus one
  // extra character for more space. We now have the position at which we need to inject the "goog.module(...)"
  // declaration and can assemble the module-declared code. Yay!
  // const pos = result.index + result[0].length + 1;
  // outputCode = outputCode.substr(0, pos) + '\ngoog.module(\'' + packageStr + '\');\n' + outputCode.substr(pos);
  fs.writeFileSync(srcFile, outputCode, 'utf8');
  logProgress(`[rewrite] ${srcFile}`);
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
  const basedir = path.dirname(srcFile);
  // See: https://nodejs.org/api/modules.html#modules_all_together (step 3)
  const wouldLoadAsFileOrDir = ['./', '/', '../'].some((s) => source.indexOf(s) === 0);
  const isThirdPartyModule = !wouldLoadAsFileOrDir;
  if (isThirdPartyModule) {
    assert(source.indexOf('@material') < 0, '@material/* import sources should have already been rewritten');
    patchDefaultImportIfNeeded(node);
    resolvedSource = `mdc.thirdparty.${camelCase(source)}`;
    return resolvedSource;
  } else {
    // const normPath = path.normalize(basedir, source);
    // console.log('normPath')
    // console.log(normPath)
    rootDir = path.resolve(__dirname, '../.typescript-tmp/packages');
    const fileDir = resolve.sync(source, {
      basedir,
      extensions: ['.ts', '.js'],
    });
    resolvedSource = path.relative(rootDir, fileDir);

    console.log('--resolvedSource');
    console.log(fileDir);

    const packageParts = resolvedSource
      .replace('mdc-', '')
      .replace(/-/g, '')
      .replace('.js', '')
      .replace('.ts', '')
      .split('/');
    const packageStr = 'mdc.' + packageParts.join('.').replace('.index', '');
    if (packageStr in defaultTypesMap) {
      return defaultTypesMap[packageStr];
    }
    return packageStr;
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

function getPathbasedPackage(rootDir, srcFile) {
  const relativePath = path.relative(rootDir, srcFile);
  const packageParts = relativePath
    .replace('mdc-', '')
    .replace(/-/g, '')
    .replace('.js', '')
    .replace('.ts', '')
    .split('/');
  const packageStr = 'mdc.' + packageParts.join('.').replace('.index', '');
  return packageStr;
}

function logProgress(msg) {
  if (logProgress.__prev_msg_length) {
    const lineClear = ' '.repeat(logProgress.__prev_msg_length + 10);
    process.stdout.write('\r' + lineClear);
  }
  logProgress.__prev_msg_length = msg.length;
  process.stdout.write('\r' + msg);
}
