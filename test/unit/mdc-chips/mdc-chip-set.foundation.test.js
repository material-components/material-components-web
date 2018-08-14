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
