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
 */

const fs = require('fs');
const path = require('path');

const {parse, stringify} = require('scss-parser');
const createQueryWrapper = require('query-ast');
const glob = require('glob');

main(process.argv);

function main(argv) {
  if (argv.length < 3) {
    console.error('Missing root directory path');
    process.exit(1);
  }

  const rootDir = path.resolve(process.argv[2]);
  const srcFiles = glob.sync(`${rootDir}/**/*.scss`);
  srcFiles.forEach((srcFile) => transform(srcFile, rootDir));
}

function transform(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  const ast = parse(src);

  const $ = createQueryWrapper(ast);
  $('atrule').has('atkeyword').find('string_double').replace((n) => {
    if (n.parent.children[0].node.value === 'import') {
      return {
        type: 'string_double',
        value: rewriteImportDeclaration(n.node.value, srcFile, rootDir),
      };
    }
    return n.node;
  });

  const scss = stringify($().get(0));

  fs.writeFileSync(srcFile, scss, 'utf8');
  console.log(`[rewrite] ${srcFile}`);
}

function rewriteImportDeclaration(importSource, srcFile, rootDir) {
  const pathParts = importSource.split('/');
  const isMDCImport = pathParts[0] === '@material';
  if (isMDCImport) {
    const modName = pathParts[1]; // @material/<modName>
    const atMaterialReplacementPath = `${rootDir}/${modName}`;
    const rewrittenImportSource = [atMaterialReplacementPath].concat(pathParts.slice(2)).join('/');
    importSource = rewrittenImportSource;
  }

  let resolvedImportSource = importSource;
  const needsClosureModuleRootResolution = path.isAbsolute(importSource);
  if (needsClosureModuleRootResolution) {
    const pathToImport = importSource.replace('@material', rootDir);
    resolvedImportSource = path.relative(path.dirname(srcFile), pathToImport);
  }
  return resolvedImportSource;
}
