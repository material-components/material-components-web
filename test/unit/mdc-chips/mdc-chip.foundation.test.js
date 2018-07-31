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
import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';
import {MDCChipFoundation} from '../../../packages/mdc-chips/chip/foundation';

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
    'addClass', 'removeClass', 'hasClass', 'addClassToLeadingIcon',
    'removeClassFromLeadingIcon', 'eventTargetHasClass', 'notifyInteraction',
    'notifyTrailingIconInteraction', 'notifyRemoval',
    'getComputedStyleValue', 'setStyleProperty',
  ]);
});

const setupTest = () => setupFoundationTest(MDCChipFoundation);

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

test(`#beginExit adds ${cssClasses.CHIP_EXIT} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.beginExit();
  td.verify(mockAdapter.addClass(cssClasses.CHIP_EXIT));
});

test('#handleInteraction emits custom event on click', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'click',
  };

  foundation.handleInteraction(mockEvt);

  td.verify(mockAdapter.notifyInteraction());
});

test('#handleTransitionEnd notifies removal of chip on width transition end', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'width',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHIP_EXIT)).thenReturn(true);

  foundation.handleTransitionEnd(mockEvt);

  td.verify(mockAdapter.notifyRemoval());
});

test('#handleTransitionEnd animates width if chip is exiting on chip opacity transition end', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHIP_EXIT)).thenReturn(true);
  td.when(mockAdapter.getComputedStyleValue('width')).thenReturn('100px');

  foundation.handleTransitionEnd(mockEvt);

  raf.flush();
  td.verify(mockAdapter.setStyleProperty('width', '100px'));
  td.verify(mockAdapter.setStyleProperty('padding', '0'));
  td.verify(mockAdapter.setStyleProperty('margin', '0'));

  raf.flush();
  td.verify(mockAdapter.setStyleProperty('width', '0'));
});

test(`#handleTransitionEnd adds ${cssClasses.HIDDEN_LEADING_ICON} class to leading icon ` +
  'on leading icon opacity transition end, if chip is selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.LEADING_ICON)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(true);

  foundation.handleTransitionEnd(mockEvt);

  td.verify(mockAdapter.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON));
});

test('#handleTransitionEnd does nothing on leading icon opacity transition end,' +
  'if chip is not selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.LEADING_ICON)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(false);

  foundation.handleTransitionEnd(mockEvt);

  td.verify(mockAdapter.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON), {times: 0});
});

test(`#handleTransitionEnd removes ${cssClasses.HIDDEN_LEADING_ICON} class from leading icon ` +
  'on checkmark opacity transition end, if chip is not selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHECKMARK)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(false);

  foundation.handleTransitionEnd(mockEvt);

  td.verify(mockAdapter.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON));
});

test('#handleTransitionEnd does nothing on checkmark opacity transition end, if chip is selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHECKMARK)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.SELECTED)).thenReturn(true);

  foundation.handleTransitionEnd(mockEvt);

  td.verify(mockAdapter.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON), {times: 0});
});

test('#handleTrailingIconInteraction emits custom event on click in trailing icon', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'click',
    stopPropagation: td.func('stopPropagation'),
  };

  foundation.handleTrailingIconInteraction(mockEvt);
  td.verify(mockAdapter.notifyTrailingIconInteraction());
  td.verify(mockEvt.stopPropagation());
});

test(`#handleTrailingIconInteraction adds ${cssClasses.CHIP_EXIT} class by default on click in trailing icon`, () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'click',
    stopPropagation: td.func('stopPropagation'),
  };

  foundation.handleTrailingIconInteraction(mockEvt);

  assert.isTrue(foundation.getShouldRemoveOnTrailingIconClick());
  td.verify(mockAdapter.addClass(cssClasses.CHIP_EXIT));
  td.verify(mockEvt.stopPropagation());
});

test(`#handleTrailingIconInteraction does not add ${cssClasses.CHIP_EXIT} class on click in trailing icon ` +
  'if shouldRemoveOnTrailingIconClick_ is false', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'click',
    stopPropagation: td.func('stopPropagation'),
  };

  foundation.setShouldRemoveOnTrailingIconClick(false);
  foundation.handleTrailingIconInteraction(mockEvt);

  assert.isFalse(foundation.getShouldRemoveOnTrailingIconClick());
  td.verify(mockAdapter.addClass(cssClasses.CHIP_EXIT), {times: 0});
  td.verify(mockEvt.stopPropagation());
});
