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

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {MDCTabBarScroller} from '../../../packages/mdc-tabs/tab-bar-scroller';
import {MDCTabBarScrollerFoundation} from '../../../packages/mdc-tabs/tab-bar-scroller';
import {strings} from '../../../packages/mdc-tabs/tab-bar-scroller/constants';

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

class MockTabBar {
  constructor() {
    this.root = bel`
      <nav class="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs">
        <a class="mdc-tab" href="#one">Item One</a>
        <a class="mdc-tab" href="#two">Item Two</a>
        <a class="mdc-tab" href="#three">Item Three</a>
        <a class="mdc-tab" href="#four">Item Four</a>
        <a class="mdc-tab" href="#five">Item Five</a>
        <a class="mdc-tab" href="#six">Item Six</a>
        <a class="mdc-tab" href="#seven">Item Seven</a>
        <a class="mdc-tab" href="#eight">Item Eight</a>
        <a class="mdc-tab" href="#nine">Item Nine</a>
      </nav>`;
    this.tabs = [
      {
        computedWidth: 200,
        computedLeft: 0,
      }, {
        computedWidth: 200,
        computedLeft: 200,
      }, {
        computedWidth: 200,
        computedLeft: 400,
      },
    ];
  }
}

function getTransformPropertyName() {
  const el = window.document.createElement('div');
  const transformPropertyName = ('transform' in el.style ? 'transform' : '-webkit-transform');

  return transformPropertyName;
}

function getTabBarFixture() {
  return bel`
    <nav class="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs">
      <a class="mdc-tab" href="#one">Item One</a>
      <a class="mdc-tab" href="#two">Item Two</a>
      <a class="mdc-tab" href="#three">Item Three</a>
      <a class="mdc-tab" href="#four">Item Four</a>
      <a class="mdc-tab" href="#five">Item Five</a>
      <a class="mdc-tab" href="#six">Item Six</a>
      <a class="mdc-tab" href="#seven">Item Seven</a>
      <a class="mdc-tab" href="#eight">Item Eight</a>
      <a class="mdc-tab" href="#nine">Item Nine</a>
    </nav>`;
}

function getFixture() {
  return bel`<div>
    <div class="mdc-tab-bar-scroller">
      <div class="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
        <a class="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll back button">
          navigate_before
        </a>
      </div>
      <div class="mdc-tab-bar-scroller__scroll-frame">
        <nav class="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs">
          <a class="mdc-tab" href="#one">Item One</a>
          <a class="mdc-tab" href="#two">Item Two</a>
          <a class="mdc-tab" href="#three">Item Three</a>
          <a class="mdc-tab" href="#four">Item Four</a>
          <a class="mdc-tab" href="#five">Item Five</a>
          <a class="mdc-tab" href="#six">Item Six</a>
          <a class="mdc-tab" href="#seven">Item Seven</a>
          <a class="mdc-tab" href="#eight">Item Eight</a>
          <a class="mdc-tab" href="#nine">Item Nine</a>
          <span class="mdc-tab-bar__indicator"></span>
        </nav>
      </div>
      <div class="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
        <a class="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll forward button">
          navigate_next
        </a>
      </div>
    </div>
  </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const tabBarFixture = getTabBarFixture();
  const tabBarRoot = tabBarFixture.querySelector('.mdc-tab-bar');
  const mockTab = new MockTab();
  const mockTabBar = new MockTabBar(tabBarRoot, undefined, () => mockTab);
  const root = fixture.querySelector('.mdc-tab-bar-scroller');
  const scrollFrameEl = root.querySelector('.mdc-tab-bar-scroller__scroll-frame');
  const tabBarEl = root.querySelector('.mdc-tab-bar');
  const backIndicatorEl = fixture.querySelector('.mdc-tab-bar-scroller__indicator--back');
  const forwardIndicatorEl = fixture.querySelector('.mdc-tab-bar-scroller__indicator--forward');
  const component = new MDCTabBarScroller(root, undefined, () => mockTabBar);

  return {fixture, root, scrollFrameEl, tabBarEl,
    component, backIndicatorEl, forwardIndicatorEl};
}

suite('MDCTabBarScroller');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCTabBarScroller.attachTo(setupTest().root) instanceof MDCTabBarScroller);
});

test('#get tabBar returns a tab bar', () => {
  const {component} = setupTest();

  assert.instanceOf(component.tabBar, MockTabBar);
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();

  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');

  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('adapter#eventTargetHasClass returns true if given element has class', () => {
  const {component} = setupTest();
  const mockEventTarget = bel`<div class="foo">bar</div>`;

  assert.isTrue(component.getDefaultFoundation().adapter_.eventTargetHasClass(mockEventTarget, 'foo'));
});

test('adapter#addClassToForwardIndicator adds a class to forward indicator element', () => {
  const {component, forwardIndicatorEl} = setupTest();

  component.getDefaultFoundation().adapter_.addClassToForwardIndicator('foo');
  assert.isTrue(forwardIndicatorEl.classList.contains('foo'));
});

test('adapter#removeClassFromForwardIndicator removes a class from forward indicator', () => {
  const {component, forwardIndicatorEl} = setupTest();

  forwardIndicatorEl.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromForwardIndicator('foo');
  assert.isFalse(forwardIndicatorEl.classList.contains('foo'));
});

test('adapter#addClassToBackIndicator adds a class to back indicator element', () => {
  const {component, backIndicatorEl} = setupTest();

  component.getDefaultFoundation().adapter_.addClassToBackIndicator('foo');
  assert.isTrue(backIndicatorEl.classList.contains('foo'));
});

test('adapter#removeClassFromBackIndicator removes a class from back indicator', () => {
  const {component, backIndicatorEl} = setupTest();

  backIndicatorEl.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromBackIndicator('foo');
  assert.isFalse(backIndicatorEl.classList.contains('foo'));
});

test('adapter#isRTL returns false if not in an RTL context', () => {
  const {root, component} = setupTest();

  assert.isFalse(component.getDefaultFoundation().adapter_.isRTL(root));
});

test('adapter#registerBackIndicatorClickHandler registers a back indicator click handler', () => {
  const {component, backIndicatorEl} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerBackIndicatorClickHandler(handler);
  domEvents.emit(backIndicatorEl, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterBackIndicatorClickHandler deregisters a back indicator click handler', () => {
  const {component, backIndicatorEl} = setupTest();
  const handler = td.func('eventHandler');

  backIndicatorEl.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterBackIndicatorClickHandler(handler);
  domEvents.emit(backIndicatorEl, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerForwardIndicatorClickHandler registers a forward indicator click handler', () => {
  const {component, forwardIndicatorEl} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerForwardIndicatorClickHandler(handler);
  domEvents.emit(forwardIndicatorEl, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterForwardIndicatorClickHandler deregisters a forward indicator click handler', () => {
  const {component, forwardIndicatorEl} = setupTest();
  const handler = td.func('eventHandler');

  forwardIndicatorEl.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterForwardIndicatorClickHandler(handler);
  domEvents.emit(forwardIndicatorEl, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerCapturedInteractionHandler registers an event handler', () => {
  const {root, component} = setupTest();
  const handler = td.func('focusHandler');
  const evtType = 'focus';

  component.getDefaultFoundation().adapter_.registerCapturedInteractionHandler(evtType, handler);
  domEvents.emit(root, 'focus');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterCapturedInteractionHandler deregisters an event handler', () => {
  const {root, component} = setupTest();
  const handler = td.func('focusHandler');
  const evtType = 'focus';

  root.addEventListener('focus', handler, true);
  component.getDefaultFoundation().adapter_.deregisterCapturedInteractionHandler(evtType, handler);
  domEvents.emit(root, 'focus');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerWindowResizeHandler registers a resize handler', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');

  component.getDefaultFoundation().adapter_.registerWindowResizeHandler(handler);
  domEvents.emit(window, 'resize');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterWindowResizeHandler deregisters a resize handler', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');

  window.addEventListener('resize', handler);
  component.getDefaultFoundation().adapter_.deregisterWindowResizeHandler(handler);
  domEvents.emit(window, 'resize');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#getNumberOfTabs returns the numebr of tabs in tab bar', () => {
  const {component} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getNumberOfTabs(), 3);
});

test('adapter#getComputedWidthForTabAtIndex returns width for a tab at a given index', () => {
  const {component} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getComputedWidthForTabAtIndex(0), 200);
});

test('adapter#getComputedLeftForTabAtIndex returns left offset for a tab at a given index', () => {
  const {component} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getComputedLeftForTabAtIndex(1), 200);
});

test('adapter#getOffsetWidthForScrollFrame returns the width of the scroll frame', () => {
  const {component, scrollFrameEl} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getOffsetWidthForScrollFrame(), scrollFrameEl.offsetWidth);
});

test('adapter#getScrollLeftForScrollFrame returns the scrollLeft of the scroll frame', () => {
  const {component, scrollFrameEl} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getScrollLeftForScrollFrame(), scrollFrameEl.scrollLeft);
});

test('adapter#setScrollLeftForScrollFrame returns the scrollLeft of the scroll frame', () => {
  const {component, scrollFrameEl} = setupTest();
  const amount = 0;

  component.getDefaultFoundation().adapter_.setScrollLeftForScrollFrame(amount);
  assert.equal(scrollFrameEl.scrollLeft, amount);
});

test('adapter#getOffsetWidthForTabBar returns width of tab bar', () => {
  const {component, tabBarEl} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getOffsetWidthForTabBar(), tabBarEl.offsetWidth);
});

test('adapter#setTransformStyleForTabBar sets transform property for tab bar', () => {
  const {root, component} = setupTest();
  const tabBar = root.querySelector(strings.TABS_SELECTOR);

  component.getDefaultFoundation().adapter_.setTransformStyleForTabBar('translateX(42px)');
  assert.equal(tabBar.style.getPropertyValue(getTransformPropertyName()), 'translateX(42px)');
});

test('adapter#getOffsetLeftForEventTarget returns offset left of given target', () => {
  const {component} = setupTest();
  const target = bel`<div>hi</div>`;

  assert.equal(component.getDefaultFoundation().adapter_.getOffsetLeftForEventTarget(target), 0);
});

test('adapter#getOffsetWidthForEventTarget returns the width of a given target', () => {
  const {component} = setupTest();
  const target = bel`<div>hi</div>`;

  assert.equal(component.getDefaultFoundation().adapter_.getOffsetWidthForEventTarget(target), 0);
});

test('#layout proxies to foundation.layout()', () => {
  const {root} = setupTest();
  const MockTabBarScrollerFoundation = td.constructor(MDCTabBarScrollerFoundation);
  const foundation = new MockTabBarScrollerFoundation();
  const component = new MDCTabBarScroller(root, foundation);

  component.layout();
  td.verify(foundation.layout());
});
