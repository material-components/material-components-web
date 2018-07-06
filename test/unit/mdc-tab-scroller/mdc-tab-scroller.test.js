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
    <div class="mdc-tab-scroller__scroll-area">
      <div class="mdc-tab-scroller__scroll-content"></div>
    </div>
  </div>
`;

suite('MDCTabScroller');

test('attachTo returns an MDCTabScroller instance', () => {
  assert.isTrue(MDCTabScroller.attachTo(getFixture()) instanceof MDCTabScroller);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTabScroller(root);
  const area = root.querySelector(MDCTabScrollerFoundation.strings.AREA_SELECTOR);
  const content = root.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR);
  return {root, component, content, area};
}

test('#adapter.addScrollAreaClass adds a class to the area element', () => {
  const {area, component} = setupTest();
  component.getDefaultFoundation().adapter_.addScrollAreaClass('foo');
  assert.isTrue(area.classList.contains('foo'));
});

test('#adapter.removeScrollAreaClass removes a class from the area element', () => {
  const {area, component} = setupTest();
  area.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeScrollAreaClass('foo');
  assert.isFalse(area.classList.contains('foo'));
});

test('#adapter.registerScrollAreaEventHandler adds an event listener on the area element', () => {
  const {area, component} = setupTest();
  const handler = td.func('transitionend handler');
  component.getDefaultFoundation().adapter_.registerScrollAreaEventHandler('transitionend', handler);
  domEvents.emit(area, 'transitionend');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterScrollAreaEventHandler remoes an event listener from the root element', () => {
  const {area, component} = setupTest();
  const handler = td.func('transitionend handler');
  area.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterScrollAreaEventHandler('transitionend', handler);
  domEvents.emit(area, 'transitionend');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.setScrollContentStyleProperty sets a style property on the content element', () => {
  const {component, content} = setupTest();
  component.getDefaultFoundation().adapter_.setScrollContentStyleProperty('background-color', 'red');
  assert.strictEqual(content.style.backgroundColor, 'red');
});

test('#adapter.getScrollContentStyleValue returns the style property value on the content element', () => {
  const {component, content} = setupTest();
  content.style.setProperty('color', 'chartreuse');
  assert.strictEqual(
    component.getDefaultFoundation().adapter_.getScrollContentStyleValue('color'),
    window.getComputedStyle(content).getPropertyValue('color')
  );
});

function setupScrollLeftTests() {
  const {component, area, content, root} = setupTest();
  area.style.setProperty('width', '100px');
  area.style.setProperty('height', '10px');
  area.style.setProperty('overflow-x', 'scroll');
  content.style.setProperty('width', '10000px');
  content.style.setProperty('height', '10px');
  return {component, area, root};
}

test('#adapter.setScrollAreaScrollLeft sets the scrollLeft value of the area element', () => {
  const {component, root, area} = setupScrollLeftTests();
  document.body.appendChild(root);
  component.getDefaultFoundation().adapter_.setScrollAreaScrollLeft(101);
  assert.strictEqual(area.scrollLeft, 101);
  document.body.removeChild(root);
});

test('#adapter.getScrollAreaScrollLeft returns the scrollLeft value of the root element', () => {
  const {component, root, area} = setupScrollLeftTests();
  document.body.appendChild(root);
  area.scrollLeft = 416;
  assert.strictEqual(component.getDefaultFoundation().adapter_.getScrollAreaScrollLeft(), 416);
  document.body.removeChild(root);
});

test('#adapter.getScrollContentOffsetWidth returns the content element offsetWidth', () => {
  const {component, root, content} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.getScrollContentOffsetWidth(),
    content.offsetWidth
  );
  document.body.removeChild(root);
});

test('#adapter.getScrollAreaOffsetWidth returns the root element offsetWidth', () => {
  const {component, root} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.getScrollAreaOffsetWidth(),
    root.offsetWidth
  );
  document.body.removeChild(root);
});

test('#adapter.computeScrollAreaClientRect returns the root element bounding client rect', () => {
  const {component, root} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.computeScrollAreaClientRect(),
    root.getBoundingClientRect()
  );
  document.body.removeChild(root);
});

test('#adapter.computeScrollContentClientRect returns the content element bounding client rect', () => {
  const {component, root, content} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.computeScrollContentClientRect(),
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
