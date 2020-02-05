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

import {emitEvent} from '../../../../testing/dom/events';
import {getFixture as createFixture} from '../../../../testing/dom/index';
import {MDCSelectIcon, MDCSelectIconFoundation} from '../index';

const getFixture = () => createFixture(`
  <div class="mdc-select__icon"></div>
`);

describe('MDCSelectIcon', () => {
  it('attachTo returns an MDCSelectIcon instance', () => {
    expect(MDCSelectIcon.attachTo(getFixture()) instanceof MDCSelectIcon)
        .toBeTruthy();
  });

  function setupTest() {
    const root = getFixture();
    const component = new MDCSelectIcon(root);
    return {root, component};
  }

  it('#adapter.getAttr returns the value of a given attribute on the element',
     () => {
       const {root, component} = setupTest();
       const expectedAttr = 'tabindex';
       const expectedValue = '0';
       root.setAttribute(expectedAttr, expectedValue);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.getAttr(expectedAttr))
           .toEqual(expectedValue);
     });

  it('#adapter.setAttr adds a given attribute to the element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any)
        .adapter_.setAttr('aria-label', 'foo');
    expect(root.getAttribute('aria-label')).toEqual('foo');
  });

  it('#adapter.removeAttr removes a given attribute from the element', () => {
    const {root, component} = setupTest();
    root.setAttribute('role', 'button');
    (component.getDefaultFoundation() as any).adapter_.removeAttr('role');
    expect(root.hasAttribute('role')).toBe(false);
  });

  it('#adapter.setContent sets the text content of the element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.setContent('foo');
    expect(root.textContent).toEqual('foo');
  });

  it('#adapter.registerInteractionHandler adds event listener for a given event to the element',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('keydown handler');
       (component.getDefaultFoundation() as any)
           .adapter_.registerInteractionHandler('keydown', handler);
       emitEvent(root, 'keydown');

       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('#adapter.deregisterInteractionHandler removes event listener for a given event from the element',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('keydown handler');

       root.addEventListener('keydown', handler);
       (component.getDefaultFoundation() as any)
           .adapter_.deregisterInteractionHandler('keydown', handler);
       emitEvent(root, 'keydown');

       expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
     });

  it('#adapter.notifyIconAction emits ' +
         `${MDCSelectIconFoundation.strings.ICON_EVENT}`,
     () => {
       const {component} = setupTest();
       const handler = jasmine.createSpy('handler');

       component.listen(MDCSelectIconFoundation.strings.ICON_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter_.notifyIconAction();

       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });
});
