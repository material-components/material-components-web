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

import {createMockFoundation} from '../../../testing/helpers/foundation';
import {cssClasses, strings} from '../constants';
import {MDCList, MDCListFoundation} from '../index';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <ul class="mdc-list" tabindex="-1">
      <li class="mdc-list-item" tabindex="0">
        <span class="mdc-list-item__text">Fruit</span>
        <button>one</button>
      </li>
      <li class="mdc-list-item">
        <span class="mdc-list-item__text">Potato</span>
        <a href="http://www.google.com">Link</a>
      </li>
      <li class="mdc-list-item">
        <span class="mdc-list-item__text">Pasta</span>
        <input type="checkbox"/>
      </li>
      <li class="mdc-list-item">
        <span class="mdc-list-item__text">Pizza</span>
        <input type="radio"/>
      </li>
     </ul>
    `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function getFixtureWithDisabledItems() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <ul class="mdc-list" tabindex="-1">
      <li class="mdc-list-item" tabindex="0">
        <span class="mdc-list-item__text">Fruit</span>
        <button>one</button>
      </li>
      <li class="mdc-list-item mdc-list-item--disabled" aria-disabled="true">
        <span class="mdc-list-item__text">Potato</span>
        <a href="http://www.google.com">Link</a>
      </li>
      <li class="mdc-list-item mdc-list-item--disabled" aria-disabled="true">
        <span class="mdc-list-item__text">Pasta</span>
        <input type="checkbox"/>
      </li>
      <li class="mdc-list-item">
        <span class="mdc-list-item__text">Pizza</span>
        <input type="radio"/>
      </li>
     </ul>
    `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function getTwoLineFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
      <ul class="mdc-list mdc-list--two-line">
        <li class="mdc-list-item" tabindex="0">
          <span class="mdc-list-item__text">
            <span class="mdc-list-item__primary-text">Fruit</span>
            <span class="mdc-list-item__secondary-text">Secondary fruit</span>
          </span>
        </li>
        <li class="mdc-list-item" tabindex="0">
          <span class="mdc-list-item__text">
            <span class="mdc-list-item__primary-text">Potato</span>
            <span class="mdc-list-item__secondary-text">Secondary potato</span>
          </span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            <span class="mdc-list-item__primary-text">Pasta</span>
            <span class="mdc-list-item__secondary-text">Secondary pasta</span>
          </span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            <span class="mdc-list-item__primary-text">Pizza</span>
            <span class="mdc-list-item__secondary-text">Secondary pizza</span>
          </span>
        </li>
      </ul>
    `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function setupTest(root = getFixture()) {
  const mockFoundation = createMockFoundation(MDCListFoundation);
  const component = new MDCList(root, mockFoundation);
  return {root, component, mockFoundation};
}

describe('MDCList', () => {
  it('attachTo initializes and returns a MDCList instance', () => {
    expect(MDCList.attachTo(getFixture()) instanceof MDCList).toBe(true);
  });

  it('component calls setVerticalOrientation on the foundation if aria-orientation is not set',
     () => {
       const {mockFoundation} = setupTest();
       expect(mockFoundation.setVerticalOrientation).toHaveBeenCalledWith(true);
       expect(mockFoundation.setVerticalOrientation).toHaveBeenCalledTimes(1);
     });

  it('component calls setVerticalOrientation(false) on the foundation if aria-orientation=horizontal',
     () => {
       const root = getFixture();
       root.setAttribute('aria-orientation', 'horizontal');
       const {mockFoundation} = setupTest(root);
       expect(mockFoundation.setVerticalOrientation)
           .toHaveBeenCalledWith(false);
       expect(mockFoundation.setVerticalOrientation).toHaveBeenCalledTimes(1);
     });

  it('component calls setVerticalOrientation(true) on the foundation if aria-orientation=vertical',
     () => {
       const root = getFixture();
       root.setAttribute('aria-orientation', 'vertical');
       const {mockFoundation} = setupTest(root);
       expect(mockFoundation.setVerticalOrientation).toHaveBeenCalledWith(true);
       expect(mockFoundation.setVerticalOrientation).toHaveBeenCalledTimes(1);
     });

  it('#initializeListType sets the selectedIndex if a list item has the --selected class',
     () => {
       const {root, component, mockFoundation} = setupTest();
       (root.querySelector('.mdc-list-item') as HTMLElement)
           .classList.add(
               MDCListFoundation.cssClasses.LIST_ITEM_SELECTED_CLASS);
       component.initializeListType();
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledWith(0);
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledTimes(1);
       expect(mockFoundation.setSingleSelection).toHaveBeenCalledWith(true);
       expect(mockFoundation.setSingleSelection).toHaveBeenCalledTimes(1);
     });

  it('#initializeListType sets the selectedIndex if a list item has the --activated class',
     () => {
       const {root, component, mockFoundation} = setupTest();
       (root.querySelector('.mdc-list-item') as HTMLElement)
           .classList.add(
               MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS);
       component.initializeListType();
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledWith(0);
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledTimes(1);
       expect(mockFoundation.setSingleSelection).toHaveBeenCalledWith(true);
       expect(mockFoundation.setSingleSelection).toHaveBeenCalledTimes(1);
     });

  it('#initializeListType calls the foundation if the --activated class is present',
     () => {
       const {root, component, mockFoundation} = setupTest();
       (root.querySelector('.mdc-list-item') as HTMLElement)
           .classList.add(
               MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS);
       component.initializeListType();
       expect(mockFoundation.setUseActivatedClass).toHaveBeenCalledWith(true);
       expect(mockFoundation.setUseActivatedClass).toHaveBeenCalledTimes(1);
       expect(mockFoundation.setSingleSelection).toHaveBeenCalledWith(true);
       expect(mockFoundation.setSingleSelection).toHaveBeenCalledTimes(1);
     });

  it('#initializeListType populates selectedIndex based on preselected checkbox items',
     () => {
       const {root, component, mockFoundation} = setupTest();
       const listElements = [].slice.call(root.querySelectorAll(
                                `.${cssClasses.LIST_ITEM_CLASS}`)) as Element[];
       listElements.forEach((itemEl: Element) => {
         itemEl.setAttribute('role', 'checkbox');
       });

       listElements[2].setAttribute('aria-checked', 'true');
       component.initializeListType();
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledWith([2]);
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledTimes(1);
     });

  it('#initializeListType populates selectedIndex based on preselected radio item',
     () => {
       const {root, component, mockFoundation} = setupTest();
       const listElements =
           root.querySelectorAll(`.${cssClasses.LIST_ITEM_CLASS}`);
       listElements[3].setAttribute('role', 'radio');
       listElements[3].setAttribute('aria-checked', 'true');

       component.initializeListType();
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledWith(3);
       expect(mockFoundation.setSelectedIndex).toHaveBeenCalledTimes(1);
     });

  it('#initializeListType does not populate selectedIndex when no item is selected',
     () => {
       const {component, mockFoundation} = setupTest();
       component.initializeListType();
       expect(mockFoundation.setSelectedIndex)
           .not.toHaveBeenCalledWith(jasmine.anything());
     });

  it('#setEnabled calls foundation method setEnabled with given index and enabled state.',
     () => {
       const {component, mockFoundation} = setupTest();
       component.setEnabled(1, true);
       expect(mockFoundation.setEnabled).toHaveBeenCalledWith(1, true);
       expect(mockFoundation.setEnabled).toHaveBeenCalledTimes(1);
     });

  it('adapter#getListItemCount returns correct number of list items', () => {
    const {root, component} = setupTest();
    document.body.appendChild(root);
    const number = root.querySelectorAll('.mdc-list-item').length;
    expect(number).toEqual(
        (component.getDefaultFoundation() as any).adapter_.getListItemCount());
    document.body.removeChild(root);
  });

  it('adapter#getFocusedElementIndex returns the index of the currently selected element',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       (root.querySelectorAll('.mdc-list-item')[0] as HTMLInputElement).focus();
       expect(0).toEqual((component.getDefaultFoundation() as any)
                             .adapter_.getFocusedElementIndex());
       document.body.removeChild(root);
     });

  it('adapter#setAttributeForElementIndex does nothing if the element at index does not exist',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const func = () => {
         (component.getDefaultFoundation() as any)
             .adapter_.setAttributeForElementIndex(5, 'foo', 'bar');
       };
       expect(func).not.toThrow();
       document.body.removeChild(root);
     });

  it('adapter#setAttributeForElementIndex sets the attribute for the list element at index specified',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const selectedNode =
           root.querySelectorAll('.mdc-list-item')[1] as HTMLElement;
       (component.getDefaultFoundation() as any)
           .adapter_.setAttributeForElementIndex(1, 'foo', 'bar');
       expect('bar').toEqual(selectedNode.getAttribute('foo') as string);
       document.body.removeChild(root);
     });

  it('adapter#addClassForElementIndex does nothing if the element at index does not exist',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const func = () => {
         (component.getDefaultFoundation() as any)
             .adapter_.addClassForElementIndex(5, 'foo');
       };
       expect(func).not.toThrow();
       document.body.removeChild(root);
     });

  it('adapter#addClassForElementIndex adds the class to the list element at index specified',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
       (component.getDefaultFoundation() as any)
           .adapter_.addClassForElementIndex(1, 'foo');
       expect(selectedNode.classList.contains('foo')).toBe(true);
       document.body.removeChild(root);
     });

  it('adapter#removeClassForElementIndex does nothing if the element at index does not exist',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const func = () => {
         (component.getDefaultFoundation() as any)
             .adapter_.removeClassForElementIndex(5, 'foo');
       };
       expect(func).not.toThrow();
       document.body.removeChild(root);
     });

  it('adapter#removeClassForElementIndex removes the class from the list element at index specified',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
       selectedNode.classList.add('foo');
       (component.getDefaultFoundation() as any)
           .adapter_.removeClassForElementIndex(1, 'foo');
       expect(selectedNode.classList.contains('foo')).toBe(false);
       document.body.removeChild(root);
     });

  it('adapter#focusItemAtIndex does not throw an error if element at index is undefined/null',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const func = () => {
         (component.getDefaultFoundation() as any).adapter_.focusItemAtIndex(5);
       };
       expect(func).not.toThrow();
       document.body.removeChild(root);
     });

  it('adapter#focusItemAtIndex focuses the list item at the index specified',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const items = root.querySelectorAll('.mdc-list-item');
       (items[0] as HTMLElement).focus();
       (component.getDefaultFoundation() as any).adapter_.focusItemAtIndex(1);
       expect(document.activeElement === items[1]).toBe(true);
       document.body.removeChild(root);
     });

  it('adapter#setTabIndexForListItemChildren sets the child button/a elements of index',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const listItems = root.querySelectorAll('.mdc-list-item');

       (component.getDefaultFoundation() as any)
           .adapter_.setTabIndexForListItemChildren(0, 0);
       (component.getDefaultFoundation() as any)
           .adapter_.setTabIndexForListItemChildren(1, 0);

       expect(1).toEqual(
           listItems[0].querySelectorAll('[tabindex="0"]').length);
       expect(1).toEqual(
           listItems[1].querySelectorAll('[tabindex="0"]').length);

       document.body.removeChild(root);
     });

  it('layout adds tabindex=-1 to all list items without a tabindex', () => {
    const {root} = setupTest();
    expect(0).toEqual(
        root.querySelectorAll('.mdc-list-item:not([tabindex])').length);
  });

  it('layout adds tabindex=-1 to all list item button/a elements', () => {
    const {root} = setupTest();
    expect(0).toEqual(root.querySelectorAll('button:not([tabindex])').length);
  });

  it('vertical calls setVerticalOrientation on foundation', () => {
    const {component, mockFoundation} = setupTest();
    component.vertical = false;
    expect(mockFoundation.setVerticalOrientation).toHaveBeenCalledWith(false);
  });

  it('wrapFocus calls setWrapFocus on foundation', () => {
    const {component, mockFoundation} = setupTest();
    component.wrapFocus = true;
    expect(mockFoundation.setWrapFocus).toHaveBeenCalledWith(true);
    expect(mockFoundation.setWrapFocus).toHaveBeenCalledTimes(1);
  });

  it('singleSelection calls foundation setSingleSelection with the provided value',
     () => {
       const {component, mockFoundation} = setupTest();
       component.singleSelection = true;
       expect(mockFoundation.setSingleSelection).toHaveBeenCalledWith(true);
       expect(mockFoundation.setSingleSelection).toHaveBeenCalledTimes(1);
     });

  it('selectedIndex calls setSelectedIndex on foundation', () => {
    const {component, mockFoundation} = setupTest();
    component.selectedIndex = 1;
    expect(mockFoundation.setSelectedIndex).toHaveBeenCalledWith(1);
    expect(mockFoundation.setSelectedIndex).toHaveBeenCalledTimes(1);
  });

  it('#selectedIndex getter proxies foundations getSelectedIndex method',
     () => {
       const {component, mockFoundation} = setupTest();

       (mockFoundation as any).getSelectedIndex.and.returnValue(3);
       expect(3).toEqual(component.selectedIndex as number);
     });

  it('handleClick handler is added to root element', () => {
    const {root, mockFoundation} = setupTest();
    document.body.appendChild(root);
    const event = document.createEvent('Event');
    event.initEvent('click', true, true);
    const listElementItem = root.querySelector('.mdc-list-item') as HTMLElement;
    listElementItem.dispatchEvent(event);
    expect(mockFoundation.handleClick).toHaveBeenCalledWith(0, true);
    expect(mockFoundation.handleClick).toHaveBeenCalledTimes(1);
    document.body.removeChild(root);
  });

  it('focusIn handler is added to root element', () => {
    const {root, mockFoundation} = setupTest();
    document.body.appendChild(root);
    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    const listElementItem = root.querySelector('.mdc-list-item') as HTMLElement;
    listElementItem.dispatchEvent(event);
    expect(mockFoundation.handleFocusIn).toHaveBeenCalledWith(event, 0);
    expect(mockFoundation.handleFocusIn).toHaveBeenCalledTimes(1);
    document.body.removeChild(root);
  });

  it('focusIn handler is removed from the root element on destroy', () => {
    const {root, component, mockFoundation} = setupTest();
    document.body.appendChild(root);
    component.destroy();
    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    const listElementItem = root.querySelector('.mdc-list-item') as HTMLElement;
    listElementItem.dispatchEvent(event);
    expect(mockFoundation.handleFocusIn).not.toHaveBeenCalledWith(event, 0);
    document.body.removeChild(root);
  });

  it('focusOut handler is added to root element', () => {
    const {root, mockFoundation} = setupTest();
    document.body.appendChild(root);
    const event = document.createEvent('FocusEvent');
    event.initEvent('focusout', true, true);
    const listElementItem = root.querySelector('.mdc-list-item') as HTMLElement;
    listElementItem.dispatchEvent(event);
    expect(mockFoundation.handleFocusOut).toHaveBeenCalledWith(event, 0);
    expect(mockFoundation.handleFocusOut).toHaveBeenCalledTimes(1);
    document.body.removeChild(root);
  });

  it('focusOut handler is removed from the root element on destroy', () => {
    const {root, component, mockFoundation} = setupTest();
    document.body.appendChild(root);
    component.destroy();
    const event = document.createEvent('FocusEvent');
    event.initEvent('focusout', true, true);
    const listElementItem = root.querySelector('.mdc-list-item') as HTMLElement;
    listElementItem.dispatchEvent(event);
    expect(mockFoundation.handleFocusOut).not.toHaveBeenCalledWith(event, 0);
    document.body.removeChild(root);
  });

  it('keydown handler is added to root element', () => {
    const {root, mockFoundation} = setupTest();
    const event = document.createEvent('KeyboardEvent');
    event.initEvent('keydown', true, true);
    const listElementItem = root.querySelector('.mdc-list-item') as HTMLElement;
    listElementItem.dispatchEvent(event);
    expect(mockFoundation.handleKeydown).toHaveBeenCalledWith(event, true, 0);
    expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
  });

  it('keydown handler is triggered when a sub-element of a list is triggered',
     () => {
       const {root, mockFoundation} = setupTest();
       const event = document.createEvent('KeyboardEvent');
       event.initEvent('keydown', true, true);
       const button =
           root.querySelector('.mdc-list-item button') as HTMLElement;
       button.dispatchEvent(event);
       expect(mockFoundation.handleKeydown)
           .toHaveBeenCalledWith(event, false, 0);
       expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
     });

  it('keydown calls foundation.handleKeydown method with negative index when event triggered on list root ',
     () => {
       const {root, mockFoundation} = setupTest();
       const event = document.createEvent('KeyboardEvent');
       event.initEvent('keydown', true, true);
       root.dispatchEvent(event);
       expect(mockFoundation.handleKeydown)
           .toHaveBeenCalledWith(event, false, -1);
       expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
     });

  it('keydown handler is removed from the root element on destroy', () => {
    const {root, component, mockFoundation} = setupTest();
    component.destroy();
    const event = document.createEvent('KeyboardEvent');
    event.initEvent('keydown', true, true);
    const listElementItem = root.querySelector('.mdc-list-item') as HTMLElement;
    listElementItem.dispatchEvent(event);
    expect(mockFoundation.handleKeydown)
        .not.toHaveBeenCalledWith(event, true, 0);
  });

  it('#listElements should return all list items including disabled list items',
     () => {
       const {component} = setupTest(getFixtureWithDisabledItems());
       expect(4).toEqual(component.listElements.length);
     });

  it('adapter#hasRadioAtIndex return true or false based on presense of radio button on list item',
     () => {
       const {component} = setupTest();

       expect((component.getDefaultFoundation() as any)
                  .adapter_.hasRadioAtIndex(3))
           .toBe(true);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.hasRadioAtIndex(0))
           .toBe(false);
     });

  it('adapter#hasCheckboxAtIndex return true or false based on presense of checkbox button on list item',
     () => {
       const {component} = setupTest();

       expect((component.getDefaultFoundation() as any)
                  .adapter_.hasCheckboxAtIndex(2))
           .toBe(true);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.hasCheckboxAtIndex(0))
           .toBe(false);
     });

  it('adapter#isCheckboxCheckedAtIndex returns true or false based if checkbox is checked on a list item',
     () => {
       const {root, component} = setupTest();

       expect((component.getDefaultFoundation() as any)
                  .adapter_.isCheckboxCheckedAtIndex(2))
           .toBe(false);
       document.body.appendChild(root);
       const checkbox =
           root.querySelector('input[type="checkbox"]') as HTMLInputElement;
       checkbox.checked = true;
       expect((component.getDefaultFoundation() as any)
                  .adapter_.isCheckboxCheckedAtIndex(2))
           .toBe(true);
       document.body.removeChild(root);
     });

  it('adapter#setCheckedCheckboxOrRadioAtIndex toggles the checkbox on list item',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const checkbox =
           root.querySelector('input[type="checkbox"]') as HTMLInputElement;

       (component.getDefaultFoundation() as any)
           .adapter_.setCheckedCheckboxOrRadioAtIndex(2, true);
       expect(checkbox.checked).toBe(true);

       (component.getDefaultFoundation() as any)
           .adapter_.setCheckedCheckboxOrRadioAtIndex(2, false);
       expect(checkbox.checked).toBe(false);
       document.body.removeChild(root);
     });

  it('adapter#setCheckedCheckboxOrRadioAtIndex toggles the radio on list item',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       const radio =
           root.querySelector('input[type="radio"]') as HTMLInputElement;

       (component.getDefaultFoundation() as any)
           .adapter_.setCheckedCheckboxOrRadioAtIndex(3, true);
       expect(radio.checked).toBe(true);

       (component.getDefaultFoundation() as any)
           .adapter_.setCheckedCheckboxOrRadioAtIndex(3, false);
       expect(radio.checked).toBe(false);
       document.body.removeChild(root);
     });

  it('adapter#notifyAction emits action event', () => {
    const {component} = setupTest();

    let detail = null;
    const handler = (evt: any) => detail = evt.detail;

    component.listen(strings.ACTION_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter_.notifyAction(3);
    component.unlisten(strings.ACTION_EVENT, handler);

    expect(detail).toEqual({index: 3} as any);
  });

  it('adapter#isFocusInsideList returns true if focus is inside list root',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.isFocusInsideList())
           .toBe(false);
       (root.querySelector('.mdc-list-item') as HTMLElement).focus();
       expect((component.getDefaultFoundation() as any)
                  .adapter_.isFocusInsideList())
           .toBe(true);
       document.body.removeChild(root);
     });

  it('adapter#isRootFocused returns true if list root is on focus', () => {
    const {root, component} = setupTest();
    document.body.appendChild(root);
    expect((component.getDefaultFoundation() as any).adapter_.isRootFocused())
        .toBe(false);
    root.focus();
    expect((component.getDefaultFoundation() as any).adapter_.isRootFocused())
        .toBe(true);
    document.body.removeChild(root);
  });

  it('adapter#listItemAtIndexHasClass returns true if list item has disabled class',
     () => {
       const {root, component} = setupTest();
       root.querySelectorAll(`.${cssClasses.LIST_ITEM_CLASS}`)[0].classList.add(
           cssClasses.LIST_ITEM_DISABLED_CLASS);
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.listItemAtIndexHasClass(
                      0, cssClasses.LIST_ITEM_DISABLED_CLASS))
           .toBe(true);
       document.body.removeChild(root);
     });

  it('adapter#listItemAtIndexHasClass returns false if list item does not have disabled class',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.listItemAtIndexHasClass(
                      0, cssClasses.LIST_ITEM_DISABLED_CLASS))
           .toBe(false);
       document.body.removeChild(root);
     });

  it('adapter#getPrimaryTextAtIndex returns the appropriate text for one line list',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.getPrimaryTextAtIndex(2))
           .toEqual('Pasta');
       document.body.removeChild(root);
     });

  it('adapter#getPrimaryTextAtIndex returns the appropriate text for two line list',
     () => {
       const {root, component} = setupTest(getTwoLineFixture());
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.getPrimaryTextAtIndex(2))
           .toEqual('Pasta');
       document.body.removeChild(root);
     });
});
