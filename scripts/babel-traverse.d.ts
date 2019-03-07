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
 * @fileoverview Typing declarations for the '@babel/traverse' NPM module.
 *
 * See https://babeljs.io/docs/en/babel-types for a list of all available AST node types.
 *
 * See https://stackoverflow.com/a/51114250/467582 for TypeScript's `import('...')` syntax.
 */

declare module '@babel/traverse' {
  declare function traverse(ast: babelTypes.Node, options: Partial<traverse.TraversalOptions>): void;

  declare namespace traverse {
    export interface NodePath<NodeType extends import('@babel/types').BaseNode = import('@babel/types').Node> {
      node: NodeType;
    }

    export interface ArrowFunctionExpressionNodePath extends NodePath<import('@babel/types').ArrowFunctionExpression> {}
    export interface AssignmentExpressionNodePath extends NodePath<import('@babel/types').AssignmentExpression> {}
    export interface ClassMethodNodePath extends NodePath<import('@babel/types').ClassMethod> {}
    export interface ClassPropertyNodePath extends NodePath<import('@babel/types').ClassProperty> {}
    export interface ExportDeclarationNodePath extends NodePath<import('@babel/types').ExportDeclaration> {}
    export interface FunctionDeclarationNodePath extends NodePath<import('@babel/types').FunctionDeclaration> {}
    export interface FunctionExpressionNodePath extends NodePath<import('@babel/types').FunctionExpression> {}
    export interface FunctionNodePath extends NodePath<import('@babel/types').Function> {}
    export interface IdentifierNodePath extends NodePath<import('@babel/types').Identifier> {}
    export interface ImportDeclarationNodePath extends NodePath<import('@babel/types').ImportDeclaration> {}
    export interface ObjectMethodNodePath extends NodePath<import('@babel/types').ObjectMethod> {}
    export interface ObjectPropertyNodePath extends NodePath<import('@babel/types').ObjectProperty> {}
    export interface PropertyNodePath extends NodePath<import('@babel/types').Property> {}
    export interface TSInterfaceBodyNodePath extends NodePath<import('@babel/types').TSInterfaceBody> {}
    export interface TSInterfaceDeclarationNodePath extends NodePath<import('@babel/types').TSInterfaceDeclaration> {}
    export interface TSMethodSignatureNodePath extends NodePath<import('@babel/types').TSMethodSignature> {}
    export interface TSPropertySignatureNodePath extends NodePath<import('@babel/types').TSPropertySignature> {}
    export interface TSTypeAnnotationNodePath extends NodePath<import('@babel/types').TSTypeAnnotation> {}

    export interface TraversalOptions {
      ArrowFunctionExpression: (nodePath: ArrowFunctionExpressionNodePath) => void;
      AssignmentExpression: (nodePath: AssignmentExpressionNodePath) => void;
      ClassMethod: (nodePath: ClassMethodNodePath) => void;
      ClassProperty: (nodePath: ClassPropertyNodePath) => void;
      ExportDeclaration: (nodePath: ExportDeclarationNodePath) => void;
      Function: (nodePath: FunctionNodePath) => void;
      FunctionDeclaration: (nodePath: FunctionDeclarationNodePath) => void;
      FunctionExpression: (nodePath: FunctionExpressionNodePath) => void;
      Identifier: (nodePath: IdentifierNodePath) => void;
      ImportDeclaration: (nodePath: ImportDeclarationNodePath) => void;
      ObjectMethod: (nodePath: ObjectMethodNodePath) => void;
      ObjectProperty: (nodePath: ObjectPropertyNodePath) => void;
      Property: (nodePath: PropertyNodePath) => void;
      TSInterfaceBody: (nodePath: TSInterfaceBodyNodePath) => void;
      TSInterfaceDeclaration: (nodePath: TSInterfaceDeclarationNodePath) => void;
      TSMethodSignature: (nodePath: TSMethodSignatureNodePath) => void;
      TSPropertySignature: (nodePath: TSPropertySignatureNodePath) => void;
      TSTypeAnnotation: (nodePath: TSTypeAnnotationNodePath) => void;
    }
  }

  export = traverse;
  export default traverse;
}
