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

import {MDCRipple} from '../../mdc-ripple/index';
import {supportsCssVariables} from '../../mdc-ripple/util';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {strings} from '../constants';
import {MDCCheckbox, MDCCheckboxFoundation} from '../index';

function getFixture(): Element {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="mdc-checkbox">
      <input type="checkbox"
             class="mdc-checkbox__native-control"
             id="my-checkbox"
             aria-labelledby="my-checkbox-label"/>
      <div class="mdc-checkbox__frame"></div>
      <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark"
             viewBox="0 0 24 24">
          <path class="mdc-checkbox__checkmark-path"
                fill="none"
                d="M4.1,12.7 9,17.6 20.3,6.3"/>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>
  `;
  const el = wrapper.firstElementChild as Element;
  wrapper.removeChild(el);
  return el;
}

function setupTest() {
  const root = getFixture();
  const cb =
      root.querySelector(strings.NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
  const component = new MDCCheckbox(root);
  return {root, cb, component};
}

function setupMockFoundationTest() {
  const root = getFixture();
  const cb =
      root.querySelector(strings.NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
  const mockFoundation = createMockFoundation(MDCCheckboxFoundation);
  const component = new MDCCheckbox(root, mockFoundation);
  return {root, cb, component, mockFoundation};
}

describe('MDCCheckbox', () => {
  setUpMdcTestEnvironment();

  if (supportsCssVariables(window)) {
    it('#constructor initializes the root element with a ripple', () => {
      const {root} = setupTest();
      jasmine.clock().tick(1);
      expect(root.classList.contains('mdc-ripple-upgraded')).toBeTruthy();
    });

    it('#destroy removes the ripple', () => {
      const {root, component} = setupTest();
      jasmine.clock().tick(1);
      component.destroy();
      jasmine.clock().tick(1);
      expect(root.classList.contains('mdc-ripple-upgraded')).toBeFalsy();
    });

    it('(regression) activates ripple on keydown when the input element surface is active',
       () => {
         const {root} = setupTest();
         const input = root.querySelector('input') as HTMLInputElement;
         jasmine.clock().tick(1);

         const fakeMatches = jasmine.createSpy('.matches');
         fakeMatches.and.returnValue(true);
         input.matches = fakeMatches;

         expect(root.classList.contains('mdc-ripple-upgraded')).toBe(true);
         emitEvent(input, 'keydown');
         jasmine.clock().tick(1);

         expect(root.classList.contains(
                    'mdc-ripple-upgraded--foreground-activation'))
             .toBe(true);
       });
  }

  it('attachTo initializes and returns a MDCCheckbox instance', () => {
    expect(MDCCheckbox.attachTo(getFixture()) instanceof MDCCheckbox)
        .toBeTruthy();
  });

  it('get/set checked updates the checked property on the native checkbox element',
     () => {
       const {cb, component} = setupTest();
       component.checked = true;
       expect(cb.checked).toBeTruthy();
       expect(component.checked).toEqual(cb.checked);
     });

  it('get/set indeterminate updates the indeterminate property on the native checkbox element',
     () => {
       const {cb, component} = setupTest();
       component.indeterminate = true;
       expect(cb.indeterminate).toBeTruthy();
       expect(component.indeterminate).toEqual(cb.indeterminate);
     });

  it('get/set disabled updates the indeterminate property on the native checkbox element',
     () => {
       const {cb, component} = setupTest();
       component.disabled = true;
       expect(cb.disabled).toBeTruthy();
       expect(component.disabled).toEqual(cb.disabled);
     });

  it('get/set value updates the value of the native checkbox element', () => {
    const {cb, component} = setupTest();
    component.value = 'new value';
    expect(cb.value).toEqual('new value');
    expect(component.value).toEqual(cb.value);
  });

  it('get ripple returns a MDCRipple instance', () => {
    const {component} = setupTest();
    expect(component.ripple instanceof MDCRipple).toBeTruthy();
  });

  it('checkbox change event calls #foundation.handleChange', () => {
    const {cb, component} = setupTest();
    (component as any).foundation.handleChange = jasmine.createSpy();
    emitEvent(cb, 'change');
    expect((component as any).foundation.handleChange).toHaveBeenCalled();
  });

  it('root animationend event calls #foundation.handleAnimationEnd', () => {
    const {root, component} = setupTest();
    (component as any).foundation.handleAnimationEnd = jasmine.createSpy();
    emitEvent(root, 'animationend');
    expect((component as any).foundation.handleAnimationEnd).toHaveBeenCalled();
  });

  it('"checked" property change hook calls foundation#handleChange', () => {
    const {cb, mockFoundation} = setupMockFoundationTest();
    cb.checked = true;
    expect(mockFoundation.handleChange).toHaveBeenCalled();
  });

  it('"indeterminate" property change hook calls foundation#handleChange',
     () => {
       const {cb, mockFoundation} = setupMockFoundationTest();
       cb.indeterminate = true;
       expect(mockFoundation.handleChange).toHaveBeenCalled();
     });

  it('checkbox change event handler is destroyed on #destroy', () => {
    const {cb, component} = setupTest();
    (component as any).foundation.handleChange = jasmine.createSpy();
    component.destroy();
    emitEvent(cb, 'change');
    expect((component as any).foundation.handleChange).not.toHaveBeenCalled();
  });

  it('root animationend event handler is destroyed on #destroy', () => {
    const {root, component} = setupTest();
    (component as any).foundation.handleAnimationEnd = jasmine.createSpy();
    component.destroy();
    emitEvent(root, 'animationend');
    expect((component as any).foundation.handleAnimationEnd)
        .not.toHaveBeenCalled();
  });

  it('"checked" property change hook is removed on #destroy', () => {
    const {component, cb, mockFoundation} = setupMockFoundationTest();
    component.destroy();
    cb.checked = true;
    expect(mockFoundation.handleChange).not.toHaveBeenCalled();
  });

  it('"indeterminate" property change hook is removed on #destroy', () => {
    const {component, cb, mockFoundation} = setupMockFoundationTest();
    component.destroy();
    cb.indeterminate = true;
    expect(mockFoundation.handleChange).not.toHaveBeenCalled();
  });

  it('adapter#addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root.classList.contains('foo')).toBeTruthy();
  });

  it('adapter#removeClass removes a class from the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root.classList.contains('foo')).toBeFalsy();
  });

  it('adapter#setNativeControlAttr sets an attribute on the input element',
     () => {
       const {cb, component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.setNativeControlAttr('aria-checked', 'mixed');
       expect(cb.getAttribute('aria-checked')).toEqual('mixed');
     });

  it('adapter#removeNativeControlAttr removes an attribute from the input element',
     () => {
       const {cb, component} = setupTest();
       cb.setAttribute('aria-checked', 'mixed');
       (component.getDefaultFoundation() as any)
           .adapter.removeNativeControlAttr('aria-checked');
       expect(cb.hasAttribute('aria-checked')).toBe(false);
     });

  it('adapter#forceLayout touches "offsetWidth" on the root in order to force layout',
     () => {
       const {root, component} = setupTest();
       const mockGetter = jasmine.createSpy('.offsetWidth');
       Object.defineProperty(root, 'offsetWidth', {
         get: mockGetter,
         set() {},
         enumerable: false,
         configurable: true,
       });

       (component.getDefaultFoundation() as any).adapter.forceLayout();
       expect(mockGetter).toHaveBeenCalled();
     });

  it('adapter#isAttachedToDOM returns true when root is attached to DOM',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       expect(
           (component.getDefaultFoundation() as any).adapter.isAttachedToDOM())
           .toBeTruthy();
       document.body.removeChild(root);
     });

  it('adapter#isAttachedToDOM returns false when root is not attached to DOM',
     () => {
       const {component} = setupTest();
       expect(
           (component.getDefaultFoundation() as any).adapter.isAttachedToDOM())
           .toBeFalsy();
     });

  it('#adapter.isIndeterminate returns true when checkbox is indeterminate',
     () => {
       const {cb, component} = setupTest();
       cb.indeterminate = true;
       expect(
           (component.getDefaultFoundation() as any).adapter.isIndeterminate())
           .toBe(true);
     });

  it('#adapter.isIndeterminate returns false when checkbox is not indeterminate',
     () => {
       const {cb, component} = setupTest();
       cb.indeterminate = false;
       expect(
           (component.getDefaultFoundation() as any).adapter.isIndeterminate())
           .toBe(false);
     });

  it('#adapter.isChecked returns true when checkbox is checked', () => {
    const {cb, component} = setupTest();
    cb.checked = true;
    expect((component.getDefaultFoundation() as any).adapter.isChecked())
        .toBe(true);
  });

  it('#adapter.isChecked returns false when checkbox is not checked', () => {
    const {cb, component} = setupTest();
    cb.checked = false;
    expect((component.getDefaultFoundation() as any).adapter.isChecked())
        .toBe(false);
  });

  it('#adapter.hasNativeControl returns true when checkbox exists', () => {
    const {component} = setupTest();
    expect((component.getDefaultFoundation() as any).adapter.hasNativeControl())
        .toBe(true);
  });

  it('#adapter.setNativeControlDisabled returns true when checkbox is disabled',
     () => {
       const {cb, component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.setNativeControlDisabled(true);
       expect(cb.disabled).toBe(true);
     });

  it('#adapter.setNativeControlDisabled returns false when checkbox is not disabled',
     () => {
       const {cb, component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.setNativeControlDisabled(false);
       expect(cb.disabled).toBe(false);
     });
});
