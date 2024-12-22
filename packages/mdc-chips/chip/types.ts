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

import {MDCChipActionType} from '../action/constants';
import {MDCChipActionInteractionEventDetail, MDCChipActionNavigationEventDetail} from '../action/types';

import {MDCChipAnimation} from './constants';

/** MDCChipInteractionEventDetail provides details for the interaction event. */
export interface MDCChipInteractionEventDetail {
  actionID: string;
  chipID: string;
  source: MDCChipActionType;
  shouldRemove: boolean;
  isSelectable: boolean;
  isSelected: boolean;
}

/** MDCChipNavigationEventDetail provides details for the navigation event. */
export interface MDCChipNavigationEventDetail {
  chipID: string;
  source: MDCChipActionType;
  key: string;
  isRTL: boolean;
}

/**
 * MDCChipAnimationEventDetail provides details for the animation event.
 */
export interface MDCChipAnimationEventDetail {
  chipID: string;
  animation: MDCChipAnimation;
  isComplete: boolean;
  addedAnnouncement?: string;
  removedAnnouncement?: string;
}

/**
 * MDCChipAnimationEventDetail is the custom event for the animation event.
 */
 export type ActionAnimationEvent =
  CustomEvent<MDCChipAnimationEventDetail>;

/**
 * MDCChipActionInteractionEvent is the custom event for the interaction event.
 */
export type ActionInteractionEvent =
    CustomEvent<MDCChipActionInteractionEventDetail>;

/**
 * MDCChipActionInteractionEvent is the custom event for the interaction event.
 */
export type ActionNavigationEvent =
    CustomEvent<MDCChipActionNavigationEventDetail>;
