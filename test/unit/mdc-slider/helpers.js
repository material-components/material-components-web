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

import {getCorrectPropertyName} from '../../../packages/mdc-animation';
import {captureHandlers} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';

import MDCSliderFoundation from '../../../packages/mdc-slider/foundation';

export const TRANSFORM_PROP = getCorrectPropertyName(window, 'transform');

export function setupEventTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCSliderFoundation);
  const raf = createMockRaf();

  return {
    foundation,
    mockAdapter,
    raf,
    rootHandlers: captureHandlers(mockAdapter, 'registerInteractionHandler'),
    thumbContainerHandlers: captureHandlers(mockAdapter, 'registerThumbContainerInteractionHandler'),
    bodyHandlers: captureHandlers(mockAdapter, 'registerBodyInteractionHandler'),
  };
}
