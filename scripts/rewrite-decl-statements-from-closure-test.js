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
 * @fileoverview Rewrites JS to match a es6 format. That means
 *  * Remove goog.module from the top of the source code
 *  * Rewrite exports = {foo, bar}, to export {foo, bar}
 *  * Rewrite exports = Foo, to export default Foo
 *  * Rewrite const Foo = goog.require('mdc.foo'), to import Foo from './foo'
 *  * Rewrite const {foo, bar} = goog.require('mdc.util'), to import {foo, bar} from './util'
 *
 *
 * This script rewrites goog.require statements such that:
 *
 * ```js
 * const [<SPECIFIERS>] = goog.require('mdc.$PKG.<RESOLVED_FILE_NAMESPACE>');
 * ```
 * becomes
 * ```js
 * import [<SPECIFIERS> from] '@material/$PKG[/files...]';
 * ```
 * The RESOLVED_FILE_NAMESPACE is a namespace matching the directory structure.
 *
 * Known issues:
 * 1. Does not handle third-party dependencies, e.g.

 * ```js
 * const {thing1, thing2} = goog.require('goog:mdc.thirdparty.thirdPartyLib');
 * // or
 * const {someDefaultExport} = goog.require('goog:mdc.thirdparty.thirdPartyLib')
 * ```js
 * 2. Whitespace drift.
 * rewriting require statements introduces extra whitespace during for and from
 * scrips. To combat that a separate pass is likely needed to normalize Whitespace
 * around imports/goog.requires
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
let moduleMap = {};

main(process.argv);

function main(argv) {
  if (argv.length < 3) {
    console.error('Missing root directory path');
    process.exit(1);
  }

  const rootDir = path.resolve(process.argv[2]);
  const srcFiles = glob.sync(`${rootDir}/**/*.js`);

  // first pass, looks for goog.module('module.namespace') and creates a map of module.namespaces to
  // path.
  srcFiles.forEach((srcFile) => visit(srcFile, rootDir));
  logProgress('');
  console.log('\r\033[32;1mVisit pass completed.\033[0m\n');

  // second pass, do the transforms.
  srcFiles.forEach((srcFile) => transform(srcFile, rootDir));
  logProgress('');
  console.log('\r\033[32;1mTransform pass completed.\033[0m\n');
}

function logProgress(msg) {
  if (logProgress.__prev_msg_length) {
    const lineClear = ' '.repeat(logProgress.__prev_msg_length + 10);
    process.stdout.write('\r' + lineClear);
  }
  logProgress.__prev_msg_length = msg.length;
  process.stdout.write('\r' + msg);
}

function visit(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  let moduleNamespace = '';
  let moduleName = '';
  const ast = recast.parse(src, {
    parser: {
      parse: (code) => babylon.parse(code, {sourceType: 'script'}),
    },
  });

  // Produce moduleMap. Pam of namespaces to paths where that namespace is declared.
  traverse(ast, {
    MemberExpression(path) {
      if (path.node.object.type === 'Identifier' && path.node.property.type === 'Identifier'
          && path.node.object.name === 'goog' && path.node.property.name === 'module') {
        const fullyQualifiedModuleName = path.container.arguments[0].value;
        const namespaceArray = fullyQualifiedModuleName.split('.');
        const relativePath = srcFile.substr(rootDir.length);
        // Assign outerscoped module name and namespace to be used in other transforms.
        if (srcFile.indexOf('index.js') != srcFile.length - 8) {
          moduleName = namespaceArray.pop();
        } else {
          moduleName = 'index';
        }
        moduleMap[fullyQualifiedModuleName] = relativePath.substr(0, relativePath.lastIndexOf('.js'));
        moduleNamespace = namespaceArray.join('.');
      }
    }
  });
}

function transform(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  let moduleNamespace = '';
  let moduleName = '';
  const ast = recast.parse(src, {
    parser: {
      parse: (code) => babylon.parse(code, {sourceType: 'script'}),
    },
  });

  traverse(ast, {
    MemberExpression(path) {
      if (path.node.object.type === 'Identifier' && path.node.property.type === 'Identifier'
          && path.node.object.name === 'goog' && path.node.property.name === 'module') {
        const fullyQualifiedModuleName = path.container.arguments[0].value;
        const namespaceArray = fullyQualifiedModuleName.split('.');
        // Assign outerscoped module name and namespace to be used in other transforms.
        if (srcFile.indexOf('index.js') != srcFile.length - 8) {
          moduleName = namespaceArray.pop();
        } else {
          moduleName = 'index';
        }
        moduleNamespace = namespaceArray.join('.');
        //console.log('setting: ' + moduleNamespace);
        path.parentPath.remove();
      }
    }
  });

  // Rewrite `export = STUFF;` conversion to `exports SIMILAR_STUFF;`
  traverse(ast, {
    ExpressionStatement(path) {
      const expression = path.node.expression;
      if (expression.operator === "=" && expression.left.type === "Identifier" && expression.left.name === "exports") {
        // Looks for expression statements that look like: exports = SOMETHING;
        if (path.node.expression.right.type === "Identifier") {
          // if expression looks like: exports = MDCSomething;
          const declaration = t.exportDefaultDeclaration(t.identifier(path.node.expression.right.name));
          // rewrite as: export default MDCSomething;
          path.replaceWith(declaration);
        } else if (expression.right.type === "ObjectExpression") {
          // expression looks like exports = {MDCSomething1, Something2, etc};
          const specifiers = [];
          path.node.expression.right.properties.forEach((objectProperty) => {
            specifiers.push(t.exportSpecifier(objectProperty.key, objectProperty.key));
          });
          const namedDeclaration = t.exportNamedDeclaration(null, specifiers);
          // rewrite as: export {MDCSomething1, Something2, etc};
          path.replaceWith(namedDeclaration)
        }
      }
    },
  });

  // Rewrite all the goog.require
  traverse(ast, {
    VariableDeclaration(path) {
      const expression = path.node.expression;
      // Consider all const SOMETHING = SOME_INIT;
      if (path.node.kind === "const" && path.node.declarations && path.node.declarations.length > 0) {
        const declaration = path.node.declarations[0];
        // SOME_INIT is goog.require(SOME_NAMESPACE)
        if (declaration.type === 'VariableDeclarator' && declaration.init.type === 'CallExpression' &&
            declaration.init.callee.type === "MemberExpression" &&
            declaration.init.callee.object.type === "Identifier" && declaration.init.callee.object.name === 'goog' &&
            declaration.init.callee.property.type === 'Identifier' && declaration.init.callee.property.name === 'require' ) {

          const requireNamespace = declaration.init.arguments[0].value;
          const isRelativePath = requireNamespace.indexOf(moduleNamespace) === 0;
          let modulePath = moduleMap[requireNamespace];
          let importPath = '';
          const relativeFilePath = srcFile.substr(rootDir.length);
          const currentDirectoryPath = relativeFilePath.substr(0, relativeFilePath.lastIndexOf('/'));
          if (isRelativePath) {
            importPath = '.' + modulePath.substr(currentDirectoryPath.length);
          } else {
            importPath = modulePath.replace('/mdc-', '@material/');
          }

          let typeName = '';
          let importDeclaration = null;
          if (declaration.id.type === 'Identifier') {
            typeName = declaration.id.name;
            // import {typeName} from {normalizedPath};
            const requiredType = requireNamespace.substr(requireNamespace.lastIndexOf('.') + 1);
            if (typeName == requiredType) {
              const specifier = t.importNamespaceSpecifier(t.identifier(typeName));
              importDeclaration = t.importDeclaration([specifier], t.stringLiteral(importPath));
            } else {
              const specifier = t.importDefaultSpecifier(t.identifier(typeName));
              importDeclaration = t.importDeclaration([specifier], t.stringLiteral(importPath));
            }
          } else if (declaration.id.type === 'ObjectPattern') {
            let objString = '';
            const specifiers = [];
            for (let i = 0; i < declaration.id.properties.length; i++) {
              const typeName = declaration.id.properties[i].key.name;
              const specifier = t.importSpecifier(t.identifier(typeName), t.identifier(typeName));
              specifiers.push(specifier);
            }
            importDeclaration = t.importDeclaration(specifiers, t.stringLiteral(importPath));
          }

          // Preserve comments above import statements, since this is most likely the license comment.
          if (path.node.comments && path.node.comments.length > 0) {
            for (let i = 0; i < path.node.comments.length; i++) {
              const commentValue = path.node.comments[i].value;
              importDeclaration.comments = importDeclaration.comments || [];
              importDeclaration.comments.push({type: 'CommentBlock', value: commentValue});
            }
          }

          path.replaceWith(importDeclaration);
        }
      }
    }
  });

  let {code: outputCode} = recast.print(ast, {
    objectCurlySpacing: false,
    reuseWhitespace: true,
    quote: 'single',
    trailingComma: {
      objects: true,
      arrays: true,
      parameters: false,
    },
  });

  fs.writeFileSync(srcFile, outputCode, 'utf8');
  logProgress(`\r[rewrote] ${srcFile}`);
}
