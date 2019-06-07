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
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';

import {MDCDrawer} from '../../../packages/mdc-drawer/index';
import {strings, cssClasses} from '../../../packages/mdc-drawer/constants';
import {MDCList, MDCListFoundation} from '../../../packages/mdc-list/index';
import {MDCDismissibleDrawerFoundation} from '../../../packages/mdc-drawer/dismissible/foundation';
import {MDCModalDrawerFoundation} from '../../../packages/mdc-drawer/modal/foundation';

/**
 * @typedef {{
 *   variantClass: (string|undefined),
 *   shadowRoot: (boolean|undefined),
 *   hasList: (boolean|undefined),
 * }}
 */
let DrawerSetupOptions; // eslint-disable-line no-unused-vars

const defaultSetupOptions = {variantClass: cssClasses.DISMISSIBLE, shadowRoot: false, hasList: true};

/**
 * @param {DrawerSetupOptions} options
 * @return {HTMLElement|DocumentFragment}
 */
function getFixture(options) {
  const listEl = bel`
    <div class="mdc-list-group">
      <nav class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
        </a>
      </nav>
    </div>
    `;
  const drawerEl = bel`
    <div class="mdc-drawer ${options.variantClass}">
      <div class="mdc-drawer__content">
        ${options.hasList ? listEl : ''}
      </div>
    </div>
    `;
  const scrimEl = bel`<div class="mdc-drawer-scrim"></div>`;
  const isModal = options.variantClass === cssClasses.MODAL;

  if (options.shadowRoot) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(drawerEl);
    if (isModal) {
      fragment.appendChild(scrimEl);
    }
    return fragment;
  } else {
    return bel`
      <div class="body-content">
        ${drawerEl}
        ${isModal ? scrimEl : ''}
      </div>`;
  }
}

/**
 * @param {DrawerSetupOptions} options
 * @return {{component: MDCDrawer, root: (HTMLElement|DocumentFragment), drawer: HTMLElement}}
 */
function setupTest(options = defaultSetupOptions) {
  const root = getFixture(options);
  const drawer = root.querySelector('.mdc-drawer');
  const component = new MDCDrawer(drawer);
  return {root, drawer, component};
}

/**
 * @param {DrawerSetupOptions} options
 * @return {{
 *   component: MDCDrawer,
 *   mockList: MDCList,
 *   mockFocusTrapInstance: {activate: function(), deactivate: function(), pause: function(), unpause: function()},
 *   root: HTMLElement,
 *   drawer: HTMLElement,
 *   mockFoundation: (MDCDismissibleDrawerFoundation|MDCModalDrawerFoundation),
 * }}
 */
function setupTestWithMocks(options = defaultSetupOptions) {
  const root = getFixture(options);
  const drawer = root.querySelector('.mdc-drawer');
  const isModal = options.variantClass === cssClasses.MODAL;
  const MockFoundationClass = isModal ? MDCModalDrawerFoundation : MDCDismissibleDrawerFoundation;
  const MockFoundationCtor = td.constructor(MockFoundationClass);
  const mockFoundation = new MockFoundationCtor();
  const mockFocusTrapInstance = td.object({
    activate: () => {},
    deactivate: () => {},
  });
  const mockList = td.object({
    wrapFocus: () => {},
    destroy: () => {},
  });

  const component = new MDCDrawer(drawer, mockFoundation, () => mockFocusTrapInstance, () => mockList);
  return {root, drawer, component, mockFoundation, mockFocusTrapInstance, mockList};
}

suite('MDCDrawer');

test('attachTo initializes and returns a MDCDrawer instance', () => {
  const root = getFixture({variantClass: cssClasses.DISMISSIBLE, hasList: false}).querySelector('.mdc-drawer');
  assert.instanceOf(MDCDrawer.attachTo(root), MDCDrawer);
});

test('#get open calls foundation.isOpen', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  component.open;
  td.verify(mockFoundation.isOpen(), {times: 1});
});

test('#set open true calls foundation.open', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  component.open = true;
  td.verify(mockFoundation.open(), {times: 1});
});

test('#set open false calls foundation.close', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  component.open = false;
  td.verify(mockFoundation.close(), {times: 1});
});

test('#get list returns MDCList instance when DOM includes list', () => {
  const {component} = setupTest();
  assert.instanceOf(component.list, MDCList);
});

test('click event calls foundation.handleScrimClick method', () => {
  const {root, mockFoundation} = setupTestWithMocks({variantClass: cssClasses.MODAL});
  const scrimEl = root.querySelector('.mdc-drawer-scrim');
  domEvents.emit(scrimEl, 'click');
  td.verify(mockFoundation.handleScrimClick(), {times: 1});
});

test('keydown event calls foundation.handleKeydown method', () => {
  const {drawer, mockFoundation} = setupTestWithMocks();
  drawer.querySelector('.mdc-list-item').focus();
  domEvents.emit(drawer, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.isA(Object)), {times: 1});
});

test('transitionend event calls foundation.handleTransitionEnd method', () => {
  const {drawer, mockFoundation} = setupTestWithMocks();
  domEvents.emit(drawer, 'transitionend');
  td.verify(mockFoundation.handleTransitionEnd(td.matchers.isA(Object)), {times: 1});
});

test('component should throw error when invalid variant class name is used or no variant specified', () => {
  assert.throws(() => setupTest({variantClass: 'mdc-drawer--test-invalid-variant'}), Error);
  assert.throws(() => setupTest({variantClass: ' '}), Error);
});

test('#destroy removes keydown event listener', () => {
  const {component, drawer, mockFoundation} = setupTestWithMocks();
  component.destroy();
  drawer.querySelector('.mdc-list-item').focus();
  domEvents.emit(drawer, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.isA(Object)), {times: 0});
});

test('#destroy removes transitionend event listener', () => {
  const {component, drawer, mockFoundation} = setupTestWithMocks();
  component.destroy();

  domEvents.emit(drawer, 'transitionend');
  td.verify(mockFoundation.handleTransitionEnd(td.matchers.isA(Object)), {times: 0});
});

test('#destroy calls destroy on list', () => {
  const {component, mockList} = setupTestWithMocks();
  component.destroy();

  td.verify(mockList.destroy(), {times: 1});
});

test('#destroy does not throw an error when list is not present', () => {
  const {component, mockList} =
    setupTestWithMocks(Object.assign({}, defaultSetupOptions, {variantClass: cssClasses.MODAL, hasList: false}));
  component.destroy();

  td.verify(mockList.destroy(), {times: 0});
});

test('adapter#addClass adds class to drawer', () => {
  const {component, drawer} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('test-class');
  assert.isTrue(drawer.classList.contains('test-class'));
});

test('adapter#removeClass removes class from drawer', () => {
  const {component, drawer} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('test-class');

  component.getDefaultFoundation().adapter_.removeClass('test-class');
  assert.isFalse(drawer.classList.contains('test-class'));
});

test('adapter#hasClass returns true when class is on drawer element', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('test-class');
  const hasClass = component.getDefaultFoundation().adapter_.hasClass('test-class');
  assert.isTrue(hasClass);
});

test('adapter#hasClass returns false when there is no class on drawer element', () => {
  const {component} = setupTest();
  const hasClass = component.getDefaultFoundation().adapter_.hasClass('test-class');
  assert.isFalse(hasClass);
});

test('adapter#elementHasClass returns true when class is found on event target', () => {
  const {component} = setupTest();
  const mockEventTarget = bel`<div class="foo">bar</div>`;

  assert.isTrue(component.getDefaultFoundation().adapter_.elementHasClass(mockEventTarget, 'foo'));
});

test('adapter#restoreFocus restores focus to previously saved focus', () => {
  const {component, root} = setupTest();
  const button = bel`<button>Foo</button>`;
  document.body.appendChild(button);
  document.body.appendChild(root);
  button.focus();

  component.getDefaultFoundation().adapter_.saveFocus();
  root.querySelector(`.${MDCListFoundation.cssClasses.ITEM_ACTIVATED}`).focus();
  component.getDefaultFoundation().adapter_.restoreFocus();

  assert.equal(button, document.activeElement);
  document.body.removeChild(button);
  document.body.removeChild(root);
});

test('adapter#restoreFocus focus shouldn\'t restore if focus is not within root element', () => {
  const {component, root} = setupTest();
  const navButtonEl = bel`<button>Foo</button>`;
  const otherButtonEl = bel`<button>Bar</button>`;
  document.body.appendChild(navButtonEl);
  document.body.appendChild(otherButtonEl);
  document.body.appendChild(root);
  navButtonEl.focus();

  component.getDefaultFoundation().adapter_.saveFocus();
  otherButtonEl.focus();
  component.getDefaultFoundation().adapter_.restoreFocus();

  assert.notEqual(navButtonEl, document.activeElement);
  document.body.removeChild(navButtonEl);
  document.body.removeChild(otherButtonEl);
  document.body.removeChild(root);
});

test('adapter#restoreFocus focus is not restored if saveFocus never called', () => {
  const {component, root} = setupTest();
  const button = bel`<button>Foo</button>`;
  document.body.appendChild(button);
  document.body.appendChild(root);
  button.focus();

  const navItem = root.querySelector(`.${MDCListFoundation.cssClasses.ITEM_ACTIVATED}`);
  navItem.focus();
  component.getDefaultFoundation().adapter_.restoreFocus();

  assert.equal(navItem, document.activeElement);
  document.body.removeChild(button);
  document.body.removeChild(root);
});

test('adapter#trapFocus traps focus on root element', () => {
  const {component, mockFocusTrapInstance} = setupTestWithMocks({variantClass: cssClasses.MODAL});
  component.getDefaultFoundation().adapter_.trapFocus();

  td.verify(mockFocusTrapInstance.activate());
});

test('adapter#releaseFocus releases focus on root element after trap focus', () => {
  const {component, mockFocusTrapInstance} = setupTestWithMocks({variantClass: cssClasses.MODAL});
  component.getDefaultFoundation().adapter_.releaseFocus();

  td.verify(mockFocusTrapInstance.deactivate());
});

test('adapter#notifyOpen emits drawer open event', () => {
  const {component} = setupTest();

  const handler = td.func('openHandler');

  component.listen(strings.OPEN_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyOpen();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#notifyClose emits drawer close event', () => {
  const {component} = setupTest();

  const handler = td.func('closeHandler');

  component.listen(strings.CLOSE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClose();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#focusActiveNavigationItem focuses on active navigation item', () => {
  const {component, root} = setupTest();
  document.body.appendChild(root);
  component.getDefaultFoundation().adapter_.focusActiveNavigationItem();

  const activatedNavigationItemEl = root.querySelector(`.${MDCListFoundation.cssClasses.ITEM_ACTIVATED}`);
  assert.equal(document.activeElement, activatedNavigationItemEl);
  document.body.removeChild(root);
});

test('adapter#focusActiveNavigationItem does nothing if no active navigation item exists', () => {
  const {component, root} = setupTest();
  const prevActiveElement = document.activeElement;
  document.body.appendChild(root);
  const activatedNavigationItemEl = root.querySelector(`.${MDCListFoundation.cssClasses.ITEM_ACTIVATED}`);
  activatedNavigationItemEl.classList.remove(MDCListFoundation.cssClasses.ITEM_ACTIVATED);
  component.getDefaultFoundation().adapter_.focusActiveNavigationItem();

  assert.equal(document.activeElement, prevActiveElement);
  document.body.removeChild(root);
});

test('#initialSyncWithDOM should not throw any errors when DOM rendered in DocumentFragment i.e., Shadow DOM', () => {
  const {component} = setupTest({variantClass: cssClasses.MODAL, shadowRoot: true});
  assert.doesNotThrow(() => component.initialSyncWithDOM());
});
