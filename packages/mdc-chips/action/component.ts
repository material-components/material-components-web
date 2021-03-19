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
import {closest} from '@material/dom/ponyfill';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple, MDCRippleFactory} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';

import {MDCChipActionAdapter} from './adapter';
import {computePrimaryActionRippleClientRect, GRAPHIC_SELECTED_WIDTH_STYLE_PROP} from './component-ripple';
import {ActionType, CssClasses, FocusBehavior} from './constants';
import {MDCChipActionFoundation} from './foundation';
import {MDCChipPrimaryActionFoundation} from './primary-foundation';
import {MDCChipTrailingActionFoundation} from './trailing-foundation';

/**
 * MDCChipActionFactory is used by the parent MDCChip component to initialize
 * chip actions.
 */
export type MDCChipActionFactory =
    (el: Element, foundation?: MDCChipActionFoundation) => MDCChipAction;

/**
 * MDCChipAction provides component encapsulation of the different foundation
 * implementations.
 */
export class MDCChipAction extends
    MDCComponent<MDCChipActionFoundation> implements MDCRippleCapableSurface {
  static attachTo(root: Element): MDCChipAction {
    return new MDCChipAction(root);
  }

  private readonly rootHTML = this.root as HTMLElement;

  // Assigned in #initialize()
  private rippleInstance!: MDCRipple;
  // Assigned in #initialSyncWithDOM()
  private handleClick!: SpecificEventListener<'click'>;
  private handleKeydown!: SpecificEventListener<'keydown'>;

  get ripple(): MDCRipple {
    return this.rippleInstance;
  }

  initialize(
      rippleFactory: MDCRippleFactory = (el, foundation) =>
          new MDCRipple(el, foundation)) {
    const rippleAdapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      computeBoundingRect: () => this.computeRippleClientRect(),
    };
    this.rippleInstance =
        rippleFactory(this.root, new MDCRippleFoundation(rippleAdapter));
  }

  initialSyncWithDOM() {
    this.handleClick = () => {
      this.foundation.handleClick();
    };

    this.handleKeydown = (event: KeyboardEvent) => {
      this.foundation.handleKeydown(event);
    };

    this.listen('click', this.handleClick);
    this.listen('keydown', this.handleKeydown);
  }

  destroy() {
    this.ripple.destroy();
    this.unlisten('click', this.handleClick);
    this.unlisten('keydown', this.handleKeydown);
    super.destroy();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCChipActionAdapter = {
      emitEvent: (eventName, eventDetail) => {
        this.emit(eventName, eventDetail, true /* shouldBubble */);
      },
      focus: () => {
        this.rootHTML.focus();
      },
      getAttribute: (attrName) => this.root.getAttribute(attrName),
      getElementID: () => this.root.id,
      removeAttribute: (name) => {
        this.root.removeAttribute(name);
      },
      setAttribute: (name, value) => {
        this.root.setAttribute(name, value);
      },
    };

    if (this.root.classList.contains(CssClasses.TRAILING_ACTION)) {
      return new MDCChipTrailingActionFoundation(adapter);
    }

    // Default to the primary foundation
    return new MDCChipPrimaryActionFoundation(adapter);
  }

  setDisabled(isDisabled: boolean) {
    this.foundation.setDisabled(isDisabled);
  }

  isDisabled(): boolean {
    return this.foundation.isDisabled();
  }

  setFocus(behavior: FocusBehavior) {
    this.foundation.setFocus(behavior);
  }

  isFocusable() {
    return this.foundation.isFocusable();
  }

  setSelected(isSelected: boolean) {
    this.foundation.setSelected(isSelected);
  }

  isSelected(): boolean {
    return this.foundation.isSelected();
  }

  isSelectable(): boolean {
    return this.foundation.isSelectable();
  }

  actionType(): ActionType {
    return this.foundation.actionType();
  }

  private computeRippleClientRect(): ClientRect {
    if (this.root.classList.contains(CssClasses.PRIMARY_ACTION)) {
      const chipRoot = closest(this.root, `.${CssClasses.CHIP_ROOT}`);
      // Return the root client rect since it's better than nothing
      if (!chipRoot) return this.root.getBoundingClientRect();
      const graphicWidth = window.getComputedStyle(chipRoot).getPropertyValue(
          GRAPHIC_SELECTED_WIDTH_STYLE_PROP);
      return computePrimaryActionRippleClientRect(
          chipRoot.getBoundingClientRect(), graphicWidth);
    }

    return this.root.getBoundingClientRect();
  }
}
