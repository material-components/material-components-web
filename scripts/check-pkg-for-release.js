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
const childProcess = require('child_process');

const {default: traverse} = require('babel-traverse');
const parser = require('@babel/parser');
const camelCase = require('camel-case');
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
const CSS_EXCLUDES = new Set([
  'base',
  'animation',
  'auto-init',
  'density',
  'dom',
  'feature-targeting',
  'progress-indicator',
  'rtl',
  'shape',
  'touch-target',
]);

const JS_EXCLUDES = new Set([
  'animation',
  'progress-indicator',
  'chips', // Temporarily added during deprecation migration.
]);

const NOT_AUTOINIT = new Set([
  'auto-init',
  'base',
  'dom',
  'progress-indicator',
  'tab', // Only makes sense in context of tab-bar
  'tab-indicator', // Only makes sense in context of tab-bar
  'tab-scroller', // Only makes sense in context of tab-bar
]);

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
  const name = getPkgName();
  if (JS_EXCLUDES.has(name)) {
    return;
  }

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
  if (CSS_EXCLUDES.has(name)) {
    return;
  }

  const cssconfig = WEBPACK_CONFIG.find((value) => {
    return value.name === 'main-css-a-la-carte';
  });
  const nameMDC = CLI_PACKAGE_JSON.name.replace('@material/', 'mdc.');
  assert.notEqual(typeof cssconfig.entry[nameMDC], 'undefined',
    'FAILURE: Component ' + CLI_PACKAGE_JSON.name + ' css dependency not added to webpack ' +
    'configuration. Please add ' + name + ' to ' + WEBPACK_CONFIG_RELATIVE_PATH + '\'s css ' +
    'entry before commit.');
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
  const name = getPkgName();
  if (CSS_EXCLUDES.has(name) && JS_EXCLUDES.has(name)) {
    return;
  }

  assert.notEqual(typeof MASTER_PACKAGE_JSON.dependencies[CLI_PACKAGE_JSON.name], 'undefined',
    'FAILURE: Component ' + CLI_PACKAGE_JSON.name + ' is not a dependency for MDC Web. ' +
    'Please add ' + CLI_PACKAGE_JSON.name +' to ' + MASTER_PACKAGE_JSON_RELATIVE_PATH +
    '\' dependencies before commit.');
}

function checkCSSDependencyAddedInMDCPackage() {
  const name = getPkgName();
  if (CSS_EXCLUDES.has(name)) {
    return;
  }

  const src = fs.readFileSync(path.join(process.env.PWD, MASTER_CSS_RELATIVE_PATH), 'utf8');

  const shouldImportCSS = !!src.match(`${CLI_PACKAGE_JSON.name}/`);
  assert(shouldImportCSS,
    'FAILURE: Component ' + CLI_PACKAGE_JSON.name + ' is not being imported in MDC Web. ' +
    'Please add ' + name + ' to ' + MASTER_CSS_RELATIVE_PATH + ' import rule before commit.');
}

function checkJSDependencyAddedInMDCPackage() {
  const name = getPkgName();
  if (typeof (CLI_PACKAGE_JSON.main) === 'undefined' || JS_EXCLUDES.has(name)) {
    return;
  }

  const nameCamel = camelCase(CLI_PACKAGE_JSON.name.replace('@material/', ''));
  const src = fs.readFileSync(path.join(process.env.PWD, MASTER_TS_RELATIVE_PATH), 'utf8');
  const ast = recast.parse(src, {
    parser: require('recast/parsers/typescript'),
  });
  assert(checkComponentImportedAddedInMDCPackage(ast), 'FAILURE: Component ' +
    CLI_PACKAGE_JSON.name + ' is not being imported in MDC Web. ' + 'Please add ' + nameCamel +
    ' to '+ MASTER_TS_RELATIVE_PATH + ' import rule before commit.');
  assert(checkComponentExportedAddedInMDCPackage(ast), 'FAILURE: Component ' +
    CLI_PACKAGE_JSON.name + ' is not being exported in MDC Web. ' + 'Please add ' + nameCamel +
    ' to '+ MASTER_TS_RELATIVE_PATH + ' export before commit.');
  if (!NOT_AUTOINIT.has(name)) {
    assert(checkAutoInitAddedInMDCPackage(ast) > 0, 'FAILURE: Component ' +
      CLI_PACKAGE_JSON.name + ' seems not being auto inited in MDC Web. ' + 'Please add ' +
      nameCamel + ' to '+ MASTER_TS_RELATIVE_PATH + ' autoInit statement before commit.');
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
        for (let value of args) {
          while (value.type === 'TSAsExpression') {
            value = value.expression;
          }

          if (value.type === 'MemberExpression' && value.object.name === nameCamel) {
            autoInitedCount++;
            break;
          }
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

/**
 * Checks that all dependencies used in SASS and TypeScript files in the package
 * match up with those declared in package.json.
 *
 * @throws {AssertionError} Will throw an error if dependencies do not strictly match.
 */
function checkUsedDependenciesMatchDeclaredDependencies() {
  const files = readDirRecursive(
    PACKAGE_RELATIVE_PATH,
    (fileName) => {
      return fileName[0] !== '.'
        && fileName !== 'node_modules' && fileName !== 'test';
    },
  );

  const usedDeps = new Set();
  const importMatcher = RegExp('(@use|@import|from) ["\'](@material/[^/"\']+)', 'g');
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

  assert.equal(usedButNotDeclared.length, 0, getMissingDependencyMsg(usedButNotDeclared));
  assert.equal(declaredButNotUsed.length, 0, getUnusedDependencyMsg(declaredButNotUsed));
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

function getMissingDependencyMsg(missingDeps) {
  const missingDepsWithVersions = getPackageNamesWithVersions(missingDeps);

  let msg = 'FAILURE: The following MDC dependencies were used in ' +
    CLI_PACKAGE_JSON.name + ' but were not declared in its package.json:\n' +
    missingDepsWithVersions.join('\n') +
    '\n\nPlease add the missing dependencies to package.json manually, or by ' +
    'running the following command(s) on the root of the repository:\n';

  missingDepsWithVersions.forEach((dep) => {
    msg += `npx lerna add ${dep} packages/${PACKAGE_RELATIVE_PATH.split('/')[1]}\n`;
  });
  return msg;
}

function getUnusedDependencyMsg(unusedDeps) {
  let msg = 'FAILURE: The following MDC dependencies in package ' +
    CLI_PACKAGE_JSON.name + ' are declared in its package.json but not used:\n' +
    unusedDeps.join('\n') +
    '\n\nPlease remove the unused dependencies in package.json manually, or ' +
    'by running the following command(s) on the root of the repository:\n';

  unusedDeps.forEach((dep) => {
    msg += `npx lerna exec --scope ${CLI_PACKAGE_JSON.name} -- npm uninstall --no-shrinkwrap ${dep}\n`;
  });
  return msg;
}

function getPackageNamesWithVersions(packageNames) {
  const packageNamesWithVersions = [];
  packageNames.forEach((name) => {
    const version = childProcess.execSync(`npm show ${name} version`).toString().replace('\n', '');
    packageNamesWithVersions.push(`${name}@${version}`);
  });
  return packageNamesWithVersions;
}
