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


import {checkNumTimesSpyCalledWithArgs} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';
import {MDCCircularProgressFoundation} from '../../mdc-circular-progress/foundation';

const {cssClasses, strings} = MDCCircularProgressFoundation;

describe('MDCCircularProgressFoundation', () => {
  it('exports strings', () => {
    expect('strings' in MDCCircularProgressFoundation).toBeTruthy();
  });

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCCircularProgressFoundation).toBeTruthy();
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCCircularProgressFoundation);
    mockAdapter.getDeterminateCircleAttribute.withArgs(strings.RADIUS)
        .and.returnValue(7);
    return {foundation, mockAdapter};
  };

  it('#setDeterminate false adds class and removes aria-valuenow', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    foundation.init();
    foundation.setDeterminate(false);
    expect(foundation.isDeterminate()).toBe(false);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.INDETERMINATE_CLASS);
    expect(mockAdapter.removeAttribute)
        .toHaveBeenCalledWith(strings.ARIA_VALUENOW);
  });

  it('#setDeterminate true removes class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(true);
    foundation.init();
    foundation.setDeterminate(true);
    expect(foundation.isDeterminate()).toBe(true);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.INDETERMINATE_CLASS);
    expect(mockAdapter.setDeterminateCircleAttribute)
        .toHaveBeenCalledWith(strings.STROKE_DASHOFFSET, jasmine.any(String));
  });

  it('#setDeterminate calls setDeterminateCircleAttribute and sets ARIA_VALUENOW',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
           .and.returnValue(true);
       foundation.init();
       foundation.setDeterminate(true);
       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUENOW, '0');
       expect(mockAdapter.setDeterminateCircleAttribute)
           .toHaveBeenCalledWith(
               strings.STROKE_DASHOFFSET, jasmine.any(String));
     });

  it('#setDeterminate restores previous progress value after toggled from false to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       foundation.setProgress(0.123);
       foundation.setDeterminate(false);
       foundation.setDeterminate(true);

       checkNumTimesSpyCalledWithArgs(
           mockAdapter.setAttribute, [strings.ARIA_VALUENOW, '0.123'], 2);
     });

  it('#setDeterminate updates progress value set while determinate is false after determinate is true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       foundation.setDeterminate(false);
       foundation.setProgress(0.123);
       foundation.setDeterminate(true);

       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUENOW, '0.123');
       expect(mockAdapter.setDeterminateCircleAttribute)
           .toHaveBeenCalledWith(
               strings.STROKE_DASHOFFSET, jasmine.any(String));
     });

  it('#setProgress sets aria-valuenow', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    foundation.init();
    foundation.setProgress(0.5);
    expect(foundation.getProgress()).toEqual(0.5);
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith(strings.ARIA_VALUENOW, '0.5');
  });

  it('#setProgress on indeterminate does nothing', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(true);
    foundation.init();
    foundation.setProgress(0.5);
    expect(mockAdapter.setDeterminateCircleAttribute).not.toHaveBeenCalled();
    expect(mockAdapter.setAttribute).not.toHaveBeenCalled();
  });

  it('#open removes class', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    foundation.open();
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.CLOSED_CLASS);
    expect(foundation.isClosed()).toBe(false);
  });

  it('#close adds class', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    foundation.close();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSED_CLASS);
    expect(foundation.isClosed()).toBe(true);
  });
});
