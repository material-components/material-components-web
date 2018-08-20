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

import bel from 'bel';
import {assert} from 'chai';
import domEvents from 'dom-events';
import td from 'testdouble';

import {MDCRipple} from '../../../packages/mdc-ripple';
import {MDCChip, MDCChipFoundation} from '../../../packages/mdc-chips/chip';

const getFixture = () => bel`
  <div class="mdc-chip">
    <div class="mdc-chip__text">Chip content</div>
  </div>
`;

const getFixtureWithCheckmark = () => bel`
  <div class="mdc-chip">
    <div class="mdc-chip__checkmark" >
      <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
        <path class="mdc-chip__checkmark-path" fill="none" stroke="black"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
    </div>
    <div class="mdc-chip__text">Chip content</div>
  </div>
`;

const addLeadingIcon = (root) => {
  const icon = bel`<i class="material-icons mdc-chip__icon mdc-chip__icon--leading">face</i>`;
  root.insertBefore(icon, root.firstChild);
  return icon;
};

const addTrailingIcon = (root) => {
  const icon = bel`<i class="material-icons mdc-chip__icon mdc-chip__icon--trailing">cancel</i>`;
  root.appendChild(icon);
  return icon;
};

class FakeRipple {
  constructor(root) {
    this.root = root;
    this.destroy = td.func('.destroy');
  }
}

function setupTest() {
  const root = getFixture();
  const component = new MDCChip(root);
  return {root, component};
}

function setupMockRippleTest() {
  const root = getFixture();
  const component = new MDCChip(root, undefined, () => new FakeRipple());
  return {root, component};
}

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCChipFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCChip(root, mockFoundation);
  return {root, component, mockFoundation};
}

suite('MDCChip');

test('attachTo returns an MDCChip instance', () => {
  assert.isTrue(MDCChip.attachTo(getFixture()) instanceof MDCChip);
});

test('#initialSyncWithDOM sets up event handlers', () => {
  const {root, mockFoundation} = setupMockFoundationTest();

  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleInteraction(td.matchers.anything()), {times: 1});

  domEvents.emit(root, 'transitionend');
  td.verify(mockFoundation.handleTransitionEnd(td.matchers.anything()), {times: 1});
});

test('#initialSyncWithDOM sets up interaction event handler on trailing icon if present', () => {
  const root = getFixture();
  const icon = addTrailingIcon(root);
  const {mockFoundation} = setupMockFoundationTest(root);

  domEvents.emit(icon, 'click');
  td.verify(mockFoundation.handleTrailingIconInteraction(td.matchers.anything()), {times: 1});
});

test('#destroy removes event handlers', () => {
  const {root, component, mockFoundation} = setupMockFoundationTest();
  component.destroy();

  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleInteraction(td.matchers.anything()), {times: 0});

  domEvents.emit(root, 'transitionend');
  td.verify(mockFoundation.handleTransitionEnd(td.matchers.anything()), {times: 0});
});

test('#destroy removes interaction event handler on trailing icon if present', () => {
  const root = getFixture();
  const icon = addTrailingIcon(root);
  const {component, mockFoundation} = setupMockFoundationTest(root);

  component.destroy();
  domEvents.emit(icon, 'click');
  td.verify(mockFoundation.handleTrailingIconInteraction(td.matchers.anything()), {times: 0});
});

test('#destroy destroys ripple', () => {
  const {component} = setupMockRippleTest();
  component.destroy();
  td.verify(component.ripple.destroy());
});

test('get ripple returns MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isTrue(component.ripple instanceof MDCRipple);
});

test('sets id on chip if attribute exists', () => {
  const root = bel`
    <div class="mdc-chip" id="hello-chip">
      <div class="mdc-chip__text">Hello</div>
    </div>
  `;
  const component = new MDCChip(root);
  assert.equal(component.id, 'hello-chip');
});

test('adapter#hasClass returns true if class is set on chip set element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
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

test('adapter#addClassToLeadingIcon adds a class to the leading icon element', () => {
  const root = getFixtureWithCheckmark();
  const leadingIcon = addLeadingIcon(root);
  const component = new MDCChip(root);

  component.getDefaultFoundation().adapter_.addClassToLeadingIcon('foo');
  assert.isTrue(leadingIcon.classList.contains('foo'));
});

test('adapter#addClassToLeadingIcon does nothing if no leading icon element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.addClassToLeadingIcon('foo'));
});

test('adapter#removeClassFromLeadingIcon removes a class from the leading icon element', () => {
  const root = getFixtureWithCheckmark();
  const leadingIcon = addLeadingIcon(root);
  const component = new MDCChip(root);

  leadingIcon.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromLeadingIcon('foo');
  assert.isFalse(leadingIcon.classList.contains('foo'));
});

test('adapter#removeClassFromLeadingIcon does nothing if no leading icon element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.removeClassFromLeadingIcon('foo'));
});

test('adapter#eventTargetHasClass returns true if given element has class', () => {
  const {component} = setupTest();
  const mockEventTarget = bel`<div class="foo">bar</div>`;

  assert.isTrue(component.getDefaultFoundation().adapter_.eventTargetHasClass(mockEventTarget, 'foo'));
});

test('adapter#notifyInteraction emits ' + MDCChipFoundation.strings.INTERACTION_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.INTERACTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyInteraction();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#notifyTrailingIconInteraction emits ' +
  MDCChipFoundation.strings.TRAILING_ICON_INTERACTION_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.TRAILING_ICON_INTERACTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyTrailingIconInteraction();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#notifyRemoval emits ' + MDCChipFoundation.strings.REMOVAL_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.REMOVAL_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyRemoval();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#getComputedStyleValue returns property value from root element styles', () => {
  const {root, component} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getComputedStyleValue('color'),
    window.getComputedStyle(root).getPropertyValue('color'));
});

test('adapter#setStyleProperty sets a style property on the root element', () => {
  const {root, component} = setupTest();
  const color = 'blue';
  component.getDefaultFoundation().adapter_.setStyleProperty('color', color);
  assert.equal(root.style.getPropertyValue('color'), color);
});

test('#get selected proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  assert.equal(component.selected, mockFoundation.isSelected());
});

test('#set selected proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.selected = true;
  td.verify(mockFoundation.setSelected(true));
});

test('#get shouldRemoveOnTrailingIconClick proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  assert.equal(component.shouldRemoveOnTrailingIconClick, mockFoundation.getShouldRemoveOnTrailingIconClick());
});

test('#set shouldRemoveOnTrailingIconClick proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.shouldRemoveOnTrailingIconClick = false;
  td.verify(mockFoundation.setShouldRemoveOnTrailingIconClick(false));
});

test('#beginExit proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.beginExit();
  td.verify(mockFoundation.beginExit());
});
