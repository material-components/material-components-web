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

import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {assert} from 'chai';

import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {createMockRaf} from '../helpers/raf';
import {MDCIconButtonToggle, MDCIconButtonToggleFoundation} from '../../../packages/mdc-icon-button';
import {MDCRipple} from '../../../packages/mdc-ripple';
import {cssClasses} from '../../../packages/mdc-ripple/constants';

function getFixture() {
  return bel`
    <button></button>
  `;
}

function setupTest({createMockFoundation = false} = {}) {
  const root = getFixture();

  let mockFoundation;
  if (createMockFoundation) {
    const MockFoundationCtor = td.constructor(MDCIconButtonToggleFoundation);
    mockFoundation = new MockFoundationCtor();
  }
  const component = new MDCIconButtonToggle(root, mockFoundation);
  return {root, component, mockFoundation};
}

suite('MDCIconButtonToggle');

test('attachTo initializes and returns a MDCIconButtonToggle instance', () => {
  assert.isTrue(MDCIconButtonToggle.attachTo(document.createElement('i')) instanceof MDCIconButtonToggle);
});

if (supportsCssVariables(window)) {
  test('#constructor initializes the ripple on the root element', () => {
    const raf = createMockRaf();
    const {root} = setupTest();
    raf.flush();
    assert.isTrue(root.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });

  test('#destroy removes the ripple', () => {
    const raf = createMockRaf();
    const {root, component} = setupTest();
    raf.flush();
    component.destroy();
    raf.flush();
    assert.isFalse(root.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });
}

test('set/get on', () => {
  const {root, component} = setupTest();
  component.on = true;
  assert.isTrue(component.on);
  assert.equal(root.getAttribute('aria-pressed'), 'true');

  component.on = false;
  assert.isFalse(component.on);
  assert.equal(root.getAttribute('aria-pressed'), 'false');
});

test('get ripple returns a MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isTrue(component.ripple instanceof MDCRipple);
});

test('#adapter.addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('#adapter.removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('#adapter.setAttr sets an attribute on the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('aria-label', 'hello');
  assert.equal(root.getAttribute('aria-label'), 'hello');
});

test(`#adapter.notifyChange broadcasts a ${MDCIconButtonToggleFoundation.strings.CHANGE_EVENT} custom event`, () => {
  const {root, component} = setupTest();
  const handler = td.func('custom event handler');
  root.addEventListener(MDCIconButtonToggleFoundation.strings.CHANGE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyChange({});
  td.verify(handler(td.matchers.anything()));
});

test('assert keydown does not trigger ripple', () => {
  const {root} = setupTest();
  domEvents.emit(root, 'keydown');
  assert.isFalse(root.classList.contains(cssClasses.FG_ACTIVATION));
});

test('assert keyup does not trigger ripple', () => {
  const {root} = setupTest();
  domEvents.emit(root, 'keyup');
  assert.isFalse(root.classList.contains(cssClasses.FG_ACTIVATION));
});

test('click handler is added to root element', () => {
  const {root, mockFoundation} = setupTest({createMockFoundation: true});
  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.anything()), {times: 1});
});

test('click handler is removed from the root element on destroy', () => {
  const {root, component, mockFoundation} = setupTest({createMockFoundation: true});
  component.destroy();
  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.anything()), {times: 0});
});
