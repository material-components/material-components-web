/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Drawer
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Drawer into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCDrawerAdapter {
  /**
   * Adds a class to the root Element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root Element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns true if the root Element contains the given class.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * @param {!Element} element target element to verify class name
   * @param {string} className class name
   */
  elementHasClass(element, className) {}

  /** @return {!ClientRect} */
  computeBoundingRect() {}

  /**
   * Saves the focus of currently active element.
   */
  saveFocus() {}

  /**
   * Restores focus to element previously saved with 'saveFocus'.
   */
  restoreFocus() {}

  /**
   * Focuses the active / selected navigation item.
   */
  focusActiveNavigationItem() {}

  /**
   * Emits a custom event "MDCDrawer:close" denoting the drawer has closed.
   */
  notifyClose() {}

  /**
   * Emits a custom event "MDCDrawer:open" denoting the drawer has opened.
   */
  notifyOpen() {}
}

export default MDCDrawerAdapter;
