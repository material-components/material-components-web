[].forEach.call(document.querySelectorAll('.mdc-text-field'), function(el) {
  mdc.textField.MDCTextField.attachTo(el);
});
