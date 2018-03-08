/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {assert} from 'chai';

import {MDCRipple} from '../../../packages/mdc-ripple';
import {MDCLineRipple} from '../../../packages/mdc-line-ripple';
import {MDCTextField, MDCTextFieldFoundation, MDCTextFieldHelperText,
  MDCTextFieldIcon, MDCTextFieldLabel, MDCTextFieldOutline} from '../../../packages/mdc-textfield';

const {cssClasses} = MDCTextFieldFoundation;

const getFixture = () => bel`
  <div class="mdc-text-field">
    <i class="material-icons mdc-text-field__icon" tabindex="0">event</i>
    <input type="text" class="mdc-text-field__input" id="my-text-field">
    <label class="mdc-text-field__label" for="my-text-field">My Label</label>
    <div class="mdc-line-ripple"></div>
  </div>
`;

suite('MDCTextField');

test('attachTo returns an MDCTextField instance', () => {
  assert.isOk(MDCTextField.attachTo(getFixture()) instanceof MDCTextField);
});

class FakeRipple {
  constructor(root) {
    this.root = root;
    this.layout = td.func('.layout');
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

class FakeIcon {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

class FakeLabel {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

class FakeOutline {
  constructor() {
    this.createRipple = td.function('.createRipple');
    this.destroy = td.func('.destroy');
  }
}

test('#constructor when given a `mdc-text-field--box` element instantiates a ripple on the root element', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextField(root, undefined, (el) => new FakeRipple(el));
  assert.equal(component.ripple.root, root);
});

test('#constructor when given a `mdc-text-field--outlined` element instantiates a ripple on the ' +
     'outline element', () => {
  const root = bel`
    <div class="mdc-text-field mdc-text-field--outlined">
      <input type="text" class="mdc-text-field__input" id="my-text-field">
      <label class="mdc-text-field__label" for="my-text-field">My Label</label>
      <div class="mdc-text-field__outline"></div>
      <div class="mdc-text-field__idle-outline"></div>
    </div>
  `;
  const outline = root.querySelector('.mdc-text-field__outline');
  const component = new MDCTextField(root, undefined, (el) => new FakeRipple(el));
  assert.equal(component.ripple.root, outline);
});

test('#constructor sets the ripple property to `null` when not given a `mdc-text-field--box` nor ' +
     'a `mdc-text-field--outlined` subelement', () => {
  const component = new MDCTextField(getFixture());
  assert.isNull(component.ripple);
});

test('#constructor when given a `mdc-text-field--box` element, initializes a default ripple when no ' +
     'ripple factory given', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextField(root);
  assert.instanceOf(component.ripple, MDCRipple);
});

test('#constructor when given a `mdc-text-field--outlined` element, initializes a default ripple when no ' +
     'ripple factory given', () => {
  const root = bel`
    <div class="mdc-text-field mdc-text-field--outlined">
      <input type="text" class="mdc-text-field__input" id="my-text-field">
      <label class="mdc-text-field__label" for="my-text-field">My Label</label>
      <div class="mdc-text-field__outline"></div>
      <div class="mdc-text-field__idle-outline"></div>
    </div>
  `;
  const component = new MDCTextField(root);
  assert.instanceOf(component.ripple, MDCRipple);
});

test('#constructor instantiates a line ripple on the `.mdc-line-ripple` element if present', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  assert.instanceOf(component.lineRipple_, MDCLineRipple);
});

const getHelperTextElement = () => bel`<p id="helper-text">helper text</p>`;

test('#constructor instantiates a helper text on the element with id specified in the input aria-controls' +
  'if present', () => {
  const root = getFixture();
  root.querySelector('.mdc-text-field__input').setAttribute('aria-controls', 'helper-text');
  const helperText = getHelperTextElement();
  document.body.appendChild(helperText);
  const component = new MDCTextField(root);
  assert.instanceOf(component.helperText_, MDCTextFieldHelperText);
  document.body.removeChild(helperText);
});

test('#constructor instantiates an icon on the `.mdc-text-field__icon` element if present', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  assert.instanceOf(component.icon_, MDCTextFieldIcon);
});

test('#constructor instantiates a label on the `.mdc-text-field__label` element if present', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  assert.instanceOf(component.label_, MDCTextFieldLabel);
});

test('#constructor instantiates an outline on the `.mdc-text-field__outline` element if present', () => {
  const root = getFixture();
  root.appendChild(bel`<div class="mdc-text-field__outline"></div>`);
  const component = new MDCTextField(root);
  assert.instanceOf(component.outline_, MDCTextFieldOutline);
});

test('#constructor handles undefined optional sub-elements gracefully', () => {
  const root = bel`
    <div class="mdc-text-field">
      <input type="text" class="mdc-text-field__input" id="my-text-field">
    </div>
  `;
  assert.doesNotThrow(() => new MDCTextField(root));
});

function setupTest(root = getFixture()) {
  const lineRipple = new FakeLineRipple();
  const helperText = new FakeHelperText();
  const icon = new FakeIcon();
  const label = new FakeLabel();
  const outline = new FakeOutline();
  const component = new MDCTextField(
    root,
    undefined,
    (el) => new FakeRipple(el),
    () => lineRipple,
    () => helperText,
    () => icon,
    () => label,
    () => outline
  );
  return {root, component, lineRipple, helperText, icon, label, outline};
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
  root.querySelector('.mdc-text-field__input').setAttribute('aria-controls', 'helper-text');
  const helperTextElement = getHelperTextElement();
  document.body.appendChild(helperTextElement);
  const {component, helperText} = setupTest(root);
  component.destroy();
  td.verify(helperText.destroy());
  document.body.removeChild(helperTextElement);
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
  root.appendChild(bel`<div class="mdc-text-field__outline"></div>`);
  const {component, outline} = setupTest(root);
  component.destroy();
  td.verify(outline.destroy());
});

test('#destroy handles undefined optional sub-elements gracefully', () => {
  const root = bel`
    <div class="mdc-text-field">
      <input type="text" class="mdc-text-field__input" id="my-text-field">
    </div>
  `;
  const component = new MDCTextField(root);
  assert.doesNotThrow(() => component.destroy());
});

test('#initialSyncWithDom sets disabled if input element is not disabled', () => {
  const {component} = setupTest();
  component.initialSyncWithDom();
  assert.isNotOk(component.disabled);
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

test('#layout recomputes all dimensions and positions for the ripple element', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextField(root, undefined, (el) => new FakeRipple(el));
  component.layout();
  td.verify(component.ripple.layout());
});

test('#adapter.addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
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

test('#adapter.getNativeInput returns the component input element', () => {
  const {root, component} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getNativeInput(),
    root.querySelector('.mdc-text-field__input')
  );
});

test('#adapter.isRtl returns true when the root element is in an RTL context' +
    'and false otherwise', () => {
  const wrapper = bel`<div dir="rtl"></div>`;
  const {root, component} = setupTest();
  assert.isFalse(component.getDefaultFoundation().adapter_.isRtl());

  wrapper.appendChild(root);
  document.body.appendChild(wrapper);
  assert.isTrue(component.getDefaultFoundation().adapter_.isRtl());

  document.body.removeChild(wrapper);
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

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCTextFieldFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCTextField(
    root,
    mockFoundation);
  return {root, component, mockFoundation};
}

test('get/set value', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.value;
  td.verify(mockFoundation.getValue());
  component.value = 'foo';
  td.verify(mockFoundation.setValue('foo'));
});

test('get/set valid', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.valid;
  td.verify(mockFoundation.isValid());
  component.valid = true;
  td.verify(mockFoundation.setValid(true));
});

test('get/set required', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.required;
  td.verify(mockFoundation.isRequired());
  component.required = true;
  td.verify(mockFoundation.setRequired(true));
});
