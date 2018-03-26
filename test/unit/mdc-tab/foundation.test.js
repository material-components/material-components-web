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
import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';
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
    'registerIndicatorEventHandler', 'deregisterIndicatorEventHandler',
    'addClass', 'removeClass', 'hasClass',
    'setAttr',
    'setIndicatorStyleProperty',
    'getIndicatorClientRect',
    'indicatorHasClass',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabFoundation);

test('#activate does nothing if already active', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.activate();
  td.verify(mockAdapter.addClass(MDCTabFoundation.cssClasses.ACTIVE), {times: 0});
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)), {times: 0});
});

/** Test activateTab_ */

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

/** Test activateIndicator_ */

test('#activate does nothing if no indicator rect is passed', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.setIndicatorStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
});

test(`#activate does nothing if indicator has class ${MDCTabFoundation.cssClasses.INDICATOR_ICON}`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.indicatorHasClass(MDCTabFoundation.cssClasses.INDICATOR_ICON)).thenReturn(true);
  foundation.activate({width: 100, left: 0});
  td.verify(mockAdapter.setIndicatorStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
});

test('#activate sets the indicator style transform property to the previous indicator\'s dimensions', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getIndicatorClientRect()).thenReturn({width: 100, left: 25});
  foundation.activate({width: 90, left: 0});
  td.verify(mockAdapter.setIndicatorStyleProperty('transform', 'translateX(-25px) scaleX(0.9)'));
});

test('#activate registers an event handler on the indicator element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getIndicatorClientRect()).thenReturn({width: 100, left: 25});
  foundation.activate({width: 90, left: 0});
  td.verify(mockAdapter.registerIndicatorEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`#activate adds class ${MDCTabFoundation.cssClasses.ANIMATING_INDICATOR} to the indicator element`, () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  td.when(mockAdapter.getIndicatorClientRect()).thenReturn({width: 100, left: 25});
  foundation.activate({width: 90, left: 0});
  raf.flush();
  td.verify(mockAdapter.addClass(MDCTabFoundation.cssClasses.ANIMATING_INDICATOR));
  raf.restore();
});

test('#activate sets the indicator style transform property to an empty string', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  td.when(mockAdapter.getIndicatorClientRect()).thenReturn({width: 100, left: 25});
  foundation.activate({width: 90, left: 0});
  raf.flush();
  td.verify(mockAdapter.setIndicatorStyleProperty('transform', ''));
  raf.restore();
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

test(`#deactivate removes ${MDCTabFoundation.cssClasses.ACTIVE} class to the root element`, () => {
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

test('#getIndicatorClientRect returns the indicator\'s client rect', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.getIndicatorClientRect();
  td.verify(mockAdapter.getIndicatorClientRect(), {times: 1});
});

test(`#handleRootTransitionEnd removes ${MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleRootTransitionEnd({pseudoElement: ''});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE));
});

test(`#handleRootTransitionEnd removes ${MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleRootTransitionEnd({pseudoElement: ''});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE));
});

test('#handleRootTransitionEnd deregisters the transitionend event listener', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleRootTransitionEnd({pseudoElement: ''});
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test('#handleRootTransitionEnd does nothing when triggered by a pseudo element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleRootTransitionEnd({pseudoElement: '::before'});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE), {times: 0});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE), {times: 0});
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)), {times: 0});
});

test('on root transitionend, do nothing when triggered by a pseudeo element', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  foundation.activate();
  handlers.transitionend({pseudoElement: '::after'});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE), {times: 0});
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE), {times: 0});
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)), {times: 0});
});

test(`#handleIndicatorTransitionEnd removes ${MDCTabFoundation.cssClasses.ANIMATING_INDICATOR} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleIndicatorTransitionEnd();
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_INDICATOR));
});

test('#handleIndicatorTransitionEnd deregisters the transitionend event listener', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleIndicatorTransitionEnd();
  td.verify(mockAdapter.deregisterIndicatorEventHandler('transitionend', td.matchers.isA(Function)));
});

test('on indicator transitionend', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerIndicatorEventHandler');
  td.when(mockAdapter.getIndicatorClientRect()).thenReturn({width: 100, left: 25});
  foundation.activate({width: 90, left: 0});
  handlers.transitionend();
  // td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_ACTIVATE), {times: 0});
  // td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ANIMATING_DEACTIVATE), {times: 0});
  // td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)), {times: 0});
});
