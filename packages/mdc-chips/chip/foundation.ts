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

import {MDCChipTrailingActionNavigationEvent} from '../trailingaction/types';

import {MDCChipAdapter} from './adapter';
import {cssClasses, Direction, EventSource, jumpChipKeys, navigationKeys, strings} from './constants';

const emptyClientRect = {	
  bottom: 0,	
  height: 0,	
  left: 0,	
  right: 0,	
  top: 0,	
  width: 0,	
};

enum FocusBehavior {
  SHOULD_FOCUS,
  SHOULD_NOT_FOCUS,
}

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
      getAttribute: () => null,
      getCheckmarkBoundingClientRect: () => emptyClientRect,
      getComputedStyleValue: () => '',
      getRootBoundingClientRect: () => emptyClientRect,
      hasClass: () => false,
      hasLeadingIcon: () => false,
      isRTL: () => false,
      isTrailingActionNavigable: () => false,
      notifyEditFinish: () => undefined,
      notifyEditStart: () => undefined,
      notifyInteraction: () => undefined,
      notifyNavigation: () => undefined,
      notifyRemoval: () => undefined,
      notifySelection: () => undefined,
      notifyTrailingIconInteraction: () => undefined,
      removeClass: () => undefined,
      removeClassFromLeadingIcon: () => undefined,
      removeTrailingActionFocus: () => undefined,
      setPrimaryActionAttr: () => undefined,
      setStyleProperty: () => undefined,
    };
  }


  /** Whether a trailing icon click should immediately trigger exit/removal of the chip. */
  private shouldRemoveOnTrailingIconClick_ = true;

  /**
   * Whether the primary action should receive focus on click. Should only be
   * set to true for clients who programmatically give focus to a different
   * element on the page when a chip is clicked (like a menu).
   */
  private shouldFocusPrimaryActionOnClick_ = true;

  isSelected() {
    return this.adapter.hasClass(cssClasses.SELECTED);
  }

  isEditable() {
    return this.adapter.hasClass(cssClasses.EDITABLE);
  }

  isEditing() {
    return this.adapter.hasClass(cssClasses.EDITING);
  }

  setSelected(selected: boolean) {
    this.setSelected_(selected);
    this.notifySelection_(selected);
  }

  setSelectedFromChipSet(selected: boolean, shouldNotifyClients: boolean) {
    this.setSelected_(selected);
    if (shouldNotifyClients) {
      this.notifyIgnoredSelection_(selected);
    }
  }

  getShouldRemoveOnTrailingIconClick() {
    return this.shouldRemoveOnTrailingIconClick_;
  }

  setShouldRemoveOnTrailingIconClick(shouldRemove: boolean) {
    this.shouldRemoveOnTrailingIconClick_ = shouldRemove;
  }

  setShouldFocusPrimaryActionOnClick(shouldFocus: boolean) {
    this.shouldFocusPrimaryActionOnClick_ = shouldFocus;
  }

  getDimensions(): ClientRect {
    const getRootRect = () => this.adapter.getRootBoundingClientRect();
    const getCheckmarkRect = () =>
        this.adapter.getCheckmarkBoundingClientRect();

    // When a chip has a checkmark and not a leading icon, the bounding rect changes in size depending on the current
    // size of the checkmark.
    if (!this.adapter.hasLeadingIcon()) {
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
    this.adapter.addClass(cssClasses.CHIP_EXIT);
  }

  handleClick() {
    this.adapter.notifyInteraction();
    this.setPrimaryActionFocusable_(this.getFocusBehavior_());
  }

  handleDoubleClick() {
    if (this.isEditable()) {
      this.startEditing();
    }
  }

  /**
   * Handles a transition end event on the root element.
   */
  handleTransitionEnd(evt: TransitionEvent) {
    // Handle transition end event on the chip when it is about to be removed.
    const shouldHandle =
        this.adapter.eventTargetHasClass(evt.target, cssClasses.CHIP_EXIT);
    const widthIsAnimating = evt.propertyName === 'width';
    const opacityIsAnimating = evt.propertyName === 'opacity';

    if (shouldHandle && opacityIsAnimating) {
      // See: https://css-tricks.com/using-css-transitions-auto-dimensions/#article-header-id-5
      const chipWidth = this.adapter.getComputedStyleValue('width');

      // On the next frame (once we get the computed width), explicitly set the chip's width
      // to its current pixel width, so we aren't transitioning out of 'auto'.
      requestAnimationFrame(() => {
        this.adapter.setStyleProperty('width', chipWidth);

        // To mitigate jitter, start transitioning padding and margin before width.
        this.adapter.setStyleProperty('padding', '0');
        this.adapter.setStyleProperty('margin', '0');

        // On the next frame (once width is explicitly set), transition width to 0.
        requestAnimationFrame(() => {
          this.adapter.setStyleProperty('width', '0');
        });
      });
      return;
    }

    if (shouldHandle && widthIsAnimating) {
      this.removeFocus();
      const removedAnnouncement =
          this.adapter.getAttribute(strings.REMOVED_ANNOUNCEMENT_ATTRIBUTE);

      this.adapter.notifyRemoval(removedAnnouncement);
    }

    // Handle a transition end event on the leading icon or checkmark, since the transition end event bubbles.
    if (!opacityIsAnimating) {
      return;
    }

    const shouldHideLeadingIcon =
        this.adapter.eventTargetHasClass(evt.target, cssClasses.LEADING_ICON) &&
        this.adapter.hasClass(cssClasses.SELECTED);
    const shouldShowLeadingIcon =
        this.adapter.eventTargetHasClass(evt.target, cssClasses.CHECKMARK) &&
        !this.adapter.hasClass(cssClasses.SELECTED);

    if (shouldHideLeadingIcon) {
      this.adapter.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
      return;
    }

    if (shouldShowLeadingIcon) {
      this.adapter.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
      return;
    }
  }

  handleFocusIn(evt: FocusEvent) {
    // Early exit if the event doesn't come from the primary action
    if (!this.eventFromPrimaryAction_(evt)) {
      return;
    }

    this.adapter.addClass(cssClasses.PRIMARY_ACTION_FOCUSED);
  }

  handleFocusOut(evt: FocusEvent) {
    // Early exit if the event doesn't come from the primary action
    if (!this.eventFromPrimaryAction_(evt)) {
      return;
    }

    if (this.isEditing()) {
      this.finishEditing();
    }

    this.adapter.removeClass(cssClasses.PRIMARY_ACTION_FOCUSED);
  }

  /**
   * Handles an interaction event on the trailing icon element. This is used to
   * prevent the ripple from activating on interaction with the trailing icon.
   */
  handleTrailingActionInteraction() {
    this.adapter.notifyTrailingIconInteraction();
    this.removeChip_();
  }

  /**
   * Handles a keydown event from the root element.
   */
  handleKeydown(evt: KeyboardEvent) {
    if (this.isEditing()) {
      if (this.shouldFinishEditing(evt)) {
        evt.preventDefault();
        this.finishEditing();
      }
      // When editing, the foundation should only handle key events that finish
      // the editing process.
      return;
    }

    if (this.isEditable()) {
      if (this.shouldStartEditing(evt)) {
        evt.preventDefault();
        this.startEditing();
      }
    }

    if (this.shouldNotifyInteraction_(evt)) {
      this.adapter.notifyInteraction();
      this.setPrimaryActionFocusable_(this.getFocusBehavior_());
      return;
    }

    if (this.isDeleteAction_(evt)) {
      evt.preventDefault();
      this.removeChip_();
      return;
    }

    // Early exit if the key is not usable
    if (!navigationKeys.has(evt.key)) {
      return;
    }

    // Prevent default behavior for movement keys which could include scrolling
    evt.preventDefault();
    this.focusNextAction_(evt.key, EventSource.PRIMARY);
  }

  handleTrailingActionNavigation(evt: MDCChipTrailingActionNavigationEvent) {
    return this.focusNextAction_(evt.detail.key, EventSource.TRAILING);
  }

  /**
   * Called by the chip set to remove focus from the chip actions.
   */
  removeFocus() {
    this.adapter.setPrimaryActionAttr(strings.TAB_INDEX, '-1');
    this.adapter.removeTrailingActionFocus();
  }

  /**
   * Called by the chip set to focus the primary action.
   *
   */
  focusPrimaryAction() {
    this.setPrimaryActionFocusable_(FocusBehavior.SHOULD_FOCUS);
  }

  /**
   * Called by the chip set to focus the trailing action (if present), otherwise
   * gives focus to the trailing action.
   */
  focusTrailingAction() {
    const trailingActionIsNavigable = this.adapter.isTrailingActionNavigable();
    if (trailingActionIsNavigable) {
      this.adapter.setPrimaryActionAttr(strings.TAB_INDEX, '-1');
      this.adapter.focusTrailingAction();
      return;
    }

    this.focusPrimaryAction();
  }

  private setPrimaryActionFocusable_(focusBehavior: FocusBehavior) {
    this.adapter.setPrimaryActionAttr(strings.TAB_INDEX, '0');
    if (focusBehavior === FocusBehavior.SHOULD_FOCUS) {
      this.adapter.focusPrimaryAction();
    }
    this.adapter.removeTrailingActionFocus();
  }

  private getFocusBehavior_(): FocusBehavior {
    if (this.shouldFocusPrimaryActionOnClick_) {
      return FocusBehavior.SHOULD_FOCUS;
    }
    return FocusBehavior.SHOULD_NOT_FOCUS;
  }

  private focusNextAction_(key: string, source: EventSource) {
    const isTrailingActionNavigable = this.adapter.isTrailingActionNavigable();
    const dir = this.getDirection_(key);

    // Early exit if the key should jump chips
    if (jumpChipKeys.has(key) || !isTrailingActionNavigable) {
      return this.adapter.notifyNavigation(key, source);
    }

    if (source === EventSource.PRIMARY && dir === Direction.RIGHT) {
      return this.focusTrailingAction();
    }

    if (source === EventSource.TRAILING && dir === Direction.LEFT) {
      return this.focusPrimaryAction();
    }

    this.adapter.notifyNavigation(key, EventSource.NONE);
  }

  private getDirection_(key: string): Direction {
    const isRTL = this.adapter.isRTL();
    const isLeftKey =
        key === strings.ARROW_LEFT_KEY || key === strings.IE_ARROW_LEFT_KEY;
    const isRightKey =
        key === strings.ARROW_RIGHT_KEY || key === strings.IE_ARROW_RIGHT_KEY;
    if (!isRTL && isLeftKey || isRTL && isRightKey) {
      return Direction.LEFT;
    }

    return Direction.RIGHT;
  }

  private removeChip_() {
    if (this.shouldRemoveOnTrailingIconClick_) {
      this.beginExit();
    }
  }

  private shouldStartEditing(evt: KeyboardEvent): boolean {
    return this.eventFromPrimaryAction_(evt) && evt.key === strings.ENTER_KEY;
  }

  private shouldFinishEditing(evt: KeyboardEvent): boolean {
    return evt.key === strings.ENTER_KEY;
  }

  private shouldNotifyInteraction_(evt: KeyboardEvent): boolean {
    return evt.key === strings.ENTER_KEY || evt.key === strings.SPACEBAR_KEY;
  }

  private isDeleteAction_(evt: KeyboardEvent): boolean {
    const isDeletable = this.adapter.hasClass(cssClasses.DELETABLE);
    return isDeletable &&
        (evt.key === strings.BACKSPACE_KEY || evt.key === strings.DELETE_KEY ||
         evt.key === strings.IE_DELETE_KEY);
  }

  private setSelected_(selected: boolean) {
    if (selected) {
      this.adapter.addClass(cssClasses.SELECTED);
      this.adapter.setPrimaryActionAttr(strings.ARIA_CHECKED, 'true');
    } else {
      this.adapter.removeClass(cssClasses.SELECTED);
      this.adapter.setPrimaryActionAttr(strings.ARIA_CHECKED, 'false');
    }
  }

  private notifySelection_(selected: boolean) {
    this.adapter.notifySelection(selected, false);
  }

  private notifyIgnoredSelection_(selected: boolean) {
    this.adapter.notifySelection(selected, true);
  }

  private eventFromPrimaryAction_(evt: Event) {
    return this.adapter.eventTargetHasClass(
        evt.target, cssClasses.PRIMARY_ACTION);
  }

  private startEditing() {
    this.adapter.addClass(cssClasses.EDITING);
    this.adapter.notifyEditStart();
  }

  private finishEditing() {
    this.adapter.removeClass(cssClasses.EDITING);
    this.adapter.notifyEditFinish();
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipFoundation;
