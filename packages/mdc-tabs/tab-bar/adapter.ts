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

import {SpecificEventListener} from '@material/base/types';
import {MDCTabBarChangeEventDetail} from './types';

export interface MDCTabBarAdapter {
  addClass: (className: string) => void;
  removeClass: (className: string) => void;
  bindOnMDCTabSelectedEvent: () => void;
  unbindOnMDCTabSelectedEvent: () => void;
  registerResizeHandler: (handler: SpecificEventListener<'resize'>) => void;
  deregisterResizeHandler: (handler: SpecificEventListener<'resize'>) => void;
  getOffsetWidth: () => number;
  setStyleForIndicator: (propertyName: string, value: string) => void;
  getOffsetWidthForIndicator: () => number;
  notifyChange: (evtData: MDCTabBarChangeEventDetail) => void;
  getNumberOfTabs: () => number;
  isTabActiveAtIndex: (index: number) => boolean;
  setTabActiveAtIndex: (index: number, isActive: boolean) => void;
  isDefaultPreventedOnClickForTabAtIndex: (index: number) => boolean;
  setPreventDefaultOnClickForTabAtIndex: (index: number, preventDefaultOnClick: boolean) => void;
  measureTabAtIndex: (index: number) => void;
  getComputedWidthForTabAtIndex: (index: number) => number;
  getComputedLeftForTabAtIndex: (index: number) => number;
}
