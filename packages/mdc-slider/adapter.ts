/**
 * @license
 * Copyright 2020 Google Inc.
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

import {Thumb, TickMark} from './types';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCSliderAdapter {
  /**
   * @return Returns true if the slider root element has the given class.
   */
  hasClass(className: string): boolean;

  /**
   * Adds the given class to the slider root element.
   */
  addClass(className: string): void;

  /**
   * Removes the given class from the slider root element.
   */
  removeClass(className: string): void;

  /**
   * @return Returns the given attribute value on the slider root element.
   */
  getAttribute(attribute: string): string|null;

  /**
   * Adds the class to the given thumb element.
   */
  addThumbClass(className: string, thumb: Thumb): void;

  /**
   * Removes the class from the given thumb element.
   */
  removeThumbClass(className: string, thumb: Thumb): void;

  /**
   * - If thumb is `Thumb.START`, returns the value on the start thumb
   *   (for range slider variant).
   * - If thumb is `Thumb.END`, returns the value on the end thumb (or
   *   only thumb for single point slider).
   */
  getThumbAttribute(attribute: string, thumb: Thumb): string|null;

  /**
   * - If thumb is `Thumb.START`, sets the attribute on the start thumb
   *   (for range slider variant).
   * - If thumb is `Thumb.END`, sets the attribute on the end thumb (or
   *   only thumb for single point slider).
   */
  setThumbAttribute(attribute: string, value: string, thumb: Thumb): void;

  /**
   * @return Returns the width of the given thumb knob.
   */
  getThumbKnobWidth(thumb: Thumb): number;

  /**
   * @return Returns true if the given thumb is focused.
   */
  isThumbFocused(thumb: Thumb): boolean;

  /**
   * Adds browser focus to the given thumb.
   */
  focusThumb(thumb: Thumb): void;

  /**
   * @return Returns the bounding client rect of the given thumb.
   */
  getThumbBoundingClientRect(thumb: Thumb): ClientRect;

  /**
   * @return Returns the bounding client rect for the slider root element.
   */
  getBoundingClientRect(): ClientRect;

  /**
   * @return Returns true if the root element is RTL, otherwise false
   */
  isRTL(): boolean;

  /**
   * Sets a style property of the thumb element to the passed value.
   * - If thumb is `Thumb.START`, sets style on the start thumb (for
   *   range slider variant).
   * - If thumb is `Thumb.END`, sets style on the end thumb (or only thumb
   *   for single point slider).
   */
  setThumbStyleProperty(propertyName: string, value: string, thumb: Thumb):
      void;

  /**
   * Sets a style property of the active track element to the passed value.
   */
  setTrackActiveStyleProperty(propertyName: string, value: string): void;

  /**
   * Sets value indicator text based on the given value.
   * - If thumb is `Thumb.START`, updates value indicator on start thumb
   *   (for range slider variant).
   * - If thumb is `Thumb.END`, updates value indicator on end thumb (or
   *   only thumb for single point slider).
   */
  setValueIndicatorText(value: number, thumb: Thumb): void;

  /**
   * Updates tick marks container element with tick mark elements and their
   * active/inactive classes, based on the given mappings:
   * - TickMark.ACTIVE => `cssClasses.TICK_MARK_ACTIVE`
   * - TickMark.INACTIVE => `cssClasses.TICK_MARK_INACTIVE`
   */
  updateTickMarks(tickMarks: TickMark[]): void;

  /**
   * Sets pointer capture on the slider root.
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture
   */
  setPointerCapture(pointerId: number): void;

  /**
   * Emits a `change` event from the slider root, indicating that the value
   * has been changed and committed on the given thumb, from a user event.
   * Mirrors the native `change` event:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
   */
  emitChangeEvent(value: number, thumb: Thumb): void;

  /**
   * Emits an `input` event from the slider root, indicating that the value
   * has been changed on the given thumb, from a user event.
   * Mirrors the native `input` event:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
   */
  emitInputEvent(value: number, thumb: Thumb): void;

  /**
   * Registers an event listener on the root element.
   */
  registerEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Deregisters an event listener on the root element.
   */
  deregisterEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Registers an event listener on the given thumb element.
   */
  registerThumbEventHandler<K extends EventType>(
      thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Deregisters an event listener on the given thumb element.
   */
  deregisterThumbEventHandler<K extends EventType>(
      thumb: Thumb, evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Registers an event listener on the body element.
   */
  registerBodyEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Deregisters an event listener on the body element.
   */
  deregisterBodyEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Registers an event listener on the window.
   */
  registerWindowEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Deregisters an event listener on the window.
   */
  deregisterWindowEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;
}
