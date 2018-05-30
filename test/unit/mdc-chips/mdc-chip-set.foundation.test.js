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
    'appendChip', 'removeChip',
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

test('#addChip proxies to adapter and returns chip element', () => {
  const {foundation, mockAdapter} = setupTest();
  const leadingIcon = bel`<i>face</i>`;
  const trailingIcon = bel`<i>cancel</i>`;
  foundation.addChip('Hello world', leadingIcon, trailingIcon);
  td.verify(mockAdapter.appendChip('Hello world', leadingIcon, trailingIcon));
});

test('in choice chips, on custom MDCChip:interaction event selects chip if no chips are selected', () => {
  const {foundation, mockAdapter, chipA} = setupTest();
  let chipInteractionHandler;
  td.when(mockAdapter.registerInteractionHandler('MDCChip:interaction', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      chipInteractionHandler = handler;
    });
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);

  td.when(chipA.foundation.isSelected()).thenReturn(false);
  assert.equal(foundation.selectedChips_.length, 0);

  foundation.init();

  chipInteractionHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.setSelected(true));
  assert.equal(foundation.selectedChips_.length, 1);
});

test('in choice chips, on custom MDCChip:interaction event deselects chip if another chip is selected', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  let chipInteractionHandler;
  td.when(mockAdapter.registerInteractionHandler('MDCChip:interaction', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      chipInteractionHandler = handler;
    });
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);

  foundation.select(chipB.foundation);
  td.when(chipA.foundation.isSelected()).thenReturn(false);
  td.when(chipB.foundation.isSelected()).thenReturn(true);
  assert.equal(foundation.selectedChips_.length, 1);

  foundation.init();

  chipInteractionHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.setSelected(true));
  td.verify(chipB.foundation.setSelected(false));
  assert.equal(foundation.selectedChips_.length, 1);
});

test('in filter chips, on custom MDCChip:interaction event selects multiple chips', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  let chipInteractionHandler;
  td.when(mockAdapter.registerInteractionHandler('MDCChip:interaction', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      chipInteractionHandler = handler;
    });
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);

  td.when(chipA.foundation.isSelected()).thenReturn(false);
  td.when(chipB.foundation.isSelected()).thenReturn(false);
  assert.equal(foundation.selectedChips_.length, 0);

  foundation.init();

  chipInteractionHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.setSelected(true));
  assert.equal(foundation.selectedChips_.length, 1);

  chipInteractionHandler({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipB.foundation.setSelected(true));
  assert.equal(foundation.selectedChips_.length, 2);
});

test('in filter chips, on custom MDCChip:interaction event deselects selected chips', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  let chipInteractionHandler;
  td.when(mockAdapter.registerInteractionHandler('MDCChip:interaction', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      chipInteractionHandler = handler;
    });
  td.when(mockAdapter.hasClass(cssClasses.FILTER)).thenReturn(true);

  foundation.select(chipA.foundation);
  foundation.select(chipB.foundation);
  td.when(chipA.foundation.isSelected()).thenReturn(true);
  td.when(chipB.foundation.isSelected()).thenReturn(true);
  assert.equal(foundation.selectedChips_.length, 2);

  foundation.init();

  chipInteractionHandler({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipB.foundation.setSelected(false));
  assert.equal(foundation.selectedChips_.length, 1);

  chipInteractionHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.foundation.setSelected(false));
  assert.equal(foundation.selectedChips_.length, 0);
});

test('on custom MDCChip:removal event removes chip', () => {
  const {foundation, mockAdapter, chipA} = setupTest();
  let chipRemovalHandler;
  td.when(mockAdapter.registerInteractionHandler('MDCChip:removal', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      chipRemovalHandler = handler;
    });

  foundation.init();
  chipRemovalHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(mockAdapter.removeChip(chipA));
});
