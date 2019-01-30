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

import MDCComponent from '@material/base/component';
import {MDCSelectionControl} from '@material/selection-control/index';
import {MDCFormFieldFoundation} from './foundation';

class MDCFormField extends MDCComponent<MDCFormFieldFoundation> {
  static attachTo(root: HTMLElement) {
    return new MDCFormField(root);
  }

  private input_?: MDCSelectionControl;

  set input(input: MDCSelectionControl | undefined) {
    this.input_ = input;
  }

  get input(): MDCSelectionControl | undefined {
    return this.input_;
  }

  private get label_(): Element | null {
    const {LABEL_SELECTOR} = MDCFormFieldFoundation.strings;
    return this.root_.querySelector(LABEL_SELECTOR);
  }

  getDefaultFoundation() {
    return new MDCFormFieldFoundation({
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
      deregisterInteractionHandler: (type, handler) => this.label_ && this.label_.removeEventListener(type, handler),
      registerInteractionHandler: (type, handler) => this.label_ && this.label_.addEventListener(type, handler),
    });
  }
}

export {MDCFormField, MDCFormFieldFoundation};
