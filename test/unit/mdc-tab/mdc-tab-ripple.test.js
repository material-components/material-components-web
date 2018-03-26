/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
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

import {assert} from 'chai';
import bel from 'bel';

import {MDCTabRipple} from '../../../packages/mdc-tab';
import * as util from '../../../packages/mdc-ripple/util';

suite('MDCTabRipple');

test('attachTo initializes and returns a ripple', () => {
  const root = bel`<div>
    <span class="mdc-tab__ripple"></span>
  </div>`;
  const component = MDCTabRipple.attachTo(root);
  assert.instanceOf(component, MDCTabRipple);
});

test('createAdapter() returns the same adapter used by default for the ripple', () => {
  const root = bel`<div>
    <span class="mdc-tab__ripple"></span>
  </div>`;
  const component = MDCTabRipple.attachTo(root);
  assert.deepEqual(Object.keys(MDCTabRipple.createAdapter()), Object.keys(component.foundation_.adapter_));
});

function setupTest() {
  const root = bel`<div>
    <span class="mdc-tab__ripple"></span>
  </div>`;
  const component = new MDCTabRipple(root);
  return {root, component};
}

test('adapter#addClass adds a class to the root', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(component.paintSurface.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root', () => {
  const {component} = setupTest();
  component.paintSurface.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(component.paintSurface.classList.contains('foo'));
});

if (util.supportsCssVariables(window)) {
  test('adapter#updateCssVariable calls setProperty on root style with varName and value', () => {
    const {component} = setupTest();
    component.getDefaultFoundation().adapter_.updateCssVariable('--foo', 'red');
    assert.equal(component.paintSurface.style.getPropertyValue('--foo'), 'red');
  });
}
