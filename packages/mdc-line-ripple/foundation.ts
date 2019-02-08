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

import {SpecificEventListener} from '@material/base';
import {MDCFoundation} from '@material/base/foundation';
import {MDCLineRippleAdapter} from './adapter';
import {cssClasses} from './constants';

class MDCLineRippleFoundation extends MDCFoundation<MDCLineRippleAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * See {@link MDCLineRippleAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCLineRippleAdapter {
    // tslint:disable:object-literal-sort-keys
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      setStyle: () => undefined,
      registerEventHandler: () => undefined,
      deregisterEventHandler: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private readonly transitionEndHandler_: SpecificEventListener<'transitionend'>;

  constructor(adapter?: MDCLineRippleAdapter) {
    super(Object.assign(MDCLineRippleFoundation.defaultAdapter, adapter));

    this.transitionEndHandler_ = (evt) => this.handleTransitionEnd(evt);
  }

  init() {
    this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);
  }

  destroy() {
    this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);
  }

  activate() {
    this.adapter_.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING);
    this.adapter_.addClass(cssClasses.LINE_RIPPLE_ACTIVE);
  }

  setRippleCenter(xCoordinate: number) {
    this.adapter_.setStyle('transform-origin', `${xCoordinate}px center`);
  }

  deactivate() {
    this.adapter_.addClass(cssClasses.LINE_RIPPLE_DEACTIVATING);
  }

  handleTransitionEnd(evt: TransitionEvent) {
    // Wait for the line ripple to be either transparent or opaque
    // before emitting the animation end event
    const isDeactivating = this.adapter_.hasClass(cssClasses.LINE_RIPPLE_DEACTIVATING);

    if (evt.propertyName === 'opacity') {
      if (isDeactivating) {
        this.adapter_.removeClass(cssClasses.LINE_RIPPLE_ACTIVE);
        this.adapter_.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING);
      }
    }
  }
}

export {MDCLineRippleFoundation as default, MDCLineRippleFoundation};
