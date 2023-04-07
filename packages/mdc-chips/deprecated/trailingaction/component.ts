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

import {MDCComponent} from '@material/base/component';
import {SpecificEventListener} from '@material/base/types';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple, MDCRippleFactory} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';

import {MDCChipTrailingActionAdapter} from './adapter';
import {strings} from './constants';
import {MDCChipTrailingActionFoundation} from './foundation';
import {MDCChipTrailingActionInteractionEventDetail, MDCChipTrailingActionNavigationEventDetail} from './types';

/**
 * Creates a trailing action component on the given element.
 */
export type MDCChipTrailingActionFactory =
    (el: HTMLElement, foundation?: MDCChipTrailingActionFoundation) =>
        MDCChipTrailingAction;

/** MDC Chip Trailing Action */
export class MDCChipTrailingAction extends
    MDCComponent<MDCChipTrailingActionFoundation> implements
        MDCRippleCapableSurface {
  get ripple(): MDCRipple {
    return this.rippleSurface;
  }

  static override attachTo(root: HTMLElement) {
    return new MDCChipTrailingAction(root);
  }

  private rippleSurface!: MDCRipple;  // assigned in initialize()
  private handleClick!:
      SpecificEventListener<'click'>;  // assigned in initialSyncWithDOM()
  private handleKeydown!:
      SpecificEventListener<'keydown'>;  // assigned in initialSyncWithDOM()

  override initialize(
      rippleFactory: MDCRippleFactory = (el, foundation) =>
          new MDCRipple(el, foundation)) {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const rippleAdapter: MDCRippleAdapter = MDCRipple.createAdapter(this);
    this.rippleSurface =
        rippleFactory(this.root, new MDCRippleFoundation(rippleAdapter));
  }

  override initialSyncWithDOM() {
    this.handleClick = (evt: MouseEvent) => {
      this.foundation.handleClick(evt);
    };
    this.handleKeydown = (evt: KeyboardEvent) => {
      this.foundation.handleKeydown(evt);
    };

    this.listen('click', this.handleClick);
    this.listen('keydown', this.handleKeydown);
  }

  override destroy() {
    this.rippleSurface.destroy();
    this.unlisten('click', this.handleClick);
    this.unlisten('keydown', this.handleKeydown);
    super.destroy();
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCChipTrailingActionAdapter = {
      focus: () => {
        this.root.focus();
      },
      getAttribute: (attr) => this.root.getAttribute(attr),
      notifyInteraction: (trigger) => {
        this.emit<MDCChipTrailingActionInteractionEventDetail>(
            strings.INTERACTION_EVENT, {trigger}, true /* shouldBubble */);
      },
      notifyNavigation: (key) => {
        this.emit<MDCChipTrailingActionNavigationEventDetail>(
            strings.NAVIGATION_EVENT, {key}, true /* shouldBubble */);
      },
      setAttribute: (attr, value) => {
        this.safeSetAttribute(this.root, attr, value);
      },
    };
    return new MDCChipTrailingActionFoundation(adapter);
  }

  isNavigable() {
    return this.foundation.isNavigable();
  }

  focus() {
    this.foundation.focus();
  }

  removeFocus() {
    this.foundation.removeFocus();
  }
}
