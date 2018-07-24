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
import lolex from 'lolex';
import td from 'testdouble';
import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import {createMockRaf} from '../helpers/raf';
import {MDCMenuFoundation} from '../../../packages/mdc-menu/foundation';
import {cssClasses, strings, numbers, Corner} from '../../../packages/mdc-menu/constants';

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCMenuFoundation);
  const size = {width: 500, height: 200};
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(1);
  td.when(mockAdapter.getInnerDimensions()).thenReturn(size);

  return {foundation, mockAdapter};
}

// Various anchor dimensions.
const smallTopLeft = {height: 20, width: 40, top: 20, bottom: 40, left: 20, right: 60};
const smallBottomLeft = {height: 20, width: 40, top: 920, bottom: 940, left: 20, right: 60};
const smallBottomRight = {height: 20, width: 40, top: 920, bottom: 940, left: 920, right: 960};
const smallCenter = {height: 20, width: 40, top: 490, bottom: 510, left: 480, right: 520};
const smallAboveMiddleLeft = {height: 20, width: 40, top: 400, bottom: 420, left: 20, right: 60};
const smallBelowMiddleLeft = {height: 20, width: 40, top: 600, bottom: 620, left: 20, right: 60};
const wideCenter = {height: 20, width: 150, top: 490, bottom: 510, left: 450, right: 600};
const wideTopLeft = {height: 20, width: 150, top: 20, bottom: 40, left: 20, right: 170};

/**
 * Initializes viewport, anchor and menu dimensions. Viewport is 1000x1000. Default menu size is 100x200.
 * @param {Object} mockAdapter Mock double for the adapter.
 * @param {{height:number, width: number, top: number, bottom: number, left: number, right: number}} anchorDimensions
 *   Approximate viewport corner where anchor is located.
 * @param {boolean=} isRtl Indicates whether layout is RTL.
 * @param {number=} menuHeight Optional height of the menu.
 */
function initAnchorLayout(mockAdapter, anchorDimensions, isRtl = false, menuHeight = 200) {
  td.when(mockAdapter.hasAnchor()).thenReturn(true);
  td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
  td.when(mockAdapter.getAnchorDimensions()).thenReturn(anchorDimensions);
  td.when(mockAdapter.isRtl()).thenReturn(isRtl);
  td.when(mockAdapter.getInnerDimensions()).thenReturn({height: menuHeight, width: 100});
}

function testFoundation(desc, runTests) {
  test(desc, () => {
    const {mockAdapter, foundation} = setupTest();
    const mockRaf = createMockRaf();
    runTests({mockAdapter, foundation, mockRaf});
    mockRaf.restore();
  });
}

suite('MDCMenuFoundation');
