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

// TODO: ADD TSDOC!
export class FocusTrap {
  constructor(private el: HTMLElement) {}

  trapFocus() {
    this.wrapFocus_(this.el);
  }

  releaseFocus() {
    this.el.querySelectorAll(FOCUS_SENTINEL_CLASS).forEach((sentinelEl) => {
      sentinelEl.parentElement!.removeChild(sentinelEl);
    });
   }

  wrapFocus_(el: HTMLElement) {
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

  focusFirst_(el: HTMLElement) {
    const focusableEls = this.getFocusableElements_(el);
    if (focusableEls.length > 0) {
      focusableEls[0].focus();
    }
  }

  focusLast_(el: HTMLElement) {
    const focusableEls = this.getFocusableElements_(el);
    if (focusableEls.length > 0) {
      focusableEls[focusableEls.length - 1].focus();
    }
  }

  getFocusableElements_(root: HTMLElement): HTMLElement[] {
    const focusableEls = Array.from(
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

  createSentinel_() {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('tabindex', '0');
    // Don't announce in screen readers.
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.classList.add(FOCUS_SENTINEL_CLASS);
    return sentinel;
  }
}