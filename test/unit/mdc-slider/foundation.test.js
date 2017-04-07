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

/* eslint object-curly-spacing: [error, always, { "objectsInObjects": false }], arrow-parens: [error, as-needed] */

import { assert } from 'chai';
import td from 'testdouble';

import { verifyDefaultAdapter } from '../helpers/foundation';
import { setupFoundationTest } from '../helpers/setup';
import MDCSliderFoundation from '../../../packages/mdc-slider/continuous/foundation';

const { cssClasses } = MDCSliderFoundation;

suite('MDCSliderFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCSliderFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCSliderFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSliderFoundation, [
    'addClass',
    'removeClass',
    'hasClass',
    'addInputClass',
    'removeInputClass',
    'getNativeInput',
    'registerHandler',
    'deregisterHandler',
    'registerRootHandler',
    'deregisterRootHandler',
    'setAttr',
    'setLowerStyle',
    'setUpperStyle',
    'hasNecessaryDom',
    'notifyChange',
    'detectIsIE',
  ]);
});

const setupTest = () => setupFoundationTest(MDCSliderFoundation);

test('#constructor sets disabled to false', () => {
  const { foundation } = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled flips disabled when a native input is given', () => {
  const { foundation, mockAdapter } = setupTest();
  const nativeInput = { disabled: false };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.setDisabled(true);
  assert.isOk(foundation.isDisabled());
});

test('#setDisabled has no effect when no native input is provided', () => {
  const { foundation } = setupTest();
  foundation.setDisabled(true);
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled set the disabled property on the native input when there is one', () => {
  const { foundation, mockAdapter } = setupTest();
  const nativeInput = { disabled: false };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.setDisabled(true);
  assert.isOk(nativeInput.disabled);
});

test('#setDisabled handles no native input being returned gracefully', () => {
  const { foundation, mockAdapter } = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setDisabled(true));
});

test('#init detects browser', () => {
  const { foundation, mockAdapter } = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  td.when(mockAdapter.detectIsIE()).thenReturn(456);
  foundation.init();
  assert.strictEqual(foundation.isIE_, 456);
});

test('#init adds mdc-slider--upgraded class', () => {
  const { foundation, mockAdapter } = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  foundation.init();
  td.verify(mockAdapter.addClass(cssClasses.UPGRADED));
});

test('#destroy removes mdc-slider--upgraded class', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.removeClass(cssClasses.UPGRADED));
});

// this.adapter_.deregisterHandler('input', this.inputHandler);
// this.adapter_.deregisterHandler('change', this.changeHandler);
// this.adapter_.deregisterHandler('mouseup', this.mouseUpHandler);
// this.adapter_.deregisterHandler('touchmove', this.touchMoveHandler_);
// this.adapter_.deregisterHandler('touchstart', this.touchMoveHandler_);
// this.adapter_.deregisterRootHandler('mousedown', this.containerMouseDownHandler);

test('#destroy deregisters input handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('input', td.matchers.isA(Function)));
});

test('#destroy deregisters change handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('change', td.matchers.isA(Function)));
});

test('#destroy deregisters mouseup handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('mouseup', td.matchers.isA(Function)));
});

test('#destroy deregisters touchmove handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('touchmove', td.matchers.isA(Function)));
});

test('#destroy deregisters touchstart handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('touchstart', td.matchers.isA(Function)));
});

test('#destroy deregisters mousedown handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterRootHandler('mousedown', td.matchers.isA(Function)));
});
