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

import {MDCRipple} from '../../../mdc-ripple/component';
import {supportsCssVariables} from '../../../mdc-ripple/util';
import {MDCSwitch} from '../component';
import {strings} from '../constants';
import {MDCSwitchFoundation} from '../foundation';
import {emitEvent} from '../../../../testing/dom/events';
import {createMockFoundation} from '../../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';

const {NATIVE_CONTROL_SELECTOR, RIPPLE_SURFACE_SELECTOR} = strings;

function getFixture(): Element {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="mdc-switch">
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__thumb-underlay">
        <div class="mdc-switch__thumb">
          <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch">
        </div>
      </div>
    </div>
  `;
  const el = wrapper.firstElementChild as Element;
  wrapper.removeChild(el);
  return el;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCSwitch(root);
  const rippleSurface = root.querySelector(RIPPLE_SURFACE_SELECTOR);
  return {root, component, rippleSurface};
}

describe('MDCSwitch', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns a MDCSwitch instance', () => {
    expect(MDCSwitch.attachTo(getFixture() as HTMLElement) instanceof MDCSwitch)
        .toBeTruthy();
  });

  if (supportsCssVariables(window)) {
    it('#constructor initializes the root element with a ripple', () => {
      const {rippleSurface} = setupTest();
      jasmine.clock().tick(1);
      expect(rippleSurface!.classList.contains('mdc-ripple-upgraded'))
          .toBeTruthy();
    });

    it('#destroy removes the ripple', () => {
      const {component, rippleSurface} = setupTest();
      jasmine.clock().tick(1);
      component.destroy();
      jasmine.clock().tick(1);
      expect(rippleSurface!.classList.contains('mdc-ripple-upgraded'))
          .toBeFalsy();
    });
  }

  it('get/set checked updates the checked value of the native switch input element',
     () => {
       const {root, component} = setupTest();
       const inputEl =
           root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
       component.checked = true;
       expect(inputEl.checked).toBeTruthy();
       expect(component.checked).toEqual(inputEl.checked);
     });

  it('get/set checked updates the component styles', () => {
    const {root, component} = setupTest();
    component.checked = true;
    expect(root.classList.contains(MDCSwitchFoundation.cssClasses.CHECKED))
        .toBeTruthy();
    component.checked = false;
    expect(root.classList.contains(MDCSwitchFoundation.cssClasses.CHECKED))
        .toBeFalsy();
  });

  it('get/set disabled updates the disabled value of the native switch input element',
     () => {
       const {root, component} = setupTest();
       const inputEl =
           root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
       component.disabled = true;
       expect(inputEl.disabled).toBeTruthy();
       expect(component.disabled).toEqual(inputEl.disabled);
       component.disabled = false;
       expect(inputEl.disabled).toBeFalsy();
       expect(component.disabled).toEqual(inputEl.disabled);
     });

  it('get/set disabled updates the component styles', () => {
    const {root, component} = setupTest();
    component.disabled = true;
    expect(root.classList.contains(MDCSwitchFoundation.cssClasses.DISABLED))
        .toBeTruthy();
    component.disabled = false;
    expect(root.classList.contains(MDCSwitchFoundation.cssClasses.DISABLED))
        .toBeFalsy();
  });

  it('get/set checked updates the aria-checked of the native switch input element',
     () => {
       const {root, component} = setupTest();
       const inputEl = root.querySelector(NATIVE_CONTROL_SELECTOR);
       component.checked = true;
       expect(
           inputEl!.getAttribute(MDCSwitchFoundation.strings.ARIA_CHECKED_ATTR))
           .toBe('true');
       component.checked = false;
       expect(
           inputEl!.getAttribute(MDCSwitchFoundation.strings.ARIA_CHECKED_ATTR))
           .toBe('false');
     });

  it('get ripple returns a MDCRipple instance', () => {
    const {component} = setupTest();
    expect(component.ripple instanceof MDCRipple).toBeTruthy();
  });

  function setupMockFoundationTest(root = getFixture()) {
    const mockFoundation = createMockFoundation(MDCSwitchFoundation);
    const component = new MDCSwitch(root, mockFoundation);
    return {root, component, mockFoundation};
  }

  it('#initialSyncWithDOM calls foundation.setChecked', () => {
    const root = getFixture();
    const inputEl =
        root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
    inputEl.checked = true;
    const {mockFoundation} = setupMockFoundationTest(root);
    expect(mockFoundation.setChecked).toHaveBeenCalledWith(true);
    expect(mockFoundation.setChecked).toHaveBeenCalledTimes(1);
  });

  it('change handler is added to the native control element', () => {
    const {root, mockFoundation} = setupMockFoundationTest();

    const inputEl =
        root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
    emitEvent(inputEl, 'change');

    expect(mockFoundation.handleChange).toHaveBeenCalledTimes(1);
  });

  it('change handler is removed from the native control element on destroy',
     () => {
       const {root, component, mockFoundation} = setupMockFoundationTest();
       component.destroy();

       const inputEl =
           root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
       emitEvent(inputEl, 'change');

       expect(mockFoundation.handleChange).not.toHaveBeenCalled();
     });
});
