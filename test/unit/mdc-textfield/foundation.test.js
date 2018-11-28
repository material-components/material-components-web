/**
 * @license
 * Copyright 2016 Google Inc.
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

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCTextFieldFoundation from '../../../packages/mdc-textfield/foundation';

const {cssClasses, numbers} = MDCTextFieldFoundation;

suite('MDCTextFieldFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCTextFieldFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTextFieldFoundation);
});

test('exports numbers', () => {
  assert.isOk('numbers' in MDCTextFieldFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldFoundation, [
    'addClass', 'removeClass', 'hasClass',
    'registerTextFieldInteractionHandler', 'deregisterTextFieldInteractionHandler',
    'registerInputInteractionHandler', 'deregisterInputInteractionHandler',
    'getNativeInput', 'isFocused', 'isRtl', 'activateLineRipple', 'deactivateLineRipple',
    'setLineRippleTransformOrigin', 'shakeLabel', 'floatLabel', 'hasLabel', 'getLabelWidth',
    'registerValidationAttributeChangeHandler', 'deregisterValidationAttributeChangeHandler',
    'hasOutline', 'notchOutline', 'closeOutline',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCTextFieldFoundation.defaultAdapter);
  const helperText = td.object({
    setContent: () => {},
    showToScreenReader: () => {},
    setValidity: () => {},
  });
  const leadingIcon = td.object({
    setDisabled: () => {},
    setAriaLabel: () => {},
    setContent: () => {},
    registerInteractionHandler: () => {},
    deregisterInteractionHandler: () => {},
    handleInteraction: () => {},
  });
  const trailingIcon = td.object({
    setDisabled: () => {},
    setAriaLabel: () => {},
    setContent: () => {},
    registerInteractionHandler: () => {},
    deregisterInteractionHandler: () => {},
    handleInteraction: () => {},
  });
  const foundationMap = {
    helperText,
    leadingIcon,
    trailingIcon,
  };
  const foundation = new MDCTextFieldFoundation(mockAdapter, foundationMap);
  return {foundation, mockAdapter, helperText, leadingIcon, trailingIcon};
};

test('#constructor sets disabled to false', () => {
  const {foundation} = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

const setupValueTest = (value, optIsValid, optIsBadInput, hasLabel) => {
  const {foundation, mockAdapter, helperText} = setupTest();
  const nativeInput = {
    value: value,
    validity: {
      valid: optIsValid === undefined ? true : !!optIsValid,
      badInput: optIsBadInput === undefined ? false : !!optIsBadInput,
    },
  };
  if (hasLabel) {
    td.when(mockAdapter.hasLabel()).thenReturn(true);
  }
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();

  return {foundation, mockAdapter, helperText, nativeInput};
};

test('#getValue returns the field\'s value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn({
    value: 'initValue',
  });
  assert.equal('initValue', foundation.getValue(),
    'getValue does not match input value.');
});

test('#setValue with non-empty value styles the label', () => {
  const value = 'new value';
  const {foundation, nativeInput, mockAdapter} = setupValueTest('', undefined, undefined, true);
  // Initial empty value should not float label.
  td.verify(mockAdapter.floatLabel(false), {times: 0});
  nativeInput.value = value;
  foundation.setValue(value);
  td.verify(mockAdapter.shakeLabel(false));
  td.verify(mockAdapter.floatLabel(true));
});

test('#setValue with empty value styles the label', () => {
  const {foundation, nativeInput, mockAdapter} = setupValueTest('old value', undefined, undefined, true);
  // Initial value should float the label.
  td.verify(mockAdapter.floatLabel(true));
  nativeInput.value = '';
  foundation.setValue('');
  td.verify(mockAdapter.shakeLabel(false));
  td.verify(mockAdapter.floatLabel(false));
});

test('#setValue valid and invalid input', () => {
  const {foundation, mockAdapter, nativeInput, helperText} =
    setupValueTest('', /* isValid */ false, undefined, true);

  foundation.setValue('invalid');
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
  td.verify(helperText.setValidity(false));
  td.verify(mockAdapter.shakeLabel(true));
  td.verify(mockAdapter.floatLabel(true));

  nativeInput.validity.valid = true;
  foundation.setValue('valid');
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
  td.verify(helperText.setValidity(true));
  td.verify(mockAdapter.shakeLabel(false));
  td.verify(mockAdapter.floatLabel(true));
});

test('#setValue with invalid status and empty value does not shake the label', () => {
  const {foundation, mockAdapter, helperText} =
    setupValueTest('', /* isValid */ false, undefined, true);

  foundation.setValue('');
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
  td.verify(helperText.setValidity(false));
  td.verify(mockAdapter.shakeLabel(false));
  td.verify(mockAdapter.floatLabel(false));
});

test('#setValue does not affect focused state', () => {
  const {foundation, mockAdapter} = setupValueTest('');
  foundation.setValue('');
  td.verify(mockAdapter.addClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED), {times: 0});
});

test('#setValue does not affect disabled state', () => {
  const {foundation, mockAdapter} = setupValueTest('');
  foundation.setValue('');
  td.verify(mockAdapter.addClass(cssClasses.DISABLED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED), {times: 0});
  // Called once initially because the field is valid, should not be called twice.
  td.verify(mockAdapter.removeClass(cssClasses.INVALID), {times: 1});
});

test('#isValid for native validation', () => {
  const {foundation, nativeInput} = setupValueTest('', /* isValid */ true);
  assert.isOk(foundation.isValid());

  nativeInput.validity.valid = false;
  assert.isNotOk(foundation.isValid());
});

test('#setValid overrides native validation when useNativeValidation set to false', () => {
  const {foundation, nativeInput} = setupValueTest('', /* isValid */ false);
  foundation.setUseNativeValidation(false);
  foundation.setValid(true);
  assert.isOk(foundation.isValid());

  nativeInput.validity.valid = true;
  foundation.setValid(false);
  assert.isNotOk(foundation.isValid());
});

test('#setValid updates classes', () => {
  const {foundation, mockAdapter, helperText} = setupTest();
  td.when(mockAdapter.hasLabel()).thenReturn(true);

  foundation.setValid(false);
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
  td.verify(helperText.setValidity(false));
  td.verify(mockAdapter.shakeLabel(true));

  foundation.setValid(true);
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
  td.verify(helperText.setValidity(true));
  td.verify(mockAdapter.shakeLabel(false));

  // None of these is affected by setValid.
  td.verify(mockAdapter.addClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.addClass(cssClasses.DISABLED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED), {times: 0});
});

test('#setValid updates classes, but not label methods when hasLabel is false', () => {
  const {foundation, mockAdapter, helperText} = setupTest();

  foundation.setValid(false);
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
  td.verify(helperText.setValidity(false));
  td.verify(mockAdapter.shakeLabel(td.matchers.anything()), {times: 0});

  foundation.setValid(true);
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
  td.verify(helperText.setValidity(true));
  td.verify(mockAdapter.shakeLabel(td.matchers.anything()), {times: 0});

  td.verify(mockAdapter.addClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.addClass(cssClasses.DISABLED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED), {times: 0});
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

test('#setDisabled sets disabled on leading icon', () => {
  const {foundation, leadingIcon} = setupTest();
  foundation.setDisabled(true);
  td.verify(leadingIcon.setDisabled(true));
});

test('#setDisabled sets disabled on trailing icon', () => {
  const {foundation, trailingIcon} = setupTest();
  foundation.setDisabled(true);
  td.verify(trailingIcon.setDisabled(true));
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

test('#init focuses on input if adapter.isFocused is true', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isFocused()).thenReturn(true);
  foundation.init();
  td.verify(foundation.inputFocusHandler_());
});

test('#init does not focus if adapter.isFocused is false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isFocused()).thenReturn(false);
  foundation.init();
  td.verify(foundation.inputFocusHandler_(), {times: 0});
});

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputInteractionHandler('blur', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputInteractionHandler('input', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputInteractionHandler('mousedown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputInteractionHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTextFieldInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerValidationAttributeChangeHandler(td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.validationObserver_ = {};
  foundation.destroy();

  td.verify(mockAdapter.deregisterInputInteractionHandler('focus', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputInteractionHandler('blur', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputInteractionHandler('input', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputInteractionHandler('mousedown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputInteractionHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTextFieldInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTextFieldInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterValidationAttributeChangeHandler(foundation.validationObserver_));
});

test('#init floats label if the input contains a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.getNativeInput()).thenReturn({
    value: 'Pre-filled value',
    disabled: false,
    validity: {
      badInput: false,
    },
  });
  foundation.init();
  td.verify(mockAdapter.floatLabel(true));
});

test('#init doesnot call floatLabel if there is no label and the input contains a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn({
    value: 'Pre-filled value',
    disabled: false,
    validity: {
      badInput: false,
    },
  });
  foundation.init();
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
});

test('#init does not float label if the input does not contain a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn({
    value: '',
    disabled: false,
    validity: {
      badInput: false,
    },
  });
  foundation.init();
  td.verify(mockAdapter.floatLabel(/* value */ '', /* isFocused */ false, /* isBadInput */ false), {times: 0});
});

test('#setHelperTextContent sets the content of the helper text element', () => {
  const {foundation, helperText} = setupTest();
  foundation.setHelperTextContent('foo');
  td.verify(helperText.setContent('foo'));
});

test('#setLeadingIconAriaLabel sets the aria-label of the leading icon element', () => {
  const {foundation, leadingIcon} = setupTest();
  foundation.setLeadingIconAriaLabel('foo');
  td.verify(leadingIcon.setAriaLabel('foo'));
});

test('#setLeadingIconContent sets the content of the leading icon element', () => {
  const {foundation, leadingIcon} = setupTest();
  foundation.setLeadingIconContent('foo');
  td.verify(leadingIcon.setContent('foo'));
});

test('#setTrailingIconAriaLabel sets the aria-label of the trailing icon element', () => {
  const {foundation, trailingIcon} = setupTest();
  foundation.setTrailingIconAriaLabel('foo');
  td.verify(trailingIcon.setAriaLabel('foo'));
});

test('#setTrailingIconContent sets the content of the trailing icon element', () => {
  const {foundation, trailingIcon} = setupTest();
  foundation.setTrailingIconContent('foo');
  td.verify(trailingIcon.setContent('foo'));
});

test('#notchOutline updates the SVG path of the outline element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getLabelWidth()).thenReturn(30);
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.DENSE)).thenReturn(false);
  td.when(mockAdapter.isRtl()).thenReturn(false);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(30 * numbers.LABEL_SCALE, false));
});

test('#notchOutline updates the SVG path of the outline element when dense', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getLabelWidth()).thenReturn(30);
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.DENSE)).thenReturn(true);
  td.when(mockAdapter.isRtl()).thenReturn(false);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(30 * numbers.DENSE_LABEL_SCALE, false));
});

const setupBareBonesTest = () => {
  const mockAdapter = td.object(MDCTextFieldFoundation.defaultAdapter);
  const foundationMap = {};
  const foundation = new MDCTextFieldFoundation(mockAdapter, foundationMap);
  return {foundation, mockAdapter};
};

test('#notchOutline does nothing if no outline is present', () => {
  const {foundation, mockAdapter} = setupBareBonesTest();
  td.when(mockAdapter.hasOutline()).thenReturn(false);
  td.when(mockAdapter.hasLabel()).thenReturn(true);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(td.matchers.anything()), {times: 0});
});

test('#notchOutline does nothing if no label is present', () => {
  const {foundation, mockAdapter} = setupBareBonesTest();
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.hasLabel()).thenReturn(false);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(td.matchers.anything()), {times: 0});
});

test('#notchOutline calls updates notched outline to return to idle state when ' +
  'openNotch is false', () => {
  const {foundation, mockAdapter} = setupBareBonesTest();
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.hasOutline()).thenReturn(true);

  foundation.notchOutline(false);
  td.verify(mockAdapter.closeOutline());
});

test('on input styles label if input event occurs without any other events', () => {
  const {foundation, mockAdapter} = setupTest();
  let input;
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.registerInputInteractionHandler('input', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => input = handler);
  foundation.init();
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
  input();
  td.verify(mockAdapter.shakeLabel(false));
  td.verify(mockAdapter.floatLabel(true));
});

test('on input doesnot styles label if input event occurs without any other events but hasLabel is false', () => {
  const {foundation, mockAdapter} = setupTest();
  let input;
  td.when(mockAdapter.registerInputInteractionHandler('input', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => input = handler);
  foundation.init();
  input();
  td.verify(mockAdapter.shakeLabel(td.matchers.anything()), {times: 0});
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
});

test('on input does nothing if input event preceded by keydown event', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'keydown',
    key: 'Enter',
  };
  const mockInput = {
    disabled: false,
  };
  let keydown;
  let input;

  td.when(mockAdapter.getNativeInput()).thenReturn(mockInput);
  td.when(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      keydown = handler;
    });
  td.when(mockAdapter.registerInputInteractionHandler('input', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      input = handler;
    });
  foundation.init();
  keydown(mockEvt);
  input();
  td.verify(mockAdapter.shakeLabel(), {times: 0});
  td.verify(mockAdapter.floatLabel(), {times: 0});
});

test('on focus adds mdc-text-field--focused class', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(mockAdapter.addClass(cssClasses.FOCUSED));
});

test('on focus activates line ripple', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(mockAdapter.activateLineRipple());
});

test('on focus styles label', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
  focus();
  td.verify(mockAdapter.shakeLabel(false));
});

test('on focus do not styles label if hasLabel is false', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
  td.verify(mockAdapter.shakeLabel(td.matchers.anything()), {times: 0});
});

test('on focus makes helper text visible to the screen reader', () => {
  const {foundation, mockAdapter, helperText} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(helperText.showToScreenReader());
});

const setupBlurTest = () => {
  const {foundation, mockAdapter, helperText} = setupTest();
  let blur;
  td.when(mockAdapter.registerInputInteractionHandler('blur', td.matchers.isA(Function))).thenDo((evtType, handler) => {
    blur = handler;
  });
  const nativeInput = {
    value: '',
    validity: {
      valid: true,
      badInput: false,
    },
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();

  return {foundation, mockAdapter, blur, nativeInput, helperText};
};

test('on blur removes mdc-text-field--focused class', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED));
});

test('on blur styles label when no input value present and validity checks pass', () => {
  const {blur, mockAdapter} = setupBlurTest();
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
  blur();
  td.verify(mockAdapter.shakeLabel(false));
  td.verify(mockAdapter.floatLabel(false));
});

test('does not style label on blur when no input value present and validity checks pass and hasLabel is false', () => {
  const {blur, mockAdapter} = setupBlurTest();
  td.verify(mockAdapter.floatLabel(/* value */ '', /* isFocused */ false), {times: 0});
  blur();
  td.verify(mockAdapter.shakeLabel(td.matchers.anything()), {times: 0});
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
});

test('on blur styles label if input has a value', () => {
  const {blur, nativeInput, mockAdapter} = setupBlurTest();
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
  nativeInput.value = 'non-empty value';
  blur();
  td.verify(mockAdapter.shakeLabel(false));
  td.verify(mockAdapter.floatLabel(true));
});

test('does not style label on blur if input has a value and hasLabel is false', () => {
  const {blur, nativeInput, mockAdapter} = setupBlurTest();
  td.verify(mockAdapter.floatLabel(/* value */ '', /* isFocused */ false), {times: 0});
  nativeInput.value = 'non-empty value';
  blur();
  td.verify(mockAdapter.shakeLabel(td.matchers.anything()), {times: 0});
  td.verify(mockAdapter.floatLabel(td.matchers.anything()), {times: 0});
});

test('on blur removes mdc-text-field--invalid if useNativeValidation is true and' +
     'input.checkValidity() returns true', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('on blur adds mdc-textfied--invalid if useNativeValidation is true and' +
     'input.checkValidity() returns false', () => {
  const {mockAdapter, blur, nativeInput} = setupBlurTest();
  nativeInput.validity.valid = false;
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
});

test('on blur does not remove mdc-text-field--invalid if useNativeValidation is false and' +
     'input.checkValidity() returns true', () => {
  const {foundation, mockAdapter, blur} = setupBlurTest();
  foundation.setUseNativeValidation(false);
  foundation.setValid(false);
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID), {times: 0});
});

test('on blur does not add mdc-textfied--invalid if custom validity is true and' +
     'input.checkValidity() returns false', () => {
  const {foundation, mockAdapter, blur, nativeInput} = setupBlurTest();
  nativeInput.checkValidity = () => false;
  foundation.setValid(true);
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID), {times: 0});
});

test('on blur set validity of helper text', () => {
  const {blur, nativeInput, helperText} = setupBlurTest();
  nativeInput.validity.valid = false;
  blur();
  td.verify(helperText.setValidity(false));
});

test('on blur handles getNativeInput() not returning anything gracefully', () => {
  const {mockAdapter, blur} = setupBlurTest();
  td.when(mockAdapter.getNativeInput()).thenReturn(null);
  assert.doesNotThrow(blur);
});

test('on keydown sets receivedUserInput to true when input is enabled', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      keydown = handler;
    });
  td.when(mockAdapter.getNativeInput()).thenReturn({
    disabled: false,
  });
  foundation.init();
  assert.equal(foundation.receivedUserInput_, false);
  keydown();
  assert.equal(foundation.receivedUserInput_, true);
});

test('on click does not set receivedUserInput if input is disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'click',
  };
  const mockInput = {
    disabled: true,
  };
  let click;

  td.when(mockAdapter.getNativeInput()).thenReturn(mockInput);
  td.when(mockAdapter.registerTextFieldInteractionHandler('click', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      click = handler;
    });
  foundation.init();
  assert.equal(foundation.receivedUserInput_, false);
  click(mockEvt);
  assert.equal(foundation.receivedUserInput_, false);
});

test('mousedown on the input sets the line ripple origin', () => {
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

  let clickHandler;

  td.when(mockAdapter.registerInputInteractionHandler('mousedown', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      clickHandler = handler;
    });

  foundation.init();
  clickHandler(mockEvt);

  td.verify(mockAdapter.setLineRippleTransformOrigin(td.matchers.anything()));
});

test('touchstart on the input sets the line ripple origin', () => {
  const {foundation, mockAdapter} = setupTest();
  const clientRectLeft = 50;
  const clientX = 200;
  const mockTouchStartEvent = {
    touches: [{
      target: {
        getBoundingClientRect: () => {
          return {left: clientRectLeft};
        },
      },
      clientX: clientX,
      clientY: 200,
    }],
  };

  let clickHandler;

  td.when(mockAdapter.registerInputInteractionHandler('touchstart', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => clickHandler = handler);

  foundation.init();
  clickHandler(mockTouchStartEvent);

  const argMatcher = td.matchers.argThat((normalizedX) => (normalizedX === (clientX - clientRectLeft)));
  td.verify(mockAdapter.setLineRippleTransformOrigin(argMatcher));
});

test('on validation attribute change calls styleValidity_', () => {
  const {foundation, mockAdapter, helperText} = setupTest();
  let attributeChange;
  td.when(mockAdapter.registerValidationAttributeChangeHandler(td.matchers.isA(Function)))
    .thenDo((handler) => attributeChange = handler);
  foundation.init();

  attributeChange(['required']);
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
  td.verify(helperText.setValidity(true));

  td.verify(mockAdapter.addClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.addClass(cssClasses.DISABLED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED), {times: 0});
});

test('should not call styleValidity_ on non-whitelisted attribute change', () => {
  const {foundation, mockAdapter, helperText} = setupTest();
  let attributeChange;
  td.when(mockAdapter.registerValidationAttributeChangeHandler(td.matchers.isA(Function)))
    .thenDo((handler) => attributeChange = handler);
  foundation.init();

  attributeChange([{attributeName: 'form'}]);
  td.verify(mockAdapter.removeClass(cssClasses.INVALID), {times: 0});
  td.verify(helperText.setValidity(td.matchers.isA(Boolean)), {times: 0});

  td.verify(mockAdapter.addClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED), {times: 0});
  td.verify(mockAdapter.addClass(cssClasses.DISABLED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED), {times: 0});
});

test('label floats on invalid input even if value is empty', () => {
  const {mockAdapter} = setupValueTest('', false, true, true);
  td.verify(mockAdapter.floatLabel(true));
});

test('label floats when type is date even if value is empty', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  const nativeInput = {
    type: 'date',
    value: '',
    validity: {
      valid: true,
      badInput: false,
    },
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();
  td.verify(mockAdapter.floatLabel(true));
});
