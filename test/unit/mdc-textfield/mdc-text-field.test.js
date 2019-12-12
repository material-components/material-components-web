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

import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {assert} from 'chai';

import {MDCRipple} from '../../../packages/mdc-ripple/index';
import {MDCLineRipple} from '../../../packages/mdc-line-ripple/index';
import {MDCFloatingLabel} from '../../../packages/mdc-floating-label/index';
import {MDCNotchedOutline} from '../../../packages/mdc-notched-outline/index';
import {
  MDCTextField, MDCTextFieldFoundation, MDCTextFieldHelperText, MDCTextFieldCharacterCounter, MDCTextFieldIcon,
} from '../../../packages/mdc-textfield/index';
import {cssClasses as helperTextCssClasses} from '../../../packages/mdc-textfield/helper-text/constants';
import {cssClasses as characterCounterCssClasses} from '../../../packages/mdc-textfield/character-counter/constants';

const {cssClasses} = MDCTextFieldFoundation;

const getFixture = () => bel`
  <label class="mdc-text-field mdc-text-field--with-leading-icon">
    <i class="material-icons mdc-text-field__leading-icon" tabindex="0" role="button">event</i>
    <input type="text" class="mdc-text-field__input" id="my-text-field">
    <label class="mdc-floating-label" for="my-text-field">My Label</label>
    <div class="mdc-line-ripple"></div>
  </label>
`;

const getHelperLineWithHelperText = () => bel`
  <div class="${cssClasses.HELPER_LINE}">
    <div class="${helperTextCssClasses.ROOT}">helper text</div>
  </div>`;

const getHelperLineWithCharacterCounter = () => bel`
  <div class="${cssClasses.HELPER_LINE}">
    <div class="${characterCounterCssClasses.ROOT}">helper text</div>
  </div>`;

suite('MDCTextField');

test('attachTo returns an MDCTextField instance', () => {
  assert.isOk(MDCTextField.attachTo(getFixture()) instanceof MDCTextField);
});

class FakeRipple {
  constructor(root) {
    this.root = root;
    this.destroy = td.func('.destroy');
  }
}

class FakeLineRipple {
  constructor() {
    this.listen = td.func('lineRipple.listen');
    this.unlisten = td.func('lineRipple.unlisten');
    this.destroy = td.func('.destroy');
    this.activate = td.func('lineRipple.activate');
    this.deactivate = td.func('lineRipple.deactivate');
    this.setRippleCenter = td.func('lineRipple.setRippleCenter');
  }
}

class FakeHelperText {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

class FakeCharacterCounter {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

class FakeIcon {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

class FakeLabel {
  constructor() {
    this.destroy = td.func('.destroy');
    this.shake = td.func('.shake');
  }
}

class FakeOutline {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

test('#constructor instantiates a ripple on the root element by default', () => {
  const root = getFixture();
  const component = new MDCTextField(root, undefined, (el) => new FakeRipple(el));
  assert.equal(component.ripple.root, root);
});

test('#constructor does not instantiate a ripple when ${cssClasses.OUTLINED} class is present', () => {
  const root = getFixture();
  root.classList.add(cssClasses.OUTLINED);
  const component = new MDCTextField(root);
  assert.isNull(component.ripple);
});

test('#constructor does not instantiate a ripple when ${cssClasses.TEXTAREA} class is present', () => {
  const root = getFixture();
  root.classList.add(cssClasses.TEXTAREA);
  const component = new MDCTextField(root);
  assert.isNull(component.ripple);
});

test('#constructor when given a `mdc-text-field--box` element, initializes a default ripple when no ' +
     'ripple factory given', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextField(root);
  assert.instanceOf(component.ripple, MDCRipple);
});

test('#constructor instantiates a line ripple on the `.mdc-line-ripple` element if present', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  assert.instanceOf(component.lineRipple_, MDCLineRipple);
});

test('#constructor instantiates a helper text if present', () => {
  const root = getFixture();
  const helperText = getHelperLineWithHelperText();
  document.body.appendChild(root);
  document.body.appendChild(helperText);
  const component = new MDCTextField(root);
  assert.instanceOf(component.helperText_, MDCTextFieldHelperText);
  document.body.removeChild(root);
  document.body.removeChild(helperText);
});

test('#constructor instantiates a character counter if present', () => {
  const root = getFixture();
  const characterCounter = getHelperLineWithCharacterCounter();
  document.body.appendChild(root);
  root.querySelector('input').maxLength = 12;
  document.body.appendChild(characterCounter);
  const component = new MDCTextField(root);
  assert.instanceOf(component.characterCounter_, MDCTextFieldCharacterCounter);
  document.body.removeChild(root);
  document.body.removeChild(characterCounter);
});

test('#constructor instantiates a leading icon if an icon element is present', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  assert.instanceOf(component.leadingIcon_, MDCTextFieldIcon);
  assert.equal(component.trailingIcon_, undefined);
});

test('#constructor instantiates an icon for both icon elements if present', () => {
  const root = getFixture(true);
  root.classList.add('mdc-text-field--with-trailing-icon');
  root.appendChild(bel`<i class="mdc-text-field__trailing-icon material-icons">3d_rotations</i>`);
  const component = new MDCTextField(root);
  assert.instanceOf(component.leadingIcon_, MDCTextFieldIcon);
  assert.instanceOf(component.trailingIcon_, MDCTextFieldIcon);
});

test('#constructor instantiates a trailing icon if the icon is present', () => {
  const root = getFixture(true);
  const leadingIcon = root.querySelector('.mdc-text-field__leading-icon');
  root.removeChild(leadingIcon);
  root.appendChild(bel`<i class="mdc-text-field__trailing-icon material-icons">3d_rotations</i>`);
  root.classList.add('mdc-text-field--with-trailing-icon');
  root.classList.remove('mdc-text-field--with-leading-icon');
  const component = new MDCTextField(root);
  assert.equal(component.leadingIcon_, undefined);
  assert.instanceOf(component.trailingIcon_, MDCTextFieldIcon);
});

test('#constructor instantiates a label on the `.mdc-floating-label` element if present', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  assert.instanceOf(component.label_, MDCFloatingLabel);
});

test('#constructor instantiates an outline on the `.mdc-notched-outline` element if present', () => {
  const root = getFixture();
  root.appendChild(bel`<div class="mdc-notched-outline"></div>`);
  const component = new MDCTextField(root);
  assert.instanceOf(component.outline_, MDCNotchedOutline);
});

test('#constructor handles undefined optional sub-elements gracefully', () => {
  const root = bel`
    <label class="mdc-text-field">
      <input type="text" class="mdc-text-field__input" id="my-text-field">
    </label>
  `;
  assert.doesNotThrow(() => new MDCTextField(root));
});

test('default adapter methods handle sub-elements when present', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  const adapter = component.getDefaultFoundation().adapter_;
  assert.isFalse(adapter.hasClass('foo'));
  assert.equal(adapter.getLabelWidth(), 0);
  assert.doesNotThrow(() => adapter.floatLabel(true));
});

test('default adapter methods handle undefined optional sub-elements gracefully', () => {
  const root = bel`
    <label class="mdc-text-field">
      <input type="text" class="mdc-text-field__input" id="my-text-field">
    </label>
  `;
  const component = new MDCTextField(root);
  const adapter = component.getDefaultFoundation().adapter_;
  assert.equal(adapter.getLabelWidth(), 0);
  assert.isFalse(adapter.hasLabel());
  assert.isFalse(adapter.hasOutline());
  assert.doesNotThrow(() => adapter.floatLabel(true));
  assert.doesNotThrow(() => adapter.shakeLabel(true));
  assert.doesNotThrow(() => adapter.activateLineRipple());
  assert.doesNotThrow(() => adapter.deactivateLineRipple());
  assert.doesNotThrow(() => adapter.setLineRippleTransformOrigin(0));
  assert.doesNotThrow(() => adapter.closeOutline());
  assert.doesNotThrow(() => adapter.notchOutline(0));
});

/**
 * @param {!HTMLElement=} root
 * @return {{
 *   root: HTMLElement,
 *   component: MDCTextField,
 *   foundation: MDCTextFieldFoundation,
 *   adapter: MDCTextFieldAdapter,
 *   outline: MDCNotchedOutline,
 *   icon: MDCTextFieldIcon,
 *   lineRipple: MDCLineRipple,
 *   label: MDCFloatingLabel,
 *   helperText: MDCTextFieldHelperText,
 *   characterCounter: MDCTextFieldCharacterCounter,
 * }}
 */
function setupTest(root = getFixture()) {
  const lineRipple = new FakeLineRipple();
  const helperText = new FakeHelperText();
  const characterCounter = new FakeCharacterCounter();
  const icon = new FakeIcon();
  const label = new FakeLabel();
  const outline = new FakeOutline();

  const component = new MDCTextField(
    root,
    undefined,
    (el) => new FakeRipple(el),
    () => lineRipple,
    () => helperText,
    () => characterCounter,
    () => icon,
    () => label,
    () => outline
  );

  const foundation = component.foundation_;
  const adapter = foundation.adapter_;

  return {root, component, foundation, adapter, lineRipple, helperText, characterCounter, icon, label, outline};
}

test('#destroy cleans up the ripple if present', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextField(root, undefined, (el) => new FakeRipple(el));
  component.destroy();
  td.verify(component.ripple.destroy());
});

test('#destroy cleans up the line ripple if present', () => {
  const {component, lineRipple} = setupTest();
  component.destroy();
  td.verify(lineRipple.destroy());
});

test('#destroy cleans up the helper text if present', () => {
  const root = getFixture();
  const helperTextElement = getHelperLineWithHelperText();
  document.body.appendChild(root);
  document.body.appendChild(helperTextElement);
  const {component, helperText} = setupTest(root);
  component.destroy();
  td.verify(helperText.destroy());
  document.body.removeChild(root);
  document.body.removeChild(helperTextElement);
});

test('#destroy cleans up the character counter if present', () => {
  const root = getFixture();
  const characterCounterElement = getHelperLineWithCharacterCounter();
  document.body.appendChild(root);
  document.body.appendChild(characterCounterElement);
  const {component, characterCounter} = setupTest(root);
  component.destroy();
  td.verify(characterCounter.destroy());
  document.body.removeChild(root);
  document.body.removeChild(characterCounterElement);
});

test('#destroy cleans up the icon if present', () => {
  const {component, icon} = setupTest();
  component.destroy();
  td.verify(icon.destroy());
});

test('#destroy cleans up the label if present', () => {
  const {component, label} = setupTest();
  component.destroy();
  td.verify(label.destroy());
});

test('#destroy cleans up the outline if present', () => {
  const root = getFixture();
  root.appendChild(bel`<div class="mdc-notched-outline"></div>`);
  const {component, outline} = setupTest(root);
  component.destroy();
  td.verify(outline.destroy());
});

test('#destroy handles undefined optional sub-elements gracefully', () => {
  const root = bel`
    <label class="mdc-text-field">
      <input type="text" class="mdc-text-field__input" id="my-text-field">
    </label>
  `;
  const component = new MDCTextField(root);
  assert.doesNotThrow(() => component.destroy());
});

test('#destroy handles undefined optional ripple gracefully', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  component.ripple = null;
  assert.doesNotThrow(() => component.destroy());
});

test('#destroy calls destroy for both icon elements if present', () => {
  const root = getFixture(true);
  root.classList.add('mdc-text-field--with-trailing-icon');
  root.appendChild(bel`<i class="mdc-text-field__trailing-icon material-icons">3d_rotations</i>`);
  const component = new MDCTextField(root);
  component.leadingIcon_.destroy = td.func('leadingIcon_.destroy');
  component.trailingIcon_.destroy = td.func('trailingIcon_.destroy');
  component.destroy();
  td.verify(component.leadingIcon_.destroy());
  td.verify(component.trailingIcon_.destroy());
});

test('#initialSyncWithDOM sets disabled if input element is not disabled', () => {
  const {component} = setupTest();
  component.initialSyncWithDOM();
  assert.isNotOk(component.disabled);
});

test('#focus calls focus on the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-text-field__input');
  input.focus = td.func('focus');
  component.focus();

  td.verify(input.focus(), {times: 1});
});

test('get/set disabled updates the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-text-field__input');
  component.disabled = true;
  assert.isOk(input.disabled);
  component.disabled = false;
  assert.isNotOk(input.disabled);
});

test('get/set disabled updates the component styles', () => {
  const {root, component} = setupTest();
  component.disabled = true;
  assert.isOk(root.classList.contains(cssClasses.DISABLED));
  component.disabled = false;
  assert.isNotOk(root.classList.contains(cssClasses.DISABLED));
});

test('set valid updates the component styles', () => {
  const {root, component} = setupTest();
  component.valid = false;
  assert.isOk(root.classList.contains(cssClasses.INVALID));
  component.valid = true;
  assert.isNotOk(root.classList.contains(cssClasses.INVALID));
});

test('set helperTextContent has no effect when no helper text element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => {
    component.helperTextContent = 'foo';
  });
});

test('set iconAriaLabel has no effect when no icon element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => {
    component.iconAriaLabel = 'foo';
  });
});

test('set iconContent has no effect when no icon element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => {
    component.iconContent = 'foo';
  });
});

test('#adapter.addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('layout calls foundation notchOutline', () => {
  const {component, foundation} = setupTest();
  foundation.notchOutline = td.func('notchOutline');
  component.layout();
  td.verify(foundation.notchOutline(false));
});

test('#adapter.removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('#adapter.registerInputInteractionHandler adds a handler to the input element for a given event', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-text-field__input');
  const handler = td.func('eventHandler');
  component.getDefaultFoundation().adapter_.registerInputInteractionHandler('click', handler);
  domEvents.emit(input, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterInputInteractionHandler removes a handler from the input element for a given event', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-text-field__input');
  const handler = td.func('eventHandler');

  input.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterInputInteractionHandler('click', handler);
  domEvents.emit(input, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.registerTextFieldInteractionHandler adds an event handler for a given event on the root', () => {
  const {root, component} = setupTest();
  const handler = td.func('TextFieldInteractionHandler');
  component.getDefaultFoundation().adapter_.registerTextFieldInteractionHandler('click', handler);
  domEvents.emit(root, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterTextFieldInteractionHandler removes an event handler for a given event from the root', () => {
  const {root, component} = setupTest();
  const handler = td.func('TextFieldInteractionHandler');
  root.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.registerTextFieldInteractionHandler('click', handler);
  domEvents.emit(root, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.registerValidationAttributeChangeHandler creates a working mutation observer', (done) => {
  const {root, component} = setupTest();
  const handler = td.func('ValidationAttributeChangeHandler');
  td.when(handler(td.matchers.contains('required'))).thenDo(() => {
    done();
  });

  component.foundation_.adapter_.registerValidationAttributeChangeHandler(handler);
  root.querySelector('.mdc-text-field__input').required = true;
});

test('#adapter.deregisterValidationAttributeChangeHandler disconnects the passed observer', () => {
  const {component} = setupTest();
  const disconnect = td.func('ValidationDisconnect');
  const observer = {disconnect};

  component.foundation_.adapter_.deregisterValidationAttributeChangeHandler(observer);
  td.verify(disconnect());
});

test('#adapter.getNativeInput returns the component input element', () => {
  const {root, component} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getNativeInput(),
    root.querySelector('.mdc-text-field__input')
  );
});

test('#adapter.activateLineRipple calls the activate method on the line ripple', () => {
  const {component, lineRipple} = setupTest();
  component.getDefaultFoundation().adapter_.activateLineRipple();
  td.verify(lineRipple.activate());
});

test('#adapter.deactivateLineRipple calls the deactivate method on the line ripple', () => {
  const {component, lineRipple} = setupTest();
  component.getDefaultFoundation().adapter_.deactivateLineRipple();
  td.verify(lineRipple.deactivate());
});

test('#adapter.setLineRippleTransformOrigin calls the setRippleCenter method on the line ripple', () => {
  const {component, lineRipple} = setupTest();
  component.getDefaultFoundation().adapter_.setLineRippleTransformOrigin(100);
  td.verify(lineRipple.setRippleCenter(100));
});

test('clicking trailing icon does not focus input', () => {
  const root = getFixture(true);
  root.classList.add('mdc-text-field--with-trailing-icon');
  root.appendChild(bel`<i class="mdc-text-field__trailing-icon material-icons">3d_rotations</i>`);
  const trailingIcon = root.querySelector('.mdc-text-field__trailing-icon');
  const component = new MDCTextField(root);
  document.body.appendChild(root);
  component.root_.click();
  assert.equal(component.input_, document.activeElement, 'input_ should be focused');
  component.input_.blur();
  assert.notEqual(component.input_, document.activeElement, 'ensure input_ was blurred');
  trailingIcon.click();
  assert.notEqual(component.input_, document.activeElement, 'input_ should not be focused');
  document.body.removeChild(root);
});

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCTextFieldFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCTextField(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('get/set value', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.value;
  td.verify(mockFoundation.getValue());
  component.value = 'foo';
  td.verify(mockFoundation.setValue('foo'));
});

test('set leadingIconAriaLabel', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.leadingIconAriaLabel = 'label';
  td.verify(mockFoundation.setLeadingIconAriaLabel('label'));
});

test('set leadingIconContent', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.leadingIconContent = 'label';
  td.verify(mockFoundation.setLeadingIconContent('label'));
});

test('set trailingIconAriaLabel', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.trailingIconAriaLabel = 'label';
  td.verify(mockFoundation.setTrailingIconAriaLabel('label'));
});

test('set trailingIconContent', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.trailingIconContent = 'label';
  td.verify(mockFoundation.setTrailingIconContent('label'));
});

test('get/set valid', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.valid;
  td.verify(mockFoundation.isValid());
  component.valid = true;
  td.verify(mockFoundation.setValid(true));
});

test('get/set required', () => {
  const {component} = setupMockFoundationTest();
  component.required = true;
  assert.isTrue(component.required);
  component.required = false;
  assert.isFalse(component.required);
});

test('set useNativeValidation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.useNativeValidation = true;
  td.verify(mockFoundation.setUseNativeValidation(true));
});

test('get/set pattern', () => {
  const {component} = setupMockFoundationTest();
  component.pattern = '.{8,}';
  assert.equal(component.pattern, '.{8,}');
  component.pattern = '.*';
  assert.equal(component.pattern, '.*');
});

test('get/set minLength', () => {
  const {component} = setupMockFoundationTest();
  component.minLength = 8;
  assert.equal(component.minLength, 8);
  component.minLength = 0;
  assert.equal(component.minLength, 0);
});

test('get/set maxLength', () => {
  const {component} = setupMockFoundationTest();
  component.maxLength = 10;
  assert.equal(component.maxLength, 10);
  component.maxLength = -1;
  // IE11 has a different value for no maxLength property
  assert.notEqual(component.maxLength, 10);
});

test('get/set min', () => {
  const {component} = setupMockFoundationTest();
  component.min = '8';
  assert.equal(component.min, '8');
  component.min = '0';
  assert.equal(component.min, '0');
});

test('get/set max', () => {
  const {component} = setupMockFoundationTest();
  assert.equal(component.max, '');
  component.max = '10';
  assert.equal(component.max, '10');
  component.max = '';
  assert.equal(component.max, '');
});

test('get/set step', () => {
  const {component} = setupMockFoundationTest();
  component.step = '8';
  assert.equal(component.step, '8');
  component.step = '10';
  assert.equal(component.step, '10');
});
