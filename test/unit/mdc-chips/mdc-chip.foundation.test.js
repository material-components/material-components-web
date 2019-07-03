/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {install as installClock} from '../helpers/clock';
import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import {MDCChipFoundation} from '../../../packages/mdc-chips/chip/foundation';
import {EventSource} from '../../../packages/mdc-chips/chip/constants';

const {cssClasses, strings} = MDCChipFoundation;

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
    'notifyTrailingIconInteraction', 'notifyRemoval', 'notifySelection',
    'getComputedStyleValue', 'setStyleProperty', 'hasLeadingIcon',
    'getRootBoundingClientRect', 'getCheckmarkBoundingClientRect', 'notifyNavigation',
    'focusPrimaryAction', 'focusTrailingAction', 'hasTrailingAction', 'isRTL',
    'setPrimaryActionAttr', 'setTrailingActionAttr',
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

test('#setSelected sets aria-checked="true" if true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(true);
  td.verify(mockAdapter.setPrimaryActionAttr(strings.ARIA_CHECKED, 'true'));
});

test('#setSelected sets aria-checked="false" if false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(false);
  td.verify(mockAdapter.setPrimaryActionAttr(strings.ARIA_CHECKED, 'false'));
});

test('#setSelected notifies of selection when selected is true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(true);
  td.verify(mockAdapter.notifySelection(true));
});

test('#setSelected notifies of unselection when selected is false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(false);
  td.verify(mockAdapter.notifySelection(false));
});

test('#setSelectedFromChipSet does not notify', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelectedFromChipSet(false);
  foundation.setSelectedFromChipSet(true);
  td.verify(mockAdapter.notifySelection(td.matchers.isA(Boolean)), {times: 0});
});

test('#getDimensions returns adapter.getRootBoundingClientRect when there is no checkmark bounding rect', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getCheckmarkBoundingClientRect()).thenReturn(null);
  const boundingRect = {width: 10, height: 10};
  td.when(mockAdapter.getRootBoundingClientRect()).thenReturn(boundingRect);

  assert.strictEqual(foundation.getDimensions(), boundingRect);
});

test('#getDimensions factors in the checkmark bounding rect when it exists and there is no leading icon', () => {
  const {foundation, mockAdapter} = setupTest();
  const boundingRect = {width: 10, height: 10};
  const checkmarkBoundingRect = {width: 5, height: 5};
  td.when(mockAdapter.getCheckmarkBoundingClientRect()).thenReturn(checkmarkBoundingRect);
  td.when(mockAdapter.getRootBoundingClientRect()).thenReturn(boundingRect);
  td.when(mockAdapter.hasLeadingIcon()).thenReturn(false);

  const dimensions = foundation.getDimensions();
  assert.equal(dimensions.height, boundingRect.height);
  assert.equal(dimensions.width, boundingRect.width + checkmarkBoundingRect.height);
});

test('#getDimensions returns adapter.getRootBoundingClientRect when there is a checkmark and a leading icon', () => {
  const {foundation, mockAdapter} = setupTest();
  const checkmarkBoundingRect = {width: 5, height: 5};
  td.when(mockAdapter.getCheckmarkBoundingClientRect()).thenReturn(checkmarkBoundingRect);
  const boundingRect = {width: 10, height: 10};
  td.when(mockAdapter.getRootBoundingClientRect()).thenReturn(boundingRect);
  td.when(mockAdapter.hasLeadingIcon()).thenReturn(true);

  assert.strictEqual(foundation.getDimensions(), boundingRect);
});

test(`#beginExit adds ${cssClasses.CHIP_EXIT} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.beginExit();
  td.verify(mockAdapter.addClass(cssClasses.CHIP_EXIT));
});

test('#handleInteraction does not emit event on invalid key', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'keydown',
    key: 'Shift',
  };

  foundation.handleInteraction(mockEvt);
  td.verify(mockAdapter.notifyInteraction(), {times: 0});
});

const validEvents = [
  {
    type: 'click',
  }, {
    type: 'keydown',
    key: 'Enter',
  }, {
    type: 'keydown',
    key: ' ', // Space bar
  },
];

validEvents.forEach((evt) => {
  test(`#handleInteraction(${evt}) notifies interaction`, () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.handleInteraction(evt);
    td.verify(mockAdapter.notifyInteraction());
  });

  test(`#handleInteraction(${evt}) focuses the primary action`, () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.handleInteraction(evt);
    td.verify(mockAdapter.setPrimaryActionAttr(strings.TAB_INDEX, '0'));
    td.verify(mockAdapter.setTrailingActionAttr(strings.TAB_INDEX, '-1'));
    td.verify(mockAdapter.focusPrimaryAction());
  });
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
  const clock = installClock();
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'opacity',
  };
  td.when(mockAdapter.eventTargetHasClass(mockEvt.target, cssClasses.CHIP_EXIT)).thenReturn(true);
  td.when(mockAdapter.getComputedStyleValue('width')).thenReturn('100px');

  foundation.handleTransitionEnd(mockEvt);

  clock.runToFrame();
  td.verify(mockAdapter.setStyleProperty('width', '100px'));
  td.verify(mockAdapter.setStyleProperty('padding', '0'));
  td.verify(mockAdapter.setStyleProperty('margin', '0'));

  clock.runToFrame();
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

test('#handleTransitionEnd does nothing for width property when not exiting', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'transitionend',
    target: {},
    propertyName: 'width',
  };

  foundation.handleTransitionEnd(mockEvt);

  td.verify(mockAdapter.notifyRemoval(), {times: 0});
  td.verify(mockAdapter.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON), {times: 0});
  td.verify(mockAdapter.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON), {times: 0});
});

test('#handleTrailingIconInteraction emits no event on invalid keys', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'keydowb',
    key: 'Shift',
    stopPropagation: td.func('stopPropagation'),
  };

  foundation.handleTrailingIconInteraction(mockEvt);
  td.verify(mockAdapter.notifyTrailingIconInteraction(), {times: 0});
});

test('#handleTrailingIconInteraction emits custom event on click or enter key in trailing icon', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'click',
    stopPropagation: td.func('stopPropagation'),
  };

  foundation.handleTrailingIconInteraction(mockEvt);
  td.verify(mockAdapter.notifyTrailingIconInteraction(), {times: 1});
  td.verify(mockEvt.stopPropagation(), {times: 1});

  foundation.handleTrailingIconInteraction(Object.assign(mockEvt, {type: 'keydown', keyCode: 13}));
  td.verify(mockAdapter.notifyTrailingIconInteraction(), {times: 2});
  td.verify(mockEvt.stopPropagation(), {times: 2});

  foundation.handleTrailingIconInteraction(Object.assign(mockEvt, {type: 'keydown', key: 'Enter'}));
  td.verify(mockAdapter.notifyTrailingIconInteraction(), {times: 3});
  td.verify(mockEvt.stopPropagation(), {times: 3});
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

test('#handleKeydown emits custom event with appropriate keys', () => {
  const {foundation, mockAdapter} = setupTest();
  [
    strings.ARROW_UP_KEY,
    strings.HOME_KEY,
    strings.ARROW_DOWN_KEY,
    strings.END_KEY,
  ].forEach((key) => {
    const mockEvt = {
      type: 'keydown',
      key,
      preventDefault: td.func('.preventDefault'),
    };

    foundation.handleKeydown(mockEvt);
    td.verify(mockAdapter.notifyNavigation(key, 2));
  });
});

test('#handleKeydown calls preventDefault on navigation events', () => {
  const {foundation} = setupTest();
  const mockEvt = {
    type: 'keydown',
    key: 'ArrowLeft',
    preventDefault: td.func('.preventDefault'),
  };

  foundation.handleKeydown(mockEvt);
  td.verify(mockEvt.preventDefault(), {times: 1});
});

test('#handleKeydown does not emit a custom event for inappropriate keys', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'keydown',
    key: ' ',
  };

  foundation.handleKeydown(mockEvt);
  td.verify(mockAdapter.notifyNavigation(td.matchers.isA(String)), {times: 0});
});

function setupNavigationTest({
  fromPrimaryAction=false,
  hasTrailingAction=false,
  fromTrailingAction=false,
  isRTL=false}={}) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasTrailingAction()).thenReturn(hasTrailingAction || fromTrailingAction);
  td.when(mockAdapter.isRTL()).thenReturn(isRTL);
  td.when(mockAdapter.eventTargetHasClass(
    td.matchers.anything(), cssClasses.PRIMARY_ACTION)).thenReturn(fromPrimaryAction);
  td.when(mockAdapter.eventTargetHasClass(
    td.matchers.anything(), cssClasses.TRAILING_ACTION)).thenReturn(fromTrailingAction);
  return {mockAdapter, foundation};
}

function mockKeyboardEvent(key) {
  return {
    type: 'keydown',
    preventDefault: td.func('.preventDefault'),
    stopPropagation: td.func('.stopPropagation'),
    key,
  };
}

test('#handleKeydown ArrowLeft from focused text emits appropriate event', () => {
  const {foundation, mockAdapter} = setupNavigationTest({
    fromPrimaryAction: true,
  });
  foundation.handleKeydown(mockKeyboardEvent('ArrowLeft'));
  td.verify(mockAdapter.notifyNavigation('ArrowLeft', EventSource.PRIMARY));
});

test('#handleKeydown ArrowRight from focused text emits appropriate event', () => {
  const {foundation, mockAdapter} = setupNavigationTest({
    fromPrimaryAction: true,
  });
  foundation.handleKeydown(mockKeyboardEvent('ArrowRight'));
  td.verify(mockAdapter.notifyNavigation('ArrowRight', EventSource.PRIMARY));
});

test('#handleKeydown ArrowLeft from focused text emits appropriate event in RTL', () => {
  const {foundation, mockAdapter} = setupNavigationTest({
    fromPrimaryAction: true,
    isRTL: true,
  });
  foundation.handleKeydown(mockKeyboardEvent('ArrowLeft'));
  td.verify(mockAdapter.notifyNavigation('ArrowLeft', EventSource.PRIMARY));
});

test('#handleKeydown ArrowRight from focused text emits appropriate event in RTL', () => {
  const {foundation, mockAdapter} = setupNavigationTest({
    fromPrimaryAction: true,
    isRTL: true,
  });
  foundation.handleKeydown(mockKeyboardEvent('ArrowRight'));
  td.verify(mockAdapter.notifyNavigation('ArrowRight', EventSource.PRIMARY));
});

test('#handleKeydown ArrowRight from focused trailing action emits appropriate event', () => {
  const {foundation, mockAdapter} = setupNavigationTest({
    fromTrailingAction: true,
  });
  foundation.handleKeydown(mockKeyboardEvent('ArrowRight'));
  td.verify(mockAdapter.notifyNavigation('ArrowRight', EventSource.NONE));
});

test('#handleKeydown ArrowLeft from focused trailing action emits appropriate event in RTL', () => {
  const {foundation, mockAdapter} = setupNavigationTest({
    fromTrailingAction: true,
    isRTL: true,
  });
  foundation.handleKeydown(mockKeyboardEvent('ArrowLeft'));
  td.verify(mockAdapter.notifyNavigation('ArrowLeft', EventSource.NONE));
});

test('#handleKeydown ArrowRight from focused text with trailing icon focuses trailing icon', () => {
  const {foundation, mockAdapter} = setupNavigationTest({fromPrimaryAction: true, hasTrailingAction: true});
  foundation.handleKeydown(mockKeyboardEvent('ArrowRight'));
  td.verify(mockAdapter.setTrailingActionAttr('tabindex', '0'));
  td.verify(mockAdapter.setPrimaryActionAttr('tabindex', '-1'));
  td.verify(mockAdapter.focusTrailingAction());
});

test('#handleKeydown ArrowLeft from focused text with trailing icon focuses trailing icon in RTL', () => {
  const {foundation, mockAdapter} = setupNavigationTest({
    fromPrimaryAction: true,
    isRTL: true,
    hasTrailingAction: true,
  });
  foundation.handleKeydown(mockKeyboardEvent('ArrowLeft'));
  td.verify(mockAdapter.setTrailingActionAttr('tabindex', '0'));
  td.verify(mockAdapter.setPrimaryActionAttr('tabindex', '-1'));
  td.verify(mockAdapter.focusTrailingAction());
});

test('#handleKeydown ArrowLeft from focused trailing icon focuses text', () => {
  const {foundation, mockAdapter} = setupNavigationTest({hasTrailingAction: true, fromTrailingAction: true});
  foundation.handleKeydown(mockKeyboardEvent('ArrowLeft'));
  td.verify(mockAdapter.setTrailingActionAttr('tabindex', '-1'));
  td.verify(mockAdapter.setPrimaryActionAttr('tabindex', '0'));
  td.verify(mockAdapter.focusPrimaryAction());
});

test('#handleKeydown ArrowRight from focused trailing icon focuses text in RTL', () => {
  const {foundation, mockAdapter} = setupNavigationTest(
    {hasTrailingAction: true, fromTrailingAction: true, isRTL: true});
  foundation.handleKeydown(mockKeyboardEvent('ArrowRight'));
  td.verify(mockAdapter.setTrailingActionAttr('tabindex', '-1'));
  td.verify(mockAdapter.setPrimaryActionAttr('tabindex', '0'));
  td.verify(mockAdapter.focusPrimaryAction());
});

/**
 * Verify deletability when class is present
 */
[
  'Backspace',
  'Delete',
].forEach((key) => {
  test(`#handleKeydown ${key} adds the chip exit class when deletable class is present on root`, () => {
    const {foundation, mockAdapter} = setupTest();
    td.when(mockAdapter.hasClass(cssClasses.DELETABLE)).thenReturn(true);
    foundation.handleKeydown(mockKeyboardEvent(key));
    td.verify(mockAdapter.addClass(cssClasses.CHIP_EXIT));
  });
});

/**
 * Verify no deletability when class is absent
 */
[
  'Backspace',
  'Delete',
].forEach((key) => {
  test(`#handleKeydown ${key} adds the chip exit class when deletable class is present on root`, () => {
    const {foundation, mockAdapter} = setupTest();
    td.when(mockAdapter.hasClass(cssClasses.DELETABLE)).thenReturn(false);
    foundation.handleKeydown(mockKeyboardEvent(key));
    td.verify(mockAdapter.addClass(cssClasses.CHIP_EXIT), {times: 0});
  });
});

test('#focusPrimaryAction() gives focus to the primary action', () => {
  const {foundation, mockAdapter} = setupNavigationTest();
  foundation.focusPrimaryAction();
  td.verify(mockAdapter.setTrailingActionAttr('tabindex', '-1'));
  td.verify(mockAdapter.setPrimaryActionAttr('tabindex', '0'));
  td.verify(mockAdapter.focusPrimaryAction());
});

test('#focusTrailingAction() gives focus to the primary action when the trailing action is absent', () => {
  const {foundation, mockAdapter} = setupNavigationTest();
  td.when(mockAdapter.hasTrailingAction()).thenReturn(false);
  foundation.focusTrailingAction();
  td.verify(mockAdapter.setTrailingActionAttr('tabindex', '-1'));
  td.verify(mockAdapter.setPrimaryActionAttr('tabindex', '0'));
  td.verify(mockAdapter.focusPrimaryAction());
});

test('#focusTrailingAction() gives focus to the trailing action when the trailing action is present', () => {
  const {foundation, mockAdapter} = setupNavigationTest();
  td.when(mockAdapter.hasTrailingAction()).thenReturn(true);
  foundation.focusTrailingAction();
  td.verify(mockAdapter.setPrimaryActionAttr('tabindex', '-1'));
  td.verify(mockAdapter.setTrailingActionAttr('tabindex', '0'));
  td.verify(mockAdapter.focusTrailingAction());
});

test('#removeFocus() sets tabindex -1 on the primary and trailing action', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.removeFocus();
  td.verify(mockAdapter.setPrimaryActionAttr(strings.TAB_INDEX, '-1'));
  td.verify(mockAdapter.setTrailingActionAttr(strings.TAB_INDEX, '-1'));
});
