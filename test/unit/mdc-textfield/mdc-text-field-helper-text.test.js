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

import {MDCTextFieldHelperText} from '../../../packages/mdc-textfield/helper-text';

const getFixture = () => bel`
  <div class="mdc-textfield__helper-text"></div>
`;

suite('MDCTextFieldHelperText');

test('attachTo returns an MDCTextFieldHelperText instance', () => {
  assert.isOk(MDCTextFieldHelperText.attachTo(getFixture()) instanceof MDCTextFieldHelperText);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTextFieldHelperText(root);
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
