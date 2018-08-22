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
/* eslint-disable no-unused-vars */
import {MDCSelectionControlState, MDCSelectionControl} from '@material/selection-control/index';
/* eslint-enable no-unused-vars */
import MDCSwitchFoundation from './foundation';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';
import {getMatchesProperty} from '@material/ripple/util';

/**
 * @extends MDCComponent<!MDCSwitchFoundation>
 * @implements {MDCSelectionControl}
 */
class MDCSwitch extends MDCComponent {
  static attachTo(root) {
    return new MDCSwitch(root);
  }

  constructor(...args) {
    super(...args);

    /** @private {!MDCRipple} */
    this.ripple_ = this.initRipple_();

    /** @private {!Function} */
    this.changeHandler_;
  }

  destroy() {
    super.destroy();
    this.ripple_.destroy();
    this.nativeControl_.removeEventListener('change', this.changeHandler_);
  }

  initialSyncWithDOM() {
    this.changeHandler_ = this.foundation_.handleChange.bind(this.foundation_);
    this.nativeControl_.addEventListener('change', this.changeHandler_);

    // Sometimes the checked state of the input element is saved in the history.
    // The switch styling should match the checked state of the input element.
    // Do an initial sync between the native control and the foundation.
    this.checked = this.checked;
  }

  /**
   * Returns the state of the native control element, or null if the native control element is not present.
   * @return {?MDCSelectionControlState}
   * @private
   */
  get nativeControl_() {
    const {NATIVE_CONTROL_SELECTOR} = MDCSwitchFoundation.strings;
    const el = /** @type {?MDCSelectionControlState} */ (
      this.root_.querySelector(NATIVE_CONTROL_SELECTOR));
    return el;
  }

  /**
   * @return {!MDCRipple}
   * @private
   */
  initRipple_() {
    const {RIPPLE_SURFACE_SELECTOR} = MDCSwitchFoundation.strings;
    const rippleSurface = /** @type {!Element} */ (this.root_.querySelector(RIPPLE_SURFACE_SELECTOR));

    const MATCHES = getMatchesProperty(HTMLElement.prototype);
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      isUnbounded: () => true,
      isSurfaceActive: () => this.nativeControl_[MATCHES](':active'),
      addClass: (className) => rippleSurface.classList.add(className),
      removeClass: (className) => rippleSurface.classList.remove(className),
      registerInteractionHandler: (type, handler) => this.nativeControl_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.nativeControl_.removeEventListener(type, handler),
      updateCssVariable: (varName, value) => rippleSurface.style.setProperty(varName, value),
      computeBoundingRect: () => rippleSurface.getBoundingClientRect(),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  /** @return {!MDCSwitchFoundation} */
  getDefaultFoundation() {
    return new MDCSwitchFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setNativeControlChecked: (checked) => this.nativeControl_.checked = checked,
      setNativeControlDisabled: (disabled) => this.nativeControl_.disabled = disabled,
    });
  }

  /** @return {!MDCRipple} */
  get ripple() {
    return this.ripple_;
  }

  /** @return {boolean} */
  get checked() {
    return this.nativeControl_.checked;
  }

  /** @param {boolean} checked */
  set checked(checked) {
    this.foundation_.setChecked(checked);
  }

  /** @return {boolean} */
  get disabled() {
    return this.nativeControl_.disabled;
  }

  /** @param {boolean} disabled */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }
}

export {MDCSwitchFoundation, MDCSwitch};
