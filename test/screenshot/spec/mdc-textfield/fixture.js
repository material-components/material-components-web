window.mdc.testFixture.fontsLoaded.then(() => {
  [].forEach.call(document.querySelectorAll('.mdc-text-field'), (el) => {
    mdc.textField.MDCTextField.attachTo(el);
  });
});
