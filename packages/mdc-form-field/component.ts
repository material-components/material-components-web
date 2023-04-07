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
import {MDCRipple} from '@material/ripple/component';

import {MDCFormFieldAdapter} from './adapter';
import {MDCFormFieldFoundation} from './foundation';

/** MDC Form Field Input */
export interface MDCFormFieldInput {
  readonly ripple: MDCRipple|undefined;
}

/** MDC Form Field */
export class MDCFormField extends MDCComponent<MDCFormFieldFoundation> {
  static override attachTo(root: HTMLElement) {
    return new MDCFormField(root);
  }

  input?: MDCFormFieldInput;

  private labelEl() {
    const {LABEL_SELECTOR} = MDCFormFieldFoundation.strings;
    return this.root.querySelector<HTMLElement>(LABEL_SELECTOR);
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCFormFieldAdapter = {
      activateInputRipple: () => {
        if (this.input && this.input.ripple) {
          this.input.ripple.activate();
        }
      },
      deactivateInputRipple: () => {
        if (this.input && this.input.ripple) {
          this.input.ripple.deactivate();
        }
      },
      deregisterInteractionHandler: (evtType, handler) => {
        this.labelEl()?.removeEventListener(evtType, handler);
      },
      registerInteractionHandler: (evtType, handler) => {
        this.labelEl()?.addEventListener(evtType, handler);
      },
    };
    return new MDCFormFieldFoundation(adapter);
  }
}
