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
import bel from 'bel';
import td from 'testdouble';

import {closest, matches, estimateScrollWidth} from '../../../packages/mdc-dom/ponyfill.ts';

suite('MDCDom - ponyfill');

test('#closest returns result from native method if available', () => {
  const mockElement = td.object({closest: () => {}});
  const selector = '.foo';
  td.when(mockElement.closest(selector)).thenReturn(mockElement);

  assert.strictEqual(closest(mockElement, selector), mockElement);
});

test('#closest returns the element when the selector matches the element', () => {
  const mockElement = td.object({matches: () => {}});
  const selector = '.foo';
  td.when(mockElement.matches(selector)).thenReturn(true);

  assert.strictEqual(closest(mockElement, selector), mockElement);
});

test('#closest returns the parent element when the selector matches the parent element', () => {
  const mockParentElement = td.object({matches: () => {}});
  const mockChildElement = {
    matches: td.func('mockChildElement#matches'),
    parentElement: mockParentElement,
  };
  const selector = '.foo';
  td.when(mockChildElement.matches(selector)).thenReturn(false);
  td.when(mockParentElement.matches(selector)).thenReturn(true);

  assert.strictEqual(closest(mockChildElement, selector), mockParentElement);
});

test('#closest returns null when there is no ancestor matching the selector', () => {
  const mockParentElement = td.object({matches: () => {}});
  const mockChildElement = {
    matches: td.func('mockChildElement#matches'),
    parentElement: mockParentElement,
  };
  const selector = '.foo';
  td.when(mockChildElement.matches(selector)).thenReturn(false);
  td.when(mockParentElement.matches(selector)).thenReturn(false);

  assert.isNull(closest(mockChildElement, selector));
});

test('#matches returns true when the selector matches the element', () => {
  const element = bel`<div class="foo"></div>`;
  assert.isTrue(matches(element, '.foo'));
});

test('#matches returns false when the selector does not match the element', () => {
  const element = bel`<div class="foo"></div>`;
  assert.isFalse(matches(element, '.bar'));
});

test('#matches supports vendor prefixes', () => {
  assert.isTrue(matches({matches: () => true}, ''));
  assert.isTrue(matches({webkitMatchesSelector: () => true}, ''));
  assert.isTrue(matches({msMatchesSelector: () => true}, ''));
});

test('#estimateScrollWidth returns the default width when the element is not hidden', () => {
  const root = bel`<span>
    <span id="i0" style="width:10px;"></span>
  </span>`;
  const el = root.querySelector('#i0');
  assert.strictEqual(estimateScrollWidth(el), 10);
});

test('#estimateScrollWidth returns the estimated width when the element is hidden', () => {
  const root = bel`<span style="display:none;">
    <span id="i0" style="width:10px;"></span>
  </span>`;
  const el = root.querySelector('#i0');
  assert.strictEqual(estimateScrollWidth(el), 10);
});
