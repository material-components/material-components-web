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

import {MDCComponent} from '@material/base/component';
import {CustomEventListener} from '@material/base/types';

import {MDCChipAction, MDCChipActionFactory} from '../action/component';
import {ActionType, Events, FocusBehavior} from '../action/constants';

import {MDCChipAdapter} from './adapter';
import {Animation} from './constants';
import {MDCChipFoundation} from './foundation';
import {ActionInteractionEvent, ActionNavigationEvent} from './types';

/**
 * MDCChipFactory is used by the parent MDCChipSet component to initialize
 * chips.
 */
export type MDCChipFactory = (el: Element, foundation?: MDCChipFoundation) =>
    MDCChip;

/**
 * MDCChip provides component encapsulation of the foundation implementation.
 */
export class MDCChip extends MDCComponent<MDCChipFoundation> {
  static attachTo(root: Element): MDCChip {
    return new MDCChip(root);
  }

  private readonly rootHTML = this.root as HTMLElement;

  // Below properties are all assigned in #initialize()
  private handleActionInteraction!: CustomEventListener<ActionInteractionEvent>;
  private handleActionNavigation!: CustomEventListener<ActionNavigationEvent>;
  private actions!: Map<ActionType, MDCChipAction>;

  initialize(
      actionFactory:
          MDCChipActionFactory = (el: Element) => new MDCChipAction(el)) {
    this.actions = new Map();
    const actionEls = this.root.querySelectorAll('.mdc-evolution-chip__action');
    for (let i = 0; i < actionEls.length; i++) {
      const action = actionFactory(actionEls[i]);
      this.actions.set(action.actionType(), action);
    }
  }

  initialSyncWithDOM() {
    this.handleActionInteraction = (event) => {
      this.foundation.handleActionInteraction(event);
    };

    this.handleActionNavigation = (event) => {
      this.foundation.handleActionNavigation(event);
    };

    this.listen(Events.INTERACTION, this.handleActionInteraction);
    this.listen(Events.NAVIGATION, this.handleActionNavigation);
  }

  destroy() {
    this.unlisten(Events.INTERACTION, this.handleActionInteraction);
    this.unlisten(Events.NAVIGATION, this.handleActionNavigation);
    super.destroy();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCChipAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      emitEvent: (eventName, eventDetail) => {
        this.emit(eventName, eventDetail, true /* shouldBubble */);
      },
      getActions: () => {
        const actions: ActionType[] = [];
        for (const [key] of this.actions) {
          actions.push(key);
        }
        return actions;
      },
      getAttribute: (attrName) => this.root.getAttribute(attrName),
      getElementID: () => this.rootHTML.id,
      getOffsetWidth: () => {
        return this.rootHTML.offsetWidth;
      },
      hasClass: (className) => this.root.classList.contains(className),
      isActionSelectable: (actionType: ActionType) => {
        const action = this.actions.get(actionType);
        if (action) {
          return action.isSelectable();
        }
        return false;
      },
      isActionSelected: (actionType: ActionType) => {
        const action = this.actions.get(actionType);
        if (action) {
          return action.isSelected();
        }
        return false;
      },
      isActionFocusable: (actionType: ActionType) => {
        const action = this.actions.get(actionType);
        if (action) {
          return action.isFocusable();
        }
        return false;
      },
      isActionDisabled: (actionType: ActionType) => {
        const action = this.actions.get(actionType);
        if (action) {
          return action.isDisabled();
        }
        return false;
      },
      isRTL: () => window.getComputedStyle(this.root).getPropertyValue(
                       'direction') === 'rtl',
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      setActionDisabled: (actionType: ActionType, isDisabled: boolean) => {
        const action = this.actions.get(actionType);
        if (action) {
          action.setDisabled(isDisabled);
        }
      },
      setActionFocus: (actionType: ActionType, behavior: FocusBehavior) => {
        const action = this.actions.get(actionType);
        if (action) {
          action.setFocus(behavior);
        }
      },
      setActionSelected: (actionType: ActionType, isSelected: boolean) => {
        const action = this.actions.get(actionType);
        if (action) {
          action.setSelected(isSelected);
        }
      },
      setStyleProperty: (prop: string, value: string) => {
        this.rootHTML.style.setProperty(prop, value);
      },
    };

    // Default to the primary foundation
    return new MDCChipFoundation(adapter);
  }

  /** Exposed to be called by the parent chip set. */
  remove() {
    const parent = this.root.parentNode;
    if (parent !== null) {
      parent.removeChild(this.root);
    }
  }

  /** Returns the ActionTypes for the encapsulated actions. */
  getActions(): ActionType[] {
    return this.foundation.getActions();
  }

  /** Returns the ID of the root element. */
  getElementID(): string {
    return this.foundation.getElementID();
  }

  isDisabled(): boolean {
    return this.foundation.isDisabled();
  }

  setDisabled(isDisabled: boolean) {
    this.foundation.setDisabled(isDisabled);
  }

  /** Returns the focusability of the action. */
  isActionFocusable(action: ActionType): boolean {
    return this.foundation.isActionFocusable(action);
  }

  /** Returns the selectability of the action. */
  isActionSelectable(action: ActionType): boolean {
    return this.foundation.isActionSelectable(action);
  }

  /** Returns the selected state of the action. */
  isActionSelected(action: ActionType): boolean {
    return this.foundation.isActionSelected(action);
  }

  /** Sets the focus behavior of the action. */
  setActionFocus(action: ActionType, focus: FocusBehavior) {
    this.foundation.setActionFocus(action, focus);
  }

  /** Sets the selected state of the action. */
  setActionSelected(action: ActionType, isSelected: boolean) {
    this.foundation.setActionSelected(action, isSelected);
  }

  /** Starts the animation on the chip. */
  startAnimation(animation: Animation) {
    this.foundation.startAnimation(animation);
  }
}
