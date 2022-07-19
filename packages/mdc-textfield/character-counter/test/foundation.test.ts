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


import {verifyDefaultAdapter} from '../../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {MDCTextFieldCharacterCounterFoundation} from '../../../mdc-textfield/character-counter/foundation';

describe('MDCTextFieldCharacterCounterFoundation', () => {
  it('exports cssClasses', () => {
    expect(MDCTextFieldCharacterCounterFoundation.cssClasses).toBeTruthy();
  });

  it('exports strings', () => {
    expect(MDCTextFieldCharacterCounterFoundation.strings).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCTextFieldCharacterCounterFoundation, [
      'setContent',
      'setCounterValue',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCTextFieldCharacterCounterFoundation);
    return {foundation, mockAdapter};
  };

  it('istanbul code coverage', () => {
    expect(() => new MDCTextFieldCharacterCounterFoundation).not.toThrow();
  });

  it('#setContent sets the content of the character counter element', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setCounterValue(12, 20);
    expect(mockAdapter.setContent).toHaveBeenCalledWith('12 / 20');
  });

  it('#setContent current length does not exceed character count limit', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setCounterValue(24, 20);
    expect(mockAdapter.setContent).toHaveBeenCalledWith('20 / 20');
  });
});
