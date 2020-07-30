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


import {MDCFloatingLabel} from '../../mdc-floating-label/index';

const getFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <label class="mdc-floating-label"></label>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};


describe('MDCFloatingLabel', () => {
  it('attachTo returns an MDCFloatingLabel instance', () => {
    expect(MDCFloatingLabel.attachTo(getFixture()) instanceof MDCFloatingLabel)
        .toBeTruthy();
  });

  function setupTest() {
    const root = getFixture();
    const component = new MDCFloatingLabel(root);
    return {root, component};
  }

  it('#shake calls the foundation shake method', () => {
    const {component} = setupTest();
    component['foundation'].shake = jasmine.createSpy('');
    component.shake(true);
    expect(component['foundation'].shake).toHaveBeenCalledWith(true);
    expect(component['foundation'].shake).toHaveBeenCalledTimes(1);
  });

  it('#getWidth calls the foundation getWidth method', () => {
    const {component} = setupTest();
    component['foundation'].getWidth = jasmine.createSpy('');
    component.getWidth();
    expect(component['foundation'].getWidth).toHaveBeenCalledTimes(1);
  });

  it('#float calls the foundation float method', () => {
    const {component} = setupTest();
    component['foundation'].float = jasmine.createSpy('');
    component.float(true);
    expect(component['foundation'].float).toHaveBeenCalledWith(true);
    expect(component['foundation'].float).toHaveBeenCalledTimes(1);
  });

  it('#adapter.addClass adds a class to the element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('#adapter.removeClass removes a class from the element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root.classList.contains('foo')).toBe(false);
  });

  it('#adapter.getWidth returns the width of the label element', () => {
    const {root, component} = setupTest();
    expect((component.getDefaultFoundation() as any).adapter.getWidth())
        .toEqual(root.offsetWidth);
  });
});
