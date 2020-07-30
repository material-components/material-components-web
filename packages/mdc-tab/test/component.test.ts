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

import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {MDCTab, MDCTabFoundation} from '../index';

const getFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <button class="mdc-tab" aria-selected="false" role="tab">
    <span class="mdc-tab__content">
      <span class="mdc-tab__text-label">Foo</span>
      <span class="mdc-tab__icon" aria-hidden="true"></span>
    </span>
    <span class="mdc-tab__ripple"></span>
    <span class="mdc-tab-indicator">
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
    </span>
  </button>`;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

function setupTest({useMockFoundation = false} = {}) {
  let mockFoundation = useMockFoundation ?
      createMockFoundation(MDCTabFoundation) :
      new MDCTabFoundation();
  const root = getFixture();
  const content = root.querySelector(
                      MDCTabFoundation.strings.CONTENT_SELECTOR) as HTMLElement;
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
    expect(root.classList.contains('mdc-ripple-upgraded')).toBeFalsy();
  });

  it('#adapter.addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('#adapter.removeClass removes a class to the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root.classList.contains('foo')).toBe(false);
  });

  it('#adapter.hasClass returns true if a class exists on the root element',
     () => {
       const {root, component} = setupTest();
       root.classList.add('foo');
       (component.getDefaultFoundation() as any).adapter.hasClass('foo');
       expect(
           (component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(true);
     });

  it('#adapter.setAttr adds a given attribute to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.setAttr('foo', 'bar');
    expect(root.getAttribute('foo')).toEqual('bar');
  });

  it('#adapter.activateIndicator activates the indicator subcomponent', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.activateIndicator();
    expect((root.querySelector('.mdc-tab-indicator') as Element)
               .classList.contains('mdc-tab-indicator--active'))
        .toBeTruthy();
  });

  it('#adapter.deactivateIndicator deactivates the indicator subcomponent',
     () => {
       const {root, component} = setupTest();
       (component.getDefaultFoundation() as any).adapter.deactivateIndicator();
       expect((root.querySelector('.mdc-tab-indicator') as Element)
                  .classList.contains('mdc-tab-indicator--active'))
           .toBeFalsy();
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
           (component.getDefaultFoundation() as any)
               .adapter.getOffsetLeft() === root.offsetLeft)
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
    component.activate({width: 100, left: 200} as ClientRect);
    expect(mockFoundation.activate)
        .toHaveBeenCalledWith({width: 100, left: 200} as ClientRect);
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
           .toEqual((root.querySelector('.mdc-tab-indicator') as HTMLElement)
                        .getBoundingClientRect());
     });

  it('#computeDimensions() calls computeDimensions', () => {
    const {component, mockFoundation} = setupTest({useMockFoundation: true});
    component.computeDimensions();
    expect(mockFoundation.computeDimensions).toHaveBeenCalled();
  });
});
