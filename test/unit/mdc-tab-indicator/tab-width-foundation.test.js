/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *      http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import MDCTabWidthIndicatorFoundation from '../../../packages/mdc-tab-indicator/tab-width-foundation.js';

suite('MDCTabWidthIndicatorFoundation');

const setupTest = () => setupFoundationTest(MDCTabWidthIndicatorFoundation);

test('#layout sets the transform property to the left and width dimensions', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.animatePosition({
    getRootOffsetLeft: () => 5,
    getRootOffsetWidth: () => 10,
  });
  td.verify(mockAdapter.setRootStyleProperty('transform', 'translateX(5px) scaleX(10)'));
});
