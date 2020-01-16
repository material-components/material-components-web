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

import {cssClasses} from '../../mdc-slider/constants';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

import {setupEventTest as setupTest, TRANSFORM_PROP} from './helpers';

describe('MDCSliderFoundation - General Events', () => {
  setUpMdcTestEnvironment();

  it('on focus adds the mdc-slider--focus class to the root element', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({width: 0, left: 0});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['focus']();

    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.FOCUS);
  });

  it('on focus does not add mdc-slider--focus after a pointer event', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['mousedown']({pageX: 50});
    jasmine.clock().tick(1);
    rootHandlers['focus']();

    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.FOCUS);
  });

  it('on blur removes the mdc-slider--focus class', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['blur']();

    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.FOCUS);
  });

  it('on blur resets the focusability UX of the component after an initial pointer event',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       rootHandlers['mousedown']({pageX: 50});
       jasmine.clock().tick(1);
       rootHandlers['focus']();
       // Sanity check
       expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.FOCUS);

       rootHandlers['blur']();
       rootHandlers['focus']();

       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.FOCUS);
     });

  it('on window resize re-lays out the component', () => {
    const {foundation, mockAdapter} = setupTest();
    const isA = jasmine.any;
    let resizeHandler;

    mockAdapter.registerResizeHandler.withArgs(isA(Function))
        .and.callFake((fn: Function) => {
          resizeHandler = fn;
        });
    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);
    // Sanity check
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(50px) translateX(-50%)');

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 50});
    (resizeHandler as unknown as Function)();
    jasmine.clock().tick(1);

    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(25px) translateX(-50%)');
  });
});
