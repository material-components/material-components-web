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


import {MDCNotchedOutline} from '../../mdc-notched-outline/index';

const getFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="mdc-notched-outline">
      <div class="mdc-notched-outline__leading"></div>
      <div class="mdc-notched-outline__notch"></div>
      <div class="mdc-notched-outline__trailing"></div>
    </div>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

describe('MDCNotchedOutline', () => {
  it('attachTo returns an MDCNotchedOutline instance', () => {
    expect(
        MDCNotchedOutline.attachTo(getFixture()) instanceof MDCNotchedOutline)
        .toBeTruthy();
  });

  function setupTest() {
    const root = getFixture();
    const component = new MDCNotchedOutline(root);
    return {root, component};
  }

  it('adapter#addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('adapter#removeClass removes a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.removeClass('foo');
    (component.getDefaultFoundation() as any)
        .adapter_.setNotchWidthProperty(50);
    (component.getDefaultFoundation() as any)
        .adapter_.removeNotchWidthProperty();
    const path =
        root.querySelector('.mdc-notched-outline__notch') as HTMLElement;
    expect('').toEqual(path.style.width as string);
  });

  it('#adapter.setNotchWidthProperty sets the width property on the notched element',
     () => {
       const {root, component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter_.setNotchWidthProperty(50);
       const path =
           root.querySelector('.mdc-notched-outline__notch') as HTMLElement;
       expect('50px').toEqual(path.style.width as string);
     });
});
