/**
 * @license
 * Copyright 2020 Google Inc.
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
import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {MDCSelectHelperTextFoundation} from '../foundation';

const {cssClasses, strings} = MDCSelectHelperTextFoundation;

describe('MDCSelectHelperTextFoundation', () => {
  it('exports cssClasses', () => {
    expect(MDCSelectHelperTextFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports strings', () => {
    expect(MDCSelectHelperTextFoundation.strings).toEqual(strings);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCSelectHelperTextFoundation, [
      'addClass',
      'removeClass',
      'hasClass',
      'setAttr',
      'removeAttr',
      'setContent',
    ]);
  });

  const setupTest =
      () => {
        const {foundation, mockAdapter} =
            setUpFoundationTest(MDCSelectHelperTextFoundation);
        return {foundation, mockAdapter};
      }

  it('#setContent sets the content of the helper text element', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setContent('foo');
    expect(mockAdapter.setContent).toHaveBeenCalledWith('foo');
  });

  it('#setValidationMsgPersistent toggles the persistent validation class',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setValidationMsgPersistent(true);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(
               cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT);
       foundation.setValidationMsgPersistent(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(
               cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT);
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

  it('#setValidity adds role="alert" to helper text if input is invalid and' +
         'helper text is being used as a validation message',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = false;
       mockAdapter.hasClass
           .withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT)
           .and.returnValue(false);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(true);
       foundation.setValidity(inputIsValid);
       expect(mockAdapter.setAttr).toHaveBeenCalledWith('role', 'alert');
     });

  it('#setValidity removes role="alert" if input is valid', () => {
    const {foundation, mockAdapter} = setupTest();
    const inputIsValid = true;
    mockAdapter.hasClass
        .withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT)
        .and.returnValue(false);
    mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
        .and.returnValue(true);
    foundation.setValidity(inputIsValid);
    expect(mockAdapter.removeAttr).toHaveBeenCalledWith('role');
  });

  it('#setValidity removes role="alert" if input is valid and validation' +
         ' msg is persistent',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = true;
       mockAdapter.hasClass
           .withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(true);
       foundation.setValidity(inputIsValid);
       expect(mockAdapter.removeAttr).toHaveBeenCalledWith('role');
     });

  it('#setValidity does not set aria-hidden="true" on helper text by default',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = true;
       mockAdapter.hasClass
           .withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT)
           .and.returnValue(false);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(false);
       foundation.setValidity(inputIsValid);
       expect(mockAdapter.setAttr).not.toHaveBeenCalled();
     });

  it('#setValidity does not set aria-hidden on helper text when it is persistent validation',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const inputIsValid = true;
       mockAdapter.hasClass
           .withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT)
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
       mockAdapter.hasClass
           .withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT)
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
       mockAdapter.hasClass
           .withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT)
           .and.returnValue(false);
       mockAdapter.hasClass.withArgs(cssClasses.HELPER_TEXT_VALIDATION_MSG)
           .and.returnValue(true);
       foundation.setValidity(inputIsValid);
       expect(mockAdapter.setAttr).toHaveBeenCalledWith('aria-hidden', 'true');
     });
});
