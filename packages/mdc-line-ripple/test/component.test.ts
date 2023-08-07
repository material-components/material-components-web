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

import {MDCLineRipple, MDCLineRippleFoundation} from '../../mdc-line-ripple/index';
import {createFixture, html} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';

const getFixture = () => {
  return createFixture(html`
    <span class="mdc-line-ripple"></span>
  `);
};

describe('MDCLineRipple', () => {
  it('attachTo returns an MDCLineRipple instance', () => {
    expect(MDCLineRipple.attachTo(getFixture()) instanceof MDCLineRipple)
        .toBeTruthy();
  });

  function setupTest() {
    const root = getFixture();
    const component = new MDCLineRipple(root);
    return {root, component};
  }

  it('#adapter.addClass adds a class to the element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root).toHaveClass('foo');
  });

  it('#adapter.removeClass removes a class from the element', () => {
    const {root, component} = setupTest();

    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root).not.toHaveClass('foo');
  });
  it('#adapter.hasClass returns true if a class is on the element', () => {
    const {root, component} = setupTest();

    root.classList.add('foo');
    const hasClass =
        (component.getDefaultFoundation() as any).adapter.hasClass('foo');
    expect(hasClass).toBe(true);
  });

  it('#adapter.setStyle adds a given style property to the element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.setStyle('color', 'blue');
    expect(root.getAttribute('style')).toEqual('color: blue;');
  });

  it('#adapter.registerEventHandler adds event listener for a given event to the element',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('transitionend handler');
       (component.getDefaultFoundation() as any)
           .adapter.registerEventHandler('transitionend', handler);
       emitEvent(root, 'transitionend');

       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('#adapter.deregisterEventHandler removes event listener for a given event from the element',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('transitionend handler');

       root.addEventListener('transitionend', handler);
       (component.getDefaultFoundation() as any)
           .adapter.deregisterEventHandler('transitionend', handler);
       emitEvent(root, 'transitionend');

       expect(handler).not.toHaveBeenCalled();
     });

  function setupMockFoundationTest(root = getFixture()) {
    const mockFoundation = createMockFoundation(MDCLineRippleFoundation);
    const component = new MDCLineRipple(root, mockFoundation);
    return {root, component, mockFoundation};
  }

  it('activate', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.activate();
    expect(mockFoundation.activate).toHaveBeenCalledTimes(1);
  });

  it('deactivate', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.deactivate();
    expect(mockFoundation.deactivate).toHaveBeenCalledTimes(1);
  });

  it('setRippleCenter', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.setRippleCenter(100);
    expect(mockFoundation.setRippleCenter).toHaveBeenCalledWith(100);
    expect(mockFoundation.setRippleCenter).toHaveBeenCalledTimes(1);
  });
});
