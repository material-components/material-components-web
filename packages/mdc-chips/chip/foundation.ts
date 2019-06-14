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
import {cssClasses, strings} from './constants';
import { MDCChipNavigationFocus } from './types';

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
      textHasFocus: () => false,
      eventTargetHasClass: () => false,
      focusText: () => undefined,
      focusTrailingIcon: () => undefined,
      getCheckmarkBoundingClientRect: () => emptyClientRect,
      getComputedStyleValue: () => '',
      getRootBoundingClientRect: () => emptyClientRect,
      hasClass: () => false,
      hasLeadingIcon: () => false,
      hasTrailingIcon: () => false,
      isRTL: () => false,
      notifyInteraction: () => undefined,
      notifyNavigation: () => undefined,
      notifyRemoval: () => undefined,
      notifySelection: () => undefined,
      notifyTrailingIconInteraction: () => undefined,
      removeClass: () => undefined,
      removeClassFromLeadingIcon: () => undefined,
      setTextAttr: () => undefined,
      setTrailingIconAttr: () => undefined,
      setStyleProperty: () => undefined,
      trailingIconHasFocus: () => false,
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
      this.adapter_.setTextAttr(strings.ARIA_CHECKED, 'true');
    } else {
      this.adapter_.removeClass(cssClasses.SELECTED);
      this.adapter_.setTextAttr(strings.ARIA_CHECKED, 'false');
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
    const isEnter = (evt as KeyboardEvent).key === 'Enter' || (evt as KeyboardEvent).keyCode === 13;
    if (evt.type === 'click' || isEnter) {
      this.adapter_.notifyInteraction();
    }
  }

  /**
   * Handles a transition end event on the root element.
   */
  handleTransitionEnd(evt: TransitionEvent) {
    // Handle transition end event on the chip when it is about to be removed.
    if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.CHIP_EXIT)) {
      if (evt.propertyName === 'width') {
        this.adapter_.notifyRemoval();
      } else if (evt.propertyName === 'opacity') {
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
      }
      return;
    }

    // Handle a transition end event on the leading icon or checkmark, since the transition end event bubbles.
    if (evt.propertyName !== 'opacity') {
      return;
    }
    if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.LEADING_ICON) &&
        this.adapter_.hasClass(cssClasses.SELECTED)) {
      this.adapter_.addClassToLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
    } else if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.CHECKMARK) &&
        !this.adapter_.hasClass(cssClasses.SELECTED)) {
      this.adapter_.removeClassFromLeadingIcon(cssClasses.HIDDEN_LEADING_ICON);
    }
  }

  /**
   * Handles an interaction event on the trailing icon element. This is used to
   * prevent the ripple from activating on interaction with the trailing icon.
   */
  handleTrailingIconInteraction(evt: MouseEvent | KeyboardEvent) {
    const isEnter = (evt as KeyboardEvent).key === 'Enter' || (evt as KeyboardEvent).keyCode === 13;
    if (evt.type === 'click' || isEnter) {
      evt.stopPropagation();
      this.adapter_.notifyTrailingIconInteraction();
      if (this.shouldRemoveOnTrailingIconClick_) {
        this.beginExit();
      }
    }
  }

  /**
   * Handles a keydown event from the root element.
   */
  handleKeydown(evt: KeyboardEvent) {
    const key = evt.key;
    // Early exit if the key is not usable
    if (!NAVIGATION_KEYS.has(key)) {
      return;
    }

    // Prevent default behavior for movement keys which could include scrolling
    evt.preventDefault();
    this.focusNextAction_(key);
  }

  focusAction(key: string, source: MDCChipNavigationFocus) {
    // Early exit if the key is not usable
    if (!NAVIGATION_KEYS.has(key)) {
      return;
    }

    const keyShouldJumpCells = key === strings.ARROW_UP_KEY
      || key === strings.ARROW_DOWN_KEY
      || key === strings.HOME_KEY
      || key === strings.END_KEY;
    const chipHasTrailingIcon = this.adapter_.hasTrailingIcon();
    if (keyShouldJumpCells && source === MDCChipNavigationFocus.Text || !chipHasTrailingIcon) {
      return this.focusChipText_();
    }

    if (keyShouldJumpCells && source === MDCChipNavigationFocus.TrailingIcon && chipHasTrailingIcon) {
      return this.focusTrailingIcon_();
    }

    this.focusNextAction_(key);
  }

  private focusNextAction_(key: string) {
    const chipIsRTL = this.adapter_.isRTL();
    const chipHasTrailingIcon = this.adapter_.hasTrailingIcon();
    const focusSource = this.getFocusSource_();
    const keyIsLeft = key === strings.ARROW_LEFT_KEY && !chipIsRTL || key === strings.ARROW_RIGHT_KEY && chipIsRTL;
    const keyIsRight = key === strings.ARROW_RIGHT_KEY && !chipIsRTL || key === strings.ARROW_LEFT_KEY && chipIsRTL;
    const shouldFocusPrimaryAction = keyIsLeft && focusSource === MDCChipNavigationFocus.TrailingIcon
      || keyIsRight && focusSource === MDCChipNavigationFocus.None;
    const shouldFocusTrailingIcon = keyIsRight && focusSource === MDCChipNavigationFocus.Text
      || keyIsLeft && focusSource === MDCChipNavigationFocus.None;
    if (shouldFocusPrimaryAction) {
      return this.focusChipText_();
    }

    if (chipHasTrailingIcon && shouldFocusTrailingIcon) {
      return this.focusTrailingIcon_();
    }

    this.removeFocus_();
    this.adapter_.notifyNavigation(key, focusSource);
  }

  private getFocusSource_(): MDCChipNavigationFocus {
    if (this.adapter_.textHasFocus()) {
      return MDCChipNavigationFocus.Text;
    }

    if (this.adapter_.trailingIconHasFocus()) {
      return MDCChipNavigationFocus.TrailingIcon;
    }

    return MDCChipNavigationFocus.None;
  }

  private focusChipText_() {
    this.adapter_.setTextAttr(strings.TAB_INDEX, '0');
    this.adapter_.focusText();
    this.adapter_.setTrailingIconAttr(strings.TAB_INDEX, '-1');
  }

  private focusTrailingIcon_() {
    this.adapter_.setTrailingIconAttr(strings.TAB_INDEX, '0');
    this.adapter_.focusTrailingIcon();
    this.adapter_.setTextAttr(strings.TAB_INDEX, '-1');
  }

  private removeFocus_() {
    this.adapter_.setTrailingIconAttr(strings.TAB_INDEX, '-1');
    this.adapter_.setTextAttr(strings.TAB_INDEX, '-1');
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipFoundation;
