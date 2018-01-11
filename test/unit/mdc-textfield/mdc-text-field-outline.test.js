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

import {MDCTextFieldOutline} from '../../../packages/mdc-textfield/outline';

const getFixture = () => bel`
  <div class="mdc-text-field__outline">
    <svg>
      <path class="mdc-text-field__outline-path">
    </svg>
  </div>
`;

suite('MDCTextFieldOutline');

test('attachTo returns an MDCTextFieldOutline instance', () => {
  assert.isOk(MDCTextFieldOutline.attachTo(getFixture()) instanceof MDCTextFieldOutline);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTextFieldOutline(root);
  return {root, component};
}

test('#adapter.getWidth returns the width of the element', () => {
  const {root, component} = setupTest();
  const width = component.getDefaultFoundation().adapter_.getWidth();
  assert.equal(width, root.offsetWidth);
});

test('#adapter.getHeight returns the height of the element', () => {
  const {root, component} = setupTest();
  const height = component.getDefaultFoundation().adapter_.getWidth();
  assert.equal(height, root.offsetHeight);
});

test('#adapter.setOutlinePathAttr sets the SVG path of the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setOutlinePathAttr('M 0 1');
  const path = root.querySelector('.mdc-text-field__outline-path');
  assert.equal(path.getAttribute('d'), 'M 0 1');
});

test('#adapter.getIdleOutlineStyleValue returns the value of the given property on the idle outline element', () => {
  const outlineRoot = getFixture();
  const root = bel`<div></div>`;
  root.appendChild(outlineRoot);
  root.appendChild(bel`<div class="mdc-text-field__idle-outline"></div>`);
  const idleOutline = root.querySelector('.mdc-text-field__idle-outline');
  idleOutline.style.width = '500px';

  const component = new MDCTextFieldOutline(outlineRoot);
  assert.equal(
    component.getDefaultFoundation().adapter_.getIdleOutlineStyleValue('width'),
    getComputedStyle(idleOutline).getPropertyValue('width')
  );
});
