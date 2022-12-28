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

import {MDCComponent} from '@material/base/component';

import {MDCLineRippleAdapter} from './adapter';
import {MDCLineRippleFoundation} from './foundation';

/** MDC Line Ripple Factory */
export type MDCLineRippleFactory =
    (el: Element, foundation?: MDCLineRippleFoundation) => MDCLineRipple;

/** MDC Line Ripple */
export class MDCLineRipple extends MDCComponent<MDCLineRippleFoundation> {
  static override attachTo(root: Element): MDCLineRipple {
    return new MDCLineRipple(root);
  }

  /**
   * Activates the line ripple
   */
  activate() {
    this.foundation.activate();
  }

  /**
   * Deactivates the line ripple
   */
  deactivate() {
    this.foundation.deactivate();
  }

  /**
   * Sets the transform origin given a user's click location.
   * The `rippleCenter` is the x-coordinate of the middle of the ripple.
   */
  setRippleCenter(xCoordinate: number) {
    this.foundation.setRippleCenter(xCoordinate);
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCLineRippleAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      hasClass: (className) => this.root.classList.contains(className),
      setStyle: (propertyName, value) => {
        (this.root as HTMLElement).style.setProperty(propertyName, value);
      },
      registerEventHandler: (evtType, handler) => {
        this.listen(evtType, handler);
      },
      deregisterEventHandler: (evtType, handler) => {
        this.unlisten(evtType, handler);
      },
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCLineRippleFoundation(adapter);
  }
}
