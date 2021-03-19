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

import {MDCChipAnimationEventDetail, MDCChipInteractionEventDetail, MDCChipNavigationEventDetail} from '../chip/types';

/**
 * MDCChipSetInteractionEventDetail provides detail about the interaction event.
 */
export interface MDCChipSetInteractionEventDetail {
  chipID: string;
  chipIndex: number;
}

/**
 * MDCChipSetRemovalEventDetail provides detail about the removal event.
 */
export interface MDCChipSetRemovalEventDetail {
  chipID: string;
  chipIndex: number;
  isComplete: boolean;
}

/**
 * MDCChipSetSelectionEventDetail provides detail about the selection event.
 */
export interface MDCChipSetSelectionEventDetail {
  chipID: string;
  chipIndex: number;
  isSelected: boolean;
}

/**
 * ChipInteractionEvent is the custom event for the interaction event.
 */
export type ChipInteractionEvent = CustomEvent<MDCChipInteractionEventDetail>;

/**
 * ChipNavigationEvent is the custom event for the navigation event.
 */
export type ChipNavigationEvent = CustomEvent<MDCChipNavigationEventDetail>;

/**
 * ChipAnimationEvent is the custom event for the animation event.
 */
export type ChipAnimationEvent = CustomEvent<MDCChipAnimationEventDetail>;
