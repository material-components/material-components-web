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


import {createFixture, html} from '../../../../testing/dom';
import {MDCTextFieldCharacterCounter} from '../../../mdc-textfield/character-counter/index';

const getFixture = () => {
  return createFixture(html`
    <div class="mdc-text-field-character-counter">0/10</div>
  `);
};

describe('MDCTextFieldCharacterCounter', () => {
  it('attachTo returns an MDCTextFieldCharacterCounter instance', () => {
    expect(
        MDCTextFieldCharacterCounter.attachTo(getFixture()) instanceof
        MDCTextFieldCharacterCounter)
        .toBeTruthy();
  });

  function setupTest() {
    const root = getFixture();
    const component = new MDCTextFieldCharacterCounter(root);
    return {root, component};
  }

  it('#adapter.setContent sets the text content of the element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.setContent('5 / 10');
    expect(root.textContent).toEqual('5 / 10');
  });
});
