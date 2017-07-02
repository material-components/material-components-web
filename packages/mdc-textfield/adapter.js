/**
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
 * Adapter for MDC Text Field. Provides an interface for managing
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
 * https://github.com/material-components/material-components-web/blob/master/docs/architecture.md
 *
 * @record
 */
export default class MDCTextfieldAdapter {

  /** @param {string} className  */
  addClass(className) {}

  /** @param {string} className */
  removeClass(className) {}

  /** @param {string} className */
  addClassToLabel(className) {}

  /** @param {string} className */
  removeClassFromLabel(className) {}

  /** @param {!EventListener} handler */
  registerInputFocusHandler(handler) {}

  /** @param {!EventListener} handler */
  deregisterInputFocusHandler(handler) {}

  /** @param {!EventListener} handler */
  registerInputBlurHandler(handler) {}

  /** @param {!EventListener} handler */
  deregisterInputBlurHandler(handler) {}

  /** @param {!EventListener} handler */
  registerInputInputHandler(handler) {}

  /** @param {!EventListener} handler */
  deregisterInputInputHandler(handler) {}

  /** @param {!EventListener} handler */
  registerInputKeydownHandler(handler) {}

  /** @param {!EventListener} handler */
  deregisterInputKeydownHandler(handler) {}

  /** @return {!TextfieldElementState} */
  getNativeInput() {}

  /** @param {string} className */
  addClassToHelptext(className) {}

  /** @param {string} className */
  removeClassFromHelptext(className) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  helptextHasClass(className) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setHelptextAttr(name, value) {}

  /** @param {string} name */
  removeHelptextAttr(name) {}

}

/** @record */
export class MDCTextfieldInputAdapter {

  /** @param {!EventListener} handler */
  registerInputFocusHandler(handler) {}

  /** @param {!EventListener} handler */
  deregisterInputFocusHandler(handler) {}

  /** @param {!EventListener} handler */
  registerInputBlurHandler(handler) {}

  /** @param {!EventListener} handler */
  deregisterInputBlurHandler(handler) {}

  /** @param {!EventListener} handler */
  registerInputInputHandler(handler) {}

  /** @param {!EventListener} handler */
  deregisterInputInputHandler(handler) {}

  /** @param {!EventListener} handler */
  registerInputKeydownHandler(handler) {}

  /** @param {!EventListener} handler */
  deregisterInputKeydownHandler(handler) {}

  /** @return {!TextfieldElementState} */
  getNativeInput() {}

}

/** @record */
export class MDCTextfieldHelptextAdapter {

  /** @param {string} className */
  addClassToHelptext(className) {}

  /** @param {string} className */
  removeClassFromHelptext(className) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  helptextHasClass(className) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setHelptextAttr(name, value) {}

  /** @param {string} name */
  removeHelptextAttr(name) {}

}

/**
 * @typedef {!{
 *   checkValidity: function(): boolean,
 *   value: ?string,
 *   disabled: boolean,
 *   badInput: boolean
 * }}
 */
export let TextfieldElementState;
