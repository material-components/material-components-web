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
  const component = new MDCSnackbar(root);
  return {root, component};
}

suite('MDCSnackbar');

test('attachTo initializes and returns a MDCSnackbar instance', () => {
  assert.isOk(MDCSnackbar.attachTo(getFixture()) instanceof MDCSnackbar);
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
