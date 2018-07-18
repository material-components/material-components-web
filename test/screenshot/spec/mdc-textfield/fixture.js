[].forEach.call(document.querySelectorAll('.mdc-text-field'), function(el) {
  const textField = new mdc.textField.MDCTextField(el);
});
