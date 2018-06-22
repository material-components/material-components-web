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
  MDCTabScroller,
  MDCTabScrollerFoundation,
} from '../../../packages/mdc-tab-scroller';

import MDCTabScrollerRTL from '../../../packages/mdc-tab-scroller/rtl-scroller';

const getFixture = () => bel`
  <div class="mdc-tab-scroller">
    <div class="mdc-tab-scroller__content"></div>
  </div>
`;

suite('MDCTabScroller');

test('attachTo returns an MDCTabScroller instance', () => {
  assert.isTrue(MDCTabScroller.attachTo(getFixture()) instanceof MDCTabScroller);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTabScroller(root);
  const content = root.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR);
  return {root, component, content};
}

test('#adapter.addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('#adapter.removeClass removes a class from the root element', () => {
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

test('#adapter.setContentStyleProperty sets a style property on the content element', () => {
  const {component, content} = setupTest();
  component.getDefaultFoundation().adapter_.setContentStyleProperty('background-color', 'red');
  assert.strictEqual(content.style.backgroundColor, 'red');
});

test('#adapter.getContentStyleValue returns the style property value on the content element', () => {
  const {component, content} = setupTest();
  content.style.setProperty('color', 'chartreuse');
  assert.strictEqual(
    component.getDefaultFoundation().adapter_.getContentStyleValue('color'),
    window.getComputedStyle(content).getPropertyValue('color')
  );
});

function setupScrollLeftTests() {
  const {component, root, content} = setupTest();
  root.style.setProperty('width', '100px');
  root.style.setProperty('height', '10px');
  root.style.setProperty('overflow-x', 'scroll');
  content.style.setProperty('width', '10000px');
  content.style.setProperty('height', '10px');
  return {component, root};
}

test('#adapter.setScrollLeft sets the scrollLeft value of the root element', () => {
  const {component, root} = setupScrollLeftTests();
  document.body.appendChild(root);
  component.getDefaultFoundation().adapter_.setScrollLeft(101);
  assert.strictEqual(root.scrollLeft, 101);
  document.body.removeChild(root);
});

test('#adapter.getScrollLeft returns the scrollLeft value of the root element', () => {
  const {component, root} = setupScrollLeftTests();
  document.body.appendChild(root);
  root.scrollLeft = 416;
  assert.strictEqual(component.getDefaultFoundation().adapter_.getScrollLeft(), 416);
  document.body.removeChild(root);
});

test('#adapter.getContentOffsetWidth returns the content element offsetWidth', () => {
  const {component, root, content} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.getContentOffsetWidth(),
    content.offsetWidth
  );
  document.body.removeChild(root);
});

test('#adapter.getOffsetWidth returns the root element offsetWidth', () => {
  const {component, root} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.getOffsetWidth(),
    root.offsetWidth
  );
  document.body.removeChild(root);
});

test('#adapter.computeClientRect returns the root element bounding client rect', () => {
  const {component, root} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.computeClientRect(),
    root.getBoundingClientRect()
  );
  document.body.removeChild(root);
});

test('#adapter.computeContentClientRect returns the content element bounding client rect', () => {
  const {component, root, content} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.computeContentClientRect(),
    content.getBoundingClientRect()
  );
  document.body.removeChild(root);
});

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCTabScrollerFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCTabScroller(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('#scrollTo calls scrollTo', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.scrollTo(703);
  td.verify(mockFoundation.scrollTo(703), {times: 1});
});

test('#incrementScroll calls incrementScroll', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.incrementScroll(10);
  td.verify(mockFoundation.incrementScroll(10), {times: 1});
});

test('#computeCurrentScrollPosition() calls computeCurrentScrollPosition', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.computeCurrentScrollPosition();
  td.verify(mockFoundation.computeCurrentScrollPosition(), {times: 1});
});

function setupTestRTL() {
  const {root, content, component} = setupTest();
  root.style.setProperty('width', '100px');
  root.style.setProperty('height', '10px');
  root.style.setProperty('overflow-x', 'scroll');
  content.style.setProperty('width', '10000px');
  content.style.setProperty('height', '10px');
  content.style.setProperty('backgroundColor', 'red');
  root.setAttribute('dir', 'rtl');
  return {root, component, content};
}

test('#getRTLScroller() returns an instance of MDCTabScrollerRTL', () => {
  const {root, component} = setupTestRTL();
  document.body.appendChild(root);
  assert.instanceOf(component.getDefaultFoundation().getRTLScroller(), MDCTabScrollerRTL);
  document.body.removeChild(root);
});
