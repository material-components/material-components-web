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

import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {MDCTabScroller, MDCTabScrollerFoundation, util} from '../index';
import {MDCTabScrollerRTL} from '../rtl-scroller';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="mdc-tab-scroller">
      <div class="mdc-tab-scroller__scroll-area">
        <div class="mdc-tab-scroller__scroll-content"></div>
      </div>
    </div>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCTabScroller(root);
  const area =
      root.querySelector(MDCTabScrollerFoundation.strings.AREA_SELECTOR) as
      HTMLElement;
  const content =
      root.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR) as
      HTMLElement;
  return {root, component, content, area};
}

describe('MDCTabScroller', () => {
  it('attachTo returns an MDCTabScroller instance', () => {
    expect(MDCTabScroller.attachTo(getFixture()) instanceof MDCTabScroller)
        .toBe(true);
  });

  it('#destroy() calls super.destroy()', () => {
    const {component} = setupTest();
    const mockFoundation = jasmine.createSpyObj('foundation', ['destroy']);
    (component as any).foundation = mockFoundation;
    component.destroy();
    expect(mockFoundation.destroy).toHaveBeenCalledTimes(1);
  });

  it('#adapter.eventTargetMatchesSelector returns true if the event target matches the selector',
     () => {
       const {area, component} = setupTest();
       expect((component.getDefaultFoundation() as any)
                  .adapter.eventTargetMatchesSelector(
                      area, MDCTabScrollerFoundation.strings.AREA_SELECTOR))
           .toBe(true);
     });

  it('#adapter.addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('#adapter.removeClass removes a class from the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root.classList.contains('foo')).toBe(false);
  });

  it('#adapter.addScrollAreaClass adds a class to the area element', () => {
    const {component, area} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addScrollAreaClass('foo');
    expect(area.classList.contains('foo')).toBe(true);
  });

  it('#adapter.setScrollAreaStyleProperty sets a style property on the area element',
     () => {
       const {component, area} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.setScrollAreaStyleProperty('background-color', 'red');
       expect(area.style.backgroundColor === 'red').toBe(true);
     });

  it('#adapter.setScrollContentStyleProperty sets a style property on the content element',
     () => {
       const {component, content} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.setScrollContentStyleProperty('background-color', 'red');
       expect(content.style.backgroundColor === 'red').toBe(true);
     });

  it('#adapter.getScrollContentStyleValue returns the style property value on the content element',
     () => {
       const {component, content} = setupTest();
       content.style.setProperty('color', 'chartreuse');
       expect((component.getDefaultFoundation() as any)
                  .adapter.getScrollContentStyleValue('color'))
           .toBe(window.getComputedStyle(content).getPropertyValue('color'));
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

  it('#adapter.setScrollAreaScrollLeft sets the scrollLeft value of the area element',
     () => {
       const {component, root, area} = setupScrollLeftTests();
       document.body.appendChild(root);
       (component.getDefaultFoundation() as any)
           .adapter.setScrollAreaScrollLeft(101);
       expect(area.scrollLeft).toBeGreaterThanOrEqual(0);
       document.body.removeChild(root);
     });

  it('#adapter.getScrollAreaScrollLeft returns the scrollLeft value of the root element',
     () => {
       const {component, root, area} = setupScrollLeftTests();
       document.body.appendChild(root);
       area.scrollLeft = 416;
       expect((component.getDefaultFoundation() as any)
                  .adapter.getScrollAreaScrollLeft())
           .toBeGreaterThanOrEqual(0);
       document.body.removeChild(root);
     });

  it('#adapter.getScrollContentOffsetWidth returns the content element offsetWidth',
     () => {
       const {component, root, content} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getScrollContentOffsetWidth())
           .toEqual(content.offsetWidth);
       document.body.removeChild(root);
     });

  it('#adapter.getScrollAreaOffsetWidth returns the root element offsetWidth',
     () => {
       const {component, root} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getScrollAreaOffsetWidth())
           .toEqual(root.offsetWidth);
       document.body.removeChild(root);
     });

  it('#adapter.computeScrollAreaClientRect returns the root element bounding client rect',
     () => {
       const {component, root} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter.computeScrollAreaClientRect())
           .toEqual(root.getBoundingClientRect());
       document.body.removeChild(root);
     });

  it('#adapter.computeScrollContentClientRect returns the content element bounding client rect',
     () => {
       const {component, root, content} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter.computeScrollContentClientRect())
           .toEqual(content.getBoundingClientRect());
       document.body.removeChild(root);
     });

  it('#adapter.computeHorizontalScrollbarHeight uses util function to return scrollbar height',
     () => {
       const {component, root} = setupTest();
       document.body.appendChild(root);

       // Unfortunately we can't stub the util API due to it transpiling to a
       // read-only property, so we need to settle for comparing the return
       // values in each browser.
       expect((component.getDefaultFoundation() as any)
                  .adapter.computeHorizontalScrollbarHeight())
           .toBe(util.computeHorizontalScrollbarHeight(document));
       document.body.removeChild(root);
     });

  function setupMockFoundationTest(root = getFixture()) {
    const mockFoundation = createMockFoundation(MDCTabScrollerFoundation);
    const component = new MDCTabScroller(root, mockFoundation);
    return {root, component, mockFoundation};
  }

  it('#scrollTo calls scrollTo', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.scrollTo(703);
    expect(mockFoundation.scrollTo).toHaveBeenCalledWith(703);
    expect(mockFoundation.scrollTo).toHaveBeenCalledTimes(1);
  });

  it('#incrementScroll calls incrementScroll', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.incrementScroll(10);
    expect(mockFoundation.incrementScroll).toHaveBeenCalledWith(10);
    expect(mockFoundation.incrementScroll).toHaveBeenCalledTimes(1);
  });

  it('#getScrollPosition() calls getScrollPosition', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.getScrollPosition();
    expect(mockFoundation.getScrollPosition).toHaveBeenCalledTimes(1);
  });

  it('#getScrollContentWidth() returns the offsetWidth of the content element',
     () => {
       const {component, root} = setupMockFoundationTest();
       const contentElement =
           root.querySelector(
               MDCTabScrollerFoundation.strings.CONTENT_SELECTOR) as
           HTMLElement;
       expect(component.getScrollContentWidth())
           .toEqual(contentElement.offsetWidth);
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

  it('#getRTLScroller() returns an instance of MDCTabScrollerRTL', () => {
    const {root, component} = setupTestRTL();
    document.body.appendChild(root);
    expect(component.getDefaultFoundation().getRTLScroller())
        .toEqual(jasmine.any(MDCTabScrollerRTL));
    document.body.removeChild(root);
  });

  it('on interaction in the area element, call #handleInteraction()', () => {
    const {root, mockFoundation} = setupMockFoundationTest();
    const area =
        root.querySelector(MDCTabScrollerFoundation.strings.AREA_SELECTOR) as
        HTMLElement;
    emitEvent(area, 'touchstart', {bubbles: true});
    expect(mockFoundation.handleInteraction).toHaveBeenCalled();
  });

  it('on transitionend of the content element, call #handleTransitionEnd()',
     () => {
       const {root, mockFoundation} = setupMockFoundationTest();
       const content = root.querySelector(
                           MDCTabScrollerFoundation.strings.CONTENT_SELECTOR) as
           HTMLElement;
       emitEvent(content, 'transitionend', {bubbles: true});
       expect(mockFoundation.handleTransitionEnd)
           .toHaveBeenCalledWith(jasmine.anything());
     });
});
