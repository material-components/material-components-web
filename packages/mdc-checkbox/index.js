/**
 * @license
 * Copyright 2016 Google Inc.
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

import {getCorrectEventName} from '@material/animation/index';
import MDCComponent from '@material/base/component';
/* eslint-disable no-unused-vars */
import {MDCSelectionControlState, MDCSelectionControl} from '@material/selection-control/index';
/* eslint-enable no-unused-vars */
import MDCCheckboxFoundation from './foundation';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';
import {getMatchesProperty} from '@material/ripple/util';

/**
 * @extends MDCComponent<!MDCCheckboxFoundation>
 * @implements {MDCSelectionControl}
 */
class MDCCheckbox extends MDCComponent {
  static attachTo(root) {
    return new MDCCheckbox(root);
  }

  /**
   * Returns the state of the native control element, or null if the native control element is not present.
   * @return {?MDCSelectionControlState}
   * @private
   */
  get nativeCb_() {
    const {NATIVE_CONTROL_SELECTOR} = MDCCheckboxFoundation.strings;
    const cbEl = /** @type {?MDCSelectionControlState} */ (
      this.root_.querySelector(NATIVE_CONTROL_SELECTOR));
    return cbEl;
  }

  constructor(...args) {
    super(...args);

    /** @private {!MDCRipple} */
    this.ripple_ = this.initRipple_();
    /** @private {!Function} */
    this.handleChange_;
    /** @private {!Function} */
    this.handleAnimationEnd_;
  }

  initialSyncWithDOM() {
    this.handleChange_ = () => this.foundation_.handleChange();
    this.handleAnimationEnd_= () => this.foundation_.handleAnimationEnd();
    this.nativeCb_.addEventListener('change', this.handleChange_);
    this.listen(getCorrectEventName(window, 'animationend'), this.handleAnimationEnd_);
  }

  /**
   * @return {!MDCRipple}
   * @private
   */
  initRipple_() {
    const MATCHES = getMatchesProperty(HTMLElement.prototype);
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      isUnbounded: () => true,
      isSurfaceActive: () => this.nativeCb_[MATCHES](':active'),
      registerInteractionHandler: (type, handler) => this.nativeCb_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.nativeCb_.removeEventListener(type, handler),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  /** @return {!MDCCheckboxFoundation} */
  getDefaultFoundation() {
    return new MDCCheckboxFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setNativeControlAttr: (attr, value) => this.nativeCb_.setAttribute(attr, value),
      removeNativeControlAttr: (attr) => this.nativeCb_.removeAttribute(attr),
      getNativeControl: () => this.nativeCb_,
      isIndeterminate: () => this.indeterminate,
      isChecked: () => this.checked,
      hasNativeControl: () => !!this.nativeCb_,
      setNativeControlDisabled: (disabled) => this.nativeCb_.disabled = disabled,
      forceLayout: () => this.root_.offsetWidth,
      isAttachedToDOM: () => Boolean(this.root_.parentNode),
    });
  }

  /** @return {!MDCRipple} */
  get ripple() {
    return this.ripple_;
  }

  /** @return {boolean} */
  get checked() {
    return this.nativeCb_.checked;
  }

  /** @param {boolean} checked */
  set checked(checked) {
    this.nativeCb_.checked = checked;
  }

  /** @return {boolean} */
  get indeterminate() {
    return this.nativeCb_.indeterminate;
  }

  /** @param {boolean} indeterminate */
  set indeterminate(indeterminate) {
    this.nativeCb_.indeterminate = indeterminate;
  }

  /** @return {boolean} */
  get disabled() {
    return this.nativeCb_.disabled;
  }

  /** @param {boolean} disabled */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  /** @return {?string} */
  get value() {
    return this.nativeCb_.value;
  }

  /** @param {?string} value */
  set value(value) {
    this.nativeCb_.value = value;
  }

  destroy() {
    this.ripple_.destroy();
    this.nativeCb_.removeEventListener('change', this.handleChange_);
    this.unlisten(getCorrectEventName(window, 'animationend'), this.handleAnimationEnd_);
    super.destroy();
  }
}

export {MDCCheckboxFoundation, MDCCheckbox};
