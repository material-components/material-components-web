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
import {MDCIconButtonToggleAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCIconButtonToggleFoundation extends MDCFoundation<MDCIconButtonToggleAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCIconButtonToggleAdapter {
    return {
      addClass: () => undefined,
      hasClass: () => false,
      notifyChange: () => undefined,
      removeClass: () => undefined,
      setAttr: () => undefined,
    };
  }

  constructor(adapter?: Partial<MDCIconButtonToggleAdapter>) {
    super({...MDCIconButtonToggleFoundation.defaultAdapter, ...adapter});
  }

  init() {
    this.adapter_.setAttr(strings.ARIA_PRESSED, `${this.isOn()}`);
  }

  handleClick() {
    this.toggle();
    this.adapter_.notifyChange({isOn: this.isOn()});
  }

  isOn(): boolean {
    return this.adapter_.hasClass(cssClasses.ICON_ON);
  }

  toggle(isOn: boolean = !this.isOn()) {
    if (isOn) {
      this.adapter_.addClass(cssClasses.ICON_ON);
    } else {
      this.adapter_.removeClass(cssClasses.ICON_ON);
    }

    this.adapter_.setAttr(strings.ARIA_PRESSED, `${isOn}`);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCIconButtonToggleFoundation;
