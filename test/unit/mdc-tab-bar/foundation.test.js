/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
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

import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTabBarFoundation from '../../../packages/mdc-tab-bar/foundation';
import MDCTabFoundation from '../../../packages/mdc-tab/foundation';

suite.only('MDCTabBarFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabBarFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabBarFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabBarFoundation, [
    'registerEventHandler', 'deregisterEventHandler',
    'scrollTo', 'incrementScroll', 'computeScrollPosition', 'computeScrollerWidth',
  ]);
});

const setupTabs = ({activeIndex=0, tabContentWidths=[]}={}) => {
  const tabPadding = 50;
  let tabWidthAccumulator = 0;
  return tabContentWidths.map((contentWidth, index) => {
    const mockTabAdapter = td.object(MDCTabFoundation.defaultAdapter);
    const tabWidth = contentWidth + tabPadding;
    td.when(mockTabAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenDo(() => {
      return index === activeIndex;
    });
    td.when(mockTabAdapter.getContentOffsetWidth()).thenReturn(contentWidth);
    td.when(mockTabAdapter.getOffsetWidth()).thenReturn(tabWidth);
    td.when(mockTabAdapter.getOffsetLeft()).thenReturn(tabWidthAccumulator);
    td.when(mockTabAdapter.getContentOffsetLeft()).thenReturn(tabWidthAccumulator + (tabPadding / 2));
    tabWidthAccumulator += tabWidth;
    return new MDCTabFoundation(mockTabAdapter);
  });
};

const setupTest = (...args) => {
  const mockTabs = setupTabs(...args);
  const mockAdapter = td.object(MDCTabBarFoundation.defaultAdapter);
  const foundation = new MDCTabBarFoundation(mockAdapter, mockTabs);
  return {mockAdapter, mockTabs, foundation};
};

test('#activate() does nothing if the index is already active', () => {
  const {foundation, mockAdapter} = setupTest({
    activeIndex: 0,
    tabContentWidths: [
      30, 45, 10, 17, 22, 93, 31,
    ],
  });
  console.log(foundation.tabs_.map((tab) => tab.computeDimensions()));
  foundation.activateTab(0);
  td.verify(mockAdapter.incrementScroll(td.matchers.isA(Number)), {times: 0});
});
