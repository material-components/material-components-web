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
 * @fileoverview Used within pre-release.sh, this checks a component's package.json
 * to ensure that if it's a new component (version = "0.0.0"), it will have a proper
 * "publishConfig.access" property set to "public".
 * The argument should be the package.json file to check.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {default: traverse} = require('babel-traverse');
const babylon = require('babylon');
const camelCase = require('camel-case');
const cssom = require('cssom');
const recast = require('recast');

const pkg = require(path.join(process.env.PWD, process.argv[process.argv.length - 1]));

const REPO_PKG = require(path.join(process.env.PWD, 'package.json'));
const WEBPACK_CONFIG_PATH = 'webpack.config.js';
const WEBPACK_CONFIG = require(path.join(process.env.PWD, WEBPACK_CONFIG_PATH));
const MASTER_PKG_PATH = 'packages/material-components-web/package.json';
const MASTER_CSS_PATH = 'packages/material-components-web/material-components-web.scss';
const MASTER_JS_PATH = 'packages/material-components-web/index.js';
const MASTER_PKG = require(path.join(process.env.PWD, MASTER_PKG_PATH));
// These few MDC packages work as foundation or utility packages, and are not
// directly included in webpack or the material-component-web module. But they
// are necessary since other MDC packages depend on them.
const CSS_WHITELIST = [
  'base',
  'animation',
  'auto-init',
  'dom',
  'rtl',
  'selection-control',
  'shape',
];

// List of packages that are intentionally not included in the MCW package's dependencies
const NOT_MCW_DEP = [
  'tabs', // Deprecated; CSS classes conflict with tab and tab-bar
];

const NOT_AUTOINIT = [
  'auto-init',
  'base',
  'dom',
  'selection-control',
  'tab', // Only makes sense in context of tab-bar
  'tab-indicator', // Only makes sense in context of tab-bar
  'tab-scroller', // Only makes sense in context of tab-bar
  'tabs', // Deprecated
];

main();

function main() {
  checkPublicConfigForNewComponent();
  if (pkg.name !== MASTER_PKG.name) {
    checkNameIsPresentInAllowedScope();
    if (pkg.private) {
      console.log('Skipping private component', pkg.name);
    } else {
      checkDependencyAddedInWebpackConfig();
      checkDependencyAddedInMDCPackage();
    }
  }
}

function checkPublicConfigForNewComponent() {
  if (pkg.version === '0.0.0') {
    assert.notEqual(typeof pkg.publishConfig, 'undefined',
      'Please add publishConfig to' + pkg.name + '\'s package.json. Consult our ' +
      'docs/authoring-components.md to ensure your component\'s package.json ' +
      'is well-formed.');
    assert.equal(pkg.publishConfig.access, 'public',
      'Please set publishConfig.access to "public" in ' + pkg.name + '\'s package.json. ' +
      'Consult our docs/authoring-components.md to ensure your component\'s package.json ' +
      'is well-formed.');
  }
}

function checkNameIsPresentInAllowedScope() {
  const name = getPkgName();
  assert.notEqual(REPO_PKG.config['validate-commit-msg']['scope']['allowed'].indexOf(name), -1,
    'FAILURE: Component ' + pkg.name + ' is not added to allowed scope. Please check package.json ' +
    'and add ' + name + ' to config["validate-commit-msg"]["scope"]["allowed"] before commit.');
}

function checkDependencyAddedInWebpackConfig() {
  // Check if css has been added to webpack config
  checkCSSDependencyAddedInWebpackConfig();

  // Check if js component has been added to webpack config
  if (typeof(pkg.main) !== 'undefined') {
    checkJSDependencyAddedInWebpackConfig();
  }
}

function checkJSDependencyAddedInWebpackConfig() {
  const jsconfig = WEBPACK_CONFIG.find((value) => {
    return value.name === 'main-js-a-la-carte';
  });
  const nameCamel = camelCase(pkg.name.replace('@material/', ''));
  assert.notEqual(typeof jsconfig.entry[nameCamel], 'undefined',
    'FAILURE: Component ' + pkg.name + ' javascript dependency is not added to webpack ' +
    'configuration. Please add ' + nameCamel + ' to ' + WEBPACK_CONFIG_PATH + '\'s js-components ' +
    'entry before commit.');
}

function checkCSSDependencyAddedInWebpackConfig() {
  const name = getPkgName();
  if (CSS_WHITELIST.indexOf(name) === -1) {
    const cssconfig = WEBPACK_CONFIG.find((value) => {
      return value.name === 'main-css-a-la-carte';
    });
    const nameMDC = pkg.name.replace('@material/', 'mdc.');
    assert.notEqual(typeof cssconfig.entry[nameMDC], 'undefined',
      'FAILURE: Component ' + pkg.name + ' css dependency not added to webpack ' +
      'configuration. Please add ' + name + ' to ' + WEBPACK_CONFIG_PATH + '\'s css ' +
      'entry before commit.');
  }
}

function checkDependencyAddedInMDCPackage() {
  // Package is added to package.json
  checkPkgDependencyAddedInMDCPackage();

  // SCSS is added to @import rule
  checkCSSDependencyAddedInMDCPackage();

  // If any, foundation is added to index and autoInit
  checkJSDependencyAddedInMDCPackage();
}

function checkPkgDependencyAddedInMDCPackage() {
  if (NOT_MCW_DEP.indexOf(getPkgName()) === -1) {
    assert.notEqual(typeof MASTER_PKG.dependencies[pkg.name], 'undefined',
      'FAILURE: Component ' + pkg.name + ' is not a denpendency for MDC Web. ' +
      'Please add ' + pkg.name +' to ' + MASTER_PKG_PATH + '\' dependencies before commit.');
  }
}

function checkCSSDependencyAddedInMDCPackage() {
  const name = getPkgName();
  const nameMDC = `mdc-${name}`;
  if (CSS_WHITELIST.indexOf(name) === -1 && NOT_MCW_DEP.indexOf(name) === -1) {
    const src = fs.readFileSync(path.join(process.env.PWD, MASTER_CSS_PATH), 'utf8');
    const cssRules = cssom.parse(src).cssRules;
    const cssRule = path.join(pkg.name, nameMDC);

    assert.notEqual(typeof cssRules.find((value) => {
      return value.href === cssRule;
    }), 'undefined',
    'FAILURE: Component ' + pkg.name + ' is not being imported in MDC Web. ' +
    'Please add ' + name + ' to ' + MASTER_CSS_PATH + ' import rule before commit.');
  }
}

function checkJSDependencyAddedInMDCPackage() {
  const NOT_IMPORTED = ['animation'];
  const name = getPkgName();
  if (typeof(pkg.main) !== 'undefined' && NOT_IMPORTED.indexOf(name) === -1 && NOT_MCW_DEP.indexOf(name) === -1) {
    const nameCamel = camelCase(pkg.name.replace('@material/', ''));
    const src = fs.readFileSync(path.join(process.env.PWD, MASTER_JS_PATH), 'utf8');
    const ast = recast.parse(src, {
      parser: {
        parse: (code) => babylon.parse(code, {sourceType: 'module'}),
      },
    });
    assert(checkComponentImportedAddedInMDCPackage(ast), 'FAILURE: Component ' +
      pkg.name + ' is not being imported in MDC Web. ' + 'Please add ' + nameCamel +
      ' to '+ MASTER_JS_PATH + ' import rule before commit.');
    assert(checkComponentExportedAddedInMDCPackage(ast), 'FAILURE: Component ' +
      pkg.name + ' is not being exported in MDC Web. ' + 'Please add ' + nameCamel +
      ' to '+ MASTER_JS_PATH + ' export before commit.');
    if (NOT_AUTOINIT.indexOf(name) === -1) {
      assert(checkAutoInitAddedInMDCPackage(ast) > 0, 'FAILURE: Component ' +
        pkg.name + ' seems not being auto inited in MDC Web. ' + 'Please add ' +
        nameCamel + ' to '+ MASTER_JS_PATH + ' autoInit statement before commit.');
    }
  }
}

function checkComponentImportedAddedInMDCPackage(ast) {
  let isImported = false;
  traverse(ast, {
    'ImportDeclaration'({node}) {
      if (node.source) {
        const source = node.source.value;
        const pkgFile = pkg.name + '/index';
        if (source === pkgFile || source === pkgFile + '.ts') {
          isImported = true;
        }
      }
    },
  });
  return isImported;
}

function checkAutoInitAddedInMDCPackage(ast) {
  let nameCamel = camelCase(pkg.name.replace('@material/', ''));
  if (nameCamel === 'textfield') {
    nameCamel = 'textField';
  } else if (nameCamel === 'switch') {
    nameCamel = 'switchControl';
  }
  let autoInitedCount = 0;
  traverse(ast, {
    'ExpressionStatement'({node}) {
      const callee = node.expression.callee;
      const args = node.expression.arguments;
      if (callee.object.name === 'autoInit' && callee.property.name === 'register') {
        const expression = args.find((value) => {
          return value.type === 'MemberExpression';
        });
        if (expression.object.name === nameCamel) {
          autoInitedCount++;
        }
      }
    },
  });
  return autoInitedCount;
}

function checkComponentExportedAddedInMDCPackage(ast) {
  let nameCamel = camelCase(pkg.name.replace('@material/', ''));
  if (nameCamel === 'textfield') {
    nameCamel = 'textField';
  } else if (nameCamel === 'switch') {
    nameCamel = 'switchControl';
  }
  let isExported = false;
  traverse(ast, {
    'ExportNamedDeclaration'({node}) {
      if (node.specifiers) {
        if (node.specifiers.find((value) => {
          return value.exported.name === nameCamel;
        })) {
          isExported = true;
        }
      }
    },
  });
  return isExported;
}

function getPkgName() {
  let name = pkg.name.split('/')[1];
  if (name === 'textfield') {
    // Text-field now has a dash in the name. The package cannot be changed,
    // since it is a lot of effort to rename npm package
    name = 'text-field';
  }
  return name;
}
