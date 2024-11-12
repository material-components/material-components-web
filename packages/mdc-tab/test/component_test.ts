/**
 * @license
 * Copyright 2019 Google Inc.
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

import {createFixture, html} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {MDCTab, MDCTabFoundation} from '../index';

function getFixture() {
  return createFixture(html`
  <button class="mdc-tab" aria-selected="false" role="tab">
    <span class="mdc-tab__content">
      <span class="mdc-tab__text-label">Foo</span>
      <span class="mdc-tab__icon" aria-hidden="true"></span>
    </span>
    <span class="mdc-tab__ripple"></span>
    <span class="mdc-tab-indicator">
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
    </span>
  </button>`);
}

function setupTest({useMockFoundation = false} = {}) {
  const mockFoundation = useMockFoundation ?
      createMockFoundation(MDCTabFoundation) :
      new MDCTabFoundation();
  const root = getFixture();
  const content = root.querySelector<HTMLElement>(
      MDCTabFoundation.strings.CONTENT_SELECTOR)!;
  const component = new MDCTab(root, mockFoundation);
  return {root, component, mockFoundation, content};
}

describe('MDCTab', () => {
  setUpMdcTestEnvironment();

  it('attachTo returns an MDCTab instance', () => {
    expect(MDCTab.attachTo(getFixture()) instanceof MDCTab).toBe(true);
  });

  it('click handler is added during initialSyncWithDOM', () => {
    const {component, root, mockFoundation} =
        setupTest({useMockFoundation: true});

    emitEvent(root, 'click');
    expect(mockFoundation.handleClick).toHaveBeenCalled();

    component.destroy();
  });

  it('click handler is removed during destroy', () => {
    const {component, root, mockFoundation} =
        setupTest({useMockFoundation: true});

    component.destroy();
    emitEvent(root, 'click');
    expect(mockFoundation.handleClick).not.toHaveBeenCalled();
  });

  it('#destroy removes the ripple', () => {
    const {component, root} = setupTest();
    jasmine.clock().tick(1);
    component.destroy();
    jasmine.clock().tick(1);
    expect(root).not.toHaveClass('mdc-ripple-upgraded');
  });

  it('#adapter.addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root).toHaveClass('foo');
  });

  it('#adapter.removeClass removes a class to the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root).not.toHaveClass('foo');
  });

  it('#adapter.hasClass returns true if a class exists on the root element',
     () => {
       const {root, component} = setupTest();
       root.classList.add('foo');
       (component.getDefaultFoundation() as any).adapter.hasClass('foo');
       expect((component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(true);
     });

  it('#adapter.setAttr adds a given attribute to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any)
        .adapter.setAttr('data-foo', 'bar');
    expect(root.getAttribute('data-foo')).toEqual('bar');
  });

  it('#adapter.activateIndicator activates the indicator subcomponent', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.activateIndicator();
    expect(root.querySelector<HTMLElement>('.mdc-tab-indicator'))
        .toHaveClass('mdc-tab-indicator--active');
  });

  it('#adapter.deactivateIndicator deactivates the indicator subcomponent',
     () => {
       const {root, component} = setupTest();
       (component.getDefaultFoundation() as any).adapter.deactivateIndicator();
       expect(root.querySelector<HTMLElement>('.mdc-tab-indicator'))
           .not.toHaveClass('mdc-tab-indicator--active');
     });

  it('#adapter.getOffsetWidth() returns the offsetWidth of the root element',
     () => {
       const {root, component} = setupTest();
       expect(
           (component.getDefaultFoundation() as any)
               .adapter.getOffsetWidth() === root.offsetWidth)
           .toBe(true);
     });

  it('#adapter.getOffsetLeft() returns the offsetLeft of the root element',
     () => {
       const {root, component} = setupTest();
       expect(
           (component.getDefaultFoundation() as any).adapter.getOffsetLeft() ===
           root.offsetLeft)
           .toBe(true);
     });

  it('#adapter.getContentOffsetWidth() returns the offsetLeft of the content element',
     () => {
       const {content, component} = setupTest();
       expect(
           (component.getDefaultFoundation() as any)
               .adapter.getContentOffsetWidth() === content.offsetWidth)
           .toBe(true);
     });

  it('#adapter.getContentOffsetLeft() returns the offsetLeft of the content element',
     () => {
       const {content, component} = setupTest();
       expect(
           (component.getDefaultFoundation() as any)
               .adapter.getContentOffsetLeft() === content.offsetLeft)
           .toBe(true);
     });

  it('#adapter.focus() gives focus to the root element', () => {
    const {root, component} = setupTest();
    document.body.appendChild(root);
    (component.getDefaultFoundation() as any).adapter.focus();
    expect(document.activeElement === root).toBe(true);
    document.body.removeChild(root);
  });

  it('#adapter.isFocused() returns true when the root element is focused',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       (component.getDefaultFoundation() as any).adapter.focus();
       expect((component.getDefaultFoundation() as any).adapter.isFocused())
           .toBe(true);
     });

  it('#adapter.isFocused() returns false when the root element is not focused',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any).adapter.isFocused())
           .toBe(false);
     });

  it(`#adapter.notifyInteracted() emits the ${
         MDCTabFoundation.strings.INTERACTED_EVENT} event`,
     () => {
       const {component} = setupTest();
       const handler = jasmine.createSpy('interaction handler');

       component.listen(MDCTabFoundation.strings.INTERACTED_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter.notifyInteracted();
       expect(handler).toHaveBeenCalled();
     });

  it('#active getter calls foundation.isActive', () => {
    const {component, mockFoundation} = setupTest({useMockFoundation: true});
    component.active;
    expect(mockFoundation.isActive).toHaveBeenCalled();
  });

  it('#focusOnActivate setter calls foundation.setFocusOnActivate', () => {
    const {component, mockFoundation} = setupTest({useMockFoundation: true});
    component.focusOnActivate = false;
    expect(mockFoundation.setFocusOnActivate).toHaveBeenCalledWith(false);
  });

  it('#activate() calls activate', () => {
    const {component, mockFoundation} = setupTest({useMockFoundation: true});
    component.activate();
    expect(mockFoundation.activate).toHaveBeenCalledWith(undefined);
  });

  it('#activate({ClientRect}) calls activate', () => {
    const {component, mockFoundation} = setupTest({useMockFoundation: true});
    component.activate({width: 100, left: 200} as DOMRect);
    expect(mockFoundation.activate)
        .toHaveBeenCalledWith({width: 100, left: 200} as DOMRect);
  });

  it('#deactivate() calls deactivate', () => {
    const {component, mockFoundation} = setupTest({useMockFoundation: true});
    component.deactivate();
    expect(mockFoundation.deactivate).toHaveBeenCalled();
  });

  it('#computeIndicatorClientRect() returns the indicator element\'s bounding client rect',
     () => {
       const {root, component} = setupTest();
       (component.getDefaultFoundation() as any).adapter.deactivateIndicator();
       expect(component.computeIndicatorClientRect())
           .toEqual(root.querySelector<HTMLElement>(
                            '.mdc-tab-indicator')!.getBoundingClientRect());
     });

  it('#computeDimensions() calls computeDimensions', () => {
    const {component, mockFoundation} = setupTest({useMockFoundation: true});
    component.computeDimensions();
    expect(mockFoundation.computeDimensions).toHaveBeenCalled();
  });
});
