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

import {MDCLineRipple, MDCLineRippleFoundation} from '../../../packages/mdc-line-ripple';

const getFixture = () => bel`
  <div class="mdc-line-ripple"></div>
`;

suite('MDCLineRipple');

test('attachTo returns an MDCLineRipple instance', () => {
  assert.isOk(MDCLineRipple.attachTo(getFixture()) instanceof MDCLineRipple);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCLineRipple(root);
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
test('#adapter.hasClass returns true if a class is on the element', () => {
  const {root, component} = setupTest();

  root.classList.add('foo');
  const hasClass = component.getDefaultFoundation().adapter_.hasClass('foo');
  assert.isTrue(hasClass);
});

test('#adapter.setStyle adds a given style property to the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setStyle('color', 'blue');
  assert.equal(root.getAttribute('style'), 'color: blue;');
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

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCLineRippleFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCLineRipple(
    root,
    mockFoundation);
  return {root, component, mockFoundation};
}

test('activate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.activate();
  td.verify(mockFoundation.activate(), {times: 1});
});

test('deactivate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.deactivate();
  td.verify(mockFoundation.deactivate(), {times: 1});
});

test('setRippleCenter', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.setRippleCenter(100);
  td.verify(mockFoundation.setRippleCenter(100), {times: 1});
});
