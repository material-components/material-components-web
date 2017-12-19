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
import {MDCTextField, MDCTextFieldFoundation, MDCTextFieldBottomLine,
  MDCTextFieldHelperText, MDCTextFieldIcon, MDCTextFieldLabel} from '../../../packages/mdc-textfield';

const {cssClasses} = MDCTextFieldFoundation;

const getFixture = () => bel`
  <div class="mdc-text-field">
    <i class="material-icons mdc-text-field__icon" tabindex="0">event</i>
    <input type="text" class="mdc-text-field__input" id="my-text-field">
    <label class="mdc-text-field__label" for="my-text-field">My Label</label>
    <div class="mdc-text-field__bottom-line"></div>
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

class FakeBottomLine {
  constructor() {
    this.listen = td.func('bottomLine.listen');
    this.unlisten = td.func('bottomLine.unlisten');
    this.destroy = td.func('.destroy');
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

test('#constructor when given a `mdc-text-field--box` element instantiates a ripple on the root element', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextField(root, undefined, (el) => new FakeRipple(el));
  assert.equal(component.ripple.root, root);
});

test('#constructor sets the ripple property to `null` when given a non `mdc-text-field--box` element', () => {
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

test('#constructor instantiates a bottom line on the `.mdc-text-field__bottom-line` element if present', () => {
  const root = getFixture();
  const component = new MDCTextField(root);
  assert.instanceOf(component.bottomLine_, MDCTextFieldBottomLine);
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

function setupTest(root = getFixture()) {
  const bottomLine = new FakeBottomLine();
  const helperText = new FakeHelperText();
  const icon = new FakeIcon();
  const label = new FakeLabel();
  const component = new MDCTextField(
    root,
    undefined,
    (el) => new FakeRipple(el),
    () => bottomLine,
    () => helperText,
    () => icon,
    () => label
  );
  return {root, component, bottomLine, helperText, icon, label};
}

test('#destroy cleans up the ripple if present', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextField(root, undefined, (el) => new FakeRipple(el));
  component.destroy();
  td.verify(component.ripple.destroy());
});

test('#destroy cleans up the bottom line if present', () => {
  const {component, bottomLine} = setupTest();
  component.destroy();
  td.verify(bottomLine.destroy());
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

test('#destroy accounts for ripple nullability', () => {
  const component = new MDCTextField(getFixture());
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

test('#adapter.registerBottomLineEventHandler adds event listener to bottom line', () => {
  const {component, bottomLine} = setupTest();
  const handler = () => {};
  component.getDefaultFoundation().adapter_.registerBottomLineEventHandler('evt', handler);
  td.verify(bottomLine.listen('evt', handler));
});

test('#adapter.deregisterBottomLineEventHandler removes event listener for "transitionend" from bottom line', () => {
  const {component, bottomLine} = setupTest();
  const handler = () => {};
  component.getDefaultFoundation().adapter_.deregisterBottomLineEventHandler('evt', handler);
  td.verify(bottomLine.unlisten('evt', handler));
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
