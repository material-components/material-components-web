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

import * as util from '../../mdc-ripple/util';

import {createMockWindowForCssVariables} from './helpers';

describe('MDCRipple - util', () => {
  it('#supportsCssVariables returns true when CSS.supports() returns true for css vars',
     () => {
       const windowObj = createMockWindowForCssVariables();
       windowObj.CSS.supports.withArgs('--css-vars', jasmine.anything())
           .and.returnValue(true);
       windowObj.CSS.supports.withArgs(jasmine.stringMatching(/\(--css-vars:/))
           .and.returnValue(false);
       expect(util.supportsCssVariables(windowObj as any, true)).toBeTruthy();
       expect(windowObj.appendedNodes).toEqual(0);
     });

  it('#supportsCssVariables returns true when feature-detecting its way around Safari < 10',
     () => {
       const windowObj = createMockWindowForCssVariables();
       windowObj.CSS.supports.withArgs('--css-vars', jasmine.anything())
           .and.returnValue(false);
       windowObj.CSS.supports.withArgs(jasmine.stringMatching(/\(--css-vars:/))
           .and.returnValue(true);
       windowObj.CSS.supports.withArgs('color', '#00000000')
           .and.returnValue(true);
       expect(util.supportsCssVariables(windowObj as any, true)).toBeTruthy();

       windowObj.CSS.supports.withArgs(jasmine.stringMatching(/\(--css-vars:/))
           .and.returnValue(false);
       expect(util.supportsCssVariables(windowObj as any, true)).toBeFalsy();
       windowObj.CSS.supports.withArgs(jasmine.stringMatching(/\(--css-vars:/))
           .and.returnValue(true);

       windowObj.CSS.supports.withArgs('color', '#00000000')
           .and.returnValue(false);
       expect(util.supportsCssVariables(windowObj as any, true)).toBeFalsy();
       expect(windowObj.appendedNodes).toEqual(0);
     });

  it('#supportsCssVariables returns true when getComputedStyle returns null (e.g. Firefox hidden iframes)',
     () => {
       const windowObj = createMockWindowForCssVariables();
       windowObj.CSS.supports.withArgs('--css-vars', jasmine.anything())
           .and.returnValue(true);
       windowObj.CSS.supports.withArgs(jasmine.stringMatching(/\(--css-vars:/))
           .and.returnValue(false);
       windowObj.getComputedStyle.withArgs(jasmine.anything())
           .and.returnValue(null);
       expect(util.supportsCssVariables(windowObj as any, true)).toBeTruthy();
       expect(windowObj.appendedNodes).toEqual(0);
     });

  it('#supportsCssVariables returns false when CSS.supports() returns false for css vars',
     () => {
       const windowObj = {
         CSS: {
           supports: jasmine.createSpy('.supports'),
         },
       };
       windowObj.CSS.supports.withArgs('--css-vars', jasmine.anything())
           .and.returnValue(false);
       windowObj.CSS.supports.withArgs(jasmine.stringMatching(/\(--css-vars:/))
           .and.returnValue(false);
       expect(util.supportsCssVariables(windowObj as any, true)).toBeFalsy();
     });

  it('#supportsCssVariables returns false when CSS.supports is not a function',
     () => {
       const windowObj = {
         CSS: {
           supports: 'nope',
         },
       };
       expect(util.supportsCssVariables(windowObj as any, true)).toBeFalsy();
     });

  it('#supportsCssVariables returns false when CSS is not an object', () => {
    const windowObj = {
      CSS: null,
    };
    expect(util.supportsCssVariables(windowObj as any, true)).toBeFalsy();
  });

  it('#getNormalizedEventCoords maps event coords into the relative coordinates of the given rect',
     () => {
       const ev = {type: 'mousedown', pageX: 70, pageY: 70};
       const pageOffset = {x: 10, y: 10};
       const clientRect = {left: 50, top: 50};

       expect(util.getNormalizedEventCoords(
                  ev as any, pageOffset, clientRect as any))
           .toEqual({
             x: 10,
             y: 10,
           });
     });

  it('#getNormalizedEventCoords works with touchstart events', () => {
    const ev = {type: 'touchstart', changedTouches: [{pageX: 70, pageY: 70}]};
    const pageOffset = {x: 10, y: 10};
    const clientRect = {left: 50, top: 50};

    expect(
        util.getNormalizedEventCoords(ev as any, pageOffset, clientRect as any))
        .toEqual({
          x: 10,
          y: 10,
        });
  });
});
