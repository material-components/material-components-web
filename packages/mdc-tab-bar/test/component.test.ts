/**
 * @license
 * Copyright 2020 Google Inc.
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

import {MDCTab, MDCTabFoundation} from '../../mdc-tab/index';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {MDCTabBar, MDCTabBarFoundation} from '../index';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
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
  const el = wrapper.firstElementChild as Element;
  wrapper.removeChild(el);
  return el;
}

describe('MDCTabBar', () => {
  it('attachTo returns an MDCTabBar instance', () => {
    expect(MDCTabBar.attachTo(getFixture()) instanceof MDCTabBar).toBeTruthy();
  });

  let fakeTabIdCounter = 0;
  class FakeTab {
    id: string = `mdc-tab-${++fakeTabIdCounter}`;
    destroy: Function = jasmine.createSpy('destroy');
    activate: Function = jasmine.createSpy('activate');
    deactivate: Function = jasmine.createSpy('deactivate');
    computeIndicatorClientRect: Function =
        jasmine.createSpy('computeIndicatorClientRect');
    computeDimensions: Function = jasmine.createSpy('computeDimensions');
    active: boolean = false;
    focusOnActivate: boolean = true;
  }

  class FakeTabScroller {
    destroy: Function = jasmine.createSpy('destroy');
    scrollTo: Function = jasmine.createSpy('scrollTo');
    incrementScroll: Function = jasmine.createSpy('incrementScroll');
    getScrollPosition: Function = jasmine.createSpy('getScrollPosition');
    getScrollContentWidth: Function =
        jasmine.createSpy('getScrollContentWidth');
  }

  it('#constructor instantiates child tab components', () => {
    const root = getFixture();
    const component = new MDCTabBar(
        root, undefined, () => new FakeTab(), () => new FakeTabScroller());
    expect((component as any).tabList.length).toEqual(3);
    expect((component as any).tabList[0]).toEqual(jasmine.any(FakeTab));
    expect((component as any).tabList[1]).toEqual(jasmine.any(FakeTab));
    expect((component as any).tabList[2]).toEqual(jasmine.any(FakeTab));
  });

  it('#constructor instantiates child tab scroller component', () => {
    const root = getFixture();
    const component = new MDCTabBar(
        root, undefined, () => new FakeTab(), () => new FakeTabScroller());
    expect((component as any).tabScroller)
        .toEqual(jasmine.any(FakeTabScroller));
  });

  it('#destroy cleans up child tab components', () => {
    const root = getFixture();
    const component = new MDCTabBar(
        root, undefined, () => new FakeTab(), () => new FakeTabScroller());
    component.destroy();
    expect((component as any).tabList[0].destroy).toHaveBeenCalled();
    expect((component as any).tabList[1].destroy).toHaveBeenCalled();
    expect((component as any).tabList[2].destroy).toHaveBeenCalled();
  });

  function setupTest() {
    const root = getFixture();
    const component = new MDCTabBar(
        root, undefined, () => new FakeTab(), () => new FakeTabScroller());
    return {root, component};
  }

  function setupMockFoundationTest() {
    const root = getFixture();
    const mockFoundation = createMockFoundation(MDCTabBarFoundation);
    const component = new MDCTabBar(
        root, mockFoundation, () => new FakeTab(), () => new FakeTabScroller());
    return {root, component, mockFoundation};
  }

  it('focusOnActivate setter updates setting on all tabs', () => {
    const {component} = setupTest();

    component.focusOnActivate = false;
    (component as any).tabList.forEach((tab: MDCTab) => {
      expect(tab.focusOnActivate).toBe(false);
    });

    component.focusOnActivate = true;
    (component as any).tabList.forEach((tab: MDCTab) => {
      expect(tab.focusOnActivate).toBe(true);
    });
  });

  it('useAutomaticActivation setter calls foundation#setUseAutomaticActivation',
     () => {
       const {component, mockFoundation} = setupMockFoundationTest();

       component.useAutomaticActivation = false;
       expect(mockFoundation.setUseAutomaticActivation)
           .toHaveBeenCalledWith(false);

       component.useAutomaticActivation = true;
       expect(mockFoundation.setUseAutomaticActivation)
           .toHaveBeenCalledWith(true);
     });

  it('#adapter.scrollTo calls scrollTo of the child tab scroller', () => {
    const {component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.scrollTo(123);
    expect((component as any).tabScroller.scrollTo).toHaveBeenCalledWith(123);
  });

  it('#adapter.incrementScroll calls incrementScroll of the child tab scroller',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any).adapter.incrementScroll(123);
       expect((component as any).tabScroller.incrementScroll)
           .toHaveBeenCalledWith(123);
     });

  it('#adapter.getScrollPosition calls getScrollPosition of the child tab scroller',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any).adapter.getScrollPosition();
       expect((component as any).tabScroller.getScrollPosition)
           .toHaveBeenCalledTimes(1);
     });

  it('#adapter.getScrollContentWidth calls getScrollContentWidth of the child tab scroller',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.getScrollContentWidth();
       expect((component as any).tabScroller.getScrollContentWidth)
           .toHaveBeenCalledTimes(1);
     });

  it('#adapter.getOffsetWidth returns getOffsetWidth of the root element',
     () => {
       const {component, root} = setupTest();
       expect(
           (component.getDefaultFoundation() as any)
               .adapter.getOffsetWidth() === (root as HTMLElement).offsetWidth)
           .toBe(true);
     });

  it('#adapter.isRTL returns the RTL state of the root element', () => {
    const {component, root} = setupTest();
    document.body.appendChild(root);
    document.body.setAttribute('dir', 'rtl');
    expect((component.getDefaultFoundation() as any).adapter.isRTL() === true)
        .toBe(true);
    document.body.removeChild(root);
    document.body.removeAttribute('dir');
  });

  it('#adapter.activateTabAtIndex calls activate on the tab at the index',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.activateTabAtIndex(2, {});
       expect((component as any).tabList[2].activate).toHaveBeenCalledWith({});
       expect((component as any).tabList[2].activate).toHaveBeenCalledTimes(1);
     });

  it('#adapter.deactivateTabAtIndex calls deactivate on the tab at the index',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.deactivateTabAtIndex(1);
       expect((component as any).tabList[1].deactivate)
           .toHaveBeenCalledTimes(1);
     });

  it('#adapter.getTabIndicatorClientRectAtIndex calls computeIndicatorClientRect on the tab at the index',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.getTabIndicatorClientRectAtIndex(0);
       expect((component as any).tabList[0].computeIndicatorClientRect)
           .toHaveBeenCalledTimes(1);
     });

  it('#adapter.getTabDimensionsAtIndex calls computeDimensions on the tab at the index',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.getTabDimensionsAtIndex(0);
       expect((component as any).tabList[0].computeDimensions)
           .toHaveBeenCalledTimes(1);
     });

  it('#adapter.getPreviousActiveTabIndex returns the index of the active tab',
     () => {
       const {component} = setupTest();
       (component as any).tabList[1].active = true;
       expect(
           (component.getDefaultFoundation() as any)
               .adapter.getPreviousActiveTabIndex() === 1)
           .toBe(true);
     });

  it('#adapter.getIndexOfTabById returns the index of the given tab', () => {
    const {component} = setupTest();
    const tab = (component as any).tabList[2];
    expect(
        (component.getDefaultFoundation() as any)
            .adapter.getIndexOfTabById(tab.id) === 2)
        .toBe(true);
  });

  it('#adapter.getTabListLength returns the length of the tab list', () => {
    const {component} = setupTest();
    expect(
        (component.getDefaultFoundation() as any)
            .adapter.getTabListLength() === 3)
        .toBe(true);
  });

  it(`#adapter.notifyTabActivated emits the ${
         MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT} event`,
     () => {
       const {component, root} = setupTest();
       const handler = jasmine.createSpy('');
       root.addEventListener(
           MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT, handler);
       (component.getDefaultFoundation() as any)
           .adapter.notifyTabActivated(66);
       expect(handler).toHaveBeenCalledWith(
           jasmine.objectContaining({detail: {index: 66}}));
     });

  it('#activateTab calls activateTab', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.activateTab(1);
    expect(mockFoundation.activateTab).toHaveBeenCalledWith(1);
    expect(mockFoundation.activateTab).toHaveBeenCalledTimes(1);
  });

  it('#scrollIntoView calls scrollIntoView', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.scrollIntoView(1);
    expect(mockFoundation.scrollIntoView).toHaveBeenCalledWith(1);
    expect(mockFoundation.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it(`on ${
         MDCTabFoundation.strings.INTERACTED_EVENT}, call handleTabInteraction`,
     () => {
       const {root, mockFoundation} = setupMockFoundationTest();
       const tab = root.querySelector(
                       MDCTabBarFoundation.strings.TAB_SELECTOR) as HTMLElement;
       emitEvent(tab, MDCTabFoundation.strings.INTERACTED_EVENT, {
         bubbles: true,
       });
       expect(mockFoundation.handleTabInteraction)
           .toHaveBeenCalledWith(jasmine.anything());
       expect(mockFoundation.handleTabInteraction).toHaveBeenCalledTimes(1);
     });

  it('on keydown, call handleKeyDown', () => {
    const {root, mockFoundation} = setupMockFoundationTest();
    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeyDown)
        .toHaveBeenCalledWith(jasmine.anything());
    expect(mockFoundation.handleKeyDown).toHaveBeenCalledTimes(1);
  });
});
