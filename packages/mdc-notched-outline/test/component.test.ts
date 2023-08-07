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
import {createFixture, html} from '../../../testing/dom';

function getFixture() {
  return createFixture(html`
    <span class="mdc-notched-outline">
      <span class="mdc-notched-outline__leading"></span>
      <span class="mdc-notched-outline__notch"></span>
      <span class="mdc-notched-outline__trailing"></span>
    </span>
  `);
}

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
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root).toHaveClass('foo');
  });

  it('adapter#removeClass removes a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    (component.getDefaultFoundation() as any).adapter.setNotchWidthProperty(50);
    (component.getDefaultFoundation() as any)
        .adapter.removeNotchWidthProperty();
    const path =
        root.querySelector<HTMLElement>('.mdc-notched-outline__notch')!;
    expect(path.style.width).toEqual('');
  });

  it('#adapter.setNotchWidthProperty sets the width property on the notched element',
     () => {
       const {root, component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.setNotchWidthProperty(50);
       const path =
           root.querySelector<HTMLElement>('.mdc-notched-outline__notch')!;
       expect(path.style.width).toEqual('50px');
     });
});
