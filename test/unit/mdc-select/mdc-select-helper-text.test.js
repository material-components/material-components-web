/**
 * @license
 * Copyright 2018 Google Inc.
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

import {MDCSelectHelperText} from '../../../packages/mdc-select/helper-text/index';

const getFixture = () => bel`
  <div class="mdc-select-helper-text"></div>
`;

suite('MDCSelectHelperText');

test('attachTo returns an MDCSelectHelperText instance', () => {
  assert.isOk(MDCSelectHelperText.attachTo(getFixture()) instanceof MDCSelectHelperText);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCSelectHelperText(root);
  return {root, component};
}

test('#adapter.addClass adds a class to the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('#adapter.removeClass removes a class from the element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('#adapter.hasClass returns whether or not the element contains a certain class', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
  root.classList.remove('foo');
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('#adapter.setAttr adds a given attribute to the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('aria-label', 'foo');
  assert.equal(root.getAttribute('aria-label'), 'foo');
});

test('#adapter.removeAttr removes a given attribute from the element', () => {
  const {root, component} = setupTest();
  root.setAttribute('aria-label', 'foo');
  component.getDefaultFoundation().adapter_.removeAttr('aria-label', 'foo');
  assert.isNotOk(root.hasAttribute('aria-label'));
});

test('#adapter.setContent sets the text content of the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setContent('foo');
  assert.equal(root.textContent, 'foo');
});
