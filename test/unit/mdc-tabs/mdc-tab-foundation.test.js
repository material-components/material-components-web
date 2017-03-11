/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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
 * See the License for the specific language governing permissions and * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';

import {cssClasses} from '../../../packages/mdc-tabs/tab/constants';
import MDCTabFoundation from '../../../packages/mdc-tabs/tab/foundation';

suite('MDCTabFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabFoundation, [
    'addClass', 'removeClass', 'registerInteractionHandler',
    'deregisterInteractionHandler', 'getOffsetWidth', 'getOffsetLeft',
    'notifySelected',
  ]);
});

function setupTest() {
  return setupFoundationTest(MDCTabFoundation);
}

test('#init registers tab interaction handlers', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();

  td.verify(mockAdapter.registerInteractionHandler('click', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('keydown', isA(Function)));
});

test('#destroy deregisters tab interaction handlers', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();

  td.verify(mockAdapter.deregisterInteractionHandler('click', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('keydown', isA(Function)));
});

test('#getComputedWidth returns the width of the tab', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getOffsetWidth()).thenReturn(200);

  foundation.measureSelf();
  assert.equal(foundation.getComputedWidth(), 200);
});

test('#getComputedLeft returns the left offset of the tab', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getOffsetLeft()).thenReturn(100);

  foundation.measureSelf();
  assert.equal(foundation.getComputedLeft(), 100);
});

test('#isActive returns active state of the tab', () => {
  const {foundation} = setupTest();

  foundation.setActive(false);
  assert.isFalse(foundation.isActive());

  foundation.setActive(true);
  assert.isTrue(foundation.isActive());
});

test('#setActive adds active class when isActive is true', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setActive(true);
  td.verify(mockAdapter.addClass(cssClasses.ACTIVE));
});

test('#setActive removes active class when isActive is false', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setActive(false);
  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE));
});

test('#preventsDefaultOnClick returns state of preventsDefaultOnClick', () => {
  const {foundation} = setupTest();

  foundation.setPreventDefaultOnClick(false);
  assert.isFalse(foundation.preventsDefaultOnClick());

  foundation.setPreventDefaultOnClick(true);
  assert.isTrue(foundation.preventsDefaultOnClick());
});

test('#setPreventDefaultOnClick sets preventDefaultOnClick_' +
 'to the value of preventDefaultOnClick argument', () => {
   const {foundation} = setupTest();

   foundation.setPreventDefaultOnClick(false);

   assert.isFalse(foundation.preventDefaultOnClick_);
});

test('#measureSelf sets computedWidth_ and computedLeft_ for tab', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getOffsetWidth()).thenReturn(200);
  td.when(mockAdapter.getOffsetLeft()).thenReturn(100);

  foundation.measureSelf();

  assert.equal(foundation.computedWidth_, 200);
  assert.equal(foundation.computedLeft_, 100);
});
