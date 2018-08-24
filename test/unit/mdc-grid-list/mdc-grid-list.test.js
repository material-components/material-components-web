/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
