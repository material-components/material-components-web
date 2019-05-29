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

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import {MDCChipSetFoundation} from '../../../packages/mdc-chips/chip-set/foundation';

const {cssClasses} = MDCChipSetFoundation;

suite('MDCChipSetFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCChipSetFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCChipSetFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCChipSetFoundation, [
    'hasClass', 'removeChip', 'setSelected', 'focusChipAtIndex',
    'getChipClientRectByIndex', 'getChipListCount', 'getIndexOfChipById',
    'isRTL',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCChipSetFoundation.defaultAdapter);
  const foundation = new MDCChipSetFoundation(mockAdapter);
  return {foundation, mockAdapter};
};

test('in choice chips, #select does nothing if chip is already selected', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  foundation.select('chipA');
  foundation.select('chipA');
  td.verify(mockAdapter.setSelected('chipA', true), {times: 1});
  assert.equal(foundation.getSelectedChipIds().length, 1);
});

test('in choice chips, #select selects chip if no chips are selected', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  assert.equal(foundation.getSelectedChipIds().length, 0);

  foundation.select('chipA');
  td.verify(mockAdapter.setSelected('chipA', true));
  assert.equal(foundation.getSelectedChipIds().length, 1);
});

test('in choice chips, #select deselects chip if another chip is selected', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  foundation.select('chipB');
  assert.equal(foundation.getSelectedChipIds().length, 1);

  foundation.select('chipA');
  td.verify(mockAdapter.setSelected('chipB', false));
  td.verify(mockAdapter.setSelected('chipA', true));
  assert.equal(foundation.getSelectedChipIds().length, 1);
});

test('in filter chips, #select selects multiple chips', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  assert.equal(foundation.getSelectedChipIds().length, 0);

  foundation.select('chipA');
  td.verify(mockAdapter.setSelected('chipA', true));
  assert.equal(foundation.getSelectedChipIds().length, 1);

  foundation.select('chipB');
  td.verify(mockAdapter.setSelected('chipB', true));
  assert.equal(foundation.getSelectedChipIds().length, 2);
});

test('in filter chips, #select does nothing if chip is already selected', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  foundation.select('chipA');
  foundation.select('chipA');
  td.verify(mockAdapter.setSelected('chipA', true), {times: 1});
  assert.equal(foundation.getSelectedChipIds().length, 1);
});

test('in filter chips, #handleChipInteraction deselects chip if in selectedChipId', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  foundation.handleChipInteraction('chipA');
  foundation.handleChipInteraction('chipB');
  assert.equal(foundation.getSelectedChipIds().length, 2);

  foundation.handleChipInteraction('chipB');
  td.verify(mockAdapter.setSelected('chipB', false));
  assert.equal(foundation.getSelectedChipIds().length, 1);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.setSelected('chipA', false));
  assert.equal(foundation.getSelectedChipIds().length, 0);
});

test('#handleChipInteraction selects chip if the chip set is a filter chip set', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.setSelected('chipA', true));
});

test('#handleChipInteraction selects chip if the chip set is a choice chip set', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(false);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.setSelected('chipA', true));
});

test('#handleChipInteraction does nothing if the chip set is neither choice nor filter', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(false);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.setSelected('chipA', true), {times: 0});
});

test('#handleChipSelection selects an unselected chip if selected is true', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = [];
  foundation.select = td.func();
  foundation.handleChipSelection('chipA', true);
  td.verify(foundation.select('chipA'));
});

test('#handleChipSelection does nothing if selected is true and the chip is already selected', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = ['chipA'];
  foundation.select = td.func();
  foundation.handleChipSelection('chipA', true);
  td.verify(foundation.select('chipA'), {times: 0});
});

test('#handleChipSelection deselects a selected chip if selected is false', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = ['chipA'];
  foundation.handleChipSelection('chipA', false);
  assert.equal(foundation.selectedChipIds_.length, 0);
});

test('#handleChipSelection does nothing if selected is false and the chip is not selected', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = ['chipB'];
  foundation.handleChipSelection('chipA', false);
  assert.equal(foundation.selectedChipIds_.length, 1);
});

test('#handleChipRemoval removes chip', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleChipRemoval('chipA');
  td.verify(mockAdapter.removeChip('chipA'));
});

function setupHandleKeyboardTest(chips=[], isRTL=false) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getChipClientRectByIndex(td.matchers.isA(Number))).thenDo((index) => {
    if (index < 0 || index >= chips.length) {
      return undefined;
    }
    return chips[index].clientRect;
  });
  td.when(mockAdapter.getIndexOfChipById(td.matchers.isA(String))).thenDo((id) => {
    return chips.findIndex((chip) => chip.id === id);
  });
  td.when(mockAdapter.getChipListCount()).thenReturn(chips.length);
  td.when(mockAdapter.isRTL()).thenReturn(isRTL);
  return {foundation, mockAdapter};
}

function setupFakeChip(left, top, width, height, id) {
  return {
    clientRect: {
      right: left + width,
      bottom: top + height,
      left,
      width,
      height,
      top,
    },
    id,
  };
}

const chipGrid3x3 = [
  setupFakeChip(0, 0, 60, 30, 'chip0'),
  setupFakeChip(70, 0, 60, 30, 'chip1'),
  setupFakeChip(140, 0, 60, 30, 'chip2'),
  // New row
  setupFakeChip(0, 40, 60, 30, 'chip3'),
  setupFakeChip(70, 40, 60, 30, 'chip4'),
  setupFakeChip(140, 40, 60, 30, 'chip5'),
  // New row
  setupFakeChip(0, 80, 60, 30, 'chip6'),
  setupFakeChip(70, 80, 60, 30, 'chip7'),
  setupFakeChip(140, 80, 60, 30, 'chip8'),
];

test('#handleKeyboard ArrowLeft from the first chip does nothing', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip0', 'ArrowLeft');
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleKeyboard Home from the first chip in a row does nothing', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip0', 'Home');
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleKeyboard ArrowRight from the last chip does nothing', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip8', 'ArrowRight');
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleKeyboard End from the last chip in a row does nothing', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip5', 'End');
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleKeyboard ArrowRight goes to the next logical chip', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip4', 'ArrowRight');
  td.verify(mockAdapter.focusChipAtIndex(5));
});

test('#handleKeyboard ArrowRight wraps around to the next row', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip2', 'ArrowRight');
  td.verify(mockAdapter.focusChipAtIndex(3));
});

test('#handleKeyboard ArrowLeft goes to the next logical chip', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip4', 'ArrowLeft');
  td.verify(mockAdapter.focusChipAtIndex(3));
});

test('#handleKeyboard ArrowLeft wraps around to the previous row', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip3', 'ArrowLeft');
  td.verify(mockAdapter.focusChipAtIndex(2));
});

test('#handleKeyboard Home goes to the row start chip', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip5', 'Home');
  td.verify(mockAdapter.focusChipAtIndex(3));
});

test('#handleKeyboard End goes to the row end chip', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip3', 'End');
  td.verify(mockAdapter.focusChipAtIndex(5));
});

test('#handleKeyboard ArrowUp goes to the next logical chip', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip4', 'ArrowUp');
  td.verify(mockAdapter.focusChipAtIndex(1));
});

test('#handleKeyboard ArrowUp from the top row does nothing', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip0', 'ArrowUp');
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleKeyboard ArrowDown goes to the next logical chip', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip4', 'ArrowDown');
  td.verify(mockAdapter.focusChipAtIndex(7));
});

test('#handleKeyboard ArrowDown from the bottom row does nothing', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3);
  foundation.handleChipKeyboardNavigation('chip7', 'ArrowDown');
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

const chipGrid3x3RTL = [
  setupFakeChip(140, 0, 60, 30, 'chip0'),
  setupFakeChip(70, 0, 60, 30, 'chip1'),
  setupFakeChip(0, 0, 60, 30, 'chip2'),
  // New row
  setupFakeChip(140, 40, 60, 30, 'chip3'),
  setupFakeChip(70, 40, 60, 30, 'chip4'),
  setupFakeChip(0, 40, 60, 30, 'chip5'),
  // New row
  setupFakeChip(140, 80, 60, 30, 'chip6'),
  setupFakeChip(70, 80, 60, 30, 'chip7'),
  setupFakeChip(0, 80, 60, 30, 'chip8'),
];

test('#handleKeyboard ArrowRight goes to the next logical chip in RTL', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3RTL, true);
  foundation.handleChipKeyboardNavigation('chip4', 'ArrowRight');
  td.verify(mockAdapter.focusChipAtIndex(3));
});

test('#handleKeyboard ArrowLeft goes to the next logical chip in RTL', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3RTL, true);
  foundation.handleChipKeyboardNavigation('chip4', 'ArrowLeft');
  td.verify(mockAdapter.focusChipAtIndex(5));
});

test('#handleKeyboard Home goes to the row start chip in RTL', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3RTL, true);
  foundation.handleChipKeyboardNavigation('chip5', 'Home');
  td.verify(mockAdapter.focusChipAtIndex(3));
});

test('#handleKeyboard End goes to the row end chip in RTL', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3RTL, true);
  foundation.handleChipKeyboardNavigation('chip3', 'End');
  td.verify(mockAdapter.focusChipAtIndex(5));
});

test('#handleKeyboard Home from the last chip in a row does nothing in RTL', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3RTL, true);
  foundation.handleChipKeyboardNavigation('chip3', 'Home');
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleKeyboard End from the first chip in a row does nothing in RTL', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3RTL, true);
  foundation.handleChipKeyboardNavigation('chip5', 'End');
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleKeyboard ArrowLeft wraps around to the previous row in RTL', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3RTL, true);
  foundation.handleChipKeyboardNavigation('chip5', 'ArrowLeft');
  td.verify(mockAdapter.focusChipAtIndex(6));
});

test('#handleKeyboard ArrowRight wraps around to the previous row in RTL', () => {
  const {foundation, mockAdapter} = setupHandleKeyboardTest(chipGrid3x3RTL, true);
  foundation.handleChipKeyboardNavigation('chip3', 'ArrowRight');
  td.verify(mockAdapter.focusChipAtIndex(2));
});
