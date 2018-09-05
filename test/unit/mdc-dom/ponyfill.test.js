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

import {matches} from '../../../packages/mdc-dom/ponyfill';

suite('MDCDom - ponyfill');

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
