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

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCChipAdapter {
  /**
   * Adds a class to the root element.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the root element.
   */
  removeClass(className: string): void;

  /**
   * Returns true if the root element contains the given class.
   * @return true if the root element contains the given class.
   */
  hasClass(className: string): boolean;

  /**
   * Adds a class to the leading icon element.
   */
  addClassToLeadingIcon(className: string): void;

  /**
   * Removes a class from the leading icon element.
   */
  removeClassFromLeadingIcon(className: string): void;

  /**
   * Returns true if target has className, false otherwise.
   * @return true if target has className, false otherwise.
   */
  eventTargetHasClass(target: EventTarget | null, className: string): boolean;

  /**
   * Emits a custom "MDCChip:interaction" event denoting the chip has been
   * interacted with (typically on click or keydown).
   * Notifies the Chip Set that the chip has been interacted with.
   * \*_NOTE_: `notifyInteraction` and `notifyTrailingIconInteraction` must pass along the target
   * chip's ID, and must be observable by the parent `mdc-chip-set` element (e.g. via DOM event bubbling).
   */
  notifyInteraction(): void;

  /**
   * Emits a custom "MDCChip:selection" event denoting the chip has been selected or deselected.
   * Notifies the Chip Set that the chip has been selected or deselected.
   * \*_NOTE_: `notifySelection` must pass along the target chip's ID and selected state, and must be observable
   * by the parent `mdc-chip-set` element (e.g. via DOM event bubbling).
   */
  notifySelection(selected: boolean): void;

  /**
   * Emits a custom "MDCChip:trailingIconInteraction" event denoting the trailing icon has been
   * interacted with (typically on click or keydown). Notifies the Chip Set that the chip's trailing
   * icon has been interacted with.
   * \*_NOTE_: `notifyInteraction` and `notifyTrailingIconInteraction` must pass along the target chip's ID,
   * and must be observable by the parent `mdc-chip-set` element (e.g. via DOM event bubbling).
   */
  notifyTrailingIconInteraction(): void;

  /**
   * Emits a custom event "MDCChip:removal" denoting the chip will be removed.
   * \*_NOTE_: `notifyRemoval` must pass along the target chip's ID and its root element,
   * and must be observable by the parent `mdc-chip-set` element (e.g. via DOM event bubbling).
   */
  notifyRemoval(): void;

  /**
   * Returns the computed property value of the given style property on the root element.
   * @return The computed property value of the given style property on the root element.
   */
  getComputedStyleValue(propertyName: string): string;

  /**
   * Sets the property value of the given style property on the root element.
   */
  setStyleProperty(propertyName: string, value: string): void;

  /**
   * Returns whether the chip has a leading icon.
   * @return Whether the chip has a leading icon.
   */
  hasLeadingIcon(): boolean;

  /**
   * @return The bounding client rect of the root element.
   */
  getRootBoundingClientRect(): ClientRect;

  /**
   * Returns the bounding client rect of the root element.
   * @return The bounding client rect of the checkmark element or null if it doesn't exist.
   */
  getCheckmarkBoundingClientRect(): ClientRect | null;

  /**
   * Sets the value of the attribute on the root element.
   */
  setAttr(attr: string, value: string): void;
}
