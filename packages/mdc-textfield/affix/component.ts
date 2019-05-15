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

import {MDCComponent} from '@material/base/component';
import {MDCTextFieldAffixAdapter} from './adapter';
import {MDCTextFieldAffixFoundation} from './foundation';

export type MDCTextFieldAffixFactory =
    (el: Element, foundation?: MDCTextFieldAffixFoundation) => MDCTextFieldAffix;

export class MDCTextFieldAffix extends MDCComponent<MDCTextFieldAffixFoundation> {
  static attachTo(root: Element): MDCTextFieldAffix {
    return new MDCTextFieldAffix(root);
  }

  get foundation(): MDCTextFieldAffixFoundation {
    return this.foundation_;
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTextFieldAffixAdapter = {
      getWidth: () => {
        const rect = this.root_.getBoundingClientRect();
        return rect.right - rect.left;
      },
      addClass: (className: string) => this.root_.classList.add(className),
      removeClass: (className: string) => this.root_.classList.remove(className),
      hasClass: (className: string) => this.root_.classList.contains(className),
      isRtl: () => document.dir === 'rtl',
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTextFieldAffixFoundation(adapter);
  }
}
