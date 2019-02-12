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
import {MDCNotchedOutline} from '@material/notched-outline/index';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRipple} from '@material/ripple/index';
import {MDCTextFieldCharacterCounterFoundation} from './character-counter/foundation';
import {MDCTextFieldCharacterCounter} from './character-counter/index';
import {MDCTextFieldHelperTextFoundation} from './helper-text/foundation';
import {MDCTextFieldHelperText} from './helper-text/index';
import {MDCTextFieldIconFoundation} from './icon/foundation';
import {MDCTextFieldIcon} from './icon/index';

export type NativeInputElement = Pick<HTMLInputElement, 'disabled' | 'maxLength' | 'type' | 'value'> & {
  validity: Pick<ValidityState, 'badInput' | 'valid'>;
};

export interface FoundationMapType {
  helperText: MDCTextFieldHelperTextFoundation;
  characterCounter: MDCTextFieldCharacterCounterFoundation;
  leadingIcon: MDCTextFieldIconFoundation;
  trailingIcon: MDCTextFieldIconFoundation;
}

export type RippleFactory = (el: Element, foundation: MDCRippleFoundation) => MDCRipple;
export type LineRippleFactory = (el: Element) => MDCLineRipple;
export type HelperTextFactory = (el: Element) => MDCTextFieldHelperText;
export type CharacterCounterFactory = (el: Element) => MDCTextFieldCharacterCounter;
export type IconFactory = (el: Element) => MDCTextFieldIcon;
export type LabelFactory = (el: Element) => MDCFloatingLabel;
export type OutlineFactory = (el: Element) => MDCNotchedOutline;
