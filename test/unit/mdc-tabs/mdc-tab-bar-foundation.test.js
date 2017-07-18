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
 * See the License for the specific language governing permissions and * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter, captureHandlers} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';

import MDCTabBarFoundation from '../../../packages/mdc-tabs/tab-bar/foundation';

suite('MDCTabBarFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabBarFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabBarFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabBarFoundation, [
    'addClass', 'removeClass', 'bindOnMDCTabSelectedEvent',
    'unbindOnMDCTabSelectedEvent', 'registerResizeHandler',
    'deregisterResizeHandler', 'getOffsetWidth', 'setStyleForIndicator',
    'getOffsetWidthForIndicator', 'notifyChange',
    'getNumberOfTabs', 'isTabActiveAtIndex', 'setTabActiveAtIndex',
    'isDefaultPreventedOnClickForTabAtIndex',
    'setPreventDefaultOnClickForTabAtIndex', 'measureTabAtIndex',
    'getComputedWidthForTabAtIndex', 'getComputedLeftForTabAtIndex',
  ]);
});

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCTabBarFoundation);
  const {UPGRADED} = MDCTabBarFoundation.cssClasses;
  const tabHandlers = captureHandlers(mockAdapter, 'bindOnMDCTabSelectedEvent');

  return {foundation, mockAdapter, UPGRADED, tabHandlers};
}

test('#init adds upgraded class to tabs', () => {
  const {foundation, mockAdapter, UPGRADED} = setupTest();

  foundation.init();
  td.verify(mockAdapter.addClass(UPGRADED));
});

test('#init registers listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.bindOnMDCTabSelectedEvent());
  td.verify(mockAdapter.registerResizeHandler(isA(Function)));
});

test('#init sets active tab if index of active tab on init() is > 0', () => {
  const {foundation, mockAdapter} = setupTest();
  const activeTabIndex = 2;
  const numberOfTabs = 5;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numberOfTabs);
  td.when(mockAdapter.isTabActiveAtIndex(activeTabIndex)).thenReturn(true);

  foundation.init();

  assert.isTrue(mockAdapter.isTabActiveAtIndex(activeTabIndex));
});

test('#init sets styles for indicator', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  foundation.init();
  raf.flush();

  td.verify(mockAdapter.setStyleForIndicator('transform', td.matchers.isA(String)));
  td.verify(mockAdapter.setStyleForIndicator('transition', td.matchers.isA(String)));
  td.verify(mockAdapter.setStyleForIndicator('visibility', td.matchers.isA(String)));

  raf.restore();
});

test('#destroy removes class from tabs', () => {
  const {foundation, mockAdapter, UPGRADED} = setupTest();

  foundation.destroy();
  td.verify(mockAdapter.removeClass(UPGRADED));
});

test('#destroy deregisters tab event handlers', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();
  td.verify(mockAdapter.unbindOnMDCTabSelectedEvent());
  td.verify(mockAdapter.deregisterResizeHandler(isA(Function)));
});

test('#switchToTabAtIndex does nothing if the currently active tab is clicked', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.switchToTabAtIndex(0, true);

  td.verify(mockAdapter.setTabActiveAtIndex(
    td.matchers.anything(), td.matchers.isA(Boolean)
  ), {times: 0});
  td.verify(mockAdapter.notifyChange(td.matchers.anything()), {times: 0});
});

test('#switchToTabAtIndex throws if index negative', () => {
  const {foundation} = setupTest();

  assert.throws(() => foundation.switchToTabAtIndex(-1, true));
});

test('#switchToTabAtIndex throws if index is out of bounds', () => {
  const {foundation, mockAdapter} = setupTest();
  const numTabs = 2;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);

  assert.throws(() => foundation.switchToTabAtIndex(numTabs, true));
});

test('#switchToTabAtIndex makes tab active', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const numTabs = 2;
  const tabToSwitchTo = 1;
  const shouldNotify = true;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);

  foundation.switchToTabAtIndex(tabToSwitchTo, shouldNotify);
  raf.flush();

  td.verify(mockAdapter.setTabActiveAtIndex(tabToSwitchTo, shouldNotify));
  td.verify(mockAdapter.notifyChange(td.matchers.anything()));
  raf.restore();
});

test('#getActiveTabIndex returns the active tab index', () => {
  const {foundation, mockAdapter} = setupTest();
  const activeTabIndex = 2;
  const numberOfTabs = 5;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numberOfTabs);
  td.when(mockAdapter.isTabActiveAtIndex(activeTabIndex)).thenReturn(true);

  foundation.init();

  assert.equal(foundation.getActiveTabIndex(), activeTabIndex);
});
