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

import {MDCComponent} from '@material/base/component';
import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
import {getMatchesProperty} from '@material/ripple/util';
import {MDCSelectionControl} from '@material/selection-control/index';
import {MDCSwitchFoundation} from './foundation';

/**
 * An implementation of the switch component defined by the Material Design spec.
 *
 * https://material.io/design/components/selection-controls.html#switches
 */
class MDCSwitch extends MDCComponent<MDCSwitchFoundation> implements MDCSelectionControl, RippleCapableSurface {
  /** Creates an instance of MDCSwitch bound to the given root element. */
  static attachTo(root: HTMLElement) {
    return new MDCSwitch(root);
  }

  // Initialized in super class constructor, re-declared as public to fulfill to the `RippleCapableSurface` interface.
  root_!: Element;

  private ripple_ = this.initRipple_();

  // Initialized in `initialSyncWithDOM`.
  private changeHandler_!: EventListener;

  destroy() {
    super.destroy();
    this.ripple_.destroy();
    this.nativeControl_.removeEventListener('change', this.changeHandler_);
  }

  initialSyncWithDOM() {
    this.changeHandler_ = (...args) => this.foundation_.handleChange(...args);
    this.nativeControl_.addEventListener('change', this.changeHandler_);

    // Sometimes the checked state of the input element is saved in the history.
    // The switch styling should match the checked state of the input element.
    // Do an initial sync between the native control and the foundation.
    this.checked = this.checked;
  }

  /** Gets the default Foundation for this switch. */
  getDefaultFoundation() {
    return new MDCSwitchFoundation({
      addClass: (className: string) => this.root_.classList.add(className),
      removeClass: (className: string) => this.root_.classList.remove(className),
      setNativeControlChecked: (checked: boolean) => this.nativeControl_.checked = checked,
      setNativeControlDisabled: (disabled: boolean) => this.nativeControl_.disabled = disabled,
    });
  }

  /** The MDCRipple associated with this switch. */
  get ripple() {
    return this.ripple_;
  }

  /** The checked state of this switch. */
  get checked() {
    return this.nativeControl_.checked;
  }
  set checked(checked) {
    this.foundation_.setChecked(checked);
  }

  /** The disabled state of this switch. */
  get disabled() {
    return this.nativeControl_.disabled;
  }
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  private initRipple_() {
    const {RIPPLE_SURFACE_SELECTOR} = MDCSwitchFoundation.strings;
    const rippleSurface = this.root_.querySelector(RIPPLE_SURFACE_SELECTOR) as HTMLElement;

    const MATCHES = getMatchesProperty(HTMLElement.prototype);
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      addClass: (className: string) => rippleSurface.classList.add(className),
      computeBoundingRect: () => rippleSurface.getBoundingClientRect(),
      deregisterInteractionHandler: (type: string, handler: EventListener) =>
          this.nativeControl_.removeEventListener(type, handler),
      isSurfaceActive: () => this.nativeControl_[MATCHES]!(':active'),
      isUnbounded: () => true,
      registerInteractionHandler: (type: string, handler: EventListener) =>
          this.nativeControl_.addEventListener(type, handler),
      removeClass: (className: string) => rippleSurface.classList.remove(className),
      updateCssVariable: (varName: string, value: string) =>
          rippleSurface.style.setProperty(varName, value),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  /** Returns the state of the native control element. */
  private get nativeControl_() {
    const {NATIVE_CONTROL_SELECTOR} = MDCSwitchFoundation.strings;
    return this.root_.querySelector(NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
  }
}

export {MDCSwitch as default, MDCSwitch};
export * from './adapter';
export * from './foundation';
