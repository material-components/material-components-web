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

import bel from 'bel';
import {assert} from 'chai';
import td from 'testdouble';

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
