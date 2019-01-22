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

import {assert} from 'chai';
import td from 'testdouble';

import {
  PrefixedCssPropertyName,
  StandardCssPropertyName,
  PrefixedJsEventType,
  StandardJsEventType,
  getCorrectPropertyName,
  getCorrectEventName,
} from '../../../packages/mdc-animation/index.ts';

const {WEBKIT_ANIMATION, WEBKIT_TRANSFORM, WEBKIT_TRANSITION} = PrefixedCssPropertyName;
const {ANIMATION, TRANSFORM, TRANSITION} = StandardCssPropertyName;
const {
  WEBKIT_ANIMATION_END,
  WEBKIT_ANIMATION_ITERATION,
  WEBKIT_ANIMATION_START,
  WEBKIT_TRANSITION_END,
} = PrefixedJsEventType;
const {ANIMATION_END, ANIMATION_ITERATION, ANIMATION_START, TRANSITION_END} = StandardJsEventType;

// Has no properties without a prefix
const legacyWindowObj = td.object({
  document: {},
});
legacyWindowObj.document.createElement = () => ({
  style: {
    'webkitTransform': 'nah',
  },
});

suite('MDCAnimation');

test('#getCorrectEventName does not prefix events when not necessary', () => {
  const windowObj = td.object({
    document: {},
  });
  windowObj.document.createElement = () => ({
    style: {
      animation: 'none',
    },
  });

  assert.equal(
    getCorrectEventName(windowObj, ANIMATION_START),
    ANIMATION_START,
    'no prefix'
  );
});

test('#getCorrectPropertyName does not prefix events when not necessary', () => {
  const windowObj = td.object({
    document: {},
  });
  windowObj.document.createElement = () => ({
    style: {
      animation: 'none',
    },
  });

  assert.equal(
    getCorrectPropertyName(windowObj, ANIMATION),
    ANIMATION,
    'no prefix'
  );
});

test('#getCorrectEventName does not prefix events if window does not contain a DOM node', () => {
  const windowObj = td.object({});

  assert.equal(
    getCorrectEventName(windowObj, ANIMATION_START),
    ANIMATION_START,
    'no prefix'
  );
});

test('#getCorrectPropertyName does not prefix events if window does not contain a DOM node', () => {
  const windowObj = td.object({});

  assert.equal(
    getCorrectPropertyName(windowObj, TRANSITION),
    TRANSITION,
    'no prefix'
  );
});

test('#getCorrectPropertyName prefixes css properties when required', () => {
  assert.equal(
    getCorrectPropertyName(legacyWindowObj, ANIMATION),
    WEBKIT_ANIMATION,
    'added prefix'
  );

  assert.equal(
    getCorrectPropertyName(legacyWindowObj, TRANSFORM),
    WEBKIT_TRANSFORM,
    'added prefix'
  );

  assert.equal(
    getCorrectPropertyName(legacyWindowObj, TRANSITION),
    WEBKIT_TRANSITION,
    'added prefix'
  );
});

test('#getCorrectEventName prefixes javascript events when required', () => {
  assert.equal(
    getCorrectEventName(legacyWindowObj, ANIMATION_START),
    WEBKIT_ANIMATION_START,
    'added prefix'
  );

  assert.equal(
    getCorrectEventName(legacyWindowObj, ANIMATION_END),
    WEBKIT_ANIMATION_END,
    'added prefix'
  );

  assert.equal(
    getCorrectEventName(legacyWindowObj, ANIMATION_ITERATION),
    WEBKIT_ANIMATION_ITERATION,
    'added prefix'
  );

  assert.equal(
    getCorrectEventName(legacyWindowObj, TRANSITION_END),
    WEBKIT_TRANSITION_END,
    'added prefix'
  );
});
