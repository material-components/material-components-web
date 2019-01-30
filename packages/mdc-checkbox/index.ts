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

import {getCorrectEventName, StandardJsEventType} from '@material/animation/index';
import MDCComponent from '@material/base/component';
import {EventType, SpecificEventListener} from '@material/dom/index';
import {MDCRipple, MDCRippleFoundation, RippleCapableSurface, util} from '@material/ripple/index';
import {MDCSelectionControl, MDCSelectionControlState} from '@material/selection-control/index';

import MDCCheckboxFoundation from './foundation';

const {getMatchesProperty} = util;
const CB_PROTO_PROPS: string[] = ['checked', 'indeterminate'];

const {ANIMATION_END} = StandardJsEventType;

class MDCCheckbox extends MDCComponent<MDCCheckboxFoundation>
  implements MDCSelectionControl, RippleCapableSurface {
  static attachTo(root: Element) {
    return new MDCCheckbox(root);
  }

  /**
   * Returns the state of the native control element, or null if the native control element is not present.
   */
  get nativeCb_(): MDCSelectionControlState {
    const {NATIVE_CONTROL_SELECTOR} = MDCCheckboxFoundation.strings;
    const cbEl = this.root_.querySelector(NATIVE_CONTROL_SELECTOR);
    return cbEl;
  }

  root_!: Element;
  private ripple_: MDCRipple = this.initRipple_();
  private handleChange_!: () => void;
  private handleAnimationEnd_!: () => void;

  initialSyncWithDOM() {
    this.handleChange_ = () => this.foundation_.handleChange();
    this.handleAnimationEnd_ = () => this.foundation_.handleAnimationEnd();
    this.nativeCb_.addEventListener('change', this.handleChange_);
    this.listen(getCorrectEventName(window, ANIMATION_END), this.handleAnimationEnd_);
    this.installPropertyChangeHooks_();
  }

  destroy() {
    this.ripple_.destroy();
    this.nativeCb_.removeEventListener('change', this.handleChange_);
    this.unlisten(getCorrectEventName(window, ANIMATION_END), this.handleAnimationEnd_);
    this.uninstallPropertyChangeHooks_();
    super.destroy();
  }

  getDefaultFoundation(): MDCCheckboxFoundation {
    return new MDCCheckboxFoundation({
      addClass: (className) => this.root_.classList.add(className),
      forceLayout: () => (this.root_ as HTMLElement).offsetWidth,
      hasNativeControl: () => !!this.nativeCb_,
      isAttachedToDOM: () => Boolean(this.root_.parentNode),
      isChecked: () => this.checked,
      isIndeterminate: () => this.indeterminate,
      removeClass: (className) => this.root_.classList.remove(className),
      removeNativeControlAttr: (attr) => this.nativeCb_.removeAttribute(attr),
      setNativeControlAttr: (attr, value) => this.nativeCb_.setAttribute(attr, value),
      setNativeControlDisabled: (disabled) => this.nativeCb_.disabled = disabled,
    });
  }

  private initRipple_(): MDCRipple {
    const MATCHES = getMatchesProperty(HTMLElement.prototype);
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      deregisterInteractionHandler:
        <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
          this.nativeCb_.removeEventListener(type, handler),
      isSurfaceActive: () => this.nativeCb_[MATCHES](':active'),
      isUnbounded: () => true,
      registerInteractionHandler:
        <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
          this.nativeCb_.addEventListener(type, handler),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  private installPropertyChangeHooks_() {
    const nativeCb = this.nativeCb_;
    const cbProto = Object.getPrototypeOf(nativeCb);

    CB_PROTO_PROPS.forEach((controlState) => {
      const desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
      // We have to check for this descriptor, since some browsers (Safari) don't support its return.
      // See: https://bugs.webkit.org/show_bug.cgi?id=49739
      if (validDescriptor(desc)) {
        const nativeCbDesc = {
          configurable: desc.configurable,
          enumerable: desc.enumerable,
          get: desc.get,
          set: (state: boolean) => {
            desc.set!.call(nativeCb, state);
            this.foundation_.handleChange();
          },
        };
        Object.defineProperty(nativeCb, controlState, nativeCbDesc);
      }
    });
  }

  private uninstallPropertyChangeHooks_() {
    const nativeCb = this.nativeCb_;
    const cbProto = Object.getPrototypeOf(nativeCb);

    CB_PROTO_PROPS.forEach((controlState) => {
      const desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
      if (validDescriptor(desc)) {
        Object.defineProperty(nativeCb, controlState, desc);
      }
    });
  }

  get ripple(): MDCRipple {
    return this.ripple_;
  }

  get checked(): boolean {
    return this.nativeCb_.checked;
  }

  set checked(checked: boolean) {
    this.nativeCb_.checked = checked;
  }

  get indeterminate(): boolean {
    return this.nativeCb_.indeterminate;
  }

  set indeterminate(indeterminate: boolean) {
    this.nativeCb_.indeterminate = indeterminate;
  }

  get disabled(): boolean {
    return this.nativeCb_.disabled;
  }

  set disabled(disabled: boolean) {
    this.foundation_.setDisabled(disabled);
  }

  get value(): string | undefined {
    return this.nativeCb_.value;
  }

  set value(value: string | undefined) {
    this.nativeCb_.value = value;
  }
}

function validDescriptor(inputPropDesc: PropertyDescriptor | undefined): inputPropDesc is PropertyDescriptor {
  return !!inputPropDesc && typeof inputPropDesc.set === 'function';
}

export {MDCCheckboxFoundation, MDCCheckbox};
