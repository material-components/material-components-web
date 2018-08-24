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

import {MDCNotchedOutline} from '../../../packages/mdc-notched-outline';

const getFixture = () => bel`
  <div class="mdc-notched-outline">
    <svg>
      <path class="mdc-notched-outline__path">
    </svg>
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

test('#adapter.getWidth returns the width of the element', () => {
  const {root, component} = setupTest();
  const width = component.getDefaultFoundation().adapter_.getWidth();
  assert.equal(width, root.offsetWidth);
});

test('#adapter.getHeight returns the height of the element', () => {
  const {root, component} = setupTest();
  const height = component.getDefaultFoundation().adapter_.getHeight();
  assert.equal(height, root.offsetHeight);
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('#adapter.setOutlinePathAttr sets the SVG path of the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setOutlinePathAttr('M 0 1');
  const path = root.querySelector('.mdc-notched-outline__path');
  assert.equal(path.getAttribute('d'), 'M 0 1');
});

test('#adapter.getIdleOutlineStyleValue returns the value of the given property on the idle outline element', () => {
  const outlineRoot = getFixture();
  const root = bel`<div></div>`;
  root.appendChild(outlineRoot);
  root.appendChild(bel`<div class="mdc-notched-outline__idle"></div>`);
  const idleOutline = root.querySelector('.mdc-notched-outline__idle');
  idleOutline.style.width = '500px';

  const component = new MDCNotchedOutline(outlineRoot);
  assert.equal(
    component.getDefaultFoundation().adapter_.getIdleOutlineStyleValue('width'),
    getComputedStyle(idleOutline).getPropertyValue('width')
  );
});
