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
 * Adapter for MDC Tooltip. Provides an interface for managing
 * - classes
 * - dom
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/architecture.md
 *
 * @record
 */

class MDCTooltipAdapter {
  /** @param {string} className */
  addClass(className) { }

  /** @param {string} className */
  removeClass(className) { }

  /** @return {!ClientRect} */
  computeBoundingRect() { }

  /** @return {!Object} */
  computeControllerBoundingRect() { }

  /** @return {Array<string>} */
  getClassList() { }

  /**
   * @param {string} propertyName
   * @param {string} value
   */
  setStyle(propertyName, value) {}

  /**
   * @param {string} evtType
   * @param {!Function} handler
   */
  registerListener(evtType, handler) { }

  /**
   * @param {string} evtType
   * @param {!Function} handler
   */
  deregisterListener(evtType, handler) { }

  /**
   * @param {!Function} handler
   */
  registerTransitionEndHandler(handler) { }

  /**
   * @param {!Function} handler
   */
  deregisterTransitionEndHandler(handler) { }

  /**
   * @param {string} evtType
   * @param {!Function} handler
   */
  registerWindowListener(evtType, handler) { }

  /**
   * @param {string} evtType
   * @param {!Function} handler
   */
  deregisterWindowListener(evtType, handler) { }
}

export default MDCTooltipAdapter;


