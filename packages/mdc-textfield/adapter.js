/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

/* eslint-disable no-unused-vars */
import MDCTextFieldBottomLineFoundation from './bottom-line/foundation';
import MDCTextFieldHelperTextFoundation from './helper-text/foundation';
import MDCTextFieldInputFoundation from './input/foundation';

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Text Field.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Text Field into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTextFieldAdapter {
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
   * Adds a class to the label Element. We recommend you add a conditional
   * check here, and in removeClassFromLabel for whether or not the label is
   * present so that the JS component could be used with text fields that don't
   * require a label, such as the full-width text field.
   * @param {string} className
   */
  addClassToLabel(className) {}

  /**
   * Removes a class from the label Element.
   * @param {string} className
   */
  removeClassFromLabel(className) {}

  /**
   * Returns whether or not the label element contains the given class.
   * @param {string} className
   * @return {boolean}
   */
  labelHasClass(className) {}

  /**
   * Sets an attribute on the icon Element.
   * @param {string} name
   * @param {string} value
   */
  setIconAttr(name, value) {}

  /**
   * Returns true if classname exists for a given target element.
   * @param {?EventTarget} target
   * @param {string} className
   * @return {boolean}
   */
  eventTargetHasClass(target, className) {}

  /**
   * Registers an event handler on the root element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  registerTextFieldInteractionHandler(type, handler) {}

  /**
   * Deregisters an event handler on the root element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  deregisterTextFieldInteractionHandler(type, handler) {}

  /**
   * Emits a custom event "MDCTextField:icon" denoting a user has clicked the icon.
   */
  notifyIconAction() {}

  /**

  /**
   * Registers an event listener on the input element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerInputEventHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the input element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterInputEventHandler(evtType, handler) {}

  /**
   * Registers an event listener on the bottom line element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerBottomLineEventHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the bottom line element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterBottomLineEventHandler(evtType, handler) {}

  /**
   * Returns the foundation for the bottom line element. Returns undefined if
   * there is no bottom line element.
   * @return {?MDCTextFieldBottomLineFoundation}
   */
  getBottomLineFoundation() {}

  /**
   * Returns the foundation for the helper text element. Returns undefined if
   * there is no helper text element.
   * @return {?MDCTextFieldHelperTextFoundation}
   */
  getHelperTextFoundation() {}

  /**
   * Returns the foundation for the input element.
   * @return {!MDCTextFieldInputFoundation}
   */
  getInputFoundation() {}
}

export {MDCTextFieldAdapter};
