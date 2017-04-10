/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCGridListFoundation from '../../../packages/mdc-grid-list/foundation';

suite('MDCGridListFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCGridListFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCGridListFoundation, [
    'getOffsetWidth', 'getNumberOfTiles', 'getOffsetWidthForTileAtIndex', 'setStyleForTilesElement',
    'registerResizeHandler', 'deregisterResizeHandler',
  ]);
});

const setupTest = () => setupFoundationTest(MDCGridListFoundation);

test('#init calls component event registrations and align center function', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.verify(mockAdapter.registerResizeHandler(td.matchers.isA(Function)));
});

test('#destroy calls component event deregistrations', () => {
  const {foundation, mockAdapter} = setupTest();

  let resizeHandler;
  td.when(mockAdapter.registerResizeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    resizeHandler = handler;
  });

  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterResizeHandler(resizeHandler));
});

test('#align center does not set the container width if there are no tiles', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  td.when(mockAdapter.getNumberOfTiles()).thenReturn(0);
  foundation.init();

  foundation.alignCenter();
  mockRaf.flush();

  td.verify(mockAdapter.setStyleForTilesElement(), {times: 0, ignoreExtraArgs: true});
  mockRaf.restore();
});

test('#align center sets the container width to fit tiles inside', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  const listOffsetWidth = 1005;
  const tileOffsetWidth = 200;
  const tilesWidth = Math.floor(listOffsetWidth / tileOffsetWidth) * tileOffsetWidth;
  td.when(mockAdapter.getOffsetWidth()).thenReturn(listOffsetWidth);
  td.when(mockAdapter.getOffsetWidthForTileAtIndex(0)).thenReturn(tileOffsetWidth);
  foundation.init();

  foundation.alignCenter();
  mockRaf.flush();

  td.verify(mockAdapter.setStyleForTilesElement('width', `${tilesWidth}px`));
  mockRaf.restore();
});

test('#alignCenter debounces calls within the same frame', () => {
  const {foundation} = setupTest();
  const mockRaf = createMockRaf();
  foundation.alignCenter();
  foundation.alignCenter();
  foundation.alignCenter();
  assert.equal(mockRaf.pendingFrames.length, 1);
  mockRaf.restore();
});

test('#alignCenter resets debounce latch when alignCenter frame is run', () => {
  const {foundation} = setupTest();
  const mockRaf = createMockRaf();

  foundation.alignCenter();
  mockRaf.flush();
  foundation.alignCenter();
  assert.equal(mockRaf.pendingFrames.length, 1);
  mockRaf.restore();
});
