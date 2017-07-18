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

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabBarScrollerFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabBarScrollerFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabBarScrollerFoundation, [
    'addClass', 'removeClass', 'eventTargetHasClass', 'addClassToForwardIndicator',
    'removeClassFromForwardIndicator', 'addClassToBackIndicator', 'removeClassFromBackIndicator',
    'isRTL', 'registerBackIndicatorClickHandler', 'deregisterBackIndicatorClickHandler',
    'registerForwardIndicatorClickHandler', 'deregisterForwardIndicatorClickHandler',
    'registerCapturedInteractionHandler', 'deregisterCapturedInteractionHandler',
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
  td.verify(mockAdapter.registerCapturedInteractionHandler(isA(String), isA(Function)), {times: 3});
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
  td.verify(mockAdapter.deregisterCapturedInteractionHandler(isA(String), isA(Function)), {times: 3});
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
  const scrollFrameWidth = 600;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);
  for (let i = 0; i < numTabs; i++) {
    td.when(mockAdapter.getComputedLeftForTabAtIndex(i)).thenReturn(i * tabWidth);
    td.when(mockAdapter.getComputedWidthForTabAtIndex(i)).thenReturn(tabWidth);
  }
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(numTabs * tabWidth);
  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);

  foundation.scrollForward();
  raf.flush();
  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(-600px)'));
});

test('#scrollForward moves the tab bar forward if last tab is partially occluded', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const numTabs = 4;
  const tabWidth = 200;
  const scrollFrameWidth = 780;

  td.when(mockAdapter.getNumberOfTabs()).thenReturn(numTabs);
  for (let i = 0; i < numTabs; i++) {
    td.when(mockAdapter.getComputedLeftForTabAtIndex(i)).thenReturn(i * tabWidth);
    td.when(mockAdapter.getComputedWidthForTabAtIndex(i)).thenReturn(tabWidth);
  }
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(numTabs * tabWidth);
  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);

  foundation.scrollForward();
  raf.flush();
  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(-600px)'));
});

test('#scrollBack moves the tab bar back', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const numTabs = 4;
  const tabWidth = 200;
  const scrollFrameWidth = 600;

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

  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(-600px)'));
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
  const scrollFrameWidth = 750;

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

  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(600px)'));
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

test('focus event sets the scrollLeft property', () => {
  const {foundation, mockAdapter} = setupTest();
  const evtType = 'focus';
  const mockEvent = {
    type: 'focus',
    target: {
      classList: ['mdc-tab'],
    },
  };
  let tabEvent;

  td.when(mockAdapter.registerCapturedInteractionHandler(evtType, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      tabEvent = handler;
    });
  td.when(mockAdapter.eventTargetHasClass(td.matchers.anything(), td.matchers.anything())).thenReturn(true);
  td.when(mockAdapter.isRTL()).thenReturn(false);

  foundation.init();
  tabEvent(mockEvent);

  td.verify(mockAdapter.setScrollLeftForScrollFrame(td.matchers.isA(Number)));
});

test('focus scrolls back if right edge of tab is less than or equal to the current translate offset', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const evtType = 'focus';
  const mockEvent = {
    type: 'focus',
    target: {
      classList: ['mdc-tab'],
    },
  };
  let tabEvent;

  const tabWidth = 200;
  const scrollFrameWidth = 300;
  const evtTargetOffsetLeft = 0;

  td.when(mockAdapter.registerCapturedInteractionHandler(evtType, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      tabEvent = handler;
    });
  td.when(mockAdapter.eventTargetHasClass(td.matchers.anything(), td.matchers.anything())).thenReturn(true);
  td.when(mockAdapter.isRTL()).thenReturn(false);

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);
  td.when(mockAdapter.getOffsetLeftForEventTarget(td.matchers.anything())).thenReturn(evtTargetOffsetLeft);
  td.when(mockAdapter.getOffsetWidthForEventTarget(td.matchers.anything())).thenReturn(tabWidth);

  foundation.init();
  foundation.scrollForward();
  tabEvent(mockEvent);
  raf.flush();

  td.verify(mockAdapter.setTransformStyleForTabBar(td.matchers.anything()));
});

test('focus scrolls forward if right edge of tab is greater than the current translate offset' +
  'plus the scroll frame width', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const mockEvent = {
    type: 'focus',
    target: {
      classList: ['mdc-tab'],
    },
  };
  let tabEvent;

  const tabWidth = 200;
  const scrollFrameWidth = 300;
  const evtTargetOffsetLeft = 280;

  td.when(mockAdapter.registerCapturedInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evt, handler) => {
      tabEvent = handler;
    });
  td.when(mockAdapter.eventTargetHasClass(td.matchers.anything(), td.matchers.anything())).thenReturn(true);
  td.when(mockAdapter.isRTL()).thenReturn(false);

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);
  td.when(mockAdapter.getOffsetLeftForEventTarget(td.matchers.anything())).thenReturn(evtTargetOffsetLeft);
  td.when(mockAdapter.getOffsetWidthForEventTarget(td.matchers.anything())).thenReturn(tabWidth);

  foundation.init();
  tabEvent(mockEvent);
  raf.flush();

  td.verify(mockAdapter.setTransformStyleForTabBar(td.matchers.anything()));
});

test('mousedown does not move the tab bar if tab is only partially occluded', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const evtType = 'mousedown';
  const mockEvent = {
    type: 'mousedown',
    target: {
      classList: ['mdc-tab'],
    },
  };
  let tabEvent;

  const tabWidth = 200;
  const scrollFrameWidth = 300;
  const evtTargetOffsetLeft = 280;

  td.when(mockAdapter.registerCapturedInteractionHandler(evtType, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      tabEvent = handler;
    });
  td.when(mockAdapter.eventTargetHasClass(td.matchers.anything(), td.matchers.anything())).thenReturn(true);
  td.when(mockAdapter.isRTL()).thenReturn(false);

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);
  td.when(mockAdapter.getOffsetLeftForEventTarget(td.matchers.anything())).thenReturn(evtTargetOffsetLeft);
  td.when(mockAdapter.getOffsetWidthForEventTarget(td.matchers.anything())).thenReturn(tabWidth);

  foundation.init();
  tabEvent(mockEvent);
  raf.flush();

  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(0px)'));
});

test('touching does not move the tab bar if tab is only partially occluded', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const evtType = 'touchstart';
  const mockEvent = {
    type: 'touchstart',
    target: {
      classList: ['mdc-tab'],
    },
  };
  let tabEvent;

  const tabWidth = 200;
  const scrollFrameWidth = 300;
  const evtTargetOffsetLeft = 280;

  td.when(mockAdapter.registerCapturedInteractionHandler(evtType, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      tabEvent = handler;
    });
  td.when(mockAdapter.eventTargetHasClass(td.matchers.anything(), td.matchers.anything())).thenReturn(true);
  td.when(mockAdapter.isRTL()).thenReturn(false);

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);
  td.when(mockAdapter.getOffsetLeftForEventTarget(td.matchers.anything())).thenReturn(evtTargetOffsetLeft);
  td.when(mockAdapter.getOffsetWidthForEventTarget(td.matchers.anything())).thenReturn(tabWidth);

  foundation.init();
  tabEvent(mockEvent);
  raf.flush();

  td.verify(mockAdapter.setTransformStyleForTabBar('translateX(0px)'));
});

test('focus inRTL scrolls back if left edge of tab is greater than or equal to tab bar width minus the offset', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const evtType = 'focus';
  const mockEvent = {
    type: 'focus',
    target: {
      classList: ['mdc-tab'],
    },
  };
  let tabEvent;

  const tabWidth = 200;
  const scrollFrameWidth = 300;
  const evtTargetOffsetLeft = 900;
  const tabBarWidth = 900;

  td.when(mockAdapter.registerCapturedInteractionHandler(evtType, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      tabEvent = handler;
    });
  td.when(mockAdapter.eventTargetHasClass(td.matchers.anything(), td.matchers.anything())).thenReturn(true);
  td.when(mockAdapter.isRTL()).thenReturn(true);

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(tabBarWidth);
  td.when(mockAdapter.getOffsetLeftForEventTarget(td.matchers.anything())).thenReturn(evtTargetOffsetLeft);
  td.when(mockAdapter.getOffsetWidthForEventTarget(td.matchers.anything())).thenReturn(tabWidth);

  foundation.init();
  tabEvent(mockEvent);
  raf.flush();

  td.verify(mockAdapter.setTransformStyleForTabBar(td.matchers.anything()));
});

test('focus in RTL context scrolls forward if distance between the right edge of tab ' +
  'and the right edge of the tab bar is greater than or equal to the ' +
  'scroll frame width plus the translate offset', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const evtType = 'focus';
  const mockEvent = {
    type: 'focus',
    target: {
      classList: ['mdc-tab'],
    },
  };
  let tabEvent;

  const tabWidth = 200;
  const scrollFrameWidth = 300;
  const evtTargetOffsetLeft = 1000;
  const tabBarWidth = 900;

  td.when(mockAdapter.registerCapturedInteractionHandler(evtType, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      tabEvent = handler;
    });
  td.when(mockAdapter.eventTargetHasClass(td.matchers.anything(), td.matchers.anything())).thenReturn(true);
  td.when(mockAdapter.isRTL()).thenReturn(true);

  td.when(mockAdapter.getOffsetWidthForScrollFrame()).thenReturn(scrollFrameWidth);
  td.when(mockAdapter.getOffsetWidthForTabBar()).thenReturn(tabBarWidth);
  td.when(mockAdapter.getOffsetLeftForEventTarget(td.matchers.anything())).thenReturn(evtTargetOffsetLeft);
  td.when(mockAdapter.getOffsetWidthForEventTarget(td.matchers.anything())).thenReturn(tabWidth);

  foundation.init();
  tabEvent(mockEvent);
  raf.flush();

  td.verify(mockAdapter.setTransformStyleForTabBar(td.matchers.anything()));
});
