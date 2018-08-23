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
import td from 'testdouble';
import {assert} from 'chai';

import {MDCFloatingLabel} from '../../../packages/mdc-floating-label/index';

const getFixture = () => bel`
  <label class="mdc-floating-label"></label>
`;

suite('MDCFloatingLabel');

test('attachTo returns an MDCFloatingLabel instance', () => {
  assert.isOk(MDCFloatingLabel.attachTo(getFixture()) instanceof MDCFloatingLabel);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCFloatingLabel(root);
  return {root, component};
}

test('#shake calls the foundation shake method', () => {
  const {component} = setupTest();
  component.foundation_.shake = td.func();
  component.shake(true);
  td.verify(component.foundation_.shake(true), {times: 1});
});

test('#getWidth calls the foundation getWidth method', () => {
  const {component} = setupTest();
  component.foundation_.getWidth = td.func();
  component.getWidth();
  td.verify(component.foundation_.getWidth(), {times: 1});
});

test('#float calls the foundation float method', () => {
  const {component} = setupTest();
  component.foundation_.float = td.func();
  component.float(true);
  td.verify(component.foundation_.float(true), {times: 1});
});

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

test('#adapter.getWidth returns the width of the label element', () => {
  const {root, component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getWidth(), root.offsetWidth);
});
