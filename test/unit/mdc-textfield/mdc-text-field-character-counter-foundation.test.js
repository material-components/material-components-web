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

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTextFieldCharacterCounterFoundation from '../../../packages/mdc-textfield/character-counter/foundation';

suite('MDCTextFieldCharacterCounterFoundation');

test('exports cssClasses', () => {
  assert.isOk(MDCTextFieldCharacterCounterFoundation.cssClasses);
});

test('exports strings', () => {
  assert.isOk(MDCTextFieldCharacterCounterFoundation.strings);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldCharacterCounterFoundation, [
    'setContent',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldCharacterCounterFoundation);

test('#setContent sets the content of the character counter element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setCounterValue(12, 20);
  td.verify(mockAdapter.setContent('12 / 20'));
});

test('#setContent current length does not exceed character count limit', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setCounterValue(24, 20);
  td.verify(mockAdapter.setContent('20 / 20'));
});
