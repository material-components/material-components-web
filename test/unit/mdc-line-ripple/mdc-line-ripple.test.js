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

import bel from 'bel';
import {assert} from 'chai';
import td from 'testdouble';
import domEvents from 'dom-events';

import {MDCLineRipple, MDCLineRippleFoundation} from '../../../packages/mdc-line-ripple';

const getFixture = () => bel`
  <div class="mdc-line-ripple"></div>
`;

suite('MDCLineRipple');

test('attachTo returns an MDCLineRipple instance', () => {
  assert.isOk(MDCLineRipple.attachTo(getFixture()) instanceof MDCLineRipple);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCLineRipple(root);
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
test('#adapter.hasClass returns true if a class is on the element', () => {
  const {root, component} = setupTest();

  root.classList.add('foo');
  const hasClass = component.getDefaultFoundation().adapter_.hasClass('foo');
  assert.isTrue(hasClass);
});

test('#adapter.setStyle adds a given style property to the element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setStyle('color', 'blue');
  assert.equal(root.getAttribute('style'), 'color: blue;');
});

test('#adapter.registerEventHandler adds event listener for a given event to the element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  component.getDefaultFoundation().adapter_.registerEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterEventHandler removes event listener for a given event from the element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');

  root.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCLineRippleFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCLineRipple(
    root,
    mockFoundation);
  return {root, component, mockFoundation};
}

test('activate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.activate();
  td.verify(mockFoundation.activate(), {times: 1});
});

test('deactivate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.deactivate();
  td.verify(mockFoundation.deactivate(), {times: 1});
});

test('setRippleCenter', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.setRippleCenter(100);
  td.verify(mockFoundation.setRippleCenter(100), {times: 1});
});
