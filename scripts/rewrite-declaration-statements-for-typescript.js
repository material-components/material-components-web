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

const fs = require('fs');
const glob = require('glob');
const parser = require('@babel/parser');
const path = require('path');
const recast = require('recast');
const types = require('babel-types');
const {default: traverse} = require('babel-traverse');

if (process.argv.length < 3) {
  console.log(`Usage: node ${path.basename(process.argv[1])} path/to/mdc-web/`);
  process.exit(1);
}

main(process.argv[2]);

function main(tsTempDir) {
  const searchPattern = path.join(tsTempDir, '**/*.ts');
  const tsFilePaths = glob.sync(searchPattern, {nodir: true, ignore: ['**/node_modules/**', '**/dist/**']});

  for (const tsFilePath of tsFilePaths) {
    const newTsCode = transformTS(tsFilePath, (oldImportPath) => {
      return rewriteImportPath(oldImportPath);
    });
    fs.writeFileSync(tsFilePath, newTsCode, 'utf8');
  }
}

function rewriteImportPath(ossImportPath) {
  // Only rewrite path-relative imports (e.g., './chip-set/index' -> './chipset/index').
  // Ignore npm module imports (e.g., '@material/base/types' or 'focus-trap').
  if (!ossImportPath.startsWith('.')) {
    return ossImportPath;
  }
  return ossImportPath
    .replace(/selection-control/g, 'selection_control')
    .replace(/character-counter/g, 'character_counter')
    .replace(/helper-text/g, 'helper_text')
    .replace(/-/g, '')
  ;
}

/**
 * @param {string} inputFilePath
 * @param {function(string): string} importRewriter
 * @return {string}
 */
function transformTS(inputFilePath, importRewriter) {
  const inputCode = fs.readFileSync(inputFilePath, 'utf8');
  const ast = getAstFromCodeString(inputCode);

  traverse(ast, {
    ExportDeclaration(oldExportDeclaration) {
      // Ensure export has a `from '...'` qualifier (i.e., it's directly re-exporting an import).
      // E.g.: Rewrite `export ... from '...';`, but not `export {util};` or `export default Foo;`.
      if (!oldExportDeclaration.node.source) {
        return;
      }

      const oldImportPath = oldExportDeclaration.node.source.value;
      const newImportPath = importRewriter(oldImportPath);
      if (oldImportPath === newImportPath) {
        return;
      }

      let newExportDeclaration;
      if (types.isExportAllDeclaration(oldExportDeclaration)) {
        // E.g.: `export * from '...';`
        newExportDeclaration = types.exportAllDeclaration(
          types.stringLiteral(newImportPath));
      } else if (types.isExportNamedDeclaration(oldExportDeclaration)) {
        // E.g.: `export {Foo} from '...';`
        newExportDeclaration = types.exportNamedDeclaration(
          null,
          oldExportDeclaration.node.specifiers,
          types.stringLiteral(newImportPath));
      } else {
        throw new Error(`Unsupported export declaration type: ${oldExportDeclaration.type}`);
      }

      replaceDeclaration(oldExportDeclaration, newExportDeclaration);
    },
    ImportDeclaration(oldImportDeclaration) {
      const oldImportPath = oldImportDeclaration.node.source.value;
      const newImportPath = importRewriter(oldImportPath);
      if (oldImportPath === newImportPath) {
        return;
      }

      const newImportDeclaration = types.importDeclaration(
        oldImportDeclaration.node.specifiers,
        types.stringLiteral(newImportPath));

      replaceDeclaration(oldImportDeclaration, newImportDeclaration);
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

  return outputCode;
}

function replaceDeclaration(oldDeclaration, newDeclaration) {
  newDeclaration.comments = newDeclaration.comments || [];

  // Preserve comments above import statements, since this is most likely the license comment.
  const oldComments = oldDeclaration.node.comments;
  if (oldComments && oldComments.length > 0) {
    for (const oldComment of oldComments) {
      newDeclaration.comments.push({
        type: oldComment.type,
        value: oldComment.value,
      });
    }
  }

  oldDeclaration.replaceWith(newDeclaration);
}

function getAstFromCodeString(inputCode) {
  return recast.parse(inputCode, {
    parser: {
      parse: (code) => parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'classProperties'],
      }),
    },
  });
}
