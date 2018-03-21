/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
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

import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTabIndicatorFoundation from '../../../packages/mdc-tab-indicator/foundation';

suite('MDCTabIndicatorFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabIndicatorFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabIndicatorFoundation, [
    'registerEventHandler', 'deregisterEventHandler',
    'addClass', 'removeClass', 'hasClass',
    'setRootStyleProperty',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabIndicatorFoundation);

test('#animatePosition registers a transitionend listener on the root element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.animatePosition({});
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test('#animatePosition adds an animating class to the root element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.animatePosition({});
  td.verify(mockAdapter.addClass(MDCTabIndicatorFoundation.cssClasses.ANIMATING));
});

test('#handleTransitionEnd removes the animating class from the root element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ANIMATING));
});

test('#handleTransitionEnd deregisters the transitionend event listener on the root element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test('on transitionend, removes the animating class and deregisters the handler', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  foundation.animatePosition({});
  handlers.transitionend();
  td.verify(mockAdapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ANIMATING));
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});
