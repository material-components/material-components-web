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

import {EventType, SpecificEventListener} from '@material/base/types';

export interface MDCTabBarScrollerAdapter {
  addClass: (className: string) => void;
  removeClass: (className: string) => void;
  eventTargetHasClass: (target: Element, className: string) => boolean;
  addClassToForwardIndicator: (className: string) => void;
  removeClassFromForwardIndicator: (className: string) => void;
  addClassToBackIndicator: (className: string) => void;
  removeClassFromBackIndicator: (className: string) => void;
  isRTL: () => boolean;
  registerBackIndicatorClickHandler: (handler: SpecificEventListener<'click'>) => void;
  deregisterBackIndicatorClickHandler: (handler: SpecificEventListener<'click'>) => void;
  registerForwardIndicatorClickHandler: (handler: SpecificEventListener<'click'>) => void;
  deregisterForwardIndicatorClickHandler: (handler: SpecificEventListener<'click'>) => void;
  registerCapturedInteractionHandler: <K extends EventType>(evt: K, handler: SpecificEventListener<K>) => void;
  deregisterCapturedInteractionHandler: <K extends EventType>(evt: K, handler: SpecificEventListener<K>) => void;
  registerWindowResizeHandler: (handler: SpecificEventListener<'resize'>) => void;
  deregisterWindowResizeHandler: (handler: SpecificEventListener<'resize'>) => void;
  getNumberOfTabs: () => number;
  getComputedWidthForTabAtIndex: (index: number) => number;
  getComputedLeftForTabAtIndex: (index: number) => number;
  getOffsetWidthForScrollFrame: () => number;
  getScrollLeftForScrollFrame: () => number;
  setScrollLeftForScrollFrame: (scrollLeftAmount: number) => void;
  getOffsetWidthForTabBar: () => number;
  setTransformStyleForTabBar: (value: string) => void;
  getOffsetLeftForEventTarget: (target: HTMLElement) => number;
  getOffsetWidthForEventTarget: (target: HTMLElement) => number;
}
