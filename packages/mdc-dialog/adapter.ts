/**
 * @license
 * Copyright 2018 Google Inc.
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
export interface MDCDialogAdapter {
  /**
   * Adds a class to the root element.
   * @param className The className to add.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the root element.
   * @param className The className to remove.
   */
  removeClass(className: string): void;

  /**
   * Returns whether the given class exists on the root element.
   * @param className The className to check for on the root element.
   */
  hasClass(className: string): boolean;

  /**
   * Adds a class to the `<body>`.
   */
  addBodyClass(className: string): void;

  /**
   * Removes a class from the `<body>`.
   */
  removeBodyClass(className: string): void;

  /**
   * Returns `true` if the target element matches the given CSS selector, otherwise `false`.
   */
  eventTargetMatches(target: EventTarget | null, selector: string): boolean;

  /**
   * Returns `true` if `mdc-dialog__content` can be scrolled by the user, otherwise `false`.
   */
  isContentScrollable(): boolean;
  /**
   * Returns `true` if `mdc-dialog__action` buttons (`mdc-dialog__button`) are stacked
   * vertically, otherwise `false` if they are side-by-side.
   */
  areButtonsStacked(): boolean;

  /**
   * Retrieves the value of the `data-mdc-dialog-action` attribute from the given
   * event's target, or an ancestor of the target.
   * @param evt
   */
  getActionFromEvent(evt: Event): string | null;

  /**
   * Sets up the DOM such that keyboard navigation is restricted to focusable elements
   * within the dialog surface (see [Handling Focus Trapping](#handling-focus-trapping)
   * below for more details). Moves focus to `initialFocusEl`, if set.
   */
  trapFocus(focusElement: HTMLElement|null): void;

  /**
   * Removes any effects of focus trapping on the dialog surface
   * (see [Handling Focus Trapping](#handling-focus-trapping) below for more details).
   */
  releaseFocus(): void;

  /**
   * Returns the `data-mdc-dialog-initial-focus` element to add focus
   * to after the dialog has opened. Element to focus on after dialog has opened.
   */
  getInitialFocusEl(): HTMLElement|null;

  /**
   * Invokes `click()` on the `data-mdc-dialog-button-default` element, if one exists in the dialog.
   */
  clickDefaultButton(): void;

  /**
   * Reverses the order of action buttons in the `mdc-dialog__actions` element. Used when
   * switching between stacked and unstacked button layouts.
   */
  reverseButtons(): void;

  /**
   * Broadcasts an event denoting that the dialog has just started to open.
   */
  notifyOpening(): void;

  /**
   * Broadcasts an event denoting that the dialog has finished opening.
   */
  notifyOpened(): void;

  /**
   * Broadcasts an event denoting that the dialog has just started closing.
   * If a non-empty `action` is passed, the event's `detail` object should include
   * its value in the `action` property.
   * @param action Type of action that identifies that is closing the diaglog component.
   */
  notifyClosing(action: string): void;
  /**
   * Broadcasts an event denoting that the dialog has finished closing. If a non-empty
   * `action` is passed, the event's `detail` object should include its value in the
   * `action` property.
   * @param action Type of action that identifies that closed the diaglog component.
   */
  notifyClosed(action: string): void;
}
