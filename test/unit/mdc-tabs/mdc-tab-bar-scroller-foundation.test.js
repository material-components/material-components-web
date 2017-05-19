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
import {verifyDefaultAdapter} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';

import MDCTabBarScrollerFoundation from '../../../packages/mdc-tabs/tab-bar-scroller/foundation';

suite('MDCTabBarScrollerFoundation');

test('exports cssClasses and strings', () => {
  assert.isOk('cssClasses' in MDCTabBarScrollerFoundation);
  assert.isOk('strings' in MDCTabBarScrollerFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabBarScrollerFoundation, [
    'addClass', 'removeClass', 'eventTargetHasClass', 'addClassToForwardIndicator',
    'removeClassFromForwardIndicator', 'addClassToBackIndicator', 'removeClassFromBackIndicator',
    'isRTL', 'registerBackIndicatorClickHandler', 'deregisterBackIndicatorClickHandler',
    'registerForwardIndicatorClickHandler', 'deregisterForwardIndicatorClickHandler',
    'registerCapturedFocusHandler', 'deregisterCapturedFocusHandler',
    'registerWindowResizeHandler', 'deregisterWindowResizeHandler',
    'getNumberOfTabs', 'getComputedWidthForTabAtIndex', 'getComputedLeftForTabAtIndex',
    'getOffsetWidthForScrollFrame', 'getScrollLeftForScrollFrame', 'setScrollLeftForScrollFrame',
    'getOffsetWidthForTabBar', 'setTransformStyleForTabBar', 'getOffsetLeftForEventTarget',
    'getOffsetWidthForEventTarget',
  ]);
});

function setupTest() {
  return setupFoundationTest(MDCTabBarScrollerFoundation);
}

test('#init registers event handlers', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerBackIndicatorClickHandler(isA(Function)));
  td.verify(mockAdapter.registerForwardIndicatorClickHandler(isA(Function)));
  td.verify(mockAdapter.registerWindowResizeHandler(isA(Function)));
  td.verify(mockAdapter.registerCapturedFocusHandler(isA(Function)));
});

test('#init removes enabled class from indicators if tab bar doesn\'t overflow', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {INDICATOR_ENABLED} = MDCTabBarScrollerFoundation.cssClasses;

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(200);
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(100);

  foundation.init();
  raf.flush();

  td.verify(mockAdapter.removeClassFromBackIndicator(INDICATOR_ENABLED));
  td.verify(mockAdapter.removeClassFromForwardIndicator(INDICATOR_ENABLED));
});

test('#init adds enabled class to forward if tab bar overflows', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {INDICATOR_ENABLED} = MDCTabBarScrollerFoundation.cssClasses;

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(60);
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(100);

  foundation.init();
  raf.flush();

  td.verify(mockAdapter.addClassToForwardIndicator(INDICATOR_ENABLED));
});

test('#destroy deregisters event handlers', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();
  td.verify(mockAdapter.deregisterBackIndicatorClickHandler(isA(Function)));
  td.verify(mockAdapter.deregisterForwardIndicatorClickHandler(isA(Function)));
  td.verify(mockAdapter.deregisterWindowResizeHandler(isA(Function)));
  td.verify(mockAdapter.deregisterCapturedFocusHandler(isA(Function)));
});

test('#scrollBack prevents default if evt is passed as argument', () => {
  const {foundation} = setupTest();

  const mockEvt = td.object({
    preventDefault: td.func('preventDefault'),
  });

  foundation.scrollBack(mockEvt);
  td.verify(mockEvt.preventDefault());
});

test('#scrollForward moves the tab bar forward', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const numTabs = 4;
  const tabWidth = 200;
  const scrollFrameWidth = 300;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);
  for (let i = 0; i < numTabs; i++) {
    td.when(mockAdapter.getComputedLeftForTabAtIndex(i)).thenReturn(i * tabWidth);
    td.when(mockAdapter.getComputedWidthForTabAtIndex(i)).thenReturn(tabWidth);
  }
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(numTabs * tabWidth);
  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);

  foundation.scrollForward();
  raf.flush();
  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(-400px)'));
});

test('#scrollBack moves the tab bar back', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const numTabs = 4;
  const tabWidth = 200;
  const scrollFrameWidth = 300;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);
  for (let i = 0; i < numTabs; i++) {
    td.when(mockAdapter.getComputedLeftForTabAtIndex(i)).thenReturn(i * tabWidth);
    td.when(mockAdapter.getComputedWidthForTabAtIndex(i)).thenReturn(tabWidth);
  }
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(numTabs * tabWidth);
  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);

  foundation.scrollForward();
  raf.flush();
  foundation.scrollBack();
  raf.flush();

  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(-200px)'));
});

test('#scrollBack removes indicator enabled state if at first tab', () => {
  const {foundation, mockAdapter} = setupTest();
  const {INDICATOR_ENABLED} = MDCTabBarScrollerFoundation.cssClasses;
  const raf = createMockRaf();
  const numTabs = 4;
  const tabWidth = 200;
  const scrollFrameWidth = 300;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);
  for (let i = 0; i < numTabs; i++) {
    td.when(mockAdapter.getComputedLeftForTabAtIndex(i)).thenReturn(i * tabWidth);
    td.when(mockAdapter.getComputedWidthForTabAtIndex(i)).thenReturn(tabWidth);
  }
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(numTabs * tabWidth);
  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);

  foundation.scrollForward();
  raf.flush();
  foundation.scrollBack();
  raf.flush();
  foundation.scrollBack();
  raf.flush();

  td.verify(mockAdapter.removeClassFromBackIndicator(INDICATOR_ENABLED));
});

test('#scrollForward moves the tab bar forward in RTL context', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const numTabs = 4;
  const tabWidth = 200;
  const scrollFrameWidth = 300;

  td.when(mockAdapter.isRTL()).thenReturn(true);
  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);
  for (let i = 0; i < numTabs; i++) {
    td.when(mockAdapter.getComputedLeftForTabAtIndex(i)).thenReturn(i * tabWidth);
    td.when(mockAdapter.getComputedWidthForTabAtIndex(i)).thenReturn(tabWidth);
  }
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(numTabs * tabWidth);
  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);

  foundation.scrollForward();
  raf.flush();
  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(600px)'));
});

test('#scrollBack moves the tab bar back in RTL context', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const numTabs = 4;
  const tabWidth = 200;
  const scrollFrameWidth = 300;

  td.when(mockAdapter.isRTL()).thenReturn(true);
  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);
  for (let i = 0; i < numTabs; i++) {
    td.when(mockAdapter.getComputedLeftForTabAtIndex(i)).thenReturn(i * tabWidth);
    td.when(mockAdapter.getComputedWidthForTabAtIndex(i)).thenReturn(tabWidth);
  }
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(numTabs * tabWidth);
  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);

  foundation.scrollForward();
  raf.flush();
  foundation.scrollBack();
  raf.flush();

  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(200px)'));
});

test('#layout sets indicator enabled states if tab bar overflows', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {INDICATOR_ENABLED} = MDCTabBarScrollerFoundation.cssClasses;
  const scrollFrameWidth = 60;
  const tabBarWidth = 100;

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(tabBarWidth);

  foundation.init();
  raf.flush();

  td.verify(mockAdapter.addClassToForwardIndicator(INDICATOR_ENABLED));
});

test('#layout removes indicator enabled states if tab bar does not overflow', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {INDICATOR_ENABLED} = MDCTabBarScrollerFoundation.cssClasses;
  const scrollFrameWidth = 200;
  const tabBarWidth = 100;

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(tabBarWidth);

  foundation.init();
  raf.flush();

  td.verify(mockAdapter.removeClassFromForwardIndicator(INDICATOR_ENABLED));
});

test('#isRTL calls the isRTL() adapter method', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.isRTL();

  td.verify(mockAdapter.isRTL());
});
