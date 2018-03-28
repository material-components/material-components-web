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

import bel from 'bel';
import {assert} from 'chai';
import td from 'testdouble';
import domEvents from 'dom-events';

import {createMockRaf} from '../helpers/raf';
import {
  MDCTabIndicator,
  MDCTabIndicatorBarFoundation,
  MDCTabIndicatorIconFoundation,
} from '../../../packages/mdc-tab-indicator';

const getBarFixture = () => bel`
  <span class="mdc-tab-indicator mdc-tab-indicator--bar"></span>
`;

const getIconFixture = () => bel`
  <span class="mdc-tab-indicator mdc-tab-indicator--icon"></span>
`;

suite('MDCTabIndicator');

test('attachTo a bar returns an MDCTabIndicator instance', () => {
  assert.isTrue(MDCTabIndicator.attachTo(getBarFixture()) instanceof MDCTabIndicator);
});

test('attachTo an icon returns an MDCTabIndicator instance', () => {
  assert.isTrue(MDCTabIndicator.attachTo(getIconFixture()) instanceof MDCTabIndicator);
});

function setupTest() {
  const root = getBarFixture();
  const component = new MDCTabIndicator(root);
  return {root, component};
}

test('#adapter.addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('#adapter.removeClass removes a class to the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});
