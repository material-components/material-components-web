/**
 * @license
 * Copyright 2017 Google Inc.
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

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {MDCTabBar} from '../../../packages/mdc-tabs/tab-bar';
import {MDCTabBarFoundation} from '../../../packages/mdc-tabs/tab-bar';
import {strings} from '../../../packages/mdc-tabs/tab-bar/constants';
import {strings as tabStrings} from '../../../packages/mdc-tabs/tab/constants';
import {createMockRaf} from '../helpers/raf';

class MockTab {
  constructor() {
    this.root = bel`<a class="mdc-tab">Item</a>`;
    this.measureSelf = td.func('measureSelf');
    this.isActive = false;
    this.preventDefaultOnClick = false;
    this.computedWidth = 100;
    this.computedLeft = 200;
  }
}

function getFixture() {
  return bel`
    <div>
      <nav class="mdc-tab-bar">
        <a class="mdc-tab" href="#one">Item One</a>
        <a class="mdc-tab" href="#two">Item Two</a>
        <a class="mdc-tab" href="#three">Three</a>
        <span class="mdc-tab-bar__indicator"></span>
      </nav>
    </div>`;
}

function setupTest() {
  const MockTabBarFoundation = td.constructor(MDCTabBarFoundation);
  const foundation = new MockTabBarFoundation();
  const mockTab = new MockTab();
  const fixture = getFixture();
  const root = fixture.querySelector('.mdc-tab-bar');
  const indicator = fixture.querySelector('.mdc-tab-bar__indicator');
  const component = new MDCTabBar(root, undefined, () => mockTab);

  return {fixture, root, indicator, component, foundation};
}

suite('MDCTabBar');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCTabBar.attachTo(setupTest().root) instanceof MDCTabBar);
});

test('#get tabs returns tabs', () => {
  const {component} = setupTest();

  assert.isArray(component.tabs);

  component.tabs.forEach((tab) => {
    assert.instanceOf(tab, MockTab);
  });
});

test('#get activeTab returns active tab', () => {
  const {component} = setupTest();
  const targetIndex = 1;
  const tab = component.tabs[targetIndex];

  tab.isActive = true;
  assert.equal(tab, component.activeTab);
});

test('#set activeTab makes a tab the active tab', () => {
  const raf = createMockRaf();
  const {component} = setupTest();
  const tab = new MockTab();
  component.tabs.push(tab);

  component.activeTab = tab;
  raf.flush();

  assert.isTrue(tab.isActive);
  raf.restore();
});

test('#get activeTabIndex returns active tab', () => {
  const {component} = setupTest();
  const targetIndex = 0;
  const tab = component.tabs[targetIndex];

  tab.isActive = true;
  assert.equal(component.tabs.indexOf(tab), component.activeTabIndex);
});

test('#set activeTabIndex makes a tab at a given index the active tab', () => {
  const raf = createMockRaf();
  const {component} = setupTest();
  const tab = new MockTab();
  component.tabs.push(tab);

  component.activeTabIndex = component.tabs.indexOf(tab);
  raf.flush();

  assert.isTrue(tab.isActive);
  raf.restore();
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();

  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');

  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test(`adapter#bindOnMDCTabSelectedEvent adds event listener for ${tabStrings.SELECTED_EVENT} ` +
  'on the component', () => {
  const {component, root} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const tab = new MockTab();
  component.tabs.push(tab);
  const raf = createMockRaf();

  adapter.bindOnMDCTabSelectedEvent();
  domEvents.emit(root, tabStrings.SELECTED_EVENT, {detail: {tab}});

  raf.flush();

  assert.isTrue(tab.isActive);
  raf.restore();
});

test(`on ${tabStrings.SELECTED_EVENT} if tab is not in tab bar, throw Error`, () => {
  const {component} = setupTest();
  const tab = new MockTab();

  // This is purely to make sure that bindOnMDCTabSelectedEvent() is executed
  // and does not throw.
  component.getDefaultFoundation().adapter_.bindOnMDCTabSelectedEvent();

  // NOTE: Because of this issue: https://bugs.chromium.org/p/chromium/issues/detail?id=239648#
  // Chai cannot observe an error thrown as a result of an event being dispatched.
  const evtObj = {
    detail: {tab},
  };
  assert.throws(() => component.tabSelectedHandler_(evtObj));
});

test('adapter#unbindOnMDCTabSelectedEvent removes listener from component', () => {
  const {component} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const tab = new MockTab();
  component.tabs.push(tab);
  const raf = createMockRaf();
  const handler = td.func('custom handler');

  component.listen(tabStrings.SELECTED_EVENT, handler);
  adapter.unbindOnMDCTabSelectedEvent();
  domEvents.emit(tab.root, tabStrings.SELECTED_EVENT, {detail: {tab}});

  raf.flush();

  td.verify(handler(td.matchers.anything()), {times: 0});
  assert.isFalse(tab.isActive);
  raf.restore();
});

test('adapter#registerResizeHandler adds resize listener to the component', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');

  component.getDefaultFoundation().adapter_.registerResizeHandler(handler);
  domEvents.emit(window, 'resize');

  td.verify(handler(td.matchers.anything()));
  window.removeEventListener('resize', handler);
});

test('adapter#deregisterResizeHandler removes resize listener from component', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');

  window.addEventListener('resize', handler);
  component.getDefaultFoundation().adapter_.deregisterResizeHandler(handler);
  domEvents.emit(window, 'resize');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#getOffsetWidth returns width of component', () => {
  const {root, component} = setupTest();
  const tabBarWidth =
    component.getDefaultFoundation().adapter_.getOffsetWidth();

  assert.equal(tabBarWidth, root.offsetWidth);
});

test('adapter#setStyleForIndicator sets a given property to the given value', () => {
  const {indicator, component} = setupTest();

  component.getDefaultFoundation().adapter_.setStyleForIndicator('width', '200px');
  assert.equal(indicator.style.width, '200px');
});

test('adapter#getOffsetWidthForIndicator returns the width of the active tab indicator', () => {
  const {indicator, component} = setupTest();
  const indicatorWidth =
    component.getDefaultFoundation().adapter_.getOffsetWidthForIndicator();

  assert.equal(indicatorWidth, indicator.offsetWidth);
});

test(`adapter#notifyChange emits ${strings.CHANGE_EVENT} with event data`, () => {
  const {component} = setupTest();
  const handler = td.func('change event handler');
  const data = td.object({
    tab: td.object({}),
  });

  component.listen(strings.CHANGE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyChange(data);

  td.verify(handler(td.matchers.isA(Object)));
});

test('adapter#getNumberOfTabs returns the number of tabs', () => {
  const {component} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getNumberOfTabs(), 3);
});

test('adapter#isTabActiveAtIndex returns true if index equals activeTab index', () => {
  const {component} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const targetIndex = 1;
  const tab = component.tabs[targetIndex];

  assert.isFalse(adapter.isTabActiveAtIndex(targetIndex));
  tab.isActive = true;
  assert.isTrue(adapter.isTabActiveAtIndex(targetIndex));
});

test('adapter#setTabActiveAtIndex sets tab at target index to true or false', () => {
  const {component} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const targetIndex = 1;
  const tab = component.tabs[targetIndex];

  assert.isFalse(tab.isActive);
  adapter.setTabActiveAtIndex(targetIndex, true);
  assert.isTrue(tab.isActive);
});

test('adapter#isDefaultPreventedOnClickForTabAtIndex returns the value ' +
  ' of preventsDefaultOnClick', () => {
  const {component} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const targetIndex = 1;
  const tab = component.tabs[targetIndex];

  assert.isFalse(adapter.isDefaultPreventedOnClickForTabAtIndex(targetIndex));
  tab.preventDefaultOnClick = true;
  assert.isTrue(adapter.isDefaultPreventedOnClickForTabAtIndex(targetIndex));
});

test('adapter#setPreventDefaultOnClickForTabAtIndex sets preventDefault ' +
  ' for tab at index', () => {
  const {component} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const targetIndex = 1;
  const tab = component.tabs[targetIndex];

  assert.isFalse(tab.preventDefaultOnClick);
  adapter.setPreventDefaultOnClickForTabAtIndex(targetIndex, true);
  assert.isTrue(tab.preventDefaultOnClick);
});

test('adapter#measureTabAtIndex calls measureSelf on the tab at a given index', () => {
  const {component} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const targetIndex = 1;
  const tab = component.tabs[targetIndex];

  adapter.measureTabAtIndex(targetIndex);

  td.verify(tab.measureSelf());
});

test('adapter#getComputedWidthForTabAtIndex returns width for a given tab', () => {
  const {component} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const targetIndex = 1;
  const tab = component.tabs[targetIndex];

  assert.equal(adapter.getComputedWidthForTabAtIndex(targetIndex), tab.computedWidth);
});

test('adapter#getComputedLeftForTabAtIndex returns left offset for a given tab', () => {
  const {component} = setupTest();
  const adapter = component.getDefaultFoundation().adapter_;
  const targetIndex = 1;
  const tab = component.tabs[targetIndex];

  assert.equal(adapter.getComputedLeftForTabAtIndex(targetIndex), tab.computedLeft);
});

test('#layout proxies to foundation.layout()', () => {
  const {root} = setupTest();
  const MockTabBarFoundation = td.constructor(MDCTabBarFoundation);
  const foundation = new MockTabBarFoundation();
  const component = new MDCTabBar(root, foundation);

  component.layout();
  td.verify(foundation.layout());
});
