/**
 * @license
 * Copyright 2020 Google Inc.
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

import * as utils from '../util';

describe('MDCMenuSurface - util', () => {
  it('getTransformPropertyName returns "transform" for browsers that support it',
     () => {
       const mockWindow = {
         document: {
           createElement: function() {
             return {style: {transform: null}};
           },
         },
       } as unknown as Window;
       expect(utils.getTransformPropertyName(mockWindow, true))
           .toEqual('transform');
     });

  it('getTransformPropertyName returns "webkitTransform" for browsers that do not support "transform"',
     () => {
       const mockWindow = {
         document: {
           createElement: function() {
             return {style: {webkitTransform: null}};
           },
         },
       } as unknown as Window;
       expect(utils.getTransformPropertyName(mockWindow, true))
           .toEqual('webkitTransform');
     });

  it('getTransformPropertyName caches the property name if forceRefresh 2nd arg is not given',
     () => {
       const mockElement = {style: {transform: null}};
       const mockWindow = {
         document: {
           createElement: () => mockElement,
         },
       } as unknown as Window;
       expect(utils.getTransformPropertyName(mockWindow, true))
           .toEqual('transform', 'sanity check');
       expect(utils.getTransformPropertyName(mockWindow))
           .toEqual('transform', 'sanity check no force refresh');

       // TODO(b/168652857): The operand of a 'delete' operator must be
       // optional.
       delete (mockElement as any).style.transform;
       expect(utils.getTransformPropertyName(mockWindow)).toEqual('transform');
       expect(utils.getTransformPropertyName(mockWindow, true))
           .toEqual('webkitTransform');
     });
});
