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

import {MDCTextFieldLabel} from '../../../packages/mdc-textfield/label';

const getFixture = () => bel`
  <div class="mdc-text-field__label"></div>
`;

suite('MDCTextFieldLabel');

test('attachTo returns an MDCTextFieldLabel instance', () => {
  assert.isOk(MDCTextFieldLabel.attachTo(getFixture()) instanceof MDCTextFieldLabel);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTextFieldLabel(root);
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

test('#adapter.getWidth returns the width of the label element', () => {
  const {root, component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getWidth(), root.offsetWidth);
});
