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

export interface MDCFormFieldInput {
  readonly ripple: MDCRipple | undefined;
}

export class MDCFormField extends MDCComponent<MDCFormFieldFoundation> {
  static attachTo(root: HTMLElement) {
    return new MDCFormField(root);
  }

  private input_?: MDCFormFieldInput;

  set input(input: MDCFormFieldInput | undefined) {
    this.input_ = input;
  }

  get input(): MDCFormFieldInput | undefined {
    return this.input_;
  }

  private get label_(): Element | null {
    const {LABEL_SELECTOR} = MDCFormFieldFoundation.strings;
    return this.root_.querySelector(LABEL_SELECTOR);
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCFormFieldAdapter = {
      activateInputRipple: () => {
        if (this.input_ && this.input_.ripple) {
          this.input_.ripple.activate();
        }
      },
      deactivateInputRipple: () => {
        if (this.input_ && this.input_.ripple) {
          this.input_.ripple.deactivate();
        }
      },
      deregisterInteractionHandler: (evtType, handler) => {
        if (this.label_) {
          (this.label_ as HTMLElement).removeEventListener(evtType, handler);
        }
      },
      registerInteractionHandler: (evtType, handler) => {
        if (this.label_) {
          (this.label_ as HTMLElement).addEventListener(evtType, handler);
        }
      },
    };
    return new MDCFormFieldFoundation(adapter);
  }
}
