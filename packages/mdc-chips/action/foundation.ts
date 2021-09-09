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

import {MDCChipActionAdapter} from './adapter';
import {MDCChipActionAttributes, MDCChipActionEvents, MDCChipActionFocusBehavior, MDCChipActionInteractionTrigger, MDCChipActionType} from './constants';
import {MDCChipActionInteractionEventDetail, MDCChipActionNavigationEventDetail} from './types';

const triggerMap = new Map<string, MDCChipActionInteractionTrigger>();
triggerMap.set(KEY.SPACEBAR, MDCChipActionInteractionTrigger.SPACEBAR_KEY);
triggerMap.set(KEY.ENTER, MDCChipActionInteractionTrigger.ENTER_KEY);
triggerMap.set(KEY.DELETE, MDCChipActionInteractionTrigger.DELETE_KEY);
triggerMap.set(KEY.BACKSPACE, MDCChipActionInteractionTrigger.BACKSPACE_KEY);


/**
 * MDCChipActionFoundation provides a base abstract foundation for all chip
 * actions.
 */
export abstract class MDCChipActionFoundation extends
    MDCFoundation<MDCChipActionAdapter> {
  static get defaultAdapter(): MDCChipActionAdapter {
    return {
      emitEvent: () => undefined,
      focus: () => undefined,
      getAttribute: () => null,
      getElementID: () => '',
      removeAttribute: () => undefined,
      setAttribute: () => undefined,
    };
  }

  constructor(adapter?: Partial<MDCChipActionAdapter>) {
    super({...MDCChipActionFoundation.defaultAdapter, ...adapter});
  }

  handleClick() {
    // Early exit for cases where the click comes from a source other than the
    // user's pointer (i.e. programmatic click from AT).
    if (this.isDisabled()) return;
    this.emitInteraction(MDCChipActionInteractionTrigger.CLICK);
  }

  handleKeydown(event: KeyboardEvent) {
    const key = normalizeKey(event);
    if (this.shouldNotifyInteractionFromKey(key)) {
      event.preventDefault();
      this.emitInteraction(this.getTriggerFromKey(key));
      return;
    }

    if (isNavigationEvent(event)) {
      event.preventDefault();
      this.emitNavigation(key);
      return;
    }
  }

  setDisabled(isDisabled: boolean) {
    // Use `aria-disabled` for the selectable (listbox) disabled state
    if (this.isSelectable()) {
      this.adapter.setAttribute(
          MDCChipActionAttributes.ARIA_DISABLED, `${isDisabled}`);
      return;
    }

    if (isDisabled) {
      this.adapter.setAttribute(MDCChipActionAttributes.DISABLED, 'true');
    } else {
      this.adapter.removeAttribute(MDCChipActionAttributes.DISABLED);
    }
  }

  isDisabled(): boolean {
    if (this.adapter.getAttribute(MDCChipActionAttributes.ARIA_DISABLED) ===
        'true') {
      return true;
    }

    if (this.adapter.getAttribute(MDCChipActionAttributes.DISABLED) !== null) {
      return true;
    }

    return false;
  }

  setFocus(behavior: MDCChipActionFocusBehavior) {
    // Early exit if not focusable
    if (!this.isFocusable()) {
      return;
    }

    // Add it to the tab order and give focus
    if (behavior === MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED) {
      this.adapter.setAttribute(MDCChipActionAttributes.TAB_INDEX, '0');
      this.adapter.focus();
      return;
    }

    // Add to the tab order
    if (behavior === MDCChipActionFocusBehavior.FOCUSABLE) {
      this.adapter.setAttribute(MDCChipActionAttributes.TAB_INDEX, '0');
      return;
    }

    // Remove it from the tab order
    if (behavior === MDCChipActionFocusBehavior.NOT_FOCUSABLE) {
      this.adapter.setAttribute(MDCChipActionAttributes.TAB_INDEX, '-1');
      return;
    }
  }

  isFocusable() {
    if (this.isDisabled()) {
      return false;
    }

    if (this.adapter.getAttribute(MDCChipActionAttributes.ARIA_HIDDEN) ===
        'true') {
      return false;
    }

    return true;
  }

  setSelected(isSelected: boolean) {
    // Early exit if not selectable
    if (!this.isSelectable()) {
      return;
    }

    this.adapter.setAttribute(
        MDCChipActionAttributes.ARIA_SELECTED, `${isSelected}`);
  }

  isSelected(): boolean {
    return this.adapter.getAttribute(MDCChipActionAttributes.ARIA_SELECTED) ===
        'true';
  }

  private emitInteraction(trigger: MDCChipActionInteractionTrigger) {
    this.adapter.emitEvent<MDCChipActionInteractionEventDetail>(
        MDCChipActionEvents.INTERACTION, {
          actionID: this.adapter.getElementID(),
          source: this.actionType(),
          trigger,
        });
  }

  private emitNavigation(key: string) {
    this.adapter.emitEvent<MDCChipActionNavigationEventDetail>(
        MDCChipActionEvents.NAVIGATION, {
          source: this.actionType(),
          key,
        });
  }

  private shouldNotifyInteractionFromKey(key: string): boolean {
    const isFromActionKey = key === KEY.ENTER || key === KEY.SPACEBAR;
    const isFromRemoveKey = key === KEY.BACKSPACE || key === KEY.DELETE;

    if (isFromActionKey) {
      return true;
    }

    if (isFromRemoveKey && this.shouldEmitInteractionOnRemoveKey()) {
      return true;
    }

    return false;
  }

  private getTriggerFromKey(key: string): MDCChipActionInteractionTrigger {
    const trigger = triggerMap.get(key);
    if (trigger) {
      return trigger;
    }

    // Default case, should ideally never be returned
    return MDCChipActionInteractionTrigger.UNSPECIFIED;
  }

  abstract actionType(): MDCChipActionType;

  abstract isSelectable(): boolean;

  protected abstract shouldEmitInteractionOnRemoveKey(): boolean;
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipActionFoundation;
