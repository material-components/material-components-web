/**
 * @license
 * Copyright 2016 Google Inc.
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

import {MDCFoundation} from '@material/base/foundation';
import {MDCChipAdapter} from './adapter';
import {cssClasses, Direction, EventSource, strings} from './constants';

const emptyClientRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
};

export const NAVIGATION_KEYS = new Set<string>();
// IE11 has no support for new Set with iterable so we need to initialize this by hand
NAVIGATION_KEYS.add(strings.ARROW_LEFT_KEY);
NAVIGATION_KEYS.add(strings.ARROW_RIGHT_KEY);
NAVIGATION_KEYS.add(strings.ARROW_DOWN_KEY);
NAVIGATION_KEYS.add(strings.ARROW_UP_KEY);
NAVIGATION_KEYS.add(strings.END_KEY);
NAVIGATION_KEYS.add(strings.HOME_KEY);

export const JUMP_CHIP_KEYS = new Set<string>();
// IE11 has no support for new Set with iterable so we need to initialize this by hand
JUMP_CHIP_KEYS.add(strings.ARROW_UP_KEY);
JUMP_CHIP_KEYS.add(strings.ARROW_DOWN_KEY);
JUMP_CHIP_KEYS.add(strings.HOME_KEY);
JUMP_CHIP_KEYS.add(strings.END_KEY);

export class MDCChipFoundation extends MDCFoundation<MDCChipAdapter> {
  static get strings() {
    return strings;
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter(): MDCChipAdapter {
    return {
      addClass: () => undefined,
      addClassToLeadingIcon: () => undefined,
      eventTargetHasClass: () => false,
      focusPrimaryAction: () => undefined,
      focusTrailingAction: () => undefined,
      getCheckmarkBoundingClientRect: () => emptyClientRect,
      getComputedStyleValue: () => '',
      getRootBoundingClientRect: () => emptyClientRect,
      hasClass: () => false,
      hasLeadingIcon: () => false,
      hasTrailingAction: () => false,
      isRTL: () => false,
      notifyInteraction: () => undefined,
      notifyNavigation: () => undefined,
      notifyRemoval: () => undefined,
      notifySelection: () => undefined,
      notifyTrailingIconInteraction: () => undefined,
      removeClass: () => undefined,
      removeClassFromLeadingIcon: () => undefined,
      setStyleProperty: () => undefined,
      setPrimaryActionAttr: () => undefined,
      setTrailingActionAttr: () => undefined,
    };
  }

  /**
   * Whether a trailing icon click should immediately trigger exit/removal of the chip.
   */
  private shouldRemoveOnTrailingIconClick_ = true;

  constructor(adapter?: Partial<MDCChipAdapter>) {
    super({...MDCChipFoundation.defaultAdapter, ...adapter});
  }

  isSelected() {
    return this.adapter_.hasClass(cssClasses.SELECTED);
  }

  setSelected(selected: boolean) {
    if (selected) {
      this.adapter_.addClass(cssClasses.SELECTED);
      this.adapter_.setPrimaryActionAttr(strings.ARIA_CHECKED, 'true');
    } else {
      this.adapter_.removeClass(cssClasses.SELECTED);
      this.adapter_.setPrimaryActionAttr(strings.ARIA_CHECKED, 'false');
    }
    this.adapter_.notifySelection(selected);
  }

  getShouldRemoveOnTrailingIconClick() {
    return this.shouldRemoveOnTrailingIconClick_;
  }

  setShouldRemoveOnTrailingIconClick(shouldRemove: boolean) {
    this.shouldRemoveOnTrailingIconClick_ = shouldRemove;
  }

  getDimensions(): ClientRect {
    const getRootRect = () => this.adapter_.getRootBoundingClientRect();
    const getCheckmarkRect = () => this.adapter_.getCheckmarkBoundingClientRect();

    // When a chip has a checkmark and not a leading icon, the bounding rect changes in size depending on the current
    // size of the checkmark.
    if (!this.adapter_.hasLeadingIcon()) {
      const checkmarkRect = getCheckmarkRect();
      if (checkmarkRect) {
        const rootRect = getRootRect();
        // Checkmark is a square, meaning the client rect's width and height are identical once the animation completes.
        // However, the checkbox is initially hidden by setting the width to 0.
        // To account for an initial width of 0, we use the checkbox's height instead (which equals the end-state width)
        // when adding it to the root client rect's width.
        return {
          bottom: rootRect.bottom,
          height: rootRect.height,
          left: rootRect.left,
          right: rootRect.right,
          top: rootRect.top,
          width: rootRect.width + checkmarkRect.height,
        };
      }
    }

    return getRootRect();
  }

  /**
   * Begins the exit animation which leads to removal of the chip.
   */
  beginExit() {
    this.adapter_.addClass(cssClasses.CHIP_EXIT);
  }

  /**
   * Handles an interaction event on the root element.
   */
  handleInteraction(evt: MouseEvent | KeyboardEvent) {
    if (this.shouldHandleInteraction_(evt)) {
      this.adapter_.notifyInteraction();
    }
  }

  /**
   * Handles a transition end event on the root element.
   */
  handleTransitionEnd(evt: TransitionEvent) {
    // Handle transition end event on the chip when it is about to be removed.
    const shouldHandle = this.adapter_.eventTargetHasClass(evt.target, cssClasses.CHIP_EXIT);
    const widthIsAnimating = evt.propertyName === 'width';
    const opacityIsAnimating = evt.propertyName === 'opacity';

    if (shouldHandle && opacityIsAnimating) {
      // See: https://css-tricks.com/using-css-transitions-auto-dimensions/#article-header-id-5
      const chipWidth = this.adapter_.getComputedStyleValue('width');

      // On the next frame (once we get the computed width), explicitly set the chip's width
      // to its current pixel width, so we aren't transitioning out of 'auto'.
      requestAnimationFrame(() => {
        this.adapter_.setStyleProperty('width', chipWidth);

        // To mitigate jitter, start transitioning padding and margin before width.
        this.adapter_.setStyleProperty('padding', '0');
        this.adapter_.setStyleProperty('margin', '0');

        // On the next frame (once width is explicitly set), transition width to 0.
        requestAnimationFrame(() => {
          this.adapter_.setStyleProperty('width', '0');
        });
      });
      return;
    }

    if (shouldHandle && widthIsAnimating) {
      this.removeFocus_();
      this.adapter_.notifyRemoval();
    }

    // Handle a transition end event on the leading icon or checkmark, since the transition end event bubbles.
    if (!opacityIsAnimating) {
      return;
    }

    const shouldHideLeadingIcon = this.adapter_.eventTargetHasClass(evt.target, cssClasses.LEADING_ICON)
      && this.adapter_.hasClass(cssClasses.SELECTED);
    const shouldShowLeadingIcon = this.adapter_.eventTargetHasClass(evt.target, cssClasses.CHECKMARK)
      && !this.adapter_.hasClass(cssClasses.SELECTED);

    if (shouldHideLeadingIcon) {
      return this.adapter_.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
    }

    if (shouldShowLeadingIcon) {
      return this.adapter_.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
    }
  }

  /**
   * Handles an interaction event on the trailing icon element. This is used to
   * prevent the ripple from activating on interaction with the trailing icon.
   */
  handleTrailingIconInteraction(evt: MouseEvent | KeyboardEvent) {
    if (this.shouldHandleInteraction_(evt)) {
      this.adapter_.notifyTrailingIconInteraction();
      this.removeChip_(evt);
    }
  }

  /**
   * Handles a keydown event from the root element.
   */
  handleKeydown(evt: KeyboardEvent) {
    if (this.shouldRemoveChip_(evt)) {
      return this.removeChip_(evt);
    }

    const key = evt.key;
    // Early exit if the key is not usable
    if (!NAVIGATION_KEYS.has(key)) {
      return;
    }

    // Prevent default behavior for movement keys which could include scrolling
    evt.preventDefault();
    this.focusNextAction_(evt);
  }

  removeFocus() {
    this.adapter_.setPrimaryActionAttr(strings.TAB_INDEX, '-1');
    this.adapter_.setTrailingActionAttr(strings.TAB_INDEX, '-1');
  }

  focusAction(key: string, source: EventSource) {
    // Early exit if the key is not usable
    if (!NAVIGATION_KEYS.has(key)) {
      return;
    }

    const shouldJumpChips = JUMP_CHIP_KEYS.has(key);
    const hasTrailingAction = this.adapter_.hasTrailingAction();
    if (shouldJumpChips && (source === EventSource.Primary || !hasTrailingAction)) {
      return this.focusPrimaryAction_();
    }

    if (shouldJumpChips && source === EventSource.Trailing && hasTrailingAction) {
      return this.focusTrailingAction_();
    }

    const dir = this.getDirection_(key);
    if (dir === Direction.Left && hasTrailingAction) {
      return this.focusTrailingAction_();
    }

    if (dir === Direction.Right || (dir === Direction.Left && !hasTrailingAction)) {
      return this.focusPrimaryAction_();
    }
  }

  private focusNextAction_(evt: KeyboardEvent) {
    const key = evt.key;
    const hasTrailingAction = this.adapter_.hasTrailingAction();
    const dir = this.getDirection_(key);
    const source = this.getEvtSource_(evt);
    // Early exit if the key should jump keys or the chip only has one action (i.e. no trailing action)
    if (JUMP_CHIP_KEYS.has(key) || !hasTrailingAction) {
      this.removeFocus_();
      this.adapter_.notifyNavigation(key, source);
      return;
    }

    if (source === EventSource.Primary && dir === Direction.Right) {
      return this.focusTrailingAction_();
    }

    if (source === EventSource.Trailing && dir === Direction.Left) {
      return this.focusPrimaryAction_();
    }

    this.removeFocus_();
    this.adapter_.notifyNavigation(key, EventSource.None);
  }

  private getEvtSource_(evt: KeyboardEvent): EventSource {
    if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.PRIMARY_ACTION)) {
      return EventSource.Primary;
    }

    if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.TRAILING_ACTION)) {
      return EventSource.Trailing;
    }

    return EventSource.None;
  }

  private getDirection_(key: string): Direction {
    const isRTL = this.adapter_.isRTL();
    if (key === strings.ARROW_LEFT_KEY && !isRTL || key === strings.ARROW_RIGHT_KEY && isRTL) {
      return Direction.Left;
    }

    return Direction.Right;
  }

  private focusPrimaryAction_() {
    this.adapter_.setPrimaryActionAttr(strings.TAB_INDEX, '0');
    this.adapter_.focusPrimaryAction();
    this.adapter_.setTrailingActionAttr(strings.TAB_INDEX, '-1');
  }

  private focusTrailingAction_() {
    this.adapter_.setTrailingActionAttr(strings.TAB_INDEX, '0');
    this.adapter_.focusTrailingAction();
    this.adapter_.setPrimaryActionAttr(strings.TAB_INDEX, '-1');
  }

  private removeFocus_() {
    this.adapter_.setTrailingActionAttr(strings.TAB_INDEX, '-1');
    this.adapter_.setPrimaryActionAttr(strings.TAB_INDEX, '-1');
  }

  private removeChip_(evt: MouseEvent|KeyboardEvent) {
    evt.stopPropagation();
    if (this.shouldRemoveOnTrailingIconClick_) {
      this.beginExit();
    }
  }

  private shouldHandleInteraction_(evt: MouseEvent|KeyboardEvent): boolean {
    if (evt.type === 'click') {
      return true;
    }

    const keyEvt = evt as KeyboardEvent;
    return keyEvt.keyCode === 13 || keyEvt.key === strings.ENTER_KEY ||keyEvt.key === strings.SPACEBAR_KEY;
  }

  private shouldRemoveChip_(evt: KeyboardEvent): boolean {
    const isDeletable = this.adapter_.hasClass(cssClasses.DELETABLE);
    return isDeletable && (evt.key === strings.BACKSPACE_KEY || evt.key === strings.DELETE_KEY);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipFoundation;
