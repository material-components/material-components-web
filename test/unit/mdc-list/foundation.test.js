/**
 * @license
 * Copyright 2018 Google Inc.
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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import {MDCListFoundation} from '../../../packages/mdc-list/foundation';
import {strings, cssClasses, numbers} from '../../../packages/mdc-list/constants';
import {install as installClock} from '../helpers/clock';

suite('MDCListFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCListFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCListFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCListFoundation.numbers, numbers);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCListFoundation, [
    'getListItemCount', 'getFocusedElementIndex', 'setAttributeForElementIndex',
    'addClassForElementIndex', 'removeClassForElementIndex',
    'focusItemAtIndex', 'setTabIndexForListItemChildren', 'hasRadioAtIndex',
    'hasCheckboxAtIndex', 'isCheckboxCheckedAtIndex', 'setCheckedCheckboxOrRadioAtIndex',
    'notifyAction', 'isFocusInsideList', 'getAttributeForElementIndex', 'isRootFocused',
  ]);
});

// The foundation needs to use a classList object that has a
// `contains` method. This adds that method onto an array
// for the tests.
// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'contains',
  {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(find) {
      return (this.indexOf(find) > -1);
    },
  });

const setupTest = () => setupFoundationTest(MDCListFoundation);

test('#layout should bail out early when list is empty', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(0);
  foundation.layout();

  td.verify(mockAdapter.hasCheckboxAtIndex(0), {times: 0});
});

test('#handleFocusIn switches list item button/a elements to tabindex=0', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {classList: ['mdc-list-item']};
  const event = {target};

  foundation.handleFocusIn(event, 1);

  td.verify(mockAdapter.setTabIndexForListItemChildren(1, '0'));
});

test('#handleFocusOut switches list item button/a elements to tabindex=-1', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {classList: ['mdc-list-item']};
  const event = {target};

  foundation.handleFocusOut(event, 1);

  td.verify(mockAdapter.setTabIndexForListItemChildren(1, '-1'));
});

test('#handleFocusIn switches list item button/a elements to tabindex=0 when target is child element', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const target = {classList: [], parentElement};
  const event = {target};

  foundation.handleFocusIn(event, 1);

  td.verify(mockAdapter.setTabIndexForListItemChildren(1, '0'));
});

test('#handleFocusOut switches list item button/a elements to tabindex=-1 when target is child element', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const target = {classList: [], parentElement};
  const event = {target};

  foundation.handleFocusOut(event, 1);

  td.verify(mockAdapter.setTabIndexForListItemChildren(1, '-1'));
});

test('#handleFocusIn does nothing if mdc-list-item is not on element or ancestor', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {classList: ['']};
  const event = {target};

  foundation.handleFocusIn(event, -1);

  td.verify(mockAdapter.setTabIndexForListItemChildren(td.matchers.anything(), td.matchers.anything()), {times: 0});
});

test('#handleFocusOut does nothing if mdc-list-item is not on element or ancestor', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {classList: ['']};
  const event = {target};

  foundation.handleFocusOut(event, -1);

  td.verify(mockAdapter.setTabIndexForListItemChildren(td.matchers.anything(), td.matchers.anything()), {times: 0});
});

test('#handleFocusOut sets tabindex=0 to selected item when focus leaves single selection list', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(false);
  td.when(mockAdapter.hasRadioAtIndex(0)).thenReturn(false);
  foundation.setSingleSelection(true);
  foundation.layout();

  td.when(mockAdapter.isFocusInsideList()).thenReturn(false);

  foundation.setSelectedIndex(2); // Selected index values may not be in sequence.
  const clock = installClock();
  const target = {classList: ['']};
  const event = {target};
  foundation.handleFocusOut(event, 3);
  clock.runToFrame();
  td.verify(mockAdapter.setAttributeForElementIndex(2, 'tabindex', '0'), {times: 1});
});

test('#handleFocusOut sets tabindex=0 to first item when focus leaves single selection list that has no '
    + 'selection', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setSingleSelection(true);
  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.isFocusInsideList()).thenReturn(false);

  const clock = installClock();
  const target = {classList: ['']};
  const event = {target};
  foundation.handleFocusOut(event, 3);
  clock.runToFrame();
  td.verify(mockAdapter.setAttributeForElementIndex(0, 'tabindex', '0'), {times: 1});
});

test('#handleFocusOut does not set tabindex=0 to selected list item when focus moves to next list item.', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setSingleSelection(true);
  foundation.layout();

  td.when(mockAdapter.isFocusInsideList()).thenReturn(true);

  foundation.setSelectedIndex(2);
  const clock = installClock();
  const target = {classList: ['']};
  const event = {target};
  foundation.handleFocusOut(event, 3);
  clock.runToFrame();
  td.verify(mockAdapter.setAttributeForElementIndex(2, 'tabindex', 0), {times: 0});
});

test('#handleFocusOut sets tabindex=0 to first selected index when focus leaves checkbox based list', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(true);
  foundation.layout();

  td.when(mockAdapter.isFocusInsideList()).thenReturn(false);

  foundation.setSelectedIndex([3, 2]); // Selected index values may not be in sequence.
  const target = {classList: ['']};
  const event = {target};

  const clock = installClock();
  foundation.handleFocusOut(event, 2);
  clock.runToFrame();
  td.verify(mockAdapter.setAttributeForElementIndex(2, 'tabindex', '0'), {times: 1});
});

test('#handleKeydown does nothing if key received on root element and not used for navigation', () => {
  const {foundation, mockAdapter} = setupTest();
  const event = {key: 'A'};

  td.when(mockAdapter.isRootFocused()).thenReturn(true);
  foundation.handleKeydown(event, false, -1);

  td.verify(mockAdapter.getFocusedElementIndex(), {times: 0});
});

test('#handleKeydown should focus on last item when UP arrow key received on list root', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const event = {key: 'ArrowUp', preventDefault};

  td.when(mockAdapter.isRootFocused()).thenReturn(true);
  td.when(mockAdapter.getListItemCount()).thenReturn(5);
  foundation.handleKeydown(event, false, -1);

  td.verify(preventDefault(), {times: 1});
  td.verify(mockAdapter.focusItemAtIndex(4), {times: 1});
  td.verify(mockAdapter.getFocusedElementIndex(), {times: 0});
});

test('#handleKeydown should focus on first item when DOWN arrow key received on list root', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const event = {key: 'ArrowDown', preventDefault};

  td.when(mockAdapter.isRootFocused()).thenReturn(true);
  foundation.handleKeydown(event, false, -1);

  td.verify(preventDefault(), {times: 1});
  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
  td.verify(mockAdapter.getFocusedElementIndex(), {times: 0});
});

test('#handleKeydown does nothing if the key is not used for navigation', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'A', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 1);

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown moves focus to index+1 if the ArrowDown key is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowDown', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 1);

  td.verify(mockAdapter.focusItemAtIndex(2), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown moves focus to index-1 if the ArrowUp key is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowUp', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 1);

  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown ArrowRight key does nothing if isVertical_ is true', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowRight', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 1);

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown ArrowLeft key does nothing if isVertical_ is true', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowLeft', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 1);

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown ArrowRight key causes the next item to gain focus if isVertical_ is false', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowRight', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setVerticalOrientation(false);
  foundation.handleKeydown(event, true, 1);

  td.verify(mockAdapter.focusItemAtIndex(2), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown ArrowLeft key causes the previous item to gain focus if isVertical_ is false', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowLeft', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setVerticalOrientation(false);
  foundation.handleKeydown(event, true, 1);

  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown ArrowDown key causes first item to focus if last item is focused and wrapFocus is true', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowDown', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(2);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setWrapFocus(true);
  foundation.handleKeydown(event, true, 2);

  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown ArrowDown key if last item is focused and wrapFocus is false does not focus an item', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowDown', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(2);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 2);

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown ArrowUp key causes last item to focus if first item is focused and wrapFocus is true', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowUp', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setWrapFocus(true);
  foundation.handleKeydown(event, true, 0);

  td.verify(mockAdapter.focusItemAtIndex(2), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown ArrowUp key if first item is focused and wrapFocus is false does not focus an item', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowUp', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 0);

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown Home key causes the first item to be focused', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'Home', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 1);

  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown End key causes the last item to be focused', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'End', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 0);

  td.verify(mockAdapter.focusItemAtIndex(2), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown navigation key in input/button/select/textarea elements do not call preventDefault ', () => {
  const {foundation, mockAdapter} = setupTest();
  const inputs = ['input', 'button', 'select', 'textarea'];
  const preventDefault = td.func('preventDefault');

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);

  inputs.forEach((input) => {
    const target = {tagName: input};
    const event = {key: 'ArrowUp', target, preventDefault};
    foundation.handleKeydown(event, false, 0);
  });
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown focuses on the bound mdc-list-item even if the event happened on a child element', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const preventDefault = td.func('preventDefault');
  const target = {classList: [], parentElement};
  const event = {key: 'ArrowUp', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, false, 1);

  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown space key causes preventDefault to be called on keydown event', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, true, 0);

  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown enter key causes preventDefault to be called on keydown event', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Enter', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, true, 0);

  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown enter key while focused on a sub-element of a list item does not cause preventDefault on the ' +
  'event when singleSelection=true ', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Enter', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, false, 0);

  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown space/enter key cause event.preventDefault if a checkbox or radio button is present', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.hasRadioAtIndex(0)).thenReturn(true);
  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(false);
  foundation.setSingleSelection(false);
  foundation.layout();
  foundation.handleKeydown(event, true, 0);
  event.key = 'Enter';
  foundation.handleKeydown(event, true, 0);

  td.verify(preventDefault(), {times: 2});
});

test('#handleKeydown space key calls notifyAction for anchor element regardless of singleSelection', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {tagName: 'A', classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault: () => {}};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setSingleSelection(false);
  foundation.handleKeydown(event, true, 0);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, true, 0);

  td.verify(mockAdapter.notifyAction(0), {times: 2});
});

test('#handleKeydown enter key does not call notifyAction for anchor element', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {tagName: 'A', classList: ['mdc-list-item']};
  const event = {key: 'Enter', target, preventDefault: () => {}};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setSingleSelection(false);
  foundation.handleKeydown(event, true, 0);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, true, 0);

  td.verify(mockAdapter.notifyAction(0), {times: 0}); // notifyAction will be called by handleClick event.
});

test('#handleKeydown notifies of action when enter key pressed on list item ', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Enter', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event, true, 0);

  td.verify(mockAdapter.notifyAction(0), {times: 1});
});

test('#handleKeydown space key is triggered when singleSelection is true selects the list item', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.getAttributeForElementIndex(0, strings.ARIA_CURRENT)).thenReturn(null);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, true, 0);

  td.verify(preventDefault(), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(0, strings.ARIA_SELECTED, 'true'), {times: 1});
});

test('#handleKeydown space key when singleSelection=true does not select an element is isRootListItem=false', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.getAttributeForElementIndex(0, strings.ARIA_CURRENT)).thenReturn(null);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, false, 0);

  td.verify(preventDefault(), {times: 0});
  td.verify(mockAdapter.setAttributeForElementIndex(0, strings.ARIA_SELECTED, 'true'), {times: 0});
});

test('#handleKeydown space key is triggered 2x when singleSelection does not un-select the item.', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.getAttributeForElementIndex(0, strings.ARIA_CURRENT)).thenReturn(null);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, true, 0);
  foundation.handleKeydown(event, true, 0);

  td.verify(preventDefault(), {times: 2});
  td.verify(mockAdapter.setAttributeForElementIndex(0, strings.ARIA_SELECTED, 'true'), {times: 1});
});

test('#handleKeydown space key is triggered 2x when singleSelection is true on second ' +
  'element updates first element tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.getAttributeForElementIndex(1, strings.ARIA_CURRENT)).thenReturn(null);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event, true, 1);
  foundation.handleKeydown(event, true, 1);

  td.verify(preventDefault(), {times: 2});
  td.verify(mockAdapter.setAttributeForElementIndex(1, strings.ARIA_SELECTED, 'true'), {times: 1});
});

test('#handleKeydown bail out early if event origin doesnt have a mdc-list-item ancestor from the current list', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
  const preventDefault = td.func('preventDefault');
  const event = {key: 'ArrowDown', keyCode: 40, preventDefault};
  foundation.handleKeydown(event, /** isRootListItem */ true, /** listItemIndex */ -1);

  td.verify(preventDefault(), {times: 0});
});

test('#focusNextElement focuses next list item and returns that index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);

  assert.equal(3, foundation.focusNextElement(2));
  td.verify(mockAdapter.focusItemAtIndex(3), {times: 1});
});

test('#focusNextElement focuses first list item when focus is on last list item when wrapFocus=true and returns that ' +
    'index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setWrapFocus(true);

  assert.equal(0, foundation.focusNextElement(3));
  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
});

test('#focusNextElement retains the focus on last item when wrapFocus=false and returns that index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setWrapFocus(false);

  assert.equal(3, foundation.focusNextElement(3));
  td.verify(mockAdapter.focusItemAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#focusPrevElement focuses previous list item and returns that index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);

  assert.equal(1, foundation.focusPrevElement(2));
  td.verify(mockAdapter.focusItemAtIndex(1), {times: 1});
});

test('#focusPrevElement focuses last list item when focus is on first list item when wrapFocus=true and returns that ' +
    'index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setWrapFocus(true);

  assert.equal(3, foundation.focusPrevElement(0));
  td.verify(mockAdapter.focusItemAtIndex(3), {times: 1});
});

test('#focusPrevElement retains the focus on first list item when wrapFocus=false and returns that index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setWrapFocus(false);

  assert.equal(0, foundation.focusPrevElement(0));
  td.verify(mockAdapter.focusItemAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleClick when singleSelection=false on a list item should not cause the list item to be selected', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setSingleSelection(false);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleClick(1, false);

  td.verify(mockAdapter.addClassForElementIndex(1, cssClasses.LIST_ITEM_SELECTED_CLASS), {times: 0});
  td.verify(mockAdapter.addClassForElementIndex(1, cssClasses.LIST_ITEM_ACTIVATED_CLASS), {times: 0});
});

test('#handleClick notifies of action when clicked on list item.', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleClick(1, false);

  td.verify(mockAdapter.notifyAction(1), {times: 1});
});

test('#handleClick when singleSelection=true on a list item should cause the list item to be selected', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setSingleSelection(true);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleClick(1, false);

  td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', '0'), {times: 1});
});

test('#handleClick when singleSelection=true on a button subelement should not cause the list item to be selected',
  () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.setSingleSelection(true);
    foundation.handleClick(-1, false);

    td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', 0), {times: 0});
  });

test('#handleClick when singleSelection=true on an element not in a list item should be ignored', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
  foundation.setSingleSelection(true);
  foundation.handleClick(-1, false);

  td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', 0), {times: 0});
});

test('#handleClick when singleSelection=true on the first element when already selected', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setSingleSelection(true);
  foundation.handleClick(0, false);
  foundation.handleClick(0, false);

  td.verify(mockAdapter.setAttributeForElementIndex(0, 'tabindex', '0'), {times: 2});
});

test('#handleClick when toggleCheckbox=false does not change the checkbox state', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(true);
  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.layout();
  foundation.handleClick(2, false);

  td.when(mockAdapter.isCheckboxCheckedAtIndex(2)).thenReturn(false);
  td.verify(mockAdapter.setCheckedCheckboxOrRadioAtIndex(2, true), {times: 0});
});

test('#handleClick proxies to the adapter#setCheckedCheckboxOrRadioAtIndex if toggleCheckbox is true', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.hasRadioAtIndex(0)).thenReturn(true);
  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.layout();
  foundation.handleClick(0, true);

  td.verify(mockAdapter.setCheckedCheckboxOrRadioAtIndex(0, true), {times: 1});
});

test('#handleClick checks the checkbox at index if it is present on list item', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(true);
  foundation.layout();

  // Check
  td.when(mockAdapter.isCheckboxCheckedAtIndex(2)).thenReturn(false);
  foundation.handleClick(2, true);
  td.verify(mockAdapter.setCheckedCheckboxOrRadioAtIndex(2, true), {times: 1});

  // Uncheck
  td.when(mockAdapter.isCheckboxCheckedAtIndex(2)).thenReturn(true);
  foundation.handleClick(2, true);
  td.verify(mockAdapter.setCheckedCheckboxOrRadioAtIndex(2, false), {times: 1});
});

test('#handleClick bails out if checkbox or radio is not present and if toggleCheckbox is true', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.hasCheckboxAtIndex(1)).thenReturn(false);
  td.when(mockAdapter.hasRadioAtIndex(1)).thenReturn(false);

  foundation.handleClick(2, true);
  td.verify(mockAdapter.setCheckedCheckboxOrRadioAtIndex(1, td.matchers.anything()), {times: 0});
});

test('#setUseActivatedClass causes setSelectedIndex to use the --activated class', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setUseActivatedClass(true);
  foundation.setSelectedIndex(1);

  td.verify(mockAdapter.addClassForElementIndex(1, cssClasses.LIST_ITEM_ACTIVATED_CLASS), {times: 1});
});

test('#setSelectedIndex should bail out early if not in the range', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setSelectedIndex(-1);
  td.verify(mockAdapter.setAttributeForElementIndex(-1, 'tabindex', 0), {times: 0});
});

test('#setSelectedIndex should bail out early if index is string or invalid', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setSelectedIndex('some_random_input');
  td.verify(mockAdapter.setAttributeForElementIndex(-1, 'tabindex', 0), {times: 0});
});

test('#setSelectedIndex should set aria checked true on new selected index and set aria checked false on previous '
    + 'selected index for checkbox based list', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(true);
  foundation.layout();

  td.when(mockAdapter.isCheckboxCheckedAtIndex(2)).thenReturn(true);
  foundation.setSelectedIndex([2]);
  td.verify(mockAdapter.setAttributeForElementIndex(2, strings.ARIA_CHECKED, 'true'), {times: 1});

  td.when(mockAdapter.isCheckboxCheckedAtIndex(3)).thenReturn(true);
  foundation.setSelectedIndex([3]);
  td.verify(mockAdapter.setAttributeForElementIndex(2, strings.ARIA_CHECKED, 'false'), {times: 1});
});

test('#setSelectedIndex should set aria attributes on new index and should also set aria checked to false on previous' +
    ' selected index for radio based list', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(5);
  td.when(mockAdapter.hasRadioAtIndex(0)).thenReturn(true);
  foundation.layout();

  foundation.setSelectedIndex(3);
  td.verify(mockAdapter.setAttributeForElementIndex(3, strings.ARIA_CHECKED, 'true'), {times: 1});

  foundation.setSelectedIndex(4);
  td.verify(mockAdapter.setAttributeForElementIndex(4, strings.ARIA_CHECKED, 'true'), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(3, strings.ARIA_CHECKED, 'false'), {times: 1});
});

test('#setSelectedIndex removes selected/activated class name and sets aria-selected to false from previously selected '
    + 'list item', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.getAttributeForElementIndex(2, strings.ARIA_CURRENT)).thenReturn(null);
  td.when(mockAdapter.getAttributeForElementIndex(3, strings.ARIA_CURRENT)).thenReturn(null);
  foundation.setSelectedIndex(2);

  foundation.setSelectedIndex(3);
  td.verify(mockAdapter.removeClassForElementIndex(2, cssClasses.LIST_ITEM_SELECTED_CLASS), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(2, strings.ARIA_SELECTED, 'false'), {times: 1});
});

test('#setSelectedIndex should detect the presence of aria-current during list initialization '
    + '(i.e., when it is in unset state) and sets the same attribute on pre-selected index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(5);
  td.when(mockAdapter.getAttributeForElementIndex(2, strings.ARIA_CURRENT)).thenReturn('page');
  foundation.setSelectedIndex(2);

  td.verify(mockAdapter.setAttributeForElementIndex(2, strings.ARIA_CURRENT, 'false'), {times: 0});
  td.verify(mockAdapter.setAttributeForElementIndex(2, strings.ARIA_CURRENT, 'page'), {times: 1});
});

test('#setSelectedIndex should set aria-selected as default option in the absence of aria-selected on pre-selected '
    + 'item index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(5);
  td.when(mockAdapter.getAttributeForElementIndex(2, strings.ARIA_CURRENT)).thenReturn(null);
  foundation.setSelectedIndex(2);

  td.verify(mockAdapter.setAttributeForElementIndex(2, td.matchers.isA(String), 'false'), {times: 0});
  td.verify(mockAdapter.setAttributeForElementIndex(2, strings.ARIA_SELECTED, 'true'), {times: 1});
});

test('#setSelectedIndex sets aria-current="false" to previously selected index and sets aria-current without any token'
    + 'to current index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(5);
  td.when(mockAdapter.getAttributeForElementIndex(2, strings.ARIA_CURRENT)).thenReturn('');
  foundation.setSelectedIndex(2);

  foundation.setSelectedIndex(3);
  td.verify(mockAdapter.setAttributeForElementIndex(2, strings.ARIA_CURRENT, 'false'), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(3, strings.ARIA_CURRENT, ''), {times: 1});
});

test('#setSelectedIndex sets aria-current to false to previously selected index and sets aria-current with appropriate '
    + 'token to current index', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(5);
  td.when(mockAdapter.getAttributeForElementIndex(2, strings.ARIA_CURRENT)).thenReturn('page');
  foundation.setSelectedIndex(2);

  foundation.setSelectedIndex(3);
  td.verify(mockAdapter.setAttributeForElementIndex(2, strings.ARIA_CURRENT, 'false'), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(3, strings.ARIA_CURRENT, 'page'), {times: 1});
});

test('#setSelectedIndex throws error when array of index is set on radio based list', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.hasRadioAtIndex(0)).thenReturn(true);
  foundation.layout();

  assert.throws(() => foundation.setSelectedIndex([0, 1, 2]), Error);
});

test('#setSelectedIndex throws error when single index number is set on multi-select checkbox based list', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(true);
  foundation.layout();

  assert.throws(() => foundation.setSelectedIndex(2), Error);
});

test('#setSelectedIndex deselects all checkboxes when selected index is set to []', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(true);
  foundation.layout();

  foundation.setSelectedIndex([]);
  td.verify(mockAdapter.setCheckedCheckboxOrRadioAtIndex(td.matchers.anything(), false), {times: 4});
});

test('#getSelectedIndex should be in-sync with setter method', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  foundation.setSelectedIndex(2);
  assert.equal(2, foundation.getSelectedIndex());
});

test('#getSelectedIndex should be in-sync with setter method for multi-select checkbox based list', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getListItemCount()).thenReturn(4);
  td.when(mockAdapter.hasCheckboxAtIndex(0)).thenReturn(true);
  foundation.layout();

  foundation.setSelectedIndex([0, 2, 3]);
  assert.deepEqual([0, 2, 3], foundation.getSelectedIndex());
});

test('#setEnabled should remove class name mdc-list-item--disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.layout();

  foundation.setEnabled(3, true);
  td.verify(mockAdapter.removeClassForElementIndex(3, cssClasses.LIST_ITEM_DISABLED_CLASS), {times: 1});
});

test('#setEnabled should add class name mdc-list-item--disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.layout();

  foundation.setEnabled(3, false);
  td.verify(mockAdapter.addClassForElementIndex(3, cssClasses.LIST_ITEM_DISABLED_CLASS), {times: 1});
});
