/**
 * @license
 * Copyright 2018 Google Inc.
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
import td from 'testdouble';
import bel from 'bel';
import {MDCListItem, MDCListItemFoundation} from '../../../packages/mdc-list/list-item';

function getFixture() {
  return bel`
  <li class="mdc-list-item">
    Pizza
  </li>
  `;
}

function getFixtureWithFocusableChildren() {
  return bel`
  <li class="mdc-list-item">
    Fruit
    <button>one</button>
  </li>
  `;
}

function setupTest(root = getFixture()) {
  const MockFoundationCtor = td.constructor(MDCListItemFoundation);
  const mockFoundation = new MockFoundationCtor();
  const component = new MDCListItem(root, mockFoundation);
  return {root, component, mockFoundation};
}

suite('MDCListItem');

test('attachTo initializes and returns a MDCListItem instance', () => {
  assert.isTrue(MDCListItem.attachTo(getFixture()) instanceof MDCListItem);
});

test('#adapter.setTabIndexForChildren sets the child button/a elements of index', () => {
  const {root, component} = setupTest(getFixtureWithFocusableChildren());
  document.body.appendChild(root);
  component.getDefaultFoundation().adapter_.setTabIndexForChildren(0);

  assert.equal(1, root.querySelectorAll('button[tabindex="0"]').length);
  assert.equal(root, root.querySelectorAll('button[tabindex="0"]')[0].parentElement);
  document.body.removeChild(root);
});

test('adapter#hasClass returns true if class is set on list item element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('layout adds tabindex=-1 if there is no tabindex', () => {
  const {root} = setupTest();
  assert.equal(0, root.querySelectorAll('.mdc-list-item:not([tabindex])').length);
});

test('layout adds tabindex=-1 to all button/a elements', () => {
  const {root} = setupTest(getFixtureWithFocusableChildren());
  assert.equal(0, root.querySelectorAll('button:not([tabindex])').length);
});
