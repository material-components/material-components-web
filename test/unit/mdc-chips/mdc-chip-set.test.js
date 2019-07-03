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

import {MDCChipSet, MDCChipSetFoundation} from '../../../packages/mdc-chips/chip-set/index';
import {MDCChipFoundation} from '../../../packages/mdc-chips/chip/index';

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
    this.focusPrimaryAction = td.func('.focusPrimaryAction');
    this.focusTrailingAction = td.func('.focusTrailingAction');
    this.remove = td.func('.remove');
    this.removeFocus = td.func('.removeFocus');
    this.setSelectedFromChipset = td.func('.setSelectedFromChipset');
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
  const {
    INTERACTION_EVENT, ARROW_LEFT_KEY, NAVIGATION_EVENT, REMOVAL_EVENT, SELECTION_EVENT} = MDCChipFoundation.strings;
  const evtData = {
    chipId: 'chipA', selected: true, key: ARROW_LEFT_KEY, source: 1,
  };
  const evt1 = document.createEvent('CustomEvent');
  const evt2 = document.createEvent('CustomEvent');
  const evt3 = document.createEvent('CustomEvent');
  const evt4 = document.createEvent('CustomEvent');
  evt1.initCustomEvent(INTERACTION_EVENT, true, true, evtData);
  evt2.initCustomEvent(REMOVAL_EVENT, true, true, evtData);
  evt3.initCustomEvent(SELECTION_EVENT, true, true, evtData);
  evt4.initCustomEvent(NAVIGATION_EVENT, true, true, evtData);

  root.dispatchEvent(evt1);
  root.dispatchEvent(evt2);
  root.dispatchEvent(evt3);
  root.dispatchEvent(evt4);

  td.verify(mockFoundation.handleChipInteraction('chipA'), {times: 1});
  td.verify(mockFoundation.handleChipSelection('chipA', true), {times: 1});
  td.verify(mockFoundation.handleChipRemoval('chipA'), {times: 1});
  td.verify(mockFoundation.handleChipNavigation('chipA', ARROW_LEFT_KEY, 1), {times: 1});
});

test('#destroy removes event handlers', () => {
  const {root, component, mockFoundation} = setupMockFoundationTest();
  component.destroy();

  domEvents.emit(root, MDCChipFoundation.strings.INTERACTION_EVENT);
  td.verify(mockFoundation.handleChipInteraction(td.matchers.anything()), {times: 0});

  domEvents.emit(root, MDCChipFoundation.strings.SELECTION_EVENT);
  td.verify(mockFoundation.handleChipSelection(td.matchers.anything()), {times: 0});

  domEvents.emit(root, MDCChipFoundation.strings.REMOVAL_EVENT);
  td.verify(mockFoundation.handleChipRemoval(td.matchers.anything()), {times: 0});

  domEvents.emit(root, MDCChipFoundation.strings.NAVIGATION_EVENT);
  td.verify(mockFoundation.handleChipNavigation(td.matchers.anything()), {times: 0});
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

test('#adapter.removeChipAtIndex removes the chip object from the chip set', () => {
  const {component} = setupTest();
  const chip = component.chips[0];
  component.getDefaultFoundation().adapter_.removeChipAtIndex(0);
  assert.equal(component.chips.length, 2);
  td.verify(chip.destroy());
  td.verify(chip.remove());
});

test('#adapter.removeChipAtIndex does nothing if the given object is not in the chip set', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.removeChipAtIndex(-1);
  assert.equal(component.chips.length, 3);
});

test('#adapter.selectChipAtIndex calls setSelectedFromChipset on chip object', () => {
  const {component} = setupTest();
  const chip = component.chips[0];
  component.getDefaultFoundation().adapter_.selectChipAtIndex(0, true);
  td.verify(chip.setSelectedFromChipSet(true));
});

test('#adapter.getChipListCount returns the number of chips', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getChipListCount(), 3);
});

test('#adapter.getIndexOfChipById returns the index of the chip', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getIndexOfChipById('chip1'), 0);
});

test('#adapter.focusChipPrimaryActionAtIndex focuses the primary action of the chip at the given index', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.focusChipPrimaryActionAtIndex(0);
  td.verify(component.chips[0].focusPrimaryAction(), {times: 1});
});

test('#adapter.focusChipTrailingActionAtIndex focuses the trailing action of the chip at the given index', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.focusChipTrailingActionAtIndex(0);
  td.verify(component.chips[0].focusTrailingAction(), {times: 1});
});

test('#adapter.removeFocusFromChipAtIndex removes focus from the chip at the given index', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.removeFocusFromChipAtIndex(0);
  td.verify(component.chips[0].removeFocus(), {times: 1});
});

test('#adapter.isRTL returns true if the text direction is RTL', () => {
  const {component, root} = setupTest();
  document.documentElement.appendChild(root);
  document.documentElement.setAttribute('dir', 'rtl');
  assert.isTrue(component.getDefaultFoundation().adapter_.isRTL());
  document.documentElement.removeAttribute('dir');
  document.documentElement.removeChild(root);
});

test('#adapter.isRTL returns false if the text direction is not RTL', () => {
  const {component, root} = setupTest();
  document.documentElement.appendChild(root);
  assert.isFalse(component.getDefaultFoundation().adapter_.isRTL());
  document.documentElement.removeChild(root);
});
