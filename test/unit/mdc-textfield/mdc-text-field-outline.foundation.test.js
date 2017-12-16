/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTextFieldOutlineFoundation from '../../../packages/mdc-textfield/outline/foundation';

suite('MDCTextFieldOutlineFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCTextFieldOutlineFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldOutlineFoundation, [
    'getWidth', 'getHeight', 'setOutlinePathAttr',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldOutlineFoundation);

test('#updateSvgPath sets the path of the outline element when isRtl=false by default', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 100;
  const height = 100;
  const labelWidth = 30;
  const radius = 8;
  const path = 'M' + (radius + 2.1 + Math.abs(10 - radius) + labelWidth + 8) + ',' + 1
    + 'h' + (width - (2 * (radius + 2.1)) - labelWidth - 8.5 - Math.abs(10 - radius))
    + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius
    + 'v' + (height - 2 * (radius + 2.1))
    + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + radius
    + 'h' + (-width + 2 * (radius + 1.7))
    + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius
    + 'v' + (-height + 2 * (radius + 2.1))
    + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius
    + 'h' + Math.abs(10 - radius);
  td.when(mockAdapter.getWidth()).thenReturn(width - 2);
  td.when(mockAdapter.getHeight()).thenReturn(height - 2);
  foundation.updateSvgPath(labelWidth, radius);
  td.verify(mockAdapter.setOutlinePathAttr(path));
});


test('#updateSvgPath sets the path of the outline element when isRtl=true', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 100;
  const height = 100;
  const labelWidth = 30;
  const radius = 8;
  const path = 'M' + (width - radius - 2.1 - Math.abs(10 - radius)) + ',' + 1
    + 'h' + Math.abs(10 - radius)
    + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius
    + 'v' + (height - 2 * (radius + 2.1))
    + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + radius
    + 'h' + (-width + 2 * (radius + 1.7))
    + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius
    + 'v' + (-height + 2 * (radius + 2.1))
    + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius
    + 'h' + (width - (2 * (radius + 2.1)) - labelWidth - 8.5 - Math.abs(10 - radius));
  td.when(mockAdapter.getWidth()).thenReturn(width - 2);
  td.when(mockAdapter.getHeight()).thenReturn(height - 2);
  foundation.updateSvgPath(labelWidth, radius, true /* isRtl */);
  td.verify(mockAdapter.setOutlinePathAttr(path));
});
