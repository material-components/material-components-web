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
const readDirRecursive = require('fs-readdir-recursive');
const path = require('path');

const {default: traverse} = require('babel-traverse');
const parser = require('@babel/parser');
const camelCase = require('camel-case');
const cssom = require('cssom');
const recast = require('recast');

const CLI_PACKAGE_JSON_RELATIVE_PATH = process.argv[2];
if (!CLI_PACKAGE_JSON_RELATIVE_PATH) {
  console.error(`Usage: node ${path.basename(process.argv[1])} packages/mdc-foo/package.json`);
  process.exit(1);
}
const PACKAGE_RELATIVE_PATH = CLI_PACKAGE_JSON_RELATIVE_PATH.replace('package.json', '');

if (!new RegExp('packages/[^/]+/package.json$').test(CLI_PACKAGE_JSON_RELATIVE_PATH)) {
  console.error(`Invalid argument: "${CLI_PACKAGE_JSON_RELATIVE_PATH}" is not a valid path to a package.json file.`);
  console.error('Expected format: packages/mdc-foo/package.json');
  process.exit(1);
}

const CLI_PACKAGE_JSON = require(path.resolve(CLI_PACKAGE_JSON_RELATIVE_PATH));

const WEBPACK_CONFIG_RELATIVE_PATH = 'webpack.config.js';
const WEBPACK_CONFIG = require(path.resolve(WEBPACK_CONFIG_RELATIVE_PATH));

const MASTER_TS_RELATIVE_PATH = 'packages/material-components-web/index.ts';
const MASTER_CSS_RELATIVE_PATH = 'packages/material-components-web/material-components-web.scss';
const MASTER_PACKAGE_JSON_RELATIVE_PATH = 'packages/material-components-web/package.json';
const MASTER_PACKAGE_JSON = require(path.resolve(MASTER_PACKAGE_JSON_RELATIVE_PATH));

// These few MDC packages work as foundation or utility packages, and are not
// directly included in webpack or the material-component-web module. But they
// are necessary since other MDC packages depend on them.
const CSS_WHITELIST = [
  'base',
  'animation',
  'auto-init',
  'density',
  'dom',
  'feature-targeting',
  'rtl',
  'shape',
  'touch-target',
];

const NOT_AUTOINIT = [
  'auto-init',
  'base',
  'dom',
  'tab', // Only makes sense in context of tab-bar
  'tab-indicator', // Only makes sense in context of tab-bar
  'tab-scroller', // Only makes sense in context of tab-bar
];

main();

function main() {
  checkPublicConfigForNewComponent();
  if (CLI_PACKAGE_JSON.name !== MASTER_PACKAGE_JSON.name) {
    if (CLI_PACKAGE_JSON.private) {
      console.log('Skipping private component', CLI_PACKAGE_JSON.name);
    } else {
      checkDependencyAddedInWebpackConfig();
      checkDependencyAddedInMDCPackage();
      checkUsedDependenciesMatchDeclaredDependencies();
    }
  }
}

function checkPublicConfigForNewComponent() {
  if (CLI_PACKAGE_JSON.version === '0.0.0') {
    assert.notEqual(typeof CLI_PACKAGE_JSON.publishConfig, 'undefined',
      'Please add publishConfig to' + CLI_PACKAGE_JSON.name + '\'s package.json. Consult our ' +
      'docs/authoring-components.md to ensure your component\'s package.json ' +
      'is well-formed.');
    assert.equal(CLI_PACKAGE_JSON.publishConfig.access, 'public',
      'Please set publishConfig.access to "public" in ' + CLI_PACKAGE_JSON.name + '\'s package.json. ' +
      'Consult our docs/authoring-components.md to ensure your component\'s package.json ' +
      'is well-formed.');
  }
}

function checkDependencyAddedInWebpackConfig() {
  // Check if css has been added to webpack config
  checkCSSDependencyAddedInWebpackConfig();

  // Check if js component has been added to webpack config
  if (typeof(CLI_PACKAGE_JSON.main) !== 'undefined') {
    checkJSDependencyAddedInWebpackConfig();
  }
}

function checkJSDependencyAddedInWebpackConfig() {
  const jsconfig = WEBPACK_CONFIG.find((value) => {
    return value.name === 'main-js-a-la-carte';
  });
  const nameCamel = camelCase(CLI_PACKAGE_JSON.name.replace('@material/', ''));
  assert.notEqual(typeof jsconfig.entry[nameCamel], 'undefined',
    'FAILURE: Component ' + CLI_PACKAGE_JSON.name + ' javascript dependency is not added to webpack ' +
    'configuration. Please add ' + nameCamel + ' to ' + WEBPACK_CONFIG_RELATIVE_PATH + '\'s js-components ' +
    'entry before commit.');
}

function checkCSSDependencyAddedInWebpackConfig() {
  const name = getPkgName();
  if (CSS_WHITELIST.indexOf(name) === -1) {
    const cssconfig = WEBPACK_CONFIG.find((value) => {
      return value.name === 'main-css-a-la-carte';
    });
    const nameMDC = CLI_PACKAGE_JSON.name.replace('@material/', 'mdc.');
    assert.notEqual(typeof cssconfig.entry[nameMDC], 'undefined',
      'FAILURE: Component ' + CLI_PACKAGE_JSON.name + ' css dependency not added to webpack ' +
      'configuration. Please add ' + name + ' to ' + WEBPACK_CONFIG_RELATIVE_PATH + '\'s css ' +
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
  assert.notEqual(typeof MASTER_PACKAGE_JSON.dependencies[CLI_PACKAGE_JSON.name], 'undefined',
    'FAILURE: Component ' + CLI_PACKAGE_JSON.name + ' is not a dependency for MDC Web. ' +
    'Please add ' + CLI_PACKAGE_JSON.name +' to ' + MASTER_PACKAGE_JSON_RELATIVE_PATH +
    '\' dependencies before commit.');
}

function checkCSSDependencyAddedInMDCPackage() {
  const name = getPkgName();
  const nameMDC = `mdc-${name}`;
  if (CSS_WHITELIST.indexOf(name) === -1) {
    const src = fs.readFileSync(path.join(process.env.PWD, MASTER_CSS_RELATIVE_PATH), 'utf8');
    const cssRules = cssom.parse(src).cssRules;
    const cssRule = path.join(CLI_PACKAGE_JSON.name, nameMDC);

    assert.notEqual(typeof cssRules.find((value) => {
      return value.href === cssRule;
    }), 'undefined',
    'FAILURE: Component ' + CLI_PACKAGE_JSON.name + ' is not being imported in MDC Web. ' +
    'Please add ' + name + ' to ' + MASTER_CSS_RELATIVE_PATH + ' import rule before commit.');
  }
}

function checkJSDependencyAddedInMDCPackage() {
  const NOT_IMPORTED = ['animation'];
  const name = getPkgName();
  if (typeof (CLI_PACKAGE_JSON.main) !== 'undefined' &&
      NOT_IMPORTED.indexOf(name) === -1) {
    const nameCamel = camelCase(CLI_PACKAGE_JSON.name.replace('@material/', ''));
    const src = fs.readFileSync(path.join(process.env.PWD, MASTER_TS_RELATIVE_PATH), 'utf8');
    const ast = recast.parse(src, {
      parser: {
        parse: (code) => parser.parse(code, {sourceType: 'module'}),
      },
    });
    assert(checkComponentImportedAddedInMDCPackage(ast), 'FAILURE: Component ' +
      CLI_PACKAGE_JSON.name + ' is not being imported in MDC Web. ' + 'Please add ' + nameCamel +
      ' to '+ MASTER_TS_RELATIVE_PATH + ' import rule before commit.');
    assert(checkComponentExportedAddedInMDCPackage(ast), 'FAILURE: Component ' +
      CLI_PACKAGE_JSON.name + ' is not being exported in MDC Web. ' + 'Please add ' + nameCamel +
      ' to '+ MASTER_TS_RELATIVE_PATH + ' export before commit.');
    if (NOT_AUTOINIT.indexOf(name) === -1) {
      assert(checkAutoInitAddedInMDCPackage(ast) > 0, 'FAILURE: Component ' +
        CLI_PACKAGE_JSON.name + ' seems not being auto inited in MDC Web. ' + 'Please add ' +
        nameCamel + ' to '+ MASTER_TS_RELATIVE_PATH + ' autoInit statement before commit.');
    }
  }
}

function checkComponentImportedAddedInMDCPackage(ast) {
  let isImported = false;
  traverse(ast, {
    'ImportDeclaration'({node}) {
      if (node.source) {
        const source = node.source.value;
        const pkgFile = CLI_PACKAGE_JSON.name + '/index';
        if (source === pkgFile) {
          isImported = true;
        }
      }
    },
  });
  return isImported;
}

function checkAutoInitAddedInMDCPackage(ast) {
  let nameCamel = camelCase(CLI_PACKAGE_JSON.name.replace('@material/', ''));
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
  let nameCamel = camelCase(CLI_PACKAGE_JSON.name.replace('@material/', ''));
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

function checkUsedDependenciesMatchDeclaredDependencies() {
  const files = readDirRecursive(
    PACKAGE_RELATIVE_PATH,
    (fileName) => {
      return fileName[0] !== '.'
        && fileName !== 'node_modules' && fileName !== 'test';
    }
  );

  const usedDeps = new Set();
  const importMatcher = RegExp('(@import|from) ["\'](@material/[^/"\']+)', 'g');
  files.forEach((file) => {
    if (file.endsWith('.scss') || file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      const src = fs.readFileSync(path.join(PACKAGE_RELATIVE_PATH, file), 'utf8');
      while ((dep = importMatcher.exec(src)) !== null) {
        usedDeps.add(dep[2]);
      }
    }
  });

  const declaredDeps = new Set(
    Object.keys(CLI_PACKAGE_JSON.dependencies ? CLI_PACKAGE_JSON.dependencies : [])
      .filter((key) => key.startsWith('@material/')));

  const usedButNotDeclared = [...usedDeps].filter((x) => !declaredDeps.has(x));
  const declaredButNotUsed = [...declaredDeps].filter((x) => !usedDeps.has(x));

  assert.equal(usedButNotDeclared.length, 0,
    'FAILURE: Component ' + CLI_PACKAGE_JSON.name +
    ' uses one or more MDC dependencies not declared in package.json.\n' +
    getMissingDependencyRemedy(usedButNotDeclared));

  assert.equal(declaredButNotUsed.length, 0,
    'FAILURE: Component ' + CLI_PACKAGE_JSON.name +
    ' declares one or more MDC dependencies in package.json that are unused.\n' +
    getUnusedDependencyRemedy(declaredButNotUsed));
}

function getPkgName() {
  let name = CLI_PACKAGE_JSON.name.split('/')[1];
  if (name === 'textfield') {
    // Text-field now has a dash in the name. The package cannot be changed,
    // since it is a lot of effort to rename npm package
    name = 'text-field';
  }
  return name;
}

function getMissingDependencyRemedy(missingDeps) {
  let remedyStr = 'Please add the missing dependencies using the following command(s):\n';
  missingDeps.forEach((dep) => {
    remedyStr += `npx lerna add ${dep} packages/${PACKAGE_RELATIVE_PATH.split('/')[1]}\n`;
  });
  return remedyStr;
}

function getUnusedDependencyRemedy(unusedDeps) {
  let remedyStr = 'Please remove the unused dependencies using the following command(s):\n';
  unusedDeps.forEach((dep) => {
    remedyStr += `npx lerna exec --scope ${CLI_PACKAGE_JSON.name} -- npm uninstall --no-shrinkwrap ${dep}\n`;
  });
  return remedyStr;
}
