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
      <div id="my-dialog"
           class="mdc-dialog"
           role="alertdialog"
           aria-hidden="true"
           aria-labelledby="my-dialog-label"
           aria-describedby="my-dialog-description">
        <div class="mdc-dialog__container">
          <h2 class="mdc-dialog__title" id="my-dialog-label">
            Use Google's location service?
          </h2>
          <section class="mdc-dialog__content" id="my-dialog-description">
            Let Google help apps determine location.
          </section>
          <footer class="mdc-dialog__actions">
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">Cancel</button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">No</button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">Yes</button>
          </footer>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
    </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const openDialog = fixture.querySelector('.open-dialog');
  const root = fixture.querySelector('.mdc-dialog');
  const component = new MDCDialog(root);
  const yesButton = fixture.querySelector('[data-mdc-dialog-action="yes"]');
  const noButton = fixture.querySelector('[data-mdc-dialog-action="no"]');
  const cancelButton = fixture.querySelector('[data-mdc-dialog-action="cancel"]');
  return {openDialog, root, yesButton, noButton, cancelButton, component};
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
    const {yesButton, noButton, cancelButton} = setupTest();
    raf.flush();

    assert.isTrue(yesButton.classList.contains('mdc-ripple-upgraded'));
    assert.isTrue(noButton.classList.contains('mdc-ripple-upgraded'));
    assert.isTrue(cancelButton.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });

  test('#destroy cleans up all ripples on footer buttons', () => {
    const raf = createMockRaf();
    const {component, yesButton, noButton, cancelButton} = setupTest();
    raf.flush();

    component.destroy();
    raf.flush();

    assert.isFalse(yesButton.classList.contains('mdc-ripple-upgraded'));
    assert.isFalse(noButton.classList.contains('mdc-ripple-upgraded'));
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

test('adapter#registerContainerInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.CONTAINER_SELECTOR);
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerContainerInteractionHandler('click', handler);
  domEvents.emit(dialog, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterContainerInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.CONTAINER_SELECTOR);
  const handler = td.func('eventHandler');

  dialog.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterContainerInteractionHandler('click', handler);
  domEvents.emit(dialog, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerDocumentKeyDownHandler attaches a "keydown" handler to the document', () => {
  const {component} = setupTest();
  const handler = td.func('keydownHandler');

  component.getDefaultFoundation().adapter_.registerDocumentKeyDownHandler(handler);
  domEvents.emit(document, 'keydown');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterDocumentKeyDownHandler removes a "keydown" handler from the document', () => {
  const {component} = setupTest();
  const handler = td.func('keydownHandler');

  document.addEventListener('keydown', handler);
  component.getDefaultFoundation().adapter_.deregisterDocumentKeyDownHandler(handler);
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

test('adapter#eventTargetMatchesSelector returns whether or not the className is in the target\'s classList', () => {
  const {component} = setupTest();
  const target = bel`<div data-existent-attr></div>`;
  const {adapter_: adapter} = component.getDefaultFoundation();

  assert.isTrue(adapter.eventTargetMatchesSelector(target, '[data-existent-attr]'));
  assert.isFalse(adapter.eventTargetMatchesSelector(target, '[data-non-existent-attr]'));
});

test(`adapter#notifyYes emits ${strings.YES_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('yesHandler');

  component.listen(strings.YES_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyYes();

  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyNo emits ${strings.NO_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('noHandler');

  component.listen(strings.NO_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyNo();

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
    activate: td.func('focusTrap#activate'),
    deactivate: td.func('focusTrap#deactivate'),
  });

  td.when(util.createFocusTrapInstance(hasClassMatcher('mdc-dialog__container')))
    .thenReturn(fakeFocusTrapInstance);

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

  td.when(util.createFocusTrapInstance(hasClassMatcher('mdc-dialog__container')))
    .thenReturn(fakeFocusTrapInstance);

  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.untrapFocusOnSurface();
  util.createFocusTrapInstance = createFocusTrapInstance;

  td.verify(fakeFocusTrapInstance.deactivate());
});
