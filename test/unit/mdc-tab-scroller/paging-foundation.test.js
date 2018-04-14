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
import MDCTabPagingFoundation from '../../../packages/mdc-tab-scroller/paging-foundation';

suite('MDCTabPagingFoundation');

const setupTest = () => setupFoundationTest(MDCTabPagingFoundation);

test('#handleTransitionEnd() deregisters the transitionend handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)), {times: 1});
});

test(`#handleTransitionEnd() removes the ${MDCTabPagingFoundation.cssClasses.ANIMATING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.removeClass(MDCTabPagingFoundation.cssClasses.ANIMATING), {times: 1});
});

function setupScrollToTest({rootWidth=300, contentWidth=1000, translateX=0}={}) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.computeClientRect()).thenReturn({width: rootWidth});
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: contentWidth});
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn(`matrix(1, 0, 0, 0, ${translateX}, 0)`);
  return {foundation, mockAdapter};
}

test('#scrollTo() exits early if difference between scrollX and translateX is 0', () => {
  const {foundation, mockAdapter} = setupScrollToTest({translateX: -212});
  foundation.scrollTo(212);
  td.verify(mockAdapter.setContentStyleProperty('transform', td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#scrollTo() registers a transitionend handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(416);
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)), {times: 1});
});

test(`#scrollTo() adds the ${MDCTabPagingFoundation.cssClasses.ANIMATING} class`, () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(619);
  td.verify(mockAdapter.addClass(MDCTabPagingFoundation.cssClasses.ANIMATING), {times: 1});
});

test('#scrollTo() sets the content transform property to the transform delta', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(313);
  td.verify(mockAdapter.setContentStyleProperty('transform', 'translateX(-313px)'), {times: 1});
});

function setupTransitionendTest() {
  const {foundation, mockAdapter} = setupScrollToTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  return {foundation, mockAdapter, handlers};
}

test('on transitionend, deregister the transitionend handler', () => {
  const {handlers, foundation, mockAdapter} = setupTransitionendTest();
  foundation.scrollTo(703);
  handlers.transitionend();
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)), {times: 1});
});
