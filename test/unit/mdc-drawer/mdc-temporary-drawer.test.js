/**
 * @license
 * Copyright 2016 Google Inc.
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

import {MDCTemporaryDrawer} from '../../../packages/mdc-drawer/temporary';
import {strings} from '../../../packages/mdc-drawer/temporary/constants';
import {getTransformPropertyName, supportsCssCustomProperties} from '../../../packages/mdc-drawer/util';

function getFixture() {
  return bel`
    <aside class="mdc-drawer mdc-drawer--temporary">
      <nav class="mdc-drawer__drawer">
      </nav>
    </aside>
  `;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCTemporaryDrawer(root);
  return {root, component};
}

suite('MDCTemporaryDrawer');

test('attachTo initializes and returns a MDCTemporaryDrawer instance', () => {
  assert.isOk(MDCTemporaryDrawer.attachTo(getFixture()) instanceof MDCTemporaryDrawer);
});

test('get/set open', () => {
  const {root, component} = setupTest();

  const openHandler = td.func('notifyOpen handler');
  root.addEventListener(strings.OPEN_EVENT, openHandler);
  const closeHandler = td.func('notifyClose handler');
  root.addEventListener(strings.CLOSE_EVENT, closeHandler);

  component.open = true;
  assert.isOk(root.classList.contains('mdc-drawer--open'));
  assert.isOk(component.open);
  td.verify(openHandler(td.matchers.anything()));

  component.open = false;
  assert.isNotOk(root.classList.contains('mdc-drawer--open'));
  assert.isNotOk(component.open);
  td.verify(closeHandler(td.matchers.anything()));
});

test('foundationAdapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('adapter#hasClass returns true if the root element has specified class', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#hasClass returns false if the root element does not have specified class', () => {
  const {component} = setupTest();
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#eventTargetHasClass returns whether or not the className is in the target\'s classList', () => {
  const {component} = setupTest();
  const target = bel`<div class="existent-class"></div>`;
  const {adapter_: adapter} = component.getDefaultFoundation();

  assert.isTrue(adapter.eventTargetHasClass(target, 'existent-class'));
  assert.isFalse(adapter.eventTargetHasClass(target, 'non-existent-class'));
});

test('adapter#hasNecessaryDom returns true if the DOM includes a drawer', () => {
  const {component} = setupTest();
  assert.isOk(component.getDefaultFoundation().adapter_.hasNecessaryDom());
});

test('adapter#hasNecessaryDom returns false if the DOM does not include a drawer', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  root.removeChild(drawer);
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasNecessaryDom());
});

test('adapter#registerInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  root.addEventListener('click', handler);

  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerDrawerInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerDrawerInteractionHandler('click', handler);
  domEvents.emit(drawer, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterDrawerInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  const handler = td.func('eventHandler');
  drawer.addEventListener('click', handler);

  component.getDefaultFoundation().adapter_.deregisterDrawerInteractionHandler('click', handler);
  domEvents.emit(drawer, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerTransitionEndHandler adds a transition end event listener on the drawer element', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  const handler = td.func('transitionEndHandler');
  component.getDefaultFoundation().adapter_.registerTransitionEndHandler(handler);
  domEvents.emit(drawer, 'transitionend');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterTransitionEndHandler removes a transition end event listener on the drawer element', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  const handler = td.func('transitionEndHandler');
  drawer.addEventListener('transitionend', handler);

  component.getDefaultFoundation().adapter_.deregisterTransitionEndHandler(handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#getDrawerWidth returns the width of the drawer element', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  assert.equal(component.getDefaultFoundation().adapter_.getDrawerWidth(), drawer.offsetWidth);
});

test('adapter#setTranslateX sets the correct transform on the drawer', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  component.getDefaultFoundation().adapter_.setTranslateX(42);
  assert.equal(drawer.style.getPropertyValue(getTransformPropertyName()), 'translateX(42px)');
});

test('adapter#setTranslateX sets translateX to null when given the null value', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  component.getDefaultFoundation().adapter_.setTranslateX(null);
  const transformPropertyName = getTransformPropertyName();
  const nonStyledElement = document.createElement('div');
  assert.equal(
    drawer.style.getPropertyValue(transformPropertyName), nonStyledElement.style.getPropertyValue(transformPropertyName)
  );
});

test('adapter#updateCssVariable sets custom property on root', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.updateCssVariable('0');
  if (supportsCssCustomProperties()) {
    assert.equal(root.style.getPropertyValue(strings.OPACITY_VAR_NAME), '0');
  }
});

test('adapter#getFocusableElements returns all the focusable elements in the drawer', () => {
  const root = bel`
    <aside class="mdc-drawer mdc-drawer--temporary">
      <nav class="mdc-drawer__drawer">
        <div class="mdc-drawer__toolbar-spacer"></div>
        <button></button>
        <a href="foo"></a>
        <div></div>
        <div tabindex="0"></div>
      </nav>
    </aside>
  `;
  const component = new MDCTemporaryDrawer(root);
  assert.equal(component.getDefaultFoundation().adapter_.getFocusableElements().length, 3);
});

test('adapter#restoreElementTabState restores tabindex and removes data-mdc-tabindex', () => {
  const root = bel`
    <aside class="mdc-drawer mdc-drawer--temporary">
      <nav class="mdc-drawer__drawer">
        <div id="foo" tabindex="0"></div>
      </nav>
    </aside>
  `;
  const component = new MDCTemporaryDrawer(root);
  const el = root.querySelector('#foo');
  component.getDefaultFoundation().adapter_.restoreElementTabState(el);
  assert.equal(el.getAttribute('tabindex'), '0');
  assert.equal(el.getAttribute('data-mdc-tabindex'), null);
  assert.equal(el.getAttribute('data-mdc-tabindex-handled'), null);
});

test('adapter#makeElementUntabbable sets a tab index of -1 on the element', () => {
  const root = bel`
    <aside class="mdc-drawer mdc-drawer--temporary mdc-drawer--open">
      <nav class="mdc-drawer__drawer">
        <a id="foo" href="foo"></a>
      </nav>
    </aside>
  `;
  const component = new MDCTemporaryDrawer(root);
  const el = root.querySelector('#foo');
  component.getDefaultFoundation().adapter_.makeElementUntabbable(el);
  assert.equal(el.getAttribute('tabindex'), '-1');
});

test(`adapter#notifyOpen fires an ${strings.OPEN_EVENT} custom event`, () => {
  const {root, component} = setupTest();
  const handler = td.func('notifyOpen handler');
  root.addEventListener(strings.OPEN_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyOpen();
  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyClose fires an ${strings.CLOSE_EVENT} custom event`, () => {
  const {root, component} = setupTest();
  const handler = td.func('notifyClose handler');
  root.addEventListener(strings.CLOSE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClose();
  td.verify(handler(td.matchers.anything()));
});

test('adapter#isRtl returns true for RTL documents', () => {
  const root = bel`
    <aside dir="rtl" class="mdc-drawer mdc-drawer--temporary">
      <nav class="mdc-drawer__drawer">
      </nav>
    </aside>
  `;
  document.body.appendChild(root);
  const component = new MDCTemporaryDrawer(root);
  assert.isOk(component.getDefaultFoundation().adapter_.isRtl());
});

test('adapter#isRtl returns false for explicit LTR documents', () => {
  const root = bel`
    <aside dir="ltr" class="mdc-drawer mdc-drawer--temporary">
      <nav class="mdc-drawer__drawer">
      </nav>
    </aside>
  `;
  document.body.appendChild(root);
  const component = new MDCTemporaryDrawer(root);
  assert.isNotOk(component.getDefaultFoundation().adapter_.isRtl());
});

test('adapter#isRtl returns false for implicit LTR documents', () => {
  const root = bel`
    <aside class="mdc-drawer mdc-drawer--temporary">
      <nav class="mdc-drawer__drawer">
      </nav>
    </aside>
  `;
  document.body.appendChild(root);
  const component = new MDCTemporaryDrawer(root);
  assert.isNotOk(component.getDefaultFoundation().adapter_.isRtl());
});

test('adapter#registerDocumentKeydownHandler attaches a "keydown" handler to the document', () => {
  const {component} = setupTest();
  const handler = td.func('keydownHandler');
  component.getDefaultFoundation().adapter_.registerDocumentKeydownHandler(handler);
  domEvents.emit(document, 'keydown');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterDocumentKeydownHandler removes a "keydown" handler from the document', () => {
  const {component} = setupTest();
  const handler = td.func('keydownHandler');
  document.addEventListener('keydown', handler);
  component.getDefaultFoundation().adapter_.deregisterDocumentKeydownHandler(handler);
  domEvents.emit(document, 'keydown');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#isDrawer returns true for the drawer element', () => {
  const {root, component} = setupTest();
  const drawer = root.querySelector(strings.DRAWER_SELECTOR);
  assert.isOk(component.getDefaultFoundation().adapter_.isDrawer(drawer));
});

test('adapter#isDrawer returns false for a non-drawer element', () => {
  const {root, component} = setupTest();
  assert.isNotOk(component.getDefaultFoundation().adapter_.isDrawer(root));
});

test('adapter#addBodyClass adds a class to the body', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.addBodyClass('mdc-drawer--scroll-lock');
  assert.isOk(document.querySelector('body').classList.contains('mdc-drawer--scroll-lock'));
});

test('adapter#removeBodyClass remove a class from the body', () => {
  const {component} = setupTest();
  const body = document.querySelector('body');

  body.classList.add('mdc-drawer--scroll-lock');
  component.getDefaultFoundation().adapter_.removeBodyClass('mdc-drawer--scroll-lock');
  assert.isNotOk(body.classList.contains('mdc-drawer--scroll-lock'));
});
