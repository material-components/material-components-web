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
import {matches} from '@material/dom/ponyfill';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';
import {MDCCheckboxAdapter} from './adapter';
import {MDCCheckboxFoundation} from './foundation';
import {strings} from './constants';

export class MDCCheckbox extends MDCComponent<MDCCheckboxFoundation> implements MDCRippleCapableSurface {
  static attachTo(root: Element) {
    return new MDCCheckbox(root);
  }

  get checked(): boolean {
    return this.foundation_.isChecked();
  }

  set checked(checked: boolean) {
    this.foundation_.setChecked(checked);
  }

  get indeterminate(): boolean {
    return this.foundation_.isIndeterminate();
  }

  set indeterminate(indeterminate: boolean) {
    this.foundation_.setIndeterminate(indeterminate);
  }

  get disabled(): boolean {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled: boolean) {
    this.foundation_.setDisabled(disabled);
  }

  get value(): string {
    return this.foundation_.getValue();
  }

  set value(value: string) {
    this.foundation_.setValue(value);
  }

  // Public visibility for this property is required by MDCRippleCapableSurface.
  root_!: Element; // assigned in MDCComponent constructor

  private readonly ripple_: MDCRipple = this.createRipple_();
  private handleChange_!: EventListener; // assigned in initialSyncWithDOM()
  private handleAnimationEnd_!: EventListener; // assigned in initialSyncWithDOM()

  initialSyncWithDOM() {
    this.handleChange_ = () => this.foundation_.handleChange();
    this.handleAnimationEnd_ = () => this.foundation_.handleAnimationEnd();
    this.listen('change', () => this.foundation_.handleChange());
    this.listen(getCorrectEventName(window, 'animationend'), this.handleAnimationEnd_);
  }

  destroy() {
    this.ripple_.destroy();
    this.unlisten('change', this.handleChange_);
    this.unlisten(getCorrectEventName(window, 'animationend'), this.handleAnimationEnd_);
    super.destroy();
  }

  getDefaultFoundation() {
    const nativeInput = this.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR) as HTMLInputElement;

    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCCheckboxAdapter = {
      setInputChecked: (checked) => nativeInput.checked = checked,
      isInputChecked: () => nativeInput.checked,
      isInputIndeterminate: () => nativeInput.indeterminate,
      setInputIndeterminate: (indeterminate) => nativeInput.indeterminate = indeterminate,
      isInputDisabled: () => nativeInput.disabled,
      setInputDisabled: (disabled) => nativeInput.disabled = disabled,
      getInputValue: () => nativeInput.value,
      setInputValue: (value) => nativeInput.value = value,
      addClass: (className) => this.root_.classList.add(className),
      forceLayout: () => (this.root_ as HTMLElement).offsetWidth,
      isAttachedToDOM: () => Boolean(this.root_.parentNode),
      removeClass: (className) => this.root_.classList.remove(className),
      removeAttributeFromInput: (attr) => nativeInput.removeAttribute(attr),
      setAttributeToInput: (attr, value) => nativeInput.setAttribute(attr, value),
    };
    return new MDCCheckboxFoundation(adapter);
  }

  private createRipple_(): MDCRipple {
    const nativeInput = this.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      deregisterInteractionHandler: (evtType, handler) => nativeInput.removeEventListener(evtType, handler),
      isSurfaceActive: () => matches(nativeInput, ':active'),
      isUnbounded: () => true,
      registerInteractionHandler: (evtType, handler) => nativeInput.addEventListener(evtType, handler),
    };
    return new MDCRipple(this.root_, new MDCRippleFoundation(adapter));
  }
}
