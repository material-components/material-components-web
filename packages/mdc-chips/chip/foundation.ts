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

import {AnimationFrame} from '@material/animation/animationframe';
import {MDCFoundation} from '@material/base/foundation';
import {KEY} from '@material/dom/keyboard';

import {MDCChipActionFocusBehavior, MDCChipActionInteractionTrigger, MDCChipActionType} from '../action/constants';
import {MDCChipActionInteractionEventDetail} from '../action/types';

import {MDCChipAdapter} from './adapter';
import {MDCChipAnimation, MDCChipAttributes, MDCChipCssClasses, MDCChipEvents} from './constants';
import {ActionInteractionEvent, ActionNavigationEvent, MDCChipAnimationEventDetail, MDCChipInteractionEventDetail, MDCChipNavigationEventDetail} from './types';

interface Navigation {
  from: MDCChipActionType;
  to: MDCChipActionType;
}

enum Direction {
  UNSPECIFIED,  // Default
  LEFT,
  RIGHT,
}

enum AnimationKeys {
  SELECTION = 'selection',
  EXIT = 'exit',
}

/**
 * MDCChipFoundation provides a foundation for all chips.
 */
export class MDCChipFoundation extends MDCFoundation<MDCChipAdapter> {
  static override get defaultAdapter(): MDCChipAdapter {
    return {
      addClass: () => undefined,
      emitEvent: () => undefined,
      getActions: () => [],
      getAttribute: () => null,
      getElementID: () => '',
      getOffsetWidth: () => 0,
      hasClass: () => false,
      isActionDisabled: () => false,
      isActionFocusable: () => false,
      isActionSelectable: () => false,
      isActionSelected: () => false,
      isRTL: () => false,
      removeClass: () => undefined,
      setActionDisabled: () => undefined,
      setActionFocus: () => undefined,
      setActionSelected: () => undefined,
      setStyleProperty: () => undefined,
    };
  }

  private readonly animFrame: AnimationFrame;

  constructor(adapter?: Partial<MDCChipAdapter>) {
    super({...MDCChipFoundation.defaultAdapter, ...adapter});
    this.animFrame = new AnimationFrame();
  }

  override destroy() {
    this.animFrame.cancelAll();
  }

  getElementID() {
    return this.adapter.getElementID();
  }

  setDisabled(isDisabled: boolean) {
    const actions = this.getActions();
    for (const action of actions) {
      this.adapter.setActionDisabled(action, isDisabled);
    }

    if (isDisabled) {
      this.adapter.addClass(MDCChipCssClasses.DISABLED);
    } else {
      this.adapter.removeClass(MDCChipCssClasses.DISABLED);
    }
  }

  isDisabled(): boolean {
    const actions = this.getActions();
    for (const action of actions) {
      if (this.adapter.isActionDisabled(action)) {
        return true;
      }
    }
    return false;
  }

  getActions(): MDCChipActionType[] {
    return this.adapter.getActions();
  }

  isActionFocusable(action: MDCChipActionType): boolean {
    return this.adapter.isActionFocusable(action);
  }

  isActionSelectable(action: MDCChipActionType): boolean {
    return this.adapter.isActionSelectable(action);
  }

  isActionSelected(action: MDCChipActionType): boolean {
    return this.adapter.isActionSelected(action);
  }

  setActionFocus(action: MDCChipActionType, focus: MDCChipActionFocusBehavior) {
    this.adapter.setActionFocus(action, focus);
  }

  setActionSelected(action: MDCChipActionType, isSelected: boolean) {
    this.adapter.setActionSelected(action, isSelected);
    this.animateSelection(isSelected);
  }

  startAnimation(animation: MDCChipAnimation) {
    if (animation === MDCChipAnimation.ENTER) {
      this.adapter.addClass(MDCChipCssClasses.ENTER);
      return;
    }

    if (animation === MDCChipAnimation.EXIT) {
      this.adapter.addClass(MDCChipCssClasses.EXIT);
      return;
    }
  }

  handleAnimationEnd(event: AnimationEvent) {
    const {animationName} = event;
    if (animationName === MDCChipAnimation.ENTER) {
      this.adapter.removeClass(MDCChipCssClasses.ENTER);
      this.adapter.emitEvent<MDCChipAnimationEventDetail>(
          MDCChipEvents.ANIMATION, {
            chipID: this.getElementID(),
            animation: MDCChipAnimation.ENTER,
            addedAnnouncement: this.getAddedAnnouncement(),
            isComplete: true,
          });
      return;
    }

    if (animationName === MDCChipAnimation.EXIT) {
      this.adapter.removeClass(MDCChipCssClasses.EXIT);
      this.adapter.addClass(MDCChipCssClasses.HIDDEN);
      const width = this.adapter.getOffsetWidth();
      this.adapter.setStyleProperty('width', `${width}px`);
      // Wait two frames so the width gets applied correctly.
      this.animFrame.request(AnimationKeys.EXIT, () => {
        this.animFrame.request(AnimationKeys.EXIT, () => {
          this.adapter.setStyleProperty('width', '0');
        });
      });
    }
  }

  handleTransitionEnd() {
    if (!this.adapter.hasClass(MDCChipCssClasses.HIDDEN)) return;

    this.adapter.emitEvent<MDCChipAnimationEventDetail>(
        MDCChipEvents.ANIMATION, {
          chipID: this.getElementID(),
          animation: MDCChipAnimation.EXIT,
          removedAnnouncement: this.getRemovedAnnouncement(),
          isComplete: true,
        });
  }

  handleActionInteraction({detail}: ActionInteractionEvent) {
    const {source, actionID} = detail;
    const isSelectable = this.adapter.isActionSelectable(source);
    const isSelected = this.adapter.isActionSelected(source);

    this.adapter.emitEvent<MDCChipInteractionEventDetail>(
        MDCChipEvents.INTERACTION, {
          chipID: this.getElementID(),
          shouldRemove: this.shouldRemove(detail),
          actionID,
          isSelectable,
          isSelected,
          source,
        });
  }

  handleActionNavigation({detail}: ActionNavigationEvent) {
    const {source, key} = detail;
    const isRTL = this.adapter.isRTL();
    const isTrailingActionFocusable =
        this.adapter.isActionFocusable(MDCChipActionType.TRAILING);
    const isPrimaryActionFocusable =
        this.adapter.isActionFocusable(MDCChipActionType.PRIMARY);
    const dir = this.directionFromKey(key, isRTL);

    const shouldNavigateToTrailing = source === MDCChipActionType.PRIMARY &&
        dir === Direction.RIGHT && isTrailingActionFocusable;

    const shouldNavigateToPrimary = source === MDCChipActionType.TRAILING &&
        dir === Direction.LEFT && isPrimaryActionFocusable;

    if (shouldNavigateToTrailing) {
      this.navigateActions({from: source, to: MDCChipActionType.TRAILING});
      return;
    }

    if (shouldNavigateToPrimary) {
      this.navigateActions({from: source, to: MDCChipActionType.PRIMARY});
      return;
    }

    this.adapter.emitEvent<MDCChipNavigationEventDetail>(
        MDCChipEvents.NAVIGATION, {
          chipID: this.getElementID(),
          isRTL,
          source,
          key,
        });
  }

  private directionFromKey(key: string, isRTL: boolean): Direction {
    const isLeftKey = key === KEY.ARROW_LEFT;
    const isRightKey = key === KEY.ARROW_RIGHT;
    if (!isRTL && isLeftKey || isRTL && isRightKey) {
      return Direction.LEFT;
    }

    if (!isRTL && isRightKey || isRTL && isLeftKey) {
      return Direction.RIGHT;
    }

    return Direction.UNSPECIFIED;
  }

  private navigateActions(nav: Navigation) {
    this.adapter.setActionFocus(
        nav.from, MDCChipActionFocusBehavior.NOT_FOCUSABLE);
    this.adapter.setActionFocus(
        nav.to, MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
  }

  private shouldRemove({source, trigger}: MDCChipActionInteractionEventDetail):
      boolean {
    if (trigger === MDCChipActionInteractionTrigger.BACKSPACE_KEY ||
        trigger === MDCChipActionInteractionTrigger.DELETE_KEY) {
      return true;
    }

    return source === MDCChipActionType.TRAILING;
  }

  private getRemovedAnnouncement(): string|undefined {
    const msg =
        this.adapter.getAttribute(MDCChipAttributes.DATA_REMOVED_ANNOUNCEMENT);
    return msg || undefined;
  }

  private getAddedAnnouncement(): string|undefined {
    const msg =
        this.adapter.getAttribute(MDCChipAttributes.DATA_ADDED_ANNOUNCEMENT);
    return msg || undefined;
  }

  private animateSelection(isSelected: boolean) {
    this.resetAnimationStyles();
    // Wait two frames to ensure the animation classes are unset
    this.animFrame.request(AnimationKeys.SELECTION, () => {
      this.animFrame.request(AnimationKeys.SELECTION, () => {
        this.updateSelectionStyles(isSelected);
      });
    });
  }

  private resetAnimationStyles() {
    this.adapter.removeClass(MDCChipCssClasses.SELECTING);
    this.adapter.removeClass(MDCChipCssClasses.DESELECTING);
    this.adapter.removeClass(MDCChipCssClasses.SELECTING_WITH_PRIMARY_ICON);
    this.adapter.removeClass(MDCChipCssClasses.DESELECTING_WITH_PRIMARY_ICON);
  }

  private updateSelectionStyles(isSelected: boolean) {
    const hasIcon = this.adapter.hasClass(MDCChipCssClasses.WITH_PRIMARY_ICON);
    if (hasIcon && isSelected) {
      this.adapter.addClass(MDCChipCssClasses.SELECTING_WITH_PRIMARY_ICON);
      this.animFrame.request(AnimationKeys.SELECTION, () => {
        this.adapter.addClass(MDCChipCssClasses.SELECTED);
      });
      return;
    }

    if (hasIcon && !isSelected) {
      this.adapter.addClass(MDCChipCssClasses.DESELECTING_WITH_PRIMARY_ICON);
      this.animFrame.request(AnimationKeys.SELECTION, () => {
        this.adapter.removeClass(MDCChipCssClasses.SELECTED);
      });
      return;
    }

    if (isSelected) {
      this.adapter.addClass(MDCChipCssClasses.SELECTING);
      this.animFrame.request(AnimationKeys.SELECTION, () => {
        this.adapter.addClass(MDCChipCssClasses.SELECTED);
      });
      return;
    }

    if (!isSelected) {
      this.adapter.addClass(MDCChipCssClasses.DESELECTING);
      this.animFrame.request(AnimationKeys.SELECTION, () => {
        this.adapter.removeClass(MDCChipCssClasses.SELECTED);
      });
      return;
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipFoundation;
