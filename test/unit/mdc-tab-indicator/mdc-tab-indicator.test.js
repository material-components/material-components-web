/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
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

import {
  MDCTabIndicator,
  MDCSlidingTabIndicatorFoundation,
  MDCFadingTabIndicatorFoundation,
  MDCTabIndicatorFoundation,
} from '../../../packages/mdc-tab-indicator';

const getFixture = () => bel`
  <span class="mdc-tab-indicator">
    <span class="mdc-tab-indicator__content"></span>
  </span>
`;

const getFadingFixture = () => bel`
  <span class="mdc-tab-indicator mdc-tab-indicator--fade">
    <span class="mdc-tab-indicator__content"></span>
  </span>
`;

suite('MDCTabIndicator');

test('attachTo returns an MDCTabIndicator instance', () => {
  assert.isTrue(MDCTabIndicator.attachTo(getFixture()) instanceof MDCTabIndicator);
});

test('attachTo an icon returns an MDCTabIndicator instance', () => {
  assert.isTrue(MDCTabIndicator.attachTo(getFadingFixture()) instanceof MDCTabIndicator);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTabIndicator(root);
  const content = root.querySelector(MDCTabIndicatorFoundation.strings.CONTENT_SELECTOR);
  return {root, component, content};
}

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

test('#adapter.registerEventHandler adds an event listener on the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  component.getDefaultFoundation().adapter_.registerEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterEventHandler remoes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  root.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.computeContentClientRect returns the root element client rect', () => {
  const {component, root, content} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.computeContentClientRect(),
    content.getBoundingClientRect()
  );
  document.body.removeChild(root);
});

test('#adapter.setContentStyleProperty sets a style property on the root element', () => {
  const {component, content} = setupTest();
  component.getDefaultFoundation().adapter_.setContentStyleProperty('background-color', 'red');
  assert.strictEqual(content.style.backgroundColor, 'red');
});

function setupMockSlidingFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCSlidingTabIndicatorFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCTabIndicator(root, mockFoundation);
  return {root, component, mockFoundation};
}

function setupMockFadingFoundationTest(root = getFadingFixture()) {
  const MockFoundationConstructor = td.constructor(MDCFadingTabIndicatorFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCTabIndicator(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('#activate sliding indicator calls activate with passed args', () => {
  const {component, mockFoundation} = setupMockSlidingFoundationTest();
  component.activate({width: 100, left: 0});
  td.verify(mockFoundation.activate({width: 100, left: 0}), {times: 1});
});

test('#activate icon indicator calls activate with passed args', () => {
  const {component, mockFoundation} = setupMockFadingFoundationTest();
  component.activate({width: 1, left: 2});
  td.verify(mockFoundation.activate({width: 1, left: 2}), {times: 1});
});

test('#deactivate sliding indicator calls deactivate', () => {
  const {component, mockFoundation} = setupMockSlidingFoundationTest();
  component.deactivate();
  td.verify(mockFoundation.deactivate(), {times: 1});
});

test('#deactivate icon indicator calls deactivate', () => {
  const {component, mockFoundation} = setupMockFadingFoundationTest();
  component.deactivate();
  td.verify(mockFoundation.deactivate(), {times: 1});
});

test('#computeContentClientRect calls computeClientRect', () => {
  const {component, mockFoundation} = setupMockSlidingFoundationTest();
  component.computeContentClientRect();
  td.verify(mockFoundation.computeContentClientRect(), {times: 1});
});
