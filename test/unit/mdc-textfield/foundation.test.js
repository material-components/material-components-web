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
import MDCTextFieldFoundation from '../../../packages/mdc-textfield/foundation';
import MDCTextFieldBottomLineFoundation from '../../../packages/mdc-textfield/bottom-line/foundation';
import MDCTextFieldInputFoundation from '../../../packages/mdc-textfield/input/foundation';
import MockTextFieldInputFoundation from './mock-text-field-input-foundation';

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
    'addClass', 'removeClass', 'addClassToLabel', 'removeClassFromLabel', 'labelHasClass',
    'setIconAttr', 'eventTargetHasClass', 'registerTextFieldInteractionHandler',
    'deregisterTextFieldInteractionHandler', 'notifyIconAction',
    'registerInputEventHandler', 'deregisterInputEventHandler',
    'registerBottomLineEventHandler', 'deregisterBottomLineEventHandler',
    'getBottomLineFoundation', 'getHelperTextFoundation', 'getInputFoundation',
  ]);
});

const setupTest = (isValid = false) => {
  const mockAdapter = td.object(MDCTextFieldFoundation.defaultAdapter);
  const input = new MockTextFieldInputFoundation(false, isValid);
  td.when(mockAdapter.getInputFoundation()).thenReturn(input);
  const foundation = new MDCTextFieldFoundation(mockAdapter);
  return {mockAdapter, foundation, input};
};

test('#constructor sets disabled to false', () => {
  const {foundation} = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled sets disabled on the input element', () => {
  const {foundation, input} = setupTest();
  foundation.setDisabled(true);
  assert.isOk(input.isDisabled());
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

test('#setValue calls setValue on the input foundation', () => {
  const {foundation, input} = setupTest();
  foundation.setValue('new value');
  assert.equal('new value', input.getValue());
});

test('#setValue changes mdc-text-field__label--float-above when changing value ' +
     'from empty to non-empty', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
  foundation.setValue('new value');
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 1});
});

test('#setValue removes mdc-text-field__label--float-above when changing value ' +
     'from non-empty to empty', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.when(mockAdapter.labelHasClass(cssClasses.LABEL_FLOAT_ABOVE)).thenReturn(true);
  foundation.setValue('');
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 1});
});

test('#setValue does not remove mdc-text-field__label--float-above when changing value ' +
     'from empty to empty', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.setValue('');
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#setValue adds mdc-text-field--invalid if custom validity is false and ' +
     'input.checkValidity() returns false', () => {
  const {foundation, mockAdapter} = setupTest(false);
  foundation.setValue('value');
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
});

test('#setValue removes mdc-text-field--invalid if custom validity is false and ' +
     'input.checkValidity() returns true', () => {
  const {foundation, mockAdapter} = setupTest(true);
  foundation.setValue('value');
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('#setValue adds mdc-text-field__label--shake if input is focused and ' +
     'input.checkValidity() returns false', () => {
  const {foundation, mockAdapter} = setupTest(false);
  foundation.activateFocus();
  foundation.setValue('value');
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_SHAKE));
});

test('#setValue does not add mdc-text-field__label--shake if input is not focused and ' +
     'input.checkValidity() returns false', () => {
  const {foundation, mockAdapter} = setupTest(false);
  foundation.setValue('value');
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_SHAKE), {times: 0});
});

test('#setValue does not add mdc-text-field__label--shake when input.checkValidity() returns true', () => {
  const {foundation, mockAdapter} = setupTest(true);
  foundation.setValue('value');
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_SHAKE), {times: 0});
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

test('#destroy removes mdc-textfield--upgraded class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.removeClass(cssClasses.UPGRADED));
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
  const {foundation, mockAdapter, input} = setupTest();
  input.setValue('Pre-filled value');
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#init does not add mdc-text-field__label--float-above class if the input does not contain a value', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#init does not add mdc-text-field__label--float-above class if it already exists', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.labelHasClass(cssClasses.LABEL_FLOAT_ABOVE)).thenReturn(true);
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#setHelperTextContent sets the content of the helper text element', () => {
  const {foundation, mockAdapter} = setupTest();
  const helperText = td.object({
    setContent: () => {},
  });
  td.when(mockAdapter.getHelperTextFoundation()).thenReturn(helperText);
  foundation.setHelperTextContent('foo');
  td.verify(mockAdapter.getHelperTextFoundation().setContent('foo'));
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

test('on MDCTextFieldInput:focus event, makes helper text visible to the screen reader', () => {
  const {foundation, mockAdapter} = setupTest();
  const helperText = td.object({
    showToScreenReader: () => {},
  });
  td.when(mockAdapter.getHelperTextFoundation()).thenReturn(helperText);
  let focus;
  td.when(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.FOCUS_EVENT, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(helperText.showToScreenReader());
});

const setupBlurTest = (isValid) => {
  const {foundation, mockAdapter, input} = setupTest(isValid);
  let blur;
  td.when(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.BLUR_EVENT, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      blur = handler;
    });
  let focus;
  td.when(mockAdapter.registerInputEventHandler(
    MDCTextFieldInputFoundation.strings.FOCUS_EVENT, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();

  return {foundation, mockAdapter, focus, blur, input};
};

test('on MDCTextFieldInput:blur event, removes mdc-text-field--focused class', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED));
});

test('on MDCTextFieldInput:blur event, removes mdc-text-field__label--float-above when no input value present', () => {
  const {mockAdapter, blur} = setupBlurTest();
  td.when(mockAdapter.labelHasClass(cssClasses.LABEL_FLOAT_ABOVE)).thenReturn(true);
  blur();
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('on MDCTextFieldInput:blur event, does not remove mdc-text-field__label--float-above if input has a value', () => {
  const {mockAdapter, blur, input} = setupBlurTest();
  input.setValue('non-empty value');
  blur();
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('on MDCTextFieldInput:blur event, removes mdc-text-field--invalid if custom validity is false and' +
     'input.checkValidity() returns true', () => {
  const {mockAdapter, blur} = setupBlurTest(true);
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('on MDCTextFieldInput:blur event, adds mdc-textfied--invalid if custom validity is false and' +
     'input.checkValidity() returns false', () => {
  const {mockAdapter, focus, blur} = setupBlurTest(false);
  focus();
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
});

test('on MDCTextFieldInput:blur event, does not remove mdc-text-field--invalid if custom validity is true and' +
     'input.checkValidity() returns true', () => {
  const {foundation, mockAdapter, blur} = setupBlurTest(true);
  foundation.setValid(false);
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID), {times: 0});
});

test('on MDCTextFieldInput:blur event, does not add mdc-textfied--invalid if custom validity is true and' +
     'input.checkValidity() returns false', () => {
  const {foundation, mockAdapter, blur} = setupBlurTest(false);
  foundation.setValid(true);
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID), {times: 0});
});

test('on MDCTextFieldInput:blur event, set validity of helper text', () => {
  const {mockAdapter, blur, input} = setupBlurTest();
  const helperText = td.object({
    setValidity: () => {},
    hasClass: () => {},
  });
  td.when(mockAdapter.getHelperTextFoundation()).thenReturn(helperText);
  input.checkValidity = () => false;
  td.when(helperText.hasClass('mdc-text-field-helper-text--validation-msg')).thenReturn(true);
  blur();
  td.verify(helperText.setValidity(false));
});

test('on text field click notifies icon event if event target is an icon', () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = {
    target: {},
    type: 'click',
  };
  let iconEventHandler;

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
  const {foundation, mockAdapter, input} = setupTest();
  const mockEvt = {
    target: {},
    key: 'Enter',
  };
  let textFieldInteraction;

  td.when(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)))
    .thenDo((evt, handler) => {
      textFieldInteraction = handler;
    });
  input.isDisabled = () => true;

  foundation.init();
  textFieldInteraction(mockEvt);

  td.verify(mockAdapter.notifyIconAction(), {times: 0});
});
