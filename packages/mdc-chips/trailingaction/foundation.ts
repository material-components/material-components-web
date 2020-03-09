/**
 * @license
 * Copyright 2020 Google Inc.
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

import {MDCFoundation} from '@material/base/foundation';

import {navigationKeys, strings as chipStrings} from '../chip/constants';

import {MDCChipTrailingActionAdapter} from './adapter';
import {InteractionTrigger, strings} from './constants';

export class MDCChipTrailingActionFoundation extends
    MDCFoundation<MDCChipTrailingActionAdapter> {
  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCChipTrailingActionAdapter {
    return {
      focus: () => undefined,
      getAttribute: () => null,
      setAttribute: () => undefined,
      notifyInteraction: () => undefined,
      notifyNavigation: () => undefined,
    };
  }

  constructor(adapter?: Partial<MDCChipTrailingActionAdapter>) {
    super({...MDCChipTrailingActionFoundation.defaultAdapter, ...adapter});
  }

  handleClick(evt: MouseEvent) {
    evt.stopPropagation();
    this.adapter_.notifyInteraction(InteractionTrigger.CLICK);
  }

  handleKeydown(evt: KeyboardEvent) {
    evt.stopPropagation();
    if (this.shouldNotifyInteraction_(evt)) {
      this.adapter_.notifyInteraction(this.getTriggerFromKeyboard_(evt));
      return;
    }

    if (this.shouldNotifyNavigation_(evt)) {
      this.adapter_.notifyNavigation(evt.key);
      return;
    }
  }

  removeFocus() {
    this.adapter_.setAttribute(strings.TAB_INDEX, '-1');
  }

  focus() {
    this.adapter_.setAttribute(strings.TAB_INDEX, '0');
    this.adapter_.focus();
  }

  isNavigable() {
    return this.adapter_.getAttribute(strings.ARIA_HIDDEN) !== 'true';
  }

  private shouldNotifyInteraction_(evt: KeyboardEvent): boolean {
    const isFromActionKey = evt.key === chipStrings.ENTER_KEY ||
        evt.key === chipStrings.SPACEBAR_KEY;
    const isFromDeleteKey = evt.key === chipStrings.BACKSPACE_KEY ||
        evt.key === chipStrings.DELETE_KEY ||
        evt.key === chipStrings.IE_DELETE_KEY;

    return isFromActionKey || isFromDeleteKey;
  }

  private shouldNotifyNavigation_(evt: KeyboardEvent): boolean {
    return navigationKeys.has(evt.key);
  }

  private getTriggerFromKeyboard_(evt: KeyboardEvent): InteractionTrigger {
    if (evt.key === chipStrings.SPACEBAR_KEY) {
      return InteractionTrigger.SPACEBAR_KEY;
    }

    if (evt.key === chipStrings.ENTER_KEY) {
      return InteractionTrigger.ENTER_KEY;
    }

    if (evt.key === chipStrings.DELETE_KEY ||
        evt.key === chipStrings.IE_DELETE_KEY) {
      return InteractionTrigger.DELETE_KEY;
    }

    if (evt.key === chipStrings.BACKSPACE_KEY) {
      return InteractionTrigger.BACKSPACE_KEY;
    }

    // Default case, should never be returned
    return InteractionTrigger.UNSPECIFIED;
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipTrailingActionFoundation;
