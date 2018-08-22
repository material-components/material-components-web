/**
 * @license
 * Copyright 2017 Google Inc.
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
import {createMockRaf} from '../helpers/raf';
import {strings} from '../../../packages/mdc-dialog/constants';
import {MDCDialog, util} from '../../../packages/mdc-dialog';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';

function getFixture() {
  return bel`
    <div>
      <button class="open-dialog">click</button>
      <aside id="my-dialog" class="mdc-dialog"
        role="alertdialog"
        aria-hidden="true"
        aria-labelledby="my-dialog-label"
        aria-describedby="my-dialog-description">
        <div class="mdc-dialog__surface">
          <header class="mdc-dialog__header">
            <h2 id="my-dialog-label" class="mdc-dialog__header__title">
              Use Google's location service?
            </h2>
          </header>
          <section id="my-dialog-description" class="mdc-dialog__body">
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

function hasClassMatcher(className) {
  return td.matchers.argThat((el) => el.classList && el.classList.contains(className));
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
  const wasOpen = component.open;
  // Deactivate focus trapping, preventing other tests that use focus from failing
  component.destroy();
  assert.isTrue(wasOpen);
});

test('#close hides the dialog', () => {
  const {component} = setupTest();

  component.close();
  assert.isFalse(component.open);
});

test('adapter#addClass adds a class to the root element', () => {
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

test(`adapter#notifyAccept emits ${strings.ACCEPT_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('acceptHandler');

  component.listen(strings.ACCEPT_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyAccept();

  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyCancel emits ${strings.CANCEL_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('cancelHandler');

  component.listen(strings.CANCEL_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyCancel();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#trapFocusOnSurface calls activate() on a properly configured focus trap instance', () => {
  const {createFocusTrapInstance} = util;
  util.createFocusTrapInstance = td.func('util.createFocusTrapInstance');

  const fakeFocusTrapInstance = td.object({
    activate: () => {},
    deactivate: () => {},
  });
  td.when(
    util.createFocusTrapInstance(
      hasClassMatcher('mdc-dialog__surface'),
      hasClassMatcher('mdc-dialog__footer__button--accept')
    )
  ).thenReturn(fakeFocusTrapInstance);

  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.trapFocusOnSurface();
  util.createFocusTrapInstance = createFocusTrapInstance;

  td.verify(fakeFocusTrapInstance.activate());
});

test('adapter#untrapFocusOnSurface calls deactivate() on a properly configured focus trap instance', () => {
  const {createFocusTrapInstance} = util;
  util.createFocusTrapInstance = td.func('util.createFocusTrapInstance');

  const fakeFocusTrapInstance = td.object({
    activate: () => {},
    deactivate: () => {},
  });
  td.when(
    util.createFocusTrapInstance(
      hasClassMatcher('mdc-dialog__surface'),
      hasClassMatcher('mdc-dialog__footer__button--accept')
    )
  ).thenReturn(fakeFocusTrapInstance);

  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.untrapFocusOnSurface();
  util.createFocusTrapInstance = createFocusTrapInstance;

  td.verify(fakeFocusTrapInstance.deactivate());
});

test('adapter#isDialog returns true for the dialog surface element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  assert.isOk(component.getDefaultFoundation().adapter_.isDialog(dialog));
});

test('adapter#isDialog returns false for a non-dialog surface element', () => {
  const {root, component} = setupTest();
  assert.isNotOk(component.getDefaultFoundation().adapter_.isDialog(root));
});
