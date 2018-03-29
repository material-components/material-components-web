/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {createMockRaf} from '../helpers/raf';
import {MDCTab, MDCTabFoundation} from '../../../packages/mdc-tab';

const getFixture = () => bel`
  <button class="mdc-tab" aria-selected="false" role="tab">
    <div class="mdc-tab__content">
      <span class="mdc-tab__text-label">Foo</span>
      <span class="mdc-tab__icon"></span>
    </div>
  </button>
`;

suite('MDCTab');

test('attachTo returns an MDCTab instance', () => {
  assert.isTrue(MDCTab.attachTo(getFixture()) instanceof MDCTab);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTab(root);
  return {root, component};
}

test('#destroy removes the ripple', () => {
  const raf = createMockRaf();
  const {component, root} = setupTest();
  raf.flush();
  component.destroy();
  raf.flush();
  assert.isNotOk(root.classList.contains('mdc-ripple-upgraded'));
  raf.restore();
});

test('#adapter.addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('#adapter.removeClass removes a class to the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('#adapter.hasClass returns true if a class exists on the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.hasClass('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('#adapter.setAttr adds a given attribute to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('foo', 'bar');
  assert.equal(root.getAttribute('foo'), 'bar');
});

test('#adapter.registerEventHandler adds an event listener to the root element for a given event', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  component.getDefaultFoundation().adapter_.registerEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterEventHandler removes an event listener from the root element for a given event', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  root.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCTabFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCTab(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('#active getter calls isActive', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.active;
  td.verify(mockFoundation.isActive(), {times: 1});
});

test('#active set to true calls activate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.active = true;
  td.verify(mockFoundation.activate(), {times: 1});
});

test('#active set to false calls deactivate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.active = false;
  td.verify(mockFoundation.deactivate(), {times: 1});
});
