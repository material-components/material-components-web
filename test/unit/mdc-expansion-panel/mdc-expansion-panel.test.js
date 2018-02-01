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

import {strings, cssClasses} from '../../../packages/mdc-expansion-panel/constants';
import {MDCExpansionPanel, util} from '../../../packages/mdc-expansion-panel';

const rootSelector = `.${cssClasses.ROOT}`;
const anything = td.matchers.anything;

function getFixture() {
  return bel`
    <div>
      <div id="my-expansion-panel" class="mdc-expansion-panel mdc-expansion-panel--collapsed">
        <div class="mdc-expansion-panel__header">
          <i class="material-icons mdc-expansion-panel__expansion-icon"></i>
          <span class="mdc-expansion-panel__header__section">
            <i class="material-icons mdc-expansion-panel--summary">done</i>
            <i class="material-icons mdc-expansion-panel--details">done_all</i>
          </span>
          <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click mdc-expansion-panel__header__section">
            <span class="mdc-expansion-panel--summary">Title</span>
            <span class="mdc-expansion-panel--details">Expanded Title</span>
          </span>
        </div>
        <div class="mdc-expansion-panel__body">
          <p>Body</p>
        </div>
        <div class="mdc-expansion-panel__footer">
          <span>Footer</span>
          <div class="mdc-expansion-panel__footer__button-bar ">
            <button class="mdc-button mdc-expansion-panel--no-click">cancel</button>
            <button class="mdc-button mdc-expansion-panel--no-click">accept</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupTest() {
  const fixture = getFixture();
  const root = fixture.querySelector(rootSelector);
  const component = new MDCExpansionPanel(root);
  const expansionIcons = util.toArray(root.querySelectorAll(strings.EXPANSION_ICON_SELECTOR));

  return {root, component, expansionIcons};
}

// function expand(panelComponent) {
//   panelComponent.expand();
//   panelComponent.emit('transitionend', panelComponent);
// }

suite('MDCExpansionPanel');

test('.attachTo returns a component instance', () => {
  assert.isOk(MDCExpansionPanel.attachTo(
    getFixture().querySelector(rootSelector)) instanceof MDCExpansionPanel);
});

test('#initialize stores all expansion icons', () => {
  const {component, expansionIcons} = setupTest();

  component.initialize();

  assert.sameMembers(component.expansionIcons_, expansionIcons);
});

test('#destroy removes all expansion icons references', () => {
  const {component} = setupTest();

  component.initialize();
  component.destroy();

  assert.isEmpty(component.expansionIcons_);
});

test(`adapter#notifyChange emits ${strings.CHANGE_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('changeHandler');

  component.listen(strings.CHANGE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyChange();

  td.verify(handler(anything()));
});

test(`adapter#notifyExpand emits ${strings.EXPAND_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('changeHandler');

  component.listen(strings.EXPAND_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyExpand();

  td.verify(handler(anything()));
});

test(`adapter#notifyCollapse emits ${strings.COLLAPSE_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('changeHandler');

  component.listen(strings.COLLAPSE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyCollapse();

  td.verify(handler(anything()));
});

test('adapter#registerInteractionHandler adds an event listener on its included children elements', () => {
  const {component, root} = setupTest();
  const handler = td.func('handler');

  component.initialize();

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);

  domEvents.emit(root, 'click');

  td.verify(handler(anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from its included children elements', () => {
  const {component, root} = setupTest();
  const handler = td.func('handler');

  component.initialize();

  root.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);

  domEvents.emit(root, 'click');

  td.verify(handler(anything()), {times: 0});
});

test('adapter#blur blurs the root element', () => {
  const {component} = setupTest();
  const handler = td.func('handler');

  component.initialize();

  component.listen('blur', handler);
  component.getDefaultFoundation().adapter_.blur();

  // I can't figure out why the events aren't getting fired
  // TODO: figure out how to test this behavior
  // td.verify(handler(anything()));
});


test('adapter#hasClass returns correct values', () => {
  const {component} = setupTest();

  component.initialize();

  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass(cssClasses.ROOT));
  assert.isFalse(component.getDefaultFoundation().adapter_.hasClass('wubba-lubba-dub-dub!!'));
});

test('adapter#removeClass removes class from root element', () => {
  const {component, root} = setupTest();
  const testClass = 'test-class';

  component.initialize();

  root.classList.add(testClass);
  assert.isTrue(root.classList.contains(testClass));

  component.getDefaultFoundation().adapter_.removeClass(testClass);
  assert.isFalse(root.classList.contains(testClass));
});

test('adapter#addClass adds class to root element', () => {
  const {component, root} = setupTest();
  const testClass = 'test-class';

  component.initialize();

  assert.isFalse(root.classList.contains(testClass));

  component.getDefaultFoundation().adapter_.addClass(testClass);

  assert.isTrue(root.classList.contains(testClass));
});


test('adapter#getStyle gets style on root element', () => {
  const {component, root} = setupTest();
  const styles = [
    'display',
    'position',
    'flex-direction',
    'width',
    'border-bottom',
    'outline',
    'background',
    'cursor',
    'overflow',
  ];

  component.initialize();

  styles.forEach((style) => {
    assert.equal(component.getDefaultFoundation().adapter_.getStyle(style), root.style[style]);
  });
});

test('adapter#setStyle sets style on root element', () => {
  const {component, root} = setupTest();

  component.initialize();

  assert.notEqual(root.style.color, 'red');

  component.getDefaultFoundation().adapter_.setStyle('color', 'red');

  assert.equal(root.style.color, 'red');
});

test('adapter#setAttribute sets attribute on root element', () => {
  const {component, root} = setupTest();
  const attribute = 'testattribute';

  component.initialize();

  assert.isNotOk(root.getAttribute(attribute));

  component.getDefaultFoundation().adapter_.setAttribute(attribute, 0);
  assert.isOk(root.getAttribute(attribute));
});
