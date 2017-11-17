// test('on focus removes aria-hidden from helperText', () => {
//   const {foundation, mockAdapter} = setupTest();
//   let focus;
//   td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
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
