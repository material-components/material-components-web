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


import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';
import {MDCTextFieldFoundation} from '../foundation';
import {MDCTextFieldNativeInputElement} from '../types';

const LABEL_WIDTH = 100;
const {cssClasses, numbers, strings} = MDCTextFieldFoundation;

describe('MDCTextFieldFoundation', () => {
  it('exports strings', () => {
    expect(MDCTextFieldFoundation.strings).toBeTruthy();
  });

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCTextFieldFoundation).toBeTruthy();
  });

  it('exports numbers', () => {
    expect('numbers' in MDCTextFieldFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCTextFieldFoundation, [
      'addClass',
      'removeClass',
      'hasClass',
      'setInputAttr',
      'removeInputAttr',
      'registerTextFieldInteractionHandler',
      'deregisterTextFieldInteractionHandler',
      'registerInputInteractionHandler',
      'deregisterInputInteractionHandler',
      'getNativeInput',
      'isFocused',
      'activateLineRipple',
      'deactivateLineRipple',
      'setLineRippleTransformOrigin',
      'shakeLabel',
      'floatLabel',
      'setLabelRequired',
      'hasLabel',
      'getLabelWidth',
      'registerValidationAttributeChangeHandler',
      'deregisterValidationAttributeChangeHandler',
      'hasOutline',
      'notchOutline',
      'closeOutline',
    ]);
  });

  const setupTest = ({
    useCharacterCounter = false,
    useHelperText = false,
    useLeadingIcon = false,
    useTrailingIcon = false,
    optIsValid = true,
  } = {}) => {
    const {mockAdapter} = setUpFoundationTest(MDCTextFieldFoundation);
    mockAdapter.hasClass.withArgs('mdc-text-field--invalid')
        .and.returnValue(!optIsValid);

    const helperText = useHelperText ?
        jasmine.createSpyObj(
            'helperText',
            [
              'getId', 'isVisible', 'isPersistent', 'isValidation',
              'setContent', 'showToScreenReader', 'setValidity'
            ]) :
        undefined;

    const characterCounter = useCharacterCounter ?
        jasmine.createSpyObj('characterCounter', ['setCounterValue']) :
        undefined;

    const leadingIcon = useLeadingIcon ?
        jasmine.createSpyObj(
            'leadingIcon',
            [
              'setDisabled', 'setAriaLabel', 'setContent',
              'registerInteractionHandler', 'deregisterInteractionHandler',
              'handleInteraction'
            ]) :
        undefined;

    const trailingIcon = useTrailingIcon ?
        jasmine.createSpyObj(
            'trailingIcon',
            [
              'setDisabled', 'setAriaLabel', 'setContent',
              'registerInteractionHandler', 'deregisterInteractionHandler',
              'handleInteraction'
            ]) :
        undefined;

    const foundationMap = {
      helperText,
      characterCounter,
      leadingIcon,
      trailingIcon,
    };
    const foundation = new MDCTextFieldFoundation(mockAdapter, foundationMap);

    return {
      foundation,
      mockAdapter,
      helperText,
      characterCounter,
      leadingIcon,
      trailingIcon
    };
  };

  it('#constructor sets disabled to false', () => {
    const {foundation} = setupTest();
    expect(foundation.isDisabled()).toBeFalsy();
  });

  const setupValueTest = ({
    value = '',
    optIsRequired = false,
    optIsValid = true,
    optIsBadInput = false,
    hasLabel = false,
    useCharacterCounter = false,
    useHelperText = false,
    useLeadingIcon = false,
    useTrailingIcon = false,
  } = {}) => {
    const {foundation, mockAdapter, helperText} = setupTest({
      useCharacterCounter,
      useHelperText,
      useLeadingIcon,
      useTrailingIcon,
      optIsValid,
    });
    const nativeInput = {
      value,
      required: optIsRequired,
      validity: {
        valid: optIsValid,
        badInput: optIsBadInput,
      },
    };
    if (hasLabel) {
      mockAdapter.hasLabel.and.returnValue(true);
    }
    // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
    // error suppression.
    //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '{ value:
    //  string; required: boolean; validity: { valid: boolean; badInput:
    //  boolean; }; }' is not assignable to parameter of type
    //  'MDCTextFieldNativeInputElement'.
    mockAdapter.getNativeInput.and.returnValue(nativeInput);
    foundation.init();

    return {foundation, mockAdapter, helperText, nativeInput};
  };

  it('#getValue returns the field\'s value', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getNativeInput.and.returnValue({
      value: 'initValue',
    } as MDCTextFieldNativeInputElement);
    expect('initValue')
        .withContext('getValue does not match input value.')
        .toEqual(foundation.getValue());
  });

  it(`initializes 'valid' property to false when field is invalid`, () => {
    const {foundation} = setupTest({optIsValid: false});
    foundation.setUseNativeValidation(false);
    expect(foundation.isValid()).toBe(false);
  });

  it(`initializes 'valid' property to true when field is valid`, () => {
    const {foundation} = setupTest({optIsValid: true});
    foundation.setUseNativeValidation(false);
    expect(foundation.isValid()).toBe(true);
  });

  it('#setValue with non-empty value styles the label', () => {
    const value = 'new value';
    const {foundation, nativeInput, mockAdapter} =
        setupValueTest({value: '', hasLabel: true});
    // Initial empty value should not float label.
    expect(mockAdapter.floatLabel).not.toHaveBeenCalledWith(false);
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
    nativeInput.value = value;
    foundation.setValue(value);
    expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('#setValue with empty value styles the label', () => {
    const {foundation, nativeInput, mockAdapter} =
        setupValueTest({value: 'old value', hasLabel: true});
    // Initial value should float the label.
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
    nativeInput.value = '';
    foundation.setValue('');
    expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(false);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('#setValue valid and invalid input', () => {
    const {foundation, mockAdapter, nativeInput, helperText} = setupValueTest(
        {value: '', optIsValid: false, hasLabel: true, useHelperText: true});

    foundation.setValue('invalid');
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.INVALID);
    expect(helperText.setValidity).toHaveBeenCalledWith(false);
    expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);

    nativeInput.validity.valid = true;
    foundation.setValue('valid');
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
    expect(helperText.setValidity).toHaveBeenCalledWith(true);
    expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('#setValue valid and invalid input without autovalidation', () => {
    const {foundation, mockAdapter, nativeInput, helperText} = setupValueTest(
        {value: '', optIsValid: false, hasLabel: true, useHelperText: true});

    expect(foundation.getValidateOnValueChange()).toBeTrue();
    foundation.setValidateOnValueChange(false);
    expect(foundation.getValidateOnValueChange()).toBeFalse();

    foundation.setValue('invalid');
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.INVALID);
    expect(helperText.setValidity).not.toHaveBeenCalledWith(false);
    expect(mockAdapter.shakeLabel).not.toHaveBeenCalledWith(true);
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);

    nativeInput.validity.valid = true;
    foundation.setValue('valid');
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.INVALID);
    expect(helperText.setValidity).not.toHaveBeenCalledWith(true);
    expect(mockAdapter.shakeLabel).not.toHaveBeenCalledWith(false);
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('#setValue with invalid status and empty value does not shake the label',
     () => {
       const {foundation, mockAdapter, helperText} = setupValueTest(
           {value: '', optIsValid: false, hasLabel: true, useHelperText: true});

       foundation.setValue('');
       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.INVALID);
       expect(helperText.setValidity).toHaveBeenCalledWith(false);
       expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
       expect(mockAdapter.floatLabel).toHaveBeenCalledWith(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
     });

  it('#setValue does not affect focused state', () => {
    const {foundation, mockAdapter} = setupValueTest({value: ''});
    foundation.setValue('');
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.FOCUSED);
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.FOCUSED);
  });

  it('#setValue does not affect disabled state', () => {
    const {foundation, mockAdapter} = setupValueTest({value: ''});
    foundation.setValue('');
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.DISABLED);
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.DISABLED);
    // Called once initially because the field is valid, should not be called
    // twice.
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
    expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
  });

  it('#setValue updates character counter when present', () => {
    const {foundation, mockAdapter, characterCounter} =
        setupTest({useCharacterCounter: true});
    const nativeInput = {
      type: 'text',
      value: '',
      maxLength: 4,
      validity: {
        valid: true,
      },
    };
    // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
    // error suppression.
    //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '{ type: string;
    //  value: string; maxLength: number; validity: { valid: boolean; }; }' is
    //  not assignable to parameter of type 'MDCTextFieldNativeInputElement'.
    mockAdapter.getNativeInput.and.returnValue(nativeInput);

    foundation.setValue('ok');
    expect(characterCounter.setCounterValue).toHaveBeenCalledWith(2, 4);
    expect(characterCounter.setCounterValue).toHaveBeenCalledTimes(1);
  });

  it('#setValue forces the character counter to update if value was updated independently',
     () => {
       const {foundation, mockAdapter, characterCounter} =
           setupTest({useCharacterCounter: true});
       const nativeInput = {
         type: 'text',
         value: '',
         maxLength: 4,
         validity: {
           valid: true,
         },
       };
       // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
       // error suppression.
       //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '{ type:
       //  string; value: string; maxLength: number; validity: { valid: boolean;
       //  }; }' is not assignable to parameter of type
       //  'MDCTextFieldNativeInputElement'.
       mockAdapter.getNativeInput.and.returnValue(nativeInput);
       nativeInput.value = 'ok';
       foundation.setValue('ok');
       expect(characterCounter.setCounterValue).toHaveBeenCalledWith(2, 4);
       expect(characterCounter.setCounterValue).toHaveBeenCalledTimes(1);
     });

  it('#isValid for native validation', () => {
    const {foundation, nativeInput} =
        setupValueTest({value: '', optIsValid: true});
    expect(foundation.isValid()).toBeTruthy();

    nativeInput.validity.valid = false;
    expect(foundation.isValid()).toBeFalsy();
  });

  it('#setValid overrides native validation when useNativeValidation set to false',
     () => {
       const {foundation, nativeInput} =
           setupValueTest({value: '', optIsValid: false});
       foundation.setUseNativeValidation(false);
       foundation.setValid(true);
       expect(foundation.isValid()).toBeTruthy();

       nativeInput.validity.valid = true;
       foundation.setValid(false);
       expect(foundation.isValid()).toBeFalsy();
     });

  it('#setValid updates classes', () => {
    const {foundation, mockAdapter, helperText} =
        setupTest({useHelperText: true});
    mockAdapter.hasLabel.and.returnValue(true);
    mockAdapter.getNativeInput.and.returnValue({
      value: 'test',
    } as MDCTextFieldNativeInputElement);

    foundation.setValid(false);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.INVALID);
    expect(helperText.setValidity).toHaveBeenCalledWith(false);
    expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(true);

    foundation.setValid(true);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
    expect(helperText.setValidity).toHaveBeenCalledWith(true);
    expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);

    // None of these is affected by setValid.
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.FOCUSED);
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.FOCUSED);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.DISABLED);
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.DISABLED);
  });

  it('#setValid sets aria-describedby if validation helper text is visible',
     () => {
       const {foundation, mockAdapter, helperText} =
           setupTest({useHelperText: true});
       helperText.isValidation.and.returnValue(true);
       helperText.isVisible.and.returnValue(true);
       helperText.getId.and.returnValue('foooo');

       foundation.setValid(true);
       expect(mockAdapter.setInputAttr)
           .toHaveBeenCalledWith(strings.ARIA_DESCRIBEDBY, 'foooo');
     });

  it('#setValid removes aria-describedby if validation helper text is hidden',
     () => {
       const {foundation, mockAdapter, helperText} =
           setupTest({useHelperText: true});
       helperText.isValidation.and.returnValue(true);
       helperText.isVisible.and.returnValue(false);
       helperText.getId.and.returnValue('foooo');

       foundation.setValid(true);
       expect(mockAdapter.removeInputAttr)
           .toHaveBeenCalledWith(strings.ARIA_DESCRIBEDBY);
     });

  it('#setValid updates classes, but not label methods when hasLabel is false',
     () => {
       const {foundation, mockAdapter, helperText} =
           setupTest({useHelperText: true});

       foundation.setValid(false);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.INVALID);
       expect(helperText.setValidity).toHaveBeenCalledWith(false);
       expect(mockAdapter.shakeLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());

       foundation.setValid(true);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
       expect(helperText.setValidity).toHaveBeenCalledWith(true);
       expect(mockAdapter.shakeLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());

       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.FOCUSED);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.FOCUSED);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.DISABLED);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.DISABLED);
     });

  it('#setDisabled flips disabled when a native input is given', () => {
    const {foundation, mockAdapter} = setupTest();
    const nativeInput = {disabled: false} as MDCTextFieldNativeInputElement;
    mockAdapter.getNativeInput.and.returnValue(nativeInput);
    foundation.setDisabled(true);
    expect(foundation.isDisabled()).toBeTruthy();
  });

  it('#setDisabled has no effect when no native input is provided', () => {
    const {foundation} = setupTest();
    foundation.setDisabled(true);
    expect(foundation.isDisabled()).toBeFalsy();
  });

  it('#setDisabled set the disabled property on the native input when there is one',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const nativeInput = {disabled: false} as MDCTextFieldNativeInputElement;
       mockAdapter.getNativeInput.and.returnValue(nativeInput);
       foundation.setDisabled(true);
       expect(nativeInput.disabled).toBeTruthy();
     });

  it('#setDisabled handles no native input being returned gracefully', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getNativeInput.and.returnValue(null);
    expect(() => foundation.setDisabled).not.toThrow();
  });

  it('#setDisabled adds mdc-text-field--disabled when set to true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(true);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.DISABLED);
  });

  it('#setDisabled removes mdc-text-field--invalid when set to true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(true);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
  });

  it('#setDisabled removes mdc-text-field--disabled when set to false', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(false);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.DISABLED);
  });

  it('#setDisabled sets disabled on leading icon', () => {
    const {foundation, leadingIcon} = setupTest({useLeadingIcon: true});
    foundation.setDisabled(true);
    expect(leadingIcon.setDisabled).toHaveBeenCalledWith(true);
  });

  it('#setDisabled sets disabled on trailing icon', () => {
    const {foundation, trailingIcon} = setupTest({useTrailingIcon: true});
    foundation.setDisabled(true);
    expect(trailingIcon.setDisabled).toHaveBeenCalledWith(true);
  });

  it('#setValid adds mdc-textfied--invalid when set to false', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setValid(false);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.INVALID);
  });

  it('#setValid removes mdc-textfied--invalid when set to true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setValid(true);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
  });

  it('#setValid should not trigger shake animation when text field is empty',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasLabel.and.returnValue(true);
       mockAdapter.getNativeInput.and.returnValue({
         value: '',
       } as MDCTextFieldNativeInputElement);
       foundation.setValid(false);
       expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
     });

  it('#init focuses on input if adapter.isFocused is true', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isFocused.and.returnValue(true);
    foundation.activateFocus = jasmine.createSpy('activateFocus');
    foundation.init();
    expect(foundation.activateFocus).toHaveBeenCalledTimes(1);
  });

  it('#init does not focus if adapter.isFocused is false', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isFocused.and.returnValue(false);
    foundation.init();
    foundation.activateFocus = jasmine.createSpy('activateFocus');
    expect(foundation.activateFocus).not.toHaveBeenCalled();
  });

  it('#init adds event listeners', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();

    expect(mockAdapter.registerInputInteractionHandler)
        .toHaveBeenCalledWith('focus', jasmine.any(Function));
    expect(mockAdapter.registerInputInteractionHandler)
        .toHaveBeenCalledWith('blur', jasmine.any(Function));
    expect(mockAdapter.registerInputInteractionHandler)
        .toHaveBeenCalledWith('input', jasmine.any(Function));
    expect(mockAdapter.registerInputInteractionHandler)
        .toHaveBeenCalledWith('mousedown', jasmine.any(Function));
    expect(mockAdapter.registerInputInteractionHandler)
        .toHaveBeenCalledWith('touchstart', jasmine.any(Function));
    expect(mockAdapter.registerTextFieldInteractionHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
    expect(mockAdapter.registerTextFieldInteractionHandler)
        .toHaveBeenCalledWith('keydown', jasmine.any(Function));
    expect(mockAdapter.registerValidationAttributeChangeHandler)
        .toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('#destroy removes event listeners', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation['validationObserver'] = new MutationObserver(() => {});
    foundation.destroy();

    expect(mockAdapter.deregisterInputInteractionHandler)
        .toHaveBeenCalledWith('focus', jasmine.any(Function));
    expect(mockAdapter.deregisterInputInteractionHandler)
        .toHaveBeenCalledWith('blur', jasmine.any(Function));
    expect(mockAdapter.deregisterInputInteractionHandler)
        .toHaveBeenCalledWith('input', jasmine.any(Function));
    expect(mockAdapter.deregisterInputInteractionHandler)
        .toHaveBeenCalledWith('mousedown', jasmine.any(Function));
    expect(mockAdapter.deregisterInputInteractionHandler)
        .toHaveBeenCalledWith('touchstart', jasmine.any(Function));
    expect(mockAdapter.deregisterTextFieldInteractionHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
    expect(mockAdapter.deregisterTextFieldInteractionHandler)
        .toHaveBeenCalledWith('keydown', jasmine.any(Function));
    expect(mockAdapter.deregisterValidationAttributeChangeHandler)
        .toHaveBeenCalledWith(foundation['validationObserver']);
  });

  it('#init floats label if the input contains a value', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasLabel.and.returnValue(true);
    mockAdapter.getNativeInput.and.returnValue({
      value: 'Pre-filled value',
      disabled: false,
      // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
      // error suppression.
      //  @ts-ignore(go/unfork-jasmine-typings): Property 'valid' is missing in
      //  type '{ badInput: false; }' but required in type 'Pick<ValidityState,
      //  "valid" | "badInput">'.
      validity: {
        badInput: false,
      },
    });
    foundation.init();
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('#init does not call floatLabel if there is no label and the input contains a value',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getNativeInput.and.returnValue({
         value: 'Pre-filled value',
         disabled: false,
         // TODO: Wait until b/208710526 is fixed, then remove this
         // autogenerated error suppression.
         //  @ts-ignore(go/unfork-jasmine-typings): Property 'valid' is missing
         //  in type '{ badInput: false; }' but required in type
         //  'Pick<ValidityState, "valid" | "badInput">'.
         validity: {
           badInput: false,
         },
       });
       foundation.init();
       expect(mockAdapter.floatLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
     });

  it('#init does not float label if the input does not contain a value', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getNativeInput.and.returnValue({
      value: '',
      disabled: false,
      // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
      // error suppression.
      //  @ts-ignore(go/unfork-jasmine-typings): Property 'valid' is missing in
      //  type '{ badInput: false; }' but required in type 'Pick<ValidityState,
      //  "valid" | "badInput">'.
      validity: {
        badInput: false,
      },
    });
    foundation.init();
    expect(mockAdapter.floatLabel)
        .not.toHaveBeenCalledWith(
            // TODO: Wait until b/208710526 is fixed, then remove this
            // autogenerated error suppression.
            //  @ts-ignore(go/unfork-jasmine-typings): Expected 1 arguments, but
            //  got 3.
            /* value */ '', /* isFocused */ false, /* isBadInput */ false);
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('#setHelperTextContent sets the content of the helper text element',
     () => {
       const {foundation, helperText} = setupTest({useHelperText: true});
       foundation.setHelperTextContent('foo');
       expect(helperText.setContent).toHaveBeenCalledWith('foo');
     });

  it('#setLeadingIconAriaLabel sets the aria-label of the leading icon element',
     () => {
       const {foundation, leadingIcon} = setupTest({useLeadingIcon: true});
       foundation.setLeadingIconAriaLabel('foo');
       expect(leadingIcon.setAriaLabel).toHaveBeenCalledWith('foo');
     });

  it('#setLeadingIconAriaLabel does nothing if element is not present', () => {
    const {foundation} = setupTest({useLeadingIcon: false});
    expect(() => foundation.setLeadingIconAriaLabel).not.toThrow();
  });

  it('#setLeadingIconContent sets the content of the leading icon element',
     () => {
       const {foundation, leadingIcon} = setupTest({useLeadingIcon: true});
       foundation.setLeadingIconContent('foo');
       expect(leadingIcon.setContent).toHaveBeenCalledWith('foo');
     });

  it('#setLeadingIconContent does nothing if element is not present', () => {
    const {foundation} = setupTest({useLeadingIcon: false});
    expect(() => foundation.setLeadingIconContent).not.toThrow();
  });

  it('#setTrailingIconAriaLabel sets the aria-label of the trailing icon element',
     () => {
       const {foundation, trailingIcon} = setupTest({useTrailingIcon: true});
       foundation.setTrailingIconAriaLabel('foo');
       expect(trailingIcon.setAriaLabel).toHaveBeenCalledWith('foo');
     });

  it('#setTrailingIconAriaLabel does nothing if element is not present', () => {
    const {foundation} = setupTest({useTrailingIcon: false});
    expect(() => foundation.setTrailingIconAriaLabel).not.toThrow();
  });

  it('#setTrailingIconContent sets the content of the trailing icon element',
     () => {
       const {foundation, trailingIcon} = setupTest({useTrailingIcon: true});
       foundation.setTrailingIconContent('foo');
       expect(trailingIcon.setContent).toHaveBeenCalledWith('foo');
     });

  it('#setTrailingIconContent does nothing if element is not present', () => {
    const {foundation} = setupTest({useTrailingIcon: false});
    expect(() => foundation.setTrailingIconContent).not.toThrow();
  });

  it('#notchOutline updates the width of the outline element', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getLabelWidth.and.returnValue(LABEL_WIDTH);
    mockAdapter.hasLabel.and.returnValue(true);
    mockAdapter.hasOutline.and.returnValue(true);

    foundation.notchOutline(true);
    expect(mockAdapter.notchOutline)
        .toHaveBeenCalledWith(LABEL_WIDTH * numbers.LABEL_SCALE);
  });

  const setupBareBonesTest = () => {
    const {mockAdapter} = setUpFoundationTest(MDCTextFieldFoundation);
    const foundationMap = {};
    const foundation = new MDCTextFieldFoundation(mockAdapter, foundationMap);
    return {foundation, mockAdapter};
  };

  it('#notchOutline does nothing if no outline is present', () => {
    const {foundation, mockAdapter} = setupBareBonesTest();
    mockAdapter.hasOutline.and.returnValue(false);
    mockAdapter.hasLabel.and.returnValue(true);

    foundation.notchOutline(true);
    expect(mockAdapter.notchOutline)
        .not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('#notchOutline does nothing if no label is present', () => {
    const {foundation, mockAdapter} = setupBareBonesTest();
    mockAdapter.hasOutline.and.returnValue(true);
    mockAdapter.hasLabel.and.returnValue(false);

    foundation.notchOutline(true);
    expect(mockAdapter.notchOutline)
        .not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('#notchOutline width is set to 0 if no label text is present', () => {
    const {foundation, mockAdapter} = setupBareBonesTest();
    mockAdapter.hasOutline.and.returnValue(true);
    mockAdapter.hasLabel.and.returnValue(true);
    mockAdapter.getLabelWidth.and.returnValue(0);

    foundation.notchOutline(true);
    expect(mockAdapter.notchOutline).toHaveBeenCalledWith(0);
    expect(mockAdapter.notchOutline).toHaveBeenCalledTimes(1);
  });

  it('#notchOutline(false) closes the outline', () => {
    const {foundation, mockAdapter} = setupBareBonesTest();
    mockAdapter.hasLabel.and.returnValue(true);
    mockAdapter.hasOutline.and.returnValue(true);

    foundation.notchOutline(false);
    expect(mockAdapter.closeOutline).toHaveBeenCalled();
  });

  it('on input styles label if input event occurs without any other events',
     () => {
       const {foundation, mockAdapter} = setupTest();
       let input: Function|undefined;
       mockAdapter.hasLabel.and.returnValue(true);
       mockAdapter.registerInputInteractionHandler
           .withArgs(jasmine.any(String), jasmine.any(Function))
           .and.callFake((evtType: string, handler: Function) => {
             if (evtType === 'input') {
               input = handler;
             }
           });
       foundation.init();
       expect(mockAdapter.floatLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
       if (input !== undefined) {
         input();
       }
       expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
       expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
     });

  it('on input doesnot styles label if input event occurs without any other events but hasLabel is false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       let input: Function|undefined;
       mockAdapter.registerInputInteractionHandler
           .withArgs(jasmine.any(String), jasmine.any(Function))
           .and.callFake((evtType: string, handler: Function) => {
             if (evtType === 'input') {
               input = handler;
             }
           });
       foundation.init();
       if (input !== undefined) {
         input();
       }
       expect(mockAdapter.shakeLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.floatLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
     });

  it('on input does nothing if input event preceded by keydown event', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEvt = {
      type: 'keydown',
      key: 'Enter',
    };
    const mockInput = {
      disabled: false,
      value: '',
    } as MDCTextFieldNativeInputElement;
    let keydown: Function|undefined;
    let input: Function|undefined;

    mockAdapter.getNativeInput.and.returnValue(mockInput);
    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'input') {
            input = handler;
          } else if (evtType === 'keydown') {
            keydown = handler;
          }
        });
    foundation.init();
    if (keydown !== undefined) {
      keydown(mockEvt);
    }
    if (input !== undefined) {
      input();
    }
    expect(mockAdapter.shakeLabel).not.toHaveBeenCalled();
    expect(mockAdapter.floatLabel).not.toHaveBeenCalled();
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('on focus adds mdc-text-field--focused class', () => {
    const {foundation, mockAdapter} = setupTest();
    let focus: Function|undefined;
    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'focus') {
            focus = handler;
          }
        });
    foundation.init();
    if (focus !== undefined) {
      focus();
    }
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.FOCUSED);
  });

  it('on focus activates line ripple', () => {
    const {foundation, mockAdapter} = setupTest();
    let focus: Function|undefined;
    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'focus') {
            focus = handler;
          }
        });
    foundation.init();
    if (focus !== undefined) {
      focus();
    }
    expect(mockAdapter.activateLineRipple).toHaveBeenCalled();
  });

  it('on focus styles label', () => {
    const {foundation, mockAdapter} = setupTest();
    let focus: Function|undefined;
    mockAdapter.hasLabel.and.returnValue(true);
    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'focus') {
            focus = handler;
          }
        });
    foundation.init();
    expect(mockAdapter.floatLabel).not.toHaveBeenCalledWith(jasmine.anything());
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
    if (focus !== undefined) {
      focus();
    }
    expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
  });

  it('on focus do not styles label if hasLabel is false', () => {
    const {foundation, mockAdapter} = setupTest();
    let focus: Function|undefined;
    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'focus') {
            focus = handler;
          }
        });
    foundation.init();
    if (focus !== undefined) {
      focus();
    }
    expect(mockAdapter.floatLabel).not.toHaveBeenCalledWith(jasmine.anything());
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
    expect(mockAdapter.shakeLabel).not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('on focus makes helper text visible to the screen reader', () => {
    const {foundation, mockAdapter, helperText} =
        setupTest({useHelperText: true});
    let focus: Function|undefined;
    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'focus') {
            focus = handler;
          }
        });
    foundation.init();
    if (focus !== undefined) {
      focus();
    }
    expect(helperText.showToScreenReader).toHaveBeenCalled();
  });

  const setupBlurTest = () => {
    const {foundation, mockAdapter, helperText} =
        setupTest({useHelperText: true});
    let blur: Function|undefined;
    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'blur') {
            blur = handler;
          }
        });
    const nativeInput = {
      value: '',
      validity: {
        valid: true,
        badInput: false,
      },
      checkValidity: () => false,
    };
    // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
    // error suppression.
    //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '{ value:
    //  string; validity: { valid: boolean; badInput: boolean; }; checkValidity:
    //  () => boolean; }' is not assignable to parameter of type
    //  'MDCTextFieldNativeInputElement'.
    mockAdapter.getNativeInput.and.returnValue(nativeInput);
    foundation.init();

    return {foundation, mockAdapter, blur, nativeInput, helperText};
  };

  it('on blur removes mdc-text-field--focused class', () => {
    const {mockAdapter, blur} = setupBlurTest();
    if (blur !== undefined) {
      blur();
    }
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.FOCUSED);
  });

  it('on blur styles label when no input value present and validity checks pass',
     () => {
       const {blur, mockAdapter} = setupBlurTest();
       mockAdapter.hasLabel.and.returnValue(true);
       expect(mockAdapter.floatLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
       if (blur !== undefined) {
         blur();
       }
       expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
       expect(mockAdapter.floatLabel).toHaveBeenCalledWith(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
     });

  it('does not style label on blur when no input value present and validity checks pass and hasLabel is false',
     () => {
       const {blur, mockAdapter} = setupBlurTest();
       expect(mockAdapter.floatLabel)
           // TODO: Wait until b/208710526 is fixed, then remove this
           // autogenerated error suppression.
           //  @ts-ignore(go/unfork-jasmine-typings): Expected 1 arguments, but
           //  got 2.
           .not.toHaveBeenCalledWith(/* value */ '', /* isFocused */ false);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
       if (blur !== undefined) {
         blur();
       }
       expect(mockAdapter.shakeLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.floatLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
     });

  it('on blur styles label if input has a value', () => {
    const {blur, nativeInput, mockAdapter} = setupBlurTest();
    mockAdapter.hasLabel.and.returnValue(true);
    expect(mockAdapter.floatLabel).not.toHaveBeenCalledWith(jasmine.anything());
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
    nativeInput.value = 'non-empty value';
    if (blur !== undefined) {
      blur();
    }
    expect(mockAdapter.shakeLabel).toHaveBeenCalledWith(false);
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('does not style label on blur if input has a value and hasLabel is false',
     () => {
       const {blur, nativeInput, mockAdapter} = setupBlurTest();
       expect(mockAdapter.floatLabel)
           // TODO: Wait until b/208710526 is fixed, then remove this
           // autogenerated error suppression.
           //  @ts-ignore(go/unfork-jasmine-typings): Expected 1 arguments, but
           //  got 2.
           .not.toHaveBeenCalledWith(/* value */ '', /* isFocused */ false);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
       nativeInput.value = 'non-empty value';
       if (blur !== undefined) {
         blur();
       }
       expect(mockAdapter.shakeLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.floatLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
     });

  it('on blur removes mdc-text-field--invalid if useNativeValidation is true and' +
         'input.checkValidity() returns true',
     () => {
       const {mockAdapter, blur} = setupBlurTest();
       if (blur !== undefined) {
         blur();
       }
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
     });

  it('on blur adds mdc-textfied--invalid if useNativeValidation is true and' +
         'input.checkValidity() returns false',
     () => {
       const {mockAdapter, blur, nativeInput} = setupBlurTest();
       nativeInput.validity.valid = false;
       if (blur !== undefined) {
         blur();
       }
       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.INVALID);
     });

  it('on blur does not remove mdc-text-field--invalid if useNativeValidation is false and' +
         'input.checkValidity() returns true',
     () => {
       const {foundation, mockAdapter, blur} = setupBlurTest();
       foundation.setUseNativeValidation(false);
       foundation.setValid(false);
       if (blur !== undefined) {
         blur();
       }
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.INVALID);
     });

  it('on blur does not add mdc-textfied--invalid if custom validity is true and' +
         'input.checkValidity() returns false',
     () => {
       const {foundation, mockAdapter, blur, nativeInput} = setupBlurTest();
       nativeInput.checkValidity = () => false;
       foundation.setValid(true);
       if (blur !== undefined) {
         blur();
       }
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.INVALID);
     });

  it('on blur set validity of helper text', () => {
    const {blur, nativeInput, helperText} = setupBlurTest();
    nativeInput.validity.valid = false;
    if (blur !== undefined) {
      blur();
    }
    expect(helperText.setValidity).toHaveBeenCalledWith(false);
  });

  it('on blur handles getNativeInput() not returning anything gracefully',
     () => {
       const {mockAdapter, blur} = setupBlurTest();
       mockAdapter.getNativeInput.and.returnValue(null);
       expect(blur).not.toThrow();
     });

  it('on keydown sets receivedUserInput to true when input is enabled', () => {
    const {foundation, mockAdapter} = setupTest();
    let keydown: Function|undefined;
    mockAdapter.registerTextFieldInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'keydown') {
            keydown = handler;
          }
        });
    mockAdapter.getNativeInput.and.returnValue({
      disabled: false,
      value: '',
    } as MDCTextFieldNativeInputElement);
    foundation.init();
    expect(foundation['receivedUserInput']).toEqual(false);
    if (keydown !== undefined) {
      keydown();
    }
    expect(foundation['receivedUserInput']).toEqual(true);
  });

  it('on click does not set receivedUserInput if input is disabled', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEvt = {
      type: 'click',
    };
    const mockInput = {
      disabled: true,
      value: '',
    } as MDCTextFieldNativeInputElement;
    let click: Function|undefined;

    mockAdapter.getNativeInput.and.returnValue(mockInput);
    mockAdapter.registerTextFieldInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'click') {
            click = handler;
          }
        });
    foundation.init();
    expect(foundation['receivedUserInput']).toEqual(false);
    if (click !== undefined) {
      click(mockEvt);
    }
    expect(foundation['receivedUserInput']).toEqual(false);
  });

  it('mousedown on the input sets the line ripple origin', () => {
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

    let clickHandler: Function|undefined;

    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'mousedown') {
            clickHandler = handler;
          }
        });

    foundation.init();
    if (clickHandler !== undefined) {
      clickHandler(mockEvt);
    }

    expect(mockAdapter.setLineRippleTransformOrigin)
        .toHaveBeenCalledWith(jasmine.anything());
  });

  it('touchstart on the input sets the line ripple origin', () => {
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

    let clickHandler: Function|undefined;

    mockAdapter.registerInputInteractionHandler
        .withArgs(jasmine.any(String), jasmine.any(Function))
        .and.callFake((evtType: string, handler: Function) => {
          if (evtType === 'touchstart') {
            clickHandler = handler;
          }
        });

    foundation.init();
    if (clickHandler !== undefined) {
      clickHandler(mockTouchStartEvent);
    }

    expect(mockAdapter.setLineRippleTransformOrigin)
        .toHaveBeenCalledWith(clientX - clientRectLeft);
  });

  it('on validation attribute change calls styleValidity', () => {
    const {foundation, mockAdapter, helperText} =
        setupTest({useHelperText: true});
    let attributeChange: Function|undefined;
    mockAdapter.registerValidationAttributeChangeHandler
        .withArgs(jasmine.any(Function))
        // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
        // error suppression.
        //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '(handler:
        //  Function) => Function' is not assignable to parameter of type
        //  '(handler: (attributeNames: string[]) => void) => MutationObserver'.
        .and.callFake((handler: Function) => attributeChange = handler);
    foundation.init();

    if (attributeChange !== undefined) {
      attributeChange(['required']);
    }
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
    expect(helperText.setValidity).toHaveBeenCalledWith(true);

    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.FOCUSED);
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.FOCUSED);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.DISABLED);
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.DISABLED);
  });

  it('should not call styleValidity on non-whitelisted attribute change',
     () => {
       const {foundation, mockAdapter, helperText} =
           setupTest({useHelperText: true});
       let attributeChange: Function|undefined;
       mockAdapter.registerValidationAttributeChangeHandler
           .withArgs(jasmine.any(Function))
           // TODO: Wait until b/208710526 is fixed, then remove this
           // autogenerated error suppression.
           //  @ts-ignore(go/unfork-jasmine-typings): Argument of type
           //  '(handler: Function) => Function' is not assignable to parameter
           //  of type '(handler: (attributeNames: string[]) => void) =>
           //  MutationObserver'.
           .and.callFake((handler: Function) => attributeChange = handler);
       foundation.init();
       if (attributeChange !== undefined) {
         attributeChange([{attributeName: 'form'}]);
       }
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.INVALID);
       expect(helperText.setValidity)
           .not.toHaveBeenCalledWith(jasmine.any(Boolean));

       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.FOCUSED);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.FOCUSED);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.DISABLED);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.DISABLED);
     });

  it('label floats on invalid input even if value is empty', () => {
    const {mockAdapter} = setupValueTest(
        {value: '', optIsValid: false, optIsBadInput: true, hasLabel: true});
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('label floats when type is date even if value is empty', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasLabel.and.returnValue(true);
    const nativeInput = {
      type: 'date',
      value: '',
      validity: {
        valid: true,
        badInput: false,
      },
    };
    // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
    // error suppression.
    //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '{ type: string;
    //  value: string; validity: { valid: boolean; badInput: boolean; }; }' is
    //  not assignable to parameter of type 'MDCTextFieldNativeInputElement'.
    mockAdapter.getNativeInput.and.returnValue(nativeInput);
    foundation.init();
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.LABEL_FLOATING);
  });

  it('#handleInput activates focus state', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.handleInput();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.FOCUSED);
    expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
  });

  it('#handleInput updates character counter on text input', () => {
    const {foundation, mockAdapter, characterCounter} =
        setupTest({useCharacterCounter: true});

    const nativeInput = {
      type: 'text',
      value: '12345678',
      maxLength: 10,
      validity: {
        valid: true,
      },
    };
    // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
    // error suppression.
    //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '{ type: string;
    //  value: string; maxLength: number; validity: { valid: boolean; }; }' is
    //  not assignable to parameter of type 'MDCTextFieldNativeInputElement'.
    mockAdapter.getNativeInput.and.returnValue(nativeInput);

    foundation.handleInput();
    expect(characterCounter.setCounterValue).toHaveBeenCalledWith(8, 10);
    expect(characterCounter.setCounterValue).toHaveBeenCalledTimes(1);
  });


  it('#handleInput throws error when maxLength HTML attribute is not found in input element',
     () => {
       const {foundation, mockAdapter} = setupTest({useCharacterCounter: true});

       const nativeInput = {
         type: 'text',
         value: '12345678',
         validity: {
           valid: true,
         },
         maxLength: -1,
       };
       // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
       // error suppression.
       //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '{ type:
       //  string; value: string; validity: { valid: boolean; }; maxLength:
       //  number; }' is not assignable to parameter of type
       //  'MDCTextFieldNativeInputElement'.
       mockAdapter.getNativeInput.and.returnValue(nativeInput);

       expect(() => {foundation.handleInput()}).toThrow();
     });

  it('#handleValidationAttributeChange sets character counter when maxlength attribute value is changed in input ' +
         'element',
     () => {
       const {foundation, mockAdapter, characterCounter} =
           setupTest({useCharacterCounter: true});

       const nativeInput = {
         type: 'text',
         value: '12345678',
         maxLength: 10,
         validity: {
           valid: true,
         },
       };
       // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
       // error suppression.
       //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '{ type:
       //  string; value: string; maxLength: number; validity: { valid: boolean;
       //  }; }' is not assignable to parameter of type
       //  'MDCTextFieldNativeInputElement'.
       mockAdapter.getNativeInput.and.returnValue(nativeInput);

       foundation.handleValidationAttributeChange(['maxlength']);
       expect(characterCounter.setCounterValue).toHaveBeenCalledWith(8, 10);
       expect(characterCounter.setCounterValue).toHaveBeenCalledTimes(1);
     });

  it('on required attribute change calls setLabelRequired', () => {
    const {foundation, mockAdapter} = setupTest();
    let attributeChange: Function|undefined;
    mockAdapter.registerValidationAttributeChangeHandler
        .withArgs(jasmine.any(Function))
        // TODO: Wait until b/208710526 is fixed, then remove this autogenerated
        // error suppression.
        //  @ts-ignore(go/unfork-jasmine-typings): Argument of type '(handler:
        //  Function) => Function' is not assignable to parameter of type
        //  '(handler: (attributeNames: string[]) => void) => MutationObserver'.
        .and.callFake((handler: Function) => attributeChange = handler);
    foundation.init();

    mockAdapter.getNativeInput.and.returnValue(
        {required: true} as MDCTextFieldNativeInputElement);

    if (attributeChange !== undefined) {
      attributeChange(['required']);
    }
    expect(mockAdapter.setLabelRequired).toHaveBeenCalledWith(true);

    mockAdapter.getNativeInput.and.returnValue(
        {required: false} as MDCTextFieldNativeInputElement);

    if (attributeChange !== undefined) {
      attributeChange(['required']);
    }
    expect(mockAdapter.setLabelRequired).toHaveBeenCalledWith(false);
  });

  it('#init sets label required if native input is required', () => {
    const {foundation, mockAdapter} =
        setupValueTest({value: '', hasLabel: true, optIsRequired: true});
    foundation.init();
    expect(mockAdapter.setLabelRequired).toHaveBeenCalledWith(true);
  });
});
