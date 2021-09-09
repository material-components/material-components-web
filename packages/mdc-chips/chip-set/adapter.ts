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

import {MDCChipActionFocusBehavior, MDCChipActionType} from '../action/constants';
import {MDCChipAnimation} from '../chip/constants';

import {Attributes, Events} from './constants';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCChipSetAdapter {
  /** Announces the message via an aria-live region */
  announceMessage(message: string): void;

  /** Emits the given event with the given detail. */
  emitEvent<D extends object>(eventName: Events, eventDetail: D): void;

  /** Returns the value for the given attribute, if it exists. */
  getAttribute(attrName: Attributes): string|null;

  /** Returns the actions provided by the child chip at the given index. */
  getChipActionsAtIndex(index: number): MDCChipActionType[];

  /** Returns the number of child chips. */
  getChipCount(): number;

  /** Returns the ID of the chip at the given index. */
  getChipIdAtIndex(index: number): string;

  /** Returns the index of the child chip with the matching ID. */
  getChipIndexById(chipID: string): number;

  /** Proxies to the MDCChip#isActionFocusable method. */
  isChipFocusableAtIndex(index: number, actionType: MDCChipActionType): boolean;

  /** Proxies to the MDCChip#isActionSelectable method. */
  isChipSelectableAtIndex(index: number, actionType: MDCChipActionType):
      boolean;

  /** Proxies to the MDCChip#isActionSelected method. */
  isChipSelectedAtIndex(index: number, actionType: MDCChipActionType): boolean;

  /** Removes the chip at the given index. */
  removeChipAtIndex(index: number): void;

  /** Proxies to the MDCChip#setActionFocus method. */
  setChipFocusAtIndex(
      index: number, action: MDCChipActionType,
      focus: MDCChipActionFocusBehavior): void;

  /** Proxies to the MDCChip#setActionSelected method. */
  setChipSelectedAtIndex(
      index: number, actionType: MDCChipActionType, isSelected: boolean): void;

  /** Starts the chip animation at the given index. */
  startChipAnimationAtIndex(index: number, animation: MDCChipAnimation): void;
}
