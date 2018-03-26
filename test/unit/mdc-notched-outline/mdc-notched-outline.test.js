/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
