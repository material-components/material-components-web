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
    'hasClass', 'removeChipAtIndex', 'selectChipAtIndex',
    'focusChipPrimaryActionAtIndex', 'focusChipTrailingActionAtIndex',
    'getIndexOfChipById', 'isRTL', 'getChipListCount',
    'removeFocusFromChipAtIndex',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCChipSetFoundation.defaultAdapter);
  const foundation = new MDCChipSetFoundation(mockAdapter);
  return {foundation, mockAdapter};
};

test('in choice chips, #select does nothing if chip is already selected', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB']);
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  foundation.select('chipA');
  foundation.select('chipA');
  td.verify(mockAdapter.selectChipAtIndex(0, true, false), {times: 1});
  assert.equal(foundation.getSelectedChipIds().length, 1);
});

test('in choice chips, #select selects chip if no chips are selected', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB']);
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  assert.equal(foundation.getSelectedChipIds().length, 0);

  foundation.select('chipA');
  td.verify(mockAdapter.selectChipAtIndex(0, true, false));
  assert.equal(foundation.getSelectedChipIds().length, 1);
});

test('in choice chips, #select deselects chip if another chip is selected', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB']);
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  foundation.select('chipB');
  assert.equal(foundation.getSelectedChipIds().length, 1);

  foundation.select('chipA');
  td.verify(mockAdapter.selectChipAtIndex(1, false, false));
  td.verify(mockAdapter.selectChipAtIndex(0, true, false));
  assert.equal(foundation.getSelectedChipIds().length, 1);
});

test('in filter chips, #select selects multiple chips', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB']);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  assert.equal(foundation.getSelectedChipIds().length, 0);

  foundation.select('chipA');
  td.verify(mockAdapter.selectChipAtIndex(0, true, false));
  assert.equal(foundation.getSelectedChipIds().length, 1);

  foundation.select('chipB');
  td.verify(mockAdapter.selectChipAtIndex(1, true, false));
  assert.equal(foundation.getSelectedChipIds().length, 2);
});

test('in filter chips, #select does nothing if chip is already selected', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB']);
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  foundation.select('chipA');
  foundation.select('chipA');
  td.verify(mockAdapter.selectChipAtIndex(0, true, false), {times: 1});
  assert.equal(foundation.getSelectedChipIds().length, 1);
});

test('in filter chips, #handleChipInteraction deselects chip if in selectedChipId', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB']);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  foundation.handleChipInteraction('chipA');
  foundation.handleChipInteraction('chipB');
  assert.equal(foundation.getSelectedChipIds().length, 2);

  foundation.handleChipInteraction('chipB');
  td.verify(mockAdapter.selectChipAtIndex(1, false, true));
  assert.equal(foundation.getSelectedChipIds().length, 1);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.selectChipAtIndex(0, false, true));
  assert.equal(foundation.getSelectedChipIds().length, 0);
});

test('#handleChipInteraction selects chip if the chip set is a filter chip set and notifies clients', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB']);
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.selectChipAtIndex(0, true, /** notifies clients */ true));
});

test('#handleChipInteraction selects chip if the chip set is a choice chip set and notifies clients', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB']);
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(false);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.selectChipAtIndex(0, true, /** notifies clients */ true));
});

test('#handleChipInteraction removes focus from all chips except the selected one', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getChipListCount()).thenReturn(4);
  td.when(mockAdapter.getIndexOfChipById('chipA')).thenReturn(1);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.removeFocusFromChipAtIndex(0));
  td.verify(mockAdapter.removeFocusFromChipAtIndex(2));
  td.verify(mockAdapter.removeFocusFromChipAtIndex(3));
});

test('#handleChipInteraction does nothing if the chip set is neither choice nor filter', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chipA', 'chipB', 'chipC']);
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(false);

  foundation.handleChipInteraction('chipA');
  td.verify(mockAdapter.selectChipAtIndex(0, true), {times: 0});
});

test('#handleChipSelection selects an unselected chip if selected is true', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = [];
  foundation.select = td.func();
  foundation.handleChipSelection('chipA', true, false);
  td.verify(foundation.select('chipA'));
});

test('#handleChipSelection does nothing if selected is true and the chip is already selected', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = ['chipA'];
  foundation.select = td.func();
  foundation.handleChipSelection('chipA', true, false);
  td.verify(foundation.select('chipA'), {times: 0});
});

test('#handleChipSelection deselects a selected chip if selected is false', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = ['chipA'];
  foundation.handleChipSelection('chipA', false, false);
  assert.equal(foundation.selectedChipIds_.length, 0);
});

test('#handleChipSelection does nothing if selected is false and the chip is not selected', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = ['chipB'];
  foundation.handleChipSelection('chipA', false, false);
  assert.equal(foundation.selectedChipIds_.length, 1);
});

test('#handleChipSelection does nothing if shouldIgnore is true', () => {
  const {foundation} = setupTest();

  foundation.selectedChipIds_ = ['chipB'];
  foundation.handleChipSelection('chipA', true, true);
  td.verify(foundation.select('chipA'), {times: 0});
});

test('#handleChipSelection emits no events', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.selectedChipIds_ = [];
  td.when(mockAdapter.getIndexOfChipById('chipA')).thenReturn(0);

  foundation.handleChipSelection('chipA', true, /** shouldIgnore */ false);
  td.verify(mockAdapter.selectChipAtIndex(0, true, /** shouldNotify */ false));
  foundation.handleChipSelection('chipA', false, /** shouldIgnore */ false);
  td.verify(mockAdapter.selectChipAtIndex(0, false, /** shouldNotify */ false));
});

test('#handleChipRemoval removes chip', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getIndexOfChipById('chipA')).thenReturn(1);

  foundation.handleChipRemoval('chipA');
  td.verify(mockAdapter.removeChipAtIndex(1));
});

test('#handleChipRemoval removes focus from all chips except the next one', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getChipListCount()).thenReturn(4);
  td.when(mockAdapter.getIndexOfChipById('chipA')).thenReturn(1);

  foundation.handleChipRemoval('chipA');
  td.verify(mockAdapter.removeFocusFromChipAtIndex(0));
  td.verify(mockAdapter.removeFocusFromChipAtIndex(2));
});

test('#handleChipRemoval gives focus to the next chip', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getChipListCount()).thenReturn(4);
  td.when(mockAdapter.getIndexOfChipById('chipA')).thenReturn(1);

  foundation.handleChipRemoval('chipA');
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(1));
});

test('#handleChipRemoval does not throw error if chip set is left empty', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getChipListCount()).thenReturn(0);
  td.when(mockAdapter.getIndexOfChipById('chipA')).thenReturn(0);

  foundation.handleChipRemoval('chipA');
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(-1), {times: 0});
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

  foundation.handleChipNavigation('chip1', 'Space', EventSource.NONE);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleChipNavigation "ArrowRight" focuses the next chip primary action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'ArrowRight', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(2));
});

test('#handleChipNavigation "ArrowRight" removes focus from all chips except the next one', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2', 'chip3']);

  foundation.handleChipNavigation('chip1', 'ArrowRight', EventSource.PRIMARY);
  td.verify(mockAdapter.removeFocusFromChipAtIndex(0));
  td.verify(mockAdapter.removeFocusFromChipAtIndex(1));
  td.verify(mockAdapter.removeFocusFromChipAtIndex(3));
});

[
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
].forEach((key) => {
  test(`#handleChipNavigation "${key}" removes focus from N-1 chips (all except the next)`, () => {
    const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2', 'chip3']);

    foundation.handleChipNavigation('chip1', key, EventSource.PRIMARY);
    td.verify(mockAdapter.removeFocusFromChipAtIndex(td.matchers.isA(Number)), {times: 3});
  });
});

test('#handleChipNavigation "ArrowRight" focuses the previous chip trailing action in RTL', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2'], true);

  foundation.handleChipNavigation('chip1', 'ArrowRight', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(0));
});

test('#handleChipNavigation "ArrowDown" focuses the next chip primary action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'ArrowDown', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(2));
});

test('#handleChipNavigation "ArrowDown" from the trailing action focuses the next chip trailing action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'ArrowDown', EventSource.TRAILING);
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(2));
});

test('#handleChipNavigation "Home" focuses the first chip primary action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'Home', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(0));
});

test('#handleChipNavigation "End" focuses the last chip primary action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'End', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(2));
});

test('#handleChipNavigation "ArrowRight" from the last chip does not focus any chip action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip2', 'ArrowRight', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleChipNavigation "ArrowDown" from the last chip does not focus any chip action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip2', 'ArrowDown', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleChipNavigation "ArrowLeft" focuses the previous chip trailing action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip1', 'ArrowLeft', EventSource.TRAILING);
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(0));
});

test('#handleChipNavigation "ArrowLeft" focuses the next chip primary action in RTL', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2'], true);

  foundation.handleChipNavigation('chip1', 'ArrowLeft', EventSource.TRAILING);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(2));
});

test('#handleChipNavigation "ArrowLeft" from the first chip does not focus any chip action', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip0', 'ArrowLeft', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#handleChipNavigation "ArrowUp" from the first chip does not focus any chip', () => {
  const {foundation, mockAdapter} = setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

  foundation.handleChipNavigation('chip0', 'ArrowUp', EventSource.PRIMARY);
  td.verify(mockAdapter.focusChipPrimaryActionAtIndex(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.focusChipTrailingActionAtIndex(td.matchers.isA(Number)), {times: 0});
});
