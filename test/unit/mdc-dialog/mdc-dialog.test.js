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
import {strings} from '../../../packages/mdc-dialog/constants';

import {MDCDialog} from '../../../packages/mdc-dialog';

class MockDialog {
  constructor() {
    this.open = true;
  }
}

function getFixture() {
  return bel`
    <div>
      <button class="open-dialog">click</button>
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
    </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const openDialog = fixture.querySelector('.open-dialog');
  const root = fixture.querySelector('.mdc-dialog');
  const component = new MDCDialog(root);
  const acceptButton = fixture.querySelector('.mdc-dialog--accept');
  const cancelButton = fixture.querySelector('.mdc-dialog--cancel');
  return {openDialog, root, acceptButton, cancelButton, component};
}

suite('MDCDialog');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCDialog.attachTo(getFixture().querySelector('.mdc-dialog')) instanceof MDCDialog);
});

test('get/set open', () => {
  const {root, openDialog, component} = setupTest();

  component.open = true;
  assert.isOk(root.classList.contains('mdc-dialog--open'));
  assert.isOk(component.open);
  
  component.open = false;
  assert.isNotOk(root.classList.contains('mdc-dialog--open'));
  assert.isNotOk(component.open);
});

test('adapter#backgroundEl returns background element', () => {
  const {component} = setupTest();
  
  component.open = true;
  assert.isOk(component.getDefaultFoundation().adapter_.backgroundEl());
});

test('adapter#dialogEl returns dialog element', () => {
  const {component} = setupTest();
  
  component.open = true;
  assert.isOk(component.getDefaultFoundation().adapter_.dialogEl());
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

test('adapter#addScrollLockClass adds a class to the body, locking the background scroll', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.addScrollLockClass('mdc-dialog--scroll-lock');
  assert.isOk(document.querySelector('body').classList.contains('mdc-dialog--scroll-lock'));
});

test('adapter#removeScrollLockClass adds a class to the body, locking the background scroll', () => {
  const {component} = setupTest();
  const body = document.querySelector('body');
  
  body.classList.add('mdc-dialog--scroll-lock');
  component.getDefaultFoundation().adapter_.removeScrollLockClass('mdc-dialog--scroll-lock');
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

test('adapter#registerDialogInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerDialogInteractionHandler('click', handler);
  domEvents.emit(dialog, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterDialogInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  const handler = td.func('eventHandler');
  
  dialog.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterDialogInteractionHandler('click', handler);
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

test('adapter#registerAcceptHandler attaches a "click" handler to the accept button', () => {
  const {acceptButton, component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerAcceptHandler(handler);
  domEvents.emit(acceptButton, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterAcceptHandler removes a "click" handler from the accept button', () => {
  const {acceptButton, component} = setupTest();
  const handler = td.func('eventHandler');

  acceptButton.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterAcceptHandler(handler);
  domEvents.emit(document, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerCancelHandler attaches a "click" handler to the cancel button', () => {
  const {cancelButton, component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerCancelHandler(handler);
  domEvents.emit(cancelButton, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterCancelHandler removes a "click" handler from the cancel button', () => {
  const {cancelButton, component} = setupTest();
  const handler = td.func('eventHandler');

  cancelButton.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterCancelHandler(handler);
  domEvents.emit(document, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerFocusTrappingHandler attaches a "focus" handler to the document', () => {
  const {component} = setupTest();
  const handler = td.func('focusHandler');
  
  component.getDefaultFoundation().adapter_.registerFocusTrappingHandler(handler);
  domEvents.emit(document, 'focus');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterFocusTrappingHandler removes a "focus" handler from the document', () => {
  const {component} = setupTest();
  const handler = td.func('focusHandler');
  
  document.addEventListener('focus', handler);
  component.getDefaultFoundation().adapter_.deregisterFocusTrappingHandler(handler);
  domEvents.emit(document, 'focus');
  td.verify(handler(td.matchers.anything()), {times: 0});
});
