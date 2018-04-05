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
import td from 'testdouble';

import {MDCSelectBottomLine, MDCSelectBottomLineFoundation} from '../../../packages/mdc-select/bottom-line';

const getFixture = () => bel`
  <div class="mdc-select__bottom-line"></div>
`;

suite('MDCSelectBottomLine');

test('attachTo returns an MDCSelectBottomLine instance', () => {
  assert.isTrue(MDCSelectBottomLine.attachTo(getFixture()) instanceof MDCSelectBottomLine);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCSelectBottomLine(root);
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

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCSelectBottomLineFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCSelectBottomLine(
    root,
    mockFoundation);
  return {root, component, mockFoundation};
}

test('#activate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.activate();
  td.verify(mockFoundation.activate(), {times: 1});
});

test('#deactivate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.deactivate();
  td.verify(mockFoundation.deactivate(), {times: 1});
});
