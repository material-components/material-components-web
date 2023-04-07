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
import {cssClasses} from '../constants';
import {MDCSlidingTabIndicatorFoundation} from '../sliding-foundation';

describe('MDCSlidingTabIndicatorFoundation', () => {
  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCSlidingTabIndicatorFoundation);
    return {foundation, mockAdapter};
  };

  it(`#activate adds the ${cssClasses.ACTIVE} class`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.computeContentClientRect.and.returnValue(
        {width: 100, left: 10});

    foundation.activate({width: 90, left: 25} as DOMRect);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.ACTIVE);
  });

  it('#activate sets the transform property with no transition, then transitions it back',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.computeContentClientRect.and.returnValue(
           {width: 100, left: 10});

       foundation.activate({width: 90, left: 25} as DOMRect);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(cssClasses.NO_TRANSITION);
       expect(mockAdapter.setContentStyleProperty)
           .toHaveBeenCalledWith('transform', 'translateX(15px) scaleX(0.9)');
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.NO_TRANSITION);
       expect(mockAdapter.setContentStyleProperty)
           .toHaveBeenCalledWith('transform', '');
     });

  it('#activate does not modify transform and does not transition if no client rect is passed',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.activate();
       expect(mockAdapter.setContentStyleProperty)
           .not.toHaveBeenCalledWith('transform', jasmine.any(String));
     });

  it(`#deactivate removes the ${cssClasses.ACTIVE} class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.deactivate();
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.ACTIVE);
  });
});
