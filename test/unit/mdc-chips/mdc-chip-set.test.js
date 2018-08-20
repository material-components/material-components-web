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

import {MDCChipSet, MDCChipSetFoundation} from '../../../packages/mdc-chips/chip-set';
import {MDCChipFoundation} from '../../../packages/mdc-chips/chip';

const getFixture = () => bel`
  <div class="mdc-chip-set">
    <div class="mdc-chip" id="chip1">
      <div class="mdc-chip__text">Chip content</div>
    </div>
    <div class="mdc-chip" id="chip2">
      <div class="mdc-chip__text">Chip content</div>
    </div>
    <div class="mdc-chip" id="chip3">
      <div class="mdc-chip__text">Chip content</div>
    </div>
  </div>
`;

suite('MDCChipSet');

test('attachTo returns an MDCChipSet instance', () => {
  assert.isOk(MDCChipSet.attachTo(getFixture()) instanceof MDCChipSet);
});

class FakeChip {
  constructor(el) {
    this.id = el.id;
    this.destroy = td.func('.destroy');
    this.selected = false;
  }
}

function setupTest() {
  const root = getFixture();
  const component = new MDCChipSet(root, undefined, (el) => new FakeChip(el));
  return {root, component};
}

function setupMockFoundationTest() {
  const root = getFixture();
  const MockFoundationConstructor = td.constructor(MDCChipSetFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCChipSet(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('#constructor instantiates child chip components', () => {
  const {component} = setupTest();
  assert.equal(component.chips.length, 3);
  assert.instanceOf(component.chips[0], FakeChip);
  assert.instanceOf(component.chips[1], FakeChip);
  assert.instanceOf(component.chips[2], FakeChip);
});

test('#destroy cleans up child chip components', () => {
  const {component} = setupTest();
  component.destroy();
  td.verify(component.chips[0].destroy());
  td.verify(component.chips[1].destroy());
  td.verify(component.chips[2].destroy());
});

test('#initialSyncWithDOM sets up event handlers', () => {
  const {root, mockFoundation} = setupMockFoundationTest();

  domEvents.emit(root, MDCChipFoundation.strings.INTERACTION_EVENT);
  td.verify(mockFoundation.handleChipInteraction(td.matchers.anything()), {times: 1});

  domEvents.emit(root, MDCChipFoundation.strings.REMOVAL_EVENT);
  td.verify(mockFoundation.handleChipRemoval(td.matchers.anything()), {times: 1});
});

test('#destroy removes event handlers', () => {
  const {root, component, mockFoundation} = setupMockFoundationTest();
  component.destroy();

  domEvents.emit(root, MDCChipFoundation.strings.INTERACTION_EVENT);
  td.verify(mockFoundation.handleChipInteraction(td.matchers.anything()), {times: 0});

  domEvents.emit(root, MDCChipFoundation.strings.REMOVAL_EVENT);
  td.verify(mockFoundation.handleChipRemoval(td.matchers.anything()), {times: 0});
});

test('get selectedChipIds proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.selectedChipIds;
  td.verify(mockFoundation.getSelectedChipIds());
});

test('#addChip adds a new chip to the chip set', () => {
  const {component} = setupTest();
  // component.initialSyncWithDOM(); // TODO: why is this here?

  const chipEl = bel`
    <div class="mdc-chip">
      <div class="mdc-chip__text">Hello world</div>
    </div>
  `;
  component.addChip(chipEl);

  assert.equal(component.chips.length, 4);
  assert.instanceOf(component.chips[3], FakeChip);
});

test('#adapter.hasClass returns true if class is set on chip set element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('#adapter.removeChip removes the chip object from the chip set', () => {
  const {component} = setupTest();
  const chip = component.chips[0];
  component.getDefaultFoundation().adapter_.removeChip(chip.id);
  assert.equal(component.chips.length, 2);
  td.verify(chip.destroy());
});

test('#adapter.removeChip does nothing if the given object is not in the chip set', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.removeChip('chip0');
  assert.equal(component.chips.length, 3);
});

test('#adapter.setSelected sets selected on chip object', () => {
  const {component} = setupTest();
  const chip = component.chips[0];
  component.getDefaultFoundation().adapter_.setSelected(chip.id, true);
  assert.equal(chip.selected, true);
});
