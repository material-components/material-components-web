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

function setupTest() {
  const root = getFixture();
  const component = new MDCTextFieldBottomLine(root);
  return {root, component};
}

test('#adapter.addClassToBottomLine adds a class to the bottom line', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClassToBottomLine('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('#adapter.removeClassFromBottomLine removes a class from the bottom line', () => {
  const {root, component} = setupTest();

  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromBottomLine('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('#adapter.setBottomLineAttr adds a given attribute to the bottom line', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setBottomLineAttr('aria-label', 'foo');
  assert.equal(root.getAttribute('aria-label'), 'foo');
});

test('#adapter.registerTransitionEndHandler adds event listener for "transitionend" to bottom line', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  component.getDefaultFoundation().adapter_.registerTransitionEndHandler(handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterTransitionEndHandler removes event listener for "transitionend" from bottom line', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');

  root.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterTransitionEndHandler(handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.notifyOpacityTransitionEnd emits ' +
  `${MDCTextFieldBottomLineFoundation.strings.OPACITY_TRANSITION_END_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('leadingHandler');

  component.listen(
    MDCTextFieldBottomLineFoundation.strings.OPACITY_TRANSITION_END_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyOpacityTransitionEnd();

  td.verify(handler(td.matchers.anything()));
});
