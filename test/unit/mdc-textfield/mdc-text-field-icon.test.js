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

import bel from 'bel';
import {assert} from 'chai';
import td from 'testdouble';
import domEvents from 'dom-events';

import {MDCTextFieldIcon, MDCTextFieldIconFoundation} from '../../../packages/mdc-textfield/icon/index';

const getFixture = () => bel`
  <div class="mdc-text-field__icon mdc-text-field__icon--leading"></div>
`;

suite('MDCTextFieldIcon');

test('attachTo returns an MDCTextFieldIcon instance', () => {
  assert.isOk(MDCTextFieldIcon.attachTo(getFixture()) instanceof MDCTextFieldIcon);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTextFieldIcon(root);
  return {root, component};
}

test('#adapter.getAttr returns the value of a given attribute on the element', () => {
  const {root, component} = setupTest();
  const expectedAttr = 'tabindex';
  const expectedValue = '0';
  root.setAttribute(expectedAttr, expectedValue);
  assert.equal(component.getDefaultFoundation().adapter_.getAttr(expectedAttr), expectedValue);
});

test('#adapter.setAttr adds a given attribute to the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('aria-label', 'foo');
  assert.equal(root.getAttribute('aria-label'), 'foo');
});

test('#adapter.removeAttr removes a given attribute from the element', () => {
  const {root, component} = setupTest();
  root.setAttribute('role', 'button');
  component.getDefaultFoundation().adapter_.removeAttr('role');
  assert.isFalse(root.hasAttribute('role'));
});

test('#adapter.setContent sets the text content of the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setContent('foo');
  assert.equal(root.textContent, 'foo');
});

test('#adapter.registerInteractionHandler adds event listener for a given event to the element', () => {
  const {root, component} = setupTest();
  const handler = td.func('keydown handler');
  component.getDefaultFoundation().adapter_.registerInteractionHandler('keydown', handler);
  domEvents.emit(root, 'keydown');

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterInteractionHandler removes event listener for a given event from the element', () => {
  const {root, component} = setupTest();
  const handler = td.func('keydown handler');

  root.addEventListener('keydown', handler);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('keydown', handler);
  domEvents.emit(root, 'keydown');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.notifyIconAction emits ' + `${MDCTextFieldIconFoundation.strings.ICON_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('handler');

  component.listen(MDCTextFieldIconFoundation.strings.ICON_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyIconAction();

  td.verify(handler(td.matchers.anything()));
});
