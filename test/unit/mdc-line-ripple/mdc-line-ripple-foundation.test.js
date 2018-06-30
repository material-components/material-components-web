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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCLineRippleFoundation from '../../../packages/mdc-line-ripple/foundation';

const {cssClasses} = MDCLineRippleFoundation;

suite('MDCLineRippleFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCLineRippleFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCLineRippleFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCLineRippleFoundation, [
    'addClass', 'removeClass', 'hasClass', 'setStyle',
    'registerEventHandler', 'deregisterEventHandler',
  ]);
});

const setupTest = () => setupFoundationTest(MDCLineRippleFoundation);

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`activate adds ${cssClasses.LINE_RIPPLE_ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.activate();
  td.verify(mockAdapter.addClass(cssClasses.LINE_RIPPLE_ACTIVE));
});

test(`deactivate adds ${cssClasses.LINE_RIPPLE_DEACTIVATING} class`, () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.deactivate();
  td.verify(mockAdapter.addClass(cssClasses.LINE_RIPPLE_DEACTIVATING));
});

test('opacity event after adding deactivating class triggers triggers removal of activation classes', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.LINE_RIPPLE_DEACTIVATING)).thenReturn(true);
  const event = {
    propertyName: 'opacity',
  };

  foundation.init();
  foundation.handleTransitionEnd(event);
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING));
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_ACTIVE));
});

test(`non opacity transition event doesn't remove ${cssClasses.LINE_RIPPLE_DEACTIVATING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.LINE_RIPPLE_DEACTIVATING)).thenReturn(true);
  const event = {
    propertyName: 'not-opacity',
  };
  foundation.init();

  foundation.handleTransitionEnd(event);
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_ACTIVE), {times: 0});
});

test(`opacity transition event doesn't remove ${cssClasses.LINE_RIPPLE_DEACTIVATING} class if not deactivating`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.LINE_RIPPLE_DEACTIVATING)).thenReturn(false);
  const event = {
    propertyName: 'opacity',
  };
  foundation.init();
  foundation.handleTransitionEnd(event);
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_ACTIVE), {times: 0});
});

test('setRippleCenter sets style attribute', () => {
  const {foundation, mockAdapter} = setupTest();
  const transformOriginValue = 100;

  foundation.init();
  foundation.setRippleCenter(transformOriginValue);

  td.verify(mockAdapter.setStyle('transform-origin', td.matchers.isA(String)));
});
