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


import {MDCFloatingLabelFoundation} from '../../mdc-floating-label/foundation';
import {captureHandlers, verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';

const {cssClasses} = MDCFloatingLabelFoundation;

const setupTest = () => {
  const {foundation, mockAdapter} =
      setUpFoundationTest(MDCFloatingLabelFoundation);
  return {foundation, mockAdapter};
};

describe('MDCFloatingLabelFoundation', () => {
  it('exports cssClasses', () => {
    expect(MDCFloatingLabelFoundation.cssClasses).toEqual(cssClasses);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCFloatingLabelFoundation, [
      'addClass',
      'removeClass',
      'getWidth',
      'registerInteractionHandler',
      'deregisterInteractionHandler',
    ]);
  });

  it('#init should register animationend event listener', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('animationend', jasmine.any(Function));
  });

  it('#destroy should deregister animationend event listener', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.destroy();
    expect(mockAdapter.deregisterInteractionHandler)
        .toHaveBeenCalledWith('animationend', jasmine.any(Function));
  });

  it('#getWidth returns the width of the label element scaled by 75%', () => {
    const {foundation, mockAdapter} = setupTest();
    const width = 100;
    mockAdapter.getWidth.and.returnValue(width);
    expect(foundation.getWidth()).toEqual(width);
  });

  it('#float called with shouldFloat is true, floats the label', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.float(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOAT_ABOVE);
  });

  it('#float called with shouldFloat is false, de-floats the label', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.float(false);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOAT_ABOVE);
  });

  it('#shake called with shouldShake is true, should add shake class', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.shake(true);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.LABEL_SHAKE);
  });

  it('#shake called with shouldShake is false, should remove shake class',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.shake(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.LABEL_SHAKE);
     });

  it('#float called with shouldFloat is false, should remove shake class',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.float(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.LABEL_SHAKE);
     });

  it('#handleShakeAnimationEnd_ should remove LABEL_SHAKE class', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleShakeAnimationEnd_();
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_SHAKE);
  });

  it(`on animationend removes ${cssClasses.LABEL_SHAKE} class`, () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCFloatingLabelFoundation);
    const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
    foundation.init();
    handlers['animationend']();
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_SHAKE);
  });
});
