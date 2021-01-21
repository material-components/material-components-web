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

import {AnimationFrame} from '@material/animation/animationframe';
import {MDCFoundation} from '@material/base/foundation';
import {SpecificEventListener} from '@material/base/types';

import {MDCDialogAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';

enum AnimationKeys {
  POLL_SCROLL_POS = 'poll_scroll_position'
}

export class MDCDialogFoundation extends MDCFoundation<MDCDialogAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter(): MDCDialogAdapter {
    return {
      addBodyClass: () => undefined,
      addClass: () => undefined,
      areButtonsStacked: () => false,
      clickDefaultButton: () => undefined,
      eventTargetMatches: () => false,
      getActionFromEvent: () => '',
      getInitialFocusEl: () => null,
      hasClass: () => false,
      isContentScrollable: () => false,
      notifyClosed: () => undefined,
      notifyClosing: () => undefined,
      notifyOpened: () => undefined,
      notifyOpening: () => undefined,
      releaseFocus: () => undefined,
      removeBodyClass: () => undefined,
      removeClass: () => undefined,
      reverseButtons: () => undefined,
      trapFocus: () => undefined,
      registerContentEventHandler: () => undefined,
      deregisterContentEventHandler: () => undefined,
      isScrollableContentAtTop: () => false,
      isScrollableContentAtBottom: () => false,
    };
  }

  private dialogOpen = false;
  private isFullscreen = false;
  private animationFrame = 0;
  private animationTimer = 0;
  private layoutFrame = 0;
  private escapeKeyAction = strings.CLOSE_ACTION;
  private scrimClickAction = strings.CLOSE_ACTION;
  private autoStackButtons = true;
  private areButtonsStacked = false;
  private suppressDefaultPressSelector =
      strings.SUPPRESS_DEFAULT_PRESS_SELECTOR;
  private readonly contentScrollHandler: SpecificEventListener<'scroll'>;
  private readonly animFrame: AnimationFrame;

  constructor(adapter?: Partial<MDCDialogAdapter>) {
    super({...MDCDialogFoundation.defaultAdapter, ...adapter});

    this.animFrame = new AnimationFrame();
    this.contentScrollHandler = () => {
      this.handleScrollEvent();
    };
  }

  init() {
    if (this.adapter.hasClass(cssClasses.STACKED)) {
      this.setAutoStackButtons(false);
    }
    this.isFullscreen = this.adapter.hasClass(cssClasses.FULLSCREEN);
  }

  destroy() {
    if (this.dialogOpen) {
      this.close(strings.DESTROY_ACTION);
    }

    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.handleAnimationTimerEnd();
    }

    if (this.layoutFrame) {
      cancelAnimationFrame(this.layoutFrame);
      this.layoutFrame = 0;
    }

    if (this.isFullscreen && this.adapter.isContentScrollable()) {
      this.adapter.deregisterContentEventHandler(
          'scroll', this.contentScrollHandler);
    }
  }

  open() {
    this.dialogOpen = true;
    this.adapter.notifyOpening();
    this.adapter.addClass(cssClasses.OPENING);
    if (this.isFullscreen && this.adapter.isContentScrollable()) {
      this.adapter.registerContentEventHandler(
          'scroll', this.contentScrollHandler);
    }

    // Wait a frame once display is no longer "none", to establish basis for
    // animation
    this.runNextAnimationFrame(() => {
      this.adapter.addClass(cssClasses.OPEN);
      this.adapter.addBodyClass(cssClasses.SCROLL_LOCK);

      this.layout();

      this.animationTimer = setTimeout(() => {
        this.handleAnimationTimerEnd();
        this.adapter.trapFocus(this.adapter.getInitialFocusEl());
        this.adapter.notifyOpened();
      }, numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
    });
  }

  close(action = '') {
    if (!this.dialogOpen) {
      // Avoid redundant close calls (and events), e.g. from keydown on elements
      // that inherently emit click
      return;
    }

    this.dialogOpen = false;
    this.adapter.notifyClosing(action);
    this.adapter.addClass(cssClasses.CLOSING);
    this.adapter.removeClass(cssClasses.OPEN);
    this.adapter.removeBodyClass(cssClasses.SCROLL_LOCK);
    if (this.isFullscreen && this.adapter.isContentScrollable()) {
      this.adapter.deregisterContentEventHandler(
          'scroll', this.contentScrollHandler);
    }

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;

    clearTimeout(this.animationTimer);
    this.animationTimer = setTimeout(() => {
      this.adapter.releaseFocus();
      this.handleAnimationTimerEnd();
      this.adapter.notifyClosed(action);
    }, numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);
  }

  isOpen() {
    return this.dialogOpen;
  }

  getEscapeKeyAction(): string {
    return this.escapeKeyAction;
  }

  setEscapeKeyAction(action: string) {
    this.escapeKeyAction = action;
  }

  getScrimClickAction(): string {
    return this.scrimClickAction;
  }

  setScrimClickAction(action: string) {
    this.scrimClickAction = action;
  }

  getAutoStackButtons(): boolean {
    return this.autoStackButtons;
  }

  setAutoStackButtons(autoStack: boolean) {
    this.autoStackButtons = autoStack;
  }

  getSuppressDefaultPressSelector(): string {
    return this.suppressDefaultPressSelector;
  }

  setSuppressDefaultPressSelector(selector: string) {
    this.suppressDefaultPressSelector = selector;
  }

  layout() {
    if (this.layoutFrame) {
      cancelAnimationFrame(this.layoutFrame);
    }
    this.layoutFrame = requestAnimationFrame(() => {
      this.layoutInternal();
      this.layoutFrame = 0;
    });
  }

  /** Handles click on the dialog root element. */
  handleClick(evt: MouseEvent) {
    const isScrim =
        this.adapter.eventTargetMatches(evt.target, strings.SCRIM_SELECTOR);
    // Check for scrim click first since it doesn't require querying ancestors.
    if (isScrim && this.scrimClickAction !== '') {
      this.close(this.scrimClickAction);
    } else {
      const action = this.adapter.getActionFromEvent(evt);
      if (action) {
        this.close(action);
      }
    }
  }

  /** Handles keydown on the dialog root element. */
  handleKeydown(evt: KeyboardEvent) {
    const isEnter = evt.key === 'Enter' || evt.keyCode === 13;
    if (!isEnter) {
      return;
    }
    const action = this.adapter.getActionFromEvent(evt);
    if (action) {
      // Action button callback is handled in `handleClick`,
      // since space/enter keydowns on buttons trigger click events.
      return;
    }

    // `composedPath` is used here, when available, to account for use cases
    // where a target meant to suppress the default press behaviour
    // may exist in a shadow root.
    // For example, a textarea inside a web component:
    // <mwc-dialog>
    //   <horizontal-layout>
    //     #shadow-root (open)
    //       <mwc-textarea>
    //         #shadow-root (open)
    //           <textarea></textarea>
    //       </mwc-textarea>
    //   </horizontal-layout>
    // </mwc-dialog>
    const target = evt.composedPath ? evt.composedPath()[0] : evt.target;
    const isDefault = this.suppressDefaultPressSelector ?
        !this.adapter.eventTargetMatches(
            target, this.suppressDefaultPressSelector) :
        true;
    if (isEnter && isDefault) {
      this.adapter.clickDefaultButton();
    }
  }

  /** Handles keydown on the document. */
  handleDocumentKeydown(evt: KeyboardEvent) {
    const isEscape = evt.key === 'Escape' || evt.keyCode === 27;
    if (isEscape && this.escapeKeyAction !== '') {
      this.close(this.escapeKeyAction);
    }
  }

  /**
   * Handles scroll event on the dialog's content element -- showing a scroll
   * divider on the header or footer based on the scroll position. This handler
   * should only be registered on full-screen dialogs with scrollable content.
   */
  private handleScrollEvent() {
    // Since scroll events can fire at a high rate, we throttle these events by
    // using requestAnimationFrame.
    this.animFrame.request(AnimationKeys.POLL_SCROLL_POS, () => {
      this.toggleScrollDividerHeader();
      this.toggleScrollDividerFooter();
    });
  }

  private layoutInternal() {
    if (this.autoStackButtons) {
      this.detectStackedButtons();
    }
    this.toggleScrollableClasses();
  }

  private handleAnimationTimerEnd() {
    this.animationTimer = 0;
    this.adapter.removeClass(cssClasses.OPENING);
    this.adapter.removeClass(cssClasses.CLOSING);
  }

  /**
   * Runs the given logic on the next animation frame, using setTimeout to
   * factor in Firefox reflow behavior.
   */
  private runNextAnimationFrame(callback: () => void) {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = 0;
      clearTimeout(this.animationTimer);
      this.animationTimer = setTimeout(callback, 0);
    });
  }

  private detectStackedButtons() {
    // Remove the class first to let us measure the buttons' natural positions.
    this.adapter.removeClass(cssClasses.STACKED);

    const areButtonsStacked = this.adapter.areButtonsStacked();

    if (areButtonsStacked) {
      this.adapter.addClass(cssClasses.STACKED);
    }

    if (areButtonsStacked !== this.areButtonsStacked) {
      this.adapter.reverseButtons();
      this.areButtonsStacked = areButtonsStacked;
    }
  }

  private toggleScrollableClasses() {
    // Remove the class first to let us measure the natural height of the
    // content.
    this.adapter.removeClass(cssClasses.SCROLLABLE);
    if (this.adapter.isContentScrollable()) {
      this.adapter.addClass(cssClasses.SCROLLABLE);

      if (this.isFullscreen) {
        // If dialog is full-screen and scrollable, check if a scroll divider
        // should be shown.
        this.toggleScrollDividerHeader();
        this.toggleScrollDividerFooter();
      }
    }
  }

  private toggleScrollDividerHeader() {
    if (!this.adapter.isScrollableContentAtTop()) {
      this.adapter.addClass(cssClasses.SCROLL_DIVIDER_HEADER);
    } else if (this.adapter.hasClass(cssClasses.SCROLL_DIVIDER_HEADER)) {
      this.adapter.removeClass(cssClasses.SCROLL_DIVIDER_HEADER);
    }
  }

  private toggleScrollDividerFooter() {
    if (!this.adapter.isScrollableContentAtBottom()) {
      this.adapter.addClass(cssClasses.SCROLL_DIVIDER_FOOTER);
    } else if (this.adapter.hasClass(cssClasses.SCROLL_DIVIDER_FOOTER)) {
      this.adapter.removeClass(cssClasses.SCROLL_DIVIDER_FOOTER);
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCDialogFoundation;
