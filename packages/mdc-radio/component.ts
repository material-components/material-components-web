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
import {applyPassive} from '@material/dom/events';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';
import {MDCRadioAdapter} from './adapter';
import {MDCRadioFoundation} from './foundation';

export class MDCRadio extends MDCComponent<MDCRadioFoundation> implements MDCRippleCapableSurface {
  static override attachTo(root: Element) {
    return new MDCRadio(root);
  }

  get checked(): boolean {
    return this.nativeControl.checked;
  }

  set checked(checked: boolean) {
    this.nativeControl.checked = checked;
  }

  get disabled() {
    return this.nativeControl.disabled;
  }

  set disabled(disabled: boolean) {
    this.foundation.setDisabled(disabled);
  }

  get value() {
    return this.nativeControl.value;
  }

  set value(value: string) {
    this.nativeControl.value = value;
  }

  get ripple(): MDCRipple {
    return this.rippleSurface;
  }

  private readonly rippleSurface: MDCRipple = this.createRipple();

  override destroy() {
    this.rippleSurface.destroy();
    super.destroy();
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCRadioAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      setNativeControlDisabled: (disabled) => this.nativeControl.disabled =
          disabled,
    };
    return new MDCRadioFoundation(adapter);
  }

  private createRipple(): MDCRipple {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      registerInteractionHandler: (evtType, handler) => {
        this.nativeControl.addEventListener(evtType, handler, applyPassive());
      },
      deregisterInteractionHandler: (evtType, handler) => {
        this.nativeControl.removeEventListener(
            evtType, handler, applyPassive());
      },
      // Radio buttons technically go "active" whenever there is *any* keyboard
      // interaction. This is not the UI we desire.
      isSurfaceActive: () => false,
      isUnbounded: () => true,
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCRipple(this.root, new MDCRippleFoundation(adapter));
  }

  private get nativeControl(): HTMLInputElement {
    const {NATIVE_CONTROL_SELECTOR} = MDCRadioFoundation.strings;
    const el =
        this.root.querySelector<HTMLInputElement>(NATIVE_CONTROL_SELECTOR);
    if (!el) {
      throw new Error(`Radio component requires a ${NATIVE_CONTROL_SELECTOR} element`);
    }
    return el;
  }
}
