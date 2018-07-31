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
    'hasClass', 'removeChip',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCChipSetFoundation.defaultAdapter);
  const foundation = new MDCChipSetFoundation(mockAdapter);
  const chipA = td.object({
    foundation: {
      isSelected: () => {},
      setSelected: () => {},
    },
  });
  const chipB = td.object({
    foundation: {
      isSelected: () => {},
      setSelected: () => {},
    },
  });
  return {foundation, mockAdapter, chipA, chipB};
};

test('in choice chips, #handleChipInteraction selects chip if no chips are selected', () => {
  const {foundation, mockAdapter, chipA} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  td.when(chipA.foundation.isSelected()).thenReturn(false);
  assert.equal(foundation.selectedChips_.length, 0);

  foundation.handleChipInteraction({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.setSelected(true));
  assert.equal(foundation.selectedChips_.length, 1);
});

test('in choice chips, #handleChipInteraction deselects chip if another chip is selected', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);
  foundation.select(chipB.foundation);
  td.when(chipA.foundation.isSelected()).thenReturn(false);
  td.when(chipB.foundation.isSelected()).thenReturn(true);
  assert.equal(foundation.selectedChips_.length, 1);

  foundation.handleChipInteraction({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.setSelected(true));
  td.verify(chipB.foundation.setSelected(false));
  assert.equal(foundation.selectedChips_.length, 1);
});

test('in filter chips, #handleChipInteraction selects multiple chips', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  td.when(chipA.foundation.isSelected()).thenReturn(false);
  td.when(chipB.foundation.isSelected()).thenReturn(false);
  assert.equal(foundation.selectedChips_.length, 0);

  foundation.handleChipInteraction({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.setSelected(true));
  assert.equal(foundation.selectedChips_.length, 1);

  foundation.handleChipInteraction({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipB.foundation.setSelected(true));
  assert.equal(foundation.selectedChips_.length, 2);
});

test('in filter chips, #handleChipInteraction event deselects selected chips', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);
  foundation.select(chipA.foundation);
  foundation.select(chipB.foundation);
  td.when(chipA.foundation.isSelected()).thenReturn(true);
  td.when(chipB.foundation.isSelected()).thenReturn(true);
  assert.equal(foundation.selectedChips_.length, 2);

  foundation.handleChipInteraction({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipB.foundation.setSelected(false));
  assert.equal(foundation.selectedChips_.length, 1);

  foundation.handleChipInteraction({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.setSelected(false));
  assert.equal(foundation.selectedChips_.length, 0);
});

test('#handleChipRemoval removes chip', () => {
  const {foundation, mockAdapter, chipA} = setupTest();

  foundation.handleChipRemoval({
    detail: {
      chip: chipA,
    },
  });
  td.verify(mockAdapter.removeChip(chipA));
});
