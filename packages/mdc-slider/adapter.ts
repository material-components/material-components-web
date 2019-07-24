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
   * Checks if `className` exists on the root element.
   */
  hasClass(className: string): boolean;

  /**
   * Adds a class `className` to the root element.
   */
  addClass(className: string): void;

  /**
   * Removes a class `className` from the root element.
   */
  removeClass(className: string): void;

  /**
   * Returns the value of the attribute `name` on the root element, or
   * null` if that attribute is not present on the root element.
   */
  getAttribute(name: string): string | null;

  /**
   * Sets an attribute `name` to the value `value` on the root element.
   */
  setAttribute(name: string, value: string): void;

  /**
   * Removes an attribute `name` from the root element.
   */
  removeAttribute(name: string): void;

  /**
   * Computes and returns the bounding client rect for the root element.
   * Our implementations calls `getBoundingClientRect()` for this.
   */
  computeBoundingRect(): ClientRect;

  /**
   * Returns the value of the `tabIndex` property on the root element.
   */
  getTabIndex(): number;

  /**
   * Adds an event listener `handler` for event type `type` to the slider's root element.
   */
  registerInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Removes an event listener `handler` for event type `type` from the slider's root element.
   */
  deregisterInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Adds an event listener `handler` for event type `type` to the slider's thumb container element.
   */
  registerThumbContainerInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Removes an event listener `handler` for event type `type` from the slider's thumb container element.
   */
  deregisterThumbContainerInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Adds an event listener `handler` for event type `type` to the `<body>` element of the slider's document.
   */
  registerBodyInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Removes an event listener `handler` for event type `type` from the `<body>` element of the slider's document.
   */
  deregisterBodyInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Adds an event listener `handler` that is called when the component's viewport resizes, e.g. `window.onresize`.
   */
  registerResizeHandler(handler: SpecificEventListener<'resize'>): void;

  /**
   * Removes an event listener `handler` that was attached via `registerResizeHandler`.
   */
  deregisterResizeHandler(handler: SpecificEventListener<'resize'>): void;

  /**
   * Broadcasts an "input" event notifying clients that the slider's value is currently being changed.
   * The implementation should choose to pass along any relevant information pertaining to this event.
   * In our case we pass along the instance of the component for which the event is triggered for.
   */
  notifyInput(): void;

  /**
   * Broadcasts a "change" event notifying clients that a change to the slider's value has been committed
   * by the user. Similar guidance applies here as for `notifyInput()`.
   */
  notifyChange(): void;

  /**
   * Sets a dash-cased style property `propertyName` to the given `value` on the thumb container element.
   */
  setThumbContainerStyleProperty(propertyName: string, value: string): void;

  /**
   * Sets a dash-cased style property `propertyName` to the given `value` on the track element.
   */
  setTrackStyleProperty(propertyName: string, value: string): void;

  /**
   * Sets pin value marker's value when discrete slider thumb moves.
   */
  setMarkerValue(value: number): void;

  /**
   * Appends track marker element to track container.
   */
  appendTrackMarkers(numMarkers: number): void;

  /**
   * Removes existing marker elements to track container.
   */
  removeTrackMarkers(): void;

  /**
   * Sets a dash-cased style property `propertyName` to the given `value` on the last element of the track markers.
   */
  setLastTrackMarkersStyleProperty(propertyName: string, value: string): void;

  /**
   * True if the slider is within an RTL context, false otherwise.
   */
  isRTL(): boolean;
}
