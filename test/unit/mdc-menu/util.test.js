/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import {assert} from 'chai';
import * as utils from '../../../packages/mdc-menu/util';

suite('MDCMenu - util');

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

test('clamp clamps values lower than 0 to 0', () => {
  assert.equal(utils.clamp(-0.8), 0);
  assert.equal(utils.clamp(-0.42), 0);
  assert.equal(utils.clamp(-0.111111), 0);
});

test('clamp clamps values higer than 1 to 1', () => {
  assert.equal(utils.clamp(1.8), 1);
  assert.equal(utils.clamp(1.42), 1);
  assert.equal(utils.clamp(1.111111), 1);
});

test('clamp does not modify values between 0 and 1', () => {
  assert.equal(utils.clamp(0.8), 0.8);
  assert.equal(utils.clamp(0.42), 0.42);
  assert.equal(utils.clamp(0.111111), 0.111111);
});

test('clamp correctly clamps with a provided minimum value', () => {
  assert.equal(utils.clamp(-0.8, 0.2), 0.2);
  assert.equal(utils.clamp(-0.42, -0.5), -0.42);
  assert.equal(utils.clamp(0.111111, 1), 1);
});

test('clamp correctly clamps with provided minimum and maximum values', () => {
  assert.equal(utils.clamp(-0.8, 0.2, 0.3), 0.2);
  assert.equal(utils.clamp(0.42, 0.3, 0.5), 0.42);
  assert.equal(utils.clamp(5.111111, 1, 5), 5);
});

function testBezier(curve, expected) {
  Object.keys(expected).forEach((time) => {
    // Compare values rounded to 3 decimal places.
    const raw = utils.bezierProgress(parseFloat(time), curve.x1, curve.y1, curve.x2, curve.y2);
    const actual = parseFloat(raw.toFixed(3));
    const value = expected[time];
    assert.equal(actual, value, `At time ${time}: value ${actual} should be ${value}`);
  });
}

test('bezierProgress returns the right values for a linear curve', () => {
  const curve = {x1: 0, y1: 0, x2: 1, y2: 1};
  const expected = {
    0: 0,
    0.2: 0.2,
    0.5: 0.5,
    0.8: 0.8,
    1: 1,
  };
  testBezier(curve, expected);
});

test('bezierProgress returns the right values for an ease curve', () => {
  const curve = {x1: 0.25, y1: 0.1, x2: 0.25, y2: 1};
  const expected = {
    0: 0,
    0.2: 0.295,
    0.5: 0.802,
    0.8: 0.976,
    1: 1,
  };
  testBezier(curve, expected);
});

test('bezierProgress returns the right values for a (1, 0, 0, 1) curve', () => {
  const curve = {x1: 1, y1: 0, x2: 0, y2: 1};
  const expected = {
    0: 0,
    0.2: 0.017,
    0.5: 0.5,
    0.8: 0.983,
    1: 1,
  };
  testBezier(curve, expected);
});

test('bezierProgress returns the right values for a (0.99, 0.36, 0, 0.75) curve', () => {
  const curve = {x1: 0.99, y1: 0.36, x2: 0, y2: 0.75};
  const expected = {
    0: 0,
    0.2: 0.086,
    0.5: 0.634,
    0.8: 0.939,
    1: 1,
  };
  testBezier(curve, expected);
});
