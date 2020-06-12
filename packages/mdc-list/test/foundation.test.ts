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
       const target = {classList: ['mdc-list-item']};
       const event = {target};

       foundation.handleFocusIn(event, 1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .toHaveBeenCalledWith(1, '0');
     });

  it('#handleFocusOut switches list item button/a elements to tabindex=-1',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['mdc-list-item']};
       const event = {target};

       foundation.handleFocusOut(event, 1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .toHaveBeenCalledWith(1, '-1');
     });

  it('#handleFocusIn switches list item button/a elements to tabindex=0 when target is child element',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const parentElement = {classList: ['mdc-list-item']};
       const target = {classList: [], parentElement};
       const event = {target};

       foundation.handleFocusIn(event, 1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .toHaveBeenCalledWith(1, '0');
     });

  it('#handleFocusOut switches list item button/a elements to tabindex=-1 when target is child element',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const parentElement = {classList: ['mdc-list-item']};
       const target = {classList: [], parentElement};
       const event = {target};

       foundation.handleFocusOut(event, 1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .toHaveBeenCalledWith(1, '-1');
     });

  it('#handleFocusIn does nothing if mdc-list-item is not on element or ancestor',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['']};
       const event = {target};

       foundation.handleFocusIn(event, -1);

       expect(mockAdapter.setTabIndexForListItemChildren)
           .not.toHaveBeenCalledWith(jasmine.anything(), jasmine.anything());
     });

  it('#handleFocusOut does nothing if mdc-list-item is not on element or ancestor',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {classList: ['']};
       const event = {target};

       foundation.handleFocusOut(event, -1);

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
       const target = {classList: ['']};
       const event = {target};
       foundation.handleFocusOut(event, 3);
       jasmine.clock().tick(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, 'tabindex', '0');
     });

  it('#handleFocusOut sets tabindex=0 to first item when focus leaves single selection list that has no ' +
         'selection',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setSingleSelection(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.isFocusInsideList.and.returnValue(false);

       const target = {classList: ['']};
       const event = {target};
       foundation.handleFocusOut(event, 3);
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
       const target = {classList: ['']};
       const event = {target};
       foundation.handleFocusOut(event, 3);
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
       const target = {classList: ['']};
       const event = {target};

       foundation.handleFocusOut(event, 2);
       jasmine.clock().tick(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(2, 'tabindex', '0');
     });

  it('#handleKeydown does nothing if key received on root element and not used for navigation',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = {key: 'A'};

       mockAdapter.isRootFocused.and.returnValue(true);
       foundation.handleKeydown(event, false, -1);

       expect(mockAdapter.getFocusedElementIndex).not.toHaveBeenCalled();
     });

  it('#handleKeydown should focus on last item when UP arrow key received on list root',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const event = {key: 'ArrowUp', preventDefault};

       mockAdapter.isRootFocused.and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(5);
       foundation.handleKeydown(event, false, -1);

       expect(preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(4);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.getFocusedElementIndex).not.toHaveBeenCalled();
     });

  it('#handleKeydown should focus on first item when DOWN arrow key received on list root',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const event = {key: 'ArrowDown', preventDefault};

       mockAdapter.isRootFocused.and.returnValue(true);
       foundation.handleKeydown(event, false, -1);

       expect(preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.getFocusedElementIndex).not.toHaveBeenCalled();
     });

  it('#handleKeydown does nothing if the key is not used for navigation',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'A', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeydown moves focus to index+1 if the ArrowDown key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowDown', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown moves focus to index-1 if the ArrowUp key is pressed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowUp', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowRight key does nothing if isVertical_ is true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowRight', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeydown ArrowLeft key does nothing if isVertical_ is true', () => {
    const {foundation, mockAdapter} = setupTest();
    const preventDefault = jasmine.createSpy('preventDefault');
    const target = {tagName: 'li'};
    const event = {key: 'ArrowLeft', target, preventDefault};

    mockAdapter.getFocusedElementIndex.and.returnValue(1);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleKeydown(event, true, 1);

    expect(mockAdapter.focusItemAtIndex)
        .not.toHaveBeenCalledWith(jasmine.anything());
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('#handleKeydown ArrowRight key causes the next item to gain focus if isVertical_ is false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowRight', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setVerticalOrientation(false);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowLeft key causes the previous item to gain focus if isVertical_ is false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowLeft', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setVerticalOrientation(false);
       foundation.handleKeydown(event, true, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowDown key causes first item to focus if last item is focused and wrapFocus is true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowDown', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(2);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setWrapFocus(true);
       foundation.handleKeydown(event, true, 2);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowDown key if last item is focused and wrapFocus is false does not focus an item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowDown', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(2);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 2);

       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowUp key causes last item to focus if first item is focused and wrapFocus is true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowUp', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setWrapFocus(true);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown ArrowUp key if first item is focused and wrapFocus is false does not focus an item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {tagName: 'li'};
       const event = {key: 'ArrowUp', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown Home key causes the first item to be focused', () => {
    const {foundation, mockAdapter} = setupTest();
    const preventDefault = jasmine.createSpy('preventDefault');
    const target = {tagName: 'li'};
    const event = {key: 'Home', target, preventDefault};

    mockAdapter.getFocusedElementIndex.and.returnValue(1);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleKeydown(event, true, 1);

    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('#handleKeydown End key causes the last item to be focused', () => {
    const {foundation, mockAdapter} = setupTest();
    const preventDefault = jasmine.createSpy('preventDefault');
    const target = {tagName: 'li'};
    const event = {key: 'End', target, preventDefault};

    mockAdapter.getFocusedElementIndex.and.returnValue(0);
    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleKeydown(event, true, 0);

    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
    expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
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
         const event = {key: 'ArrowUp', target, preventDefault};
         foundation.handleKeydown(event, false, 0);
       });
       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeydown focuses on the bound mdc-list-item even if the event happened on a child element',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const parentElement = {classList: ['mdc-list-item']};
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: [], parentElement};
       const event = {key: 'ArrowUp', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, false, 1);

       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown space key causes preventDefault to be called on keydown event',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Spacebar', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown enter key causes preventDefault to be called on keydown event',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Enter', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown enter key while focused on a sub-element of a list item does not cause preventDefault on the ' +
         'event when singleSelection=true ',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Enter', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, false, 0);

       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeydown space/enter key cause event.preventDefault if a checkbox or radio button is present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Spacebar', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(false);
       foundation.setSingleSelection(false);
       foundation.layout();
       foundation.handleKeydown(event, true, 0);
       event.key = 'Enter';
       foundation.handleKeydown(event, true, 0);

       expect(preventDefault).toHaveBeenCalledTimes(2);
     });

  it('#handleKeydown space key calls notifyAction for anchor element regardless of singleSelection',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {tagName: 'A', classList: ['mdc-list-item']};
       const event = {key: 'Spacebar', target, preventDefault: () => {}};

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
       const event = {key: 'Spacebar', target, preventDefault: () => {}};

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
       const event = {key: 'Enter', target, preventDefault: () => {}};

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
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Enter', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleKeydown(event, true, 0);

       expect(mockAdapter.notifyAction).toHaveBeenCalledWith(0);
       expect(mockAdapter.notifyAction).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown selects the list item when enter key is triggered, singleSelection=true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Enter', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown does not select the list item when' +
         'enter key is triggered, singleSelection=true, #adapter.isListItemDisabled=true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Enter', target, preventDefault};

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
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Spacebar', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);

       expect(preventDefault).toHaveBeenCalledTimes(1);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown space key when singleSelection=true does not select an element is isRootListItem=false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Spacebar', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, false, 0);

       expect(preventDefault).not.toHaveBeenCalled();
       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
     });

  it('#handleKeydown does not select list item when' +
         'space key is triggered, singleSelection=true, #adapter.isListItemDisabled=true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Spacebar', target, preventDefault};

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
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Spacebar', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(0, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 0);
       foundation.handleKeydown(event, true, 0);

       expect(preventDefault).toHaveBeenCalledTimes(2);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown space key is triggered 2x when singleSelection is true on second ' +
         'element updates first element tabindex',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('preventDefault');
       const target = {classList: ['mdc-list-item']};
       const event = {key: 'Spacebar', target, preventDefault};

       mockAdapter.getFocusedElementIndex.and.returnValue(1);
       mockAdapter.getListItemCount.and.returnValue(3);
       mockAdapter.getAttributeForElementIndex.withArgs(1, strings.ARIA_CURRENT)
           .and.returnValue(null);
       foundation.setSingleSelection(true);
       foundation.handleKeydown(event, true, 1);
       foundation.handleKeydown(event, true, 1);

       expect(preventDefault).toHaveBeenCalledTimes(2);
       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(1, strings.ARIA_SELECTED, 'true');
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown bail out early if event origin doesnt have a mdc-list-item ancestor from the current list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       const preventDefault = jasmine.createSpy('preventDefault');
       const event = {key: 'ArrowDown', keyCode: 40, preventDefault};
       foundation.handleKeydown(
           event, /** isRootListItem */ true, /** listItemIndex */ -1);

       expect(preventDefault).not.toHaveBeenCalled();
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
       foundation.handleClick(1, false);

       expect(mockAdapter.addClassForElementIndex)
           .not.toHaveBeenCalledWith(1, cssClasses.LIST_ITEM_SELECTED_CLASS);
       expect(mockAdapter.addClassForElementIndex)
           .not.toHaveBeenCalledWith(1, cssClasses.LIST_ITEM_ACTIVATED_CLASS);
     });

  it('#handleClick notifies of action when clicked on list item.', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.getListItemCount.and.returnValue(3);
    foundation.handleClick(1, false);

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
       foundation.handleClick(1, false);

       expect(mockAdapter.notifyAction).not.toHaveBeenCalled();
     });

  it('#handleClick when singleSelection=true on a list item should cause the list item to be selected',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setSingleSelection(true);
       mockAdapter.getListItemCount.and.returnValue(3);
       foundation.handleClick(1, false);

       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(1, 'tabindex', '0');
     });

  it('#handleClick when singleSelection=true on a button subelement should not cause the list item to be selected',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setSingleSelection(true);
       foundation.handleClick(-1, false);

       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(1, 'tabindex', 0);
     });

  it('#handleClick when singleSelection=true on an element not in a list item should be ignored',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getFocusedElementIndex.and.returnValue(-1);
       foundation.setSingleSelection(true);
       foundation.handleClick(-1, false);

       expect(mockAdapter.setAttributeForElementIndex)
           .not.toHaveBeenCalledWith(1, 'tabindex', 0);
     });

  it('#handleClick when singleSelection=true on the first element when already selected',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getFocusedElementIndex.and.returnValue(0);
       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.setSingleSelection(true);
       foundation.handleClick(0, false);
       foundation.handleClick(0, false);

       expect(mockAdapter.setAttributeForElementIndex)
           .toHaveBeenCalledWith(0, 'tabindex', '0');
       expect(mockAdapter.setAttributeForElementIndex.calls.allArgs()
                  .filter(
                      (args: any) => JSON.stringify(args) ==
                          JSON.stringify([0, 'tabindex', '0']))
                  .length)
           .toEqual(2);
     });

  it('#handleClick when toggleCheckbox=false does not change the checkbox state',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.layout();
       foundation.handleClick(2, false);

       mockAdapter.isCheckboxCheckedAtIndex.withArgs(2).and.returnValue(false);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .not.toHaveBeenCalledWith(2, true);
     });

  it('#handleClick proxies to the adapter#setCheckedCheckboxOrRadioAtIndex if toggleCheckbox is true',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       foundation.layout();
       foundation.handleClick(0, true);

       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(0, true);
     });

  it('#handleClick does not proxy to the adapter#setCheckedCheckboxOrRadioAtIndex' +
         'if toggleCheckbox=true, adapter.isListItemDisabled=true',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasRadioAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.listItemAtIndexHasClass
           .withArgs(0, cssClasses.LIST_ITEM_DISABLED_CLASS)
           .and.returnValue(true);
       foundation.layout();
       foundation.handleClick(0, true);

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
       foundation.handleClick(2, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledTimes(1);

       // Uncheck
       mockAdapter.isCheckboxCheckedAtIndex.withArgs(2).and.returnValue(true);
       foundation.handleClick(2, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .toHaveBeenCalledWith(2, false);
     });

  it('#handleClick bails out if checkbox or radio is not present and if toggleCheckbox is true',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasCheckboxAtIndex.withArgs(1).and.returnValue(false);
       mockAdapter.hasRadioAtIndex.withArgs(1).and.returnValue(false);

       foundation.handleClick(2, true);
       expect(mockAdapter.setCheckedCheckboxOrRadioAtIndex)
           .not.toHaveBeenCalledWith(1, jasmine.anything());
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
       foundation.setSelectedIndex('some_random_input');
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
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
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
       expect(mockAdapter.setAttributeForElementIndex).toHaveBeenCalledTimes(1);
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
    expect(2).toEqual(foundation.getSelectedIndex());
  });

  it('#getSelectedIndex should be in-sync with setter method for multi-select checkbox based list',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getListItemCount.and.returnValue(4);
       mockAdapter.hasCheckboxAtIndex.withArgs(0).and.returnValue(true);
       foundation.layout();

       foundation.setSelectedIndex([0, 2, 3]);
       expect([0, 2, 3]).toEqual(foundation.getSelectedIndex());
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
      const event = {key: 'B', preventDefault: jasmine.createSpy()};

      foundation.handleKeydown(event, false, -1);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
    });

    it('slow typing when first item focused yields correct focus jump order',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();

         mockAdapter.isRootFocused.and.returnValue(false);
         const event = {
           key: 'B',
           preventDefault: jasmine.createSpy(),
           target: {tagName: 'span'}
         };
         // start with focus on first item
         foundation.focusedItemIndex = 0;

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
         const event = {
           key: 'B',
           preventDefault: jasmine.createSpy(),
           target: {tagName: 'span'}
         };
         foundation.focusedItemIndex = 3;

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
         const event = {
           key: 'B',
           preventDefault: jasmine.createSpy(),
           target: {tagName: 'span'}
         };
         foundation.focusedItemIndex = 0;

         foundation.handleKeydown(event, true, 0);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);

         foundation.focusedItemIndex = 5;

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         foundation.handleKeydown(event, true, 5);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       });

    it('slow typing with different keys yields correct focus jump order',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();

         mockAdapter.isRootFocused.and.returnValue(false);
         const event = {
           key: 'B',
           preventDefault: jasmine.createSpy(),
           target: {tagName: 'span'}
         };
         // start with focus on first item
         foundation.focusedItemIndex = 0;

         foundation.handleKeydown(event, true, 0);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         event.key = 'A';
         foundation.handleKeydown(event, true, 2);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(6);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         event.key = 'T';
         foundation.handleKeydown(event, true, 2);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(6);

         jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
         event.key = 'Z';
         foundation.handleKeydown(event, true, 6);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(1);
       });

    it('fast typing yields correct focus jump order', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(false);
      const event = {
        key: 'B',
        preventDefault: jasmine.createSpy(),
        target: {tagName: 'span'}
      };
      foundation.focusedItemIndex = 0;

      foundation.handleKeydown(event, true, 0);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);

      event.key = 'A';
      foundation.handleKeydown(event, true, 2);
      expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalledWith(3);

      event.key = 'B';
      foundation.handleKeydown(event, true, 2);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(4);
    });

    it('fast typing with spaces in text yields correct focus jump order',
       () => {
         const {foundation, mockAdapter} = setupTypeaheadTest();

         mockAdapter.isRootFocused.and.returnValue(false);
         const event = {
           key: 'Z',
           preventDefault: jasmine.createSpy(),
           target: {tagName: 'span'}
         };
         foundation.focusedItemIndex = 0;

         foundation.handleKeydown(event, true, 0);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(1);

         event.key = 'Spacebar';
         foundation.handleKeydown(event, true, 1);
         expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalledWith(5);

         event.key = 'A';
         foundation.handleKeydown(event, true, 1);
         expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalledWith(5);

         event.key = 'C';
         foundation.handleKeydown(event, true, 1);
         expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(5);
       });


    it('slow, then fast typing yields correct focus jump order', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(false);
      const event = {
        key: 'A',
        preventDefault: jasmine.createSpy(),
        target: {tagName: 'span'}
      };
      // start with focus on first item
      foundation.focusedItemIndex = 0;

      foundation.handleKeydown(event, true, 0);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(6);

      jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);

      event.key = 'B';
      foundation.handleKeydown(event, true, 6);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);

      event.key = 'A';
      foundation.handleKeydown(event, true, 0);
      expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(2);
    });

    it('no matches cause focus to stay put', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(false);
      const event = {
        key: 'M',
        preventDefault: jasmine.createSpy(),
        target: {tagName: 'span'}
      };
      // start with focus on first item
      foundation.focusedItemIndex = 0;

      foundation.handleKeydown(event, true, 0);
      jasmine.clock().tick(numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);

      event.key = 'I';
      foundation.handleKeydown(event, true, 0);

      event.key = 'O';
      foundation.handleKeydown(event, true, 0);

      expect(mockAdapter.focusItemAtIndex).not.toHaveBeenCalled();
    });

    it('ignores disabled items properly', () => {
      const {foundation, mockAdapter} = setupTypeaheadTest();

      mockAdapter.isRootFocused.and.returnValue(false);
      const event = {
        key: 'Z',
        preventDefault: jasmine.createSpy(),
        target: {tagName: 'span'}
      };
      // start with focus on first item
      foundation.focusedItemIndex = 0;

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
