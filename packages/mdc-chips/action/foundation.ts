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
import {ActionType, Attributes, Events, FocusBehavior, InteractionTrigger} from './constants';
import {MDCChipActionInteractionEventDetail, MDCChipActionNavigationEventDetail} from './types';

const triggerMap = new Map<string, InteractionTrigger>();
triggerMap.set(KEY.SPACEBAR, InteractionTrigger.SPACEBAR_KEY);
triggerMap.set(KEY.ENTER, InteractionTrigger.ENTER_KEY);
triggerMap.set(KEY.DELETE, InteractionTrigger.DELETE_KEY);
triggerMap.set(KEY.BACKSPACE, InteractionTrigger.BACKSPACE_KEY);


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
    // Early exit if the action is in a non-interactive state.
    if (!this.isInteractive()) return;
    this.emitInteraction(InteractionTrigger.CLICK);
  }

  handleKeydown(event: KeyboardEvent) {
    // Early exit if the action is in a non-interactive state.
    if (!this.isInteractive()) return;
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
      this.adapter.setAttribute(Attributes.ARIA_DISABLED, `${isDisabled}`);
      return;
    }

    if (isDisabled) {
      this.adapter.setAttribute(Attributes.DISABLED, 'true');
    } else {
      this.adapter.removeAttribute(Attributes.DISABLED);
    }
  }

  isDisabled(): boolean {
    if (this.adapter.getAttribute(Attributes.ARIA_DISABLED) === 'true') {
      return true;
    }

    if (this.adapter.getAttribute(Attributes.DISABLED) !== null) {
      return true;
    }

    return false;
  }

  setFocus(behavior: FocusBehavior) {
    // Early exit if not focusable
    if (!this.isFocusable()) {
      return;
    }

    // Add it to the tab order and give focus
    if (behavior === FocusBehavior.FOCUSABLE_AND_FOCUSED) {
      this.adapter.setAttribute(Attributes.TAB_INDEX, '0');
      this.adapter.focus();
      return;
    }

    // Add to the tab order
    if (behavior === FocusBehavior.FOCUSABLE) {
      this.adapter.setAttribute(Attributes.TAB_INDEX, '0');
      return;
    }

    // Remove it from the tab order
    if (behavior === FocusBehavior.NOT_FOCUSABLE) {
      this.adapter.setAttribute(Attributes.TAB_INDEX, '-1');
      return;
    }
  }

  isFocusable() {
    if (!this.isInteractive()) {
      return false;
    }

    if (this.adapter.getAttribute(Attributes.ARIA_HIDDEN) === 'true') {
      return false;
    }

    return true;
  }

  setSelected(isSelected: boolean) {
    // Early exit if not selectable
    if (!this.isSelectable()) {
      return;
    }

    this.adapter.setAttribute(Attributes.ARIA_SELECTED, `${isSelected}`);
  }

  isSelected(): boolean {
    return this.adapter.getAttribute(Attributes.ARIA_SELECTED) === 'true';
  }

  isInteractive(): boolean {
    return !this.isDisabled() && !this.isPresentational();
  }

  private isPresentational(): boolean {
    return this.adapter.getAttribute(Attributes.ROLE) === 'presentation';
  }

  private emitInteraction(trigger: InteractionTrigger) {
    this.adapter.emitEvent<MDCChipActionInteractionEventDetail>(
        Events.INTERACTION, {
          actionID: this.adapter.getElementID(),
          source: this.actionType(),
          trigger,
        });
  }

  private emitNavigation(key: string) {
    this.adapter.emitEvent<MDCChipActionNavigationEventDetail>(
        Events.NAVIGATION, {
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

  private getTriggerFromKey(key: string): InteractionTrigger {
    const trigger = triggerMap.get(key);
    if (trigger) {
      return trigger;
    }

    // Default case, should ideally never be returned
    return InteractionTrigger.UNSPECIFIED;
  }

  abstract actionType(): ActionType;

  abstract isSelectable(): boolean;

  protected abstract shouldEmitInteractionOnRemoveKey(): boolean;
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipActionFoundation;
