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
import {SpecificEventListener} from '@material/base/types';
import {MDCSelectIconAdapter} from './adapter';
import {strings} from './constants';

type InteractionEventType = 'click' | 'keydown';

const INTERACTION_EVENTS: InteractionEventType[] = ['click', 'keydown'];

export class MDCSelectIconFoundation extends MDCFoundation<MDCSelectIconAdapter> {
  static get strings() {
    return strings;
  }

  private savedTabIndex_: string | null = null;

  // assigned in initialSyncWithDOM()
  private readonly interactionHandler_!: SpecificEventListener<InteractionEventType>;

  constructor(protected readonly adapter: MDCSelectIconAdapter) {
    super(adapter);

    this.interactionHandler_ = (evt) => this.handleInteraction(evt);
  }

  init() {
    this.savedTabIndex_ = this.adapter.getAttr('tabindex');

    INTERACTION_EVENTS.forEach((evtType) => {
      this.adapter.registerInteractionHandler(
          evtType, this.interactionHandler_);
    });
  }

  destroy() {
    INTERACTION_EVENTS.forEach((evtType) => {
      this.adapter.deregisterInteractionHandler(
          evtType, this.interactionHandler_);
    });
  }

  setDisabled(disabled: boolean) {
    if (!this.savedTabIndex_) {
      return;
    }

    if (disabled) {
      this.adapter.setAttr('tabindex', '-1');
      this.adapter.removeAttr('role');
    } else {
      this.adapter.setAttr('tabindex', this.savedTabIndex_);
      this.adapter.setAttr('role', strings.ICON_ROLE);
    }
  }

  setAriaLabel(label: string) {
    this.adapter.setAttr('aria-label', label);
  }

  setContent(content: string) {
    this.adapter.setContent(content);
  }

  handleInteraction(evt: MouseEvent | KeyboardEvent) {
    const isEnterKey = (evt as KeyboardEvent).key === 'Enter' || (evt as KeyboardEvent).keyCode === 13;
    if (evt.type === 'click' || isEnterKey) {
      this.adapter.notifyIconAction();
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSelectIconFoundation;
