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
import {isNavigationEvent, KEY, normalizeKey} from '@material/dom/keyboard';

import {MDCChipTrailingActionAdapter} from './adapter';
import {InteractionTrigger, strings} from './constants';

export class MDCChipTrailingActionFoundation extends
    MDCFoundation<MDCChipTrailingActionAdapter> {
  static override get strings() {
    return strings;
  }

  static override get defaultAdapter(): MDCChipTrailingActionAdapter {
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
    this.adapter.notifyInteraction(InteractionTrigger.CLICK);
  }

  handleKeydown(evt: KeyboardEvent) {
    evt.stopPropagation();
    const key = normalizeKey(evt);
    if (this.shouldNotifyInteractionFromKey(key)) {
      const trigger = this.getTriggerFromKey(key);
      this.adapter.notifyInteraction(trigger);
      return;
    }

    if (isNavigationEvent(evt)) {
      this.adapter.notifyNavigation(key);
      return;
    }
  }

  removeFocus() {
    this.adapter.setAttribute(strings.TAB_INDEX, '-1');
  }

  focus() {
    this.adapter.setAttribute(strings.TAB_INDEX, '0');
    this.adapter.focus();
  }

  isNavigable() {
    return this.adapter.getAttribute(strings.ARIA_HIDDEN) !== 'true';
  }

  private shouldNotifyInteractionFromKey(key: string): boolean {
    const isFromActionKey = key === KEY.ENTER || key === KEY.SPACEBAR;
    const isFromDeleteKey = key === KEY.BACKSPACE || key === KEY.DELETE;

    return isFromActionKey || isFromDeleteKey;
  }

  private getTriggerFromKey(key: string): InteractionTrigger {
    if (key === KEY.SPACEBAR) {
      return InteractionTrigger.SPACEBAR_KEY;
    }

    if (key === KEY.ENTER) {
      return InteractionTrigger.ENTER_KEY;
    }

    if (key === KEY.DELETE) {
      return InteractionTrigger.DELETE_KEY;
    }

    if (key === KEY.BACKSPACE) {
      return InteractionTrigger.BACKSPACE_KEY;
    }

    // Default case, should never be returned
    return InteractionTrigger.UNSPECIFIED;
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipTrailingActionFoundation;
