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


import {setUpFoundationTest} from '../../../testing/helpers/setup';
import {cssClasses, strings} from '../../mdc-form-field/constants';
import {MDCFormFieldFoundation} from '../../mdc-form-field/foundation';

describe('MDCFormFieldFoundation', () => {
  it('exports cssClasses', () => {
    expect('cssClasses' in MDCFormFieldFoundation).toBeTruthy();
    expect(MDCFormFieldFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports strings', () => {
    expect('strings' in MDCFormFieldFoundation).toBeTruthy();
    expect(MDCFormFieldFoundation.strings).toEqual(strings);
  });

  function setupTest() {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCFormFieldFoundation);
    return {foundation, mockAdapter};
  }

  it('#init calls event registrations', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.init();
    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
  });

  it('#destroy calls event deregistrations', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.init();
    foundation.destroy();
    expect(mockAdapter.deregisterInteractionHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
  });
});
