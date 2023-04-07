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

import {cssClasses as listCssClasses} from '../../mdc-list/constants';
import {MDCListFoundation} from '../../mdc-list/foundation';
import {numbers} from '../../mdc-menu-surface/constants';
import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {cssClasses, DefaultFocusState, numbers as menuNumbers, strings} from '../constants';
import {MDCMenuFoundation} from '../foundation';

function setupTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCMenuFoundation);
  return {foundation, mockAdapter};
}

const listClasses = MDCListFoundation.cssClasses;

describe('MDCMenuFoundation', () => {
  setUpMdcTestEnvironment();

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCMenuFoundation, [
      'addClassToElementAtIndex',
      'removeClassFromElementAtIndex',
      'addAttributeToElementAtIndex',
      'removeAttributeFromElementAtIndex',
      'getAttributeFromElementAtIndex',
      'elementContainsClass',
      'closeSurface',
      'getElementIndex',
      'getSelectedSiblingOfItemAtIndex',
      'isSelectableItemAtIndex',
      'notifySelected',
      'getMenuItemCount',
      'focusItemAtIndex',
      'focusListRoot',
    ]);
  });

  it('exports strings', () => {
    expect(MDCMenuFoundation.strings).toEqual(strings);
  });

  it('exports cssClasses', () => {
    expect(MDCMenuFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports numbers', () => {
    expect(MDCMenuFoundation.numbers).toEqual(menuNumbers);
  });

  it('destroy does not throw error', () => {
    const {foundation} = setupTest();
    expect(() => foundation.destroy).not.toThrow();
  });

  it('destroy does not throw error if destroyed immediately after keydown',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = {
         key: 'Space',
         target: 'My Element',
         preventDefault: jasmine.createSpy('preventDefault')
       } as unknown as KeyboardEvent;
       mockAdapter.elementContainsClass
           .withArgs(event.target, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.getElementIndex.withArgs(event.target).and.returnValue(0);
       foundation.handleKeydown(event);

       expect(() => {
         foundation.destroy();
       }).not.toThrow();
     });

  it('destroy closes surface', () => {
    const {foundation, mockAdapter} = setupTest();

    expect(() => {
      foundation.destroy();
    }).not.toThrow();
    expect(mockAdapter.closeSurface).toHaveBeenCalledTimes(1);
  });

  it('handleKeydown does nothing if key is not space, enter, or tab', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = {key: 'N'} as KeyboardEvent;

    foundation.handleKeydown(event);
    expect(mockAdapter.closeSurface).not.toHaveBeenCalled();
    expect(mockAdapter.elementContainsClass)
        .not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('handleKeydown tab key causes the menu to close', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = {key: 'Tab'} as KeyboardEvent;

    foundation.handleKeydown(event);
    expect(mockAdapter.closeSurface)
        .toHaveBeenCalledWith(/** skipRestoreFocus */ true);
    expect(mockAdapter.closeSurface).toHaveBeenCalledTimes(1);
    expect(mockAdapter.elementContainsClass)
        .not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('handleItemAction item action closes the menu', () => {
    const {foundation, mockAdapter} = setupTest();
    const itemEl = document.createElement('li');

    mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);

    foundation.handleItemAction(itemEl);
    expect(mockAdapter.closeSurface).toHaveBeenCalledTimes(1);
  });

  it('handleItemAction item action emits selected event', () => {
    const {foundation, mockAdapter} = setupTest();
    const itemEl = document.createElement('li');

    mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);

    foundation.handleItemAction(itemEl);
    expect(mockAdapter.notifySelected).toHaveBeenCalledWith({index: 0});
    expect(mockAdapter.notifySelected).toHaveBeenCalledTimes(1);
  });

  it('handleKeydown space/enter key inside an input does not prevent default on the event',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = {
         key: 'Space',
         target: {tagName: 'input'},
         preventDefault: jasmine.createSpy('preventDefault')
       } as unknown as KeyboardEvent;
       mockAdapter.elementContainsClass
           .withArgs(event.target, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.getElementIndex.withArgs(event.target).and.returnValue(0);

       foundation.handleKeydown(event);
       (event as any).key = 'Enter';
       foundation.handleKeydown(event);

       expect(event.preventDefault).not.toHaveBeenCalled();
     });

  it('handleItemAction item action event inside of a selection group ' +
         'with additional markup does not cause loop',
     () => {
       // This test will timeout of there is an endless loop in the selection
       // group logic.
       const {foundation, mockAdapter} = setupTest();
       const itemEl = document.createElement('li');
       mockAdapter.elementContainsClass
           .withArgs(itemEl, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.elementContainsClass
           .withArgs(jasmine.anything(), listClasses.ROOT)
           .and.returnValue(false);
       mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);
       mockAdapter.elementContainsClass
           .withArgs(jasmine.anything(), cssClasses.MENU_SELECTION_GROUP)
           .and.returnValue(false);

       foundation.handleItemAction(itemEl);
       jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);

       expect(mockAdapter.closeSurface).toHaveBeenCalledTimes(1);
     });

  it('handleItemAction item action event inside of a selection group with another element selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const itemEl = document.createElement('li');
       mockAdapter.elementContainsClass
           .withArgs(itemEl, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);
       mockAdapter.elementContainsClass
           .withArgs(itemEl, cssClasses.MENU_SELECTION_GROUP)
           .and.returnValue(true);
       mockAdapter.isSelectableItemAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getSelectedSiblingOfItemAtIndex.withArgs(0).and.returnValue(
           1);
       mockAdapter.getMenuItemCount.and.returnValue(5);

       foundation.handleItemAction(itemEl);
       jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);

       expect(mockAdapter.removeClassFromElementAtIndex)
           .toHaveBeenCalledWith(1, cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.removeClassFromElementAtIndex)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.addClassToElementAtIndex)
           .toHaveBeenCalledWith(0, cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.addClassToElementAtIndex).toHaveBeenCalledTimes(1);
     });

  it('handleItemAction item action event inside of a selection group with no element selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const itemEl = document.createElement('li');
       mockAdapter.elementContainsClass
           .withArgs(itemEl, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);
       mockAdapter.elementContainsClass
           .withArgs(itemEl, cssClasses.MENU_SELECTION_GROUP)
           .and.returnValue(true);
       mockAdapter.isSelectableItemAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getSelectedSiblingOfItemAtIndex.withArgs(0).and.returnValue(
           -1);
       mockAdapter.getMenuItemCount.and.returnValue(5);

       foundation.handleItemAction(itemEl);
       jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);

       expect(mockAdapter.removeClassFromElementAtIndex)
           .not.toHaveBeenCalledWith(
               jasmine.any(Number), cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.addClassToElementAtIndex)
           .toHaveBeenCalledWith(0, cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.addClassToElementAtIndex).toHaveBeenCalledTimes(1);
     });

  it('handleItemAction item action event inside of a child element of a list item in a selection group with no ' +
         'element selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const itemEl = document.createElement('li');
       mockAdapter.elementContainsClass
           .withArgs(itemEl, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);
       mockAdapter.elementContainsClass
           .withArgs(itemEl, cssClasses.MENU_SELECTION_GROUP)
           .and.returnValues(false, true);
       mockAdapter.isSelectableItemAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getMenuItemCount.and.returnValue(5);

       foundation.handleItemAction(itemEl);
       jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);

       expect(mockAdapter.removeClassFromElementAtIndex)
           .not.toHaveBeenCalledWith(
               jasmine.any(Number), cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.addClassToElementAtIndex)
           .toHaveBeenCalledWith(0, cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.addClassToElementAtIndex).toHaveBeenCalledTimes(1);
     });

  it('handleItemAction item action event inside of a child element of a selection group (but not a list item) with ' +
         'no element selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const itemEl = document.createElement('li');
       mockAdapter.elementContainsClass
           .withArgs(itemEl, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);
       mockAdapter.elementContainsClass
           .withArgs(itemEl, cssClasses.MENU_SELECTION_GROUP)
           .and.returnValue(false);
       mockAdapter.elementContainsClass.withArgs(itemEl, listClasses.ROOT)
           .and.returnValues(false, true);
       mockAdapter.isSelectableItemAtIndex.withArgs(0).and.returnValue(false);
       mockAdapter.getMenuItemCount.and.returnValue(5);

       foundation.handleItemAction(itemEl);
       jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);

       expect(mockAdapter.removeClassFromElementAtIndex)
           .not.toHaveBeenCalledWith(
               jasmine.any(Number), cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.addClassToElementAtIndex)
           .not.toHaveBeenCalledWith(
               jasmine.any(Number), cssClasses.MENU_SELECTED_LIST_ITEM);
     });

  it('handleItemAction adds class to the correct child element of a selection group when menu has mutated',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const itemEl = document.createElement('li');
       mockAdapter.elementContainsClass
           .withArgs(itemEl, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(1);
       mockAdapter.elementContainsClass
           .withArgs(itemEl, cssClasses.MENU_SELECTION_GROUP)
           .and.returnValue(true);

       mockAdapter.isSelectableItemAtIndex.withArgs(1).and.returnValue(true);
       mockAdapter.getSelectedSiblingOfItemAtIndex.withArgs(1).and.returnValue(
           -1);
       mockAdapter.getMenuItemCount.and.returnValue(2);

       foundation.handleItemAction(itemEl);

       // Element at index 1 is now at index 0
       mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);
       mockAdapter.isSelectableItemAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.getSelectedSiblingOfItemAtIndex.withArgs(0).and.returnValue(
           -1);
       mockAdapter.getMenuItemCount.and.returnValue(1);

       jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);

       expect(mockAdapter.addClassToElementAtIndex)
           .toHaveBeenCalledWith(0, cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.addClassToElementAtIndex).toHaveBeenCalledTimes(1);
     });

  it('handleMenuSurfaceOpened menu focuses the list root element by default on menu surface opened',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleMenuSurfaceOpened();
       expect(mockAdapter.focusListRoot).toHaveBeenCalledTimes(1);
     });

  it('handleMenuSurfaceOpened menu focuses the first menu item when DefaultFocusState is set to FIRST_ITEM on menu ' +
         'surface opened',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setDefaultFocusState(DefaultFocusState.FIRST_ITEM);
       foundation.handleMenuSurfaceOpened();
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
     });

  it('handleMenuSurfaceOpened focuses the list root element when DefaultFocusState is set to LIST_ROOT',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setDefaultFocusState(DefaultFocusState.LIST_ROOT);
       foundation.handleMenuSurfaceOpened();
       expect(mockAdapter.focusListRoot).toHaveBeenCalledTimes(1);
     });

  it('handleMenuSurfaceOpened focuses the last item when DefaultFocusState is set to LAST_ITEM',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getMenuItemCount.and.returnValue(5);
       foundation.setDefaultFocusState(DefaultFocusState.LAST_ITEM);
       foundation.handleMenuSurfaceOpened();
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledWith(4);
       expect(mockAdapter.focusItemAtIndex).toHaveBeenCalledTimes(1);
     });

  it('handleMenuSurfaceOpened does not focus anything when DefaultFocusState is set to NONE',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setDefaultFocusState(DefaultFocusState.NONE);
       foundation.handleMenuSurfaceOpened();
       expect(mockAdapter.focusItemAtIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.focusListRoot).not.toHaveBeenCalled();
     });

  it('#getSelectedIndex returns correct index', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isSelectableItemAtIndex.withArgs(1).and.returnValue(true);
    const listItemEl = document.createElement('div');
    mockAdapter.elementContainsClass
        .withArgs(listItemEl, cssClasses.MENU_SELECTION_GROUP)
        .and.returnValue(true);
    mockAdapter.getSelectedSiblingOfItemAtIndex.withArgs(1).and.returnValue(-1);
    mockAdapter.getMenuItemCount.and.returnValue(2);

    expect(foundation.getSelectedIndex()).not.toBe(1);
    foundation.setSelectedIndex(1);
    expect(foundation.getSelectedIndex()).toBe(1);
  });

  it('setSelectedIndex calls addClass and addAttribute only', () => {
    const {foundation, mockAdapter} = setupTest();
    const listItemEl = document.createElement('div');
    mockAdapter.isSelectableItemAtIndex.withArgs(0).and.returnValue(true);
    mockAdapter.elementContainsClass
        .withArgs(listItemEl, cssClasses.MENU_SELECTION_GROUP)
        .and.returnValue(true);
    mockAdapter.getSelectedSiblingOfItemAtIndex.withArgs(0).and.returnValue(-1);
    mockAdapter.getMenuItemCount.and.returnValue(2);

    foundation.setSelectedIndex(0);
    expect(mockAdapter.removeClassFromElementAtIndex)
        .not.toHaveBeenCalledWith(
            jasmine.any(Number), cssClasses.MENU_SELECTED_LIST_ITEM);
    expect(mockAdapter.removeAttributeFromElementAtIndex)
        .not.toHaveBeenCalledWith(strings.ARIA_CHECKED_ATTR);
    expect(mockAdapter.addClassToElementAtIndex)
        .toHaveBeenCalledWith(0, cssClasses.MENU_SELECTED_LIST_ITEM);
    expect(mockAdapter.addAttributeToElementAtIndex)
        .toHaveBeenCalledWith(0, strings.ARIA_CHECKED_ATTR, 'true');
    expect(mockAdapter.addAttributeToElementAtIndex).toHaveBeenCalledTimes(1);
  });

  it('setSelectedIndex remove class and attribute, and adds class and attribute to newly selected item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const listItemEl = document.createElement('div');
       mockAdapter.isSelectableItemAtIndex.withArgs(0).and.returnValue(true);
       mockAdapter.elementContainsClass
           .withArgs(listItemEl, cssClasses.MENU_SELECTION_GROUP)
           .and.returnValue(true);
       mockAdapter.getMenuItemCount.and.returnValue(2);
       mockAdapter.getSelectedSiblingOfItemAtIndex.withArgs(0).and.returnValue(
           1);

       foundation.setSelectedIndex(0);
       expect(mockAdapter.removeClassFromElementAtIndex)
           .toHaveBeenCalledWith(1, cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.removeClassFromElementAtIndex)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.removeAttributeFromElementAtIndex)
           .toHaveBeenCalledWith(1, strings.ARIA_CHECKED_ATTR);
       expect(mockAdapter.removeAttributeFromElementAtIndex)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.addClassToElementAtIndex)
           .toHaveBeenCalledWith(0, cssClasses.MENU_SELECTED_LIST_ITEM);
       expect(mockAdapter.addClassToElementAtIndex).toHaveBeenCalledTimes(1);
       expect(mockAdapter.addAttributeToElementAtIndex)
           .toHaveBeenCalledWith(0, strings.ARIA_CHECKED_ATTR, 'true');
       expect(mockAdapter.addAttributeToElementAtIndex)
           .toHaveBeenCalledTimes(1);
     });

  it('setSelectedIndex throws error if index is not in range', () => {
    const {foundation} = setupTest();
    try {
      foundation.setSelectedIndex(5);
    } catch (e: any) {
      expect(e.message).toEqual(
          'MDCMenuFoundation: No list item at specified index.');
    }
  });

  it('setEnabled calls addClass and addAttribute', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getMenuItemCount.and.returnValue(2);

    foundation.setEnabled(0, false);
    expect(mockAdapter.addClassToElementAtIndex)
        .toHaveBeenCalledWith(0, listCssClasses.LIST_ITEM_DISABLED_CLASS);
    expect(mockAdapter.addClassToElementAtIndex).toHaveBeenCalledTimes(1);
    expect(mockAdapter.addAttributeToElementAtIndex)
        .toHaveBeenCalledWith(0, strings.ARIA_DISABLED_ATTR, 'true');
    expect(mockAdapter.addAttributeToElementAtIndex).toHaveBeenCalledTimes(1);
  });

  it('setEnabled calls removeClass and removeAttribute', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getMenuItemCount.and.returnValue(2);

    foundation.setEnabled(0, true);
    expect(mockAdapter.removeClassFromElementAtIndex)
        .toHaveBeenCalledWith(0, listCssClasses.LIST_ITEM_DISABLED_CLASS);
    expect(mockAdapter.removeClassFromElementAtIndex).toHaveBeenCalledTimes(1);
    expect(mockAdapter.addAttributeToElementAtIndex)
        .toHaveBeenCalledWith(0, strings.ARIA_DISABLED_ATTR, 'false');
    expect(mockAdapter.addAttributeToElementAtIndex).toHaveBeenCalledTimes(1);
  });

  // Item Action

  it('Item action event causes the menu to close', () => {
    const {foundation, mockAdapter} = setupTest();
    const itemEl = document.createElement('li');
    mockAdapter.elementContainsClass
        .withArgs(itemEl, listClasses.LIST_ITEM_CLASS)
        .and.returnValue(true);
    mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);

    foundation.handleItemAction(itemEl);

    expect(mockAdapter.closeSurface).toHaveBeenCalledTimes(1);
    expect(mockAdapter.closeSurface).toHaveBeenCalledWith(false);
  });

  it('closes the menu (with indication to not restore focus) on item action based on DOM attribute',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const itemEl = document.createElement('li');
       mockAdapter.elementContainsClass
           .withArgs(itemEl, listClasses.LIST_ITEM_CLASS)
           .and.returnValue(true);
       mockAdapter.getElementIndex.withArgs(itemEl).and.returnValue(0);
       mockAdapter.getAttributeFromElementAtIndex
           .withArgs(0, strings.SKIP_RESTORE_FOCUS)
           .and.returnValue('true');

       foundation.handleItemAction(itemEl);

       expect(mockAdapter.closeSurface).toHaveBeenCalledTimes(1);
       expect(mockAdapter.closeSurface).toHaveBeenCalledWith(true);
     });
});
