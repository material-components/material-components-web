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
 * Adapter for MDC Expansion Panel. Provides an interface for managing
 * - classes
 * - dom
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
class MDCExpansionPanelAdapter {
  blur() {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * @param {string} className
   */
  addClass(className) {}

  /**
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * @param {string} attributeName
   * @param {string} value
   */
  setAttribute(attributeName, value) {}

  /**
   * @param {string} styleName
   * @param {string} value
   */
  setStyle(styleName, value) {}

  /**
   * @param {string} styleName
   * @return {string}
   */
  getStyle(styleName) {}

  /**
   * @return {string}
   */
  getComputedHeight() {}

  /**
   * @return {number}
   */
  offsetHeight() {}

  /**
   * @param {string} type
   * @param {!EventListener} handler
   */
  registerInteractionHandler(type, handler) {}

  /**
   * @param {string} type
   * @param {!EventListener} handler
   */
  deregisterInteractionHandler(type, handler) {}


  notifyChange() {}


  notifyExpand() {}


  notifyCollapse() {}

  /**
   * @param {string} innerHTML
   */
  setExpansionIconInnerHTML(innerHTML) {}

  /**
   * @param {Event} event
   * @return {boolean}
   */
  shouldRespondToClickEvent(event) {}
}

export default MDCExpansionPanelAdapter;
