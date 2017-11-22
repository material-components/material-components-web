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
import MDCTextFieldFoundation from '../../../packages/mdc-textfield/foundation';
import MDCTextFieldBottomLineFoundation from '../../../packages/mdc-textfield/bottom-line/foundation';
import MDCTextFieldInputFoundation from '../../../packages/mdc-textfield/input/foundation';

const {cssClasses} = MDCTextFieldFoundation;

suite('MDCTextFieldFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCTextFieldFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTextFieldFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldFoundation, [
    'addClass', 'removeClass', 'addClassToLabel', 'removeClassFromLabel',
    'setIconAttr', 'eventTargetHasClass', 'registerTextFieldInteractionHandler',
    'deregisterTextFieldInteractionHandler', 'notifyIconAction',
    'addClassToHelperText', 'removeClassFromHelperText', 'helperTextHasClass',
    'registerInputEventHandler', 'deregisterInputEventHandler',
    'registerBottomLineEventHandler', 'deregisterBottomLineEventHandler',
    'setHelperTextAttr', 'removeHelperTextAttr', 'setHelperTextContent',
    'getBottomLineFoundation', 'getInputFoundation',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldFoundation);

test('#constructor sets disabled to false', () => {
  const {foundation} = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled sets disabled on the input element', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockInput = td.object({
    setDisabled: () => {},
  });
  td.when(mockAdapter.getInputFoundation()).thenReturn(mockInput);
  foundation.setDisabled(true);
  td.verify(mockInput.setDisabled(true));
});

test('#setDisabled adds mdc-text-field--disabled when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(cssClasses.DISABLED));
});

test('#setDisabled removes mdc-text-field--invalid when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('#setDisabled removes mdc-text-field--disabled when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED));
});

test('#setDisabled sets icon tabindex to -1 when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setIconAttr('tabindex', '-1'));
});

test('#setDisabled sets icon tabindex to 0 when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.setIconAttr('tabindex', '0'));
});

test('#setValid adds mdc-textfied--invalid when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setValid(false);
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
});

test('#setValid removes mdc-textfied--invalid when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setValid(true);
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('#init adds mdc-text-field--upgraded class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.addClass(cssClasses.UPGRADED));
});

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.FOCUS_EVENT, td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.BLUR_EVENT, td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.PRESSED_EVENT, td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTextFieldInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerBottomLineEventHandler(
    MDCTextFieldBottomLineFoundation.strings.ANIMATION_END_EVENT, td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterInputEventHandler(
    MDCTextFieldInputFoundation.strings.FOCUS_EVENT, td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputEventHandler(
    MDCTextFieldInputFoundation.strings.BLUR_EVENT, td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputEventHandler(
    MDCTextFieldInputFoundation.strings.PRESSED_EVENT, td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTextFieldInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTextFieldInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterBottomLineEventHandler(
    MDCTextFieldBottomLineFoundation.strings.ANIMATION_END_EVENT, td.matchers.isA(Function)));
});

test('#init adds mdc-text-field__label--float-above class if the input contains a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getInputFoundation()).thenReturn({
    getValue: () => 'Pre-filled value',
  });
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#init does not add mdc-text-field__label--float-above class if the input does not contain a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getInputFoundation()).thenReturn({
    getValue: () => '',
  });
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#setHelperTextContent sets the content of the helper text element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setHelperTextContent('foo');
  td.verify(mockAdapter.setHelperTextContent('foo'));
});

test('on MDCTextFieldInput:focus event, adds mdc-text-field--focused class', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.FOCUS_EVENT, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(mockAdapter.addClass(cssClasses.FOCUSED));
});

test('on MDCTextFieldInput:focus event, adds mdc-text-field__label--float-above class', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.FOCUS_EVENT, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

const setupBlurTest = () => {
  const {foundation, mockAdapter} = setupTest();
  let blur;
  td.when(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.BLUR_EVENT, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      blur = handler;
    });
  const input = {
    getValue: () => '',
    isBadInput: () => false,
    checkValidity: () => true,
  };
  td.when(mockAdapter.getInputFoundation()).thenReturn(input);
  foundation.init();

  return {foundation, mockAdapter, blur, input};
};

test('on MDCTextFieldInput:blur event, removes mdc-text-field--focused class', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED));
});

test('on MDCTextFieldInput:blur event, removes mdc-text-field__label--float-above when no input value present', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('on MDCTextFieldInput:blur event, does not remove mdc-text-field__label--float-above if input has a value', () => {
  const {mockAdapter, blur, input} = setupBlurTest();
  input.getValue = () => 'non-empty value';
  blur();
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('on MDCTextFieldInput:blur event, removes mdc-text-field--invalid if custom validity is false and' +
     'input.checkValidity() returns true', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('on MDCTextFieldInput:blur event, adds mdc-textfied--invalid if custom validity is false and' +
     'input.checkValidity() returns false', () => {
  const {mockAdapter, blur, input} = setupBlurTest();
  input.checkValidity = () => false;
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
});

test('on MDCTextFieldInput:blur event, does not remove mdc-text-field--invalid if custom validity is true and' +
     'input.checkValidity() returns true', () => {
  const {foundation, mockAdapter, blur} = setupBlurTest();
  foundation.setValid(false);
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID), {times: 0});
});

test('on MDCTextFieldInput:blur event, does not add mdc-textfied--invalid if custom validity is true and' +
     'input.checkValidity() returns false', () => {
  const {foundation, mockAdapter, blur, input} = setupBlurTest();
  input.checkValidity = () => false;
  foundation.setValid(true);
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID), {times: 0});
});

// test('on focus removes aria-hidden from helperText', () => {
//   const {foundation, mockAdapter} = setupTest();
//   let focus;
//   td.when(mockAdapter.registerInputEventHandler('focus', td.matchers.isA(Function)))
//     .thenDo((evtType, handler) => {
//       focus = handler;
//     });
//   foundation.init();
//   focus();
//   td.verify(mockAdapter.removeHelperTextAttr('aria-hidden'));
// });

// test('on blur adds role="alert" to helper text if input is invalid and helper text is being used ' +
//      'as a validation message', () => {
//   const {mockAdapter, blur, nativeInput} = setupBlurTest();
//   nativeInput.checkValidity = () => false;
//   td.when(mockAdapter.helperTextHasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG)).thenReturn(true);
//   blur();
//   td.verify(mockAdapter.setHelperTextAttr('role', 'alert'));
// });

// test('on blur remove role="alert" if input is valid', () => {
//   const {mockAdapter, blur} = setupBlurTest();
//   blur();
//   td.verify(mockAdapter.removeHelperTextAttr('role'));
// });

// test('on blur sets aria-hidden="true" on helper text by default', () => {
//   const {mockAdapter, blur} = setupBlurTest();
//   blur();
//   td.verify(mockAdapter.setHelperTextAttr('aria-hidden', 'true'));
// });

// test('on blur does not set aria-hidden on helper text when it is persistent', () => {
//   const {mockAdapter, blur} = setupBlurTest();
//   td.when(mockAdapter.helperTextHasClass(cssClasses.HELPER_TEXT_PERSISTENT)).thenReturn(true);
//   blur();
//   td.verify(mockAdapter.setHelperTextAttr('aria-hidden', 'true'), {times: 0});
// });

// test('on blur does not set aria-hidden if input is invalid and helper text is validation message', () => {
//   const {mockAdapter, blur, nativeInput} = setupBlurTest();
//   td.when(mockAdapter.helperTextHasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG)).thenReturn(true);
//   nativeInput.checkValidity = () => false;
//   blur();
//   td.verify(mockAdapter.setHelperTextAttr('aria-hidden', 'true'), {times: 0});
// });

// test('on blur sets aria-hidden=true if input is valid and helper text is validation message', () => {
//   const {mockAdapter, blur} = setupBlurTest();
//   td.when(mockAdapter.helperTextHasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG)).thenReturn(true);
//   blur();
//   td.verify(mockAdapter.setHelperTextAttr('aria-hidden', 'true'));
// });

test('on text field click notifies icon event if event target is an icon', () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = {
    target: {},
    type: 'click',
  };
  const mockInput = {
    setReceivedUserInput: () => {},
    getValue: () => '',
    isDisabled: () => false,
  };
  let iconEventHandler;

  td.when(mockAdapter.getInputFoundation()).thenReturn(mockInput);
  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.TEXT_FIELD_ICON)).thenReturn(true);
  td.when(mockAdapter.registerTextFieldInteractionHandler('click', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      iconEventHandler = handler;
    });

  foundation.init();
  iconEventHandler(evt);
  td.verify(mockAdapter.notifyIconAction());
});

test('on MDCTextFieldBottomLine:animation-end event, deactivates the bottom line ' +
     'if this.isFocused_ is false', () => {
  const {foundation, mockAdapter} = setupTest();
  const bottomLine = td.object({
    deactivate: () => {},
  });
  td.when(mockAdapter.getBottomLineFoundation()).thenReturn(bottomLine);
  const mockEvt = {
    propertyName: 'opacity',
  };
  let transitionEnd;
  td.when(mockAdapter.registerBottomLineEventHandler(
    MDCTextFieldBottomLineFoundation.strings.ANIMATION_END_EVENT, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      transitionEnd = handler;
    });
  foundation.init();
  transitionEnd(mockEvt);
  td.verify(bottomLine.deactivate());
});

test('on custom MDCTextFieldInput:pressed event, sets the bottom line origin', () => {
  const {foundation, mockAdapter} = setupTest();
  const bottomLine = td.object({
    setTransformOrigin: () => {},
  });
  td.when(mockAdapter.getBottomLineFoundation()).thenReturn(bottomLine);
  const mockEvt = {
    target: {
      getBoundingClientRect: () => {
        return {};
      },
    },
    clientX: 200,
    clientY: 200,
  };
  let pressed;

  td.when(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.PRESSED_EVENT, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      pressed = handler;
    });

  foundation.init();
  pressed(mockEvt);

  td.verify(bottomLine.setTransformOrigin(mockEvt));
});

test('interacting with text field does not emit custom events if it is disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    target: {},
    key: 'Enter',
  };
  const mockInput = {
    isDisabled: () => true,
    getValue: () => '',
  };
  let textFieldInteraction;

  td.when(mockAdapter.getInputFoundation()).thenReturn(mockInput);
  td.when(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)))
    .thenDo((evt, handler) => {
      textFieldInteraction = handler;
    });

  foundation.init();
  textFieldInteraction(mockEvt);

  td.verify(mockAdapter.notifyIconAction(), {times: 0});
});
