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
import MDCChipSetFoundation from '../../../packages/mdc-chips/chip-set/foundation';

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

test('in filter chips, #deselect deselects selected chips', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  foundation.select('chipA');
  foundation.select('chipB');
  assert.equal(foundation.getSelectedChipIds().length, 2);

  foundation.deselect('chipB');
  td.verify(mockAdapter.setSelected('chipB', false));
  assert.equal(foundation.getSelectedChipIds().length, 1);

  foundation.deselect('chipA');
  td.verify(mockAdapter.setSelected('chipA', false));
  assert.equal(foundation.getSelectedChipIds().length, 0);
});

test('#handleChipInteraction selects chip if the chip set is a filter chip set', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);

  foundation.handleChipInteraction({
    detail: {
      chipId: 'chipA',
    },
  });
  td.verify(mockAdapter.setSelected('chipA', true));
});

test('#handleChipInteraction selects chip if the chip set is a choice chip set', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(false);

  foundation.handleChipInteraction({
    detail: {
      chipId: 'chipA',
    },
  });
  td.verify(mockAdapter.setSelected('chipA', true));
});

test('#handleChipInteraction does nothing if the chip set is neither choice nor filter', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(false);

  foundation.handleChipInteraction({
    detail: {
      chipId: 'chipA',
    },
  });
  td.verify(mockAdapter.setSelected('chipA', true), {times: 0});
});

test('#handleChipRemoval removes chip', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleChipRemoval({
    detail: {
      chipId: 'chipA',
    },
  });
  td.verify(mockAdapter.removeChip('chipA'));
});
