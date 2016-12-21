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
// import bel from 'bel';
// import domEvents from 'dom-events';
import td from 'testdouble';

import {getAnimationEventName} from '../../../packages/mdc-animation';

const legacyWindowObj = td.object({
  document: {
    createElement: (str) => {
      return {
        style: {
          'webkitTransform': {},
        },
      };
    },
  },
});

test('#getAnimationEventName does not prefix events and properties when not necessary', (t) => {
  const windowObj = window;

  t.equal(
    getAnimationEventName(windowObj, 'transform'),
    'transform',
    'no prefix'
  );

  t.end();
});

test('#getAnimationEventName does not prefix events if errors', (t) => {
  const windowObj = {};

  t.equal(
    getAnimationEventName(windowObj, 'transform'),
    'transform',
    'no prefix'
  );

  t.end();
});

test('#getAnimationEventName prefixes css properties when required', (t) => {
  t.equal(
    getAnimationEventName(legacyWindowObj, 'animation'),
    '-webkit-animation',
    'added prefix'
  );

  t.equal(
    getAnimationEventName(legacyWindowObj, 'transform'),
    '-webkit-transform',
    'added prefix'
  );

  t.equal(
    getAnimationEventName(legacyWindowObj, 'transition'),
    '-webkit-transition',
    'added prefix'
  );

  t.end();
});

test('#getAnimationEventName prefixes javascript events when required', (t) => {
  t.equal(
    getAnimationEventName(legacyWindowObj, 'animationstart'),
    'webkitAnimationStart',
    'added prefix'
  );

  t.equal(
    getAnimationEventName(legacyWindowObj, 'animationend'),
    'webkitAnimationEnd',
    'added prefix'
  );

  t.equal(
    getAnimationEventName(legacyWindowObj, 'animationiteration'),
    'webkitAnimationIteration',
    'added prefix'
  );

  t.equal(
    getAnimationEventName(legacyWindowObj, 'transitionend'),
    'webkitTransitionEnd',
    'added prefix'
  );

  t.end();
});
