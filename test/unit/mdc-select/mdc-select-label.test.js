/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import {assert} from 'chai';
import bel from 'bel';
import td from 'testdouble';

import {MDCSelectLabel} from '../../../packages/mdc-select/label';

function getFixture() {
  return bel`
    <div class="mdc-select__label">Label</div>
  `;
}

function setupTest() {
  const fixture = getFixture();
  const component = new MDCSelectLabel(fixture);

  return {component, fixture};
}

suite('MDCSelectLabel');

test('attachTo returns a component instance', () => {
  assert.isTrue(MDCSelectLabel.attachTo(getFixture()) instanceof MDCSelectLabel);
});

test('#float should call styleFloat on foundation', () => {
  const {component} = setupTest();
  const value = 'value';
  component.foundation_.styleFloat = td.func();
  component.float(value);
  td.verify(component.foundation_.styleFloat(value));
});

test('adapter#addClass adds a class to the root element', () => {
  const {component, fixture} = setupTest();

  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(fixture.classList.contains('foo'));
});


test('adapter#removeClass removes a class from the root element', () => {
  const {component, fixture} = setupTest();

  fixture.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(fixture.classList.contains('foo'));
});
