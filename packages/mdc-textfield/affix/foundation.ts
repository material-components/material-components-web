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
import {MDCTextFieldAffixAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCTextFieldAffixFoundation extends MDCFoundation<MDCTextFieldAffixAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCTextFieldAffixAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      getWidth: () => 0,
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      isRtl: () => false,
    };
    // tslint:enable:object-literal-sort-keys
  }

  constructor(adapter?: Partial<MDCTextFieldAffixAdapter>) {
    super({...MDCTextFieldAffixFoundation.defaultAdapter, ...adapter});
  }

  setVisible(visible: boolean) {
    if (visible) {
      this.adapter_.addClass(cssClasses.AFFIX_VISIBLE);
    } else {
      this.adapter_.removeClass(cssClasses.AFFIX_VISIBLE);
    }
  }

  getInputPadding(): { property: string; value: string; } {
    return {
      property: this.getInputPaddingProperty_(),
      value: this.adapter_.getWidth() + 'px',
    };
  }

  private getInputPaddingProperty_(): string {
    if (this.adapter_.hasClass(cssClasses.PREFIX)) {
      return this.paddingStartProperty_;
    } else {
      return this.paddingEndProperty_;
    }
  }

  private get paddingStartProperty_(): string {
    if (this.adapter_.isRtl()) {
      return 'padding-right';
    } else {
      return 'padding-left';
    }
  }

  private get paddingEndProperty_(): string {
    if (this.adapter_.isRtl()) {
      return 'padding-left';
    } else {
      return 'padding-right';
    }
  }
}
