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

import {MDCSelectHelperTextAdapter} from './adapter';
import {MDCSelectHelperTextFoundation} from './foundation';

/** MDC Select Helper Text Factory */
export type MDCSelectHelperTextFactory =
    (el: HTMLElement, foundation?: MDCSelectHelperTextFoundation) =>
        MDCSelectHelperText;

/** MDC Select Helper Text */
export class MDCSelectHelperText extends
    MDCComponent<MDCSelectHelperTextFoundation> {
  static override attachTo(root: HTMLElement): MDCSelectHelperText {
    return new MDCSelectHelperText(root);
  }

  // Provided for access by MDCSelect component
  get foundationForSelect(): MDCSelectHelperTextFoundation {
    return this.foundation;
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCSelectHelperTextAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      hasClass: (className) => this.root.classList.contains(className),
      getAttr: (attr) => this.root.getAttribute(attr),
      setAttr: (attr, value) => {
        this.root.setAttribute(attr, value);
      },
      removeAttr: (attr) => {
        this.root.removeAttribute(attr);
      },
      setContent: (content) => {
        this.root.textContent = content;
      },
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCSelectHelperTextFoundation(adapter);
  }
}
