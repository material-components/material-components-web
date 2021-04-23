/**
 * @license
 * Copyright 2021 Google Inc.
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

import {spyOnAllFunctions, spyOnAllPrototypeFunctions} from '../../../testing/helpers/jasmine';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {MDCSwitchRenderAdapter} from '../adapter';
import {MDCSwitch} from '../component';
import {CssClasses} from '../constants';
import {MDCSwitchRenderFoundation} from '../foundation';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button class="mdc-switch" role="switch" aria-checked="false">
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__handle-track">
        <div class="mdc-switch__handle">
          <div class="mdc-switch__ripple"></div>
          <div class="mdc-switch__handle">
            <div class="mdc-switch__icons">
              <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24" width="18" height="18">
                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
              </svg>
              <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24" width="18" height="18">
                <path d="M20 13H4v-2h16v2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </button>
  `;
  const el = wrapper.firstElementChild as HTMLButtonElement;
  wrapper.removeChild(el);
  return el;
}

class MockMDCSwitch extends MDCSwitch {
  static attachTo(root: HTMLButtonElement) {
    return new MockMDCSwitch(root);
  }

  adapter!: jasmine.SpyObj<MDCSwitchRenderAdapter>;
  foundation!: jasmine.SpyObj<MDCSwitchRenderFoundation>;

  getDefaultFoundation() {
    const foundation = spyOnAllPrototypeFunctions(super.getDefaultFoundation())
                           .and.callThrough();
    this.foundation = this.foundation || foundation;
    return foundation;
  }

  protected createAdapter() {
    const adapter = spyOnAllFunctions(super.createAdapter()).and.callThrough();
    this.adapter = this.adapter || adapter;
    return adapter;
  }
}

function setupTest() {
  const root = getFixture();
  const component = MockMDCSwitch.attachTo(root);
  return {
    root,
    component,
    adapter: component.adapter,
    foundation: component.foundation,
  };
}

describe('MDCSwitch', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns a MDCSwitch instance', () => {
    const {component} = setupTest();
    expect(component instanceof MDCSwitch).toBeTruthy();
  });

  it('#initialSyncWithDOM() calls foundation initFromDOM()', () => {
    const {foundation} = setupTest();
    expect(foundation.initFromDOM).toHaveBeenCalledTimes(1);
  });

  it('#initialSyncWithDOM() adds foundation.handleClick listener to root',
     () => {
       const {root, foundation} = setupTest();
       root.click();
       expect(foundation.handleClick).toHaveBeenCalledTimes(1);
     });

  it('#destroy() removes foundation.handleClick listener from root', () => {
    const {component, root, foundation} = setupTest();
    component.destroy();
    root.click();
    expect(foundation.handleClick).not.toHaveBeenCalled();
  });

  it('adapter.addClass() adds classes to root', () => {
    const {root, adapter} = setupTest();
    expect(Array.from(root.classList)).not.toContain(CssClasses.PROCESSING);
    adapter.addClass(CssClasses.PROCESSING);
    expect(Array.from(root.classList)).toContain(CssClasses.PROCESSING);
  });

  it('adapter.getAriaChecked() returns root aria-checked attribute', () => {
    const {root, adapter} = setupTest();
    root.setAttribute('aria-checked', 'true');
    expect(adapter.getAriaChecked()).toBe('true');
    root.setAttribute('aria-checked', 'false');
    expect(adapter.getAriaChecked()).toBe('false');
    root.removeAttribute('aria-checked');
    expect(adapter.getAriaChecked()).toBe(null);
  });

  it('adapter.hasClass() checks classes on root', () => {
    const {root, adapter} = setupTest();
    expect(adapter.hasClass(CssClasses.PROCESSING))
        .toBe(false, 'returns false when class does not exist');
    root.classList.add(CssClasses.PROCESSING);
    expect(adapter.hasClass(CssClasses.PROCESSING))
        .toBe(true, 'returns true when class exists');
  });

  it('adapter.isDisabled() returns root disabled property', () => {
    const {root, adapter} = setupTest();
    root.disabled = true;
    expect(adapter.isDisabled()).toBe(true);
  });

  it('adapter.removeClass() removes classes from root', () => {
    const {root, adapter} = setupTest();
    root.classList.add(CssClasses.PROCESSING);
    adapter.removeClass(CssClasses.PROCESSING);
    expect(Array.from(root.classList)).not.toContain(CssClasses.PROCESSING);
  });

  it('adapter.setAriaChecked() sets aria-checked attribute on root', () => {
    const {root, adapter} = setupTest();
    adapter.setAriaChecked('true');
    expect(root.getAttribute('aria-checked')).toBe('true');
    adapter.setAriaChecked('false');
    expect(root.getAttribute('aria-checked')).toBe('false');
  });

  it('adapter.state should be the component instance', () => {
    const {adapter, component} = setupTest();
    expect(adapter.state).toBe(component);
  });
});
