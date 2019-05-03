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

import {MDCFoundation} from '@material/base/foundation';
import {SpecificEventListener} from '@material/base/types';
import {MDCTabAdapter} from './adapter';
import {cssClasses, strings} from './constants';

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
      registerInteractionHandler: () => undefined,
      deregisterInteractionHandler: () => undefined,
      getOffsetWidth: () => 0,
      getOffsetLeft: () => 0,
      notifySelected: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private computedWidth_ = 0;
  private computedLeft_ = 0;
  private isActive_ = false;
  private preventDefaultOnClick_ = false;

  private readonly clickHandler_: SpecificEventListener<'click'>;
  private readonly keydownHandler_: SpecificEventListener<'keydown'>;

  constructor(adapter?: Partial<MDCTabAdapter>) {
    super({...MDCTabFoundation.defaultAdapter, ...adapter});

    this.clickHandler_ = (evt) => {
      if (this.preventDefaultOnClick_) {
        evt.preventDefault();
      }
      this.adapter_.notifySelected();
    };

    this.keydownHandler_ = (evt) => {
      if (evt.key === 'Enter' || evt.keyCode === 13) {
        this.adapter_.notifySelected();
      }
    };
  }

  init() {
    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
  }

  getComputedWidth() {
    return this.computedWidth_;
  }

  getComputedLeft() {
    return this.computedLeft_;
  }

  isActive() {
    return this.isActive_;
  }

  setActive(isActive: boolean) {
    this.isActive_ = isActive;
    if (this.isActive_) {
      this.adapter_.addClass(cssClasses.ACTIVE);
    } else {
      this.adapter_.removeClass(cssClasses.ACTIVE);
    }
  }

  preventsDefaultOnClick() {
    return this.preventDefaultOnClick_;
  }

  setPreventDefaultOnClick(preventDefaultOnClick: boolean) {
    this.preventDefaultOnClick_ = preventDefaultOnClick;
  }

  measureSelf() {
    this.computedWidth_ = this.adapter_.getOffsetWidth();
    this.computedLeft_ = this.adapter_.getOffsetLeft();
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabFoundation;
