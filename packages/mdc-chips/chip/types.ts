/**
 * @license
 * Copyright 2019 Google Inc.
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

export enum MDCChipNavigationFocus {
  Text,
  TrailingIcon,
  None,
}

export interface MDCChipInteractionEventDetail {
  chipId: string;
}

export interface MDCChipSelectionEventDetail extends MDCChipInteractionEventDetail {
  selected: boolean;
}

export interface MDCChipRemovalEventDetail extends MDCChipInteractionEventDetail {
  root: Element;
}

export interface MDCChipNavigationEventDetail extends MDCChipInteractionEventDetail {
  key: string;
  source: MDCChipNavigationFocus;
}

// Note: CustomEvent<T> is not supported by Closure Compiler.

export interface MDCChipInteractionEvent extends Event {
  readonly detail: MDCChipInteractionEventDetail;
}

export interface MDCChipSelectionEvent extends Event {
  readonly detail: MDCChipSelectionEventDetail;
}

export interface MDCChipRemovalEvent extends Event {
  readonly detail: MDCChipRemovalEventDetail;
}

export interface MDCChipNavigationEvent extends Event {
  readonly detail: MDCChipNavigationEventDetail;
}
