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

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTextfieldFoundation from '../../../packages/mdc-textfield/foundation';

const {cssClasses} = MDCTextfieldFoundation;

suite('MDCTextfieldFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCTextfieldFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTextfieldFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextfieldFoundation, [
    'addClass', 'removeClass', 'addClassToLabel', 'removeClassFromLabel', 'eventTargetHasClass',
    'registerTextFieldInteractionHandler', 'deregisterTextFieldInteractionHandler',
    'notifyLeadingIconAction', 'notifyTrailingIconAction',
    'addClassToHelptext', 'removeClassFromHelptext', 'helptextHasClass',
    'registerInputFocusHandler', 'deregisterInputFocusHandler',
    'registerInputBlurHandler', 'deregisterInputBlurHandler',
    'registerInputInputHandler', 'deregisterInputInputHandler',
    'registerInputKeydownHandler', 'deregisterInputKeydownHandler',
    'setHelptextAttr', 'removeHelptextAttr', 'getNativeInput',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextfieldFoundation);

test('#constructor sets disabled to false', () => {
  const {foundation} = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled flips disabled when a native input is given', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeInput = {disabled: false};
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.setDisabled(true);
  assert.isOk(foundation.isDisabled());
});

test('#setDisabled has no effect when no native input is provided', () => {
  const {foundation} = setupTest();
  foundation.setDisabled(true);
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

test('#setDisabled adds mdc-textfield--disabled when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(cssClasses.DISABLED));
});

test('#setDisabled removes mdc-textfield--disabled when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED));
});

test('#init adds mdc-textfield--upgraded class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.addClass(cssClasses.UPGRADED));
});

test('#init adds mdc-textfield__label--float-above class if the input contains a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn({
    value: 'Pre-filled value',
    disabled: false,
    checkValidity: () => true,
  });
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#init does not add mdc-textfield__label--float-above class if the input does not contain a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn({
    value: '',
    disabled: false,
    checkValidity: () => true,
  });
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#init registers input focus handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerInputFocusHandler(td.matchers.isA(Function)));
});

test('#init registers input blur handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerInputBlurHandler(td.matchers.isA(Function)));
});

test('#init registers input input handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerInputInputHandler(td.matchers.isA(Function)));
});

test('#init registers input keydown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerInputKeydownHandler(td.matchers.isA(Function)));
});

test('#init registers text field interaction handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerTextFieldInteractionHandler(td.matchers.isA(Function)));
});

test('on input focuses if input event occurs without any other events', () => {
  const {foundation, mockAdapter} = setupTest();
  let input;

  td.when(mockAdapter.registerInputInputHandler(td.matchers.isA(Function))).thenDo((handler) => {
    input = handler;
  });
  foundation.init();
  input();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('on input does nothing if input event preceded by keydown event', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  let input;
  td.when(mockAdapter.registerInputKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  td.when(mockAdapter.registerInputInputHandler(td.matchers.isA(Function))).thenDo((handler) => {
    input = handler;
  });
  foundation.init();
  keydown();
  input();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#destroy removes mdc-textfield--upgraded class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.removeClass(cssClasses.UPGRADED));
});

test('#destroy deregisters focus handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInputFocusHandler(td.matchers.isA(Function)));
});

test('#destroy deregisters blur handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInputBlurHandler(td.matchers.isA(Function)));
});

test('#destroy deregisters input handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInputInputHandler(td.matchers.isA(Function)));
});

test('#destroy deregisters keydown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInputKeydownHandler(td.matchers.isA(Function)));
});

test('#destroy deregisters text field interaction handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterTextFieldInteractionHandler(td.matchers.isA(Function)));
});

test('on focus adds mdc-textfield--focused class', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputFocusHandler(td.matchers.isA(Function))).thenDo((handler) => {
    focus = handler;
  });
  foundation.init();
  focus();
  td.verify(mockAdapter.addClass(cssClasses.FOCUSED));
});

test('on focus adds mdc-textfield__label--float-above class', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputFocusHandler(td.matchers.isA(Function))).thenDo((handler) => {
    focus = handler;
  });
  foundation.init();
  focus();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('on focus removes aria-hidden from helptext', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputFocusHandler(td.matchers.isA(Function))).thenDo((handler) => {
    focus = handler;
  });
  foundation.init();
  focus();
  td.verify(mockAdapter.removeHelptextAttr('aria-hidden'));
});

const setupBlurTest = () => {
  const {foundation, mockAdapter} = setupTest();
  let blur;
  td.when(mockAdapter.registerInputBlurHandler(td.matchers.isA(Function))).thenDo((handler) => {
    blur = handler;
  });
  const nativeInput = {
    value: '',
    checkValidity: () => true,
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();

  return {foundation, mockAdapter, blur, nativeInput};
};

test('on blur removes mdc-textfield--focused class', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED));
});

test('on blur removes mdc-textfield__label--float-above when no input value present', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('on blur does not remove mdc-textfield__label--float-above if input has a value', () => {
  const {mockAdapter, blur, nativeInput} = setupBlurTest();
  nativeInput.value = 'non-empty value';
  blur();
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('on blur removes mdc-textfield--invalid if input.checkValidity() returns true', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('on blur adds mdc-textfied--invalid if input.checkValidity() returns false', () => {
  const {mockAdapter, blur, nativeInput} = setupBlurTest();
  nativeInput.checkValidity = () => false;
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
});

test('on blur adds role="alert" to helptext if input is invalid and helptext is being used ' +
     'as a validation message', () => {
  const {mockAdapter, blur, nativeInput} = setupBlurTest();
  nativeInput.checkValidity = () => false;
  td.when(mockAdapter.helptextHasClass(cssClasses.HELPTEXT_VALIDATION_MSG)).thenReturn(true);
  blur();
  td.verify(mockAdapter.setHelptextAttr('role', 'alert'));
});

test('on blur remove role="alert" if input is valid', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeHelptextAttr('role'));
});

test('on blur sets aria-hidden="true" on help text by default', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.setHelptextAttr('aria-hidden', 'true'));
});

test('on blur does not set aria-hidden on help text when it is persistent', () => {
  const {mockAdapter, blur} = setupBlurTest();
  td.when(mockAdapter.helptextHasClass(cssClasses.HELPTEXT_PERSISTENT)).thenReturn(true);
  blur();
  td.verify(mockAdapter.setHelptextAttr('aria-hidden', 'true'), {times: 0});
});

test('on blur does not set aria-hidden if input is invalid and help text is validation message', () => {
  const {mockAdapter, blur, nativeInput} = setupBlurTest();
  td.when(mockAdapter.helptextHasClass(cssClasses.HELPTEXT_VALIDATION_MSG)).thenReturn(true);
  nativeInput.checkValidity = () => false;
  blur();
  td.verify(mockAdapter.setHelptextAttr('aria-hidden', 'true'), {times: 0});
});

test('on blur sets aria-hidden=true if input is valid and help text is validation message', () => {
  const {mockAdapter, blur} = setupBlurTest();
  td.when(mockAdapter.helptextHasClass(cssClasses.HELPTEXT_VALIDATION_MSG)).thenReturn(true);
  blur();
  td.verify(mockAdapter.setHelptextAttr('aria-hidden', 'true'));
});

test('on blur handles getNativeInput() not returning anything gracefully', () => {
  const {mockAdapter, blur} = setupBlurTest();
  td.when(mockAdapter.getNativeInput()).thenReturn(null);
  assert.doesNotThrow(blur);
});

test('on text field click notifies leading icon event if event target is the leading icon', () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = {
    target: {},
  };
  let iconEventHandler;

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.LEADING_ICON)).thenReturn(true);
  td.when(mockAdapter.registerTextFieldInteractionHandler(td.matchers.isA(Function)))
    .thenDo((handler) => {
      iconEventHandler = handler;
    });

  foundation.init();
  iconEventHandler(evt);
  td.verify(mockAdapter.notifyLeadingIconAction());
});

test('on text field click notifies trailing icon event if event target is the trailing icon', () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = {
    target: {},
  };
  let iconEventHandler;

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.TRAILING_ICON)).thenReturn(true);
  td.when(mockAdapter.registerTextFieldInteractionHandler(td.matchers.isA(Function)))
    .thenDo((handler) => {
      iconEventHandler = handler;
    });

  foundation.init();
  iconEventHandler(evt);
  td.verify(mockAdapter.notifyTrailingIconAction());
});
