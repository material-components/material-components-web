/**
 * @license
 * Copyright 2019 Google Inc.
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

import {setUpFoundationTest} from '../../../testing/helpers/setup';
import {MDCTabBarFoundation} from '../foundation';

function setupTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCTabBarFoundation);
  return {foundation, mockAdapter};
}

describe('MDCTabBarFoundation', () => {
  it('exports cssClasses', () => {
    expect('cssClasses' in MDCTabBarFoundation).toBe(true);
  });

  it('exports strings', () => {
    expect('strings' in MDCTabBarFoundation).toBe(true);
  });

  it('exports numbers', () => {
    expect('numbers' in MDCTabBarFoundation).toBe(true);
  });

  const setupKeyDownTest = () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setUseAutomaticActivation(false);
    foundation.scrollIntoView = jasmine.createSpy(
        'scrollIntoView');  // Avoid errors due to adapters being stubs
    foundation.activateTab = jasmine.createSpy('activateTab');
    return {foundation, mockAdapter};
  };

  const mockKeyDownEvent =
      ({key, keyCode}: {key?: string, keyCode?: number}) => {
        const preventDefault = jasmine.createSpy('preventDefault');
        const fakeEvent = {
          key,
          keyCode,
          preventDefault,
        };

        return {preventDefault, fakeEvent};
      };

  it('#handleTabInteraction() activates the tab', () => {
    const {foundation, mockAdapter} = setupKeyDownTest();
    foundation.handleTabInteraction({detail: {}});
    expect(mockAdapter.setActiveTab).toHaveBeenCalled();
  });

  it('#handleKeyDown() focuses the tab at the 0th index on home key press',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.HOME_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 36});
       mockAdapter.getFocusedTabIndex.and.returnValue(2);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the N - 1 index on end key press',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.END_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 35});
       mockAdapter.getFocusedTabIndex.and.returnValue(2);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(12);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the previous index on left arrow press',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
       mockAdapter.getFocusedTabIndex.and.returnValue(2);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(1);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the next index when the right arrow key is pressed' +
         ' and the text direction is RTL',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
       mockAdapter.isRTL.and.returnValue(true);
       mockAdapter.getFocusedTabIndex.and.returnValue(2);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(3);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the N - 1 index when the left arrow key is pressed' +
         ' and the current active index is 0',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
       mockAdapter.getFocusedTabIndex.and.returnValue(0);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(12);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the N - 1 index when the right arrow key is pressed' +
         ' and the current active index is the 0th index and the text direction is RTL',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: 'ArrowRight'});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 39});
       mockAdapter.isRTL.and.returnValue(true);
       mockAdapter.getFocusedTabIndex.and.returnValue(0);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(12);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the next index when the right arrow key is pressed',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_RIGHT_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 39});
       mockAdapter.getFocusedTabIndex.and.returnValue(2);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(3);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the previous index when the right arrow key is pressed' +
         ' and the text direction is RTL',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_RIGHT_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 39});
       mockAdapter.isRTL.and.returnValue(true);
       mockAdapter.getFocusedTabIndex.and.returnValue(2);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(1);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the 0th index when the right arrow key is pressed' +
         ' and the current active index is the max index',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_RIGHT_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 39});
       mockAdapter.getFocusedTabIndex.and.returnValue(12);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() focuses the tab at the 0th index when the left arrow key is pressed' +
         ' and the current active index is the max index and the text direction is RTL',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
       mockAdapter.isRTL.and.returnValue(true);
       mockAdapter.getFocusedTabIndex.and.returnValue(12);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.focusTabAtIndex).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() activates the current focused tab on space/enter press w/o useAutomaticActivation',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const index = 2;
       mockAdapter.getFocusedTabIndex.and.returnValue(index);
       foundation.handleKeyDown(mockKeyDownEvent({
                                  key: MDCTabBarFoundation.strings.SPACE_KEY
                                }).fakeEvent);
       foundation.handleKeyDown(mockKeyDownEvent({keyCode: 32}).fakeEvent);
       foundation.handleKeyDown(mockKeyDownEvent({
                                  key: MDCTabBarFoundation.strings.ENTER_KEY
                                }).fakeEvent);
       foundation.handleKeyDown(mockKeyDownEvent({keyCode: 13}).fakeEvent);

       expect(mockAdapter.setActiveTab).toHaveBeenCalledWith(index);
       expect(mockAdapter.setActiveTab).toHaveBeenCalledTimes(4);
     });

  it('#handleKeyDown() does nothing on space/enter press w/ useAutomaticActivation',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       foundation.setUseAutomaticActivation(true);
       foundation.handleKeyDown(mockKeyDownEvent({
                                  key: MDCTabBarFoundation.strings.SPACE_KEY
                                }).fakeEvent);
       foundation.handleKeyDown(mockKeyDownEvent({keyCode: 32}).fakeEvent);
       foundation.handleKeyDown(mockKeyDownEvent({
                                  key: MDCTabBarFoundation.strings.ENTER_KEY
                                }).fakeEvent);
       foundation.handleKeyDown(mockKeyDownEvent({keyCode: 13}).fakeEvent);

       expect(mockAdapter.setActiveTab)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#handleKeyDown() activates the tab at the 0th index on home key press w/ useAutomaticActivation',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.HOME_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 36});
       foundation.setUseAutomaticActivation(true);

       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.setActiveTab).toHaveBeenCalledWith(0);
       expect(mockAdapter.setActiveTab).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() activates the tab at the N - 1 index on end key press w/ useAutomaticActivation',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.END_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 35});
       foundation.setUseAutomaticActivation(true);
       mockAdapter.getTabListLength.and.returnValue(13);

       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.setActiveTab).toHaveBeenCalledWith(12);
       expect(mockAdapter.setActiveTab).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() activates the tab at the previous index on left arrow press w/ useAutomaticActivation',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} =
           mockKeyDownEvent({key: MDCTabBarFoundation.strings.ARROW_LEFT_KEY});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 37});
       foundation.setUseAutomaticActivation(true);
       mockAdapter.getPreviousActiveTabIndex.and.returnValue(2);
       mockAdapter.getTabListLength.and.returnValue(13);

       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.setActiveTab).toHaveBeenCalledWith(1);
       expect(mockAdapter.setActiveTab).toHaveBeenCalledTimes(2);
     });

  it('#handleKeyDown() prevents the default behavior for handled non-activation keys',
     () => {
       [MDCTabBarFoundation.strings.ARROW_LEFT_KEY,
        MDCTabBarFoundation.strings.ARROW_RIGHT_KEY,
        MDCTabBarFoundation.strings.HOME_KEY,
        MDCTabBarFoundation.strings.END_KEY,
       ].forEach((evtName) => {
         const {foundation} = setupKeyDownTest();
         const {fakeEvent, preventDefault} = mockKeyDownEvent({key: evtName});
         foundation.handleKeyDown(fakeEvent);
         expect(preventDefault).toHaveBeenCalled();
       });
     });

  it('#handleKeyDown() does not prevent the default behavior for handled activation keys',
     () => {
       [MDCTabBarFoundation.strings.SPACE_KEY,
        MDCTabBarFoundation.strings.ENTER_KEY]
           .forEach((evtName) => {
             const {foundation} = setupKeyDownTest();
             const {fakeEvent, preventDefault} =
                 mockKeyDownEvent({key: evtName});
             foundation.handleKeyDown(fakeEvent);
             expect(preventDefault).not.toHaveBeenCalled();
           });
     });

  it('#handleKeyDown() prevents the default behavior for handled non-activation keyCodes',
     () => {
       [MDCTabBarFoundation.numbers.ARROW_LEFT_KEYCODE,
        MDCTabBarFoundation.numbers.ARROW_RIGHT_KEYCODE,
        MDCTabBarFoundation.numbers.HOME_KEYCODE,
        MDCTabBarFoundation.numbers.END_KEYCODE,
       ].forEach((keyCode) => {
         const {foundation} = setupKeyDownTest();
         const {fakeEvent, preventDefault} = mockKeyDownEvent({keyCode});
         foundation.handleKeyDown(fakeEvent);
         expect(preventDefault).toHaveBeenCalled();
       });
     });

  it('#handleKeyDown() prevents the default behavior for handled activation keyCodes',
     () => {
       [MDCTabBarFoundation.numbers.SPACE_KEYCODE,
        MDCTabBarFoundation.numbers.ENTER_KEYCODE]
           .forEach((keyCode) => {
             const {foundation} = setupKeyDownTest();
             const {fakeEvent, preventDefault} = mockKeyDownEvent({keyCode});
             foundation.handleKeyDown(fakeEvent);
             expect(preventDefault).not.toHaveBeenCalled();
           });
     });

  it('#handleKeyDown() does not prevent the default behavior for unhandled keys',
     () => {
       const {foundation} = setupKeyDownTest();
       const {fakeEvent, preventDefault} = mockKeyDownEvent({key: 'Shift'});
       foundation.handleKeyDown(fakeEvent);
       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeyDown() does not prevent the default behavior for unhandled keyCodes',
     () => {
       const {foundation} = setupKeyDownTest();
       const {fakeEvent, preventDefault} = mockKeyDownEvent({keyCode: 16});
       foundation.handleKeyDown(fakeEvent);
       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeyDown() does not activate a tab when an unhandled key is pressed',
     () => {
       const {foundation, mockAdapter} = setupKeyDownTest();
       const {fakeEvent: fakeKeyEvent} = mockKeyDownEvent({key: 'Shift'});
       const {fakeEvent: fakeKeyCodeEvent} = mockKeyDownEvent({keyCode: 16});
       foundation.handleKeyDown(fakeKeyEvent);
       foundation.handleKeyDown(fakeKeyCodeEvent);
       expect(mockAdapter.setActiveTab).not.toHaveBeenCalled();
     });

  const setupActivateTabTest = () => {
    const {foundation, mockAdapter} = setupTest();
    const scrollIntoView = jasmine.createSpy('');
    foundation.scrollIntoView = scrollIntoView;
    return {foundation, mockAdapter, scrollIntoView};
  };

  it('#activateTab() does nothing if the index overflows the tab list', () => {
    const {foundation, mockAdapter} = setupActivateTabTest();
    mockAdapter.getTabListLength.and.returnValue(13);
    foundation.activateTab(13);
    expect(mockAdapter.deactivateTabAtIndex)
        .not.toHaveBeenCalledWith(jasmine.any(Number));
    expect(mockAdapter.activateTabAtIndex)
        .not.toHaveBeenCalledWith(jasmine.any(Number));
  });

  it('#activateTab() does nothing if the index underflows the tab list', () => {
    const {foundation, mockAdapter} = setupActivateTabTest();
    mockAdapter.getTabListLength.and.returnValue(13);
    foundation.activateTab(-1);
    expect(mockAdapter.deactivateTabAtIndex)
        .not.toHaveBeenCalledWith(jasmine.any(Number));
    expect(mockAdapter.activateTabAtIndex)
        .not.toHaveBeenCalledWith(jasmine.any(Number));
  });

  it('#activateTab() does nothing if the index is the same as the previous active index',
     () => {
       const {foundation, mockAdapter} = setupActivateTabTest();
       mockAdapter.getPreviousActiveTabIndex.and.returnValue(0);
       mockAdapter.getTabListLength.and.returnValue(13);
       foundation.activateTab(0);
       expect(mockAdapter.deactivateTabAtIndex)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
       expect(mockAdapter.activateTabAtIndex)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it(`#activateTab() does not emit the ${
         MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT} event if the index` +
         ' is the currently active index',
     () => {
       const {foundation, mockAdapter} = setupActivateTabTest();
       mockAdapter.getTabListLength.and.returnValue(13);
       mockAdapter.getPreviousActiveTabIndex.and.returnValue(6);
       foundation.activateTab(6);
       expect(mockAdapter.notifyTabActivated)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#activateTab() deactivates the previously active tab', () => {
    const {foundation, mockAdapter} = setupActivateTabTest();
    mockAdapter.getTabListLength.and.returnValue(13);
    mockAdapter.getPreviousActiveTabIndex.and.returnValue(6);
    foundation.activateTab(1);
    expect(mockAdapter.deactivateTabAtIndex).toHaveBeenCalledWith(6);
  });

  it('#activateTab() does not deactivate the previously active tab if there is none',
     () => {
       const {foundation, mockAdapter} = setupActivateTabTest();
       mockAdapter.getTabListLength.and.returnValue(13);
       mockAdapter.getPreviousActiveTabIndex.and.returnValue(-1);
       foundation.activateTab(1);
       expect(mockAdapter.deactivateTabAtIndex)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#activateTab() activates the newly active tab with the previously active tab\'s indicatorClientRect',
     () => {
       const {foundation, mockAdapter} = setupActivateTabTest();
       mockAdapter.getTabListLength.and.returnValue(13);
       mockAdapter.getPreviousActiveTabIndex.and.returnValue(6);
       mockAdapter.getTabIndicatorClientRectAtIndex.and.returnValue({
         left: 22,
         right: 33,
       });
       foundation.activateTab(1);
       expect(mockAdapter.activateTabAtIndex)
           .toHaveBeenCalledWith(1, {left: 22, right: 33});
     });

  it('#activateTab() scrolls the new tab index into view', () => {
    const {foundation, mockAdapter, scrollIntoView} = setupActivateTabTest();
    mockAdapter.getTabListLength.and.returnValue(13);
    mockAdapter.getPreviousActiveTabIndex.and.returnValue(6);
    mockAdapter.getTabIndicatorClientRectAtIndex.and.returnValue({
      left: 22,
      right: 33,
    });
    foundation.activateTab(1);
    expect(scrollIntoView).toHaveBeenCalledWith(1);
  });

  it(`#activateTab() emits the ${
         MDCTabBarFoundation.strings
             .TAB_ACTIVATED_EVENT} with the index of the tab`,
     () => {
       const {foundation, mockAdapter} = setupActivateTabTest();
       mockAdapter.getTabListLength.and.returnValue(13);
       mockAdapter.getPreviousActiveTabIndex.and.returnValue(6);
       mockAdapter.getTabIndicatorClientRectAtIndex.and.returnValue({
         left: 22,
         right: 33,
       });
       foundation.activateTab(1);
       expect(mockAdapter.notifyTabActivated).toHaveBeenCalledWith(1);
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
    mockAdapter.getPreviousActiveTabIndex.and.returnValue(activeIndex);
    mockAdapter.getTabListLength.and.returnValue(tabListLength);
    mockAdapter.getTabIndicatorClientRectAtIndex.withArgs(jasmine.any(Number))
        .and.returnValue(indicatorClientRect);
    mockAdapter.getScrollPosition.and.returnValue(scrollPosition);
    mockAdapter.getScrollContentWidth.and.returnValue(scrollContentWidth);
    mockAdapter.getOffsetWidth.and.returnValue(offsetWidth);
    mockAdapter.getTabDimensionsAtIndex.withArgs(jasmine.any(Number))
        .and.callFake((index: number) => {
          return (tabDimensionsMap as any)[index];
        });

    return {foundation, mockAdapter};
  }

  it('#scrollIntoView() does nothing if the index overflows the tab list',
     () => {
       const {foundation, mockAdapter} = setupScrollIntoViewTest({
         tabListLength: 13,
       });
       foundation.scrollIntoView(13);
       expect(mockAdapter.scrollTo)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
       expect(mockAdapter.incrementScroll)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#scrollIntoView() does nothing if the index underflows the tab list',
     () => {
       const {foundation, mockAdapter} = setupScrollIntoViewTest({
         tabListLength: 9,
       });
       foundation.scrollIntoView(-1);
       expect(mockAdapter.scrollTo)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
       expect(mockAdapter.incrementScroll)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#scrollIntoView() scrolls to 0 if the index is 0', () => {
    const {foundation, mockAdapter} = setupScrollIntoViewTest({
      tabListLength: 9,
    });
    foundation.scrollIntoView(0);
    expect(mockAdapter.scrollTo).toHaveBeenCalledWith(0);
  });

  it('#scrollIntoView() scrolls to the scroll content width if the index is the max possible',
     () => {
       const {foundation, mockAdapter} = setupScrollIntoViewTest({
         tabListLength: 9,
         scrollContentWidth: 987,
       });
       foundation.scrollIntoView(8);
       expect(mockAdapter.scrollTo).toHaveBeenCalledWith(987);
     });

  it('#scrollIntoView() increments the scroll by 150 when the selected tab is 100px to the right' +
         ' and the closest tab\'s left content edge is 30px from its left root edge',
     () => {
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
       expect(mockAdapter.incrementScroll)
           .toHaveBeenCalledWith(
               130 + MDCTabBarFoundation.numbers.EXTRA_SCROLL_AMOUNT);
     });

  it('#scrollIntoView() increments the scroll by 250 when the selected tab is 100px to the left, is 100px wide,' +
         ' and the closest tab\'s left content edge is 30px from its left root edge and the text direction is RTL',
     () => {
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
       mockAdapter.isRTL.and.returnValue(true);
       foundation.scrollIntoView(4);
       expect(mockAdapter.incrementScroll)
           .toHaveBeenCalledWith(
               230 + MDCTabBarFoundation.numbers.EXTRA_SCROLL_AMOUNT);
     });

  it('#scrollIntoView() increments the scroll by -250 when the selected tab is 100px to the left, is 100px wide,' +
         ' and the closest tab\'s right content edge is 30px from its right root edge',
     () => {
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
       expect(mockAdapter.incrementScroll)
           .toHaveBeenCalledWith(
               -230 - MDCTabBarFoundation.numbers.EXTRA_SCROLL_AMOUNT);
     });

  it('#scrollIntoView() increments the scroll by -150 when the selected tab is 100px wide,' +
         ' and the closest tab\'s right content edge is 30px from its right root edge and the text direction is RTL',
     () => {
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
       mockAdapter.isRTL.and.returnValue(true);
       foundation.scrollIntoView(2);
       expect(mockAdapter.incrementScroll)
           .toHaveBeenCalledWith(
               -130 - MDCTabBarFoundation.numbers.EXTRA_SCROLL_AMOUNT);
     });

  it('#scrollIntoView() does nothing when the tab is perfectly in the center',
     () => {
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
       expect(mockAdapter.scrollTo)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
       expect(mockAdapter.incrementScroll)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#scrollIntoView() does nothing when the tab is perfectly in the center and the text direction is RTL',
     () => {
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
       mockAdapter.isRTL.and.returnValue(true);
       foundation.scrollIntoView(7);
       expect(mockAdapter.scrollTo)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
       expect(mockAdapter.incrementScroll)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#scrollIntoView() increments the scroll by 0 when the tab and its left neighbor\'s content are visible',
     () => {
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
       expect(mockAdapter.incrementScroll).toHaveBeenCalledWith(0);
     });

  it('#scrollIntoView() increments the scroll by 0 when the tab and its right neighbor\'s content are visible',
     () => {
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
       expect(mockAdapter.incrementScroll).toHaveBeenCalledWith(0);
     });
});
