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
import {MDCRipple} from '@material/ripple/index';

import {cssClasses} from './constants';
import MDCTabFoundation from './foundation';

export {MDCTabFoundation};

export class MDCTab extends MDCComponent<MDCTabFoundation> {
  static attachTo(root: HTMLElement) {
    return new MDCTab(root);
  }

  ripple_!: MDCRipple;

  get computedWidth() {
    return this.foundation_.getComputedWidth();
  }

  get computedLeft() {
    return this.foundation_.getComputedLeft();
  }

  get isActive() {
    return this.foundation_.isActive();
  }

  set isActive(isActive) {
    this.foundation_.setActive(isActive);
  }

  get preventDefaultOnClick() {
    return this.foundation_.preventsDefaultOnClick();
  }

  set preventDefaultOnClick(preventDefaultOnClick) {
    this.foundation_.setPreventDefaultOnClick(preventDefaultOnClick);
  }

  constructor(root: HTMLElement, foundation?: MDCTabFoundation, ...args) {
    super(root, foundation, ...args);

    this.ripple_ = MDCRipple.attachTo(this.root_);
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  getDefaultFoundation() {
    return new MDCTabFoundation({
      addClass: (className: string) => this.root_.classList.add(className),
      deregisterInteractionHandler: (type: string, handler: EventListener) =>
        this.root_.removeEventListener(type, handler),
      getOffsetLeft: () => this.root_.offsetLeft,
      getOffsetWidth: () => this.root_.offsetWidth,
      notifySelected: () => this.emit(MDCTabFoundation.strings.SELECTED_EVENT, {tab: this}, true),
      registerInteractionHandler: (type: string, handler: EventListener) => this.root_.addEventListener(type, handler),
      removeClass: (className: string) => this.root_.classList.remove(className),
    });
  }

  initialSyncWithDOM() {
    this.isActive = this.root_.classList.contains(cssClasses.ACTIVE);
  }

  measureSelf() {
    this.foundation_.measureSelf();
  }
}
