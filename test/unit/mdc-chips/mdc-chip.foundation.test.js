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

import {verifyDefaultAdapter, captureHandlers} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';
import MDCChipFoundation from '../../../packages/mdc-chips/chip/foundation';

const {cssClasses} = MDCChipFoundation;

suite('MDCChipFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCChipFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCChipFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCChipFoundation, [
    'addClass', 'removeClass', 'hasClass', 'addClassToLeadingIcon', 'removeClassFromLeadingIcon',
    'eventTargetHasClass', 'registerEventHandler', 'deregisterEventHandler',
    'registerTrailingIconInteractionHandler', 'deregisterTrailingIconInteractionHandler',
    'notifyInteraction', 'notifyTrailingIconInteraction', 'notifyRemoval',
    'getComputedStyleValue', 'setStyleProperty',
  ]);
});

const setupTest = () => setupFoundationTest(MDCChipFoundation);

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerEventHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerEventHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('pointerdown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('mousedown', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterEventHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterEventHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('pointerdown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('mousedown', td.matchers.isA(Function)));
});

test('#isSelected returns true if mdc-chip--selected class is present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(true);
  assert.isTrue(foundation.isSelected());
});

test('#isSelected returns false if mdc-chip--selected class is not present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(false);
  assert.isFalse(foundation.isSelected());
});

test('#setSelected adds mdc-chip--selected class if true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(true);
  td.verify(mockAdapter.addClass(cssClasses.SELECTED));
});

test('#setSelected removes mdc-chip--selected class if false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(false);
  td.verify(mockAdapter.removeClass(cssClasses.SELECTED));
});

test('on click, emit custom event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  const mockEvt = {
    type: 'click',
  };

  foundation.init();
  handlers.click(mockEvt);

  td.verify(mockAdapter.notifyInteraction());
});

test('on chip width transition end, notify removal of chip', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'width',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHIP_EXIT)).thenReturn(true);

  foundation.init();
  handlers.transitionend(mockEvt);

  td.verify(mockAdapter.notifyRemoval());
});

test('on chip opacity transition end, animate width if chip is exiting', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHIP_EXIT)).thenReturn(true);
  td.when(mockAdapter.getComputedStyleValue('width')).thenReturn('100px');

  foundation.init();
  handlers.transitionend(mockEvt);

  raf.flush();
  td.verify(mockAdapter.setStyleProperty('width', '100px'));
  td.verify(mockAdapter.setStyleProperty('padding', '0'));
  td.verify(mockAdapter.setStyleProperty('margin', '0'));

  raf.flush();
  td.verify(mockAdapter.setStyleProperty('width', '0'));
});

test(`on leading icon opacity transition end, add ${cssClasses.HIDDEN_LEADING_ICON}` +
  'class to leading icon if chip is selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.LEADING_ICON)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(true);

  foundation.init();
  handlers.transitionend(mockEvt);

  td.verify(mockAdapter.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON));
});

test('on leading icon opacity transition end, do nothing if chip is not selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.LEADING_ICON)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(false);

  foundation.init();
  handlers.transitionend(mockEvt);

  td.verify(mockAdapter.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON), {times: 0});
});

test(`on checkmark opacity transition end, remove ${cssClasses.HIDDEN_LEADING_ICON}` +
  'class from leading icon if chip is not selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHECKMARK)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(false);

  foundation.init();
  handlers.transitionend(mockEvt);

  td.verify(mockAdapter.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON));
});

test('on checkmark opacity transition end, do nothing if chip is selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHECKMARK)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(true);

  foundation.init();
  handlers.transitionend(mockEvt);

  td.verify(mockAdapter.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON), {times: 0});
});

test('on click in trailing icon, emit custom event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerTrailingIconInteractionHandler');
  const mockEvt = {
    type: 'click',
    stopPropagation: td.func('stopPropagation'),
  };

  foundation.init();
  handlers.click(mockEvt);

  td.verify(mockAdapter.notifyTrailingIconInteraction());
  td.verify(mockAdapter.addClass(cssClasses.CHIP_EXIT));
  td.verify(mockEvt.stopPropagation());
});
