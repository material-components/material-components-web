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
import {MDCRipple} from '../../../packages/mdc-tab/node_modules/@material/ripple';

const getFixture = () => bel`
  <button class="mdc-tab" aria-selected="false" role="tab">
    <div class="mdc-tab__content">
      <span class="mdc-tab__text-label">Foo</span>
    </div>
    <span class="mdc-tab__ripple"></span>
    <span class="mdc-tab-indicator"></span>
  </button>
`;

suite('MDCTab');

test('attachTo returns an MDCTab instance', () => {
  assert.isTrue(MDCTab.attachTo(getFixture()) instanceof MDCTab);
});

test('#constructor instantiates a ipple on the `.mdc-tab__ripple` element', () => {
  const root = getFixture();
  const component = new MDCTab(root);
  assert.instanceOf(component.ripple_, MDCRipple);
});

class FakeRipple {
  constructor(root) {
    this.root = root;
    this.layout = td.func('.layout');
    this.destroy = td.func('.destroy');
  }
}

class FakeTabIndicator {
  constructor() {
    this.activate = td.func('indicator.activate');
    this.deactivate = td.func('indicator.deactivate');
    this.getClientRect = td.func('indicator.getClientRect');
  }
}

function setupTest() {
  const root = getFixture();
  const indicator = new FakeTabIndicator();
  const component = new MDCTab(
    root,
    undefined,
    (el) => new FakeRipple(el),
    () => indicator
  );
  return {root, component, indicator};
}

test('#destroy removes the ripple', () => {
  const raf = createMockRaf();
  raf.flush();
  const {component, root} = setupTest();
  raf.flush();
  component.destroy();
  raf.flush();
  raf.restore();
  assert.isNotOk(
    root.querySelector(MDCTabFoundation.strings.RIPPLE_SELECTOR).classList.contains('mdc-ripple-upgraded'));
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

test('#adapter.registerEventHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  component.getDefaultFoundation().adapter_.registerEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterEventHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionend handler');
  root.addEventListener('transitionend', handler);
  component.getDefaultFoundation().adapter_.deregisterEventHandler('transitionend', handler);
  domEvents.emit(root, 'transitionend');
  td.verify(handler(td.matchers.anything()), {times: 0});
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

test('#activate calls activate with passed args', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.activate({width: 100, left: 0});
  td.verify(mockFoundation.activate({width: 100, left: 0}), {times: 1});
});

test('#deactivate calls deactivate', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.deactivate();
  td.verify(mockFoundation.deactivate(), {times: 1});
});

test('activating the ripples causes changes on the ripple surface', () => {
  const {component} = setupMockFoundationTest();
  const raf = createMockRaf();
  raf.flush();
  component.ripple_.activate();
  raf.flush();
  raf.restore();
  assert.isAtLeast(component.rippleSurface_.classList.length, 2);
});

test('#indicatorClientRect getter calls getIndicatorClientRect', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.indicatorClientRect;
  td.verify(mockFoundation.getIndicatorClientRect(), {times: 1});
});
