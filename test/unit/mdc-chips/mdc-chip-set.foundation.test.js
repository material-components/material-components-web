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
    'hasClass', 'registerInteractionHandler', 'deregisterInteractionHandler',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCChipSetFoundation.defaultAdapter);
  const foundation = new MDCChipSetFoundation(mockAdapter);
  const chipA = td.object({
    foundation: {
      toggleSelected: () => {},
    },
  });
  const chipB = td.object({
    foundation: {
      toggleSelected: () => {},
    },
  });
  return {foundation, mockAdapter, chipA, chipB};
};

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerInteractionHandler('MDCChip:interaction', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterInteractionHandler('MDCChip:interaction', td.matchers.isA(Function)));
});

test('on custom MDCChip:interaction event toggles selected state with single selection on choice chips', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  let chipInteractionHandler;
  td.when(mockAdapter.registerInteractionHandler('MDCChip:interaction', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      chipInteractionHandler = handler;
    });
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);

  assert.equal(foundation.selectedChips_.length, 0);
  foundation.init();

  chipInteractionHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.toggleSelected());
  assert.equal(foundation.selectedChips_.length, 1);

  chipInteractionHandler({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipA.foundation.toggleSelected());
  td.verify(chipB.foundation.toggleSelected());
  assert.equal(foundation.selectedChips_.length, 1);

  chipInteractionHandler({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipB.foundation.toggleSelected());
  assert.equal(foundation.selectedChips_.length, 0);
});

test('on custom MDCChip:interaction event toggles selected state with multi-selection on filter chips', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  let chipInteractionHandler;
  td.when(mockAdapter.registerInteractionHandler('MDCChip:interaction', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      chipInteractionHandler = handler;
    });
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);

  assert.equal(foundation.selectedChips_.length, 0);
  foundation.init();

  chipInteractionHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.toggleSelected());
  assert.equal(foundation.selectedChips_.length, 1);

  chipInteractionHandler({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipB.foundation.toggleSelected());
  assert.equal(foundation.selectedChips_.length, 2);

  chipInteractionHandler({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipB.foundation.toggleSelected());
  assert.equal(foundation.selectedChips_.length, 1);

  chipInteractionHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.toggleSelected());
  assert.equal(foundation.selectedChips_.length, 0);
});
