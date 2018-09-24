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
import {assert} from 'chai';
import td from 'testdouble';
import domEvents from 'dom-events';

import {createMockRaf} from '../helpers/raf';
import {MDCTab, MDCTabFoundation} from '../../../packages/mdc-tab';

const getFixture = () => bel`
  <button class="mdc-tab" aria-selected="false" role="tab">
    <span class="mdc-tab__content">
      <span class="mdc-tab__text-label">Foo</span>
      <span class="mdc-tab__icon"></span>
    </span>
    <span class="mdc-tab__ripple"></span>
    <span class="mdc-tab-indicator">
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
    </span>
  </button>
`;

suite('MDCTab');

test('attachTo returns an MDCTab instance', () => {
  assert.isTrue(MDCTab.attachTo(getFixture()) instanceof MDCTab);
});

function setupTest({createMockFoundation = false} = {}) {
  const root = getFixture();
  const content = root.querySelector(MDCTabFoundation.strings.CONTENT_SELECTOR);
  const mockFoundation = createMockFoundation ? new (td.constructor(MDCTabFoundation))() : undefined;
  const component = new MDCTab(root, mockFoundation);
  return {root, content, component, mockFoundation};
}

test('click handler is added during initialSyncWithDOM', () => {
  const {component, root, mockFoundation} = setupTest({createMockFoundation: true});

  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.anything()), {times: 1});

  component.destroy();
});

test('click handler is removed during destroy', () => {
  const {component, root, mockFoundation} = setupTest({createMockFoundation: true});

  component.destroy();
  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.anything()), {times: 0});
});

test('#destroy removes the ripple', () => {
  const raf = createMockRaf();
  const {component, root} = setupTest();
  raf.flush();
  component.destroy();
  raf.flush();
  assert.isNotOk(root.classList.contains('mdc-ripple-upgraded'));
  raf.restore();
});

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

test('#adapter.hasClass returns true if a class exists on the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.hasClass('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('#adapter.setAttr adds a given attribute to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('foo', 'bar');
  assert.equal(root.getAttribute('foo'), 'bar');
});

test('#adapter.activateIndicator activates the indicator subcomponent', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.activateIndicator();
  assert.ok(root.querySelector('.mdc-tab-indicator').classList.contains('mdc-tab-indicator--active'));
});

test('#adapter.deactivateIndicator deactivates the indicator subcomponent', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.deactivateIndicator();
  assert.notOk(root.querySelector('.mdc-tab-indicator').classList.contains('mdc-tab-indicator--active'));
});

test('#adapter.getOffsetWidth() returns the offsetWidth of the root element', () => {
  const {root, component} = setupTest();
  assert.strictEqual(component.getDefaultFoundation().adapter_.getOffsetWidth(), root.offsetWidth);
});

test('#adapter.getOffsetLeft() returns the offsetLeft of the root element', () => {
  const {root, component} = setupTest();
  assert.strictEqual(component.getDefaultFoundation().adapter_.getOffsetLeft(), root.offsetLeft);
});

test('#adapter.getContentOffsetWidth() returns the offsetLeft of the content element', () => {
  const {content, component} = setupTest();
  assert.strictEqual(component.getDefaultFoundation().adapter_.getContentOffsetWidth(), content.offsetWidth);
});

test('#adapter.getContentOffsetLeft() returns the offsetLeft of the content element', () => {
  const {content, component} = setupTest();
  assert.strictEqual(component.getDefaultFoundation().adapter_.getContentOffsetLeft(), content.offsetLeft);
});

test('#adapter.focus() gives focus to the root element', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  component.getDefaultFoundation().adapter_.focus();
  assert.strictEqual(document.activeElement, root);
  document.body.removeChild(root);
});

test(`#adapter.notifyInteracted() emits the ${MDCTabFoundation.strings.INTERACTED_EVENT} event`, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(MDCTabFoundation.strings.INTERACTED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyInteracted();
  td.verify(handler(td.matchers.anything()));
});

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCTabFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCTab(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('#active getter calls isActive', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.active;
  td.verify(mockFoundation.isActive(), {times: 1});
});

test('#activate() calls activate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.activate();
  td.verify(mockFoundation.activate(undefined), {times: 1});
});

test('#activate({ClientRect}) calls activate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.activate({width: 100, left: 200});
  td.verify(mockFoundation.activate({width: 100, left: 200}), {times: 1});
});

test('#deactivate() calls deactivate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.deactivate();
  td.verify(mockFoundation.deactivate(), {times: 1});
});

test('#computeIndicatorClientRect() returns the indicator element\'s bounding client rect', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.deactivateIndicator();
  assert.deepEqual(
    component.computeIndicatorClientRect(),
    root.querySelector('.mdc-tab-indicator').getBoundingClientRect()
  );
});

test('#computeDimensions() calls computeDimensions', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.computeDimensions();
  td.verify(mockFoundation.computeDimensions(), {times: 1});
});
