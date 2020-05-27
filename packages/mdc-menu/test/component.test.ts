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

import {MDCListFoundation} from '../../mdc-list/index';
import {Corner} from '../../mdc-menu-surface/constants';
import {MDCMenuSurfaceFoundation} from '../../mdc-menu-surface/foundation';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {DefaultFocusState} from '../constants';
import {MDCMenu, MDCMenuFoundation} from '../index';

function getFixture(open = false) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="mdc-menu mdc-menu-surface ${
      open ? 'mdc-menu-surface--open' : ''}">
      <ul class="mdc-list" role="menu" tabIndex="-1">
        <li tabIndex="-1" class="mdc-list-item" role="menuitem">Item</a>
        <li role="separator"></li>
        <li tabIndex="-1" class="mdc-list-item" role="menuitem">Another Item</a>
        <li>
          <ul class="mdc-menu__selection-group" role="menu">
            <li tabIndex="-1" class="mdc-list-item" role="menuitem">Item</a>
            <li tabIndex="-1" class="mdc-list-item mdc-menu-item--selected" role="menuitem">Another Item</a>
          </ul>
        </li>
      </ul>
    </div>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function getFixtureWithMultipleSelectionGroups(open = false) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="mdc-menu mdc-menu-surface ${
      open ? 'mdc-menu-surface--open' : ''}">
      <ul class="mdc-list" role="menu" tabIndex="-1">
        <li tabIndex="-1" class="mdc-list-item" role="menuitem">Item</a>
        <li class="mdc-list-divider" role="separator"></li>
        <li tabIndex="-1" class="mdc-list-item" role="menuitem">Another Item</a>
        <li>
          <ul class="mdc-menu__selection-group" role="menu">
            <li tabIndex="-1" class="mdc-list-item" role="menuitem">Item</a>
            <li tabIndex="-1" class="mdc-list-item mdc-menu-item--selected" role="menuitem">Another Item</a>
          </ul>
        </li>
        <li class="mdc-list-divider" role="separator"></li>
        <li>
          <ul class="mdc-menu__selection-group" role="menu">
            <li tabIndex="-1" class="mdc-list-item mdc-menu-item--selected" role="menuitem">Item2</a>
            <li tabIndex="-1" class="mdc-list-item" role="menuitem">Another Item2</a>
          </ul>
        </li>
      </ul>
    </div>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

class FakeList {
  destroy: Function = jasmine.createSpy('.destroy');
  itemsContainer: Function = jasmine.createSpy('.root_');
  layout: Function = jasmine.createSpy('layout');
  wrapFocus: boolean = true;
  listElements: HTMLElement[];

  constructor(root: HTMLElement) {
    this.listElements = [].slice.call(root.querySelectorAll('.mdc-list-item'))
  }
}

class FakeMenuSurface {
  destroy: Function = jasmine.createSpy('.destroy');
  isOpen: Function = jasmine.createSpy('.isOpen');
  open: Function = jasmine.createSpy('.open');
  close: Function = jasmine.createSpy('.close');
  listen: Function = jasmine.createSpy('');
  unlisten: Function = jasmine.createSpy('');
  setAnchorCorner: Function = jasmine.createSpy('.setAnchorCorner');
  setAnchorMargin: Function = jasmine.createSpy('.setAnchorMargin');
  quickOpen: boolean = false;
  setFixedPosition: Function = jasmine.createSpy('.setFixedPosition');
  setAbsolutePosition: Function = jasmine.createSpy('.setAbsolutePosition');
  setIsHoisted: Function = jasmine.createSpy('.setIsHoisted');
  anchorElement: HTMLElement|null = null;
}

function setupTestWithFakes(open = false) {
  const root = getFixture(open);

  const menuSurface = new FakeMenuSurface();
  const mockFoundation = createMockFoundation(MDCMenuFoundation);

  const list = new FakeList(root.querySelector('.mdc-list') as HTMLElement);
  const component =
      new MDCMenu(root, mockFoundation, () => menuSurface, () => list);
  return {root, component, menuSurface, list, mockFoundation};
}

function setupTest(open = false, fixture = getFixture) {
  const root = fixture(open);

  const component = new MDCMenu(root);
  return {root, component};
}

function setupTestWithMock(options: {open?: boolean, fixture: Function} = {
  open: true,
  fixture: getFixture
}) {
  const root = options.fixture(options.open);

  const mockFoundation = createMockFoundation(MDCMenuFoundation);
  const component = new MDCMenu(root, mockFoundation);
  return {root, component, mockFoundation};
}

describe('MDCMenu', () => {
  it('destroy causes the menu-surface and list to be destroyed', () => {
    const {component, list, menuSurface} = setupTestWithFakes();
    component.destroy();
    expect(list.destroy).toHaveBeenCalled();
    expect(menuSurface.destroy).toHaveBeenCalled();
    expect(menuSurface.unlisten).toHaveBeenCalled();
  });

  it('destroy does not throw an error if the list is not instantiated', () => {
    const fixture = getFixture();
    const list = fixture.querySelector('.mdc-list') as HTMLElement;
    (list.parentElement as HTMLElement).removeChild(list);
    const component = new MDCMenu(fixture);

    expect(() => {
      component.destroy.bind(component);
    }).not.toThrow();
  });

  it('attachTo initializes and returns a MDCMenu instance', () => {
    expect(MDCMenu.attachTo(getFixture()) instanceof MDCMenu).toBe(true);
  });

  it('initialize registers event listener for list item action', () => {
    const {mockFoundation, root} = setupTestWithFakes();
    emitEvent(
        root, MDCListFoundation.strings.ACTION_EVENT, {detail: {index: 0}});
    expect(mockFoundation.handleItemAction)
        .toHaveBeenCalledWith(jasmine.any(Element));
    expect(mockFoundation.handleItemAction).toHaveBeenCalledTimes(1);
  });

  it('initialize registers event listener for keydown', () => {
    const {mockFoundation, root} = setupTestWithFakes();
    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeydown)
        .toHaveBeenCalledWith(jasmine.any(Event));
    expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
  });

  it('destroy deregisters event listener for click', () => {
    const {component, mockFoundation, root} = setupTestWithFakes();
    component.destroy();

    emitEvent(
        root, MDCListFoundation.strings.ACTION_EVENT, {detail: {index: 0}});
    expect(mockFoundation.handleItemAction)
        .not.toHaveBeenCalledWith(jasmine.any(Element));
  });

  it('destroy deregisters event listener for keydown', () => {
    const {component, mockFoundation, root} = setupTestWithFakes();
    component.destroy();

    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeydown)
        .not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('get/set open', () => {
    const {component, menuSurface} = setupTestWithFakes();

    (menuSurface as any).isOpen.and.returnValue(false);
    expect(component.open).toBe(false);

    component.open = true;
    expect(menuSurface.open).toHaveBeenCalledTimes(1);

    component.open = false;
    expect(menuSurface.close).toHaveBeenCalledTimes(1);
  });

  it('wrapFocus proxies to MDCList#wrapFocus property', () => {
    const {component, list} = setupTestWithFakes();

    expect(component.wrapFocus).toBe(true);

    component.wrapFocus = false;
    expect(list.wrapFocus).toBe(false);
  });

  it('layout proxies to MDCList#layout method', () => {
    const {component, list} = setupTestWithFakes();

    component.layout();
    expect(list.layout).toHaveBeenCalled();
  });

  it('setAnchorCorner proxies to the MDCMenuSurface#setAnchorCorner method',
     () => {
       const {component, menuSurface} = setupTestWithFakes();
       component.setAnchorCorner(Corner.TOP_START);
       expect(menuSurface.setAnchorCorner)
           .toHaveBeenCalledWith(Corner.TOP_START);
     });

  it('setAnchorMargin', () => {
    const {component, menuSurface} = setupTestWithFakes();
    component.setAnchorMargin({top: 0, right: 0, bottom: 0, left: 0});
    expect(menuSurface.setAnchorMargin)
        .toHaveBeenCalledWith({top: 0, right: 0, bottom: 0, left: 0});
  });

  it('setSelectedIndex calls foundation method setSelectedIndex with given index.',
     () => {
       const {component, mockFoundation} =
           setupTestWithMock({fixture: getFixtureWithMultipleSelectionGroups});
       component.setSelectedIndex(1);
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledWith(1);
     });

  it('setEnabled calls foundation method setEnabled with given index and disabled state.',
     () => {
       const {component, mockFoundation} =
           setupTestWithMock({fixture: getFixtureWithMultipleSelectionGroups});
       component.setEnabled(1, true);
       expect(mockFoundation.setEnabled).toHaveBeenCalledWith(1, true);
     });

  it('setQuickOpen', () => {
    const {component, menuSurface} = setupTestWithFakes();
    component.quickOpen = true;
    expect(menuSurface.quickOpen).toBe(true);
  });

  it('items returns all menu items', () => {
    const {root, component, list} = setupTestWithFakes();
    const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
    list.listElements = items;
    expect(component.items).toEqual(items);
  });

  it('items returns nothing if list is not defined', () => {
    const {root, component, list} = setupTestWithFakes();
    const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
    list.listElements = items;
    expect(component.items).toEqual(items);
  });

  it('getOptionByIndex', () => {
    const {root, component, list} = setupTestWithFakes();
    const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
    list.listElements = items;
    expect(component.getOptionByIndex(0)).toEqual(items[0]);
  });

  it('getOptionByIndex returns null if index is > list length', () => {
    const {root, component, list} = setupTestWithFakes();
    const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
    list.listElements = items;
    expect(component.getOptionByIndex(items.length)).toBe(null);
  });

  it('setFixedPosition', () => {
    const {component, menuSurface} = setupTestWithFakes();
    component.setFixedPosition(true);
    expect(menuSurface.setFixedPosition).toHaveBeenCalledWith(true);

    component.setFixedPosition(false);
    expect(menuSurface.setFixedPosition).toHaveBeenCalledWith(false);
  });

  it('setIsHoisted', () => {
    const {component, menuSurface} = setupTestWithFakes();
    component.setIsHoisted(true);
    expect(menuSurface.setIsHoisted).toHaveBeenCalledWith(true);

    component.setIsHoisted(false);
    expect(menuSurface.setIsHoisted).toHaveBeenCalledWith(false);
  });

  it('setAnchorElement', () => {
    const {component, menuSurface} = setupTestWithFakes();
    const button = document.createElement('button');
    component.setAnchorElement(button);
    expect(menuSurface.anchorElement).toEqual(button);
  });

  it('setAbsolutePosition', () => {
    const {component, menuSurface} = setupTestWithFakes();
    component.setAbsolutePosition(100, 120);
    expect(menuSurface.setAbsolutePosition).toHaveBeenCalledWith(100, 120);
  });

  it('menu surface opened event causes list root element to be focused', () => {
    const {root} = setupTest();
    document.body.appendChild(root);
    const event = document.createEvent('Event');
    event.initEvent(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, false, true);
    root.dispatchEvent(event);

    expect((document.activeElement as HTMLElement)
               .classList.contains(MDCListFoundation.cssClasses.ROOT))
        .toBe(true);
    document.body.removeChild(root);
  });

  it('handleMenuSurfaceOpened calls foundation\'s handleMenuSurfaceOpened method on menu surface opened event',
     () => {
       const {root, mockFoundation} = setupTestWithMock();
       emitEvent(root, MDCMenuSurfaceFoundation.strings.OPENED_EVENT);
       expect(mockFoundation.handleMenuSurfaceOpened).toHaveBeenCalled();
     });

  it('list item enter keydown emits a menu action event', () => {
    const {root, component} = setupTest();
    const fakeEnterKeyEvent = {
      key: 'Enter',
      target: {tagName: 'div'},
      preventDefault: () => undefined
    };

    let detail: any;
    component.listen(
        MDCMenuFoundation.strings.SELECTED_EVENT,
        (evt: any) => detail = evt.detail);

    document.body.appendChild(root);
    (component as any)
        .list_.foundation.handleKeydown(
            fakeEnterKeyEvent, /* isRootListItem */ true,
            /* listItemIndex */ 0);
    document.body.removeChild(root);

    expect(detail).toEqual({index: 0, item: component.items[0]});
  });

  it('open=true does not throw an error if there are no items in the list to focus',
     () => {
       const {component, root, list} = setupTestWithFakes();
       list.listElements = [];
       document.body.appendChild(root);
       root.querySelector('.mdc-list-item');
       expect(() => {
         component.open = true;
       }).not.toThrow();
       document.body.removeChild(root);
     });

  it('#setDefaultFocusState Calls foundation\'s setDefaultFocusState method',
     () => {
       const {component, mockFoundation} = setupTestWithFakes();

       component.setDefaultFocusState(DefaultFocusState.FIRST_ITEM);
       expect(mockFoundation.setDefaultFocusState)
           .toHaveBeenCalledWith(DefaultFocusState.FIRST_ITEM);
     });

  // Adapter method test

  it('adapter#addClassToElementAtIndex adds a class to the element at the index provided',
     () => {
       const {root, component} = setupTest();
       const firstItem = root.querySelector('.mdc-list-item') as HTMLElement;
       (component.getDefaultFoundation() as any)
           .adapter.addClassToElementAtIndex(0, 'foo');
       expect(firstItem.classList.contains('foo')).toBe(true);
     });

  it('adapter#removeClassFromElementAtIndex adds a class to the element at the index provided',
     () => {
       const {root, component} = setupTest();
       const firstItem = root.querySelector('.mdc-list-item') as HTMLElement;
       firstItem.classList.add('foo');
       (component.getDefaultFoundation() as any)
           .adapter.removeClassFromElementAtIndex(0, 'foo');
       expect(firstItem.classList.contains('foo')).toBe(false);
     });

  it('adapter#addAttributeToElementAtIndex adds a class to the element at the index provided',
     () => {
       const {root, component} = setupTest();
       const firstItem = root.querySelector('.mdc-list-item') as HTMLElement;
       (component.getDefaultFoundation() as any)
           .adapter.addAttributeToElementAtIndex(0, 'foo', 'true');
       expect(firstItem.getAttribute('foo') === 'true').toBe(true);
     });

  it('adapter#removeAttributeFromElementAtIndex adds a class to the element at the index provided',
     () => {
       const {root, component} = setupTest();
       const firstItem = root.querySelector('.mdc-list-item') as HTMLElement;
       firstItem.setAttribute('foo', 'true');
       (component.getDefaultFoundation() as any)
           .adapter.removeAttributeFromElementAtIndex(0, 'foo');
       expect(firstItem.getAttribute('foo')).toBe(null);
     });

  it('adapter#elementContainsClass returns true if the class exists on the element',
     () => {
       const {root, component} = setupTest();
       const firstItem = root.querySelector('.mdc-list-item') as HTMLElement;
       firstItem.classList.add('foo');
       const containsFoo = (component.getDefaultFoundation() as any)
                               .adapter.elementContainsClass(firstItem, 'foo');
       expect(containsFoo).toBe(true);
     });

  it('adapter#elementContainsClass returns false if the class does not exist on the element',
     () => {
       const {root, component} = setupTest();
       const firstItem = root.querySelector('.mdc-list-item');
       const containsFoo = (component.getDefaultFoundation() as any)
                               .adapter.elementContainsClass(firstItem, 'foo');
       expect(containsFoo).toBe(false);
     });

  it('adapter#closeSurface proxies to menuSurface#close', () => {
    const {component, menuSurface} = setupTestWithFakes();
    (component.getDefaultFoundation() as any)
        .adapter.closeSurface(/** skipRestoreFocus */ false);
    expect(menuSurface.close)
        .toHaveBeenCalledWith(/** skipRestoreFocus */ false);
  });

  it('adapter#getElementIndex returns the index value of an element in the list',
     () => {
       const {root, component} = setupTest();
       const firstItem = root.querySelector('.mdc-list-item');
       const indexValue = (component.getDefaultFoundation() as any)
                              .adapter.getElementIndex(firstItem);
       expect(indexValue).toEqual(0);
     });

  it('adapter#getElementIndex returns -1 if the element does not exist in the list',
     () => {
       const {component} = setupTest();
       const firstItem = document.createElement('li');
       const indexValue = (component.getDefaultFoundation() as any)
                              .adapter.getElementIndex(firstItem);
       expect(indexValue).toEqual(-1);
     });

  it('adapter#notifySelected emits an event for a selected element', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('eventHandler');
    root.addEventListener(MDCMenuFoundation.strings.SELECTED_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifySelected(0);
    expect(handler).toHaveBeenCalled();
  });

  it('adapter#getMenuItemCount returns the menu item count', () => {
    const {component} = setupTest();
    expect(
        (component.getDefaultFoundation() as any).adapter.getMenuItemCount())
        .toEqual(component.items.length);
  });

  it('adapter#focusItemAtIndex focuses the menu item at given index', () => {
    const {root, component} = setupTest();
    document.body.appendChild(root);

    (component.getDefaultFoundation() as any).adapter.focusItemAtIndex(2);
    expect(document.activeElement).toEqual(component.items[2]);

    document.body.removeChild(root);
  });

  it('adapter#focusListRoot focuses the list root element', () => {
    const {root, component} = setupTest();
    document.body.appendChild(root);

    (component.getDefaultFoundation() as any).adapter.focusListRoot();
    expect(document.activeElement)
        .toEqual(root.querySelector(`.${MDCListFoundation.cssClasses.ROOT}`));

    document.body.removeChild(root);
  });

  it('adapter#isSelectableItemAtIndex returns true if the menu item is within the' +
         '.mdc-menu__selection-group element',
     () => {
       const {component} = setupTest();

       const isSelectableItemAtIndex = (component.getDefaultFoundation() as any)
                                           .adapter.isSelectableItemAtIndex(3);
       expect(isSelectableItemAtIndex).toBe(true);
     });

  it('adapter#isSelectableItemAtIndex returns false if the menu item is not within the' +
         '.mdc-menu__selection-group element',
     () => {
       const {component} = setupTest();

       const isSelectableItemAtIndex = (component.getDefaultFoundation() as any)
                                           .adapter.isSelectableItemAtIndex(1);
       expect(isSelectableItemAtIndex).toBe(false);
     });

  it('adapter#getSelectedSiblingOfItemAtIndex returns the index of the selected item within the same' +
         'selection group',
     () => {
       const {component} = setupTest();

       const siblingIndex = (component.getDefaultFoundation() as any)
                                .adapter.getSelectedSiblingOfItemAtIndex(2);
       expect(siblingIndex).toEqual(3);
     });
});
