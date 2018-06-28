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

import {TRANSFORM_PROP, setupEventTest as setupTest} from './helpers';

suite('MDCSliderFoundation - General Events');

test('on window resize re-lays out the component', () => {
  const {foundation, mockAdapter, raf} = setupTest();
  const {isA} = td.matchers;
  let resizeHandler;

  td.when(mockAdapter.registerWindowResizeHandler(isA(Function))).thenDo((fn) => {
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
  td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));

  resizeHandler();
  raf.flush();

  td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(25px) translateX(-50%)'));

  raf.restore();
});
