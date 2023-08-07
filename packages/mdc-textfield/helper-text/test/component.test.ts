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


import {createFixture, html} from '../../../../testing/dom';
import {MDCTextFieldHelperText} from '../../../mdc-textfield/helper-text/index';

const getFixture = () => {
  return createFixture(html`
  <div class="mdc-textfield__helper-text"></div>
`);
};

describe('MDCTextFieldHelperText', () => {
  it('attachTo returns an MDCTextFieldHelperText instance', () => {
    expect(
        MDCTextFieldHelperText.attachTo(getFixture()) instanceof
        MDCTextFieldHelperText)
        .toBeTruthy();
  });

  function setupTest() {
    const root = getFixture();
    const component = new MDCTextFieldHelperText(root);
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

  it('#adapter.hasClass returns whether or not the element contains a certain class',
     () => {
       const {root, component} = setupTest();
       root.classList.add('foo');
       expect((component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBeTruthy();
       root.classList.remove('foo');
       expect((component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBeFalsy();
     });

  it('#adapter.getAttr retrieves a given attribute from the element', () => {
    const {root, component} = setupTest();
    root.setAttribute('foobar', 'baz');
    expect(component.getDefaultFoundation()['adapter'].getAttr('foobar'))
        .toEqual('baz');
  });

  it('#adapter.setAttr adds a given attribute to the element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any)
        .adapter.setAttr('aria-label', 'foo');
    expect(root.getAttribute('aria-label')).toEqual('foo');
  });

  it('#adapter.removeAttr removes a given attribute from the element', () => {
    const {root, component} = setupTest();
    root.setAttribute('aria-label', 'foo');
    (component.getDefaultFoundation() as any)
        .adapter.removeAttr('aria-label', 'foo');
    expect(root.hasAttribute('aria-label')).toBeFalsy();
  });

  it('#adapter.setContent sets the text content of the element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.setContent('foo');
    expect(root.textContent).toEqual('foo');
  });
});
