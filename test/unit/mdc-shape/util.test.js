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
import bel from 'bel';

import {getElevationFromDOM, getBackgroundFromDOM} from '../../../packages/mdc-shape/util';

suite('MDCShape - util');

test('getElevationFromDOM', () => {
  const el = bel`<div class="mdc-shape" style="--mdc-shape-elevation: 4;"></div>`;
  assert.equal(getElevationFromDOM(el), 4);
});

test('getBackgroundFromDOM', () => {
  const el = bel`<div class="mdc-shape" style="--mdc-shape-background: #FF0000;"></div>`;
  assert.equal(getBackgroundFromDOM(el), '#FF0000');
});
