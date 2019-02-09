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

import {MDCFloatingLabel} from '@material/floating-label/index';
import {MDCLineRipple} from '@material/line-ripple/index';
import {MDCMenu} from '@material/menu/index';
import {MDCNotchedOutline} from '@material/notched-outline/index';
import {MDCSelectHelperTextFoundation} from './helper-text/index';
import {MDCSelectIconFoundation} from './icon/index';

export interface FoundationMapType {
  leadingIcon: MDCSelectIconFoundation;
  helperText: MDCSelectHelperTextFoundation;
}

export interface SelectEvent extends Event {
  detail: SelectEventDetail;
}

export interface SelectEventDetail {
  value: string;
  index: number;
}

// TODO(acdvorak): Every component should export its own factory and event types.
export type LineRippleFactory = (el: Element) => MDCLineRipple;
export type HelperTextFactory = (el: Element) => MDCTextFieldHelperText;
export type MenuFactory = (el: Element) => MDCMenu;
export type IconFactory = (el: Element) => MDCTextFieldIcon;
export type LabelFactory = (el: Element) => MDCFloatingLabel;
export type OutlineFactory = (el: Element) => MDCNotchedOutline;
