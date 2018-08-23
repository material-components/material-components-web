/**
 * @license
 * Copyright 2018 Google Inc.
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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTabBarFoundation from '../../../packages/mdc-tab-bar/foundation';

suite('MDCTabBarFoundation');

test('exports cssClasses', () => {
  assert.isTrue('cssClasses' in MDCTabBarFoundation);
});

test('exports strings', () => {
  assert.isTrue('strings' in MDCTabBarFoundation);
});

test('exports numbers', () => {
  assert.isTrue('numbers' in MDCTabBarFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabBarFoundation, [
    'scrollTo', 'incrementScroll', 'getScrollPosition', 'getScrollContentWidth',
    'getOffsetWidth', 'isRTL', 'setActiveTab',
    'activateTabAtIndex', 'deactivateTabAtIndex', 'focusTabAtIndex',
    'getTabIndicatorClientRectAtIndex', 'getTabDimensionsAtIndex',
    'getPreviousActiveTabIndex', 'getFocusedTabIndex', 'getIndexOfTab', 'getTabListLength',
    'notifyTabActivated',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabBarFoundation);

const setupKeyDownTest = () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setUseAutomaticActivation(false);
  foundation.scrollIntoView = td.function(); // Avoid errors due to adapters being stubs
  foundation.activateTab = td.function();
  return {foundation, mockAdapter};
};

const mockKeyDownEvent = ({key, keyCode}) => {
  const preventDefault = td.function();
  const fakeEvent = {
    key,
    keyCode,
    preventDefault,
  };

  return {preventDefault, fakeEvent};
};

test('#handleTabInteraction() activates the tab', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  foundation.handleTabInteraction({detail: {}});
  td.verify(mockAdapter.setActiveTab(td.matchers.anything()), {times: 1});
});

test('#handleKeyDown() focuses the tab at the 0th index on home key press', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.HOME_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 36});
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(2);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(0), {times: 2});
});

test('#handleKeyDown() focuses the tab at the N - 1 index on end key press', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.END_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 35});
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(2);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(12), {times: 2});
});

test('#handleKeyDown() focuses the tab at the previous index on left arrow press', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(2);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(1), {times: 2});
});

test('#handleKeyDown() focuses the tab at the next index when the right arrow key is pressed'
  + ' and the text direction is RTL', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(2);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(3), {times: 2});
});

test('#handleKeyDown() focuses the tab at the N - 1 index when the left arrow key is pressed'
  + ' and the current active index is 0', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(0);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(12), {times: 2});
});

test('#handleKeyDown() focuses the tab at the N - 1 index when the right arrow key is pressed'
  + ' and the current active index is the 0th index and the text direction is RTL', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: 'ArrowRight'});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 39});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(0);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(12), {times: 2});
});

test('#handleKeyDown() focuses the tab at the next index when the right arrow key is pressed', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_RIGHT_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 39});
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(2);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(3), {times: 2});
});

test('#handleKeyDown() focuses the tab at the previous index when the right arrow key is pressed'
  + ' and the text direction is RTL', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_RIGHT_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 39});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(2);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(1), {times: 2});
});

test('#handleKeyDown() focuses the tab at the 0th index when the right arrow key is pressed'
  + ' and the current active index is the max index', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_RIGHT_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 39});
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(12);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(0), {times: 2});
});

test('#handleKeyDown() focuses the tab at the 0th index when the left arrow key is pressed'
  + ' and the current active index is the max index and the text direction is RTL', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(12);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.focusTabAtIndex(0), {times: 2});
});

test('#handleKeyDown() activates the current focused tab on space/enter press w/o useAutomaticActivation', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const index = 2;
  td.when(mockAdapter.getFocusedTabIndex()).thenReturn(index);
  foundation.handleKeyDown(mockKeyDownEvent({key: MDCTabBarFoundation.strings.SPACE_KEY}).fakeEvent);
  foundation.handleKeyDown(mockKeyDownEvent({keyCode: 32}).fakeEvent);
  foundation.handleKeyDown(mockKeyDownEvent({key: MDCTabBarFoundation.strings.ENTER_KEY}).fakeEvent);
  foundation.handleKeyDown(mockKeyDownEvent({keyCode: 13}).fakeEvent);

  td.verify(mockAdapter.setActiveTab(index), {times: 4});
});

test('#handleKeyDown() does nothing on space/enter press w/ useAutomaticActivation', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  foundation.setUseAutomaticActivation(true);
  foundation.handleKeyDown(mockKeyDownEvent({key: MDCTabBarFoundation.strings.SPACE_KEY}).fakeEvent);
  foundation.handleKeyDown(mockKeyDownEvent({keyCode: 32}).fakeEvent);
  foundation.handleKeyDown(mockKeyDownEvent({key: MDCTabBarFoundation.strings.ENTER_KEY}).fakeEvent);
  foundation.handleKeyDown(mockKeyDownEvent({keyCode: 13}).fakeEvent);

  td.verify(mockAdapter.setActiveTab(td.matchers.anything()), {times: 0});
});

test('#handleKeyDown() activates the tab at the 0th index on home key press w/ useAutomaticActivation', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.HOME_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 36});
  foundation.setUseAutomaticActivation(true);

  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.setActiveTab(0), {times: 2});
});

test('#handleKeyDown() activates the tab at the N - 1 index on end key press w/ useAutomaticActivation', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.END_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 35});
  foundation.setUseAutomaticActivation(true);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);

  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.setActiveTab(12), {times: 2});
});

test('#handleKeyDown() activates the tab at the previous index on left arrow press w/ useAutomaticActivation', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
  foundation.setUseAutomaticActivation(true);
  td.when(mockAdapter.getPreviousActiveTabIndex()).thenReturn(2);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);

  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.setActiveTab(1), {times: 2});
});

test('#handleKeyDown() prevents the default behavior for handled non-activation keys', () => {
  [
    MDCTabBarFoundation.strings.ARROW_LEFT_KEY,
    MDCTabBarFoundation.strings.ARROW_RIGHT_KEY,
    MDCTabBarFoundation.strings.HOME_KEY,
    MDCTabBarFoundation.strings.END_KEY,
  ].forEach((evtName) => {
    const {foundation} = setupKeyDownTest();
    const {fakeEvent, preventDefault} = mockKeyDownEvent({key: evtName});
    foundation.handleKeyDown(fakeEvent);
    td.verify(preventDefault());
  });
});

test('#handleKeyDown() does not prevent the default behavior for handled activation keys', () => {
  [MDCTabBarFoundation.strings.SPACE_KEY, MDCTabBarFoundation.strings.ENTER_KEY].forEach((evtName) => {
    const {foundation} = setupKeyDownTest();
    const {fakeEvent, preventDefault} = mockKeyDownEvent({key: evtName});
    foundation.handleKeyDown(fakeEvent);
    td.verify(preventDefault(), {times: 0});
  });
});

test('#handleKeyDown() prevents the default behavior for handled non-activation keyCodes', () => {
  [
    MDCTabBarFoundation.numbers.ARROW_LEFT_KEYCODE,
    MDCTabBarFoundation.numbers.ARROW_RIGHT_KEYCODE,
    MDCTabBarFoundation.numbers.HOME_KEYCODE,
    MDCTabBarFoundation.numbers.END_KEYCODE,
  ].forEach((keyCode) => {
    const {foundation} = setupKeyDownTest();
    const {fakeEvent, preventDefault} = mockKeyDownEvent({keyCode});
    foundation.handleKeyDown(fakeEvent);
    td.verify(preventDefault());
  });
});

test('#handleKeyDown() prevents the default behavior for handled activation keyCodes', () => {
  [MDCTabBarFoundation.numbers.SPACE_KEYCODE, MDCTabBarFoundation.numbers.ENTER_KEYCODE].forEach((keyCode) => {
    const {foundation} = setupKeyDownTest();
    const {fakeEvent, preventDefault} = mockKeyDownEvent({keyCode});
    foundation.handleKeyDown(fakeEvent);
    td.verify(preventDefault(), {times: 0});
  });
});

test('#handleKeyDown() does not prevent the default behavior for unhandled keys', () => {
  const {foundation} = setupKeyDownTest();
  const {fakeEvent, preventDefault} = mockKeyDownEvent({key: 'Shift'});
  foundation.handleKeyDown(fakeEvent);
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeyDown() does not prevent the default behavior for unhandled keyCodes', () => {
  const {foundation} = setupKeyDownTest();
  const {fakeEvent, preventDefault} = mockKeyDownEvent({keyCode: 16});
  foundation.handleKeyDown(fakeEvent);
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeyDown() does not activate a tab when an unhandled key is pressed', () => {
  const {foundation, mockAdapter} = setupKeyDownTest();
  const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: 'Shift'});
  const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 16});
  foundation.handleKeyDown(fakeKeyEvent);
  foundation.handleKeyDown(fakeKeyCodeEvent);
  td.verify(mockAdapter.setActiveTab(), {times: 0});
});

const setupActivateTabTest = () => {
  const {foundation, mockAdapter} = setupTest();
  const scrollIntoView = td.function();
  foundation.scrollIntoView = scrollIntoView;
  return {foundation, mockAdapter, scrollIntoView};
};

test('#activateTab() does nothing if the index overflows the tab list', () => {
  const {foundation, mockAdapter} = setupActivateTabTest();
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.activateTab(13);
  td.verify(mockAdapter.deactivateTabAtIndex(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.activateTabAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#activateTab() does nothing if the index underflows the tab list', () => {
  const {foundation, mockAdapter} = setupActivateTabTest();
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.activateTab(-1);
  td.verify(mockAdapter.deactivateTabAtIndex(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.activateTabAtIndex(td.matchers.isA(Number)), {times: 0});
});

test('#activateTab() does nothing if the index is the same as the previous active index', () => {
  const {foundation, mockAdapter} = setupActivateTabTest();
  td.when(mockAdapter.getPreviousActiveTabIndex()).thenReturn(0);
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  foundation.activateTab(0);
  td.verify(mockAdapter.deactivateTabAtIndex(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.activateTabAtIndex(td.matchers.isA(Number)), {times: 0});
});

test(`#activateTab() does not emit the ${MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT} event if the index` +
  ' is the currently active index', () => {
  const {foundation, mockAdapter} = setupActivateTabTest();
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  td.when(mockAdapter.getPreviousActiveTabIndex()).thenReturn(6);
  foundation.activateTab(6);
  td.verify(mockAdapter.notifyTabActivated(td.matchers.anything()), {times: 0});
});

test('#activateTab() deactivates the previously active tab', () => {
  const {foundation, mockAdapter} = setupActivateTabTest();
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  td.when(mockAdapter.getPreviousActiveTabIndex()).thenReturn(6);
  foundation.activateTab(1);
  td.verify(mockAdapter.deactivateTabAtIndex(6), {times: 1});
});

test('#activateTab() activates the newly active tab with the previously active tab\'s indicatorClientRect', () => {
  const {foundation, mockAdapter} = setupActivateTabTest();
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  td.when(mockAdapter.getPreviousActiveTabIndex()).thenReturn(6);
  td.when(mockAdapter.getTabIndicatorClientRectAtIndex(6)).thenReturn({
    left: 22, right: 33,
  });
  foundation.activateTab(1);
  td.verify(mockAdapter.activateTabAtIndex(1, {left: 22, right: 33}), {times: 1});
});

test('#activateTab() scrolls the new tab index into view', () => {
  const {foundation, mockAdapter, scrollIntoView} = setupActivateTabTest();
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  td.when(mockAdapter.getPreviousActiveTabIndex()).thenReturn(6);
  td.when(mockAdapter.getTabIndicatorClientRectAtIndex(6)).thenReturn({
    left: 22, right: 33,
  });
  foundation.activateTab(1);
  td.verify(scrollIntoView(1));
});

test(`#activateTab() emits the ${MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT} with the index of the tab`, () => {
  const {foundation, mockAdapter} = setupActivateTabTest();
  td.when(mockAdapter.getTabListLength()).thenReturn(13);
  td.when(mockAdapter.getPreviousActiveTabIndex()).thenReturn(6);
  td.when(mockAdapter.getTabIndicatorClientRectAtIndex(6)).thenReturn({
    left: 22, right: 33,
  });
  foundation.activateTab(1);
  td.verify(mockAdapter.notifyTabActivated(1));
});

function setupScrollIntoViewTest({
  activeIndex = 0,
  tabListLength = 10,
  indicatorClientRect = {},
  scrollContentWidth = 1000,
  scrollPosition = 0,
  offsetWidth = 400,
  tabDimensionsMap = {},
} = {}) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getPreviousActiveTabIndex()).thenReturn(activeIndex);
  td.when(mockAdapter.getTabListLength()).thenReturn(tabListLength);
  td.when(mockAdapter.getTabIndicatorClientRectAtIndex(td.matchers.isA(Number))).thenReturn(indicatorClientRect);
  td.when(mockAdapter.getScrollPosition()).thenReturn(scrollPosition);
  td.when(mockAdapter.getScrollContentWidth()).thenReturn(scrollContentWidth);
  td.when(mockAdapter.getOffsetWidth()).thenReturn(offsetWidth);
  td.when(mockAdapter.getTabDimensionsAtIndex(td.matchers.isA(Number))).thenDo((index) => {
    return tabDimensionsMap[index];
  });

  return {foundation, mockAdapter};
}

test('#scrollIntoView() does nothing if the index overflows the tab list', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    tabListLength: 13,
  });
  foundation.scrollIntoView(13);
  td.verify(mockAdapter.scrollTo(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.incrementScroll(td.matchers.isA(Number)), {times: 0});
});

test('#scrollIntoView() does nothing if the index underflows the tab list', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    tabListLength: 9,
  });
  foundation.scrollIntoView(-1);
  td.verify(mockAdapter.scrollTo(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.incrementScroll(td.matchers.isA(Number)), {times: 0});
});

test('#scrollIntoView() scrolls to 0 if the index is 0', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    tabListLength: 9,
  });
  foundation.scrollIntoView(0);
  td.verify(mockAdapter.scrollTo(0), {times: 1});
});

test('#scrollIntoView() scrolls to the scroll content width if the index is the max possible', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    tabListLength: 9,
    scrollContentWidth: 987,
  });
  foundation.scrollIntoView(8);
  td.verify(mockAdapter.scrollTo(987), {times: 1});
});

test('#scrollIntoView() increments the scroll by 150 when the selected tab is 100px to the right'
  + ' and the closest tab\'s left content edge is 30px from its left root edge', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    activeIndex: 0,
    tabListLength: 9,
    scrollContentWidth: 1000,
    offsetWidth: 200,
    tabDimensionsMap: {
      1: {
        rootLeft: 0,
        rootRight: 300,
      },
      2: {
        rootLeft: 300,
        contentLeft: 330,
        contentRight: 370,
        rootRight: 400,
      },
    },
  });
  foundation.scrollIntoView(1);
  td.verify(mockAdapter.incrementScroll(130 + MDCTabBarFoundation.numbers.EXTRA_SCROLL_AMOUNT), {times: 1});
});

test('#scrollIntoView() increments the scroll by 250 when the selected tab is 100px to the left, is 100px wide,'
  + ' and the closest tab\'s left content edge is 30px from its left root edge and the text direction is RTL', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    activeIndex: 0,
    tabListLength: 9,
    scrollContentWidth: 1000,
    offsetWidth: 200,
    scrollPosition: 100,
    tabDimensionsMap: {
      5: {
        rootLeft: 400,
        contentLeft: 430,
        contentRight: 470,
        rootRight: 500,
      },
      4: {
        rootLeft: 500,
        rootRight: 600,
      },
    },
  });
  td.when(mockAdapter.isRTL()).thenReturn(true);
  foundation.scrollIntoView(4);
  td.verify(mockAdapter.incrementScroll(230 + MDCTabBarFoundation.numbers.EXTRA_SCROLL_AMOUNT), {times: 1});
});

test('#scrollIntoView() increments the scroll by -250 when the selected tab is 100px to the left, is 100px wide,'
  + ' and the closest tab\'s right content edge is 30px from its right root edge', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    activeIndex: 3,
    tabListLength: 9,
    scrollContentWidth: 1000,
    scrollPosition: 500,
    offsetWidth: 200,
    tabDimensionsMap: {
      1: {
        rootLeft: 190,
        contentLeft: 220,
        contentRight: 270,
        rootRight: 300,
      },
      2: {
        rootLeft: 300,
        contentLeft: 330,
        contentRight: 370,
        rootRight: 400,
      },
    },
  });
  foundation.scrollIntoView(2);
  td.verify(mockAdapter.incrementScroll(-230 - MDCTabBarFoundation.numbers.EXTRA_SCROLL_AMOUNT), {times: 1});
});

test('#scrollIntoView() increments the scroll by -150 when the selected tab is 100px wide,'
  + ' and the closest tab\'s right content edge is 30px from its right root edge and the text direction is RTL', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    activeIndex: 3,
    tabListLength: 9,
    scrollContentWidth: 1000,
    scrollPosition: 300,
    offsetWidth: 200,
    tabDimensionsMap: {
      2: {
        rootLeft: 700,
        contentLeft: 730,
        contentRight: 770,
        rootRight: 800,
      },
      1: {
        rootLeft: 800,
        contentLeft: 830,
        contentRight: 870,
        rootRight: 900,
      },
    },
  });
  td.when(mockAdapter.isRTL()).thenReturn(true);
  foundation.scrollIntoView(2);
  td.verify(mockAdapter.incrementScroll(-130 - MDCTabBarFoundation.numbers.EXTRA_SCROLL_AMOUNT), {times: 1});
});

test('#scrollIntoView() does nothing when the tab is perfectly in the center', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    activeIndex: 3,
    tabListLength: 9,
    scrollContentWidth: 1000,
    scrollPosition: 200,
    offsetWidth: 300,
    tabDimensionsMap: {
      1: {
        rootLeft: 200,
        contentLeft: 230,
        contentRight: 270,
        rootRight: 300,
      },
      2: {
        rootLeft: 300,
        contentLeft: 330,
        contentRight: 370,
        rootRight: 400,
      },
    },
  });

  foundation.scrollIntoView(2);
  td.verify(mockAdapter.scrollTo(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.incrementScroll(td.matchers.isA(Number)), {times: 0});
});

test('#scrollIntoView() does nothing when the tab is perfectly in the center and the text direction is RTL', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    activeIndex: 3,
    tabListLength: 10,
    scrollContentWidth: 1000,
    scrollPosition: 500,
    offsetWidth: 300,
    tabDimensionsMap: {
      8: {
        rootLeft: 200,
        contentLeft: 230,
        contentRight: 270,
        rootRight: 300,
      },
      7: {
        rootLeft: 300,
        contentLeft: 330,
        contentRight: 370,
        rootRight: 400,
      },
    },
  });
  td.when(mockAdapter.isRTL()).thenReturn(true);
  foundation.scrollIntoView(7);
  td.verify(mockAdapter.scrollTo(td.matchers.isA(Number)), {times: 0});
  td.verify(mockAdapter.incrementScroll(td.matchers.isA(Number)), {times: 0});
});

test('#scrollIntoView() increments the scroll by 0 when the tab and its left neighbor\'s content are visible', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    activeIndex: 3,
    tabListLength: 9,
    scrollContentWidth: 1000,
    scrollPosition: 200,
    offsetWidth: 500,
    tabDimensionsMap: {
      1: {
        rootLeft: 200,
        contentLeft: 230,
        contentRight: 270,
        rootRight: 300,
      },
      2: {
        rootLeft: 300,
        contentLeft: 330,
        contentRight: 370,
        rootRight: 400,
      },
    },
  });

  foundation.scrollIntoView(2);
  td.verify(mockAdapter.incrementScroll(0), {times: 1});
});

test('#scrollIntoView() increments the scroll by 0 when the tab and its right neighbor\'s content are visible', () => {
  const {foundation, mockAdapter} = setupScrollIntoViewTest({
    activeIndex: 3,
    tabListLength: 9,
    scrollContentWidth: 1000,
    scrollPosition: 22,
    offsetWidth: 400,
    tabDimensionsMap: {
      1: {
        rootLeft: 200,
        contentLeft: 230,
        contentRight: 270,
        rootRight: 300,
      },
      2: {
        rootLeft: 300,
        contentLeft: 330,
        contentRight: 370,
        rootRight: 400,
      },
    },
  });

  foundation.scrollIntoView(1);
  td.verify(mockAdapter.incrementScroll(0), {times: 1});
});
