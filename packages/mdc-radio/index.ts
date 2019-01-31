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

import MDCComponent from '@material/base/component';
import {EventType, SpecificEventListener} from '@material/dom/index';
import {RippleCapableSurface} from '@material/ripple/index';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';
import {MDCSelectionControl} from '@material/selection-control/index';

import MDCRadioFoundation from './foundation';
import { EventType } from '../../test/screenshot/out/spec/packages/mdc-dom';

class MDCRadio extends MDCComponent<MDCRadioFoundation>
  implements RippleCapableSurface, MDCSelectionControl {

  static attachTo(root: HTMLElement) {
    return new MDCRadio(root);
  }

  root_!: Element;
  private ripple_: MDCRipple;
  private nativeControl_: HTMLInputElement;

  get checked(): boolean {
    return (this.nativeControl_ as HTMLInputElement)!.checked;
  }

  set checked(checked: boolean) {
    this.nativeControl_.checked = checked;
  }

  /** @return {boolean} */
  get disabled() {
    return this.nativeControl_.disabled;
  }

  /** @param {boolean} disabled */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  /** @return {?string} */
  get value() {
    return this.nativeControl_.value;
  }

  /** @param {?string} value */
  set value(value) {
    this.nativeControl_.value = value;
  }

  get ripple(): MDCRipple {
    return this.ripple_;
  }

  constructor(...args) {
    super(...args);

    this.ripple_ = this.initRipple_();
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
      registerInteractionHandler: (type, handler) => this.nativeControl_.addEventListener(type, handler),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  /**
   * Returns the state of the native control element, or null if the native control element is not present.
   */
  private get nativeControl_(): MDCSelectionControlState {
    const {NATIVE_CONTROL_SELECTOR} = MDCRadioFoundation.strings;
    const el = /** @type {?MDCSelectionControlState} */ (
      this.root_.querySelector(NATIVE_CONTROL_SELECTOR));
    return el;
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  /** @return {!MDCRadioFoundation} */
  getDefaultFoundation() {
    return new MDCRadioFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setNativeControlDisabled: (disabled) => this.nativeControl_.disabled = disabled,
    });
  }
}


export {MDCRadio, MDCRadioFoundation};
