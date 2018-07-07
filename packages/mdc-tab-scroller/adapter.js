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

/** @typedef {{scrollX: number, translateX: number}} */
let MDCTabScrollerAnimation;

/** @typedef {{left: number, right: number}} */
let MDCTabScrollerEdges;

/**
 * Adapter for MDC Tab Scroller.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Tab  into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTabScrollerAdapter {
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
   * Returns whether the event target matches given className.
   * @param {EventTarget} evtTarget The event target
   * @param {string} selector The selector to check
   * @return {boolean}
   */
  eventTargetMatchesSelector(evtTarget, selector) {}

  /**
   * Sets a style property of the content element to the passed value.
   * @param {string} propName The style property name to set
   * @param {string} value The style property value
   */
  setScrollContentStyleProperty(propName, value) {}

  /**
   * Returns the scroll content element's computed style value of the given css property `propertyName`.
   * We achieve this via `getComputedStyle(...).getPropertyValue(propertyName)`.
   * @param {string} propertyName
   * @return {string}
   */
  getScrollContentStyleValue(propertyName) {}

  /**
   * Sets the scrollLeft value of the scroll area element to the passed value.
   * @param {number} scrollLeft The new scrollLeft value
   */
  setScrollAreaScrollLeft(scrollLeft) {}

  /**
   * Returns the scrollLeft value of the scroll area element.
   * @return {number}
   */
  getScrollAreaScrollLeft() {}

  /**
   * Returns the offsetWidth of the scroll content element.
   * @return {number}
   */
  getScrollContentOffsetWidth() {}

  /**
   * Returns the offsetWitdth of the scroll area element.
   * @return {number}
   */
  getScrollAreaOffsetWidth() {}

  /**
   * Returns the bounding client rect of the scroll area element.
   * @return {!ClientRect}
   */
  computeScrollAreaClientRect() {}

  /**
   * Returns the bounding client rect of the scroll content element.
   * @return {!ClientRect}
   */
  computeScrollContentClientRect() {}
}

export {MDCTabScrollerAnimation, MDCTabScrollerEdges, MDCTabScrollerAdapter};
