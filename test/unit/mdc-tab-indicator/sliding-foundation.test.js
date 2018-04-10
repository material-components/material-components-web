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

import td from 'testdouble';

import {captureHandlers} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import {createMockRaf} from '../helpers/raf';
import MDCSlidingTabIndicatorFoundation from '../../../packages/mdc-tab-indicator/sliding-foundation';

suite('MDCSlidingTabIndicatorFoundation');

const setupTest = () => setupFoundationTest(MDCSlidingTabIndicatorFoundation);

test(`#activate adds the ${MDCSlidingTabIndicatorFoundation.cssClasses.ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});
  foundation.activate({width: 90, left: 25});
  td.verify(mockAdapter.addClass(MDCSlidingTabIndicatorFoundation.cssClasses.ACTIVE));
});

test('#activate sets the transform property', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});
  foundation.activate({width: 90, left: 25});
  td.verify(mockAdapter.setContentStyleProperty('transform', 'translateX(15px) scaleX(0.9)'));
});

test('#activate registers a transitionend handler', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});
  foundation.activate({width: 90, left: 25});
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`#activate adds the ${MDCSlidingTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});
  foundation.activate({width: 90, left: 25});
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.addClass(MDCSlidingTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE));
});

test('#activate resets the transform property', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});
  foundation.activate({width: 90, left: 25});
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.setContentStyleProperty('transform', ''));
});

test('#activate does not modify transform if no client rect is passed', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.setContentStyleProperty('transform', td.matchers.isA(String)), {times: 0});
});

test(`#deactivate removes the ${MDCSlidingTabIndicatorFoundation.cssClasses.ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.removeClass(MDCSlidingTabIndicatorFoundation.cssClasses.ACTIVE));
});

test(`#deactivate removes the ${MDCSlidingTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.removeClass(MDCSlidingTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE));
});

test('#deactivate deregisters the transitionend handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test('on transitionend, deregister the transitionend handler', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});
  foundation.activate({width: 90, left: 25});
  handlers.transitionend();
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`on transitionend, remove the ${MDCSlidingTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});
  foundation.activate({width: 90, left: 25});
  handlers.transitionend();
  td.verify(mockAdapter.removeClass(MDCSlidingTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE));
});
