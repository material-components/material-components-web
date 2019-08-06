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
import {strings, numbers} from '../../../packages/mdc-snackbar/constants';
import {MDCSnackbar, MDCSnackbarFoundation} from '../../../packages/mdc-snackbar/index';

/**
 * @return {!HTMLElement}
 */
function getFixture() {
  return bel`
    <div>
      <div class="mdc-snackbar">
        <div class="mdc-snackbar__surface">
          <div class="mdc-snackbar__label"
               role="status"
               aria-live="polite">Can't send photo. Retry in 5 seconds.</div>
          <div class="mdc-snackbar__actions">
            <button type="button" class="mdc-button mdc-snackbar__action">Retry</button>
            <button class="mdc-icon-button mdc-snackbar__dismiss material-icons" title="Dismiss">close</button>
          </div>
        </div>
      </div>
    </div>`;
}

/**
 * @param {!HTMLElement} fixture
 * @return {{
 *   root: !HTMLElement,
 *   component: MDCSnackbar, surface: !HTMLElement,
 *   label: !HTMLElement,
 *   actions: !HTMLElement,
 *   actionButton: !HTMLElement,
 *   actionIcon: !HTMLElement
 * }}
 */
function setupTest(fixture = getFixture()) {
  const root = fixture.querySelector('.mdc-snackbar');
  const surface = fixture.querySelector(strings.SURFACE_SELECTOR);
  const label = fixture.querySelector(strings.LABEL_SELECTOR);
  const actions = fixture.querySelector('.mdc-snackbar__actions');
  const actionButton = fixture.querySelector(strings.ACTION_SELECTOR);
  const actionIcon = fixture.querySelector(strings.DISMISS_SELECTOR);
  const announce = td.func('announce');
  const component = new MDCSnackbar(root, undefined, () => announce);
  return {component, announce, root, surface, label, actions, actionButton, actionIcon};
}

/**
 * @param {!HTMLElement} fixture
 * @return {{
 *   root: !HTMLElement,
 *   component: !MDCSnackbar,
 *   mockFoundation: !MDCSnackbarFoundation
 * }}
 */
function setupTestWithMocks(fixture = getFixture()) {
  const root = fixture.querySelector('.mdc-snackbar');
  const surface = fixture.querySelector(strings.SURFACE_SELECTOR);
  const label = fixture.querySelector(strings.LABEL_SELECTOR);
  const actions = fixture.querySelector('.mdc-snackbar__actions');
  const actionButton = fixture.querySelector(strings.ACTION_SELECTOR);
  const actionIcon = fixture.querySelector(strings.DISMISS_SELECTOR);

  const MockFoundationCtor = td.constructor(MDCSnackbarFoundation);

  /** @type {!MDCSnackbarFoundation} */
  const mockFoundation = new MockFoundationCtor();

  const announce = td.func('announce');

  /** @type {!MDCSnackbar} */
  const component = new MDCSnackbar(root, mockFoundation, () => announce);

  return {component, mockFoundation, announce, root, surface, label, actions, actionButton, actionIcon};
}

suite('MDCSnackbar');

test('attachTo returns a component instance', () => {
  assert.instanceOf(MDCSnackbar.attachTo(getFixture().querySelector('.mdc-snackbar')), MDCSnackbar);
});

test('#initialSyncWithDOM registers click handlers for action button and action icon', () => {
  const {component, mockFoundation, actionButton, actionIcon} = setupTestWithMocks();
  component.open();
  domEvents.emit(actionButton, 'click', {bubbles: true});
  td.verify(mockFoundation.handleActionButtonClick(td.matchers.isA(Event)), {times: 1});
  domEvents.emit(actionIcon, 'click', {bubbles: true});
  td.verify(mockFoundation.handleActionIconClick(td.matchers.isA(Event)), {times: 1});
  component.destroy();
});

test('#initialSyncWithDOM registers keydown handler on the window', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  component.open();
  domEvents.emit(window, 'keydown');
  td.verify(mockFoundation.handleKeyDown(td.matchers.isA(Event)), {times: 1});
  component.destroy();
});

test('#destroy deregisters click handler on the root element', () => {
  const {component, mockFoundation, actionButton, actionIcon} = setupTestWithMocks();
  component.open();
  component.destroy();
  domEvents.emit(actionButton, 'click', {bubbles: true});
  td.verify(mockFoundation.handleActionButtonClick(td.matchers.isA(Event)), {times: 0});
  domEvents.emit(actionIcon, 'click', {bubbles: true});
  td.verify(mockFoundation.handleActionIconClick(td.matchers.isA(Event)), {times: 0});
});

test('#destroy deregisters keydown handler on the root element', () => {
  const {component, mockFoundation, root} = setupTestWithMocks();
  component.open();
  component.destroy();
  domEvents.emit(root, 'keydown');
  td.verify(mockFoundation.handleKeyDown(td.matchers.isA(Event)), {times: 0});
});

test('clicking on surface does nothing', () => {
  const {component, mockFoundation, surface} = setupTestWithMocks();
  component.open();
  domEvents.emit(surface, 'click', {bubbles: true});
  td.verify(mockFoundation.handleActionButtonClick(td.matchers.isA(Event)), {times: 0});
  td.verify(mockFoundation.handleActionIconClick(td.matchers.isA(Event)), {times: 0});
  td.verify(mockFoundation.close(td.matchers.anything()), {times: 0});
  component.destroy();
});

test('#open announces to screen readers', () => {
  const {component, announce, label} = setupTest();

  component.open();
  td.verify(announce(label), {times: 1});
});

test('#open forwards to MDCSnackbarFoundation#open', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.open();
  td.verify(mockFoundation.open());
});

test('#close forwards to MDCSnackbarFoundation#close', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  const reason = 'reason';

  component.open();
  component.close(reason);
  td.verify(mockFoundation.close(reason));

  component.close();
  td.verify(mockFoundation.close(''));
});

test('get isOpen forwards to MDCSnackbarFoundation#isOpen', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.isOpen;
  td.verify(mockFoundation.isOpen());
});

test('get closeOnEscape forwards to MDCSnackbarFoundation#getCloseOnEscape', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.closeOnEscape;
  td.verify(mockFoundation.getCloseOnEscape());
});

test('set closeOnEscape forwards to MDCSnackbarFoundation#setCloseOnEscape', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.closeOnEscape = false;
  td.verify(mockFoundation.setCloseOnEscape(false));
  component.closeOnEscape = true;
  td.verify(mockFoundation.setCloseOnEscape(false));
});

test('get timeoutMs forwards to MDCSnackbarFoundation#getTimeoutMs', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.timeoutMs;
  td.verify(mockFoundation.getTimeoutMs());
});

test('set timeoutMs forwards to MDCSnackbarFoundation#setTimeoutMs', () => {
  const {component, mockFoundation} = setupTestWithMocks();

  component.timeoutMs = numbers.MAX_AUTO_DISMISS_TIMEOUT_MS;
  td.verify(mockFoundation.setTimeoutMs(numbers.MAX_AUTO_DISMISS_TIMEOUT_MS));
});

test('get labelText returns label textContent', () => {
  const {component, label} = setupTestWithMocks();

  assert.equal(component.labelText, label.textContent);
});

test('set labelText forwards to MDCSnackbarFoundation#setActionButtonText', () => {
  const {component} = setupTestWithMocks();

  component.labelText = 'foo';
  assert.equal(component.labelText, 'foo');
});

test('get actionButtonText returns button textContent', () => {
  const {component, actionButton} = setupTestWithMocks();

  assert.equal(component.actionButtonText, actionButton.textContent);
});

test('set actionButtonText forwards to MDCSnackbarFoundation#setActionButtonText', () => {
  const {component} = setupTestWithMocks();

  component.actionButtonText = 'foo';
  assert.equal(component.actionButtonText, 'foo');
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
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

test(`adapter#notifyClosing emits ${strings.CLOSING_EVENT} with reason`, () => {
  const {component} = setupTest();
  const reason = 'reason';

  const handler = td.func('notifyClosingHandler');

  component.listen(strings.CLOSING_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosing(reason);
  component.unlisten(strings.CLOSING_EVENT, handler);

  td.verify(handler(td.matchers.contains({detail: {reason}})));
});

test(`adapter#notifyClosed emits ${strings.CLOSED_EVENT} without reason if passed reason is empty string`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyClosedHandler');

  component.listen(strings.CLOSED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosed('');
  component.unlisten(strings.CLOSED_EVENT, handler);

  td.verify(handler(td.matchers.contains({detail: {}})));
});

test(`adapter#notifyClosed emits ${strings.CLOSED_EVENT} with reason`, () => {
  const {component} = setupTest();
  const reason = 'reason';

  const handler = td.func('notifyClosedHandler');

  component.listen(strings.CLOSED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosed(reason);
  component.unlisten(strings.CLOSED_EVENT, handler);

  td.verify(handler(td.matchers.contains({detail: {reason}})));
});
