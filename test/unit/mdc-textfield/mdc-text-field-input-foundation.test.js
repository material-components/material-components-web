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
import MDCTextFieldInputFoundation from '../../../packages/mdc-textfield/input/foundation';

suite('MDCTextFieldInputFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCTextFieldInputFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldInputFoundation, [
    'registerEventHandler', 'deregisterEventHandler', 'getNativeInput',
    'notifyFocusAction', 'notifyBlurAction', 'notifyPressedAction',
    'isFocused',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldInputFoundation);

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerEventHandler('focus', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerEventHandler('blur', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerEventHandler('input', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerEventHandler('mousedown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerEventHandler('touchstart', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterEventHandler('focus', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterEventHandler('blur', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterEventHandler('input', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterEventHandler('mousedown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterEventHandler('touchstart', td.matchers.isA(Function)));
});

test('#constructor sets disabled to false', () => {
  const {foundation} = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled set the disabled property on the native input when there is one', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeInput = {disabled: false};
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.setDisabled(true);
  assert.isOk(nativeInput.disabled);
});

test('#setDisabled handles no native input being returned gracefully', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setDisabled(true));
});

test('on input, notifies focus action if this.receivedUserInput_ is false', () => {
  const {foundation, mockAdapter} = setupTest();
  let input;

  td.when(mockAdapter.registerEventHandler('input', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      input = handler;
    });
  foundation.init();
  input();
  td.verify(mockAdapter.notifyFocusAction());
});

test('on input, does nothing if this.receivedUserInput_ is true', () => {
  const {foundation, mockAdapter} = setupTest();
  let input;

  td.when(mockAdapter.registerEventHandler('input', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      input = handler;
    });
  foundation.init();
  foundation.handleTextFieldInteraction();
  input();
  td.verify(mockAdapter.notifyFocusAction(), {times: 0});
});

test('on focus, notifies focus action', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;

  td.when(mockAdapter.registerEventHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(mockAdapter.notifyFocusAction());
});

test('on blur, notifies blur action', () => {
  const {foundation, mockAdapter} = setupTest();
  let blur;

  td.when(mockAdapter.registerEventHandler('blur', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      blur = handler;
    });
  foundation.init();
  blur();
  td.verify(mockAdapter.notifyBlurAction());
});

test('on mousedown, notifies pressed action', () => {
  const {foundation, mockAdapter} = setupTest();
  let pressed;

  td.when(mockAdapter.registerEventHandler('mousedown', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      pressed = handler;
    });
  foundation.init();
  pressed();
  td.verify(mockAdapter.notifyPressedAction());
});

test('on touchstart, notifies pressed action', () => {
  const {foundation, mockAdapter} = setupTest();
  let pressed;

  td.when(mockAdapter.registerEventHandler('touchstart', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      pressed = handler;
    });
  foundation.init();
  pressed();
  td.verify(mockAdapter.notifyPressedAction());
});
