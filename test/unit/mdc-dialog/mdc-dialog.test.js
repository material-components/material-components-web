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
import {MDCDialog, MDCDialogFoundation, util} from '../../../packages/mdc-dialog';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';

function getFixture() {
  return bel`
    <div>
      <button class="open-dialog-button">click</button>
      <div id="test-dialog"
           class="mdc-dialog"
           role="alertdialog"
           aria-labelledby="test-dialog-label"
           aria-describedby="test-dialog-description">
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface">
            <h2 class="mdc-dialog__title">
              Use Google's location service?
            </h2>
            <section class="mdc-dialog__content">
              Let Google help apps determine location.
            </section>
            <footer class="mdc-dialog__actions">
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel"
                      type="button">Cancel</button>
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no"
                      type="button">No</button>
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                      type="button">Yes</button>
            </footer>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
    </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const root = fixture.querySelector('.mdc-dialog');
  const component = new MDCDialog(root);
  const title = fixture.querySelector('.mdc-dialog__title');
  const content = fixture.querySelector('.mdc-dialog__content');
  const yesButton = fixture.querySelector('[data-mdc-dialog-action="yes"]');
  const noButton = fixture.querySelector('[data-mdc-dialog-action="no"]');
  const cancelButton = fixture.querySelector('[data-mdc-dialog-action="cancel"]');
  return {root, component, title, content, yesButton, noButton, cancelButton};
}

function setupTestWithMocks() {
  const root = getFixture();

  const MockFoundationCtor = td.constructor(MDCDialogFoundation);
  const mockFoundation = new MockFoundationCtor();
  const mockFocusTrapInstance = td.object({
    activate: () => {},
    deactivate: () => {},
  });

  const component = new MDCDialog(root, mockFoundation, () => mockFocusTrapInstance);
  return {root, component, mockFoundation, mockFocusTrapInstance};
}

suite('MDCDialog');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCDialog.attachTo(getFixture().querySelector('.mdc-dialog')) instanceof MDCDialog);
});

test('#initialSyncWithDOM registers click handler on the root element', () => {
  const {root, component, mockFoundation} = setupTestWithMocks();
  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.isA(Event)), {times: 1});
  component.destroy();
});

test('#destroy deregisters click handler on the root element', () => {
  const {root, component, mockFoundation} = setupTestWithMocks();
  component.destroy();
  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.isA(Event)), {times: 0});
});

test(`${strings.OPENING_EVENT} registers document keydown handler and ${strings.CLOSING_EVENT} deregisters it`, () => {
  const {root, mockFoundation} = setupTestWithMocks();
  domEvents.emit(root, strings.OPENING_EVENT);
  domEvents.emit(document, 'keydown');
  td.verify(mockFoundation.handleDocumentKeydown(td.matchers.isA(Event)), {times: 1});

  domEvents.emit(root, strings.CLOSING_EVENT);
  domEvents.emit(document, 'keydown');
  td.verify(mockFoundation.handleDocumentKeydown(td.matchers.isA(Event)), {times: 1});
});

test(`${strings.OPENING_EVENT} registers window resize handler and ${strings.CLOSING_EVENT} deregisters it`, () => {
  const {root, mockFoundation} = setupTestWithMocks();
  domEvents.emit(root, strings.OPENING_EVENT);
  domEvents.emit(window, 'resize');
  td.verify(mockFoundation.layout(), {times: 1});

  domEvents.emit(root, strings.CLOSING_EVENT);
  domEvents.emit(window, 'resize');
  td.verify(mockFoundation.layout(), {times: 1});
});

test(`${strings.OPENING_EVENT} registers window orientationchange handler and ${strings.CLOSING_EVENT} deregisters it`,
  () => {
    const {root, mockFoundation} = setupTestWithMocks();
    domEvents.emit(root, strings.OPENING_EVENT);
    domEvents.emit(window, 'orientationchange');
    td.verify(mockFoundation.layout(), {times: 1});

    domEvents.emit(root, strings.CLOSING_EVENT);
    domEvents.emit(window, 'orientationchange');
    td.verify(mockFoundation.layout(), {times: 1});
  });

test('#initialize attaches ripple elements to all footer buttons', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const raf = createMockRaf();
  const {yesButton, noButton, cancelButton} = setupTest();
  raf.flush();

  assert.isTrue(yesButton.classList.contains('mdc-ripple-upgraded'));
  assert.isTrue(noButton.classList.contains('mdc-ripple-upgraded'));
  assert.isTrue(cancelButton.classList.contains('mdc-ripple-upgraded'));
  raf.restore();
});

test('#destroy cleans up all ripples on footer buttons', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

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

test('#open forwards to MDCDialogFoundation#open', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.open();
  td.verify(mockFoundation.open());
});

test('#close forwards to MDCDialogFoundation#close', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  const action = 'action';

  component.close(action);
  td.verify(mockFoundation.close(action));

  component.close();
  td.verify(mockFoundation.close(''));
});

test('get isOpen forwards to MDCDialogFoundation#isOpen', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.isOpen;
  td.verify(mockFoundation.isOpen());
});

test('get escapeKeyAction forwards to MDCDialogFoundation#getEscapeKeyAction', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.escapeKeyAction;
  td.verify(mockFoundation.getEscapeKeyAction());
});

test('set escapeKeyAction forwards to MDCDialogFoundation#setEscapeKeyAction', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.escapeKeyAction = 'action';
  td.verify(mockFoundation.setEscapeKeyAction('action'));
});

test('get scrimClickAction forwards to MDCDialogFoundation#getScrimClickAction', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.scrimClickAction;
  td.verify(mockFoundation.getScrimClickAction());
});

test('set scrimClickAction forwards to MDCDialogFoundation#setScrimClickAction', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.scrimClickAction = 'action';
  td.verify(mockFoundation.setScrimClickAction('action'));
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

test('adapter#addBodyClass adds a class to the body', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.addBodyClass('mdc-dialog--scroll-lock');
  assert.isOk(document.querySelector('body').classList.contains('mdc-dialog--scroll-lock'));
});

test('adapter#removeBodyClass removes a class from the body', () => {
  const {component} = setupTest();
  const body = document.querySelector('body');

  body.classList.add('mdc-dialog--scroll-lock');
  component.getDefaultFoundation().adapter_.removeBodyClass('mdc-dialog--scroll-lock');
  assert.isNotOk(body.classList.contains('mdc-dialog--scroll-lock'));
});

test('adapter#eventTargetHasClass returns whether or not the className is in the target\'s classList', () => {
  const {component} = setupTest();
  const target = bel`<div class="existent-class"></div>`;
  const {adapter_: adapter} = component.getDefaultFoundation();

  assert.isTrue(adapter.eventTargetHasClass(target, 'existent-class'));
  assert.isFalse(adapter.eventTargetHasClass(target, 'non-existent-class'));
});

test('adapter#computeBoundingRect calls getBoundingClientRect() on root', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);

  try {
    assert.deepEqual(component.getDefaultFoundation().adapter_.computeBoundingRect(), root.getBoundingClientRect());
  } finally {
    document.body.removeChild(root);
  }
});

test(`adapter#notifyOpening emits ${strings.OPENING_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyOpeningHandler');

  component.listen(strings.OPENING_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyOpening();
  component.unlisten(strings.OPENING_EVENT, handler);

  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyOpened emits ${strings.OPENED_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyOpenedHandler');

  component.listen(strings.OPENED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyOpened();
  component.unlisten(strings.OPENED_EVENT, handler);

  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyClosing emits ${strings.CLOSING_EVENT} without action if passed action is empty string`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyClosingHandler');

  component.listen(strings.CLOSING_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosing('');
  component.unlisten(strings.CLOSING_EVENT, handler);

  td.verify(handler(td.matchers.contains({detail: {}})));
});

test(`adapter#notifyClosing emits ${strings.CLOSING_EVENT} with action`, () => {
  const {component} = setupTest();
  const action = 'action';

  const handler = td.func('notifyClosingHandler');

  component.listen(strings.CLOSING_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosing(action);
  component.unlisten(strings.CLOSING_EVENT, handler);

  td.verify(handler(td.matchers.contains({detail: {action}})));
});

test(`adapter#notifyClosed emits ${strings.CLOSED_EVENT} without action if passed action is empty string`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyClosedHandler');

  component.listen(strings.CLOSED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosed('');
  component.unlisten(strings.CLOSED_EVENT, handler);

  td.verify(handler(td.matchers.contains({detail: {}})));
});

test(`adapter#notifyClosed emits ${strings.CLOSED_EVENT} with action`, () => {
  const {component} = setupTest();
  const action = 'action';

  const handler = td.func('notifyClosedHandler');

  component.listen(strings.CLOSED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosed(action);
  component.unlisten(strings.CLOSED_EVENT, handler);

  td.verify(handler(td.matchers.contains({detail: {action}})));
});

test('adapter#trapFocus calls activate() on a properly configured focus trap instance', () => {
  const {component, mockFocusTrapInstance} = setupTestWithMocks();
  component.initialize();
  component.getDefaultFoundation().adapter_.trapFocus();

  td.verify(mockFocusTrapInstance.activate());
});

test('adapter#releaseFocus calls deactivate() on a properly configured focus trap instance', () => {
  const {component, mockFocusTrapInstance} = setupTestWithMocks();
  component.initialize();
  component.getDefaultFoundation().adapter_.releaseFocus();

  td.verify(mockFocusTrapInstance.deactivate());
});

test('adapter#isContentScrollable returns false when there is no content element', () => {
  const {component, content} = setupTest();
  content.parentElement.removeChild(content);
  const isContentScrollable = component.getDefaultFoundation().adapter_.isContentScrollable();
  assert.isFalse(isContentScrollable);
});

test('adapter#isContentScrollable returns result of util.isScrollable', () => {
  const {component, content} = setupTest();
  assert.strictEqual(component.getDefaultFoundation().adapter_.isContentScrollable(), util.isScrollable(content));
});

test('adapter#areButtonsStacked returns result of util.areTopsMisaligned', () => {
  const {component, yesButton, noButton, cancelButton} = setupTest();
  assert.strictEqual(
    component.getDefaultFoundation().adapter_.areButtonsStacked(),
    util.areTopsMisaligned([yesButton, noButton, cancelButton]));
});

test('adapter#getActionFromEvent returns attribute value', () => {
  const {component, yesButton} = setupTest();
  const action = component.getDefaultFoundation().adapter_.getActionFromEvent({target: yesButton});
  assert.equal(action, 'yes');
});

test('adapter#getActionFromEvent returns null when attribute is not present', () => {
  const {component, title} = setupTest();
  const action = component.getDefaultFoundation().adapter_.getActionFromEvent({target: title});
  assert.isNull(action);
});

test('#layout proxies to foundation', () => {
  const {component} = setupTest();
  component.foundation_.layout = td.func('component.foundation_.layout');
  component.layout();
  td.verify(component.foundation_.layout());
});
