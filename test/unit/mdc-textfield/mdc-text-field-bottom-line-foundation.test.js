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
import MDCTextfieldBottomLineFoundation from '../../../packages/mdc-textfield/bottom-line/foundation';

const {cssClasses} = MDCTextfieldBottomLineFoundation;

suite('MDCTextfieldBottomLineFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTextfieldBottomLineFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextfieldBottomLineFoundation, [
    'addClassToBottomLine', 'removeClassFromBottomLine', 'setBottomLineAttr',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextfieldBottomLineFoundation);

test('activate adds mdc-textfield__bottom-line--active class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.activate();
  td.verify(mockAdapter.addClassToBottomLine(cssClasses.BOTTOM_LINE_ACTIVE));
});

test('deactivate removes mdc-textfield__bottom-line--active class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.deactivate();
  td.verify(mockAdapter.removeClassFromBottomLine(cssClasses.BOTTOM_LINE_ACTIVE));
});

test('setTransformOrigin sets the bottom line origin', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    target: {
      getBoundingClientRect: () => {
        return {};
      },
    },
    clientX: 200,
    clientY: 200,
  };

  foundation.init();
  foundation.setTransformOrigin(mockEvt);

  td.verify(mockAdapter.setBottomLineAttr('style', td.matchers.isA(String)));
});
