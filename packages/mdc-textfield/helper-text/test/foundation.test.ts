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


import {verifyDefaultAdapter} from '../../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';
import {MDCTextFieldHelperTextFoundation} from '../../../mdc-textfield/helper-text/foundation';

const {cssClasses, strings} = MDCTextFieldHelperTextFoundation;

describe('MDCTextFieldHelperTextFoundation', () => {
  setUpMdcTestEnvironment();
  it('exports cssClasses', () => {
    expect('cssClasses' in MDCTextFieldHelperTextFoundation).toBeTruthy();
  });

  it('exports strings', () => {
    expect('strings' in MDCTextFieldHelperTextFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCTextFieldHelperTextFoundation, [
      'addClass',
      'removeClass',
      'hasClass',
      'getAttr',
      'setAttr',
      'removeAttr',
      'setContent',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCTextFieldHelperTextFoundation);
    return {foundation, mockAdapter};
  };

  it('istanbul code coverage', () => {
    expect(() => new MDCTextFieldHelperTextFoundation).not.toThrow();
  });

  it('#getId retrieves ID', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getAttr.and.returnValue('bar');

    expect(foundation.getId()).toEqual('bar');
  });

  it('#isPersistent retrieves correct value', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
        .and.returnValue(true);

    expect(foundation.isPersistent()).toEqual(true);

    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
        .and.returnValue(false);

    expect(foundation.isPersistent()).toEqual(false);
  });

  it('#isValidation retrieves correct value', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
        .and.returnValue(true);

    expect(foundation.isValidation()).toEqual(true);

    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
        .and.returnValue(false);

    expect(foundation.isValidation()).toEqual(false);
  });

  it('#isVisible retrieves correct value', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getAttr.withArgs(strings.ARIA_HIDDEN).and.returnValue('true');

    expect(foundation.isVisible()).toEqual(false);

    mockAdapter.getAttr.withArgs(strings.ARIA_HIDDEN).and.returnValue('false');

    expect(foundation.isVisible()).toEqual(true);
  });

  it('#setContent sets the content of the helper text element', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setContent('foo');
    expect(mockAdapter.setContent).toHaveBeenCalledWith('foo');
  });

  it('#setPersistent toggles the persistent class', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setPersistent(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.HELPER_TEXT_PERSISTENT);
    foundation.setPersistent(false);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.HELPER_TEXT_PERSISTENT);
  });

  it('#setValidation toggles the validation class', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setValidation(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    foundation.setValidation(false);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.HELPER_TEXT_VALIDATION_MSG);
  });

  it('#showToScreenReader removes aria-hidden from helperText', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.showToScreenReader();
    expect(mockAdapter.removeAttr).toHaveBeenCalledWith('aria-hidden');
  });

  it('#setValidity adds role="alert" to helper text if input is invalid and helper text is being used ' +
         'as a validation message',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = false;
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
           .and.returnValue(false);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(true);
       foundation.setValidity(inputIsValid);
       expect(mockAdapter.setAttr).toHaveBeenCalledWith('role', 'alert');
     });

  it('#setValidity invalid when already invalid refreshes role="alert" if ' +
         'helper text is being used as a validation message',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = false;
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
           .and.returnValue(false);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(true);
       mockAdapter.getAttr.withArgs(strings.ROLE).and.returnValue('alert');
       foundation.setValidity(inputIsValid);

       mockAdapter.setAttr.calls.reset();
       mockAdapter.removeAttr.calls.reset();

       foundation.setValidity(inputIsValid);
       jasmine.clock().tick(1);
       expect(mockAdapter.removeAttr).toHaveBeenCalledWith(strings.ROLE);
       expect(mockAdapter.setAttr).toHaveBeenCalledWith(strings.ROLE, 'alert');
     });

  it('#setValidity removes role="alert" if input is valid', () => {
    const {foundation, mockAdapter} = setupTest();
    const inputIsValid = true;
    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
        .and.returnValue(false);
    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
        .and.returnValue(true);
    foundation.setValidity(inputIsValid);
    expect(mockAdapter.removeAttr).toHaveBeenCalledWith('role');
  });

  it('#setValidity sets aria-hidden="true" on helper text by default', () => {
    const {foundation, mockAdapter} = setupTest();
    const inputIsValid = true;
    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
        .and.returnValue(false);
    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
        .and.returnValue(false);
    foundation.setValidity(inputIsValid);
    expect(mockAdapter.setAttr).toHaveBeenCalledWith('aria-hidden', 'true');
  });

  it('#setValidity does not set aria-hidden on helper text when it is persistent',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = true;
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(false);
       foundation.setValidity(inputIsValid);
       expect(mockAdapter.setAttr)
           .not.toHaveBeenCalledWith('aria-hidden', 'true');
     });

  it('#setValidity does not set aria-hidden if input is invalid and helper text is validation message',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = false;
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
           .and.returnValue(false);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(true);
       foundation.setValidity(inputIsValid);
       expect(mockAdapter.setAttr)
           .not.toHaveBeenCalledWith('aria-hidden', 'true');
     });

  it('#setValidity sets aria-hidden=true if input is valid and helper text is validation message',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = true;
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_PERSISTENT)
           .and.returnValue(false);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(true);
       foundation.setValidity(inputIsValid);
       expect(mockAdapter.setAttr).toHaveBeenCalledWith('aria-hidden', 'true');
     });
});
