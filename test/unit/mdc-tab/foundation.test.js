/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import MDCTabFoundation from '../../../packages/mdc-tab/foundation';

suite('MDCTabFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabFoundation, [
    'registerEventHandler', 'deregisterEventHandler',
    'addClass', 'removeClass', 'hasClass',
    'setAttr',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCTabFoundation.defaultAdapter);
  const indicator = td.object({
    getClientRect: () => {},
    activate: () => {},
    deactivate: () => {},
  });

  const foundation = new MDCTabFoundation(mockAdapter, indicator);
  return {foundation, mockAdapter, indicator};
};

test('#activate does nothing if already active', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.activate();
  td.verify(mockAdapter.addClass(MDCTabFoundation.cssClasses.ACTIVE), {times: 0});
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)), {times: 0});
});

test('#activate registers a transitionend listener on the root element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`#activate adds ${MDCTabFoundation.cssClasses.ACTIVE} class to the root element`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.addClass(MDCTabFoundation.cssClasses.ACTIVE));
});

test(`#activate adds ${MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE} class to the root element`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.addClass(MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE));
});

test('#activate sets the root element aria-selected attribute to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.setAttr(MDCTabFoundation.strings.ARIA_SELECTED, 'true'));
});

test('#deactivate does nothing if not active', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.addClass, {times: 0});
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)), {times: 0});
});

test('#deactivate registers a transitionend listener on the root element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.deactivate();
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`#deactivate removes ${MDCTabFoundation.cssClasses.ACTIVE} class from the root element`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.deactivate();
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ACTIVE));
});

test(`#deactivate adds ${MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE} class to the root element`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.deactivate();
  td.verify(mockAdapter.addClass(MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE));
});

test('#deactivate sets the root element aria-selected attribute to false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.deactivate();
  td.verify(mockAdapter.setAttr(MDCTabFoundation.strings.ARIA_SELECTED, 'false'));
});

test(`#handleTransitionEnd removes ${MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd({pseudoElement: ''});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE));
});

test(`#handleTransitionEnd removes ${MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd({pseudoElement: ''});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE));
});

test('#handleTransitionEnd deregisters the transitionend event listener', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd({pseudoElement: ''});
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test('#handleTransitionEnd does nothing when triggered by a pseudo element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd({pseudoElement: '::before'});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE), {times: 0});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE), {times: 0});
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)), {times: 0});
});

test('on transitionend, do nothing when triggered by a pseudeo element', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  foundation.activate();
  handlers.transitionend({pseudoElement: '::after'});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE), {times: 0});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE), {times: 0});
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)), {times: 0});
});

test('#getIndicatorClientRect calls getClientRect on the indicator', () => {
  const {foundation, indicator} = setupTest();
  foundation.getIndicatorClientRect();
  td.verify(indicator.getClientRect());
});
