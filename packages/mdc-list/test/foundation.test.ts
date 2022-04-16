/**
 * @license
 * Copyright 2020 Google Inc.
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

import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {cssClasses, numbers, strings} from '../constants';
import {MDCListFoundation} from '../foundation';

function setupTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCListFoundation);
  return {foundation, mockAdapter};
}

function setupTypeaheadTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCListFoundation);
  const itemTextList = ['bravo', 'z aa', 'ba', 'baa', 'bab', 'z ac', 'a'];
  for (let i = 0; i < itemTextList.length; i++) {
    mockAdapter.getPrimaryTextAtIndex.withArgs(i).and.returnValue(
        itemTextList[i]);
  }
  mockAdapter.getListItemCount.and.returnValue(itemTextList.length);
  foundation.setHasTypeahead(true);
  return {foundation, mockAdapter};
}

function createMockMouseEvent(modifiers: string[]) {
  return {
    getModifierState: (modifier: string) => modifiers.includes(modifier),
  } as MouseEvent;
}

function createMockKeyboardEvent(
    key: string, modifiers: string[] = [], target?: {}) {
  return {
    key,
    target,
    getModifierState: (modifier: string) => modifiers.includes(modifier),
    ctrlKey: modifiers.includes('Control'),
    shiftKey: modifiers.includes('Shift'),
    metaKey: modifiers.includes('Meta'),
    altKey: modifiers.includes('Alt'),
    preventDefault: jasmine.createSpy('preventDefault') as Function,
  } as KeyboardEvent;
}

describe('MDCListFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports strings', () => {
    expect(MDCListFoundation.strings).toEqual(strings);
  });

  it('exports cssClasses', () => {
    expect(MDCListFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports numbers', () => {
    expect(MDCListFoundation.numbers).toEqual(numbers);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCListFoundation, [
      'getListItemCount',
      'getFocusedElementIndex',
      'setAttributeForElementIndex',
      'addClassForElementIndex',
      'removeClassForElementIndex',
      'focusItemAtIndex',
      'setTabIndexForListItemChildren',
      'hasRadioAtIndex',
      'hasCheckboxAtIndex',
      'isCheckboxCheckedAtIndex',
      'listItemAtIndexHasClass',
      'setCheckedCheckboxOrRadioAtIndex',
      'notifyAction',
      'notifySelectionChange',
      'isFocusInsideList',
      'getAttributeForElementIndex',
      'isRootFocused',
      'getPrimaryTextAtIndex',
    ]);
  });

  // The foundation needs to use a classList object that has a
  // `contains` method. This adds that method onto an array
  // for the tests.
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'contains', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(find: any) {
      return (this.indexOf(find) > -1);
    },
  });

  it('#layout should bail out early when list is empty', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.getListItemCount.and.returnValue(0);
    foundation.layout();

    expect(mockAdapter.hasCheckboxAtIndex).not.toHaveBeenCalledWith(0);
  });

  it('#handleFocusIn switches list item button/a elements to tabindex=0',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleFocusIn(1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .toHaveBeenCalledWith(1, '0');
     });

  it('#handleFocusOut switches list item button/a elements to tabindex=-1',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleFocusOut(1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .toHaveBeenCalledWith(1, '-1');
     });

  it('#handleFocusIn switches list item button/a elements to tabindex=0 when target is child element',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleFocusIn(1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .toHaveBeenCalledWith(1, '0');
     });

  it('#handleFocusOut switches list item button/a elements to tabindex=-1 when target is child element',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleFocusOut(1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .toHaveBeenCalledWith(1, '-1');
     });

  it('#handleFocusIn does nothing if mdc-list-item is not on element or ancestor',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleFocusIn(-1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .not.toHaveBeenCalledWith(jasmine.anything(), jasmine.anything());
     });

  it('#handleFocusOut does nothing if mdc-list-item is not on element or ancestor',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleFocusOut(-1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .not.toHaveBeenCalledWith(jasmine.anything(), jasmine.anything());
     });

  it('#handleFocusOut sets tabindex=0 to selected item when focus leaves single selection list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(false);
       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(false);
       foundation.setSingleSelection(true);
       foundation.layout();

       mockAdapter.isFocusInsideList.and.returnValue(false);

       foundation.setSelectedIndex(
           2);  // Selected index values may not be in sequence.
       foundation.handleFocusOut(3);
       jasmine.clock().tick(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, 'tabindex', '0');
     });

  it('#handleFocusOut sets tabindex=0 to first item when focus leaves list ' +
         'that has no selection',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation['focusedItemIndex'] = 3;
       foundation.setSingleSelection(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.isFocusInsideList.and.returnValue(false);

       foundation.handleFocusOut(3);
       jasmine.clock().tick(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, 'tabindex', '0');
     });

  it('#handleFocusOut does not set tabindex=0 to selected list item when focus moves to next list item.',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setSingleSelection(true);
       foundation.layout();

       mockAdapter.isFocusInsideList.and.returnValue(true);

       foundation.setSelectedIndex(2);
       foundation.handleFocusOut(3);
       jasmine.clock().tick(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(2, 'tabindex', 0);
     });

  it('#handleFocusOut sets tabindex=0 to first selected index when focus leaves checkbox based list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       mockAdapter.isFocusInsideList.and.returnValue(false);

       foundation.setSelectedIndex(
           [3, 2]);  // Selected index values may not be in sequence.

       foundation.handleFocusOut(2);
       jasmine.clock().tick(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, 'tabindex', '0');
     });

  it('#getFocusedItemIndex returns currently focused item', () => {
    const {foundation} = setupTest();
    expect(foundation.getFocusedItemIndex()).toBe(-1);
    foundation.handleFocusIn(2);
    expect(foundation.getFocusedItemIndex()).toBe(2);
  });

  it('#handleKeydown does nothing if key received on root element and not used for navigation',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('A');

       mockAdapter.isRootFocused.and.returnValue(true);
       foundation.handleKeydown(event, false, -1);

       expect(mockAdapter.getFocusedElementIndex).not.toHaveBeenCalled();
     });

  it('#handleKeydown should focus on last item when UP arrow key received on list root',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('ArrowUp');

       mockAdapter.isRootFocused.and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(5);
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(4);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.getFocusedElementIndex).not.toHaveBeenCalled();
     });

  it('#handleKeydown should focus on first item when DOWN arrow key received on list root',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('ArrowDown');

       mockAdapter.isRootFocused.and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(5);
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.getFocusedElementIndex).not.toHaveBeenCalled();
     });

  it('#handleKeydown should focus and select the last item when Shift + ArrowUp key received on list root',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('ArrowUp', ['Shift']);

       mockAdapter.isRootFocused.and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(5);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(4);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.getFocusedElementIndex).not.toHaveBeenCalled();
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([4]);
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
       expect((foundation.getSelectedIndex() as number[]).sort()).toEqual([4]);
     });

  it('#handleKeydown should focus and select the first item when Shift + ArrowDown key received on list root',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('ArrowDown', ['Shift']);

       mockAdapter.isRootFocused.and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(5);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.getFocusedElementIndex).not.toHaveBeenCalled();
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([0]);
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
       expect((foundation.getSelectedIndex() as number[]).sort()).toEqual([0]);
     });

  it('#handleKeydown does nothing if the key is not used for navigation',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('A', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(event.preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeydown moves focus to index+1 if the ArrowDown key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowDown', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown focuses disabled item when disabled items are focusable and the ArrowDown key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowDown', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(/*fakeIndex*/ 1, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown skips disabled item when disabled items are not focusable and the ArrowDown key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowDown', [], target);

       foundation.setDisabledItemsFocusable(false);
       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(/*fakeIndex*/ 1, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown moves focus to index-1 if the ArrowUp key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowUp', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown focuses disabled item when disabled items are focusable and the ArrowUp key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowUp', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(2);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(/*fakeIndex*/ 1, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.handleKeydown(event, true, 2);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown skips disabled item when disabled items are not focusable and the ArrowUp key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowUp', [], target);

       foundation.setDisabledItemsFocusable(false);
       mockAdapter.getFocusedElementIndex.and.returnValue(2);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(/*fakeIndex*/ 1, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.handleKeydown(event, true, 2);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown moves focus to and selects index+1 if Shift + ArrowDown key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowDown', ['Shift'], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.isCheckboxCheckedAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();
       foundation.setSelectedIndex([0]);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
       expect((foundation.getSelectedIndex() as number[]).sort()).toEqual([
         0, 2
       ]);
     });

  it('#handleKeydown moves focus to and deselects index+1 if Shift + ArrowDown key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowDown', ['Shift'], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.isCheckboxCheckedAtIndex.withArgs(2).and.returnValue(true);
       foundation.layout();
       foundation.setSelectedIndex([2]);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
       expect((foundation.getSelectedIndex() as number[]).sort()).toEqual([]);
     });

  it('#handleKeydown moves focus to and selects index-1 if Shift + ArrowUp key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowUp', ['Shift'], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.isCheckboxCheckedAtIndex.withArgs(2).and.returnValue(true);
       foundation.layout();
       foundation.setSelectedIndex([2]);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([0]);
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
       expect((foundation.getSelectedIndex() as number[]).sort()).toEqual([
         0, 2
       ]);
     });

  it('#handleKeydown moves focus to and deselects index-1 if Shift + ArrowUp key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowUp', ['Shift'], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.isCheckboxCheckedAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();
       foundation.setSelectedIndex([0]);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([0]);
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
       expect((foundation.getSelectedIndex() as number[]).sort()).toEqual([]);
     });

  it('#handleKeydown ArrowRight key does nothing if isVertical is true', () => {
    const {foundation, mockAdapter} = setupTest();
    const target = {tagName: 'li'};
    const event = createMockKeyboardEvent('ArrowRight', [], target);

    mockAdapter.getFocusedElementIndex.and.returnValue(1);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleKeydown(event, true, 1);

    expect(mockAdapter.focusItemAtIndex)
        .not.toHaveBeenCalledWith(jasmine.anything());
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('#handleKeydown ArrowLeft key does nothing if isVertical is true', () => {
    const {foundation, mockAdapter} = setupTest();
    const target = {tagName: 'li'};
    const event = createMockKeyboardEvent('ArrowLeft', [], target);

    mockAdapter.getFocusedElementIndex.and.returnValue(1);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleKeydown(event, true, 1);

    expect(mockAdapter.focusItemAtIndex)
        .not.toHaveBeenCalledWith(jasmine.anything());
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('#handleKeydown ArrowRight key causes the next item to gain focus if isVertical is false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowRight', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setVerticalOrientation(false);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowLeft key causes the previous item to gain focus if isVertical is false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowLeft', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setVerticalOrientation(false);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowDown key causes first item to focus if last item is focused and wrapFocus is true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowDown', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(2);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setWrapFocus(true);
       foundation.handleKeydown(event, true, 2);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowDown key if last item is focused and wrapFocus is false does not focus an item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowDown', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(2);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 2);

       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowUp key causes last item to focus if first item is focused and wrapFocus is true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowUp', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setWrapFocus(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowUp key if first item is focused and wrapFocus is false does not focus an item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event = createMockKeyboardEvent('ArrowUp', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown Home key causes the first item to be focused', () => {
    const {foundation, mockAdapter} = setupTest();
    const target = {tagName: 'li'};
    const event = createMockKeyboardEvent('Home', [], target);

    mockAdapter.getFocusedElementIndex.and.returnValue(1);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleKeydown(event, true, 1);

    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('#handleKeydown End key causes the last item to be focused', () => {
    const {foundation, mockAdapter} = setupTest();
    const target = {tagName: 'li'};
    const event = createMockKeyboardEvent('End', [], target);

    mockAdapter.getFocusedElementIndex.and.returnValue(0);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleKeydown(event, true, 0);

    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('#handleKeydown Control + Shift + Home key selects all items from current to first',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event =
           createMockKeyboardEvent('Home', ['Control', 'Shift'], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([0, 1]);
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
     });

  it('#handleKeydown Control + Shift + End key selects all items from current to end',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'li'};
       const event =
           createMockKeyboardEvent('End', ['Control', 'Shift'], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([1, 2]);
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
     });


  it('#handleKeydown navigation key in input/button/select/textarea elements do not call preventDefault ',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputs = ['input', 'button', 'select', 'textarea'];
       const preventDefault = jasmine.createSpy('preventDefault');

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);

       inputs.forEach((input) => {
         const target = {tagName: input};
         const event = createMockKeyboardEvent('ArrowUp', [], target);
         event.preventDefault = preventDefault;
         foundation.handleKeydown(event, false, 0);
       });
       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeydown focuses on the bound mdc-list-item even if the event happened on a child element',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const parentElement = {classList: ['mdc-list-item']};
       const target = {classList: [], parentElement};
       const event = createMockKeyboardEvent('ArrowUp', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, false, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown space key causes preventDefault to be called on keydown event',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown enter key causes preventDefault to be called on keydown event',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Enter', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown enter key while focused on a sub-element of a list item does not cause preventDefault on the ' +
         'event when singleSelection=true ',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Enter', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, false, 0);

       expect(event.preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeydown space/enter key cause event.preventDefault if a checkbox or radio button is present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(false);
       foundation.setSingleSelection(false);
       foundation.layout();
       foundation.handleKeydown(event, true, 0);
       (event as any).key = 'Enter';
       foundation.handleKeydown(event, true, 0);

       expect(event.preventDefault).toHaveBeenCalledTimes(2);
     });

  it('#handleKeydown space key calls notifyAction for anchor element regardless of singleSelection',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'A', classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setSingleSelection(false);
       foundation.handleKeydown(event, true, 0);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.notifyAction).toHaveBeenCalledWith(0);
       expect(mockAdapter.notifyAction).toHaveBeenCalledTimes(2);
     });

  it('#handleKeydown space key does not call notifyAction for disabled element',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'A', classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(0, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
     });

  it('#handleKeydown enter key does not call notifyAction for anchor element',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'A', classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Enter', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setSingleSelection(false);
       foundation.handleKeydown(event, true, 0);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.notifyAction)
           .not.toHaveBeenCalledWith(
               0);  // notifyAction will be called by handleClick event.
     });

  it('#handleKeydown notifies of action when enter key pressed on list item ',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Enter', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.notifyAction).toHaveBeenCalledWith(0);
       expect(mockAdapter.notifyAction).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown selects the list item when enter key is triggered, singleSelection=true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Enter', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, 'tabindex', '0');
     });

  it('#handleKeydown does not select the list item when' +
         'enter key is triggered, singleSelection=true, #adapter.isListItemDisabled=true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Enter', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(0, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
     });

  it('#handleKeydown space key is triggered when singleSelection is true selects the list item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, 'tabindex', '0');
       ;
     });

  it('#handleKeydown space key when singleSelection=true does not select an element is isRootListItem=false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, false, 0);

       expect(event.preventDefault).not.toHaveBeenCalled();
       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
     });

  it('#handleKeydown does not select list item when' +
         'space key is triggered, singleSelection=true, #adapter.isListItemDisabled=true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(0, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
     });

  it('#handleKeydown space key is triggered 2x when singleSelection does not un-select the item.',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);
       foundation.handleKeydown(event, true, 0);

       expect(event.preventDefault).toHaveBeenCalledTimes(2);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'false');
     });

  it('#handleKeydown space key is triggered 2x when singleSelection is true on second ' +
         'element updates first element tabindex',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(1, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 1);
       foundation.handleKeydown(event, true, 1);

       expect(event.preventDefault).toHaveBeenCalledTimes(2);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(1, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, 'tabindex', '-1');
     });

  it('#handleKeydown when shift + space/enter and no previous user selection action should toggle item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const shiftEvent =
           createMockKeyboardEvent('Spacebar', ['Shift'], target);

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       foundation.handleKeydown(shiftEvent, true, 2);

       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
       expect(mockAdapter.notifyAction).toHaveBeenCalled();
     });

  it('#handleKeydown unselected item when shift + enter/space should select range from previous action',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Enter', [], target);
       const shiftEvent = createMockKeyboardEvent('Enter', ['Shift'], target);

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();
       foundation.handleKeydown(event, true, 1);
       foundation.handleKeydown(event, true, 0);

       mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
       mockAdapter.setAttributeForElementIndex.calls.reset();
       mockAdapter.notifySelectionChange.calls.reset();
       mockAdapter.notifyAction.calls.reset();

       foundation.handleKeydown(shiftEvent, true, 3);

       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(2);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(3, true);
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(2);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2, 3]);
       expect(mockAdapter.notifyAction).toHaveBeenCalled();
     });

  it('#handleKeydown selected item when shift + enter/space should deselect range from previous action',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = createMockKeyboardEvent('Spacebar', [], target);
       const shiftEvent =
           createMockKeyboardEvent('Spacebar', ['Shift'], target);

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();
       foundation.handleKeydown(event, true, 3);
       foundation.handleKeydown(event, true, 1);
       foundation.handleKeydown(event, true, 0);

       mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
       mockAdapter.setAttributeForElementIndex.calls.reset();
       mockAdapter.notifySelectionChange.calls.reset();
       mockAdapter.notifyAction.calls.reset();

       foundation.handleKeydown(shiftEvent, true, 3);

       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(3);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(1, false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(3, false);
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(3);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([
         0, 1, 3
       ]);
       expect(mockAdapter.notifyAction).toHaveBeenCalled();
     });

  it('#handleKeydown bail out early if event origin doesnt have a mdc-list-item ancestor from the current list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       const event = createMockKeyboardEvent('ArrowDown');
       (event as any).keyCode = 40;

       foundation.handleKeydown(
           event, /** isRootListItem */ true, /** listItemIndex */ -1);

       expect(event.preventDefault).not.toHaveBeenCalled();
     });

  it('#focusLastElement focuses the last list item and returns that index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);

       expect(3).toEqual(foundation.focusLastElement());
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(3);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
     });

  it('#focusInitialElement focuses the first list item and returns that index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);

       expect(0).toEqual(foundation.focusInitialElement());
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
     });

  it('#focusInitialElement focuses the first selected list item and returns that index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setSingleSelection(true);
       foundation.setSelectedIndex(2);

       expect(2).toEqual(foundation.focusInitialElement());
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
     });

  it('#focusNextElement focuses next list item and returns that index', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.getListItemCount.and.returnValue(4);

    expect(3).toEqual(foundation.focusNextElement(2));
    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(3);
    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
  });

  it('#focusNextElement focuses first list item when focus is on last list item when wrapFocus=true and returns that ' +
         'index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setWrapFocus(true);

       expect(0).toEqual(foundation.focusNextElement(3));
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown should select all items on ctrl + A, if nothing is selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('A', ['Control']);

       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.layout();
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(3);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(1, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, true);
     });

  it('#handleKeydown should select all items on ctrl + lowercase A, if nothing is selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('a', ['Control']);

       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.layout();
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(3);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(1, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, true);
     });

  it('#handleKeydown should select all items on ctrl + A, if some items are selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('A', ['Control']);

       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.layout();
       foundation.setSelectedIndex([1, 2]);

       // Reset the calls since `setSelectedIndex` will throw it off.
       mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(4);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(1, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(3, true);
     });

  it('#handleKeydown should deselect all items on ctrl + A, if all items are selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('A', ['Control']);

       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.layout();
       foundation.setSelectedIndex([0, 1, 2]);

       // Reset the calls since `setSelectedIndex` will throw it off.
       mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(3);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(1, false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, false);
     });

  it('#handleKeydown should not select disabled items on ctrl + A', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = createMockKeyboardEvent('A', ['Control']);

    mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
    mockAdapter.listItemAtIndexHasClass
        .withArgs(1, cssClasses.LIST_ITEM_DISABLED_CLASS)
        .and.returnValue(true);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.layout();
    foundation.handleKeydown(event, false, -1);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
        .toHaveBeenCalledTimes(3);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
        .toHaveBeenCalledWith(0, true);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
        .toHaveBeenCalledWith(1, false);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
        .toHaveBeenCalledWith(2, true);
  });

  it('#handleKeydown should not handle ctrl + A on a non-checkbox list', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = createMockKeyboardEvent('a', ['Control']);

    mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(false);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.layout();
    foundation.handleKeydown(event, false, -1);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).not.toHaveBeenCalled();
  });

  it('#handleKeydown should not deselect a selected disabled item on ctrl + A',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = createMockKeyboardEvent('A', ['Control']);

       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(1, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.layout();
       foundation.setSelectedIndex([1]);

       // Reset the calls since `setSelectedIndex` will throw it off.
       mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
       foundation.handleKeydown(event, false, -1);

       expect(event.preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(3);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(1, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, true);
     });

  it('#handleKeydown should select all items on command(metaKey) + A, if nothing is selected',
      () => {
        const {foundation, mockAdapter} = setupTest();
        const event = createMockKeyboardEvent('A', ['Meta']);

        mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
        mockAdapter.getListItemCount.and.returnValue(3);
        foundation.layout();
        foundation.handleKeydown(event, false, -1);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledTimes(3);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(0, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(1, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(2, true);
      });

  it('#handleKeydown should select all items on command(metaKey) + lowercase A, if nothing is selected',
      () => {
        const {foundation, mockAdapter} = setupTest();
        const event = createMockKeyboardEvent('a', ['Meta']);

        mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
        mockAdapter.getListItemCount.and.returnValue(3);
        foundation.layout();
        foundation.handleKeydown(event, false, -1);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledTimes(3);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(0, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(1, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(2, true);
      });

  it('#handleKeydown should select all items on command(metaKey) + A, if some items are selected',
      () => {
        const {foundation, mockAdapter} = setupTest();
        const event = createMockKeyboardEvent('A', ['Meta']);

        mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
        mockAdapter.getListItemCount.and.returnValue(4);
        foundation.layout();
        foundation.setSelectedIndex([1, 2]);

        // Reset the calls since `setSelectedIndex` will throw it off.
        mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
        foundation.handleKeydown(event, false, -1);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledTimes(4);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(0, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(1, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(2, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(3, true);
      });

  it('#handleKeydown should deselect all items on command(metaKey) + A, if all items are selected',
      () => {
        const {foundation, mockAdapter} = setupTest();
        const event = createMockKeyboardEvent('A', ['Meta']);

        mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
        mockAdapter.getListItemCount.and.returnValue(3);
        foundation.layout();
        foundation.setSelectedIndex([0, 1, 2]);

        // Reset the calls since `setSelectedIndex` will throw it off.
        mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
        foundation.handleKeydown(event, false, -1);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledTimes(3);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(0, false);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(1, false);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(2, false);
      });

  it('#handleKeydown should not select disabled items on command(metaKey) + A', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = createMockKeyboardEvent('A', ['Meta']);

    mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
    mockAdapter.listItemAtIndexHasClass
        .withArgs(1, cssClasses.LIST_ITEM_DISABLED_CLASS)
        .and.returnValue(true);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.layout();
    foundation.handleKeydown(event, false, -1);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
        .toHaveBeenCalledTimes(3);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
        .toHaveBeenCalledWith(0, true);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
        .toHaveBeenCalledWith(1, false);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
        .toHaveBeenCalledWith(2, true);
  });

  it('#handleKeydown should not handle command(metaKey) + A on a non-checkbox list', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = createMockKeyboardEvent('a', ['Meta']);

    mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(false);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.layout();
    foundation.handleKeydown(event, false, -1);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).not.toHaveBeenCalled();
  });

  it('#handleKeydown should not deselect a selected disabled item on command(metaKey) + A',
      () => {
        const {foundation, mockAdapter} = setupTest();
        const event = createMockKeyboardEvent('A', ['Meta']);

        mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
        mockAdapter.listItemAtIndexHasClass
            .withArgs(1, cssClasses.LIST_ITEM_DISABLED_CLASS)
            .and.returnValue(true);
        mockAdapter.getListItemCount.and.returnValue(3);
        foundation.layout();
        foundation.setSelectedIndex([1]);

        // Reset the calls since `setSelectedIndex` will throw it off.
        mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
        foundation.handleKeydown(event, false, -1);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledTimes(3);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(0, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(1, true);
        expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
            .toHaveBeenCalledWith(2, true);
      });

  it('#focusNextElement retains the focus on last item when wrapFocus=false and returns that index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setWrapFocus(false);

       expect(3).toEqual(foundation.focusNextElement(3));
       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#focusPrevElement focuses previous list item and returns that index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);

       expect(1).toEqual(foundation.focusPrevElement(2));
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
     });

  it('#focusPrevElement focuses last list item when focus is on first list item when wrapFocus=true and returns that ' +
         'index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setWrapFocus(true);

       expect(3).toEqual(foundation.focusPrevElement(0));
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(3);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
     });

  it('#focusPrevElement retains the focus on first list item when wrapFocus=false and returns that index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setWrapFocus(false);

       expect(0).toEqual(foundation.focusPrevElement(0));
       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#handleClick when singleSelection=false on a list item should not cause the list item to be selected',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setSingleSelection(false);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleClick(1, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

       expect(mockAdapter.addClassForElementIndex)
           .not.toHaveBeenCalledWith(1, cssClasses.LIST_ITEM_SELECTED_CLASS);
       expect(mockAdapter.addClassForElementIndex)
           .not.toHaveBeenCalledWith(1, cssClasses.LIST_ITEM_ACTIVATED_CLASS);
     });

  it('#handleClick notifies of action when clicked on list item.', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleClick(1, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

    expect(mockAdapter.notifyAction).toHaveBeenCalledWith(1);
    expect(mockAdapter.notifyAction).toHaveBeenCalledTimes(1);
  });

  it('#handleClick does not notify of action when clicked on disabled list item.',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(1, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.handleClick(1, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
     });

  it('#handleClick when singleSelection=true on a list item should cause the list item to be selected',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setSingleSelection(true);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleClick(1, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(1, 'tabindex', '0');
     });

  it('#handleClick when singleSelection=true on a button subelement should not cause the list item to be selected',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setSingleSelection(true);
       foundation.handleClick(-1, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(1, 'tabindex', 0);
     });

  it('#handleClick when singleSelection=true on an element not in a list item should be ignored',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       foundation.setSingleSelection(true);
       foundation.handleClick(-1, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(1, 'tabindex', 0);
     });

  it('#handleClick when singleSelection=true on the first element when already selected',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setSingleSelection(true);
       foundation.handleClick(0, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       foundation.handleClick(0, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, 'tabindex', '0');
       expect(mockAdapter.setAttributeForElementIndex.calls.allArgs()
                  .filter(
                      (args: any) => JSON.stringify(args) ==
                          JSON.stringify([0, 'tabindex', '0']))
                  .length)
           .toEqual(1);
     });

  it('#handleClick when isCheckboxAlreadyUpdatedInAdapter=true does not ' +
         'change the checkbox state',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.layout();
       foundation.handleClick(2, /*isCheckboxAlreadyUpdatedInAdapter*/ true);

       mockAdapter.isCheckboxCheckedAtIndex.withArgs(2).and.returnValue(false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .not.toHaveBeenCalledWith(2, true);
     });

  it('#handleClick proxies to the adapter#setCheckedCheckboxOrRadioAtIndex if ' +
         'isCheckboxAlreadyUpdatedInAdapter is false',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.layout();
       foundation.handleClick(0, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, true);
     });

  it('#handleClick does not proxy to the adapter#setCheckedCheckboxOrRadioAtIndex' +
         'if isCheckboxAlreadyUpdatedInAdapter=false, adapter.isListItemDisabled=true',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(0, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.layout();
       foundation.handleClick(0, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .not.toHaveBeenCalledWith(0, true);
     });

  it('#handleClick checks the checkbox at index if it is present on list item',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       // Check
       mockAdapter.isCheckboxCheckedAtIndex.withArgs(2).and.returnValue(false);
       foundation.handleClick(2, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(1);

       // Uncheck
       mockAdapter.isCheckboxCheckedAtIndex.withArgs(2).and.returnValue(true);
       foundation.handleClick(2, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, false);
     });

  it('#handleClick bails out if checkbox or radio is not present and if ' +
         'isCheckboxAlreadyUpdatedInAdapter set to true',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasCheckboxAtIndex.withArgs(1).and.returnValue(false);
       mockAdapter.hasRadioAtIndex.withArgs(1).and.returnValue(false);

       foundation.handleClick(2, /*isCheckboxAlreadyUpdatedInAdapter*/ true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .not.toHaveBeenCalledWith(1, jasmine.anything());
     });

  it('#handleClick single-select list when shift key is held should do nothing',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setSingleSelection(true);
       foundation.layout();

       foundation.handleClick(
           /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ false,
           /*fakeEvent*/ createMockMouseEvent(['Shift']));
       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
     });

  it('#handleClick when shift key is held and no previous user selection action should toggle item',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       foundation.handleClick(
           /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ false,
           /*fakeEvent*/ createMockMouseEvent(['Shift']));
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
       expect(mockAdapter.notifyAction).toHaveBeenCalled();
     });

  it('#handleClick unselected item when shift key is held should select range from previous action',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       foundation.handleClick(
           /*fakeIndex*/ 1, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       foundation.handleClick(
           /*fakeIndex*/ 0, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
       mockAdapter.setAttributeForElementIndex.calls.reset();
       mockAdapter.notifySelectionChange.calls.reset();
       mockAdapter.notifyAction.calls.reset();

       foundation.handleClick(
           /*fakeIndex*/ 3, /*isCheckboxAlreadyUpdatedInAdapter*/ false,
           /*fakeEvent*/ createMockMouseEvent(['Shift']));
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(2);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(3, true);
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(2);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2, 3]);
       expect(mockAdapter.notifyAction).toHaveBeenCalled();
     });

  it('#handleClick selected item when shift key is held should deselect range from previous action',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       foundation.handleClick(
           /*fakeIndex*/ 3, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       foundation.handleClick(
           /*fakeIndex*/ 1, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       foundation.handleClick(
           /*fakeIndex*/ 0, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
       mockAdapter.setAttributeForElementIndex.calls.reset();
       mockAdapter.notifySelectionChange.calls.reset();
       mockAdapter.notifyAction.calls.reset();

       foundation.handleClick(
           /*fakeIndex*/ 3, /*isCheckboxAlreadyUpdatedInAdapter*/ false,
           /*fakeEvent*/ createMockMouseEvent(['Shift']));
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(3);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(1, false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(3, false);
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(3);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([
         0, 1, 3
       ]);
       expect(mockAdapter.notifyAction).toHaveBeenCalled();
     });

  it('#handleClick when shift key is held should not toggle disabled items',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(/*fakeIndex*/ 2, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.layout();

       foundation.handleClick(
           /*fakeIndex*/ 0, /*isCheckboxAlreadyUpdatedInAdapter*/ false);
       mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();
       mockAdapter.setAttributeForElementIndex.calls.reset();
       mockAdapter.notifySelectionChange.calls.reset();
       mockAdapter.notifyAction.calls.reset();

       foundation.handleClick(
           /*fakeIndex*/ 3, /*isCheckboxAlreadyUpdatedInAdapter*/ false,
           /*fakeEvent*/ createMockMouseEvent(['Shift']));
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(2);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .not.toHaveBeenCalledWith(2, jasmine.anything());
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(2);
       expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([1, 3]);
       expect(mockAdapter.notifyAction).toHaveBeenCalled();
     });

  it('#handleClick multiple clicks while shift is held should work', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.getListItemCount.and.returnValue(4);
    mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
    foundation.layout();

    foundation.handleClick(
        /*fakeIndex*/ 0, /*isCheckboxAlreadyUpdatedInAdapter*/ false,
        /*fakeEvent*/ createMockMouseEvent(['Shift']));
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalledWith(0, true);
    mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();

    foundation.handleClick(
        /*fakeIndex*/ 3, /*isCheckboxAlreadyUpdatedInAdapter*/ false,
        /*fakeEvent*/ createMockMouseEvent(['Shift']));
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalledWith(1, true);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalledWith(2, true);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalledWith(3, true);
    mockAdapter.setCheckedCheckboxOrRadioAtIndex.calls.reset();

    foundation.handleClick(
        /*fakeIndex*/ 0, /*isCheckboxAlreadyUpdatedInAdapter*/ false,
        /*fakeEvent*/ createMockMouseEvent(['Shift']));
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalledWith(0, false);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalledWith(1, false);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalledWith(2, false);
    expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalledWith(3, false);
  });

  it('#setSingleSelection true with --selected item initializes list state' +
         ' to correct selection',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(2, cssClasses.LIST_ITEM_SELECTED_CLASS)
           .and.returnValue(true);
       foundation.setSingleSelection(true);

       expect(foundation.getSelectedIndex()).toEqual(2);
     });

  it('#setSingleSelection true with --activated item initializes list state' +
         ' to correct selection and causes further selections to use activation',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(2, cssClasses.LIST_ITEM_ACTIVATED_CLASS)
           .and.returnValue(true);
       foundation.setSingleSelection(true);

       expect(foundation.getSelectedIndex()).toEqual(2);
       foundation.setSelectedIndex(1);
       expect(mockAdapter.addClassForElementIndex)
           .toHaveBeenCalledWith(1, cssClasses.LIST_ITEM_ACTIVATED_CLASS);
     });

  it('#setSingleSelection=true resets selected index if there is no selected ' +
         'item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getListItemCount.and.returnValue(3);

       foundation.setSelectedIndex(2);
       foundation.setSingleSelection(true);
       expect(foundation.getSelectedIndex()).toEqual(numbers.UNSET_INDEX);
     });

  it('#setUseActivatedClass causes setSelectedIndex to use the --activated class',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setUseActivatedClass(true);
       foundation.setSelectedIndex(1);

       expect(mockAdapter.addClassForElementIndex)
           .toHaveBeenCalledWith(1, cssClasses.LIST_ITEM_ACTIVATED_CLASS);
       expect(mockAdapter.addClassForElementIndex).toHaveBeenCalledTimes(1);
     });

  it('#setSelectedIndex should bail out early if not in the range', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.getListItemCount.and.returnValue(4);
    foundation.setSelectedIndex(-1);
    expect(mockAdapter.setAttributeForElementIndex)
        .not.toHaveBeenCalledWith(-1, 'tabindex', 0);
  });

  it('#setSelectedIndex should bail out early if index is string or invalid',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setSelectedIndex('some_random_input' as any);
       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(-1, 'tabindex', 0);
     });

  it('#setSelectedIndex should set aria checked true on new selected index and set aria checked false on previous ' +
         'selected index for checkbox based list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       mockAdapter.isCheckboxCheckedAtIndex.withArgs(2).and.returnValue(true);
       foundation.setSelectedIndex([2]);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_CHECKED, 'true');

       mockAdapter.isCheckboxCheckedAtIndex.withArgs(3).and.returnValue(true);
       foundation.setSelectedIndex([3]);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_CHECKED, 'false');
     });

  it('#setSelectedIndex should set aria attributes on new index and should also set aria checked to false on previous' +
         ' selected index for radio based list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(5);
       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       foundation.setSelectedIndex(3);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(3, strings.ARIA_CHECKED, 'true');

       foundation.setSelectedIndex(4);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(4, strings.ARIA_CHECKED, 'true');
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(3, strings.ARIA_CHECKED, 'false');
     });

  it('#setSelectedIndex removes selected/activated class name and sets aria-selected to false from previously selected ' +
         'list item',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.getAttributeForElementIndex.withArgs(2, strings.ARIA_CURRENT)
           .and.returnValue(null);
       mockAdapter.getAttributeForElementIndex.withArgs(3, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSelectedIndex(2);

       foundation.setSelectedIndex(3);
       expect(mockAdapter.removeClassForElementIndex)
           .toHaveBeenCalledWith(2, cssClasses.LIST_ITEM_SELECTED_CLASS);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_SELECTED, 'false');
     });

  it('#setSelectedIndex should detect the presence of aria-current during list initialization ' +
         '(i.e., when it is in unset state) and sets the same attribute on pre-selected index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(5);
       mockAdapter.getAttributeForElementIndex.withArgs(2, strings.ARIA_CURRENT)
           .and.returnValue('page');
       foundation.setSelectedIndex(2);

       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(2, strings.ARIA_CURRENT, 'false');
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_CURRENT, 'page');

       expect(mockAdapter.setAttributeForElementIndex.calls.allArgs()
                  .filter(
                      (args: any) => JSON.stringify(args) ==
                          JSON.stringify([2, strings.ARIA_CURRENT, 'page']))
                  .length)
           .toEqual(1);
     });

  it('#setSelectedIndex should set aria-selected as default option in the absence of aria-selected on pre-selected ' +
         'item index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(5);
       mockAdapter.getAttributeForElementIndex.withArgs(2, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSelectedIndex(2);

       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(2, jasmine.any(String), 'false');
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex.calls.allArgs()
                  .filter(
                      (args: any) => JSON.stringify(args) ==
                          JSON.stringify([2, strings.ARIA_SELECTED, 'true']))
                  .length)
           .toEqual(1);
     });

  it('#setSelectedIndex sets aria-current="false" to previously selected index and sets aria-current without any token' +
         'to current index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(5);
       mockAdapter.getAttributeForElementIndex.withArgs(2, strings.ARIA_CURRENT)
           .and.returnValue('');
       foundation.setSelectedIndex(2);

       foundation.setSelectedIndex(3);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_CURRENT, 'false');
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(3, strings.ARIA_CURRENT, '');
     });

  it('#setSelectedIndex sets aria-current to false to previously selected index and sets aria-current with appropriate ' +
         'token to current index',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(5);
       mockAdapter.getAttributeForElementIndex.withArgs(2, strings.ARIA_CURRENT)
           .and.returnValue('page');
       foundation.setSelectedIndex(2);

       foundation.setSelectedIndex(3);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_CURRENT, 'false');
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(3, strings.ARIA_CURRENT, 'page');
     });

  it('#setSelectedIndex throws error when array of index is set on radio based list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       expect(() => foundation.setSelectedIndex([0, 1, 2])).toThrow();
     });

  it('#setSelectedIndex throws error when single index number is set on multi-select checkbox based list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       expect(() => foundation.setSelectedIndex(2)).toThrow();
     });

  it('#setSelectedIndex deselects all checkboxes when selected index is set to []',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       foundation.setSelectedIndex([]);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex).toHaveBeenCalled();
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(4);
     });

  it('#getSelectedIndex should be in-sync with setter method', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.getListItemCount.and.returnValue(4);
    foundation.setSelectedIndex(2);
    expect(foundation.getSelectedIndex()).toEqual(2);
  });

  it('#getSelectedIndex should be in-sync with setter method for multi-select checkbox based list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       foundation.setSelectedIndex([0, 2, 3]);
       expect(foundation.getSelectedIndex()).toEqual([0, 2, 3]);
     });

  it('#setEnabled should remove disabled class and set aria-disabled to false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getListItemCount.and.returnValue(5);
       foundation.layout();

       foundation.setEnabled(3, true);
       expect(mockAdapter.removeClassForElementIndex)
           .toHaveBeenCalledWith(3, cssClasses.LIST_ITEM_DISABLED_CLASS);
       expect(mockAdapter.removeClassForElementIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(3, strings.ARIA_DISABLED, 'false');
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
     });

  it('#setEnabled should add disabled class and set aria-disabled to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getListItemCount.and.returnValue(5);
       foundation.layout();

       foundation.setEnabled(3, false);
       expect(mockAdapter.addClassForElementIndex)
           .toHaveBeenCalledWith(3, cssClasses.LIST_ITEM_DISABLED_CLASS);
       expect(mockAdapter.addClassForElementIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(3, strings.ARIA_DISABLED, 'true');
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
     });

  describe('notifySelectionChange', () => {
    describe('checkbox list', () => {
      it('should notify when a list item has been toggled through space',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {tagName: 'A', classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Spacebar', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           mockAdapter.hasCheckboxAtIndex.and.returnValue(true);
           mockAdapter.isCheckboxCheckedAtIndex.and.returnValue(false);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([4]);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledTimes(1);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledWith(4, true);
         });

      it('should not notify when a list item could not be toggled through ' +
             'space due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {tagName: 'A', classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Spacebar', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           mockAdapter.hasCheckboxAtIndex.and.returnValue(true);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 4, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledTimes(0);
         });

      it('should notify when a list item has been toggled through enter',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Enter', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           mockAdapter.hasCheckboxAtIndex.and.returnValue(true);
           mockAdapter.isCheckboxCheckedAtIndex.and.returnValue(false);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([4]);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledTimes(1);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledWith(4, true);
         });

      it('should not notify when a list item could not be toggled through ' +
             'enter due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Enter', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           mockAdapter.hasCheckboxAtIndex.and.returnValue(true);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 4, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledTimes(0);
         });

      it('should notify when a list item has been toggled through click',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           mockAdapter.hasCheckboxAtIndex.and.returnValue(true);
           mockAdapter.setCheckedCheckboxOrRadioAtIndex.and.returnValue(false);

           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledTimes(1);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledWith(2, true);
         });

      it('should notify when a list item has been toggled through click even ' +
             'with `isCheckboxAlreadyUpdatedInAdapter` set to `true`',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           mockAdapter.hasCheckboxAtIndex.and.returnValue(true);
           mockAdapter.isCheckboxCheckedAtIndex.and.returnValue(false);

           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ true);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledTimes(0);
         });

      it('should not notify when a list item could not be toggled through ' +
             'click due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           mockAdapter.hasCheckboxAtIndex.and.returnValue(true);
           mockAdapter.isCheckboxCheckedAtIndex.and.returnValue(false);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 2, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);


           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
           expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
               .toHaveBeenCalledTimes(0);
         });

      it('should notify when items have been selected through CTRL + A', () => {
        const {foundation, mockAdapter} = setupTest();
        const event = createMockKeyboardEvent('A', ['Control']);

        mockAdapter.getListItemCount.and.returnValue(3);
        mockAdapter.hasCheckboxAtIndex.and.returnValue(true);
        mockAdapter.isCheckboxCheckedAtIndex.and.returnValue(false);

        foundation.handleKeydown(event, false, -1);

        foundation.layout();
        foundation.handleKeydown(event, true, /*fakeIndex*/ 3);

        // nothing was selected before, so this should capture all three items.
        expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
        expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([
          0, 1, 2
        ]);

        mockAdapter.notifySelectionChange.calls.reset();
        foundation.setSelectedIndex([2]);
        foundation.handleKeydown(event, true, /*fakeIndex*/ 3);

        // The third item is already selected, so only the first and second
        // should have been toggled.
        expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
        expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([0, 1]);

        mockAdapter.notifySelectionChange.calls.reset();
        foundation.setSelectedIndex([0, 1, 2]);
        foundation.handleKeydown(event, true, /*fakeIndex*/ 3);

        // all items are selected, so all should be de-selected.
        expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
        expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([
          0, 1, 2
        ]);
      });
    });

    describe('radio list', () => {
      it('should notify when a list item has been toggled through space',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {tagName: 'A', classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Spacebar', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           mockAdapter.hasRadioAtIndex.and.returnValue(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([4]);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
         });

      it('should not notify when a list item could not be toggled through ' +
             'space due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {tagName: 'A', classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Spacebar', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           mockAdapter.hasRadioAtIndex.and.returnValue(true);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 4, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
         });

      it('should notify when a list item has been toggled through enter',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Enter', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           mockAdapter.hasRadioAtIndex.and.returnValue(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([4]);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
         });

      it('should not notify when a list item could not be toggled through ' +
             'enter due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Enter', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           mockAdapter.hasRadioAtIndex.and.returnValue(true);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 4, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
         });

      it('should notify when a list item has been toggled through click',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           mockAdapter.hasRadioAtIndex.and.returnValue(true);

           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
         });

      it('should notify when a list item has been toggled through click even ' +
             'with `isCheckboxAlreadyUpdatedInAdapter` set to `true`',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           mockAdapter.hasRadioAtIndex.and.returnValue(true);

           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ true);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
         });

      it('should not notify when a list item could not be toggled through ' +
             'click due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           mockAdapter.hasRadioAtIndex.and.returnValue(true);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 2, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);


           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
         });
    });

    describe('single selection', () => {
      it('should notify when a list item has been toggled through space',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {tagName: 'A', classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Spacebar', [], target);

           foundation.setSingleSelection(true);
           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([4]);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
         });

      it('should not notify when a list item could not be toggled through ' +
             'space due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {tagName: 'A', classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Spacebar', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           foundation.setSingleSelection(true);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 4, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
         });

      it('should notify when a list item has been toggled through enter',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Enter', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           foundation.setSingleSelection(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([4]);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
         });

      it('should not notify when a list item could not be toggled through ' +
             'enter due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();
           const target = {classList: ['mdc-list-item']};
           const event = createMockKeyboardEvent('Enter', [], target);

           mockAdapter.getListItemCount.and.returnValue(5);
           mockAdapter.getFocusedElementIndex.and.returnValue(/*fakeIndex*/ 4);
           foundation.setSingleSelection(true);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 4, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);

           foundation.layout();
           foundation.handleKeydown(event, true, /*fakeIndex*/ 4);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
         });

      it('should notify when a list item has been toggled through click',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           foundation.setSingleSelection(true);

           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
         });

      it('should notify when a list item has been toggled through click even ' +
             'with `isCheckboxAlreadyUpdatedInAdapter` set to `true`',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           foundation.setSingleSelection(true);

           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ true);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(1);
           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledWith([2]);
         });

      it('should not notify when a list item could not be toggled through ' +
             'click due to it being disabled',
         () => {
           const {foundation, mockAdapter} = setupTest();

           mockAdapter.getListItemCount.and.returnValue(3);
           foundation.setSingleSelection(true);
           mockAdapter.listItemAtIndexHasClass
               .withArgs(/*fakeIndex*/ 2, cssClasses.LIST_ITEM_DISABLED_CLASS)
               .and.returnValue(true);


           foundation.layout();
           foundation.handleClick(
               /*fakeIndex*/ 2, /*isCheckboxAlreadyUpdatedInAdapter*/ false);

           expect(mockAdapter.notifySelectionChange).toHaveBeenCalledTimes(0);
         });
    });
  });

  describe('typeahead', () => {
    it('#layout initializes typeahead state when typeahead enabled', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      // State is synchronized when typeahead is first turned on, but in this
      // test we only care about re-initialization.
      mockAdapter.getPrimaryTextAtIndex.calls.reset();
      foundation.layout();

      expect(mockAdapter.getPrimaryTextAtIndex).toHaveBeenCalled();
    });

    it('slow typing when root focused jumps to first matching item', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(true);
      const event = createMockKeyboardEvent('B');

      foundation.handleKeydown(event, false, -1);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
    });

    it('does not activate when ctrl/meta key is pressed', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(true);
      const ctrlEvent = createMockKeyboardEvent('B', ['Control']);
      const metaEvent = createMockKeyboardEvent('B', ['Meta']);

      foundation.handleKeydown(ctrlEvent, false, -1);
      foundation.handleKeydown(metaEvent, false, -1);
      expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalledWith(0);
    });

    it('slow typing when first item focused yields correct focus jump order',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();

         mockAdapter.isRootFocused.and.returnValue(false);
         const event = createMockKeyboardEvent('B', [], {tagName: 'span'});
         // start with focus on first item
         (foundation as any).focusedItemIndex = 0;

         foundation.handleKeydown(event, true, 0);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         foundation.handleKeydown(event, true, 2);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(3);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         foundation.handleKeydown(event, true, 3);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(4);

         // wrap around
         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         foundation.handleKeydown(event, true, 4);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       });

    it('slow typing when middle item focused yields correct focus jump order',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();

         mockAdapter.isRootFocused.and.returnValue(false);
         const event = createMockKeyboardEvent('B', [], {tagName: 'span'});
         (foundation as any).focusedItemIndex = 3;

         foundation.handleKeydown(event, true, 3);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(4);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         foundation.handleKeydown(event, true, 4);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         foundation.handleKeydown(event, true, 0);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       });

    it('slow typing with focus changing between keypresses does not' +
           ' interfere with typeahead state',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();

         mockAdapter.isRootFocused.and.returnValue(false);
         const event = createMockKeyboardEvent('B', [], {tagName: 'span'});
         (foundation as any).focusedItemIndex = 0;

         foundation.handleKeydown(event, true, 0);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);

         (foundation as any).focusedItemIndex = 5;

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         foundation.handleKeydown(event, true, 5);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       });

    it('slow typing with different keys yields correct focus jump order',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();

         mockAdapter.isRootFocused.and.returnValue(false);
         const event = createMockKeyboardEvent('B', [], {tagName: 'span'});
         // start with focus on first item
         (foundation as any).focusedItemIndex = 0;

         foundation.handleKeydown(event, true, 0);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         (event as any).key = 'A';
         foundation.handleKeydown(event, true, 2);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(6);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         (event as any).key = 'T';
         foundation.handleKeydown(event, true, 2);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(6);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         (event as any).key = 'Z';
         foundation.handleKeydown(event, true, 6);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(1);
       });

    it('fast typing yields correct focus jump order', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(false);
      const event = createMockKeyboardEvent('B', [], {tagName: 'span'});
      (foundation as any).focusedItemIndex = 0;

      foundation.handleKeydown(event, true, 0);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);

      (event as any).key = 'A';
      foundation.handleKeydown(event, true, 2);
      expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalledWith(3);

      (event as any).key = 'B';
      foundation.handleKeydown(event, true, 2);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(4);
    });

    it('fast typing with spaces in text yields correct focus jump order',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();

         mockAdapter.isRootFocused.and.returnValue(false);
         const event = createMockKeyboardEvent('Z', [], {tagName: 'span'});
         (foundation as any).focusedItemIndex = 0;

         foundation.handleKeydown(event, true, 0);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(1);

         (event as any).key = 'Spacebar';
         foundation.handleKeydown(event, true, 1);
         expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalledWith(5);

         (event as any).key = 'A';
         foundation.handleKeydown(event, true, 1);
         expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalledWith(5);

         (event as any).key = 'C';
         foundation.handleKeydown(event, true, 1);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(5);
       });


    it('slow, then fast typing yields correct focus jump order', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(false);
      const event = createMockKeyboardEvent('A', [], {tagName: 'span'});
      // start with focus on first item
      (foundation as any).focusedItemIndex = 0;

      foundation.handleKeydown(event, true, 0);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(6);

      jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);

      (event as any).key = 'B';
      foundation.handleKeydown(event, true, 6);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);

      (event as any).key = 'A';
      foundation.handleKeydown(event, true, 0);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
    });

    it('no matches cause focus to stay put', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(false);
      const event = createMockKeyboardEvent('M', [], {tagName: 'span'});
      // start with focus on first item
      (foundation as any).focusedItemIndex = 0;

      foundation.handleKeydown(event, true, 0);
      jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);

      (event as any).key = 'I';
      foundation.handleKeydown(event, true, 0);

      (event as any).key = 'O';
      foundation.handleKeydown(event, true, 0);

      expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalled();
    });

    it('ignores disabled items properly', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(false);
      const event = createMockKeyboardEvent('Z', [], {tagName: 'span'});
      // start with focus on first item
      (foundation as any).focusedItemIndex = 0;

      mockAdapter.listItemAtIndexHasClass
          .withArgs(1, cssClasses.LIST_ITEM_DISABLED_CLASS)
          .and.returnValue(true);

      foundation.handleKeydown(event, true, 0);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(5);
      jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);

      mockAdapter.listItemAtIndexHasClass
          .withArgs(1, cssClasses.LIST_ITEM_DISABLED_CLASS)
          .and.returnValue(false);
      foundation.handleKeydown(event, true, 0);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(1);
    });

    it('programmatic typeahead invocation returns correct matching items',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();
         expect(foundation.typeaheadMatchItem('b', 2, true)).toEqual(3);
         expect(foundation.typeaheadMatchItem('a', 3, true)).toEqual(3);
         expect(foundation.typeaheadMatchItem('b', 3, true)).toEqual(4);
         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);

         expect(foundation.typeaheadMatchItem('z', 2, true)).toEqual(5);
         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         expect(foundation.typeaheadMatchItem('z', 5, true)).toEqual(1);

         expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalled();
       });
  });
});
