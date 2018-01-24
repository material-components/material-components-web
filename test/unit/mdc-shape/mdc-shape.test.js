/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import bel from 'bel';
import td from 'testdouble';

import {MDCShape, MDCShapeFoundation} from '../../../packages/mdc-shape';

function getFixture() {
  return bel`
    <div class="mdc-shape">
      <canvas class="mdc-shape__canvas"></canvas>
      <div style="clip-path: url(#shape-path);"></div>
      <svg>
        <clipPath id="shape-path">
          <path class="mdc-shape__path"/>
        </clipPath>
      </svg>
    </div>
  `;
}

suite('MDCShape');

test('#set background proxies to foundation.setBackground()', () => {
  const MockShapeFoundation = td.constructor(MDCShapeFoundation);
  const foundation = new MockShapeFoundation();
  const component = new MDCShape(getFixture(), foundation);
  component.background = '#FF0000';
  td.verify(foundation.setBackground('#FF0000'));
});

test('#set elevation proxies to foundation.setElevation()', () => {
  const MockShapeFoundation = td.constructor(MDCShapeFoundation);
  const foundation = new MockShapeFoundation();
  const component = new MDCShape(getFixture(), foundation);
  component.elevation = 8;
  td.verify(foundation.setElevation(8, true));
});

test('#redraw proxies to foundation.redraw()', () => {
  const MockShapeFoundation = td.constructor(MDCShapeFoundation);
  const foundation = new MockShapeFoundation();
  const component = new MDCShape(getFixture(), foundation);
  component.redraw();
  td.verify(foundation.redraw());
});
