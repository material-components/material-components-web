/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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
 * - classes
 * - dom
 * - focus
 * - position
 * - dimensions
 * - event handlers
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
  /** @param {string} className */
  addClass(className) {}

  /** @param {string} className */
  removeClass(className) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /** @return {boolean} */
  hasNecessaryDom() {}

  /**
   * @param {EventTarget} target
   * @param {string} attributeName
   * @return {string}
   */
  getAttributeForEventTarget(target, attributeName) {}

  /** @return {{ width: number, height: number }} */
  getInnerDimensions() {}

  /** @return {boolean} */
  hasAnchor() {}

  /** @return {{width: number, height: number, top: number, right: number, bottom: number, left: number}} */
  getAnchorDimensions() {}

  /** @return {{ width: number, height: number }} */
  getWindowDimensions() {}

  /** @return {number} */
  getNumberOfItems() {}

  /**
   * @param {string} type
   * @param {function(!Event)} handler
   */
  registerInteractionHandler(type, handler) {}

  /**
   * @param {string} type
   * @param {function(!Event)} handler
   */
  deregisterInteractionHandler(type, handler) {}

  /** @param {function(!Event)} handler */
  registerBodyClickHandler(handler) {}

  /** @param {function(!Event)} handler */
  deregisterBodyClickHandler(handler) {}

  /**
   * @param {EventTarget} target
   * @return {number}
   */
  getIndexForEventTarget(target) {}

  /** @param {{index: number}} evtData */
  notifySelected(evtData) {}

  notifyCancel() {}

  saveFocus() {}

  restoreFocus() {}

  /** @return {boolean} */
  isFocused() {}

  focus() {}

  /** @return {number} */
  getFocusedItemIndex() /* number */ {}

  /** @param {number} index */
  focusItemAtIndex(index) {}

  /** @return {boolean} */
  isRtl() {}

  /** @param {string} origin */
  setTransformOrigin(origin) {}

  /** @param {{
  *   top: (string|undefined),
  *   right: (string|undefined),
  *   bottom: (string|undefined),
  *   left: (string|undefined)
  * }} position */
  setPosition(position) {}

  /** @param {string} height */
  setMaxHeight(height) {}

  /**
   * @param {number} index
   * @param {string} attr
   * @param {string} value
   */
  setAttrForOptionAtIndex(index, attr, value) {}

  /**
   * @param {number} index
   * @param {string} attr
   */
  rmAttrForOptionAtIndex(index, attr) {}

  /**
   * @param {number} index
   * @param {string} className
   */
  addClassForOptionAtIndex(index, className) {}

  /**
   * @param {number} index
   * @param {string} className
   */
  rmClassForOptionAtIndex(index, className) {}
}

export {MDCMenuAdapter};
