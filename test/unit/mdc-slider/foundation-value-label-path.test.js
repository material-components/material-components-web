/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';

import MDCSliderFoundation from '../../../packages/mdc-slider/foundation';

suite.only('MDCSliderFoundation - Value Label Path');

const setupTest = () => setupFoundationTest(MDCSliderFoundation);

const DIGIT_WIDTH = 9;
const COMMA_WIDTH = 3;
const MAX_TOP_LOBE_HORIZONTAL = 30;
const TOP_LOBE_RADIUS = 16;
const TOP_NECK_RADIUS = 14;
const MAX_TOP_NECK_WIDTH = 15;

test('total horizontal distance added to the top-lobe', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getDigitWidth()).thenReturn(DIGIT_WIDTH);
  td.when(mockAdapter.getCommaWidth()).thenReturn(COMMA_WIDTH);
  foundation.rect_ = 1000;

  foundation.value_ = 10000000000; // 10,000,000,000
  const numCommas = 3;
  const labelHorizontalWidth = ('10000000000'.length - 2) * DIGIT_WIDTH + numCommas * COMMA_WIDTH;
  const topLobeHorizontal = Math.min(labelHorizontalWidth, MAX_TOP_LOBE_HORIZONTAL);
  const topNeckTheta = Math.acos((MAX_TOP_NECK_WIDTH - topLobeHorizontal/2)/(TOP_LOBE_RADIUS + TOP_NECK_RADIUS));
  const topNeckCenterYPos = Math.sqrt(Math.pow(TOP_LOBE_RADIUS + TOP_NECK_RADIUS, 2) -
      Math.pow(MAX_TOP_NECK_WIDTH - topLobeHorizontal/2, 2));
  
  const leftTopNeckTheta = Math.acos(MAX_TOP_NECK_WIDTH/(TOP_LOBE_RADIUS + TOP_NECK_RADIUS));
  const leftTopNeckCenterYPos = Math.sqrt(Math.pow(TOP_LOBE_RADIUS + TOP_NECK_RADIUS, 2) -
    Math.pow(MAX_TOP_NECK_WIDTH, 2));

  foundation.calcPath_(0);
  assert.equal(foundation.pathTotalHorizontalDistance_, 90);
  assert.equal(foundation.pathLeftTopNeckTheta_, leftTopNeckTheta);
  assert.equal(foundation.pathLeftTopNeckCenterYPos_, leftTopNeckCenterYPos);
  assert.equal(foundation.pathRightTopNeckTheta_, topNeckTheta);
  assert.equal(foundation.pathRightTopNeckCenterYPos_, topNeckCenterYPos);  
});
