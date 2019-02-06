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

import MDCComponent from '@material/base/component';
import {SpecificEventListener} from '@material/base/index';
import {MDCRipple} from '@material/ripple/index';
import MDCIconButtonToggleFoundation from './foundation';

class MDCIconButtonToggle extends MDCComponent<MDCIconButtonToggleFoundation> {
  static attachTo(root: HTMLElement) {
    return new MDCIconButtonToggle(root);
  }

  protected root_!: HTMLElement; // assigned in MDCComponent constructor

  private ripple_: MDCRipple = this.initRipple_();
  private handleClick_!: SpecificEventListener<'click'>; // assigned in initialSyncWithDOM()

  initialSyncWithDOM() {
    this.handleClick_ = () => this.foundation_.handleClick();
    this.root_.addEventListener('click', this.handleClick_);
  }

  destroy() {
    this.root_.removeEventListener('click', this.handleClick_);
    this.ripple_.destroy();
    super.destroy();
  }

  getDefaultFoundation(): MDCIconButtonToggleFoundation {
    return new MDCIconButtonToggleFoundation({
      addClass: (className) => this.root_.classList.add(className),
      hasClass: (className) => this.root_.classList.contains(className),
      notifyChange: (evtData) => this.emit(MDCIconButtonToggleFoundation.strings.CHANGE_EVENT, evtData),
      removeClass: (className) => this.root_.classList.remove(className),
      setAttr: (attrName, attrValue) => this.root_.setAttribute(attrName, attrValue),
    });
  }

  get ripple(): MDCRipple {
    return this.ripple_;
  }

  get on(): boolean {
    return this.foundation_.isOn();
  }

  set on(isOn: boolean) {
    this.foundation_.toggle(isOn);
  }

  private initRipple_(): MDCRipple {
    const ripple = new MDCRipple(this.root_);
    ripple.unbounded = true;
    return ripple;
  }
}

export {MDCIconButtonToggle, MDCIconButtonToggleFoundation};
