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

import {MDCTabBar, MDCTabBarFoundation} from '../../../packages/mdc-tab-bar';
import {MDCTabFoundation} from '../../../packages/mdc-tab';

const getFixture = () => bel`
  <div class="mdc-tab-bar">
    <div class="mdc-tab-scroller">
      <div class="mdc-tab-scroller__scroll-area">
        <div class="mdc-tab-scroller__scroll-content">
          <div class="mdc-tab">
            <span class="mdc-tab-indicator"></span>
            <span class="mdc-tab__ripple"></span>
          </div>
          <div class="mdc-tab">
            <span class="mdc-tab-indicator"></span>
            <span class="mdc-tab__ripple"></span>
          </div>
          <div class="mdc-tab">
            <span class="mdc-tab-indicator"></span>
            <span class="mdc-tab__ripple"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

suite('MDCTabBar');

test('attachTo returns an MDCTabBar instance', () => {
  assert.isOk(MDCTabBar.attachTo(getFixture()) instanceof MDCTabBar);
});

class FakeTab {
  constructor() {
    this.destroy = td.function();
    this.activate = td.function();
    this.deactivate = td.function();
    this.computeIndicatorClientRect = td.function();
    this.computeDimensions = td.function();
    this.active = false;
  }
}

class FakeTabScroller {
  constructor() {
    this.destroy = td.function();
    this.scrollTo = td.function();
    this.incrementScroll = td.function();
    this.getScrollPosition = td.function();
    this.getScrollContentWidth = td.function();
  }
}

test('#constructor instantiates child tab components', () => {
  const root = getFixture();
  const component = new MDCTabBar(root, undefined, (el) => new FakeTab(el), (el) => new FakeTabScroller(el));
  assert.equal(component.tabList_.length, 3);
  assert.instanceOf(component.tabList_[0], FakeTab);
  assert.instanceOf(component.tabList_[1], FakeTab);
  assert.instanceOf(component.tabList_[2], FakeTab);
});

test('#constructor instantiates child tab scroller component', () => {
  const root = getFixture();
  const component = new MDCTabBar(root, undefined, (el) => new FakeTab(el), (el) => new FakeTabScroller(el));
  assert.instanceOf(component.tabScroller_, FakeTabScroller);
});

test('#destroy cleans up child tab components', () => {
  const root = getFixture();
  const component = new MDCTabBar(root, undefined, (el) => new FakeTab(el), (el) => new FakeTabScroller(el));
  component.destroy();
  td.verify(component.tabList_[0].destroy());
  td.verify(component.tabList_[1].destroy());
  td.verify(component.tabList_[2].destroy());
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTabBar(root, undefined, (el) => new FakeTab(el), (el) => new FakeTabScroller(el));
  return {root, component};
}

test('#adapter.scrollTo calls scrollTo of the child tab scroller', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.scrollTo(123);
  td.verify(component.tabScroller_.scrollTo(123));
});

test('#adapter.incrementScroll calls incrementScroll of the child tab scroller', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.incrementScroll(123);
  td.verify(component.tabScroller_.incrementScroll(123));
});

test('#adapter.getScrollPosition calls getScrollPosition of the child tab scroller', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.getScrollPosition();
  td.verify(component.tabScroller_.getScrollPosition(), {times: 1});
});

test('#adapter.getScrollContentWidth calls getScrollContentWidth of the child tab scroller', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.getScrollContentWidth();
  td.verify(component.tabScroller_.getScrollContentWidth(), {times: 1});
});

test('#adapter.getOffsetWidth returns getOffsetWidth of the root element', () => {
  const {component, root} = setupTest();
  assert.strictEqual(component.getDefaultFoundation().adapter_.getOffsetWidth(), root.offsetWidth);
});

test('#adapter.isRTL returns the RTL state of the root element', () => {
  const {component, root} = setupTest();
  document.body.appendChild(root);
  document.body.setAttribute('dir', 'rtl');
  assert.strictEqual(component.getDefaultFoundation().adapter_.isRTL(), true);
  document.body.removeChild(root);
  document.body.removeAttribute('dir');
});

test('#adapter.activateTabAtIndex calls activate on the tab at the index', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.activateTabAtIndex(2, {});
  td.verify(component.tabList_[2].activate({}), {times: 1});
});

test('#adapter.deactivateTabAtIndex calls deactivate on the tab at the index', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.deactivateTabAtIndex(1);
  td.verify(component.tabList_[1].deactivate(), {times: 1});
});

test('#adapter.getTabIndicatorClientRectAtIndex calls computeIndicatorClientRect on the tab at the index', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.getTabIndicatorClientRectAtIndex(0);
  td.verify(component.tabList_[0].computeIndicatorClientRect(), {times: 1});
});

test('#adapter.getTabDimensionsAtIndex calls computeDimensions on the tab at the index', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.getTabDimensionsAtIndex(0);
  td.verify(component.tabList_[0].computeDimensions(), {times: 1});
});

test('#adapter.getPreviousActiveTabIndex returns the index of the active tab', () => {
  const {component} = setupTest();
  component.tabList_[1].active = true;
  assert.strictEqual(component.getDefaultFoundation().adapter_.getPreviousActiveTabIndex(), 1);
});

test('#adapter.getIndexOfTab returns the index of the given tab', () => {
  const {component} = setupTest();
  const tab = component.tabList_[2];
  assert.strictEqual(component.getDefaultFoundation().adapter_.getIndexOfTab(tab), 2);
});

test('#adapter.getTabListLength returns the length of the tab list', () => {
  const {component} = setupTest();
  assert.strictEqual(component.getDefaultFoundation().adapter_.getTabListLength(), 3);
});

test(`#adapter.notifyTabActivated emits the ${MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT} event`, () => {
  const {component, root} = setupTest();
  const handler = td.function();
  domEvents.on(root, MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyTabActivated(66);
  td.verify(handler(td.matchers.contains({detail: {index: 66}})));
});

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCTabBarFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCTabBar(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('#activateTab calls activateTab', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.activateTab(1);
  td.verify(mockFoundation.activateTab(1), {times: 1});
});

test('#scrollIntoView calls scrollIntoView', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.scrollIntoView(1);
  td.verify(mockFoundation.scrollIntoView(1), {times: 1});
});

test(`on ${MDCTabFoundation.strings.INTERACTED_EVENT}, call handleTabInteraction`, () => {
  const {root, mockFoundation} = setupMockFoundationTest();
  const tab = root.querySelector(MDCTabBarFoundation.strings.TAB_SELECTOR);
  domEvents.emit(tab, MDCTabFoundation.strings.INTERACTED_EVENT, {
    bubbles: true,
  });
  td.verify(mockFoundation.handleTabInteraction(td.matchers.anything()), {times: 1});
});

test('on keydown, call handleKeyDown', () => {
  const {root, mockFoundation} = setupMockFoundationTest();
  domEvents.emit(root, 'keydown');
  td.verify(mockFoundation.handleKeyDown(td.matchers.anything()), {times: 1});
});
