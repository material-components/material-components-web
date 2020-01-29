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

import {MDCList, MDCListFoundation} from '../../mdc-list/index';
import {getFixture} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {cssClasses, strings} from '../constants';
import {MDCDismissibleDrawerFoundation} from '../dismissible/foundation';
import {MDCDrawer} from '../index';
import {MDCModalDrawerFoundation} from '../modal/foundation';

interface DrawerSetupOptions {
  variantClass: string;
  shadowRoot: boolean;
  hasList: boolean;
}

const defaultSetupOptions = {variantClass: cssClasses.DISMISSIBLE, shadowRoot: false, hasList: true};

function getDrawerFixture(options: Partial<DrawerSetupOptions>): HTMLElement|
    DocumentFragment {
  const listContent = `
    <div class="mdc-list-group">
      <nav class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
        </a>
      </nav>
    </div>
    `;
  const drawerContent = `
    <div class="mdc-drawer ${options.variantClass}">
      <div class="mdc-drawer__content">
        ${options.hasList ? listContent : ''}
      </div>
    </div>
    `;
  const scrimContent = `<div class="mdc-drawer-scrim"></div>`;
  const isModal = options.variantClass === cssClasses.MODAL;
  const drawerEl = getFixture(drawerContent);
  const scrimEl = getFixture(scrimContent);

  if (options.shadowRoot) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(drawerEl);
    if (isModal) {
      fragment.appendChild(scrimEl);
    }
    return fragment;
  } else {
    return getFixture(`
      <div class="body-content">
        ${drawerContent}
        ${isModal ? scrimContent : ''}
      </div>`);
  }
}

function setupTest(options: Partial<DrawerSetupOptions> = defaultSetupOptions) {
  const root = getDrawerFixture(options);
  const drawer = root.querySelector('.mdc-drawer') as HTMLElement;
  const component = new MDCDrawer(drawer);
  return {root, drawer, component};
}

function setupTestWithMocks(
    options: Partial<DrawerSetupOptions> = defaultSetupOptions) {
  const root = getDrawerFixture(options);
  const drawer = root.querySelector('.mdc-drawer') as HTMLElement;
  const isModal = options.variantClass === cssClasses.MODAL;
  const mockFoundation = createMockFoundation(
      isModal ? MDCModalDrawerFoundation : MDCDismissibleDrawerFoundation);
  const mockFocusTrapInstance =
      jasmine.createSpyObj('FocusTrapInstance', ['trapFocus', 'releaseFocus']);
  const mockList = jasmine.createSpyObj('MDCList', ['wrapFocus', 'destroy']);
  const component = new MDCDrawer(drawer, mockFoundation, () => mockFocusTrapInstance, () => mockList);
  return {root, drawer, component, mockFoundation, mockFocusTrapInstance, mockList};
}

describe('MDCDrawer', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns a MDCDrawer instance', () => {
    const root = getDrawerFixture({
                   variantClass: cssClasses.DISMISSIBLE,
                   hasList: false
                 }).querySelector('.mdc-drawer') as HTMLElement;
    expect(MDCDrawer.attachTo(root)).toEqual(jasmine.any(MDCDrawer));
  });

  it('#get open calls foundation.isOpen', () => {
    const {component, mockFoundation} = setupTestWithMocks();
    component.open;
    expect(mockFoundation.isOpen).toHaveBeenCalledTimes(1);
  });

  it('#set open true calls foundation.open', () => {
    const {component, mockFoundation} = setupTestWithMocks();
    component.open = true;
    expect(mockFoundation.open).toHaveBeenCalledTimes(1);
  });

  it('#set open false calls foundation.close', () => {
    const {component, mockFoundation} = setupTestWithMocks();
    component.open = false;
    expect(mockFoundation.close).toHaveBeenCalledTimes(1);
  });

  it('#get list returns MDCList instance when DOM includes list', () => {
    const {component} = setupTest();
    expect(component.list).toEqual(jasmine.any(MDCList));
  });

  it('click event calls foundation.handleScrimClick method', () => {
    const {root, mockFoundation} =
        setupTestWithMocks({variantClass: cssClasses.MODAL});
    const scrimEl = root.querySelector('.mdc-drawer-scrim') as HTMLElement;
    emitEvent(scrimEl, 'click');
    expect(mockFoundation.handleScrimClick).toHaveBeenCalledTimes(1);
  });

  it('keydown event calls foundation.handleKeydown method', () => {
    const {drawer, mockFoundation} = setupTestWithMocks();
    (drawer.querySelector('.mdc-list-item') as HTMLElement).focus();
    emitEvent(drawer, 'keydown');
    expect(mockFoundation.handleKeydown)
        .toHaveBeenCalledWith(jasmine.any(Object));
    expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
  });

  it('transitionend event calls foundation.handleTransitionEnd method', () => {
    const {drawer, mockFoundation} = setupTestWithMocks();
    emitEvent(drawer, 'transitionend');
    expect(mockFoundation.handleTransitionEnd)
        .toHaveBeenCalledWith(jasmine.any(Object));
    expect(mockFoundation.handleTransitionEnd).toHaveBeenCalledTimes(1);
  });

  it('component should throw error when invalid variant class name is used or no variant specified',
     () => {
       expect(
           () => setupTest({variantClass: 'mdc-drawer--test-invalid-variant'}))
           .toThrow();
       expect(() => setupTest({variantClass: ' '})).toThrow();
     });

  it('#destroy removes keydown event listener', () => {
    const {component, drawer, mockFoundation} = setupTestWithMocks();
    component.destroy();
    (drawer.querySelector('.mdc-list-item') as HTMLElement).focus();
    emitEvent(drawer, 'keydown');
    expect(mockFoundation.handleKeydown)
        .not.toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('#destroy removes transitionend event listener', () => {
    const {component, drawer, mockFoundation} = setupTestWithMocks();
    component.destroy();

    emitEvent(drawer, 'transitionend');
    expect(mockFoundation.handleTransitionEnd)
        .not.toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('#destroy calls destroy on list', () => {
    const {component, mockList} = setupTestWithMocks();
    component.destroy();

    expect(mockList.destroy).toHaveBeenCalledTimes(1);
  });

  it('#destroy does not throw an error when list is not present', () => {
    const {component, mockList} =
        setupTestWithMocks({variantClass: cssClasses.MODAL, hasList: false});
    component.destroy();

    expect(mockList.destroy).not.toHaveBeenCalled();
  });

  it('adapter#addClass adds class to drawer', () => {
    const {component, drawer} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.addClass('test-class');
    expect(drawer.classList.contains('test-class')).toBe(true);
  });

  it('adapter#removeClass removes class from drawer', () => {
    const {component, drawer} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.addClass('test-class');

    (component.getDefaultFoundation() as any)
        .adapter_.removeClass('test-class');
    expect(drawer.classList.contains('test-class')).toBe(false);
  });

  it('adapter#hasClass returns true when class is on drawer element', () => {
    const {component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.addClass('test-class');
    const hasClass = (component.getDefaultFoundation() as any)
                         .adapter_.hasClass('test-class');
    expect(hasClass).toBe(true);
  });

  it('adapter#hasClass returns false when there is no class on drawer element',
     () => {
       const {component} = setupTest();
       const hasClass = (component.getDefaultFoundation() as any)
                            .adapter_.hasClass('test-class');
       expect(hasClass).toBe(false);
     });

  it('adapter#elementHasClass returns true when class is found on event target',
     () => {
       const {component} = setupTest();
       const mockEventTarget = getFixture(`<div class="foo">bar</div>`);

       expect((component.getDefaultFoundation() as any)
                  .adapter_.elementHasClass(mockEventTarget, 'foo'))
           .toBe(true);
     });

  it('adapter#restoreFocus restores focus to previously saved focus', () => {
    const {component, root} = setupTest();
    const button = getFixture(`<button>Foo</button>`);
    document.body.appendChild(button);
    document.body.appendChild(root);
    button.focus();

    (component.getDefaultFoundation() as any).adapter_.saveFocus();
    (root.querySelector(
         `.${MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS}`) as
     HTMLElement)
        .focus();
    (component.getDefaultFoundation() as any).adapter_.restoreFocus();

    expect(button).toEqual(document.activeElement as HTMLElement);
    document.body.removeChild(button);
    document.body.removeChild(root);
  });

  it('adapter#restoreFocus focus shouldn\'t restore if focus is not within root element',
     () => {
       const {component, root} = setupTest();
       const navButtonEl = getFixture(`<button>Foo</button>`);
       const otherButtonEl = getFixture(`<button>Bar</button>`);
       document.body.appendChild(navButtonEl);
       document.body.appendChild(otherButtonEl);
       document.body.appendChild(root);
       navButtonEl.focus();

       (component.getDefaultFoundation() as any).adapter_.saveFocus();
       otherButtonEl.focus();
       (component.getDefaultFoundation() as any).adapter_.restoreFocus();

       expect(navButtonEl).not.toBe(document.activeElement as HTMLElement);
       document.body.removeChild(navButtonEl);
       document.body.removeChild(otherButtonEl);
       document.body.removeChild(root);
     });

  it('adapter#restoreFocus focus is not restored if saveFocus never called',
     () => {
       const {component, root} = setupTest();
       const button = getFixture(`<button>Foo</button>`);
       document.body.appendChild(button);
       document.body.appendChild(root);
       button.focus();

       const navItem =
           root.querySelector(
               `.${MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS}`) as
           HTMLElement;
       navItem.focus();
       (component.getDefaultFoundation() as any).adapter_.restoreFocus();

       expect(navItem).toEqual(document.activeElement as HTMLElement);
       document.body.removeChild(button);
       document.body.removeChild(root);
     });

  it('adapter#trapFocus traps focus on root element', () => {
    const {component, mockFocusTrapInstance} =
        setupTestWithMocks({variantClass: cssClasses.MODAL});
    (component.getDefaultFoundation() as any).adapter_.trapFocus();

    expect(mockFocusTrapInstance.trapFocus).toHaveBeenCalled();
  });

  it('adapter#releaseFocus releases focus on root element after trap focus',
     () => {
       const {component, mockFocusTrapInstance} =
           setupTestWithMocks({variantClass: cssClasses.MODAL});
       (component.getDefaultFoundation() as any).adapter_.releaseFocus();

       expect(mockFocusTrapInstance.releaseFocus).toHaveBeenCalled();
     });

  it('adapter#notifyOpen emits drawer open event', () => {
    const {component} = setupTest();

    const handler = jasmine.createSpy('openHandler');

    component.listen(strings.OPEN_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter_.notifyOpen();

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#notifyClose emits drawer close event', () => {
    const {component} = setupTest();

    const handler = jasmine.createSpy('closeHandler');

    component.listen(strings.CLOSE_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter_.notifyClose();

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#focusActiveNavigationItem focuses on active navigation item',
     () => {
       const {component, root} = setupTest();
       document.body.appendChild(root);
       (component.getDefaultFoundation() as any)
           .adapter_.focusActiveNavigationItem();

       const activatedNavigationItemEl = root.querySelector(
           `.${MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS}`);
       expect(document.activeElement).toEqual(activatedNavigationItemEl);
       document.body.removeChild(root);
     });

  it('adapter#focusActiveNavigationItem does nothing if no active navigation item exists',
     () => {
       const {component, root} = setupTest();
       const prevActiveElement = document.activeElement;
       document.body.appendChild(root);
       const activatedNavigationItemEl =
           root.querySelector(
               `.${MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS}`) as
           HTMLElement;
       activatedNavigationItemEl.classList.remove(
           MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS);
       (component.getDefaultFoundation() as any)
           .adapter_.focusActiveNavigationItem();

       expect(document.activeElement).toEqual(prevActiveElement);
       document.body.removeChild(root);
     });

  it('#initialSyncWithDOM should not throw any errors when DOM rendered in DocumentFragment i.e., Shadow DOM',
     () => {
       const {component} =
           setupTest({variantClass: cssClasses.MODAL, shadowRoot: true});
       expect(() => component.initialSyncWithDOM).not.toThrow();
     });
});
