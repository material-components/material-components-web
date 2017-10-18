/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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
import domEvents from 'dom-events';
import td from 'testdouble';
import {assert} from 'chai';

import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {createMockRaf} from '../helpers/raf';
import {MDCIconToggle, MDCIconToggleFoundation} from '../../../packages/mdc-icon-toggle';
import {MDCRipple} from '../../../packages/mdc-ripple';
import {cssClasses} from '../../../packages/mdc-ripple/constants';

function setupTest({useInnerIconElement = false} = {}) {
  const root = document.createElement(useInnerIconElement ? 'span' : 'i');
  if (useInnerIconElement) {
    const icon = document.createElement('i');
    icon.id = 'icon';
    root.dataset.iconInnerSelector = `#${icon.id}`;
    root.appendChild(icon);
  }
  const component = new MDCIconToggle(root);
  return {root, component};
}

suite('MDCIconToggle');

test('attachTo initializes and returns a MDCIconToggle instance', () => {
  assert.isOk(MDCIconToggle.attachTo(document.createElement('i')) instanceof MDCIconToggle);
});

if (supportsCssVariables(window)) {
  test('#constructor initializes the ripple on the root element', () => {
    const raf = createMockRaf();
    const {root} = setupTest();
    raf.flush();
    assert.isOk(root.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });

  test('#destroy removes the ripple', () => {
    const raf = createMockRaf();
    const {root, component} = setupTest();
    raf.flush();
    component.destroy();
    raf.flush();
    assert.isNotOk(root.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });
}

test('set/get on', () => {
  const {root, component} = setupTest();
  component.on = true;
  assert.isOk(component.on);
  assert.equal(root.getAttribute('aria-pressed'), 'true');

  component.on = false;
  assert.isNotOk(component.on);
  assert.equal(root.getAttribute('aria-pressed'), 'false');
});

test('set/get disabled', () => {
  const {root, component} = setupTest();
  component.disabled = true;
  assert.isOk(component.disabled);
  assert.equal(root.getAttribute('aria-disabled'), 'true');
  assert.isOk(root.classList.contains(MDCIconToggleFoundation.cssClasses.DISABLED));

  component.disabled = false;
  assert.isNotOk(component.disabled);
  assert.isNotOk(root.hasAttribute('aria-disabled'));
  assert.isNotOk(root.classList.contains(MDCIconToggleFoundation.cssClasses.DISABLED));
});

test('#refreshToggleData proxies to foundation.refreshToggleData()', () => {
  const MockIconToggleFoundation = td.constructor(MDCIconToggleFoundation);
  const root = document.createElement('i');
  const foundation = new MockIconToggleFoundation();
  const component = new MDCIconToggle(root, foundation);
  component.refreshToggleData();
  td.verify(foundation.refreshToggleData());
});

test('intially set to on if root has aria-pressed=true', () => {
  const root = bel`<i class="mdc-icon-toggle" aria-pressed="true"></i>`;
  const component = new MDCIconToggle(root);
  assert.isOk(component.on);
});

test('intially set to disabled if root has aria-disabled=true', () => {
  const root = bel`<i class="mdc-icon-toggle" aria-disabled="true"></i>`;
  const component = new MDCIconToggle(root);
  assert.isOk(component.disabled);
});

test('get ripple returns a MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isOk(component.ripple instanceof MDCRipple);
});

test('#adapter.addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('#adapter.addClass adds a class to the inner icon element when used', () => {
  const {root, component} = setupTest({useInnerIconElement: true});
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.querySelector('#icon').classList.contains('foo'));
});

test('#adapter.removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('#adapter.removeClass adds a class to the inner icon element when used', () => {
  const {root, component} = setupTest({useInnerIconElement: true});
  root.querySelector('#icon').classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.querySelector('#icon').classList.contains('foo'));
});

test('#adapter.registerInteractionHandler adds an event listener for (type, handler)', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const handler = td.func('clickHandler');
  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(root, 'click');
  td.verify(handler(td.matchers.anything()));
  document.body.removeChild(root);
});

test('#adapter.deregisterInteractionHandler removes an event listener for (type, hander)', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const handler = td.func('clickHandler');

  root.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(root, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
  document.body.removeChild(root);
});

test('#adapter.setText sets the text content of the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setText('foo');
  assert.equal(root.textContent, 'foo');
});

test('#adapter.setText sets the text content of the inner icon element when used', () => {
  const {root, component} = setupTest({useInnerIconElement: true});
  component.getDefaultFoundation().adapter_.setText('foo');
  assert.equal(root.querySelector('#icon').textContent, 'foo');
});

test('#adapter.getTabIndex returns the tabIndex of the element', () => {
  const {root, component} = setupTest();
  root.tabIndex = 4;
  assert.equal(component.getDefaultFoundation().adapter_.getTabIndex(), 4);
});

test('#adapter.setTabIndex sets the tabIndex of the element', () => {
  const {root, component} = setupTest();
  root.tabIndex = 4;
  component.getDefaultFoundation().adapter_.setTabIndex(2);
  assert.equal(root.tabIndex, 2);
});

test('#adapter.getAttr retrieves an attribute from the root element', () => {
  const {root, component} = setupTest();
  root.setAttribute('aria-label', 'hello');
  assert.equal(component.getDefaultFoundation().adapter_.getAttr('aria-label'), 'hello');
});

test('#adapter.setAttr sets an attribute on the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('aria-label', 'hello');
  assert.equal(root.getAttribute('aria-label'), 'hello');
});

test('#adapter.rmAttr removes an attribute from the root element', () => {
  const {root, component} = setupTest();
  root.setAttribute('aria-label', 'hello');
  component.getDefaultFoundation().adapter_.rmAttr('aria-label');
  assert.isNotOk(root.hasAttribute('aria-label'));
});

test(`#adapter.notifyChange broadcasts a ${MDCIconToggleFoundation.strings.CHANGE_EVENT} custom event`, () => {
  const {root, component} = setupTest();
  const handler = td.func('custom event handler');
  root.addEventListener(MDCIconToggleFoundation.strings.CHANGE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyChange({});
  td.verify(handler(td.matchers.anything()));
});

test('assert keydown does not trigger ripple', () => {
  const {root} = setupTest();
  domEvents.emit(root, 'keydown');
  assert.isNotOk(root.classList.contains(cssClasses.FG_ACTIVATION));
});

test('assert keyup does not trigger ripple', () => {
  const {root} = setupTest();
  domEvents.emit(root, 'keyup');
  assert.isNotOk(root.classList.contains(cssClasses.FG_ACTIVATION));
});
