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

import * as babelParser from '@babel/parser';
import babelTraverse, {NodePath} from '@babel/traverse';
import * as babelTypes from '@babel/types';
import * as colors from 'colors/safe';
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

type NodeKind = (
    'class' | 'constructor' | 'enum' | 'getter' | 'interface' | 'method' | 'property' | 'setter' | 'symbol' | 'type' |
    'variable'
);

interface NamedIdentifier {
  name: string | null;
  loc: babelTypes.SourceLocation | null;
  kind: NodeKind;
}

type ClassLikeNode = babelTypes.ClassDeclaration | babelTypes.InterfaceDeclaration | babelTypes.TSInterfaceDeclaration;

interface PackageJson {
  private?: boolean;
  description?: string;
  license?: string;
  scripts?: { [key: string]: string; };
  dependencies?: { [key: string]: string; };
  devDependencies?: { [key: string]: string; };
}

const PACKAGES_DIR_ABSOLUTE = path.resolve(__dirname, '../packages');

// TODO(acdvorak): Remove Corner, CornerBit, ALWAYS_FLOAT_TYPES, VALIDATION_ATTR_WHITELIST
/**
 * List of public method names that do not need to be documented in README.md.
 */
const README_WHITELIST = [
  'constructor',
  'cssClasses',
  'destroy',
  'getDefaultFoundation',
  'init',
  'initialSyncWithDOM',
  'initialize',
  'numbers',
  'strings',
  'Corner',
  'CornerBit',
  'ALWAYS_FLOAT_TYPES',
  'VALIDATION_ATTR_WHITELIST',
];

/**
 * List of public properties that are allowed to have a trailing underscore in their name.
 */
const PUBLIC_PROPERTY_UNDERSCORE_WHITELIST = [
  // `MDCComponent` subclasses that implement `MDCRippleCapableSurface` need public visibility on the `root_` property.
  'root_',
];

// TODO(acdvorak): Remove these exceptions
const EXPORT_MDC_PREFIX_PATH_WHITELIST = [
  'mdc-animation/types.ts',
  'mdc-base/types.ts',
];

// TODO(acdvorak): Remove Corner, CornerBit, ALWAYS_FLOAT_TYPES, VALIDATION_ATTR_WHITELIST
const EXPORT_MDC_PREFIX_NAME_WHITELIST = [
  'cssClasses', 'numbers', 'strings',
  'Corner', 'CornerBit',
  'ALWAYS_FLOAT_TYPES', 'VALIDATION_ATTR_WHITELIST',
];

const INDEX_FILE_PATH_WHITELIST = [
  'material-components-web/index.ts',
  'mdc-auto-init/index.ts',
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
  checkAllAnnotations(inputFilePath, inputCode);
  checkIndexOnlyReexports(inputFilePath, inputCode);
  checkAllExportNames(inputFilePath, inputCode);
  checkAllIdentifierNames(inputFilePath, inputCode);
  checkAllAdaptersAndFoundations(inputFilePath, inputCode);
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
  const keyNode = propertyNode.key;
  const valueNode = propertyNode.value;
  if (!valueNode || !babelTypes.isIdentifier(keyNode) || !keyNode.name) {
    return;
  }

  propertiesInitializedInline.set(keyNode.name, {
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
  const leftNode = expressionNode.left;
  const rightNode = expressionNode.right;

  if (!babelTypes.isMemberExpression(leftNode) || !babelTypes.isIdentifier(leftNode.property)) {
    return;
  }

  const propertyNode = leftNode.property;
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

function checkAllAnnotations(inputFilePath: string, inputCode: string) {
  const ast = getAstFromCodeString(inputCode);
  const propertyAssignmentParentMethodNames = new Map<string, string[]>();

  babelTraverse(ast, {
    AssignmentExpression(nodePath) {
      collectParentMethodNames(nodePath, propertyAssignmentParentMethodNames);
    },
  });

  babelTraverse(ast, {
    ClassProperty(nodePath) {
      checkOneDefiniteAssignment(nodePath, inputFilePath, inputCode, propertyAssignmentParentMethodNames);
    },
    Function(nodePath) {
      checkOneReturnAnnotation(nodePath, inputFilePath);
    },
  });
}

function collectParentMethodNames(
    expressionNodePath: NodePath<babelTypes.AssignmentExpression>,
    propertyAssignmentParentMethodNames: Map<string, string[]>,
) {
  const expressionNode = expressionNodePath.node;
  const leftNode = expressionNode.left;

  if (!babelTypes.isMemberExpression(leftNode) || !babelTypes.isIdentifier(leftNode.property)) {
    return;
  }

  const propertyNode = leftNode.property;
  if (!propertyNode) {
    return;
  }

  const methodNames = propertyAssignmentParentMethodNames.get(propertyNode.name) || [];
  propertyAssignmentParentMethodNames.set(propertyNode.name, methodNames);

  const parentMethodNodePath = expressionNodePath.findParent((parentNodePath) => parentNodePath.isClassMethod());
  if (parentMethodNodePath &&
      parentMethodNodePath.isClassMethod() &&
      babelTypes.isIdentifier(parentMethodNodePath.node.key)) {
    methodNames.push(parentMethodNodePath.node.key.name);
  }
}

function checkOneDefiniteAssignment(
    nodePath: NodePath<babelTypes.ClassProperty>,
    inputFilePath: string,
    inputCode: string,
    propertyAssignmentParentMethodNames: Map<string, string[]>,
) {
  const propertyNode = nodePath.node;
  const propertyKey = propertyNode.key;
  const valueNode = propertyNode.value;
  if (valueNode || !babelTypes.isIdentifier(propertyKey) || !propertyKey.name) {
    return;
  }

  if (!propertyNode.typeAnnotation || babelTypes.isNoop(propertyNode.typeAnnotation)) {
    return;
  }

  if (!propertyNode.definite || !propertyNode.loc) {
    return;
  }

  const commentNodes = [
    ...(propertyNode.leadingComments || []),
    ...(propertyNode.innerComments || []),
    ...(propertyNode.trailingComments || []),
  ];

  let hasMatchingComment = false;
  for (const commentNode of commentNodes) {
    const commentStr = commentNode.value;
    if (commentStr.startsWith(' assigned in ') && (commentStr.endsWith('()') || commentStr.endsWith(' constructor'))) {
      const isSameLine = commentNode.loc.start.line === propertyNode.loc.start.line;
      const isLineBefore = commentNode.loc.start.line === propertyNode.loc.start.line - 1;
      const isSameColumn = commentNode.loc.start.column === propertyNode.loc.start.column;
      const isColumnAfter = commentNode.loc.start.column === propertyNode.loc.end.column + 1;

      const isLeadingComment = isLineBefore && isSameColumn;
      const isTrailingComment = isSameLine && isColumnAfter;

      if (isLeadingComment || isTrailingComment) {
        hasMatchingComment = true;
      }
    }
  }

  if (!hasMatchingComment) {
    const methodNames = propertyAssignmentParentMethodNames.get(propertyKey.name) || [];
    const firstMethodName = methodNames.filter((methodName) => methodName !== 'destroy')[0] || 'NAME_OF_METHOD';
    const startIndex = propertyNode.start || 0;
    const endIndex = propertyNode.end || startIndex;
    const codeSnippet = inputCode.substring(startIndex, endIndex);
    logLinterViolation(
        inputFilePath,
        propertyKey.loc,
        [
          `Properties with a definite assignment assertion (!) require an accompanying comment:`,
          '',
          `    ${codeSnippet} // assigned in ${firstMethodName}()`,
        ],
    );
    return;
  }
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

function checkIndexOnlyReexports(inputFilePath: string, inputCode: string) {
  if (!inputFilePath.endsWith('/index.ts')) {
    return;
  }

  const ast = getAstFromCodeString(inputCode);

  babelTraverse(ast, {
    enter(nodePath: NodePath) {
      const isFileLevelNode = nodePath.isFile() || nodePath.isProgram();
      const belongsToImportOrExport = isImportOrExport(nodePath);
      const isWhitelistedPath = INDEX_FILE_PATH_WHITELIST.some((whitelistedPathPart) => {
        return inputFilePath.includes(whitelistedPathPart);
      });
      const isTopLevel = nodePath.parentPath && (
          nodePath.parentPath.isProgram() || nodePath.parentPath.isExportDeclaration()
      );

      if (isFileLevelNode || belongsToImportOrExport || isWhitelistedPath || !isTopLevel) {
        return;
      }

      const node = nodePath.node;
      const {name, loc, kind} = getIdentifierInfo(node);

      logLinterViolation(
          inputFilePath,
          loc,
          [
            `Invalid top-level ${kind} (${node.type})${name ? `: '${name}'` : ''}.`,
            'index.ts files may only contain imports and exports.',
          ],
      );
      return;
    },
  });
}

function checkAllExportNames(inputFilePath: string, inputCode: string) {
  const ast = getAstFromCodeString(inputCode);

  const checkDeclarationName = (nodePath: NodePath) => {
    checkOneIdentifierName(nodePath, inputFilePath);
  };

  babelTraverse(ast, {
    Function: checkDeclarationName,
    ClassDeclaration: checkDeclarationName,
    TSEnumDeclaration: checkDeclarationName,
    TSInterfaceDeclaration: checkDeclarationName,
    TSTypeAliasDeclaration: checkDeclarationName,
    VariableDeclaration: checkDeclarationName,
  });

  babelTraverse(ast, {
    ExportNamedDeclaration(nodePath: NodePath<babelTypes.ExportNamedDeclaration>) {
      const node = nodePath.node;
      for (const specifier of node.specifiers) {
        const loc = specifier.exported.loc;
        const name = specifier.exported.name;
        if (!inputFilePath.endsWith('/index.ts')) {
          logLinterViolation(
              inputFilePath,
              loc,
              [
                `Named object exports are only allowed in index.ts files: '${name}'.`,
                'Please use inline export syntax instead. E.g.:',
                '',
                `    export [function|class|interface|enum|type] ${name}...`,
              ],
          );
          return;
        }
      }
    },
  });
}

function checkAllIdentifierNames(inputFilePath: string, inputCode: string) {
  const ast = getAstFromCodeString(inputCode);

  const checkName = (nodePath: NodePath) => {
    checkOneIdentifierName(nodePath, inputFilePath);
  };
  const checkAccessibility = (nodePath: ClassMemberNodePath) => {
    checkOneClassMemberAccessibility(nodePath, inputFilePath);
  };
  const checkExportedSymbolInReadme = (nodePath: NodePath) => {
    if (isInlineExportedSymbol(nodePath)) {
      checkOneClassMemberIsInReadme(nodePath, inputFilePath);
    }
  };

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
    ClassMethod: checkExportedSymbolInReadme,
    ClassProperty: checkExportedSymbolInReadme,
    Function: checkExportedSymbolInReadme,
    TSEnumDeclaration: checkExportedSymbolInReadme,
    TSMethodSignature: checkExportedSymbolInReadme,
    TSType: checkExportedSymbolInReadme,
    VariableDeclaration: checkExportedSymbolInReadme,
  });
}

function checkOneIdentifierName(
    nodePath: NodePath,
    inputFilePath: string,
) {
  const node = nodePath.node;
  const {name, loc, kind} = getIdentifierInfo(node);
  if (!name) {
    return;
  }

  if (name.startsWith('_')) {
    logLinterViolation(
        inputFilePath,
        loc,
        [
          `Prohibited ${kind} name: '${name}'.`,
          `Leading underscores are not allowed.`,
        ],
    );
    return;
  }

  const isExportedInline = nodePath.parentPath.isExportDeclaration();
  const isInterface = babelTypes.isInterfaceDeclaration(node) || babelTypes.isTSInterfaceDeclaration(node);
  const isClass = babelTypes.isClassDeclaration(node);
  const isType = babelTypes.isTypeAlias(node) || babelTypes.isTSTypeAliasDeclaration(node);
  const isEnum = babelTypes.isTSEnumDeclaration(node);
  const isVariable = babelTypes.isVariableDeclaration(node);

  if (isExportedInline && (isInterface || isClass || isType || isEnum || isVariable)) {
    const isWhitelisted =
        EXPORT_MDC_PREFIX_PATH_WHITELIST.some((whitelistedPathPart) => inputFilePath.includes(whitelistedPathPart)) ||
        EXPORT_MDC_PREFIX_NAME_WHITELIST.indexOf(name) > -1;
    if (!name.startsWith('MDC') && !isWhitelisted) {
      logLinterViolation(
          inputFilePath,
          loc,
          [
            `Prohibited ${kind} name: '${name}'.`,
            `Publicly exported symbols must begin with an 'MDC' prefix.`,
          ],
      );
      return;
    }
  }

  const isModuleLevelVariable =
      babelTypes.isVariableDeclaration(node) &&
      nodePath.parentPath.isProgram() &&
      !isExportedInline;

  const isTrailingUnderscoreAllowed =
      babelTypes.isClassMethod(node) ||
      babelTypes.isClassProperty(node) ||
      isModuleLevelVariable;

  if (name.endsWith('_') && !isTrailingUnderscoreAllowed) {
    logLinterViolation(
        inputFilePath,
        loc,
        [
          `Prohibited ${kind} name: '${name}'.`,
          'Trailing underscores are only allowed on class methods/properties and non-exported module-level variables.',
        ],
    );
    return;
  }
}

function checkOneClassMemberAccessibility(
    nodePath: ClassMemberNodePath,
    inputFilePath: string,
) {
  const node = nodePath.node;
  const {name, loc, kind} = getIdentifierInfo(node);
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
        [
          `Prohibited ${kind} name: '${name}'.`,
          `Non-public members must end with a trailing underscore (e.g., ${name}_).`,
        ],
    );
    return;
  }

  if (isPublicAccess && !isPublicName) {
    logLinterViolation(
        inputFilePath,
        loc,
        [
          `Wrong visibility for ${kind} name: '${name}'.`,
          `Member names that end with a trailing underscore must be marked private or protected.`,
        ],
    );
    return;
  }
}

function checkOneClassMemberIsInReadme(
    nodePath: NodePath,
    inputFilePath: string,
) {
  const {node} = nodePath;
  const {name, loc, kind} = getIdentifierInfo(node);
  if (!name || README_WHITELIST.includes(name)) {
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
        [
          `Missing documentation for ${kind}: '${name}'.`,
          `Most publicly exported symbols must be documented in '${readmeFilePathRelative}'.`,
        ],
    );
    return;
  }
}

function checkAllAdaptersAndFoundations(inputFilePath: string, inputCode: string) {
  const isAdapterFile = inputFilePath.endsWith('adapter.ts');
  const isFoundationFile = inputFilePath.endsWith('foundation.ts');
  const publiclyExportedClassNames: string[] = [];
  const ast = getAstFromCodeString(inputCode);

  babelTraverse(ast, {
    ClassDeclaration(nodePath: NodePath<babelTypes.ClassDeclaration>) {
      collectPubliclyExportedClassNames(nodePath, publiclyExportedClassNames);
    },
    InterfaceDeclaration(nodePath: NodePath<babelTypes.InterfaceDeclaration>) {
      collectPubliclyExportedClassNames(nodePath, publiclyExportedClassNames);
    },
    TSInterfaceDeclaration(nodePath: NodePath<babelTypes.TSInterfaceDeclaration>) {
      collectPubliclyExportedClassNames(nodePath, publiclyExportedClassNames);
    },
  });

  if (isAdapterFile) {
    babelTraverse(ast, {
      enter(nodePath: NodePath) {
        const isTopLevelNode =
            nodePath.parentPath &&
            (nodePath.parentPath.isProgram() || nodePath.parentPath.isExportDeclaration());
        if (isTopLevelNode) {
          checkOneTopLevelAdapterNode(nodePath, inputFilePath);
        }
      },
      ClassDeclaration(nodePath: NodePath<babelTypes.ClassDeclaration>) {
        collectPubliclyExportedClassNames(nodePath, publiclyExportedClassNames);
      },
      InterfaceDeclaration(nodePath: NodePath<babelTypes.InterfaceDeclaration>) {
        checkOneAdapterName(nodePath, inputFilePath);
      },
      TSInterfaceDeclaration(nodePath: NodePath<babelTypes.TSInterfaceDeclaration>) {
        checkOneAdapterName(nodePath, inputFilePath);
      },
    });

    if (!publiclyExportedClassNames.some((className) => className.endsWith('Adapter'))) {
      logLinterViolation(
          inputFilePath,
          ast.loc,
          `*adapter.ts files must export at least one public interface ending in 'Adapter'.`,
      );
      return;
    }
  }

  if (isFoundationFile) {
    if (!publiclyExportedClassNames.some((className) => className.endsWith('Foundation'))) {
      logLinterViolation(
          inputFilePath,
          ast.loc,
          `All *foundation.ts files must export at least one public class ending in 'Foundation'.`,
      );
      return;
    }
  }
}

function checkOneTopLevelAdapterNode(nodePath: NodePath, inputFilePath: string) {
  const node = nodePath.node;
  const {name, loc, kind} = getIdentifierInfo(node);

  const isFileLevelNode =
      nodePath.isFile() ||
      nodePath.isProgram() ||
      nodePath.isExportDeclaration() ||
      isImportDeclaration(nodePath);
  const isInterface = babelTypes.isInterfaceDeclaration(node) || babelTypes.isTSInterfaceDeclaration(node);
  if (isFileLevelNode || isInterface) {
    return;
  }

  logLinterViolation(
      inputFilePath,
      loc,
      [
        `Invalid top-level ${kind} (${node.type})${name ? `: '${name}'` : ''}.`,
        `Only interfaces are allowed in *adapter.ts files.`,
      ],
  );
}

function checkOneAdapterName(nodePath: NodePath<ClassLikeNode>, inputFilePath: string) {
  const node = nodePath.node;
  const {name, loc, kind} = getIdentifierInfo(node);
  const id = nodePath.node.id;

  if (id && !id.name.endsWith('Adapter')) {
    logLinterViolation(
        inputFilePath,
        loc,
        [
          `Invalid top-level ${kind} (${node.type})${name ? `: '${name}'` : ''}.`,
          `All type names in *adapter.ts files must end with 'Adapter'.`,
          `This keeps the files lean and predictable.`,
        ],
    );
    return;
  }

  if (!isInlineExportedSymbol(nodePath)) {
    logLinterViolation(
        inputFilePath,
        loc,
        [
          `Invalid top-level ${kind} (${node.type})${name ? `: '${name}'` : ''}.`,
          `All types in *adapter.ts files must be exported.`,
        ],
    );
    return;
  }
}

function collectPubliclyExportedClassNames(nodePath: NodePath<ClassLikeNode>, classNames: string[]) {
  const id = nodePath.node.id;
  if (id && isInlineExportedSymbol(nodePath)) {
    classNames.push(id.name);
  }
}

function getIdentifierInfo(node: babelTypes.Node): NamedIdentifier {
  const kind = getNodeKind(node);
  if (babelTypes.isClassMethod(node) ||
      babelTypes.isClassProperty(node) ||
      babelTypes.isObjectMethod(node) ||
      babelTypes.isObjectProperty(node) ||
      babelTypes.isTSMethodSignature(node)) {
    const key = node.key;
    if (babelTypes.isIdentifier(key) && key.name) {
      return {...key, kind};
    }
  } else if ((babelTypes.isClassDeclaration(node) ||
              babelTypes.isFunctionDeclaration(node) ||
              babelTypes.isTSInterfaceDeclaration(node) ||
              babelTypes.isTSTypeAliasDeclaration(node)) && node.id) {
    return {...node.id, kind};
  } else if (babelTypes.isIdentifier(node)) {
    return {...node, kind};
  } else if (babelTypes.isTSEnumDeclaration(node)) {
    return {...node.id, kind};
  } else if (babelTypes.isTSLiteralType(node)) {
    return {name: String(node.literal.value), loc: node.literal.loc, kind};
  } else if (babelTypes.isStringLiteral(node)) {
    return {name: node.value, loc: node.loc, kind};
  } else if (babelTypes.isVariableDeclaration(node)) {
    const firstId = node.declarations[0].id;
    if (babelTypes.isIdentifier(firstId)) {
      return {...firstId, kind};
    }
  }
  return {name: null, loc: node.loc, kind};
}

function getNodeKind(node: babelTypes.Node): NodeKind {
  if (babelTypes.isInterfaceDeclaration(node) || babelTypes.isTSInterfaceDeclaration(node)) {
    return 'interface';
  }
  if (babelTypes.isClassDeclaration(node)) {
    return 'class';
  }
  if (babelTypes.isTSEnumDeclaration(node)) {
    return 'enum';
  }
  if (babelTypes.isVariableDeclaration(node)) {
    return 'variable';
  }
  if (babelTypes.isVariableDeclaration(node)) {
    return 'variable';
  }
  if (isMethodLike(node) && node.kind === 'get') {
    return 'getter';
  }
  if (isMethodLike(node) && node.kind === 'set') {
    return 'setter';
  }
  if (isMethodLike(node) && node.kind === 'constructor') {
    return 'constructor';
  }
  if (isMethodLike(node) && node.kind === 'method') {
    return 'method';
  }
  if (babelTypes.isProperty(node)) {
    return 'property';
  }
  if (babelTypes.isTypeAlias(node) || babelTypes.isTypeAnnotation(node) || babelTypes.isTSType(node) ||
      babelTypes.isTSTypeAliasDeclaration(node) || babelTypes.isTSTypeLiteral(node)) {
    return 'type';
  }
  return 'symbol';
}

function isMethodLike(node: babelTypes.Node): node is babelTypes.ClassMethod | babelTypes.ObjectMethod {
  return babelTypes.isClassMethod(node) || babelTypes.isObjectMethod(node);
}

function isImportOrExport(nodePath: NodePath): nodePath is
    NodePath<babelTypes.ImportDeclaration> | NodePath<babelTypes.ExportDeclaration> {
  return isImportDeclaration(nodePath) || isInlineExportedSymbol(nodePath);
}

function isImportDeclaration(nodePath: NodePath) {
  return (
      nodePath.isImportDeclaration() ||
      Boolean(nodePath.findParent((parentPath) => parentPath.isImportDeclaration()))
  );
}

function isInlineExportedSymbol(nodePath: NodePath) {
  return (
      nodePath.isExportDeclaration() ||
      (nodePath.parentPath && nodePath.parentPath.isExportDeclaration())
  );
}

function isStaticOrNonPublicMember(node: babelTypes.Node): boolean {
  const {name} = getIdentifierInfo(node);
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
