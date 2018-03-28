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
import MDCTabIndicatorIconFoundation from '../../../packages/mdc-tab-indicator/icon-foundation';

suite('MDCTabIndicatorIconFoundation');

const setupTest = () => setupFoundationTest(MDCTabIndicatorIconFoundation);

test('#activate registers a transitionend handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`#activate adds the ${MDCTabIndicatorIconFoundation.cssClasses.ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.addClass(MDCTabIndicatorIconFoundation.cssClasses.ACTIVE));
});

test(`#activate adds the ${MDCTabIndicatorIconFoundation.cssClasses.ANIMATING_ICON_ACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.addClass(MDCTabIndicatorIconFoundation.cssClasses.ANIMATING_ICON_ACTIVATE));
});

test('#deactivate registers a transitionend handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`#deactivate removes the ${MDCTabIndicatorIconFoundation.cssClasses.ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.removeClass(MDCTabIndicatorIconFoundation.cssClasses.ACTIVE));
});

test(`#deactivate adds the ${MDCTabIndicatorIconFoundation.cssClasses.ANIMATING_ICON_DEACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.addClass(MDCTabIndicatorIconFoundation.cssClasses.ANIMATING_ICON_DEACTIVATE));
});

test(`on transitionend, remove the ${MDCTabIndicatorIconFoundation.cssClasses.ANIMATING_ICON_ACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  foundation.activate();
  handlers.transitionend();
  td.verify(mockAdapter.removeClass(MDCTabIndicatorIconFoundation.cssClasses.ANIMATING_ICON_ACTIVATE));
});

test(`on transitionend, remove the ${MDCTabIndicatorIconFoundation.cssClasses.ANIMATING_ICON_DEACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  foundation.activate();
  handlers.transitionend();
  td.verify(mockAdapter.removeClass(MDCTabIndicatorIconFoundation.cssClasses.ANIMATING_ICON_DEACTIVATE));
});
