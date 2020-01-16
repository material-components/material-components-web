/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {EventType, SpecificEventListener} from '@material/base/types';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCSliderAdapter {
  /**
   * Returns true if className exists for the slider Element
   */
  hasClass(className: string): boolean;

  /**
   * Adds a class to the slider Element
   */
  addClass(className: string): void;

  /**
   * Removes a class from the slider Element
   */
  removeClass(className: string): void;

  /**
   * Returns a string if attribute name exists on the slider Element, otherwise
   * returns null
   */
  getAttribute(name: string): string|null;

  /**
   * Sets attribute name on slider Element to value
   */
  setAttribute(name: string, value: string): void;

  /**
   * Removes attribute name from slider Element
   */
  removeAttribute(name: string): void;

  /**
   * Returns the bounding client rect for the slider Element
   */
  computeBoundingRect(): ClientRect;

  /**
   * Returns the tab index of the slider Element
   */
  getTabIndex(): number;

  /**
   * Registers an event handler on the root element for a given event.
   */
  registerInteractionHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Deregisters an event handler on the root element for a given event.
   */
  deregisterInteractionHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Registers an event handler on the thumb container element for a given
   * event.
   */
  registerThumbContainerInteractionHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Deregisters an event handler on the thumb container element for a given
   * event.
   */
  deregisterThumbContainerInteractionHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Registers an event handler on the body for a given event.
   */
  registerBodyInteractionHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Deregisters an event handler on the body for a given event.
   */
  deregisterBodyInteractionHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Registers an event handler for the window resize event
   */
  registerResizeHandler(handler: SpecificEventListener<'resize'>): void;

  /**
   * Deregisters an event handler for the window resize event
   */
  deregisterResizeHandler(handler: SpecificEventListener<'resize'>): void;

  /**
   * Emits a custom event MDCSlider:input from the root
   */
  notifyInput(): void;

  /**
   * Emits a custom event MDCSlider:change from the root
   */
  notifyChange(): void;

  /**
   * Sets a style property of the thumb container element to the passed value
   */
  setThumbContainerStyleProperty(propertyName: string, value: string): void;

  /**
   * Sets a style property of the track element to the passed value
   */
  setTrackStyleProperty(propertyName: string, value: string): void;

  /**
   * Sets the inner text of the pin marker to the passed value
   */
  setMarkerValue(value: number): void;

  /**
   * Send track markers numbers to setup mark container element
   */
  setTrackMarkers(step: number, max: number, min: number): void;

  /**
   * Returns true if the root element is RTL, otherwise false
   */
  isRTL(): boolean;
}
