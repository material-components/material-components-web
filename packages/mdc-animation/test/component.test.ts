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


import {getCorrectEventName, getCorrectPropertyName,} from '../../mdc-animation/index';

// Has no properties without a prefix
const legacyWindowObj = {
  document: {
    createElement: () => ({
      style: {
        'webkitTransform': 'nah',
      },
    })
  },
} as any;

describe('MDCAnimation', () => {
  it('#getCorrectEventName does not prefix events when not necessary', () => {
    const windowObj = {
      document: {
        createElement: () => ({
          style: {
            animation: 'none',
          },
        })
      },
    } as any;

    expect(getCorrectEventName(windowObj, 'animationstart'))
        .toEqual('animationstart');
  });

  it('#getCorrectPropertyName does not prefix events when not necessary',
     () => {
       const windowObj = {
         document: {
           createElement: () => ({
             style: {
               animation: 'none',
             },
           })
         },
       } as any;

       expect(getCorrectPropertyName(windowObj, 'animation'))
           .toEqual('animation');
     });

  it('#getCorrectEventName does not prefix events if window does not contain a DOM node',
     () => {
       const windowObj = {} as any;

       expect(getCorrectEventName(windowObj, 'animationstart'))
           .toEqual('animationstart');
     });

  it('#getCorrectPropertyName does not prefix events if window does not contain a DOM node',
     () => {
       const windowObj = {} as any;

       expect(getCorrectPropertyName(windowObj, 'transition'))
           .toEqual('transition');
     });

  it('#getCorrectPropertyName prefixes css properties when required', () => {
    expect(getCorrectPropertyName(legacyWindowObj, 'animation'))
        .toEqual('-webkit-animation');

    expect(getCorrectPropertyName(legacyWindowObj, 'transform'))
        .toEqual('-webkit-transform');

    expect(getCorrectPropertyName(legacyWindowObj, 'transition'))
        .toEqual('-webkit-transition');
  });

  it('#getCorrectEventName prefixes javascript events when required', () => {
    expect(getCorrectEventName(legacyWindowObj, 'animationstart'))
        .toEqual('webkitAnimationStart');

    expect(getCorrectEventName(legacyWindowObj, 'animationend'))
        .toEqual('webkitAnimationEnd');

    expect(getCorrectEventName(legacyWindowObj, 'animationiteration'))
        .toEqual('webkitAnimationIteration');

    expect(getCorrectEventName(legacyWindowObj, 'transitionend'))
        .toEqual('webkitTransitionEnd');
  });
});
