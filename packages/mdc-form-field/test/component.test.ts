/**
 * @license
 * Copyright 2017 Google Inc.
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

import {MDCFormField} from '../../mdc-form-field/index';
import {createFixture, html} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';

function getFixture() {
  return createFixture(html`
    <div class="mdc-form-field">
      <input type="radio" id="radio" checked name="radio">
      <label for="radio">Foo</label>
    </div>
  `);
}

function setupTest() {
  const root = getFixture();
  const component = new MDCFormField(root);
  return {root, component};
}

describe('MDCFormField', () => {
  it('attachTo initializes and returns an MDCFormField instance', () => {
    expect(MDCFormField.attachTo(getFixture()) instanceof MDCFormField)
        .toBeTruthy();
  });

  it('get/set input', () => {
    const {component} = setupTest();
    const input = {
      ripple: undefined,
    };

    component.input = input;

    expect(component.input === input).toBeTruthy();
  });

  it('adapter#registerInteractionHandler adds an event listener to the label element',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('eventHandler');
       const label = root.querySelector('label') as HTMLElement;

       (component.getDefaultFoundation() as any)
           .adapter.registerInteractionHandler('click', handler);
       emitEvent(label, 'click');

       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('adapter#deregisterInteractionHandler removes an event listener from the root element',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('eventHandler');
       const label = root.querySelector('label') as HTMLElement;
       label.addEventListener('click', handler);

       (component.getDefaultFoundation() as any)
           .adapter.deregisterInteractionHandler('click', handler);
       emitEvent(label, 'click');

       expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
     });

  it('adapter#activateInputRipple calls activate on the input ripple', () => {
    const {component} = setupTest();
    const ripple = {activate: jasmine.createSpy('activate')} as any;
    const input = {ripple};

    component.input = input;
    (component.getDefaultFoundation() as any).adapter.activateInputRipple();

    expect(ripple.activate).toHaveBeenCalled();
  });

  it('adapter#activateInputRipple does not throw if there is no input', () => {
    const {component} = setupTest();

    expect(
        () => (component.getDefaultFoundation() as any)
                  .adapter.activateInputRipple)
        .not.toThrow();
  });

  it('adapter#activateInputRipple does not throw if the input has no ripple getter',
     () => {
       const {component} = setupTest();
       const input = {ripple: undefined};

       component.input = input;

       expect(
           () => (component.getDefaultFoundation() as any)
                     .adapter.activateInputRipple)
           .not.toThrow();
     });

  it('adapter#deactivateInputRipple calls deactivate on the input ripple',
     () => {
       const {component} = setupTest();
       const ripple = {deactivate: jasmine.createSpy('deactivate')} as any;
       const input = {ripple};

       component.input = input;
       (component.getDefaultFoundation() as any)
           .adapter.deactivateInputRipple();

       expect(ripple.deactivate).toHaveBeenCalled();
     });

  it('adapter#deactivateInputRipple does not throw if there is no input',
     () => {
       const {component} = setupTest();

       expect(
           () => (component.getDefaultFoundation() as any)
                     .adapter.deactivateInputRipple)
           .not.toThrow();
     });

  it('adapter#deactivateInputRipple does not throw if the input has no ripple getter',
     () => {
       const {component} = setupTest();
       const input = {ripple: undefined};

       component.input = input;

       expect(
           () => (component.getDefaultFoundation() as any)
                     .adapter.deactivateInputRipple)
           .not.toThrow();
     });
});
