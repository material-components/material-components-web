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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * @typedef {{
 *   value: string,
 *   disabled: boolean,
 *   badInput: boolean,
 *   checkValidity: (function(): boolean)
 * }}
 */
let NativeInputType;

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
   * Adds a class to the helper text element. Note that in our code we check for
   * whether or not we have a helper text element and if we don't, we simply
   * return.
   * @param {string} className
   */
  addClassToHelperText(className) {}

  /**
   * Removes a class from the helper text element.
   * @param {string} className
   */
  removeClassFromHelperText(className) {}

  /**
   * Returns whether or not the helper text element contains the given class.
   * @param {string} className
   * @return {boolean}
   */
  helperTextHasClass(className) {}

  /**
   * Registers an event listener on the native input element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerInputInteractionHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the native input element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterInputInteractionHandler(evtType, handler) {}

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
   * Sets an attribute with a given value on the helper text element.
   * @param {string} name
   * @param {string} value
   */
  setHelperTextAttr(name, value) {}

  /**
   * Removes an attribute from the helper text element.
   * @param {string} name
   */
  removeHelperTextAttr(name) {}

  /**
   * Sets the text content for the help text element
   * @param {string} content
   */
  setHelperTextContent(content) {}

  /**
   * Returns an object representing the native text input element, with a
   * similar API shape. The object returned should include the value, disabled
   * and badInput properties, as well as the checkValidity() function. We never
   * alter the value within our code, however we do update the disabled
   * property, so if you choose to duck-type the return value for this method
   * in your implementation it's important to keep this in mind. Also note that
   * this method can return null, which the foundation will handle gracefully.
   * @return {?Element|?NativeInputType}
   */
  getNativeInput() {}

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
}

export {MDCTextFieldAdapter, NativeInputType};
