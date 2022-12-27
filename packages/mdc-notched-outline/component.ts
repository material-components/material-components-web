/**
 * @license
 * Copyright 2017 Google Inc.
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
import {MDCFloatingLabelFoundation} from '@material/floating-label/foundation';
import {MDCNotchedOutlineAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCNotchedOutlineFoundation} from './foundation';

export type MDCNotchedOutlineFactory = (el: Element, foundation?: MDCNotchedOutlineFoundation) => MDCNotchedOutline;

export class MDCNotchedOutline extends MDCComponent<MDCNotchedOutlineFoundation> {
  static override attachTo(root: Element): MDCNotchedOutline {
    return new MDCNotchedOutline(root);
  }

  private notchElement!: HTMLElement;  // assigned in initialSyncWithDOM()

  override initialSyncWithDOM() {
    this.notchElement =
        this.root.querySelector<HTMLElement>(strings.NOTCH_ELEMENT_SELECTOR)!;

    const label = this.root.querySelector<HTMLElement>(
        '.' + MDCFloatingLabelFoundation.cssClasses.ROOT);
    if (label) {
      label.style.transitionDuration = '0s';
      this.root.classList.add(cssClasses.OUTLINE_UPGRADED);
      requestAnimationFrame(() => {
        label.style.transitionDuration = '';
      });
    } else {
      this.root.classList.add(cssClasses.NO_LABEL);
    }
  }

  /**
   * Updates classes and styles to open the notch to the specified width.
   * @param notchWidth The notch width in the outline.
   */
  notch(notchWidth: number) {
    this.foundation.notch(notchWidth);
  }

  /**
   * Updates classes and styles to close the notch.
   */
  closeNotch() {
    this.foundation.closeNotch();
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCNotchedOutlineAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      setNotchWidthProperty: (width) => {
        this.notchElement.style.setProperty('width', width + 'px');
      },
      removeNotchWidthProperty: () => {
        this.notchElement.style.removeProperty('width');
      },
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCNotchedOutlineFoundation(adapter);
  }
}
