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

const FOCUS_SENTINEL_CLASS = 'mdc-focus-sentinel';

/**
 * Utility to trap focus in a given element, e.g. for modal components such
 * as dialogs.
 * Also tracks the previously focused element, and restores focus to that
 * element when releasing focus.
 */
export class FocusTrap {
  // Previously focused element before trapping focus.
  private elFocusedBeforeTrapFocus: HTMLElement | null = null;

  constructor(private el: HTMLElement, private options: FocusOptions = {}) {}

  /**
   * Traps focus in `el`. Also focuses on either `initialFocusEl` if set;
   * otherwises sets initial focus to the first focusable child element.
   */
  trapFocus() {
    this.elFocusedBeforeTrapFocus =
        document.activeElement instanceof HTMLElement ?
        document.activeElement : null;
    this.wrapTabFocus_(this.el);

    if (!this.options.skipInitialFocus) {
      this.focusInitialElement_(this.options.initialFocusEl);
    }
  }

  /**
   * Releases focus from `el`. Also restores focus to the previously focused
   * element.
   */
  releaseFocus() {
    [].slice.call(this.el.querySelectorAll(`.${FOCUS_SENTINEL_CLASS}`))
    .forEach((sentinelEl: HTMLElement) => {
      sentinelEl.parentElement!.removeChild(sentinelEl);
    });

    if (this.elFocusedBeforeTrapFocus) {
      this.elFocusedBeforeTrapFocus.focus();
    }
  }

  /**
   * Wraps tab focus within `el` by adding two hidden sentinel divs which are
   * used to mark the beginning and the end of the tabbable region. When
   * focused, these sentinel elements redirect focus to the first/last
   * children elements of the tabbable region, ensuring that focus is trapped
   * within that region.
   */
  private wrapTabFocus_(el: HTMLElement) {
    const sentinelStart = this.createSentinel_();
    const sentinelEnd = this.createSentinel_();

    sentinelStart.addEventListener('focus', () => {
      this.focusLast_(el);
    })
    sentinelEnd.addEventListener('focus', () => {
      this.focusFirst_(el);
    })

    el.insertBefore(sentinelStart, el.children[0]);
    el.appendChild(sentinelEnd);
  }

  /**
   * Focuses on `initialFocusEl` if defined and a child of the root element.
   * Otherwise, focuses on the first focusable child element of the root.
   */
  private focusInitialElement_(initialFocusEl?: HTMLElement) {
    const focusableElements = this.getFocusableElements_(this.el);
    const focusIndex = Math.max(
      initialFocusEl ? focusableElements.indexOf(initialFocusEl) : 0,
      0);
    focusableElements[focusIndex].focus();
  }

  /**
   * Focuses first focusable child element of `el`.
   */
  private focusFirst_(el: HTMLElement) {
    const focusableEls = this.getFocusableElements_(el);
    if (focusableEls.length > 0) {
      focusableEls[0].focus();
    }
  }

  /**
   * Focuses last focusable child element of `el`.
   */
  private focusLast_(el: HTMLElement) {
    const focusableEls = this.getFocusableElements_(el);
    if (focusableEls.length > 0) {
      focusableEls[focusableEls.length - 1].focus();
    }
  }

  private getFocusableElements_(root: HTMLElement): HTMLElement[] {
    const focusableEls = [].slice.call(
      root.querySelectorAll('[autofocus], [tabindex], a, input, textarea, select, button')) as HTMLElement[];
    return focusableEls.filter((el) => {
      const isDisabledOrHidden =
        el.getAttribute('aria-disabled') === 'true' ||
        el.getAttribute('disabled') != null ||
        el.getAttribute('hidden') != null ||
        el.getAttribute('aria-hidden') === 'true';
      const isTabbableAndVisible = el.tabIndex >= 0 &&
        el.getBoundingClientRect().width > 0 &&
        !el.classList.contains(FOCUS_SENTINEL_CLASS) &&
        !isDisabledOrHidden;

      let isProgrammaticallyHidden = false;
      if (isTabbableAndVisible) {
        const style = getComputedStyle(el);
        isProgrammaticallyHidden =
          style.display === 'none' || style.visibility == '=hidden';
      }
      return isTabbableAndVisible && !isProgrammaticallyHidden;
    });
  }

  private createSentinel_() {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('tabindex', '0');
    // Don't announce in screen readers.
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.classList.add(FOCUS_SENTINEL_CLASS);
    return sentinel;
  }
}

export interface FocusOptions {
  // The element to focus initially when trapping focus.
  //  Must be a child of the root element.
  initialFocusEl?: HTMLElement,

  // Whether to skip initially focusing on any element when trapping focus.
  // By default, focus is set on the first focusable child element of the root.
  skipInitialFocus?: boolean,
}
