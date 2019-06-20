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
import {EventSource} from '../../../packages/mdc-chips/chip/constants';

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
    'hasClass', 'removeChip', 'setSelected',
    'focusChipAtIndex', 'getIndexOfChipById', 'isRTL', 'getChipListCount',
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

function setupChipNavigationTest(chipIds, isRTL=false) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getIndexOfChipById(td.matchers.isA(String))).thenDo((id) => {
    for (let i = 0; i < chipIds.length; i++) {
      if (chipIds[i] === id) {
        return i;
      }
    }
    return -1;
  });
  td.when(mockAdapter.getChipListCount()).thenReturn(chipIds.length);
  td.when(mockAdapter.isRTL()).thenReturn(isRTL);
  return {foundation, mockAdapter};
}

test('#handleChipNavigation "Space" does nothing', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'Space', EventSource.None);
  td.verify(mockAdapter.focusChipAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleChipNavigation "ArrowRight" focuses the next chip text', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'ArrowRight', EventSource.Primary);
  td.verify(mockAdapter.focusChipAtIndex(2, 'ArrowRight', EventSource.Primary));
});

test('#handleChipNavigation "ArrowRight" focuses the previous chip in RTL', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2'], true);

  foundation.handleChipNavigation('chip1', 'ArrowRight', EventSource.Primary);
  td.verify(mockAdapter.focusChipAtIndex(0, 'ArrowRight', EventSource.Primary));
});

test('#handleChipNavigation "ArrowDown" focuses the next chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'ArrowDown', EventSource.Primary);
  td.verify(mockAdapter.focusChipAtIndex(2, 'ArrowDown', EventSource.Primary));
});

test('#handleChipNavigation "Home" focuses the first chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'Home', EventSource.Primary);
  td.verify(mockAdapter.focusChipAtIndex(0, 'Home', EventSource.Primary));
});

test('#handleChipNavigation "End" focuses the last chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'End', EventSource.Primary);
  td.verify(mockAdapter.focusChipAtIndex(2, 'End', EventSource.Primary));
});

test('#handleChipNavigation "ArrowRight" from the last chip does not focus any chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip2', 'ArrowRight', EventSource.Primary);
  td.verify(mockAdapter.focusChipAtIndex(
    td.matchers.isA(Number), td.matchers.isA(String), td.matchers.isA(Number)), {times: 0});
});

test('#handleChipNavigation "ArrowDown" from the last chip does not focus any chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip2', 'ArrowDown', EventSource.Primary);
  td.verify(mockAdapter.focusChipAtIndex(
    td.matchers.isA(Number), td.matchers.isA(String), td.matchers.isA(Number)), {times: 0});
});

test('#handleChipNavigation "ArrowLeft" focuses the previous chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'ArrowLeft', EventSource.Trailing);
  td.verify(mockAdapter.focusChipAtIndex(0, 'ArrowLeft', EventSource.Trailing));
});

test('#handleChipNavigation "ArrowLeft" focuses the next chip in RTL', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2'], true);

  foundation.handleChipNavigation('chip1', 'ArrowLeft', EventSource.Trailing);
  td.verify(mockAdapter.focusChipAtIndex(2, 'ArrowLeft', EventSource.Trailing));
});

test('#handleChipNavigation "ArrowUp" focuses the previous chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'ArrowLeft', EventSource.Primary);
  td.verify(mockAdapter.focusChipAtIndex(0, 'ArrowLeft', EventSource.Primary));
});

test('#handleChipNavigation "ArrowLeft" from the first chip does not focus any chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip0', 'ArrowLeft');
  td.verify(mockAdapter.focusChipAtIndex(
    td.matchers.isA(Number), td.matchers.isA(String), td.matchers.isA(Number)), {times: 0});
});

test('#handleChipNavigation "ArrowUp" from the first chip does not focus any chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip0', 'ArrowUp');
  td.verify(mockAdapter.focusChipAtIndex(
    td.matchers.isA(Number), td.matchers.isA(String), td.matchers.isA(Number)), {times: 0});
});
