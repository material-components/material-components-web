/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
