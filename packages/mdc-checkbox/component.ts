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
import {strings} from './constants';
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
    return this.rippleSurface;
  }

  get checked(): boolean {
    return this.getNativeControl().checked;
  }

  set checked(checked: boolean) {
    this.getNativeControl().checked = checked;
  }

  get indeterminate(): boolean {
    return this.getNativeControl().indeterminate;
  }

  set indeterminate(indeterminate: boolean) {
    this.getNativeControl().indeterminate = indeterminate;
  }

  get disabled(): boolean {
    return this.getNativeControl().disabled;
  }

  set disabled(disabled: boolean) {
    this.foundation.setDisabled(disabled);
  }

  get value(): string {
    return this.getNativeControl().value;
  }

  set value(value: string) {
    this.getNativeControl().value = value;
  }

  private readonly rippleSurface: MDCRipple = this.createRipple();
  private handleChange!: EventListener;  // assigned in initialSyncWithDOM()
  private handleAnimationEnd!:
      EventListener;  // assigned in initialSyncWithDOM()

  initialize() {
    const {DATA_INDETERMINATE_ATTR} = strings;
    this.getNativeControl().indeterminate =
        this.getNativeControl().getAttribute(DATA_INDETERMINATE_ATTR) ===
        'true';
    this.getNativeControl().removeAttribute(DATA_INDETERMINATE_ATTR);
  }

  initialSyncWithDOM() {
    this.handleChange = () => {
      this.foundation.handleChange();
    };
    this.handleAnimationEnd = () => {
      this.foundation.handleAnimationEnd();
    };
    this.getNativeControl().addEventListener('change', this.handleChange);
    this.listen(
        getCorrectEventName(window, 'animationend'), this.handleAnimationEnd);
    this.installPropertyChangeHooks();
  }

  destroy() {
    this.rippleSurface.destroy();
    this.getNativeControl().removeEventListener('change', this.handleChange);
    this.unlisten(
        getCorrectEventName(window, 'animationend'), this.handleAnimationEnd);
    this.uninstallPropertyChangeHooks();
    super.destroy();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCCheckboxAdapter = {
      addClass: (className) => this.root.classList.add(className),
      forceLayout: () => (this.root as HTMLElement).offsetWidth,
      hasNativeControl: () => !!this.getNativeControl(),
      isAttachedToDOM: () => Boolean(this.root.parentNode),
      isChecked: () => this.checked,
      isIndeterminate: () => this.indeterminate,
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      removeNativeControlAttr: (attr) => {
        this.getNativeControl().removeAttribute(attr);
      },
      setNativeControlAttr: (attr, value) => {
        this.getNativeControl().setAttribute(attr, value);
      },
      setNativeControlDisabled: (disabled) => {
        this.getNativeControl().disabled = disabled;
      },
    };
    return new MDCCheckboxFoundation(adapter);
  }

  private createRipple(): MDCRipple {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      deregisterInteractionHandler: (evtType, handler) => {
        this.getNativeControl().removeEventListener(
            evtType, handler, applyPassive());
      },
      isSurfaceActive: () => matches(this.getNativeControl(), ':active'),
      isUnbounded: () => true,
      registerInteractionHandler: (evtType, handler) => {
        this.getNativeControl().addEventListener(
            evtType, handler, applyPassive());
      },
    };
    return new MDCRipple(this.root, new MDCRippleFoundation(adapter));
  }

  private installPropertyChangeHooks() {
    const nativeCb = this.getNativeControl();
    const cbProto = Object.getPrototypeOf(nativeCb);

    for (const controlState of CB_PROTO_PROPS) {
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
          this.foundation.handleChange();
        },
      };
      Object.defineProperty(nativeCb, controlState, nativeCbDesc);
    }
  }

  private uninstallPropertyChangeHooks() {
    const nativeCb = this.getNativeControl();
    const cbProto = Object.getPrototypeOf(nativeCb);

    for (const controlState of CB_PROTO_PROPS) {
      const desc = Object.getOwnPropertyDescriptor(cbProto, controlState);
      if (!validDescriptor(desc)) {
        return;
      }
      Object.defineProperty(nativeCb, controlState, desc);
    }
  }

  private getNativeControl(): HTMLInputElement {
    const {NATIVE_CONTROL_SELECTOR} = strings;
    const el =
        this.root.querySelector<HTMLInputElement>(NATIVE_CONTROL_SELECTOR);
    if (!el) {
      throw new Error(`Checkbox component requires a ${NATIVE_CONTROL_SELECTOR} element`);
    }
    return el;
  }
}

function validDescriptor(inputPropDesc: PropertyDescriptor | undefined): inputPropDesc is PropertyDescriptor {
  return !!inputPropDesc && typeof inputPropDesc.set === 'function';
}
