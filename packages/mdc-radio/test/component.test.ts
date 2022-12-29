/**
 * @license
 * Copyright 2016 Google Inc.
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
import {createFixture, html} from '../../../testing/dom';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {MDCRadio, MDCRadioFoundation} from '../index';

const {NATIVE_CONTROL_SELECTOR} = MDCRadioFoundation.strings;

function getFixture() {
  return createFixture(html`
    <div class="mdc-radio">
      <input type="radio" id="my-radio" name="my-radio-group"
             class="mdc-radio__native-control" aria-labelledby="my-radio-label">
      <div class="mdc-radio__background">
        <div class="mdc-radio__outer-circle"></div>
        <div class="mdc-radio__inner-circle"></div>
      </div>
    </div>
  `);
}

function setupTest() {
  const root = getFixture();
  const component = new MDCRadio(root);
  return {root, component};
}

describe('MDCRadio', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns a MDCRadio instance', () => {
    expect(MDCRadio.attachTo(getFixture()) instanceof MDCRadio).toBeTruthy();
  });

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
  }

  it('get/set checked updates the checked value of the native radio element',
     () => {
       const {root, component} = setupTest();
       const radio =
           root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
       component.checked = true;
       expect(radio.checked).toBeTruthy();
       expect(component.checked).toEqual(radio.checked);
     });

  it('get/set disabled updates the disabled value of the native radio element',
     () => {
       const {root, component} = setupTest();
       const radio =
           root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
       component.disabled = true;
       expect(radio.disabled).toBeTruthy();
       expect(component.disabled).toEqual(radio.disabled);
       component.disabled = false;
       expect(radio.disabled).toBeFalsy();
       expect(component.disabled).toEqual(radio.disabled);
     });

  it('get/set value updates the value of the native radio element', () => {
    const {root, component} = setupTest();
    const radio =
        root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
    component.value = 'new value';
    expect(radio.value).toEqual('new value');
    expect(component.value).toEqual(radio.value);
  });

  it('get ripple returns a MDCRipple instance', () => {
    const {component} = setupTest();
    expect(component.ripple instanceof MDCRipple).toBeTruthy();
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

  it('#adapter.setNativeControlDisabled sets the native control element\'s disabled property to true',
     () => {
       const {root, component} = setupTest();
       const radio =
           root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;

       (component.getDefaultFoundation() as any)
           .adapter.setNativeControlDisabled(true);
       expect(radio.disabled).toBe(true);
     });

  it('#adapter.setNativeControlDisabled sets the native control element\'s disabled property to false',
     () => {
       const {root, component} = setupTest();
       const radio =
           root.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
       radio.disabled = true;

       (component.getDefaultFoundation() as any)
           .adapter.setNativeControlDisabled(false);
       expect(radio.disabled).toBe(false);
     });
});
