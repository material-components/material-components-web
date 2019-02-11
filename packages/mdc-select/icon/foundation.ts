/**
 * @license
 * Copyright 2018 Google Inc.
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
import {EventType} from '@material/base/index';
import {MDCSelectIconAdapter} from './adapter';
import {strings} from './constants';

const CLICK_KEYDOWN_EVENTS: EventType[] = ['click', 'keydown'];

class MDCSelectIconFoundation extends MDCFoundation<MDCSelectIconAdapter> {
  static get strings() {
    return strings;
  }

  /**
   * See {@link MDCSelectIconAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCSelectIconAdapter {
    // tslint:disable:object-literal-sort-keys
    return {
      getAttr: () => null,
      setAttr: () => undefined,
      removeAttr: () => undefined,
      setContent: () => undefined,
      registerInteractionHandler: () => undefined,
      deregisterInteractionHandler: () => undefined,
      notifyIconAction: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private savedTabIndex_: string | null = null;
  private readonly interactionHandler_!: EventListener; // assigned in initialSyncWithDOM()

  constructor(adapter?: Partial<MDCSelectIconAdapter>) {
    super({...MDCSelectIconFoundation.defaultAdapter, ...adapter});

    this.interactionHandler_ = (evt) => this.handleInteraction(evt);
  }

  init() {
    this.savedTabIndex_ = this.adapter_.getAttr('tabindex');

    CLICK_KEYDOWN_EVENTS.forEach((evtType) => {
      this.adapter_.registerInteractionHandler(evtType, this.interactionHandler_);
    });
  }

  destroy() {
    CLICK_KEYDOWN_EVENTS.forEach((evtType) => {
      this.adapter_.deregisterInteractionHandler(evtType, this.interactionHandler_);
    });
  }

  setDisabled(disabled: boolean) {
    if (!this.savedTabIndex_) {
      return;
    }

    if (disabled) {
      this.adapter_.setAttr('tabindex', '-1');
      this.adapter_.removeAttr('role');
    } else {
      this.adapter_.setAttr('tabindex', this.savedTabIndex_);
      this.adapter_.setAttr('role', strings.ICON_ROLE);
    }
  }

  setAriaLabel(label: string) {
    this.adapter_.setAttr('aria-label', label);
  }

  setContent(content: string) {
    this.adapter_.setContent(content);
  }

  handleInteraction(evt: Event) {
    const isEnterKey = (evt as KeyboardEvent).key === 'Enter' || (evt as KeyboardEvent).keyCode === 13;
    if (evt.type === 'click' || isEnterKey) {
      this.adapter_.notifyIconAction();
    }
  }
}

export {MDCSelectIconFoundation as default, MDCSelectIconFoundation};
