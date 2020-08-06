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
import {MDCLineRippleFoundation} from '../../mdc-line-ripple/foundation';

const {cssClasses} = MDCLineRippleFoundation;

describe('MDCLineRippleFoundation', () => {
  it('exports cssClasses', () => {
    expect('cssClasses' in MDCLineRippleFoundation).toBeTruthy();
  });

  it('exports strings', () => {
    expect('strings' in MDCLineRippleFoundation).toBeTruthy();
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCLineRippleFoundation);
    return {foundation, mockAdapter};
  };

  it('#init adds event listeners', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();

    expect(mockAdapter.registerEventHandler)
        .toHaveBeenCalledWith('transitionend', jasmine.any(Function));
  });

  it('#destroy removes event listeners', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.destroy();

    expect(mockAdapter.deregisterEventHandler)
        .toHaveBeenCalledWith('transitionend', jasmine.any(Function));
  });

  it(`activate adds ${cssClasses.LINE_RIPPLE_ACTIVE} class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    foundation.activate();
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LINE_RIPPLE_ACTIVE);
  });

  it(`deactivate adds ${cssClasses.LINE_RIPPLE_DEACTIVATING} class`, () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.init();
    foundation.deactivate();
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LINE_RIPPLE_DEACTIVATING);
  });

  it('opacity event after adding deactivating class triggers triggers removal of activation classes',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.LINE_RIPPLE_DEACTIVATING)
           .and.returnValue(true);
       const event = {
         propertyName: 'opacity',
       };

       foundation.init();
       foundation.handleTransitionEnd(event);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.LINE_RIPPLE_DEACTIVATING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.LINE_RIPPLE_ACTIVE);
     });

  it(`non opacity transition event doesn't remove ${
         cssClasses.LINE_RIPPLE_DEACTIVATING} class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.LINE_RIPPLE_DEACTIVATING)
           .and.returnValue(true);
       const event = {
         propertyName: 'not-opacity',
       };
       foundation.init();

       foundation.handleTransitionEnd(event);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.LINE_RIPPLE_DEACTIVATING);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.LINE_RIPPLE_ACTIVE);
     });

  it(`opacity transition event doesn't remove ${
         cssClasses.LINE_RIPPLE_DEACTIVATING} class if not deactivating`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.LINE_RIPPLE_DEACTIVATING)
           .and.returnValue(false);
       const event = {
         propertyName: 'opacity',
       };
       foundation.init();
       foundation.handleTransitionEnd(event);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.LINE_RIPPLE_DEACTIVATING);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.LINE_RIPPLE_ACTIVE);
     });

  it('setRippleCenter sets style attribute', () => {
    const {foundation, mockAdapter} = setupTest();
    const transformOriginValue = 100;

    foundation.init();
    foundation.setRippleCenter(transformOriginValue);

    expect(mockAdapter.setStyle)
        .toHaveBeenCalledWith('transform-origin', jasmine.any(String));
  });
});
