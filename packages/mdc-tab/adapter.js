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
 * MDCTabDimensions provides details about the left and right edges of the Tab
 * root element and the Tab content element. These values are used to determine
 * the visual position of the Tab with respect it's parent container.
 * @typedef {{rootLeft: number, rootRight: number, contentLeft: number, contentRight: number}}
 */
let MDCTabDimensions;

/**
 * Adapter for MDC Tab.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Tab  into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTabAdapter {
  /**
   * Registers an event listener on the root element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerEventHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the root element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterEventHandler(evtType, handler) {}

  /**
   * Adds the given className to the root element.
   * @param {string} className The className to add
   */
  addClass(className) {}

  /**
   * Removes the given className from the root element.
   * @param {string} className The className to remove
   */
  removeClass(className) {}

  /**
   * Returns whether the root element has the given className.
   * @param {string} className The className to remove
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Sets the given attrName of the root element to the given value.
   * @param {string} attr The attribute name to set
   * @param {string} value The value so give the attribute
   */
  setAttr(attr, value) {}

  /**
   * Activates the indicator element.
   * @param {!ClientRect=} previousIndicatorClientRect The client rect of the previously activated indicator
   */
  activateIndicator(previousIndicatorClientRect) {}

  /** Deactivates the indicator. */
  deactivateIndicator() {}

  /**
   * Returns the client rect of the indicator.
   * @return {!ClientRect}
   */
  computeIndicatorClientRect() {}

  /**
   * Emits the MDCTab:interacted event for use by parent components
   */
  notifyInteracted() {}

  /**
   * Returns the offsetLeft value of the root element.
   * @return {number}
   */
  getOffsetLeft() {}

  /**
   * Returns the offsetWidth value of the root element.
   * @return {number}
   */
  getOffsetWidth() {}

  /**
   * Returns the offsetLeft of the content element.
   * @return {number}
   */
  getContentOffsetLeft() {}

  /**
   * Returns the offsetWidth of the content element.
   * @return {number}
   */
  getContentOffsetWidth() {}

  /**
   * Applies focus to the root element
   */
  focus() {}
}

export {MDCTabDimensions, MDCTabAdapter};
