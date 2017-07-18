/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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
import td from 'testdouble';
import domEvents from 'dom-events';

import {MDCSnackbar, MDCSnackbarFoundation} from '../../../packages/mdc-snackbar';

const {strings} = MDCSnackbarFoundation;

function getFixture() {
  return bel`
    <div class="mdc-snackbar" aria-live="assertive" aria-atomic="true" aria-hidden="true">
      <div class="mdc-snackbar__text"></div>
      <div class="mdc-snackbar__action-wrapper">
        <button type="button" class="mdc-button mdc-snackbar__action-button"></button>
      </div>
    </div>
  `;
}

function setupTest() {
  const root = getFixture();
  const actionButton = root.querySelector(strings.ACTION_BUTTON_SELECTOR);
  const component = new MDCSnackbar(root);
  return {root, actionButton, component};
}

suite('MDCSnackbar');

test('attachTo initializes and returns a MDCSnackbar instance', () => {
  assert.isOk(MDCSnackbar.attachTo(getFixture()) instanceof MDCSnackbar);
});

test('show() delegates to the foundation', () => {
  const {component} = setupTest();
  component.foundation_.show = td.function();
  component.show('data');
  td.verify(component.foundation_.show('data'));
});

test('show() and click', () => {
  const {root, component} = setupTest();
  const data = {
    message: 'Message Deleted',
    actionText: 'Undo',
    actionHandler: td.function(),
  };
  component.show(data);
  root.querySelector(strings.ACTION_BUTTON_SELECTOR).click();
  td.verify(data.actionHandler());
});

test('foundationAdapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('foundationAdapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('foundationAdapter#setAriaHidden adds aria-hidden="true" to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAriaHidden();
  assert.isOk(root.getAttribute('aria-hidden'));
});

test('foundationAdapter#unsetAriaHidden removes "aria-hidden" from the root element', () => {
  const {root, component} = setupTest();
  root.setAttribute('aria-hidden', true);
  component.getDefaultFoundation().adapter_.unsetAriaHidden();
  assert.isNotOk(root.getAttribute('aria-hidden'));
});

test('foundationAdapter#setMessageText sets the text content of the text element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setMessageText('Message Deleted');
  assert.equal(root.querySelector(strings.TEXT_SELECTOR).textContent, 'Message Deleted');
});

test('foundationAdapter#setActionText sets the text content of the action button element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setActionText('Undo');
  assert.equal(root.querySelector(strings.ACTION_BUTTON_SELECTOR).textContent, 'Undo');
});

test('foundationAdapter#setActionAriaHidden adds aria-hidden="true" to the action button element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setActionAriaHidden();
  assert.isOk(root.querySelector(strings.ACTION_BUTTON_SELECTOR).getAttribute('aria-hidden'));
});

test('foundationAdapter#unsetActionAriaHidden removes "aria-hidden" from the action button element', () => {
  const {root, component} = setupTest();
  const actionButton = root.querySelector(strings.ACTION_BUTTON_SELECTOR);
  actionButton.setAttribute('aria-hidden', true);
  component.getDefaultFoundation().adapter_.unsetActionAriaHidden();
  assert.isNotOk(actionButton.getAttribute('aria-hidden'));
});

test('adapter#setFocus sets focus on the action button', () => {
  const {root, actionButton, component} = setupTest();
  const handler = td.func('fixture focus handler');
  root.addEventListener('focus', handler);
  document.body.appendChild(root);

  component.getDefaultFoundation().adapter_.setFocus();

  assert.equal(document.activeElement, actionButton);
  document.body.removeChild(root);
});

test('adapter#visibilityIsHidden returns the document.hidden property', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.visibilityIsHidden(), document.hidden);
});

test('adapter#registerCapturedBlurHandler adds a handler to be called on a blur event', () => {
  const {actionButton, component} = setupTest();
  const handler = td.func('blurHandler');

  component.getDefaultFoundation().adapter_.registerCapturedBlurHandler(handler);
  domEvents.emit(actionButton, 'blur');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterCapturedBlurHandler removes a handler to be called on a blur event', () => {
  const {actionButton, component} = setupTest();
  const handler = td.func('blurHandler');

  actionButton.addEventListener('blur', handler, true);
  component.getDefaultFoundation().adapter_.deregisterCapturedBlurHandler(handler);
  domEvents.emit(actionButton, 'blur');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerVisibilityChangeHandler adds a handler to be called on a visibilitychange event', () => {
  const {component} = setupTest();
  const handler = td.func('visibilitychangeHandler');

  component.getDefaultFoundation().adapter_.registerVisibilityChangeHandler(handler);
  domEvents.emit(document, 'visibilitychange');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterVisibilityChangeHandler removes a handler to be called on a visibilitychange event', () => {
  const {component} = setupTest();
  const handler = td.func('visibilitychangeHandler');

  document.addEventListener('visibilitychange', handler);
  component.getDefaultFoundation().adapter_.deregisterVisibilityChangeHandler(handler);
  domEvents.emit(document, 'visibilitychange');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerCapturedInteractionHandler adds a handler to be called when a given event occurs', () => {
  const {component} = setupTest();
  const handler = td.func('interactionHandler');
  const mockEvent = 'click';

  component.getDefaultFoundation().adapter_.registerCapturedInteractionHandler(mockEvent, handler);
  domEvents.emit(document.body, mockEvent);

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterCapturedInteractionHandler removes a handler to be called when a given event occurs', () => {
  const {component} = setupTest();
  const handler = td.func('interactionHandler');
  const mockEvent = 'click';

  document.body.addEventListener(mockEvent, handler, true);
  component.getDefaultFoundation().adapter_.deregisterCapturedInteractionHandler(mockEvent, handler);
  domEvents.emit(document.body, mockEvent);

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('foundationAdapter#registerActionClickHandler adds the handler to be called when action is clicked', () => {
  const {root, component} = setupTest();
  const handler = td.func('clickHandler');

  component.getDefaultFoundation().adapter_.registerActionClickHandler(handler);

  root.querySelector(strings.ACTION_BUTTON_SELECTOR).click();
  td.verify(handler(td.matchers.anything()));
});

test('foundationAdapter#deregisterActionClickHandler removes the handler to be called when action is clicked', () => {
  const {root, component} = setupTest();
  const handler = td.func('clickHandler');
  const actionButton = root.querySelector(strings.ACTION_BUTTON_SELECTOR);

  actionButton.addEventListener('click', handler);

  component.getDefaultFoundation().adapter_.deregisterActionClickHandler(handler);

  actionButton.click();

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('foundationAdapter#registerTransitionEndHandler adds an event listener to the root', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionEndHandler');

  component.getDefaultFoundation().adapter_.registerTransitionEndHandler(handler);

  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()));
});

test('foundationAdapter#deregisterTransitionEndHandler adds an event listener to the root', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionEndHandler');

  root.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterTransitionEndHandler(handler);

  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#get dismissesOnAction property dispatches to foundation_', () => {
  const {component} = setupTest();

  assert.isTrue(component.dismissesOnAction);
  component.foundation_.setDismissOnAction(false);
  assert.isFalse(component.dismissesOnAction);
});

test('#set dismissesOnAction property dispatches to foundation_', () => {
  const {component} = setupTest();

  assert.isTrue(component.foundation_.dismissesOnAction());
  component.dismissesOnAction = false;
  assert.isFalse(component.foundation_.dismissesOnAction());
});
