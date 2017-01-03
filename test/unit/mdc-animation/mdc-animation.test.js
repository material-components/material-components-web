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

import test from 'tape';
import td from 'testdouble';

import {getCorrectEventName} from '../../../packages/mdc-animation';
import {getCorrectPropertyName} from '../../../packages/mdc-animation';

// Has no properties without a prefix
const legacyWindowObj = td.object({
  document: {
    createElement: (str) => ({
      style: {
        'webkitTransform': 'nah',
      },
    }),
  },
});

test('#getCorrectEventName does not prefix events when not necessary', (t) => {
  const windowObj = td.object({
  document: {
    createElement: (str) => ({
      style: {
        animation: 'none',
      },
    }),
  },
});

  t.equal(
    getCorrectEventName(windowObj, 'animationstart'),
    'animationstart',
    'no prefix'
  );

  t.end();
});

test('#getCorrectEventName does not prefix events if window does not contain a DOM node', (t) => {
  const windowObj = td.object({});

  t.equal(
    getCorrectEventName(windowObj, 'animationstart'),
    'animationstart',
    'no prefix'
  );

  t.end();
});

test('#getCorrectPropertyName does not prefix events if window does not contain a DOM node', (t) => {
  const windowObj = td.object({});

  t.equal(
    getCorrectPropertyName(windowObj, 'transition'),
    'transition',
    'no prefix'
  );

  t.end();
});

test('#getCorrectPropertyName prefixes css properties when required', (t) => {
  t.equal(
    getCorrectPropertyName(legacyWindowObj, 'animation'),
    '-webkit-animation',
    'added prefix'
  );

  t.equal(
    getCorrectPropertyName(legacyWindowObj, 'transform'),
    '-webkit-transform',
    'added prefix'
  );

  t.equal(
    getCorrectPropertyName(legacyWindowObj, 'transition'),
    '-webkit-transition',
    'added prefix'
  );

  t.end();
});

test('#getCorrectEventName prefixes javascript events when required', (t) => {
  t.equal(
    getCorrectEventName(legacyWindowObj, 'animationstart'),
    'webkitAnimationStart',
    'added prefix'
  );

  t.equal(
    getCorrectEventName(legacyWindowObj, 'animationend'),
    'webkitAnimationEnd',
    'added prefix'
  );

  t.equal(
    getCorrectEventName(legacyWindowObj, 'animationiteration'),
    'webkitAnimationIteration',
    'added prefix'
  );

  t.equal(
    getCorrectEventName(legacyWindowObj, 'transitionend'),
    'webkitTransitionEnd',
    'added prefix'
  );

  t.end();
});
