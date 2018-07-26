/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import domEvents from 'dom-events';

import {createMockRaf} from '../helpers/raf';
import {MDCTab, MDCTabFoundation} from '../../../packages/mdc-tab';

const getFixture = () => bel`
  <button class="mdc-tab" aria-selected="false" role="tab">
    <div class="mdc-tab__content">
      <span class="mdc-tab__text-label">Foo</span>
      <span class="mdc-tab__icon"></span>
    </div>
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

function setupTest() {
  const root = getFixture();
  const content = root.querySelector(MDCTabFoundation.strings.CONTENT_SELECTOR);
  const component = new MDCTab(root);
  return {root, content, component};
}

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

test('#adapter.registerEventHandler adds an event listener to the root element for a given event', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  component.getDefaultFoundation().adapter_.registerEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterEventHandler removes an event listener from the root element for a given event', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  root.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()), {times: 0});
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

test('#adapter.computeIndicatorClientRect returns the indicator element\'s bounding client rect', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.deactivateIndicator();
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.computeIndicatorClientRect(),
    root.querySelector('.mdc-tab-indicator').getBoundingClientRect()
  );
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

test('#computeIndicatorClientRect() calls computeIndicatorClientRect', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.computeIndicatorClientRect();
  td.verify(mockFoundation.computeIndicatorClientRect(), {times: 1});
});

test('#computeDimensions() calls computeDimensions', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.computeDimensions();
  td.verify(mockFoundation.computeDimensions(), {times: 1});
});
