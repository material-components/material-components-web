/**
 * @license
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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCListFoundation from '../../../packages/mdc-list/foundation';
import {strings, cssClasses} from '../../../packages/mdc-list/constants';

suite('MDCListFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCListFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCListFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCListFoundation, [
    'getListItemCount', 'getFocusedElementIndex', 'getListItemIndex', 'setAttributeForElementIndex',
    'removeAttributeForElementIndex', 'addClassForElementIndex', 'removeClassForElementIndex',
    'focusItemAtIndex', 'isElementFocusable', 'isListItem', 'setTabIndexForListItemChildren',
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

test('#handleFocusIn switches list item button/a elements to tabindex=0', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {classList: ['mdc-list-item']};
  const event = {target};

  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(1);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(true);
  foundation.handleFocusIn(event);

  td.verify(mockAdapter.setTabIndexForListItemChildren(1, 0));
});

test('#handleFocusOut switches list item button/a elements to tabindex=-1', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {classList: ['mdc-list-item']};
  const event = {target};

  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(1);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(true);
  foundation.handleFocusOut(event);

  td.verify(mockAdapter.setTabIndexForListItemChildren(1, -1));
});

test('#handleFocusIn switches list item button/a elements to tabindex=0 when target is child element', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const target = {classList: [], parentElement};
  const event = {target};

  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(1);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(true);
  foundation.handleFocusIn(event);

  td.verify(mockAdapter.setTabIndexForListItemChildren(1, 0));
});

test('#handleFocusOut switches list item button/a elements to tabindex=-1 when target is child element', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const target = {classList: [], parentElement};
  const event = {target};

  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(1);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(true);
  foundation.handleFocusOut(event);

  td.verify(mockAdapter.setTabIndexForListItemChildren(1, -1));
});

test('#handleFocusIn does nothing if mdc-list-item is not on element or ancestor', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {classList: ['']};
  const event = {target};

  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(1);
  foundation.handleFocusIn(event);

  td.verify(mockAdapter.setTabIndexForListItemChildren(td.matchers.anything(), td.matchers.anything()), {times: 0});
});

test('#handleFocusOut does nothing if mdc-list-item is not on element or ancestor', () => {
  const {foundation, mockAdapter} = setupTest();
  const target = {classList: ['']};
  const event = {target};

  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(1);
  foundation.handleFocusOut(event);

  td.verify(mockAdapter.setTabIndexForListItemChildren(td.matchers.anything(), td.matchers.anything()), {times: 0});
});

test('#handleFocusIn does nothing if list item is from nested list', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const target = {classList: [], parentElement};
  const event = {target};

  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(-1);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(false, true);
  foundation.handleFocusIn(event);

  td.verify(mockAdapter.setTabIndexForListItemChildren(td.matchers.anything(), td.matchers.anything()), {times: 0});
});


test('#handleFocusOut does nothing if list item is from nested list', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const target = {classList: [], parentElement};
  const event = {target};

  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(-1);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(false, true);
  foundation.handleFocusOut(event);

  td.verify(mockAdapter.setTabIndexForListItemChildren(td.matchers.anything(), td.matchers.anything()), {times: 0});
});

test('#handleKeydown does nothing if the key is not used for navigation', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'A', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

  td.verify(mockAdapter.focusItemAtIndex(2), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown navigation key on an empty list does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: []};
  const event = {key: 'ArrowDown', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
  td.when(mockAdapter.getListItemCount()).thenReturn(0);
  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(-1);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(true);
  foundation.handleKeydown(event);

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown moves focus to index-1 if the ArrowUp key is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {tagName: 'li'};
  const event = {key: 'ArrowUp', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

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
  foundation.handleKeydown(event);

  td.verify(mockAdapter.focusItemAtIndex(2), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown End key on empty list does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: []};
  const event = {key: 'End', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
  td.when(mockAdapter.getListItemCount()).thenReturn(0);
  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(-1);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(true);
  foundation.handleKeydown(event);

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
  td.verify(preventDefault(), {times: 0});
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
    foundation.handleKeydown(event);
  });
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown finds the first ancestor with mdc-list-item', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const preventDefault = td.func('preventDefault');
  const target = {classList: [], parentElement};
  const event = {key: 'ArrowUp', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(false);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(true);
  foundation.handleKeydown(event);

  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown does not find ancestor with mdc-list-item so returns early', () => {
  const {foundation, mockAdapter} = setupTest();
  const parentElement = {classList: ['mdc-list-item']};
  const preventDefault = td.func('preventDefault');
  const target = {classList: [], parentElement};
  const event = {key: 'ArrowUp', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
  td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(-1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(false);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown space key causes preventDefault to be called on the event when singleSelection=true', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown enter key causes preventDefault to be called on the event when singleSelection=true', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Enter', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 1});
});

test('#handleKeydown space key does not cause preventDefault to be called if singleSelection=false', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown enter key does not cause preventDefault to be called if singleSelection=false', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Enter', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown space key is triggered when singleSelection is true selects the list item', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.isListItem(target)).thenReturn(true);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(0, strings.ARIA_SELECTED, true), {times: 1});
});

test('#handleKeydown space key is triggered 2x when singleSelection is true un-selects the list item', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.isListItem(target)).thenReturn(true);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 2});
  td.verify(mockAdapter.removeAttributeForElementIndex(0, strings.ARIA_SELECTED), {times: 1});
});

test('#handleKeydown space key is triggered when singleSelection is true on second ' +
  'element updates first element tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.isListItem(target)).thenReturn(true);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', 0), {times: 1});
});

test('#handleKeydown space key is triggered 2x when singleSelection is true on second ' +
  'element updates first element tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.isListItem(target)).thenReturn(true);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event);
  foundation.handleKeydown(event);

  td.verify(preventDefault(), {times: 2});
  td.verify(mockAdapter.setAttributeForElementIndex(0, 'tabindex', 0), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', -1), {times: 1});
});

test('#handleKeydown space key is triggered and focused is moved to a different element', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {key: 'Space', target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.isListItem(target)).thenReturn(true);
  foundation.setSingleSelection(true);
  foundation.handleKeydown(event);
  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(2);
  foundation.handleKeydown(event);

  td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', -1), {times: 1});
  td.verify(mockAdapter.setAttributeForElementIndex(2, 'tabindex', 0), {times: 1});
});

test('#handleClick when singleSelection=true on a list item should cause the list item to be selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func('preventDefault');
  const target = {classList: ['mdc-list-item']};
  const event = {target, preventDefault};

  td.when(mockAdapter.getFocusedElementIndex()).thenReturn(1);
  td.when(mockAdapter.getListItemCount()).thenReturn(3);
  td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(true);
  foundation.handleClick(event);

  td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', 0), {times: 1});
});

test('#handleClick when singleSelection=true on a button subelement should not cause the list item to be selected',
  () => {
    const {foundation, mockAdapter} = setupTest();
    const parentElement = {classList: ['mdc-list-item']};
    const preventDefault = td.func('preventDefault');
    const target = {classList: [], parentElement};
    const event = {target, preventDefault};

    td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
    td.when(mockAdapter.isElementFocusable(td.matchers.anything())).thenReturn(true);
    td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(1);
    td.when(mockAdapter.isListItem(td.matchers.anything())).thenReturn(false);
    foundation.setSingleSelection(true);
    foundation.handleClick(event);

    td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', 0), {times: 0});
  });

test('#handleClick when singleSelection=true on an element not in a list item should be ignored',
  () => {
    const {foundation, mockAdapter} = setupTest();
    const preventDefault = td.func('preventDefault');
    const target = {classList: []};
    const event = {target, preventDefault};

    td.when(mockAdapter.getFocusedElementIndex()).thenReturn(-1);
    td.when(mockAdapter.isElementFocusable(td.matchers.anything())).thenReturn(true);
    td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(-1);
    foundation.setSingleSelection(true);
    foundation.handleClick(event);

    td.verify(mockAdapter.setAttributeForElementIndex(1, 'tabindex', 0), {times: 0});
  });

test('#handleClick when singleSelection=true on the first element when already selected',
  () => {
    const {foundation, mockAdapter} = setupTest();
    const preventDefault = td.func('preventDefault');
    const target = {classList: []};
    const event = {target, preventDefault};

    td.when(mockAdapter.getFocusedElementIndex()).thenReturn(0);
    td.when(mockAdapter.isElementFocusable(td.matchers.anything())).thenReturn(true);
    td.when(mockAdapter.getListItemIndex(td.matchers.anything())).thenReturn(0);
    foundation.setSingleSelection(true);
    foundation.handleClick(event);
    foundation.handleClick(event);

    td.verify(mockAdapter.setAttributeForElementIndex(0, 'tabindex', 0), {times: 0});
  });

test('#focusFirstElement is called when the list is empty does not focus an element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getListItemCount()).thenReturn(-1);
  foundation.focusFirstElement();

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
});

test('#focusLastElement is called when the list is empty does not focus an element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getListItemCount()).thenReturn(-1);
  foundation.focusLastElement();

  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
});
