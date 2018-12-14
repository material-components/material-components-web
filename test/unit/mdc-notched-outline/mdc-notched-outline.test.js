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

import {MDCNotchedOutline} from '../../../packages/mdc-notched-outline/index';

const getFixture = () => bel`
  <div class="mdc-notched-outline">
    <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch"></div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
`;

suite('MDCNotchedOutline');

test('attachTo returns an MDCNotchedOutline instance', () => {
  assert.isOk(MDCNotchedOutline.attachTo(getFixture()) instanceof MDCNotchedOutline);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCNotchedOutline(root);
  return {root, component};
}

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.removeClass('foo');
  component.getDefaultFoundation().adapter_.setNotchWidthProperty(50);
  component.getDefaultFoundation().adapter_.removeNotchWidthProperty();
  const path = root.querySelector('.mdc-notched-outline__notch');
  assert.equal('', path.style.width);
});

test('#adapter.setNotchWidthProperty sets the width property on the notched element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setNotchWidthProperty(50);
  const path = root.querySelector('.mdc-notched-outline__notch');
  assert.equal('50px', path.style.width);
});
