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
import {createMockRaf} from '../helpers/raf';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {MDCTab} from '../../../packages/mdc-tabs/tab';
import {MDCTabFoundation} from '../../../packages/mdc-tabs/tab';
import {cssClasses, strings} from '../../../packages/mdc-tabs/tab/constants';

function getFixture() {
  return bel`
    <div>
      <a class="mdc-tab" href="#one">Item One</a>
    </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const root = fixture.querySelector('.mdc-tab');
  const component = new MDCTab(root);
  return {fixture, root, component};
}

suite('MDCTab');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCTab.attachTo(getFixture()) instanceof MDCTab);
});

test('#constructor initializes the root element with a ripple in browsers that support it', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }
  const raf = createMockRaf();
  const {root} = setupTest();
  raf.flush();
  assert.isOk(root.classList.contains('mdc-ripple-upgraded'));
  raf.restore();
});

test('#destroy cleans up tab\'s ripple in browsers that support it', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }
  const raf = createMockRaf();
  const {root, component} = setupTest();
  raf.flush();
  component.destroy();
  raf.flush();
  assert.isNotOk(root.classList.contains('mdc-ripple-upgraded'));
});

test('#get computedWidth returns computed width of tab', () => {
  const {root, component} = setupTest();

  assert.equal(component.computedWidth, root.offsetWidth);
});

test('#get computedLeft returns computed left offset of tab', () => {
  const {root, component} = setupTest();

  assert.equal(component.computedLeft, root.offsetLeft);
});

test('#get/set isActive', () => {
  const {component, root} = setupTest();

  component.isActive = false;
  assert.isFalse(root.classList.contains(cssClasses.ACTIVE));

  component.isActive = true;
  assert.isTrue(root.classList.contains(cssClasses.ACTIVE));
});

test('#get/set preventDefaultOnClick', () => {
  const {component} = setupTest();

  component.preventDefaultOnClick = false;
  assert.isFalse(component.preventDefaultOnClick);

  component.preventDefaultOnClick = true;
  assert.isTrue(component.preventDefaultOnClick);
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();

  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();

  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('adapter#registerInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const type = 'click';
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerInteractionHandler(type, handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const type = 'click';
  const handler = td.func('eventHandler');

  root.addEventListener(type, handler);

  component.getDefaultFoundation().adapter_.deregisterInteractionHandler(type, handler);
  domEvents.emit(root, type);

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#getOffsetWidth returns the width of the tab', () => {
  const {root, component} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getOffsetWidth(), root.offsetWidth);
});

test('adapter#getOffsetLeft returns left offset for the tab', () => {
  const {root, component} = setupTest();

  assert.equal(component.getDefaultFoundation().adapter_.getOffsetLeft(), root.offsetLeft);
});

test(`adapter#notifySelected emits ${strings.SELECTED_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('acceptHandler');

  component.listen(strings.SELECTED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifySelected();

  td.verify(handler(td.matchers.anything()));
});

test('#measureSelf proxies to the foundation\'s measureSelf', () => {
  const MockTabFoundation = td.constructor(MDCTabFoundation);
  const root = document.createElement('a');
  const foundation = new MockTabFoundation();
  const component = new MDCTab(root, foundation);

  component.measureSelf();
  td.verify(foundation.measureSelf());
});
