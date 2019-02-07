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

import {MDCComponent} from '@material/base/component';
import {EventType, SpecificEventListener} from '@material/base/index';
import {RippleCapableSurface} from '@material/ripple/index';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';
import {MDCSelectionControl} from '@material/selection-control/index';

import {MDCRadioFoundation} from './foundation';

class MDCRadio extends MDCComponent<MDCRadioFoundation> implements RippleCapableSurface, MDCSelectionControl {
  static attachTo(root: Element) {
    return new MDCRadio(root);
  }

  // Public visibility for this property is required by RippleCapableSurface.
  root_!: Element; // assigned in MDCComponent constructor

  private readonly ripple_: MDCRipple = this.initRipple_();

  get checked(): boolean {
    return this.nativeControl_.checked;
  }

  set checked(checked: boolean) {
    this.nativeControl_.checked = checked;
  }

  get disabled() {
    return this.nativeControl_.disabled;
  }

  set disabled(disabled: boolean) {
    this.foundation_.setDisabled(disabled);
  }

  get value() {
    return this.nativeControl_.value;
  }

  set value(value: string) {
    this.nativeControl_.value = value;
  }

  get ripple(): MDCRipple {
    return this.ripple_;
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  getDefaultFoundation() {
    return new MDCRadioFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setNativeControlDisabled: (disabled) => this.nativeControl_.disabled = disabled,
    });
  }

  private initRipple_(): MDCRipple {
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      deregisterInteractionHandler:
        <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
          this.nativeControl_.removeEventListener(type, handler),
      // Radio buttons technically go "active" whenever there is *any* keyboard interaction. This is not the
      // UI we desire.
      isSurfaceActive: () => false,
      isUnbounded: () => true,
      registerInteractionHandler: <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
        this.nativeControl_.addEventListener(type, handler),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  /**
   * Returns the state of the native control element, or null if the native control element is not present.
   */
  private get nativeControl_(): HTMLInputElement {
    const {NATIVE_CONTROL_SELECTOR} = MDCRadioFoundation.strings;
    const el = this.root_.querySelector<HTMLInputElement>(NATIVE_CONTROL_SELECTOR);
    if (!el) {
      throw new Error(`Radio component requires a ${NATIVE_CONTROL_SELECTOR} element`);
    }
    return el;
  }
}

export {MDCRadio as default, MDCRadio};
export * from './adapter';
export * from './foundation';
