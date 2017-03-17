/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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
import {createMockRaf} from '../helpers/raf';
import {strings} from '../../../packages/mdc-dialog/constants';
import {MDCDialog} from '../../../packages/mdc-dialog';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';

function getFixture() {
  return bel`
    <div>
      <button class="open-dialog">click</button>
      <aside class="mdc-dialog mdc-dialog--open"
        role="alertdialog"
        aria-hidden="true"
        aria-labelledby="mdc-dialog__first__label"
        aria-describedby="mdc-dialog__first__description">
        <div class="mdc-dialog__surface">
          <header class="mdc-dialog__header">
            <h2 id="mdc-dialog__first__label" class="mdc-dialog__header__title">
              Use Google's location service?
            </h2>
          </header>
          <section id="mdc-dialog__first__description" class="mdc-dialog__body">
            Let Google help apps determine location.
          </section>
          <footer class="mdc-dialog__footer">
            <button type="button" 
              class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">DECLINE</button>
            <button type="button" 
              class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">ACCEPT</button>
          </footer>
        </div>
        <div class="mdc-dialog__backdrop"></div>
      </aside>
    </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const openDialog = fixture.querySelector('.open-dialog');
  const root = fixture.querySelector('.mdc-dialog');
  const component = new MDCDialog(root);
  const acceptButton = fixture.querySelector('.mdc-dialog__footer__button--accept');
  const cancelButton = fixture.querySelector('.mdc-dialog__footer__button--cancel');
  return {openDialog, root, acceptButton, cancelButton, component};
}

suite('MDCDialog');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCDialog.attachTo(getFixture().querySelector('.mdc-dialog')) instanceof MDCDialog);
});

if (supportsCssVariables(window)) {
  test('#initialize attaches ripple elements to all footer buttons', () => {
    const raf = createMockRaf();
    const {acceptButton, cancelButton} = setupTest();
    raf.flush();

    assert.isTrue(acceptButton.classList.contains('mdc-ripple-upgraded'));
    assert.isTrue(cancelButton.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });

  test('#destroy cleans up all ripples on footer buttons', () => {
    const raf = createMockRaf();
    const {component, acceptButton, cancelButton} = setupTest();
    raf.flush();

    component.destroy();
    raf.flush();

    assert.isFalse(acceptButton.classList.contains('mdc-ripple-upgraded'));
    assert.isFalse(cancelButton.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });
}

test('#show opens the dialog', () => {
  const {component} = setupTest();

  component.show();
  assert.isTrue(component.open);
});

test('#close hides the dialog', () => {
  const {component} = setupTest();

  component.close();
  assert.isFalse(component.open);
});

test('adapter#hasClass returns true if the root element has specified class', () => {
  const {root, component} = setupTest();
  root.classList.add('foo'); assert.isOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#hasClass returns false if the root element does not have specified class', () => {
  const {component} = setupTest();
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
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

test('adapter#addBodyClass adds a class to the body, locking the background scroll', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.addBodyClass('mdc-dialog--scroll-lock');
  assert.isOk(document.querySelector('body').classList.contains('mdc-dialog--scroll-lock'));
});

test('adapter#removeBodyClass adds a class to the body, locking the background scroll', () => {
  const {component} = setupTest();
  const body = document.querySelector('body');

  body.classList.add('mdc-dialog--scroll-lock');
  component.getDefaultFoundation().adapter_.removeBodyClass('mdc-dialog--scroll-lock');
  assert.isNotOk(body.classList.contains('mdc-dialog--scroll-lock'));
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

test('adapter#registerSurfaceInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerSurfaceInteractionHandler('click', handler);
  domEvents.emit(dialog, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterSurfaceInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  const handler = td.func('eventHandler');

  dialog.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterSurfaceInteractionHandler('click', handler);
  domEvents.emit(dialog, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
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

test('adapter#eventTargetHasClass returns whether or not the className is in the target\'s classList', () => {
  const {component} = setupTest();
  const target = bel`<div class="existent-class"></div>`;
  const {adapter_: adapter} = component.getDefaultFoundation();

  assert.isTrue(adapter.eventTargetHasClass(target, 'existent-class'));
  assert.isFalse(adapter.eventTargetHasClass(target, 'non-existent-class'));
});

test('adapter#registerFocusTrappingHandler attaches a "focus" handler to the document', () => {
  const {component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerFocusTrappingHandler(handler);
  domEvents.emit(document, 'focus');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterFocusTrappingHandler removes a "focus" handler from the document', () => {
  const {component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerFocusTrappingHandler(handler);
  component.getDefaultFoundation().adapter_.deregisterFocusTrappingHandler(handler);
  domEvents.emit(document, 'focus');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#getFocusableElements returns all the focusable elements in the dialog', () => {
  const root = bel`
    <aside class="mdc-dialog"
      role="alertdialog"
      aria-hidden="true"
      aria-labelledby="mdc-dialog__first__label"
      aria-describedby="mdc-dialog__first__description">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2 id="mdc-dialog__first__label" class="mdc-dialog__header__title">
            Use Google's location service?
          </h2>
        </header>
        <section id="mdc-dialog__first__description" class="mdc-dialog__body">
          Let Google help apps determine location.
        </section>
        <footer class="mdc-dialog__footer">
          <button type="button" 
            class="mdc-button mdc-dialog__footer__button mdc-dialog--cancel">DECLINE</button>
          <button type="button" 
            class="mdc-button mdc-dialog__footer__button mdc-dialog--accept">ACCEPT</button>
        </footer>
      </div>
      <div class="mdc-dialog__backdrop"></div>
    </aside>
  `;
  const component = new MDCDialog(root);
  assert.equal(component.getDefaultFoundation().adapter_.getFocusableElements().length, 2);
});

test('adapter#makeElementUntabbable sets a tab index of -1 on the element', () => {
  const root = bel`
    <aside class="mdc-dialog mdc-dialog--open">
      <nav class="mdc-dialog__surface">
        <a id="foo" href="foo"></a>
      </nav>
    </aside>
  `;

  const component = new MDCDialog(root);
  const el = root.querySelector('#foo');
  component.getDefaultFoundation().adapter_.makeElementUntabbable(el);
  assert.equal(el.getAttribute('tabindex'), '-1');
});

test('adapter#notifyAccept emits MDCDialog:accept', () => {
  const {component} = setupTest();

  const handler = td.func('acceptHandler');

  component.listen('MDCDialog:accept', handler);
  component.getDefaultFoundation().adapter_.notifyAccept();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#notifyCancel emits MDCDialog:cancel', () => {
  const {component} = setupTest();

  const handler = td.func('cancelHandler');

  component.listen('MDCDialog:cancel', handler);
  component.getDefaultFoundation().adapter_.notifyCancel();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#setFocusedTarget focuses the target given to it', () => {
  const {component} = setupTest();
  const target = {
    focus: td.func('focus'),
  };

  component.getDefaultFoundation().adapter_.setFocusedTarget(target);

  td.verify(target.focus());
});

test('adapter#setBodyAttr sets an attribute to the given value on the body', () => {
  const {component} = setupTest();

  component.getDefaultFoundation().adapter_.setBodyAttr('aria-hidden', 'true');
  assert.equal(document.body.getAttribute('aria-hidden'), 'true');
  document.body.removeAttribute('aria-hidden');
});

test('adapter#rmBodyAttr removes an attribute from the body', () => {
  const {component} = setupTest();

  document.body.setAttribute('aria-hidden', 'true');
  component.getDefaultFoundation().adapter_.rmBodyAttr('aria-hidden');
  assert.isFalse(document.body.hasAttribute('aria-hidden'));
});

test('adapter#setAttr sets an attribute to the given value on the root element', () => {
  const {component, root} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('aria-hidden', 'true');
  assert.equal(root.getAttribute('aria-hidden'), 'true');
});
