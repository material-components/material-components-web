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

import bel from 'bel';
import {assert} from 'chai';

import {MDCTextFieldAffix} from '../../../packages/mdc-textfield/affix';

const getFixture = () => bel`
  <span class="mdc-text-field__prefix"></span>
`;

suite('MDCTextFieldAffix');

test('attachTo returns an MDCTextFieldAffix instance', () => {
  assert.isOk(MDCTextFieldAffix.attachTo(getFixture()) instanceof MDCTextFieldAffix);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTextFieldAffix(root);
  return {root, component};
}

test('#adapter.getWidth returns the width of the affix', () => {
  const {root, component} = setupTest();
  const rootRect = root.getBoundingClientRect();
  const expectedWidth = rootRect.right - rootRect.left;
  assert.equal(component.getDefaultFoundation().adapter_.getWidth(), expectedWidth);
});

test('#adapter.addClass adds a class to the affix element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('#adapter.removeClass removes a class from the affix element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('#adapter.hasClass returns whether or not the element contains a given class', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
  root.classList.remove('foo');
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('#adapter.isRtl returns whether or not the document is RTL', () => {
  const {root, component} = setupTest();
  root.ownerDocument.dir = 'rtl';
  assert.isOk(component.getDefaultFoundation().adapter_.isRtl());
  root.ownerDocument.dir = '';
  assert.isNotOk(component.getDefaultFoundation().adapter_.isRtl());
});
