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
import {MDCChipActionEvents, MDCChipActionFocusBehavior, MDCChipActionType} from '../action/constants';

import {MDCChipAdapter} from './adapter';
import {MDCChipAnimation, MDCChipAnimationEvents} from './constants';
import {MDCChipFoundation} from './foundation';
import {ActionAnimationEvent, ActionInteractionEvent, ActionNavigationEvent} from './types';

/**
 * MDCChipFactory is used by the parent MDCChipSet component to initialize
 * chips.
 */
export type MDCChipFactory =
    (el: HTMLElement, foundation?: MDCChipFoundation) => MDCChip;

/**
 * MDCChip provides component encapsulation of the foundation implementation.
 */
export class MDCChip extends MDCComponent<MDCChipFoundation> {
  static override attachTo(root: HTMLElement): MDCChip {
    return new MDCChip(root);
  }

  // Below properties are all assigned in #initialize()
  private handleActionInteraction!: CustomEventListener<ActionInteractionEvent>;
  private handleActionNavigation!: CustomEventListener<ActionNavigationEvent>;
  private handleAnimationEnd!: CustomEventListener<ActionAnimationEvent>;
  private handleTransitionEnd!: CustomEventListener<ActionAnimationEvent>;
  private actions!: Map<MDCChipActionType, MDCChipAction>;

  override initialize(
      actionFactory:
          MDCChipActionFactory = (el: HTMLElement) => new MDCChipAction(el)) {
    this.actions = new Map();
    const actionEls =
        this.root.querySelectorAll<HTMLElement>('.mdc-evolution-chip__action');
    for (let i = 0; i < actionEls.length; i++) {
      const action = actionFactory(actionEls[i]);
      this.actions.set(action.actionType(), action);
    }
  }

  override initialSyncWithDOM() {
    this.handleActionInteraction = (event) => {
      this.foundation.handleActionInteraction(event);
    };

    this.handleActionNavigation = (event) => {
      this.foundation.handleActionNavigation(event);
    };

    this.listen(MDCChipActionEvents.INTERACTION, this.handleActionInteraction);
    this.listen(MDCChipActionEvents.NAVIGATION, this.handleActionNavigation);
    this.listen(MDCChipAnimationEvents.ANIMATION_END, this.handleAnimationEnd);
    this.listen(MDCChipAnimationEvents.TRANSITION_END, this.handleTransitionEnd);
  }

  override destroy() {
    this.unlisten(
        MDCChipActionEvents.INTERACTION, this.handleActionInteraction);
    this.unlisten(MDCChipActionEvents.NAVIGATION, this.handleActionNavigation);
    this.unlisten(MDCChipAnimationEvents.ANIMATION_END, this.handleAnimationEnd);
    this.unlisten(MDCChipAnimationEvents.TRANSITION_END, this.handleTransitionEnd);
    super.destroy();
  }

  override getDefaultFoundation() {
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
        const actions: MDCChipActionType[] = [];
        for (const [key] of this.actions) {
          actions.push(key);
        }
        return actions;
      },
      getAttribute: (attrName) => this.root.getAttribute(attrName),
      getElementID: () => this.root.id,
      getOffsetWidth: () => {
        return this.root.offsetWidth;
      },
      hasClass: (className) => this.root.classList.contains(className),
      isActionSelectable: (actionType: MDCChipActionType) => {
        const action = this.actions.get(actionType);
        if (action) {
          return action.isSelectable();
        }
        return false;
      },
      isActionSelected: (actionType: MDCChipActionType) => {
        const action = this.actions.get(actionType);
        if (action) {
          return action.isSelected();
        }
        return false;
      },
      isActionFocusable: (actionType: MDCChipActionType) => {
        const action = this.actions.get(actionType);
        if (action) {
          return action.isFocusable();
        }
        return false;
      },
      isActionDisabled: (actionType: MDCChipActionType) => {
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
      setActionDisabled:
          (actionType: MDCChipActionType, isDisabled: boolean) => {
            const action = this.actions.get(actionType);
            if (action) {
              action.setDisabled(isDisabled);
            }
          },
      setActionFocus:
          (actionType: MDCChipActionType,
           behavior: MDCChipActionFocusBehavior) => {
            const action = this.actions.get(actionType);
            if (action) {
              action.setFocus(behavior);
            }
          },
      setActionSelected:
          (actionType: MDCChipActionType, isSelected: boolean) => {
            const action = this.actions.get(actionType);
            if (action) {
              action.setSelected(isSelected);
            }
          },
      setStyleProperty: (prop: string, value: string) => {
        this.root.style.setProperty(prop, value);
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

  /** Returns the MDCChipActionTypes for the encapsulated actions. */
  getActions(): MDCChipActionType[] {
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
  isActionFocusable(action: MDCChipActionType): boolean {
    return this.foundation.isActionFocusable(action);
  }

  /** Returns the selectability of the action. */
  isActionSelectable(action: MDCChipActionType): boolean {
    return this.foundation.isActionSelectable(action);
  }

  /** Returns the selected state of the action. */
  isActionSelected(action: MDCChipActionType): boolean {
    return this.foundation.isActionSelected(action);
  }

  /** Sets the focus behavior of the action. */
  setActionFocus(action: MDCChipActionType, focus: MDCChipActionFocusBehavior) {
    this.foundation.setActionFocus(action, focus);
  }

  /** Sets the selected state of the action. */
  setActionSelected(action: MDCChipActionType, isSelected: boolean) {
    this.foundation.setActionSelected(action, isSelected);
  }

  /** Starts the animation on the chip. */
  startAnimation(animation: MDCChipAnimation) {
    this.foundation.startAnimation(animation);
  }
}
