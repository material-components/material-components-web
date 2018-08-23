/**
 * @license
 * Copyright 2016 Google Inc.
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
