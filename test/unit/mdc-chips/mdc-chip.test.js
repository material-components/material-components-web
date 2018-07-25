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
import td from 'testdouble';

import {MDCRipple} from '../../../packages/mdc-ripple';
import {MDCChip, MDCChipFoundation} from '../../../packages/mdc-chips/chip';

const getFixture = () => bel`
  <div class="mdc-chip">
    <div class="mdc-chip__text">Chip content</div>
  </div>
`;

const getLeadingIcon = () => bel`
  <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">face</i>
`;

suite('MDCChip');

test('attachTo returns an MDCChip instance', () => {
  assert.isTrue(MDCChip.attachTo(getFixture()) instanceof MDCChip);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCChip(root);
  return {root, component};
}

test('get ripple returns MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isTrue(component.ripple instanceof MDCRipple);
});

test('#adapter.hasClass returns true if class is set on chip set element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
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

test('#adapter.addClassToLeadingIcon adds a class to the leading icon element', () => {
  const root = getFixture();
  const leadingIcon = getLeadingIcon();
  root.appendChild(leadingIcon);
  const component = new MDCChip(root);

  component.getDefaultFoundation().adapter_.addClassToLeadingIcon('foo');
  assert.isTrue(leadingIcon.classList.contains('foo'));
});

test('#adapter.addClassToLeadingIcon does nothing if no leading icon element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.addClassToLeadingIcon('foo'));
});

test('#adapter.removeClassFromLeadingIcon removes a class from the leading icon element', () => {
  const root = getFixture();
  const leadingIcon = getLeadingIcon();
  root.appendChild(leadingIcon);
  const component = new MDCChip(root);

  leadingIcon.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromLeadingIcon('foo');
  assert.isFalse(leadingIcon.classList.contains('foo'));
});

test('#adapter.removeClassFromLeadingIcon does nothing if no leading icon element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.removeClassFromLeadingIcon('foo'));
});

test('adapter#eventTargetHasClass returns true if given element has class', () => {
  const {component} = setupTest();
  const mockEventTarget = bel`<div class="foo">bar</div>`;

  assert.isTrue(component.getDefaultFoundation().adapter_.eventTargetHasClass(mockEventTarget, 'foo'));
});

test('#adapter.notifyInteraction emits ' + MDCChipFoundation.strings.INTERACTION_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.INTERACTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyInteraction();

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.notifyTrailingIconInteraction emits ' +
  MDCChipFoundation.strings.TRAILING_ICON_INTERACTION_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.TRAILING_ICON_INTERACTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyTrailingIconInteraction();

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.notifyRemoval emits ' + MDCChipFoundation.strings.REMOVAL_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.REMOVAL_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyRemoval();

  td.verify(handler(td.matchers.anything()));
});

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCChipFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCChip(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('#isSelected proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.isSelected();
  td.verify(mockFoundation.isSelected());
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
