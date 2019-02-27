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

import {getCorrectPropertyName} from '../../../packages/mdc-animation/index.ts';
import {captureHandlers} from '../helpers/foundation';
import {install as installClock} from '../helpers/clock';
import {setupFoundationTest} from '../helpers/setup';

import {MDCSliderFoundation} from '../../../packages/mdc-slider/foundation';

export const TRANSFORM_PROP = getCorrectPropertyName(window, 'transform');

export function setupEventTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCSliderFoundation);
  const clock = installClock();

  return {
    foundation,
    mockAdapter,
    clock,
    rootHandlers: captureHandlers(mockAdapter, 'registerInteractionHandler'),
    thumbContainerHandlers: captureHandlers(mockAdapter, 'registerThumbContainerInteractionHandler'),
    bodyHandlers: captureHandlers(mockAdapter, 'registerBodyInteractionHandler'),
  };
}
