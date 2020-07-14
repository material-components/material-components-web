/**
 * @license
 * Copyright 2020 Google Inc.
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
import {MDCSegmentedButtonSegmentAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCSegmentedButtonSegmentFoundation extends MDCFoundation<MDCSegmentedButtonSegmentAdapter> {
  static get defaultAdapter(): MDCSegmentedButtonSegmentAdapter {
    return {
      isSingleSelect: () => false,
      getAttr: () => '',
      setAttr: () => undefined,
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      notifySelectedChange: () => undefined
    }
  }

  constructor(adapter?: Partial<MDCSegmentedButtonSegmentAdapter>) {
    super({...MDCSegmentedButtonSegmentFoundation.defaultAdapter, ...adapter});
  }

  isSelected(): boolean {
    return this.adapter.hasClass(cssClasses.SELECTED);
  }

  setSelected() {
    this.adapter.addClass(cssClasses.SELECTED);
    this.setAriaAttr_(strings.TRUE);
  }

  setUnselected() {
    this.adapter.removeClass(cssClasses.SELECTED);
    this.setAriaAttr_(strings.FALSE);
  }

  getSegmentId(): string | null {
    return this.adapter.getAttr(strings.DATA_SEGMENT_ID);
  }

  handleClick(): void {
    if (this.adapter.isSingleSelect()) {
      this.setSelected();
    } else {
      this.toggleSelection_();
    }
    this.adapter.notifySelectedChange(this.isSelected());
  }

  private toggleSelection_() {
    if (this.isSelected()) {
      this.setUnselected();
    } else {
      this.setSelected();
    }
  }

  private setAriaAttr_(value: string) {
    if (this.adapter.isSingleSelect()) {
      this.adapter.setAttr(strings.ARIA_CHECKED, value);
    } else {
      this.adapter.setAttr(strings.ARIA_PRESSED, value);
    }
  }
}
