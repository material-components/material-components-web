/**
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
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';

import {MDCDrawer} from '../../../packages/mdc-drawer';
import {strings} from '../../../packages/mdc-drawer/constants';
import MDCDismissibleDrawerFoundation from '../../../packages/mdc-drawer/dismissible/foundation';

function getFixture() {
  return bel`
  <div class="body-content">
    <div class="mdc-drawer mdc-drawer--dismissible">
      <div class="mdc-drawer__content">
      <div class="mdc-list-group">
        <nav class="mdc-list">
          <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
          </a>
        </nav>
      </div>
    </div>
  </div>
`;
}

function setupTest() {
  const root = getFixture();
  const drawer = root.querySelector('.mdc-drawer');
  const component = new MDCDrawer(drawer);
  const MockFoundationCtor = td.constructor(MDCDismissibleDrawerFoundation);
  const mockFoundation = new MockFoundationCtor();
  return {root, drawer, component, mockFoundation};
}
suite('MDCDrawer');

test('attachTo initializes and returns a MDCDrawer instance', () => {
  const drawer = getFixture().querySelector('.mdc-drawer');
  assert.isTrue(MDCDrawer.attachTo(drawer) instanceof MDCDrawer);
});

test('#get open calls foundation.isOpen', () => {
  const {component} = setupTest();
  component.foundation_.isOpen = td.func();
  component.open;
  td.verify(component.foundation_.isOpen(), {times: 1});
});

test('#set open true calls foundation.open', () => {
  const {component} = setupTest();
  component.foundation_.open = td.func();
  component.open = true;
  td.verify(component.foundation_.open(), {times: 1});
});

test('#set open false calls foundation.close', () => {
  const {component} = setupTest();
  component.foundation_.close = td.func();
  component.open = false;
  td.verify(component.foundation_.close(), {times: 1});
});

test('keydown event calls foundation.handleKeydown method', () => {
  const {component, drawer} = setupTest();
  component.foundation_.handleKeydown = td.func();
  drawer.querySelector('.mdc-list-item').focus();
  domEvents.emit(drawer, 'keydown');
  td.verify(component.foundation_.handleKeydown(td.matchers.isA(Object)), {times: 1});
});

test('transitionend event calls foundation.handleTransitionEnd method', () => {
  const {component, drawer} = setupTest();
  component.foundation_.handleTransitionEnd = td.func();
  domEvents.emit(drawer, 'transitionend');
  td.verify(component.foundation_.handleTransitionEnd(td.matchers.isA(Object)), {times: 1});
});

test('#destroy removes keydown event listener', () => {
  const {component, drawer, mockFoundation} = setupTest();
  component.destroy();
  drawer.querySelector('.mdc-list-item').focus();
  domEvents.emit(drawer, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.isA(Object)), {times: 0});
});

test('#destroy removes transitionend event listener', () => {
  const {component, drawer, mockFoundation} = setupTest();
  component.destroy();

  domEvents.emit(drawer, 'transitionend');
  td.verify(mockFoundation.handleTransitionEnd(td.matchers.isA(Object)), {times: 0});
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
  root.querySelector(strings.ACTIVE_NAV_ITEM_SELECTOR).focus();
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

  const navItem = root.querySelector(strings.ACTIVE_NAV_ITEM_SELECTOR);
  navItem.focus();
  component.getDefaultFoundation().adapter_.restoreFocus();

  assert.equal(navItem, document.activeElement);
  document.body.removeChild(button);
  document.body.removeChild(root);
});

test('adapter#computeBoundingRect calls getBoundingClientRect() on root', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(component.getDefaultFoundation().adapter_.computeBoundingRect(), root.getBoundingClientRect());
  document.body.removeChild(root);
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

  assert.equal(root.querySelector(strings.ACTIVE_NAV_ITEM_SELECTOR), document.activeElement);
  document.body.removeChild(root);
});
