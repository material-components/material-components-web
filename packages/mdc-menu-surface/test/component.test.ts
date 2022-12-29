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

import {getCorrectPropertyName} from '@material/animation/util';

import {createFixture, html} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {Corner, cssClasses, strings} from '../constants';
import {MDCMenuSurface, MDCMenuSurfaceFoundation} from '../index';

function getFixture(open = false, fixedPosition = false) {
  const openClass = open ? 'mdc-menu-surface--open' : '';
  const fixedClass = fixedPosition ? 'mdc-menu-surface--fixed' : '';

  return createFixture(html`
    <div class="mdc-menu-surface ${openClass} ${fixedClass}" tabindex="-1">
      <ul class="mdc-deprecated-list" role="menu">
        <li class="mdc-deprecated-list-item" role="menuitem" tabindex="0">Item</a>
        <li role="separator"></li>
        <li class="mdc-deprecated-list-item" role="menuitem" tabindex="0">Another Item</a>
      </nav>
    </div>
  `);
}

function getAnchorFixture(menuFixture: HTMLElement) {
  const anchorEl = createFixture(html`
    <div class="mdc-menu-surface--anchor">
      <button class="mdc-button">Open</button>
    </div>
  `);

  anchorEl.appendChild(menuFixture);
  return anchorEl;
}

function setupTest(
    {open = false, fixedPosition = false, withAnchor = false} = {}) {
  const root = getFixture(open, fixedPosition);
  const mockFoundation = createMockFoundation(MDCMenuSurfaceFoundation);
  const anchor = withAnchor ? getAnchorFixture(root) : undefined;
  const component = new MDCMenuSurface(root, mockFoundation);
  return {root, mockFoundation, anchor, component};
}

describe('MDCMenuSurface', () => {
  it('attachTo initializes and returns a MDCMenuSurface instance', () => {
    expect(MDCMenuSurface.attachTo(getFixture()) instanceof MDCMenuSurface)
        .toBe(true);
  });

  it('initialSyncWithDOM registers key handler on the menu surface', () => {
    const {root, component, mockFoundation} = setupTest();
    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeydown)
        .toHaveBeenCalledWith(jasmine.any(Event));
    expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
    component.destroy();
  });

  it('destroy deregisters key handler on the menu surface', () => {
    const {root, component, mockFoundation} = setupTest();
    component.destroy();
    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeydown)
        .not.toHaveBeenCalledWith(jasmine.any(Event));
  });

  it('#isOpen', () => {
    const {component, mockFoundation} = setupTest();
    mockFoundation.isOpen.and.returnValue(true);
    expect(component.isOpen()).toBe(true);

    mockFoundation.isOpen.and.returnValue(false);
    expect(component.isOpen()).toBe(false);
  });

  it('#open opens the menu surface', () => {
    const {component, mockFoundation} = setupTest();
    component.open();
    expect(mockFoundation.open).toHaveBeenCalled();
  });

  it('#open calling open on button click does not close quick menu', () => {
    const {root} = setupTest();
    // not using mock as this case fails on integration rather than unit
    const component = new MDCMenuSurface(root);
    const button = document.createElement('button');
    const listener = () => {
      component.open();
    };
    let numTimesClosedCalled = 0;

    button.addEventListener('click', listener);
    root.addEventListener(strings.CLOSED_EVENT, () => {
      numTimesClosedCalled += 1;
    });
    component.quickOpen = true;
    document.body.appendChild(button);


    expect(numTimesClosedCalled).toEqual(0);
    emitEvent(button, 'click', {bubbles: true});
    document.body.removeChild(button);

    expect(component.isOpen()).toEqual(true);
    expect(numTimesClosedCalled).toEqual(0);

    component.destroy();
  });

  it(`${strings.OPENED_EVENT} causes the body click handler to be registered`,
     () => {
       const {root, mockFoundation} = setupTest();
       emitEvent(root, strings.OPENED_EVENT);
       emitEvent(document.body, 'click');
       expect(mockFoundation.handleBodyClick)
           .toHaveBeenCalledWith(jasmine.any(Event));
       expect(mockFoundation.handleBodyClick).toHaveBeenCalledTimes(1);
     });

  it('#open does not throw error if no focusable elements', () => {
    const {root, component, mockFoundation} = setupTest();

    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }

    expect(() => {
      component.open();
    }).not.toThrow();
    expect(mockFoundation.open).toHaveBeenCalled();
  });

  it('#close closes the menu surface', () => {
    const {component, mockFoundation} = setupTest();
    component.close();
    expect(mockFoundation.close)
        .toHaveBeenCalledWith(/* skipRestoreFocus */ false);
  });

  it(`${strings.CLOSED_EVENT} causes the body click handler to be deregistered`,
     () => {
       const {root, mockFoundation} = setupTest();
       emitEvent(root, strings.OPENED_EVENT);
       emitEvent(root, strings.CLOSED_EVENT);
       emitEvent(document.body, 'click');
       expect(mockFoundation.handleBodyClick)
           .not.toHaveBeenCalledWith(jasmine.any(Event));
     });

  it('setMenuSurfaceAnchorElement', () => {
    const {component} = setupTest();
    const myElement = {} as unknown as Element;
    component.setMenuSurfaceAnchorElement(myElement);
    expect(component.anchorElement).toEqual(myElement);
  });

  it('anchorElement is properly initialized when the DOM contains an anchor',
     () => {
       const {component, anchor} = setupTest({withAnchor: true});
       expect(component.anchorElement).toEqual(anchor as HTMLElement);
     });

  it('setIsHoisted', () => {
    const {component, mockFoundation} = setupTest();
    component.setIsHoisted(true);
    expect(mockFoundation.setIsHoisted).toHaveBeenCalledWith(true);
  });

  it('setFixedPosition is called when CSS class is present', () => {
    const {mockFoundation} = setupTest({fixedPosition: true});
    expect(mockFoundation.setFixedPosition).toHaveBeenCalledWith(true);
  });

  it('setFixedPosition is true', () => {
    const {root, component, mockFoundation} = setupTest();
    component.setFixedPosition(true);
    expect(root.classList.contains(cssClasses.FIXED)).toBe(true);
    expect(mockFoundation.setFixedPosition).toHaveBeenCalledWith(true);
  });

  it('setFixedPosition is false', () => {
    const {root, component, mockFoundation} = setupTest();
    component.setFixedPosition(false);
    expect(root.classList.contains(cssClasses.FIXED)).toBe(false);
    expect(mockFoundation.setFixedPosition).toHaveBeenCalledWith(false);
  });

  it('setAbsolutePosition calls the foundation setAbsolutePosition function',
     () => {
       const {component, mockFoundation} = setupTest();
       component.setAbsolutePosition(10, 10);
       expect(mockFoundation.setAbsolutePosition).toHaveBeenCalledWith(10, 10);
       expect(mockFoundation.setIsHoisted).toHaveBeenCalledWith(true);
     });

  it('setAnchorCorner', () => {
    const {component, mockFoundation} = setupTest();
    component.setAnchorCorner(Corner.TOP_START);
    expect(mockFoundation.setAnchorCorner)
        .toHaveBeenCalledWith(Corner.TOP_START);
  });

  it('setAnchorMargin with all object properties defined', () => {
    const {component, mockFoundation} = setupTest();
    component.setAnchorMargin({top: 0, right: 0, bottom: 0, left: 0});
    expect(mockFoundation.setAnchorMargin)
        .toHaveBeenCalledWith({top: 0, right: 0, bottom: 0, left: 0});
  });

  it('setAnchorMargin with empty object', () => {
    const {component, mockFoundation} = setupTest();
    component.setAnchorMargin({});
    expect(mockFoundation.setAnchorMargin).toHaveBeenCalledWith({});
  });

  it('setQuickOpen', () => {
    const {component, mockFoundation} = setupTest();
    component.quickOpen = false;
    expect(mockFoundation.setQuickOpen).toHaveBeenCalledWith(false);
  });

  it('adapter#addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('adapter#removeClass removes a class from the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root.classList.contains('foo')).toBe(false);
  });

  it('adapter#hasClass returns true if the root element has specified class',
     () => {
       const {root, component} = setupTest();
       root.classList.add('foo');
       expect((component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(true);
     });

  it('adapter#hasClass returns false if the root element does not have specified class',
     () => {
       const {component} = setupTest();
       expect((component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(false);
     });

  it('adapter#getInnerDimensions returns the dimensions of the container',
     () => {
       const {root, component} = setupTest();
       expect((component.getDefaultFoundation() as any)
                  .adapter.getInnerDimensions()
                  .width)
           .toEqual(root.offsetWidth);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getInnerDimensions()
                  .height)
           .toEqual(root.offsetHeight);
     });

  it(`adapter#notifyClose fires an ${strings.CLOSED_EVENT} custom event`,
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('notifyClose handler');
       root.addEventListener(strings.CLOSED_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter.notifyClose();
       expect(handler).toHaveBeenCalled();
     });

  it(`adapter#notifyClosing fires an ${strings.CLOSING_EVENT} custom event`,
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('notifyClosing handler');
       root.addEventListener(strings.CLOSING_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter.notifyClosing();
       expect(handler).toHaveBeenCalled();
     });

  it(`adapter#notifyOpen fires an ${strings.OPENED_EVENT} custom event`, () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('notifyOpen handler');
    root.addEventListener(strings.OPENED_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyOpen();
    expect(handler).toHaveBeenCalled();
  });

  it(`adapter#notifyOpening fires an ${strings.OPENING_EVENT} custom event`,
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('notifyOpening handler');
       root.addEventListener(strings.OPENING_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter.notifyOpening();
       expect(handler).toHaveBeenCalled();
     });

  it('adapter#restoreFocus restores focus saved by adapter#saveFocus', () => {
    const {root, component} = setupTest({open: true});
    const button = document.createElement('button');
    document.body.appendChild(button);
    document.body.appendChild(root);
    button.focus();
    (component.getDefaultFoundation() as any).adapter.saveFocus();
    root.focus();
    (component.getDefaultFoundation() as any).adapter.restoreFocus();
    expect(document.activeElement).toEqual(button);
    document.body.removeChild(button);
    document.body.removeChild(root);
  });

  it('adapter#restoreFocus does not restore focus if never called adapter#saveFocus',
     () => {
       const {root, component} = setupTest({open: true});
       const button = document.createElement('button');
       document.body.appendChild(button);
       document.body.appendChild(root);
       button.focus();
       root.focus();
       (component.getDefaultFoundation() as any).adapter.restoreFocus();
       expect(document.activeElement).toEqual(root);
       document.body.removeChild(button);
       document.body.removeChild(root);
     });

  it('adapter#restoreFocus does nothing if the active focused element is not in the menu-surface',
     () => {
       const {root, component} = setupTest({open: true});
       const button = document.createElement('button');
       document.body.appendChild(button);
       document.body.appendChild(root);
       button.focus();
       (component.getDefaultFoundation() as any).adapter.restoreFocus();
       expect(document.activeElement).toEqual(button);
       document.body.removeChild(button);
       document.body.removeChild(root);
     });

  it('adapter#isFocused returns whether the menu surface is focused', () => {
    const {root, component} = setupTest({open: true});
    document.body.appendChild(root);
    root.focus();
    expect((component.getDefaultFoundation() as any).adapter.isFocused())
        .toBe(true);
    document.body.removeChild(root);
  });

  it('adapter#hasAnchor returns true if the menu surface has an anchor', () => {
    const {component} = setupTest({open: true, withAnchor: true});
    component.initialSyncWithDOM();
    expect((component.getDefaultFoundation() as any).adapter.hasAnchor())
        .toBe(true);
  });

  it('adapter#hasAnchor returns false if it does not have an anchor', () => {
    const {root, component} = setupTest({open: true});
    const notAnAnchor = document.createElement('div');
    notAnAnchor.appendChild(root);
    component.initialSyncWithDOM();
    expect((component.getDefaultFoundation() as any).adapter.hasAnchor())
        .toBe(false);
  });

  it('adapter#getAnchorDimensions returns the dimensions of the anchor element',
     () => {
       const {component, anchor} = setupTest({open: true, withAnchor: true}) as
           {component: MDCMenuSurface, anchor: HTMLElement};
       anchor.style.height = '21px';
       anchor.style.width = '42px';
       document.body.appendChild(anchor);
       component.initialSyncWithDOM();
       expect((component.getDefaultFoundation() as any)
                  .adapter.getAnchorDimensions()
                  .height)
           .toBeCloseTo(21);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getAnchorDimensions()
                  .width)
           .toBeCloseTo(42);
       document.body.removeChild(anchor);
     });

  it('adapter#getAnchorDimensions returns undefined if there is no anchor element',
     () => {
       const {root, component} = setupTest({open: true});
       document.body.appendChild(root);
       component.initialSyncWithDOM();
       expect((component.getDefaultFoundation() as any)
                  .adapter.getAnchorDimensions())
           .toBe(null);
       document.body.removeChild(root);
     });

  it('adapter#getViewportDimensions returns the dimensions of the window',
     () => {
       const {root, component} = setupTest({open: true});
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getViewportDimensions()
                  .height)
           .toEqual(window.innerHeight);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getViewportDimensions()
                  .width)
           .toEqual(window.innerWidth);
       document.body.removeChild(root);
     });

  it('adapter#getBodyDimensions returns the body dimensions', () => {
    const {root, component} = setupTest({open: true});
    document.body.appendChild(root);
    expect((component.getDefaultFoundation() as any)
               .adapter.getBodyDimensions()
               .height)
        .toEqual(document.body.clientHeight);
    expect((component.getDefaultFoundation() as any)
               .adapter.getBodyDimensions()
               .width)
        .toEqual(document.body.clientWidth);
    document.body.removeChild(root);
  });

  it('adapter#getWindowScroll returns the scroll position of the window when not scrolled',
     () => {
       const {root, component} = setupTest({open: true});
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getWindowScroll()
                  .x)
           .toEqual(window.pageXOffset);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getWindowScroll()
                  .y)
           .toEqual(window.pageYOffset);
       document.body.removeChild(root);
     });

  it('adapter#isRtl returns true for RTL documents', () => {
    const {component, anchor} = setupTest({open: true, withAnchor: true}) as
        {component: MDCMenuSurface, anchor: HTMLElement};
    anchor.setAttribute('dir', 'rtl');
    document.body.appendChild(anchor);
    expect((component.getDefaultFoundation() as any).adapter.isRtl())
        .toBe(true);
    document.body.removeChild(anchor);
  });

  it('adapter#isRtl returns false for explicit LTR documents', () => {
    const {component, anchor} = setupTest({open: true, withAnchor: true}) as
        {component: MDCMenuSurface, anchor: HTMLElement};
    anchor.setAttribute('dir', 'ltr');
    document.body.appendChild(anchor);
    expect((component.getDefaultFoundation() as any).adapter.isRtl())
        .toBe(false);
    document.body.removeChild(anchor);
  });

  it('adapter#isRtl returns false for implicit LTR documents', () => {
    const {component, anchor} = setupTest({open: true, withAnchor: true}) as
        {component: MDCMenuSurface, anchor: HTMLElement};
    document.body.appendChild(anchor);
    expect((component.getDefaultFoundation() as any).adapter.isRtl())
        .toBe(false);
    document.body.removeChild(anchor);
  });

  it('adapter#isElementInContainer returns true if element is in the menu surface',
     () => {
       const {root, component, anchor} =
           setupTest({open: true, withAnchor: true}) as
           {root: HTMLElement, component: MDCMenuSurface, anchor: HTMLElement};
       const button = document.createElement('button');
       root.appendChild(button);
       document.body.appendChild(anchor);

       expect((component.getDefaultFoundation() as any)
                  .adapter.isElementInContainer(button))
           .toBe(true);
       document.body.removeChild(anchor);
     });

  it('adapter#isElementInContainer returns true if element is the menu surface',
     () => {
       const {root, component, anchor} =
           setupTest({open: true, withAnchor: true}) as
           {root: HTMLElement, component: MDCMenuSurface, anchor: HTMLElement};
       document.body.appendChild(anchor);

       expect((component.getDefaultFoundation() as any)
                  .adapter.isElementInContainer(root))
           .toBe(true);
       document.body.removeChild(anchor);
     });

  it('adapter#isElementInContainer returns false if element is not in the menu surface',
     () => {
       const {component, anchor} = setupTest({open: true, withAnchor: true}) as
           {component: MDCMenuSurface, anchor: HTMLElement};
       document.body.appendChild(anchor);
       const button = document.createElement('button');
       document.body.appendChild(button);

       expect((component.getDefaultFoundation() as any)
                  .adapter.isElementInContainer(button))
           .toBe(false);
       document.body.removeChild(anchor);
       document.body.removeChild(button);
     });

  it('adapter#setTransformOrigin sets the correct transform origin on the menu surface element',
     () => {
       const {root, component} = setupTest();
       // Write expected value and read canonical value from browser.
       root.style.transformOrigin = 'left top 10px';
       const expected = root.style.getPropertyValue(
           `${getCorrectPropertyName(window, 'transform')}-origin`);
       // Reset value.
       root.style.transformOrigin = '';

       (component.getDefaultFoundation() as any)
           .adapter.setTransformOrigin('left top 10px');
       expect(root.style.getPropertyValue(
                  `${getCorrectPropertyName(window, 'transform')}-origin`))
           .toEqual(expected);
     });

  it('adapter#setPosition sets the correct position on the menu surface element',
     () => {
       const {root, component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.setPosition({top: 10, left: 11});
       expect(root.style.top).toEqual('10px');
       expect(root.style.left).toEqual('11px');
       (component.getDefaultFoundation() as any)
           .adapter.setPosition({bottom: 10, right: 11});
       expect(root.style.bottom).toEqual('10px');
       expect(root.style.right).toEqual('11px');
     });

  it('adapter#setMaxHeight sets the maxHeight style on the menu surface element',
     () => {
       const {root, component} = setupTest();
       (component.getDefaultFoundation() as any).adapter.setMaxHeight('100px');
       expect(root.style.maxHeight).toEqual('100px');
     });
});
