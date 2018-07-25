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
