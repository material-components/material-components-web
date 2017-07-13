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
import td from 'testdouble';

import {getCorrectEventName} from '../../../packages/mdc-animation';
import {getCorrectPropertyName} from '../../../packages/mdc-animation';

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
    getCorrectEventName(windowObj, 'animationstart'),
    'animationstart',
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
    getCorrectPropertyName(windowObj, 'animation'),
    'animation',
    'no prefix'
  );
});

test('#getCorrectEventName does not prefix events if window does not contain a DOM node', () => {
  const windowObj = td.object({});

  assert.equal(
    getCorrectEventName(windowObj, 'animationstart'),
    'animationstart',
    'no prefix'
  );
});

test('#getCorrectPropertyName does not prefix events if window does not contain a DOM node', () => {
  const windowObj = td.object({});

  assert.equal(
    getCorrectPropertyName(windowObj, 'transition'),
    'transition',
    'no prefix'
  );
});

test('#getCorrectPropertyName prefixes css properties when required', () => {
  assert.equal(
    getCorrectPropertyName(legacyWindowObj, 'animation'),
    '-webkit-animation',
    'added prefix'
  );

  assert.equal(
    getCorrectPropertyName(legacyWindowObj, 'transform'),
    '-webkit-transform',
    'added prefix'
  );

  assert.equal(
    getCorrectPropertyName(legacyWindowObj, 'transition'),
    '-webkit-transition',
    'added prefix'
  );
});

test('#getCorrectEventName prefixes javascript events when required', () => {
  assert.equal(
    getCorrectEventName(legacyWindowObj, 'animationstart'),
    'webkitAnimationStart',
    'added prefix'
  );

  assert.equal(
    getCorrectEventName(legacyWindowObj, 'animationend'),
    'webkitAnimationEnd',
    'added prefix'
  );

  assert.equal(
    getCorrectEventName(legacyWindowObj, 'animationiteration'),
    'webkitAnimationIteration',
    'added prefix'
  );

  assert.equal(
    getCorrectEventName(legacyWindowObj, 'transitionend'),
    'webkitTransitionEnd',
    'added prefix'
  );
});
