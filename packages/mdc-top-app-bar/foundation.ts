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
import {SpecificEventListener} from '@material/base/types';
import {MDCTopAppBarAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';

class MDCTopAppBarBaseFoundation extends MDCFoundation<MDCTopAppBarAdapter> {
  static get strings() {
    return strings;
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get numbers() {
    /* istanbul ignore next: we don't access this property in our unit tests, but we still need to expose it publicly */
    return numbers;
  }

  /**
   * See {@link MDCTopAppBarAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCTopAppBarAdapter {
    // tslint:disable:object-literal-sort-keys
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      setStyle: () => undefined,
      getTopAppBarHeight: () => 0,
      registerNavigationIconInteractionHandler: () => undefined,
      deregisterNavigationIconInteractionHandler: () => undefined,
      notifyNavigationIconClicked: () => undefined,
      registerScrollHandler: () => undefined,
      deregisterScrollHandler: () => undefined,
      registerResizeHandler: () => undefined,
      deregisterResizeHandler: () => undefined,
      getViewportScrollY: () =>  0,
      getTotalActionItems: () =>  0,
    };
    // tslint:enable:object-literal-sort-keys
  }

  protected scrollHandler_?: SpecificEventListener<'scroll'>;
  protected resizeHandler_?: SpecificEventListener<'resize'>;
  private readonly navClickHandler_: SpecificEventListener<'click'>;

  /* istanbul ignore next: optional argument is not a branch statement */
  constructor(adapter?: Partial<MDCTopAppBarAdapter>) {
    super({...MDCTopAppBarBaseFoundation.defaultAdapter, ...adapter});

    this.navClickHandler_ = () => this.adapter_.notifyNavigationIconClicked();
  }

  init() {
    if (this.scrollHandler_) {
      this.adapter_.registerScrollHandler(this.scrollHandler_);
    }
    if (this.resizeHandler_) {
      this.adapter_.registerResizeHandler(this.resizeHandler_);
    }
    this.adapter_.registerNavigationIconInteractionHandler('click', this.navClickHandler_);
  }

  destroy() {
    if (this.scrollHandler_) {
      this.adapter_.deregisterScrollHandler(this.scrollHandler_);
    }
    if (this.resizeHandler_) {
      this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    }
    this.adapter_.deregisterNavigationIconInteractionHandler('click', this.navClickHandler_);
  }
}

export {MDCTopAppBarBaseFoundation as default, MDCTopAppBarBaseFoundation};
