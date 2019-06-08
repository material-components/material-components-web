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
    'getRootBoundingClientRect', 'getCheckmarkBoundingClientRect',
    'setAttr', 'notifyNavigation',
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
  td.verify(mockAdapter.setAttr(strings.ARIA_CHECKED, 'true'));
});

test('#setSelected sets aria-checked="false" if false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(false);
  td.verify(mockAdapter.setAttr(strings.ARIA_CHECKED, 'false'));
});

test('#setSelected removes calls adapter.notifySelection when selected is true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(true);
  td.verify(mockAdapter.notifySelection(true));
});

test('#setSelected removes calls adapter.notifySelection when selected is false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setSelected(false);
  td.verify(mockAdapter.notifySelection(false));
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
    strings.ARROW_RIGHT_KEY,
    strings.ARROW_DOWN_KEY,
    strings.ARROW_LEFT_KEY,
  ].forEach((key) => {
    const mockEvt = {
      type: 'keydown',
      key,
      preventDefault: td.func('.preventDefault'),
    };

    foundation.handleKeydown(mockEvt);
    td.verify(mockAdapter.notifyNavigation(key));
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
    key: 'Space',
  };

  foundation.handleKeydown(mockEvt);
  td.verify(mockAdapter.notifyNavigation(td.matchers.isA(String)), {times: 0});
});
