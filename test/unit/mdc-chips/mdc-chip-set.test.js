/**
 * @license
 * Copyright 2017 Google Inc.
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
