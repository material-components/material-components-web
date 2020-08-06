/**
 * @license
 * Copyright 2020 Google Inc.
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
import {MDCNotchedOutlineFoundation} from '../../mdc-notched-outline/foundation';

const {cssClasses, numbers, strings} = MDCNotchedOutlineFoundation;

describe('MDCNotchedOutlineFoundation', () => {
  it('exports cssClasses', () => {
    expect(MDCNotchedOutlineFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports numbers', () => {
    expect(MDCNotchedOutlineFoundation.numbers).toEqual(numbers);
  });

  it('exports strings', () => {
    expect(MDCNotchedOutlineFoundation.strings).toEqual(strings);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCNotchedOutlineFoundation);
    return {foundation, mockAdapter};
  };

  it('#notch adds the notched class and sets the width of the element', () => {
    const {foundation, mockAdapter} = setupTest();
    const notchWidth = 30;
    foundation.notch(notchWidth);
    expect(mockAdapter.setNotchWidthProperty)
        .toHaveBeenCalledWith(
            notchWidth +
            MDCNotchedOutlineFoundation.numbers.NOTCH_ELEMENT_PADDING);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(
            MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED);
  });

  it('#closeNotch removes the notch selector and removes the width property',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.closeNotch();
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(
               MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED);
       expect(mockAdapter.removeNotchWidthProperty).toHaveBeenCalled();
     });
});
