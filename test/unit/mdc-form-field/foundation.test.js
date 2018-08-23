/**
 * @license
 * Copyright 2017 Google Inc.
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

import MDCFormFieldFoundation from '../../../packages/mdc-form-field/foundation';
import {cssClasses, strings} from '../../../packages/mdc-form-field/constants';
import {verifyDefaultAdapter} from '../helpers/foundation';

suite('MDCFormFieldFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCFormFieldFoundation);
  assert.deepEqual(MDCFormFieldFoundation.cssClasses, cssClasses);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCFormFieldFoundation);
  assert.deepEqual(MDCFormFieldFoundation.strings, strings);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCFormFieldFoundation, [
    'registerInteractionHandler', 'deregisterInteractionHandler', 'activateInputRipple', 'deactivateInputRipple',
  ]);
});

function setupTest() {
  const mockAdapter = td.object(MDCFormFieldFoundation.defaultAdapter);
  const foundation = new MDCFormFieldFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

test('#init calls event registrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerInteractionHandler('click', isA(Function)));
});

test('#destroy calls event deregistrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInteractionHandler('click', isA(Function)));
});
