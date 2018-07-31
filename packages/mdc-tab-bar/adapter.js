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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/* eslint-disable no-unused-vars */
import {MDCTabDimensions} from '@material/tab/adapter';
import {MDCTab} from '@material/tab/index';
/* eslint-enable no-unused-vars */

/**
 * Adapter for MDC Tab Bar.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Tab Bar into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTabBarAdapter {
  /**
   * Scrolls to the given position
   * @param {number} scrollX The position to scroll to
   */
  scrollTo(scrollX) {}

  /**
   * Increments the current scroll position by the given amount
   * @param {number} scrollXIncrement The amount to increment scroll
   */
  incrementScroll(scrollXIncrement) {}

  /**
   * Returns the current scroll position
   * @return {number}
   */
  getScrollPosition() {}

  /**
   * Returns the width of the scroll content
   * @return {number}
   */
  getScrollContentWidth() {}

  /**
   * Returns the root element's offsetWidth
   * @return {number}
   */
  getOffsetWidth() {}

  /**
   * Returns if the Tab Bar language direction is RTL
   * @return {boolean}
   */
  isRTL() {}

  /**
   * Activates the tab at the given index with the given client rect
   * @param {number} index The index of the tab to activate
   * @param {!ClientRect} clientRect The client rect of the previously active Tab Indicator
   */
  activateTabAtIndex(index, clientRect) {}

  /**
   * Deactivates the tab at the given index
   * @param {number} index The index of the tab to activate
   */
  deactivateTabAtIndex(index) {}

  /**
   * Returns the client rect of the tab's indicator
   * @param {number} index The index of the tab
   * @return {!ClientRect}
   */
  getTabIndicatorClientRectAtIndex(index) {}

  /**
   * Returns the tab dimensions of the tab at the given index
   * @param {number} index The index of the tab
   * @return {!MDCTabDimensions}
   */
  getTabDimensionsAtIndex(index) {}

  /**
   * Returns the length of the tab list
   * @return {number}
   */
  getTabListLength() {}

  /**
   * Returns the index of the active tab
   * @return {number}
   */
  getActiveTabIndex() {}

  /**
   * Returns the index of the given tab
   * @param {!MDCTab} tab The tab whose index to determin
   * @return {number}
   */
  getIndexOfTab(tab) {}

  /**
   * Emits the MDCTabBar:activated event
   * @param {number} index The index of the activated tab
   */
  notifyTabActivated(index) {}
}

export default MDCTabBarAdapter;
