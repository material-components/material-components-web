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


import {MDCLinearProgressFoundation} from '../../mdc-linear-progress/foundation';
import {checkNumTimesSpyCalledWithArgs, verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';

const {cssClasses, strings} = MDCLinearProgressFoundation;

describe('MDCLinearProgressFoundation', () => {
  it('exports strings', () => {
    expect('strings' in MDCLinearProgressFoundation).toBeTruthy();
  });

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCLinearProgressFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCLinearProgressFoundation, [
      'addClass',
      'getPrimaryBar',
      'forceLayout',
      'getBuffer',
      'hasClass',
      'removeAttribute',
      'removeClass',
      'setAttribute',
      'setStyle',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCLinearProgressFoundation);
    return {foundation, mockAdapter};
  };

  it('#setDeterminate false adds class, resets transforms, and removes aria-valuenow',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
           .and.returnValue(false);
       const primaryBar = {};
       mockAdapter.getPrimaryBar.and.returnValue(primaryBar);
       const buffer = {};
       mockAdapter.getBuffer.and.returnValue(buffer);
       foundation.init();
       foundation.setDeterminate(false);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(cssClasses.INDETERMINATE_CLASS);
       expect(mockAdapter.setStyle)
           .toHaveBeenCalledWith(primaryBar, 'transform', 'scaleX(1)');
       expect(mockAdapter.setStyle)
           .toHaveBeenCalledWith(buffer, 'transform', 'scaleX(1)');
       expect(mockAdapter.removeAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUENOW);
     });

  it('#setDeterminate removes class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    foundation.init();
    foundation.setDeterminate(true);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.INDETERMINATE_CLASS);
  });

  it('#setDeterminate false calls forceLayout to correctly reset animation timers when reversed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.REVERSED_CLASS)
           .and.returnValue(true);
       foundation.init();
       foundation.setDeterminate(false);
       expect(mockAdapter.forceLayout).toHaveBeenCalled();
     });

  it('#setDeterminate restores previous progress value after toggled from false to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const primaryBar = {};
       mockAdapter.getPrimaryBar.and.returnValue(primaryBar);
       foundation.init();
       foundation.setProgress(0.123);
       foundation.setDeterminate(false);
       foundation.setDeterminate(true);

       checkNumTimesSpyCalledWithArgs(
           mockAdapter.setStyle, [primaryBar, 'transform', 'scaleX(0.123)'], 2);
       checkNumTimesSpyCalledWithArgs(
           mockAdapter.setAttribute, [strings.ARIA_VALUENOW, '0.123'], 2);
     });

  it('#setDeterminate restores previous buffer value after toggled from false to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const buffer = {};
       mockAdapter.getBuffer.and.returnValue(buffer);
       foundation.init();
       foundation.setBuffer(0.123);
       foundation.setDeterminate(false);
       foundation.setDeterminate(true);
       checkNumTimesSpyCalledWithArgs(
           mockAdapter.setStyle, [buffer, 'transform', 'scaleX(0.123)'], 2);
     });

  it('#setDeterminate updates progress value set while determinate is false after determinate is true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const primaryBar = {};
       mockAdapter.getPrimaryBar.and.returnValue(primaryBar);
       foundation.init();
       foundation.setDeterminate(false);
       foundation.setProgress(0.123);
       foundation.setDeterminate(true);
       expect(mockAdapter.setStyle)
           .toHaveBeenCalledWith(primaryBar, 'transform', 'scaleX(0.123)');
       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUENOW, '0.123');
     });

  it('#setProgress sets transform and aria-valuenow', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    const primaryBar = {};
    mockAdapter.getPrimaryBar.and.returnValue(primaryBar);
    foundation.init();
    foundation.setProgress(0.5);
    expect(mockAdapter.setStyle)
        .toHaveBeenCalledWith(primaryBar, 'transform', 'scaleX(0.5)');
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith(strings.ARIA_VALUENOW, '0.5');
  });

  it('#setProgress on indeterminate does nothing', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(true);
    const primaryBar = {};
    mockAdapter.getPrimaryBar.and.returnValue(primaryBar);
    foundation.init();
    foundation.setProgress(0.5);
    expect(mockAdapter.setStyle).not.toHaveBeenCalled();
    expect(mockAdapter.setAttribute).not.toHaveBeenCalled();
  });

  it('#setBuffer sets transform', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    const buffer = {};
    mockAdapter.getBuffer.and.returnValue(buffer);
    foundation.init();
    foundation.setBuffer(0.5);
    expect(mockAdapter.setStyle)
        .toHaveBeenCalledWith(buffer, 'transform', 'scaleX(0.5)');
  });

  it('#setBuffer on indeterminate does nothing', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(true);
    const buffer = {};
    mockAdapter.getBuffer.and.returnValue(buffer);
    foundation.init();
    foundation.setBuffer(0.5);
    expect(mockAdapter.setStyle).not.toHaveBeenCalled();
  });

  it('#setReverse adds class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.REVERSED_CLASS)
        .and.returnValue(false);
    foundation.init();
    foundation.setReverse(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.REVERSED_CLASS);
  });

  it('#setReverse removes class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.REVERSED_CLASS)
        .and.returnValue(true);
    foundation.init();
    foundation.setReverse(false);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.REVERSED_CLASS);
  });

  it('#setReverse true calls forceLayout to correctly reset animation timers when indeterminate',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
           .and.returnValue(true);
       foundation.init();
       foundation.setReverse(true);
       expect(mockAdapter.forceLayout).toHaveBeenCalled();
     });

  it('#setReverse false calls forceLayout to correctly reset animation timers when indeterminate',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
           .and.returnValue(true);
       foundation.init();
       foundation.setReverse(false);
       expect(mockAdapter.forceLayout).toHaveBeenCalled();
     });

  it('#open removes class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.REVERSED_CLASS)
        .and.returnValue(true);
    foundation.init();
    foundation.open();
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.CLOSED_CLASS);
  });

  it('#close adds class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.REVERSED_CLASS)
        .and.returnValue(true);
    foundation.init();
    foundation.close();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSED_CLASS);
  });
});
