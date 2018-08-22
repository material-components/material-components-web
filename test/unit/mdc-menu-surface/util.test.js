/**
 * @license
 * Copyright 2018 Google Inc.
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

import {assert} from 'chai';
import * as utils from '../../../packages/mdc-menu-surface/util';

suite('MDCMenuSurface - util');

test('getTransformPropertyName returns "transform" for browsers that support it', () => {
  const mockWindow = {
    document: {
      createElement: function() {
        return {style: {transform: null}};
      },
    },
  };
  assert.equal(utils.getTransformPropertyName(mockWindow, true), 'transform');
});

test('getTransformPropertyName returns "webkitTransform" for browsers that do not support "transform"', () => {
  const mockWindow = {
    document: {
      createElement: function() {
        return {style: {webkitTransform: null}};
      },
    },
  };
  assert.equal(utils.getTransformPropertyName(mockWindow, true), 'webkitTransform');
});

test('getTransformPropertyName caches the property name if forceRefresh 2nd arg is not given', () => {
  const mockElement = {style: {transform: null}};
  const mockWindow = {
    document: {
      createElement: () => mockElement,
    },
  };
  assert.equal(utils.getTransformPropertyName(mockWindow, true), 'transform', 'sanity check');
  assert.equal(utils.getTransformPropertyName(mockWindow), 'transform', 'sanity check no force refresh');

  delete mockElement.style.transform;
  assert.equal(utils.getTransformPropertyName(mockWindow), 'transform');
  assert.equal(utils.getTransformPropertyName(mockWindow, true), 'webkitTransform');
});
