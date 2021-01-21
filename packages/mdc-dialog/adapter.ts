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

import {EventType, SpecificEventListener} from '@material/base/types';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCDialogAdapter {
  addClass(className: string): void;
  removeClass(className: string): void;
  hasClass(className: string): boolean;
  addBodyClass(className: string): void;
  removeBodyClass(className: string): void;
  eventTargetMatches(target: EventTarget|null, selector: string): boolean;

  isContentScrollable(): boolean;
  areButtonsStacked(): boolean;
  getActionFromEvent(evt: Event): string|null;

  trapFocus(focusElement: HTMLElement|null): void;
  releaseFocus(): void;
  // Element to focus on after dialog has opened.
  getInitialFocusEl(): HTMLElement|null;
  clickDefaultButton(): void;
  reverseButtons(): void;

  notifyOpening(): void;
  notifyOpened(): void;
  notifyClosing(action: string): void;
  notifyClosed(action: string): void;

  /**
   * Registers an event listener on the dialog's content element (indicated
   * with the 'mdc-dialog__content' class).
   */
  registerContentEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Deregisters an event listener on the dialog's content element.
   */
  deregisterContentEventHandler<K extends EventType>(
      evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * @return true if the content has been scrolled (that is, for
   *     scrollable content, if it is at the "top"). This is used in full-screen
   *     dialogs, where the scroll divider is expected only to appear once the
   *     content has been scrolled "underneath" the header bar.
   */
  isScrollableContentAtTop(): boolean;

  /**
   * @return true if the content has been scrolled all
   *     the way to the bottom. This is used in full-screen dialogs, where the
   *     footer scroll divider is expected only to appear when the content is
   *     "cut-off" by the footer bar.
   */
  isScrollableContentAtBottom(): boolean;
}
