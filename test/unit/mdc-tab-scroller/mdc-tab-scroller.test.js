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
import domEvents from 'dom-events';

import {
  MDCTabScroller,
  MDCTabScrollerFoundation,
  util,
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

test('#destroy() calls super.destroy()', () => {
  const {component} = setupTest();
  const foundation = td.object(component.foundation_);
  component.foundation_ = foundation;
  component.destroy();
  td.verify(foundation.destroy(), {times: 1});
});

test('#adapter.eventTargetMatchesSelector returns true if the event target matches the selector', () => {
  const {area, component} = setupTest();
  assert.isTrue(component.getDefaultFoundation().adapter_.eventTargetMatchesSelector(
    area, MDCTabScrollerFoundation.strings.AREA_SELECTOR));
});

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

test('#adapter.addScrollAreaClass adds a class to the area element', () => {
  const {component, area} = setupTest();
  component.getDefaultFoundation().adapter_.addScrollAreaClass('foo');
  assert.isTrue(area.classList.contains('foo'));
});

test('#adapter.setScrollAreaStyleProperty sets a style property on the area element', () => {
  const {component, area} = setupTest();
  component.getDefaultFoundation().adapter_.setScrollAreaStyleProperty('background-color', 'red');
  assert.strictEqual(area.style.backgroundColor, 'red');
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
  assert.isAtLeast(area.scrollLeft, 0);
  document.body.removeChild(root);
});

test('#adapter.getScrollAreaScrollLeft returns the scrollLeft value of the root element', () => {
  const {component, root, area} = setupScrollLeftTests();
  document.body.appendChild(root);
  area.scrollLeft = 416;
  assert.isAtLeast(component.getDefaultFoundation().adapter_.getScrollAreaScrollLeft(), 0);
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

test('#adapter.computeHorizontalScrollbarHeight uses util function to return scrollbar height', () => {
  const {component, root} = setupTest();
  document.body.appendChild(root);

  // Unfortunately we can't stub the util API due to it transpiling to a read-only property, so we need to settle for
  // comparing the return values in each browser.
  assert.strictEqual(component.getDefaultFoundation().adapter_.computeHorizontalScrollbarHeight(),
    util.computeHorizontalScrollbarHeight());
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

test('#getScrollPosition() calls getScrollPosition', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.getScrollPosition();
  td.verify(mockFoundation.getScrollPosition(), {times: 1});
});

test('#getScrollContentWidth() returns the offsetWidth of the content element', () => {
  const {component, root} = setupMockFoundationTest();
  const contentElement = root.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR);
  assert.strictEqual(component.getScrollContentWidth(), contentElement.offsetWidth);
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

test('on interaction in the area element, call #handleInteraction()', () => {
  const {root, mockFoundation} = setupMockFoundationTest();
  const area = root.querySelector(MDCTabScrollerFoundation.strings.AREA_SELECTOR);
  domEvents.emit(area, 'touchstart', {bubbles: true});
  td.verify(mockFoundation.handleInteraction());
});

test('on transitionend of the content element, call #handleTransitionEnd()', () => {
  const {root, mockFoundation} = setupMockFoundationTest();
  const content = root.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR);
  domEvents.emit(content, 'transitionend', {bubbles: true});
  td.verify(mockFoundation.handleTransitionEnd(td.matchers.anything()));
});
