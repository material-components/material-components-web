/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-unused-vars */

/**
 * Adapter for MDC Slider.
 *
 * Defines the shape of the adapter expected by the foundation.
 *
 * @record
 */
class MDCSliderAdapter {
  /**
   * Returns if the slider Element has the given class
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Adds a class to the slider Element
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the slider Element
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Sets attribute name on slider thumb Element to value
   * @param {string} name
   * @param {string} value
   */
  setThumbAttribute(name, value) {}

  /**
   * Returns the bounding client rect for the slider Element
   * @return {?ClientRect}
   */
  computeBoundingRect() {}

  /**
   * Returns true if target has className, false otherwise.
   * @param {EventTarget} target
   * @param {string} className
   * @return {boolean}
   */
  eventTargetHasClass(target, className) {}

  /**
   * Registers an event handler on the root element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  registerEventHandler(type, handler) {}

  /**
   * Deregisters an event handler on the root element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  deregisterEventHandler(type, handler) {}

  /**
   * Registers an event handler on the body for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  registerBodyEventHandler(type, handler) {}

  /**
   * Deregisters an event handler on the body for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  deregisterBodyEventHandler(type, handler) {}

  /**
   * Registers an event handler for the window resize event
   * @param {function(!Event): undefined} handler
   */
  registerWindowResizeHandler(handler) {}

  /**
   * Deregisters an event handler for the window resize event
   * @param {function(!Event): undefined} handler
   */
  deregisterWindowResizeHandler(handler) {}

  /**
   * Emits a custom event MDCSlider:input from the root
   */
  notifyInput() {}

  /**
   * Emits a custom event MDCSlider:change from the root
   */
  notifyChange() {}

  /**
   * Sets a style property of the thumb container element to the passed value
   * @param {string} propertyName
   * @param {string} value
   */
  setThumbStyleProperty(propertyName, value) {}

  /**
   * Sets a style property of the track element to the passed value
   * @param {string} propertyName
   * @param {string} value
   */
  setTrackFillStyleProperty(propertyName, value) {}

  /**
   * Sets a style property of the last tick mark element to the passed value
   * @param {string} propertyName
   * @param {string} value
   */
  setLastTickMarkStyleProperty(propertyName, value) {}

  /**
   * Sets focus to thumb
   */
  focusThumb() {}

  /**
   * Activates the thumb ripple
   */
  activateRipple() {}

  /**
   * Deactivates the thumb ripple
   */
  deactivateRipple() {}

  /**
   * Returns true if the root element is RTL, otherwise false
   * @return {boolean}
   */
  isRTL() {}

  /**
   * Updates the tick marks to be active or not active
   * @param {number} currentTickMark
   */
  updateTickMarkClasses(currentTickMark) {}
}

export default MDCSliderAdapter;
