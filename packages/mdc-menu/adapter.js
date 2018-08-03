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
 * Adapter for MDC Menu. Provides an interface for managing
 * - selected element classes
 * - get focused elements
 * - toggling a checkbox inside a list item
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 *
 * @record
 */
class MDCMenuAdapter {
  /**
   * Adds a class to the element at the index provided.
   * @param {number} index
   * @param {string} className
   */
  addClassToElementAtIndex(index, className) {}

  /**
   * Removes a class from the element at the index provided
   * @param {number} index
   * @param {string} className
   */
  removeClassFromElementAtIndex(index, className) {}

  /**
   * Adds an attribute, with value, to the element at the index provided.
   * @param {number} index
   * @param {string} attr
   * @param {string} value
   */
  addAttributeToElementAtIndex(index, attr, value) {}

  /**
   * Removes an attribute from an element at the index provided.
   * @param {number} index
   * @param {string} attr
   */
  removeAttributeFromElementAtIndex(index, attr) {}

  /**
   * Returns true if the element contains the className.
   * @param {?HTMLElement} element
   * @param {string} className
   * @return {boolean} true if the element contains the className
   */
  elementContainsClass(element, className) {}

  /**
   * Closes the menu-surface.
   */
  closeSurface() {}

  /**
   * Returns the index for the element provided.
   * @param {?HTMLElement} element
   * @return {number} index of the element in the list or -1 if it is not in the list.
   */
  getElementIndex(element) {}

  /**
   * Returns the parentElement of the provided element.
   * @param {?HTMLElement} element
   * @return {?HTMLElement} parentElement of the element provided.
   */
  getParentElement(element) {}

  /**
   * Returns the element within the selectionGroup containing the selected element class.
   * @param {!HTMLElement} selectionGroup
   * @return {number} element within the selectionGroup that contains the selected element class.
   */
  getSelectedElementIndex(selectionGroup) {}

  /**
   * Emits an event using the evtData.
   * @param {{
 *    index: number
 *   }} evtData
   */
  notifySelected(evtData) {}

  /**
   * Returns the checkbox contained within the element at the index specified.
   * @param {number} index
   * @return {?HTMLElement} checkbox
   */
  getCheckboxAtIndex(index) {}

  /**
   * Toggles the checkbox within a list item.
   * @param {!HTMLElement} target
   */
  toggleCheckbox(target) {}
}

export {MDCMenuAdapter};
