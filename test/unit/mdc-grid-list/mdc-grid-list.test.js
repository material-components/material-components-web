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

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';

import {MDCGridList} from '../../../packages/mdc-grid-list';

function getFixture() {
  return bel`
    <div class="mdc-grid-list">
      <ul class="mdc-grid-list__tiles">
        <li class="mdc-grid-tile">
          <div class="mdc-grid-tile__primary">
            <img class="mdc-grid-tile__primary-content" />
          </div>
          <span class="mdc-grid-tile__secondary">
            <span class="mdc-grid-tile__title">Title</span>
          </span>
        </li>
      </ul>
    </div>
  `;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCGridList(root);
  return {root, component};
}

test('attachTo initializes and returns an MDCGridList instance', () => {
  assert.isOk(MDCGridList.attachTo(getFixture()) instanceof MDCGridList);
});

test('adapter#registerResizeHandler uses the handler as a window resize listener', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');
  component.getDefaultFoundation().adapter_.registerResizeHandler(handler);
  domEvents.emit(window, 'resize');
  td.verify(handler(td.matchers.anything()));
  window.removeEventListener('resize', handler);
});

test('adapter#registerResizeHandler unlistens the handler for window resize', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');
  window.addEventListener('resize', handler);
  component.getDefaultFoundation().adapter_.deregisterResizeHandler(handler);
  domEvents.emit(window, 'resize');
  td.verify(handler(td.matchers.anything()), {times: 0});
  // Just to be safe
  window.removeEventListener('resize', handler);
});
