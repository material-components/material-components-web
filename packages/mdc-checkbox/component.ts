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

import {getCorrectEventName} from '@material/animation/util';
import {MDCComponent} from '@material/base/component';
import {applyPassive} from '@material/dom/events';
import {matches} from '@material/dom/ponyfill';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';
import {MDCCheckboxAdapter} from './adapter';
import {MDCCheckboxFoundation} from './foundation';

/**
 * This type is needed for compatibility with Closure Compiler.
 */
type PropertyDescriptorGetter = (() => unknown) | undefined;

const CB_PROTO_PROPS = ['checked', 'indeterminate'];

export type MDCCheckboxFactory = (el: Element, foundation?: MDCCheckboxFoundation) => MDCCheckbox;

export class MDCCheckbox extends MDCComponent<MDCCheckboxFoundation> implements MDCRippleCapableSurface {
  static attachTo(root: Element) {
    return new MDCCheckbox(root);
  }

  get ripple(): MDCRipple {
    return this.ripple_;
  }

  get checked(): boolean {
    return this.nativeControl_.checked;
  }

  set checked(checked: boolean) {
    this.nativeControl_.checked = checked;
  }

  get indeterminate(): boolean {
    return this.nativeControl_.indeterminate;
  }

  set indeterminate(indeterminate: boolean) {
    this.nativeControl_.indeterminate = indeterminate;
  }

  get disabled(): boolean {
    return this.nativeControl_.disabled;
  }

  set disabled(disabled: boolean) {
    this.foundation_.setDisabled(disabled);
  }

  get value(): string {
    return this.nativeControl_.value;
  }

  set value(value: string) {
    this.nativeControl_.value = value;
  }

  // Public visibility for this property is required by MDCRippleCapableSurface.
  root_!: Element; // assigned in MDCComponent constructor

  private readonly ripple_: MDCRipple = this.createRipple_();
  private handleClick_!: EventListener; // assigned in initialSyncWithDOM()
  private handleAnimationEnd_!: EventListener; // assigned in initialSyncWithDOM()

  initialSyncWithDOM() {
    this.handleClick_ = () => this.foundation_.handleClick();
    this.handleAnimationEnd_ = () => this.foundation_.handleAnimationEnd();
    this.nativeControl_.addEventListener('click', this.handleClick_);
    this.listen(getCorrectEventName(window, 'animationend'), this.handleAnimationEnd_);
    this.installPropertyChangeHooks_();
  }

  destroy() {
    this.ripple_.destroy();
    this.nativeControl_.removeEventListener('click', this.handleClick_);
    this.unlisten(getCorrectEventName(window, 'animationend'), this.handleAnimationEnd_);
    this.uninstallPropertyChangeHooks_();
    super.destroy();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCCheckboxAdapter = {
      addClass: (className) => this.root_.classList.add(className),
      forceLayout: () => (this.root_ as HTMLElement).offsetWidth,
      hasNativeControl: () => !!this.nativeControl_,
      isAttachedToDOM: () => Boolean(this.root_.parentNode),
      isChecked: () => this.checked,
      isIndeterminate: () => this.indeterminate,
      removeClass: (className) => this.root_.classList.remove(className),
      removeNativeControlAttr: (attr) => this.nativeControl_.removeAttribute(attr),
      setChecked: (checkStatus) => this.nativeControl_.checked = checkStatus,
      setNativeControlAttr: (attr, value) => this.nativeControl_.setAttribute(attr, value),
      setNativeControlDisabled: (disabled) => this.nativeControl_.disabled = disabled,
    };
    return new MDCCheckboxFoundation(adapter);
  }

  private createRipple_(): MDCRipple {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      deregisterInteractionHandler: (evtType, handler) => this.nativeControl_.removeEventListener(
        evtType, handler, applyPassive()),
      isSurfaceActive: () => matches(this.nativeControl_, ':active'),
      isUnbounded: () => true,
      registerInteractionHandler: (evtType, handler) => this.nativeControl_.addEventListener(
        evtType, handler, applyPassive()),
    };
    return new MDCRipple(this.root_, new MDCRippleFoundation(adapter));
  }

  private installPropertyChangeHooks_() {
    const nativeCb = this.nativeControl_;
    const cbProto = Object.getPrototypeOf(nativeCb);

    CB_PROTO_PROPS.forEach((controlState) => {
      const desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
      // We have to check for this descriptor, since some browsers (Safari) don't support its return.
      // See: https://bugs.webkit.org/show_bug.cgi?id=49739
      if (!validDescriptor(desc)) {
        return;
      }

      // Type cast is needed for compatibility with Closure Compiler.
      const nativeGetter = (desc as {get: PropertyDescriptorGetter}).get;

      const nativeCbDesc = {
        configurable: desc.configurable,
        enumerable: desc.enumerable,
        get: nativeGetter,
        set: (state: boolean) => {
          desc.set!.call(nativeCb, state);
          this.foundation_.handleChange();
        },
      };
      Object.defineProperty(nativeCb, controlState, nativeCbDesc);
    });
  }

  private uninstallPropertyChangeHooks_() {
    const nativeCb = this.nativeControl_;
    const cbProto = Object.getPrototypeOf(nativeCb);

    CB_PROTO_PROPS.forEach((controlState) => {
      const desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
      if (!validDescriptor(desc)) {
        return;
      }
      Object.defineProperty(nativeCb, controlState, desc);
    });
  }

  private get nativeControl_(): HTMLInputElement {
    const {NATIVE_CONTROL_SELECTOR} = MDCCheckboxFoundation.strings;
    const el = this.root_.querySelector<HTMLInputElement>(NATIVE_CONTROL_SELECTOR);
    if (!el) {
      throw new Error(`Checkbox component requires a ${NATIVE_CONTROL_SELECTOR} element`);
    }
    return el;
  }
}

function validDescriptor(inputPropDesc: PropertyDescriptor | undefined): inputPropDesc is PropertyDescriptor {
  return !!inputPropDesc && typeof inputPropDesc.set === 'function';
}
