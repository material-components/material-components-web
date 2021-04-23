/**
 * @license
 * Copyright 2021 Google Inc.
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
import {MDCSwitchRenderAdapter, MDCSwitchState} from './adapter';
import {MDCSwitchRenderFoundation} from './foundation';

/**
 * `MDCSwitch` provides a component implementation of a Material Design switch.
 */
export class MDCSwitch extends
    MDCComponent<MDCSwitchRenderFoundation> implements MDCSwitchState {
  /**
   * Creates a new `MDCSwitch` and attaches it to the given root element.
   * @param root The root to attach to.
   * @return the new component instance.
   */
  static attachTo(root: HTMLButtonElement) {
    return new MDCSwitch(root);
  }

  disabled!: boolean;
  processing!: boolean;
  selected!: boolean;

  constructor(
      public root: HTMLButtonElement, foundation?: MDCSwitchRenderFoundation) {
    super(root, foundation);
  }

  initialSyncWithDOM() {
    this.root.addEventListener('click', this.foundation.handleClick);
    this.foundation.initFromDOM();
  }

  destroy() {
    super.destroy();
    this.root.removeEventListener('click', this.foundation.handleClick);
  }

  getDefaultFoundation() {
    return new MDCSwitchRenderFoundation(this.createAdapter());
  }

  protected createAdapter(): MDCSwitchRenderAdapter {
    return {
      addClass: className => {
        this.root.classList.add(className)
      },
      getAriaChecked: () => this.root.getAttribute('aria-checked'),
      hasClass: className => this.root.classList.contains(className),
      isDisabled: () => this.root.disabled,
      removeClass: className => {
        this.root.classList.remove(className);
      },
      setAriaChecked: ariaChecked =>
          this.root.setAttribute('aria-checked', ariaChecked),
      setDisabled: disabled => {
        this.root.disabled = disabled;
      },
      state: this,
    };
  }
}
