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

import {MDCFoundation} from '@material/base/foundation';
import {MDCTabAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCTabDimensions} from './types';

export class MDCTabFoundation extends MDCFoundation<MDCTabAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCTabAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      setAttr: () => undefined,
      activateIndicator: () => undefined,
      deactivateIndicator: () => undefined,
      notifyInteracted: () => undefined,
      getOffsetLeft: () => 0,
      getOffsetWidth: () => 0,
      getContentOffsetLeft: () => 0,
      getContentOffsetWidth: () => 0,
      focus: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private focusOnActivate = true;

  constructor(adapter?: Partial<MDCTabAdapter>) {
    super({...MDCTabFoundation.defaultAdapter, ...adapter});
  }

  handleClick() {
    // It's up to the parent component to keep track of the active Tab and
    // ensure we don't activate a Tab that's already active.
    this.adapter.notifyInteracted();
  }

  isActive(): boolean {
    return this.adapter.hasClass(cssClasses.ACTIVE);
  }

  /**
   * Sets whether the tab should focus itself when activated
   */
  setFocusOnActivate(focusOnActivate: boolean) {
    this.focusOnActivate = focusOnActivate;
  }

  /**
   * Activates the Tab
   */
  activate(previousIndicatorClientRect?: ClientRect) {
    this.adapter.addClass(cssClasses.ACTIVE);
    this.adapter.setAttr(strings.ARIA_SELECTED, 'true');
    this.adapter.setAttr(strings.TABINDEX, '0');
    this.adapter.activateIndicator(previousIndicatorClientRect);
    if (this.focusOnActivate) {
      this.adapter.focus();
    }
  }

  /**
   * Deactivates the Tab
   */
  deactivate() {
    // Early exit
    if (!this.isActive()) {
      return;
    }

    this.adapter.removeClass(cssClasses.ACTIVE);
    this.adapter.setAttr(strings.ARIA_SELECTED, 'false');
    this.adapter.setAttr(strings.TABINDEX, '-1');
    this.adapter.deactivateIndicator();
  }

  /**
   * Returns the dimensions of the Tab
   */
  computeDimensions(): MDCTabDimensions {
    const rootWidth = this.adapter.getOffsetWidth();
    const rootLeft = this.adapter.getOffsetLeft();
    const contentWidth = this.adapter.getContentOffsetWidth();
    const contentLeft = this.adapter.getContentOffsetLeft();

    return {
      contentLeft: rootLeft + contentLeft,
      contentRight: rootLeft + contentLeft + contentWidth,
      rootLeft,
      rootRight: rootLeft + rootWidth,
    };
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabFoundation;
