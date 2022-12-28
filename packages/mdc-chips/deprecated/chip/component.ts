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
import {CustomEventListener, SpecificEventListener} from '@material/base/types';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple, MDCRippleFactory} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';

import {MDCChipTrailingAction, MDCChipTrailingActionFactory} from '../trailingaction/component';
import {strings as trailingActionStrings} from '../trailingaction/constants';
import {MDCChipTrailingActionInteractionEvent, MDCChipTrailingActionNavigationEvent} from '../trailingaction/types';

import {MDCChipAdapter} from './adapter';
import {strings} from './constants';
import {MDCChipFoundation} from './foundation';
import {MDCChipInteractionEventDetail, MDCChipNavigationEventDetail, MDCChipRemovalEventDetail, MDCChipSelectionEventDetail} from './types';

/** MDC Chip Factory */
export type MDCChipFactory = (el: Element, foundation?: MDCChipFoundation) =>
    MDCChip;

/** MDC Chip */
export class MDCChip extends MDCComponent<MDCChipFoundation> implements
    MDCRippleCapableSurface {
  /**
   * @return Whether the chip is selected.
   */
  get selected(): boolean {
    return this.foundation.isSelected();
  }

  /**
   * Sets selected state on the chip.
   */
  set selected(selected: boolean) {
    this.foundation.setSelected(selected);
  }

  /**
   * @return Whether a trailing icon click should trigger exit/removal of the
   *     chip.
   */
  get shouldRemoveOnTrailingIconClick(): boolean {
    return this.foundation.getShouldRemoveOnTrailingIconClick();
  }

  /**
   * Sets whether a trailing icon click should trigger exit/removal of the chip.
   */
  set shouldRemoveOnTrailingIconClick(shouldRemove: boolean) {
    this.foundation.setShouldRemoveOnTrailingIconClick(shouldRemove);
  }

  /**
   * Sets whether a clicking on the chip should focus the primary action.
   */
  set setShouldFocusPrimaryActionOnClick(shouldFocus: boolean) {
    this.foundation.setShouldFocusPrimaryActionOnClick(shouldFocus);
  }

  get ripple(): MDCRipple {
    return this.rippleSurface;
  }

  get id(): string {
    return this.root.id;
  }

  static override attachTo(root: Element) {
    return new MDCChip(root);
  }

  private leadingIcon!: Element|null;    // assigned in initialize()
  private checkmark!: Element|null;      // assigned in initialize()
  private primaryAction!: Element|null;  // assigned in initialize()
  private trailingAction!: MDCChipTrailingAction|
      null;                           // assigned in initialize()
  private rippleSurface!: MDCRipple;  // assigned in initialize()

  private handleTrailingActionInteraction!: CustomEventListener<
      MDCChipTrailingActionInteractionEvent>;  // assigned in
                                               // initialSyncWithDOM()
  private handleTrailingActionNavigation!: CustomEventListener<
      MDCChipTrailingActionNavigationEvent>;  // assigned in
                                              // initialSyncWithDOM()
  private handleTransitionEnd!:
      SpecificEventListener<'transitionend'>;  // assigned in
                                               // initialSyncWithDOM()
  private handleClick!:
      SpecificEventListener<'click'>;  // assigned in initialSyncWithDOM()
  private handleKeydown!:
      SpecificEventListener<'keydown'>;  // assigned in initialSyncWithDOM()
  private handleFocusIn!:
      SpecificEventListener<'focusin'>;  // assigned in initialSyncWIthDOM()
  private handleFocusOut!:
      SpecificEventListener<'focusout'>;  // assigned in initialSyncWIthDOM()

  override initialize(
      rippleFactory:
          MDCRippleFactory = (el, foundation) => new MDCRipple(el, foundation),
      trailingActionFactory:
          MDCChipTrailingActionFactory = (el) => new MDCChipTrailingAction(el),
  ) {
    this.leadingIcon = this.root.querySelector(strings.LEADING_ICON_SELECTOR);
    this.checkmark = this.root.querySelector(strings.CHECKMARK_SELECTOR);
    this.primaryAction =
        this.root.querySelector(strings.PRIMARY_ACTION_SELECTOR);

    const trailingActionEl =
        this.root.querySelector(strings.TRAILING_ACTION_SELECTOR);

    if (trailingActionEl) {
      this.trailingAction = trailingActionFactory(trailingActionEl);
    }

    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const rippleAdapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      computeBoundingRect: () => this.foundation.getDimensions(),
    };
    this.rippleSurface =
        rippleFactory(this.root, new MDCRippleFoundation(rippleAdapter));
  }

  override initialSyncWithDOM() {
    // Custom events
    this.handleTrailingActionInteraction = () => {
      this.foundation.handleTrailingActionInteraction();
    };
    this.handleTrailingActionNavigation =
        (evt: MDCChipTrailingActionNavigationEvent) => {
          this.foundation.handleTrailingActionNavigation(evt);
        };
    // Native events
    this.handleClick = () => {
      this.foundation.handleClick();
    };
    this.handleKeydown = (evt: KeyboardEvent) => {
      this.foundation.handleKeydown(evt);
    };
    this.handleTransitionEnd = (evt: TransitionEvent) => {
      this.foundation.handleTransitionEnd(evt);
    };
    this.handleFocusIn = (evt: FocusEvent) => {
      this.foundation.handleFocusIn(evt);
    };
    this.handleFocusOut = (evt: FocusEvent) => {
      this.foundation.handleFocusOut(evt);
    };


    this.listen('transitionend', this.handleTransitionEnd);
    this.listen('click', this.handleClick);
    this.listen('keydown', this.handleKeydown);
    this.listen('focusin', this.handleFocusIn);
    this.listen('focusout', this.handleFocusOut);

    if (this.trailingAction) {
      this.listen(
          trailingActionStrings.INTERACTION_EVENT,
          this.handleTrailingActionInteraction);
      this.listen(
          trailingActionStrings.NAVIGATION_EVENT,
          this.handleTrailingActionNavigation);
    }
  }

  override destroy() {
    this.rippleSurface.destroy();

    this.unlisten('transitionend', this.handleTransitionEnd);
    this.unlisten('keydown', this.handleKeydown);
    this.unlisten('click', this.handleClick);
    this.unlisten('focusin', this.handleFocusIn);
    this.unlisten('focusout', this.handleFocusOut);

    if (this.trailingAction) {
      this.unlisten(
          trailingActionStrings.INTERACTION_EVENT,
          this.handleTrailingActionInteraction);
      this.unlisten(
          trailingActionStrings.NAVIGATION_EVENT,
          this.handleTrailingActionNavigation);
    }

    super.destroy();
  }

  /**
   * Begins the exit animation which leads to removal of the chip.
   */
  beginExit() {
    this.foundation.beginExit();
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCChipAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      addClassToLeadingIcon: (className) => {
        if (this.leadingIcon) {
          this.leadingIcon.classList.add(className);
        }
      },
      eventTargetHasClass: (target, className) =>
          target ? (target as Element).classList.contains(className) : false,
      focusPrimaryAction: () => {
        if (this.primaryAction) {
          (this.primaryAction as HTMLElement).focus();
        }
      },
      focusTrailingAction: () => {
        if (this.trailingAction) {
          this.trailingAction.focus();
        }
      },
      getAttribute: (attr) => this.root.getAttribute(attr),
      getCheckmarkBoundingClientRect: () =>
          this.checkmark ? this.checkmark.getBoundingClientRect() : null,
      getComputedStyleValue: (propertyName) =>
          window.getComputedStyle(this.root).getPropertyValue(propertyName),
      getRootBoundingClientRect: () => this.root.getBoundingClientRect(),
      hasClass: (className) => this.root.classList.contains(className),
      hasLeadingIcon: () => !!this.leadingIcon,
      isRTL: () => window.getComputedStyle(this.root).getPropertyValue(
                       'direction') === 'rtl',
      isTrailingActionNavigable: () => {
        if (this.trailingAction) {
          return this.trailingAction.isNavigable();
        }
        return false;
      },
      notifyInteraction: () => {
        this.emit<MDCChipInteractionEventDetail>(
            strings.INTERACTION_EVENT, {chipId: this.id},
            true /* shouldBubble */);
      },
      notifyNavigation: (key, source) => {
        this.emit<MDCChipNavigationEventDetail>(
            strings.NAVIGATION_EVENT, {chipId: this.id, key, source},
            true /* shouldBubble */);
      },
      notifyRemoval: (removedAnnouncement) => {
        this.emit<MDCChipRemovalEventDetail>(
            strings.REMOVAL_EVENT, {chipId: this.id, removedAnnouncement},
            true /* shouldBubble */);
      },
      notifySelection: (selected, shouldIgnore) => {
        this.emit<MDCChipSelectionEventDetail>(
            strings.SELECTION_EVENT, {chipId: this.id, selected, shouldIgnore},
            true /* shouldBubble */);
      },
      notifyTrailingIconInteraction: () => {
        this.emit<MDCChipInteractionEventDetail>(
            strings.TRAILING_ICON_INTERACTION_EVENT, {chipId: this.id},
            true /* shouldBubble */);
      },
      notifyEditStart: () => {/* Not Implemented. */},
      notifyEditFinish: () => {/* Not Implemented. */},
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      removeClassFromLeadingIcon: (className) => {
        if (this.leadingIcon) {
          this.leadingIcon.classList.remove(className);
        }
      },
      removeTrailingActionFocus: () => {
        if (this.trailingAction) {
          this.trailingAction.removeFocus();
        }
      },
      setPrimaryActionAttr: (attr, value) => {
        if (this.primaryAction) {
          this.primaryAction.setAttribute(attr, value);
        }
      },
      setStyleProperty: (propertyName, value) => {
        (this.root as HTMLElement).style.setProperty(propertyName, value);
      },
    };
    return new MDCChipFoundation(adapter);
  }

  setSelectedFromChipSet(selected: boolean, shouldNotifyClients: boolean) {
    this.foundation.setSelectedFromChipSet(selected, shouldNotifyClients);
  }

  focusPrimaryAction() {
    this.foundation.focusPrimaryAction();
  }

  focusTrailingAction() {
    this.foundation.focusTrailingAction();
  }

  removeFocus() {
    this.foundation.removeFocus();
  }

  remove() {
    const parent = this.root.parentNode;
    if (parent !== null) {
      parent.removeChild(this.root);
    }
  }
}
