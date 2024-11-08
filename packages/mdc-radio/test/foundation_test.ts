/**
 * @license
 * Copyright 2016 Google Inc.
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
import {MDCRadioFoundation} from '../foundation';

function setupTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCRadioFoundation);
  return {foundation, mockAdapter};
}

describe('MDCRadioFoundation', () => {
  it('exports cssClasses', () => {
    expect('cssClasses' in MDCRadioFoundation).toBeTruthy();
  });

  it('exports strings', () => {
    expect('strings' in MDCRadioFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    const {defaultAdapter} = MDCRadioFoundation;
    const methods =
        Object.keys(defaultAdapter)
            .filter((k) => typeof (defaultAdapter as any)[k] === 'function');

    expect(methods.length).toEqual(Object.keys(defaultAdapter).length);
    expect(methods).toEqual(
        ['addClass', 'removeClass', 'setNativeControlDisabled']);
    methods.forEach((m) => {
      expect(() => (defaultAdapter as any)[m]).not.toThrow();
    });
  });

  it('#setDisabled calls adapter.setNativeControlDisabled', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(true);
    expect(mockAdapter.setNativeControlDisabled).toHaveBeenCalledWith(true);
  });

  it('#setDisabled adds mdc-radio--disabled to the radio element when set to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setDisabled(true);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCRadioFoundation.cssClasses.DISABLED);
     });

  it('#setDisabled removes mdc-radio--disabled from the radio element when set to false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setDisabled(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCRadioFoundation.cssClasses.DISABLED);
     });
});
