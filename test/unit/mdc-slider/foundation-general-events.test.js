/**
 * @license
 * Copyright 2017 Google Inc.
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

import td from 'testdouble';

import {cssClasses} from '../../../packages/mdc-slider/constants';
import {TRANSFORM_PROP, setupEventTest as setupTest} from './helpers';

suite('MDCSliderFoundation - General Events');

test('on focus adds the mdc-slider--focus class to the root element', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 0, left: 0});
  foundation.init();
  raf.flush();

  rootHandlers.focus();

  td.verify(mockAdapter.addClass(cssClasses.FOCUS));

  raf.restore();
});

test('on focus does not add mdc-slider--focus after a pointer event', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.mousedown({pageX: 50});
  raf.flush();
  rootHandlers.focus();

  td.verify(mockAdapter.addClass(cssClasses.FOCUS), {times: 0});

  raf.restore();
});

test('on blur removes the mdc-slider--focus class', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.blur();

  td.verify(mockAdapter.removeClass(cssClasses.FOCUS));

  raf.restore();
});

test('on blur resets the focusability UX of the component after an initial pointer event', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.mousedown({pageX: 50});
  raf.flush();
  rootHandlers.focus();
  // Sanity check
  td.verify(mockAdapter.addClass(cssClasses.FOCUS), {times: 0});

  rootHandlers.blur();
  rootHandlers.focus();

  td.verify(mockAdapter.addClass(cssClasses.FOCUS));

  raf.restore();
});

test('on window resize re-lays out the component', () => {
  const {foundation, mockAdapter, raf} = setupTest();
  const {isA} = td.matchers;
  let resizeHandler;

  td.when(mockAdapter.registerResizeHandler(isA(Function))).thenDo((fn) => {
    resizeHandler = fn;
  });
  td.when(mockAdapter.computeBoundingRect()).thenReturn(
    {left: 0, width: 100},
    {left: 0, width: 50}
  );
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();
  // Sanity check
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));

  resizeHandler();
  raf.flush();

  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(25px) translateX(-50%)'));

  raf.restore();
});
