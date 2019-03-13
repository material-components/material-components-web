/**
 * @license
 * Copyright 2019 Google Inc.
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
 * @fileoverview Custom linter for TypeScript files.
 */

// tslint:disable:no-console
// tslint:disable:object-literal-sort-keys

// TODO(acdvorak): Disallow leading/trailing underscores on all publicly-exported identifiers
// TODO(acdvorak): Require all publicly-exported functions to appear in the README
// TODO(acdvorak): Require "initialized in" comment on ! properties

import * as babelParser from '@babel/parser';
import babelTraverse from '@babel/traverse';
import {NodePath} from '@babel/traverse';
import * as babelTypes from '@babel/types';
import colors from 'colors/safe';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as recastParser from 'recast/lib/parser';
import * as resolve from 'resolve';

interface RecastCustomParser {
  parse(sourceCode: string): babelTypes.File;
}

type ClassMemberNodePath = (
    NodePath<babelTypes.ClassMethod> |
    NodePath<babelTypes.ClassProperty> |
    NodePath<babelTypes.TSMethodSignature>
);

interface AstLocation {
  /** Substring index within the file at which a preview of the offending code starts. */
  snippetStartIndex: number | null;

  /** Substring index within the file at which a preview of the offending code ends. */
  snippetEndIndex: number | null;

  /** Line and column numbers at which the specific offending AST node starts and ends. */
  violationSource: babelTypes.SourceLocation | null;
}

interface NamedIdentifier {
  name: string | null;
  loc: babelTypes.SourceLocation | null;
}

interface PackageJson {
  private?: boolean;
  description?: string;
  license?: string;
  scripts?: { [key: string]: string; };
  dependencies?: { [key: string]: string; };
  devDependencies?: { [key: string]: string; };
}

const PACKAGES_DIR_ABSOLUTE = path.resolve(__dirname, '../packages');

/**
 * List of public method names that do not need to be documented in README.md.
 */
const README_METHOD_WHITELIST = [
  'constructor',
  'destroy',
  'getDefaultFoundation',
  'init',
  'initialSyncWithDOM',
  'initialize',
];

/**
 * List of public properties that are allowed to have a trailing underscore in their name.
 */
const PUBLIC_PROPERTY_UNDERSCORE_WHITELIST = [
  // `MDCComponent` subclasses that implement `MDCRippleCapableSurface` need public visibility on the `root_` property.
  'root_',
];

let violationCount = 0;

run();

function run() {
  const inputFilePaths = glob.sync(path.join(PACKAGES_DIR_ABSOLUTE, '**/*.ts'), {
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
    nodir: true,
  });

  const mdcLinterAnsi = colors.bold(colors.yellow('MDC Linter'));
  console.log(`\n${mdcLinterAnsi}: Checking ${inputFilePaths.length.toLocaleString()} TypeScript files...\n`);

  lintAllFiles(inputFilePaths);

  const plural = violationCount === 1 ? '' : 's';
  const violationCountBold = colors.bold(violationCount.toLocaleString());
  const violationCountColor = violationCount > 0 ? colors.red(violationCountBold) : colors.green(violationCountBold);
  console.log(`${mdcLinterAnsi}: Found ${violationCountColor} error${plural}\n`);
}

function lintAllFiles(inputFilePaths: string[]) {
  for (const inputFilePath of inputFilePaths) {
    const inputCode = fs.readFileSync(inputFilePath, 'utf8');
    lintOneFile(inputFilePath, inputCode);
  }
}

function lintOneFile(inputFilePath: string, inputCode: string) {
  checkAllImportPaths(inputFilePath, inputCode);
  checkAllInlineProperties(inputFilePath, inputCode);
  checkAllReturnAnnotations(inputFilePath, inputCode);
  checkAllIdentifierNames(inputFilePath, inputCode);
}

function checkAllImportPaths(inputFilePath: string, inputCode: string) {
  const ast = getAstFromCodeString(inputCode);

  babelTraverse(ast, {
    ExportDeclaration(nodePath) {
      checkOneImportPath(nodePath, inputFilePath);
    },
    ImportDeclaration(nodePath) {
      checkOneImportPath(nodePath, inputFilePath);
    },
  });
}

function checkOneImportPath(
    nodePath: NodePath<babelTypes.ImportDeclaration> | NodePath<babelTypes.ExportDeclaration>,
    inputFilePath: string,
) {
  const declarationNode = nodePath.node;

  // Ignore exports that lack a `from '...'` qualifier.
  if (babelTypes.isExportDefaultDeclaration(declarationNode) || !declarationNode.source) {
    return;
  }

  const inputFileDir = path.dirname(inputFilePath);
  const importPath = declarationNode.source.value;
  const importPathAnsi = colors.bold(importPath);
  const resolvedAbsolutePathWithExt = resolve.sync(importPath, {basedir: inputFileDir, extensions: ['.ts', '.js']});
  const resolvedFileNameWithoutExt = path.parse(resolvedAbsolutePathWithExt).name;

  const isLocalFileImport = resolvedAbsolutePathWithExt.indexOf('node_modules') === -1;
  const isMaterialNpmImport = importPath.startsWith('@material/');
  const isThirdPartyImport = !isMaterialNpmImport && !isLocalFileImport;

  // Make sure npm modules are specified in package.json dependencies
  if (isMaterialNpmImport || isThirdPartyImport) {
    const expectedNpmDep = importPath
        // "@material/foo/bar" -> "@material/foo"
        .replace(new RegExp('^(@[^/]+/[^/]+)/.+'), '$1')
        // "focus-trap/foo" -> "focus-trap"
        .replace(new RegExp('^([^@][^/]+)/.+'), '$1')
    ;

    const inputFilePackageDir = inputFilePath.replace(new RegExp('(packages/[^/]+)/.+'), '$1');
    const inputFilePackageJsonPath = path.join(inputFilePackageDir, 'package.json');
    if (!fs.existsSync(inputFilePackageJsonPath)) {
      logLinterViolation(
          inputFilePath,
          declarationNode.source.loc,
          [
            `Import path '${importPathAnsi}' references NPM module '${expectedNpmDep}',`,
            `but required package.json file is missing: '${inputFilePackageJsonPath}'.`,
          ],
      );
      return;
    }

    const inputFilePackageJson = require(inputFilePackageJsonPath) as PackageJson;
    const inputFilePackageJsonDeps = inputFilePackageJson.dependencies;
    const isInPackageJsonDeps = inputFilePackageJsonDeps && inputFilePackageJsonDeps[expectedNpmDep];
    if (!isInPackageJsonDeps) {
      logLinterViolation(
          inputFilePath,
          declarationNode.source.loc,
          [
            `Import path '${importPathAnsi}' references NPM module '${expectedNpmDep}',`,
            'but that module is not listed in package.json dependencies.',
          ],
      );
      return;
    }
  }

  if (!isThirdPartyImport && !importPath.endsWith(`/${resolvedFileNameWithoutExt}`)) {
    logLinterViolation(
        inputFilePath,
        declarationNode.source.loc,
        [
          `Import path '${importPathAnsi}' should point directly to a specific TypeScript file.`,
          `E.g.: import '${importPath}/index'`,
        ],
    );
    return;
  }

  if (path.isAbsolute(importPath)) {
    logLinterViolation(
        inputFilePath,
        declarationNode.source.loc,
        `Import path '${importPathAnsi}' appears to be an absolute path. Please use a relative path instead.`,
    );
    return;
  }

  if (importPath.indexOf('../mdc-') > -1 || importPath.indexOf('../material-components-web') > -1) {
    logLinterViolation(
        inputFilePath,
        declarationNode.source.loc,
        [
          `Import path '${importPathAnsi}' appears to be a relative path to an MDC package.`,
          'Please use a @material import instead.',
          "E.g.: import '@material/foo/types' instead of import '../mdc-foo/types'.",
        ],
    );
    return;
  }

  const importPathIsComponent = importPath.endsWith('/index') || importPath.endsWith('component');
  const inputFileIsComponent = inputFilePath.endsWith('/index.ts') || inputFilePath.endsWith('component.ts');
  if (importPathIsComponent && !inputFileIsComponent) {
    logLinterViolation(
        inputFilePath,
        declarationNode.source.loc,
        [
          `Import path '${importPathAnsi}' is only allowed in component.ts and index.ts files.`,
          "Please import a more specific file (e.g., 'adapter', 'foundation', 'types').",
          'This keeps byte sizes smaller for wrapper libraries that only use our foundations.',
        ],
    );
    return;
  }
}

function checkAllInlineProperties(inputFilePath: string, inputCode: string) {
  // Inline property assignment is only an issue in subclasses of MDCComponent.
  const isComponentFile = inputFilePath.endsWith('component.ts');
  if (!isComponentFile) {
    return;
  }

  const ast = getAstFromCodeString(inputCode);
  const propertiesInitializedInline = new Map<string, AstLocation>();
  const propertiesAssignedInMethods = new Map<string, AstLocation[]>();

  babelTraverse(ast, {
    ClassProperty(nodePath) {
      visitOneClassProperty(nodePath, propertiesInitializedInline);
    },
    AssignmentExpression(nodePath) {
      visitOneAssignmentExpression(nodePath, propertiesAssignedInMethods);
    },
  });

  for (const [inlinePropertyName, inlinePropertyLocation] of propertiesInitializedInline.entries()) {
    // Ignore properties that are never reassigned a different value.
    if (!propertiesAssignedInMethods.has(inlinePropertyName)) {
      continue;
    }

    const inlinePropertyNameAnsi = colors.bold(inlinePropertyName);

    // tslint:disable:max-line-length
    logLinterViolation(
        inputFilePath,
        inlinePropertyLocation.violationSource,
        [
          `Inline assignment of '${inlinePropertyNameAnsi}' property might silently overwrite method-assigned value(s). Please remove inline value.`,
          'When components are instantiated, the base MDCComponent constructor runs first, which calls initialize() and initialSyncWithDOM().',
          'The subclass constructor runs next and sets inline property values, which may overwrite the values from initialize() and initialSyncWithDOM().',
        ],
    );
    // tslint:enable:max-line-length
  }
}

function visitOneClassProperty(
    nodePath: NodePath<babelTypes.ClassProperty>,
    propertiesInitializedInline: Map<string, AstLocation>,
) {
  const propertyNode = nodePath.node;
  const valueNode = propertyNode.value;
  if (!valueNode) {
    return;
  }

  // ClassProperty.key is a union type containing to a large number of types,
  // some of which lack a `name` property. Rather than cast it to a single type,
  // which may or may not be correct, it's simpler to cast it to an object literal.
  const key = propertyNode.key as unknown as { name: string | undefined };
  if (!key.name) {
    return;
  }

  propertiesInitializedInline.set(key.name, {
    snippetStartIndex: propertyNode.start,
    snippetEndIndex: propertyNode.end,
    violationSource: valueNode.loc,
  });
}

function visitOneAssignmentExpression(
    expressionNodePath: NodePath<babelTypes.AssignmentExpression>,
    propertiesAssignedInMethods: Map<string, AstLocation[]>,
) {
  const expressionNode = expressionNodePath.node;
  const leftNode = expressionNode.left as babelTypes.MemberExpression;
  const rightNode = expressionNode.right;
  const propertyNode = leftNode.property as babelTypes.Identifier;
  if (!propertyNode) {
    return;
  }

  const codeLocations = propertiesAssignedInMethods.get(propertyNode.name) || [];
  propertiesAssignedInMethods.set(propertyNode.name, codeLocations);

  codeLocations.push({
    snippetStartIndex: expressionNode.start,
    snippetEndIndex: expressionNode.end,
    violationSource: rightNode.loc,
  });
}

function checkAllReturnAnnotations(inputFilePath: string, inputCode: string) {
  const ast = getAstFromCodeString(inputCode);

  babelTraverse(ast, {
    Function(nodePath) {
      checkOneReturnAnnotation(nodePath, inputFilePath);
    },
  });
}

function checkOneReturnAnnotation(
    nodePath: NodePath<babelTypes.Function>,
    inputFilePath: string,
) {
  const functionLikeNode = nodePath.node;
  const leadingComments = functionLikeNode.leadingComments || [];
  for (const leadingComment of leadingComments) {
    if (leadingComment.type !== 'CommentBlock') {
      continue;
    }

    if (leadingComment.value.indexOf(' @returns ') > -1) {
      logLinterViolation(
          inputFilePath,
          leadingComment.loc,
          `Please use a '@return' annotation (singular) instead of '@returns' (plural) in TSDoc comments.`,
      );
      return;
    }
  }
}

function checkAllIdentifierNames(inputFilePath: string, inputCode: string) {
  const ast = getAstFromCodeString(inputCode);

  const checkName =
      (nodePath: NodePath) => checkOneIdentifierName(nodePath, inputFilePath);
  const checkAccessibility =
      (nodePath: ClassMemberNodePath) => checkOneClassMemberAccessibility(nodePath, inputFilePath);
  const checkReadme =
      (nodePath: ClassMemberNodePath) => checkOneClassMemberIsInReadme(nodePath, inputFilePath);

  babelTraverse(ast, {
    Function: checkName,
    ClassProperty: checkName,
    TSMethodSignature: checkName,
  });

  babelTraverse(ast, {
    ClassMethod: checkAccessibility,
    ClassProperty: checkAccessibility,
  });

  babelTraverse(ast, {
    ClassMethod: checkReadme,
    ClassProperty: checkReadme,
    TSMethodSignature: checkReadme,
  });
}

function checkOneIdentifierName(
    nodePath: NodePath,
    inputFilePath: string,
) {
  const node = nodePath.node;
  const {name, loc} = getNameAndLocation(node);
  if (!name) {
    return;
  }

  if (name.startsWith('_')) {
    logLinterViolation(
        inputFilePath,
        loc,
        `Leading underscores are not allowed in function names: '${name}'.`,
    );
    return;
  }

  if (name.endsWith('_') && !babelTypes.isClassMethod(node) && !babelTypes.isClassProperty(node)) {
    logLinterViolation(
        inputFilePath,
        loc,
        `Trailing underscores are only allowed on class methods and properties: '${name}'.`,
    );
    return;
  }
}

function checkOneClassMemberAccessibility(
    nodePath: ClassMemberNodePath,
    inputFilePath: string,
) {
  const node = nodePath.node;
  const {name, loc} = getNameAndLocation(node);
  if (!name || PUBLIC_PROPERTY_UNDERSCORE_WHITELIST.includes(name)) {
    return;
  }

  const accessibility = babelTypes.isTSMethodSignature(node) ? 'public' : node.accessibility;
  const isPublicAccess = accessibility !== 'private' && accessibility !== 'protected';
  const isPublicName = !name.endsWith('_');

  if (!isPublicAccess && isPublicName) {
    logLinterViolation(
        inputFilePath,
        loc,
        `Non-public member '${name}' is missing a trailing underscore in its name.`,
    );
    return;
  }

  if (isPublicAccess && !isPublicName) {
    logLinterViolation(
        inputFilePath,
        loc,
        `Non-public member '${name}' requires a private/protected accessibility modifier.`,
    );
    return;
  }
}

function checkOneClassMemberIsInReadme(
    nodePath: ClassMemberNodePath,
    inputFilePath: string,
) {
  const {node} = nodePath;
  const {name, loc} = getNameAndLocation(node);
  const kind =
      babelTypes.isClassMethod(node) ? node.kind :
      babelTypes.isTSMethodSignature(node) ? 'method' : 'property';
  if (!name || README_METHOD_WHITELIST.includes(name)) {
    return;
  }

  if (isStaticOrNonPublicMember(node)) {
    return;
  }

  const readmeFilePathAbsolute = getReadmeFilePathAbsolute(inputFilePath);
  if (!readmeFilePathAbsolute) {
    return;
  }

  if (readmeIsMissingApiName(readmeFilePathAbsolute, name)) {
    const readmeFilePathRelative = path.relative(PACKAGES_DIR_ABSOLUTE, readmeFilePathAbsolute);
    logLinterViolation(
        inputFilePath,
        loc,
        `Public ${kind} '${name}' is missing from '${readmeFilePathRelative}'.`,
    );
    return;
  }
}

function getNameAndLocation(node: babelTypes.Node): NamedIdentifier {
  if (babelTypes.isClassMethod(node) || babelTypes.isClassProperty(node) ||
      babelTypes.isObjectMethod(node) || babelTypes.isObjectProperty(node) ||
      babelTypes.isTSMethodSignature(node)) {
    const key = node.key as unknown as NamedIdentifier;
    if (key.name) {
      return key;
    }
  } else if (babelTypes.isFunctionDeclaration(node) && node.id) {
    return node.id;
  }
  return {name: null, loc: null};
}

function isStaticOrNonPublicMember(node: babelTypes.Node): boolean {
  const {name} = getNameAndLocation(node);
  if (!name) {
    // Arrow function or unnamed function expression.
    return true;
  }

  if (babelTypes.isClassMethod(node) || babelTypes.isClassProperty(node)) {
    return (
        node.accessibility === 'private' ||
        node.accessibility === 'protected' ||
        node.static ||
        name.endsWith('_')
    );
  }

  return false;
}

function getReadmeFilePathAbsolute(inputFilePath: string): string | null {
  let packageDir = path.dirname(inputFilePath);
  while (!fs.existsSync(path.join(packageDir, 'README.md'))) {
    packageDir = path.dirname(packageDir);
  }

  const readmeFilePathAbsolute = path.join(packageDir, 'README.md');
  return fs.existsSync(readmeFilePathAbsolute) ? readmeFilePathAbsolute : null;
}

function readmeIsMissingApiName(readmeFilePathAbsolute: string, apiName: string): boolean {
  const readmeFileContent = fs.readFileSync(readmeFilePathAbsolute, 'utf8');
  const readmeHasApiName = new RegExp(`\\b${escapeRegExp(apiName)}\\b`).test(readmeFileContent);
  return !readmeHasApiName;
}

function getAstFromCodeString(inputCode: string): babelTypes.Node {
  // DO NOT INLINE this variable. It provides stronger typing than recast's type declarations..
  const customParser: RecastCustomParser = {
    parse: (code) => babelParser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'classProperties'],
    }),
  };
  return recastParser.parse(inputCode, {parser: customParser});
}

/**
 * @see https://stackoverflow.com/a/9310752/467582
 */
function escapeRegExp(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function logLinterViolation(
    inputFilePath: string,
    location: babelTypes.SourceLocation | null,
    message: string | string[],
) {
  if (Array.isArray(message)) {
    message = message.join('\n');
  }

  const errorAnsi = colors.red('ERROR');
  const inputFilePathAnsi = colors.bold(path.relative(PACKAGES_DIR_ABSOLUTE, inputFilePath));
  const inputFileLineCol = location ? ` (line ${location.start.line}, column ${location.start.column})` : '';

  console.error(`${errorAnsi}: ${inputFilePathAnsi}${inputFileLineCol}:\n\n${message}\n`);

  violationCount++;
  process.exitCode = 1;
}
