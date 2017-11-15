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

import bel from 'bel';
import {assert} from 'chai';
import td from 'testdouble';
import domEvents from 'dom-events';

import {MDCTextFieldBottomLine, MDCTextFieldBottomLineFoundation} from '../../../packages/mdc-textfield/bottom-line';

const getFixture = () => bel`
  <div class="mdc-textfield__bottom-line"></div>
`;

suite('MDCTextFieldBottomLine');

test('attachTo returns an MDCTextFieldBottomLine instance', () => {
  assert.isOk(MDCTextFieldBottomLine.attachTo(getFixture()) instanceof MDCTextFieldBottomLine);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTextFieldBottomLine(root);
  return {root, component};
}

test('#adapter.addClass adds a class to the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('#adapter.removeClass removes a class from the element', () => {
  const {root, component} = setupTest();

  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('#adapter.setAttr adds a given attribute to the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('aria-label', 'foo');
  assert.equal(root.getAttribute('aria-label'), 'foo');
});

test('#adapter.registerEventHandler adds event listener for a given event to the element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  component.getDefaultFoundation().adapter_.registerEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterEventHandler removes event listener for a given event from the element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');

  root.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.notifyAnimationEnd emits ' +
  `${MDCTextFieldBottomLineFoundation.strings.ANIMATION_END_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('leadingHandler');

  component.listen(
    MDCTextFieldBottomLineFoundation.strings.ANIMATION_END_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyAnimationEnd();

  td.verify(handler(td.matchers.anything()));
});
