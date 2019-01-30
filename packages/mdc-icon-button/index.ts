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
import MDCIconButtonToggleFoundation from './foundation';
import {MDCRipple} from '@material/ripple/index';

class MDCIconButtonToggle extends MDCComponent<MDCIconButtonToggleFoundation> {
  static attachTo(root: Element) {
    return new MDCIconButtonToggle(root);
  }

  private ripple_: MDCRipple;
  private handleClick_ = () => {};

  // tslint:disable-next-line:no-any a component can pass in anything it needs to the constructor
  constructor(...args) {
    super(...args);

    this.ripple_ = this.initRipple_();
    this.handleClick_ = () => this.foundation_.handleClick();
  }

  private initRipple_(): MDCRipple {
    const ripple = new MDCRipple(this.root_);
    ripple.unbounded = true;
    return ripple;
  }

  destroy() {
    this.root_.removeEventListener('click', this.handleClick_);
    this.ripple_.destroy();
    super.destroy();
  }

  getDefaultFoundation(): MDCIconButtonToggleFoundation {
    return new MDCIconButtonToggleFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      setAttr: (attrName, attrValue) => this.root_.setAttribute(attrName, attrValue),
      notifyChange: (evtData) => this.emit(MDCIconButtonToggleFoundation.strings.CHANGE_EVENT, evtData),
    });
  }

  initialSyncWithDOM() {
    this.root_.addEventListener('click', this.handleClick_);
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
}

export {MDCIconButtonToggle, MDCIconButtonToggleFoundation};
