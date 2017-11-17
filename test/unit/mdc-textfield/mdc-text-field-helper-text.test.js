

// test('#adapter.addClassToHelperText does nothing if no helper text element present', () => {
//   const {component} = setupTest();
//   assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.addClassToHelperText('foo'));
// });

// test('#adapter.addClassToHelperText adds a class to the helper text element when present', () => {
//   const {component} = setupTest();
//   component.helperTextElement = getHelperText();
//   component.getDefaultFoundation().adapter_.addClassToHelperText('foo');
//   assert.isOk(component.helperTextElement.classList.contains('foo'));
// });

// test('#adapter.removeClassFromHelperText does nothing if no helper text element present', () => {
//   const {component} = setupTest();
//   assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.removeClassFromHelperText('foo'));
// });

// test('#adapter.removeClassFromHelperText removes a class from the helper text element when present', () => {
//   const {component} = setupTest();
//   const helperText = getHelperText();
//   component.helperTextElement = helperText;
//   helperText.classList.add('foo');
//   component.getDefaultFoundation().adapter_.removeClassFromHelperText('foo');
//   assert.isNotOk(helperText.classList.contains('foo'));
// });

// test('#adapter.helperTextHasClass does nothing if no helper text element present', () => {
//   const {component} = setupTest();
//   assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.helperTextHasClass('foo'));
// });

// test('#adapter.helperTextHasClass returns whether or not the helper text contains a certain class', () => {
//   const {component} = setupTest();
//   const helperText = getHelperText();
//   component.helperTextElement = helperText;
//   helperText.classList.add('foo');
//   assert.isOk(component.getDefaultFoundation().adapter_.helperTextHasClass('foo'));
//   helperText.classList.remove('foo');
//   assert.isNotOk(component.getDefaultFoundation().adapter_.helperTextHasClass('foo'));
// });

// test('#adapter.setHelperTextAttr does nothing if no helper text element present', () => {
//   const {component} = setupTest();
//   assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.helperTextHasClass('foo'));
// });

// test('#adapter.setHelperTextAttr sets an attribute to a certain value on the helper text element', () => {
//   const {component} = setupTest();
//   const helperText = getHelperText();
//   component.helperTextElement = helperText;
//   component.getDefaultFoundation().adapter_.setHelperTextAttr('aria-label', 'foo');
//   assert.equal(helperText.getAttribute('aria-label'), 'foo');
// });

// test('#adapter.removeHelperTextAttr does nothing if no helper text element present', () => {
//   const {component} = setupTest();
//   assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.removeHelperTextAttr('aria-label'));
// });

// test('#adapter.removeHelperTextAttr removes an attribute on the helper text element', () => {
//   const {component} = setupTest();
//   const helperText = getHelperText();
//   helperText.setAttribute('aria-label', 'foo');
//   component.helperTextElement = helperText;
//   component.getDefaultFoundation().adapter_.removeHelperTextAttr('aria-label');
//   assert.isNotOk(helperText.hasAttribute('aria-label'));
// });
