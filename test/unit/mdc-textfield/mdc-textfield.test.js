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
import {MDCTextfield, MDCTextfieldFoundation} from '../../../packages/mdc-textfield';

const {cssClasses, strings} = MDCTextfieldFoundation;

const getFixture = () => bel`
  <div class="mdc-textfield">
    <input type="text" class="mdc-textfield__input" id="my-textfield">
    <label class="mdc-textfield__label" for="my-textfield">My Label</label>
  </div>
`;

suite('MDCTextfield');

test('attachTo returns an MDCTextfield instance', () => {
  assert.isOk(MDCTextfield.attachTo(getFixture()) instanceof MDCTextfield);
});

const getHelptext = () => bel`<p id="helptext">help text</p>`;

test('#constructor assigns helptextElement to the id specified in the input aria-controls if present', () => {
  const root = getFixture();
  root.querySelector('.mdc-textfield__input').setAttribute('aria-controls', 'helptext');
  const helptext = getHelptext();
  document.body.appendChild(helptext);
  const component = new MDCTextfield(root);
  assert.equal(component.helptextElement, helptext);
  document.body.removeChild(helptext);
});

class FakeRipple {
  constructor(root) {
    this.root = root;
    this.layout = td.func('.layout');
    this.destroy = td.func('.destroy');
  }
}

test('#constructor when given a `mdc-textfield--box` element instantiates a ripple on the root element', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextfield(root, undefined, (el) => new FakeRipple(el));
  assert.equal(component.ripple.root, root);
});

test('#constructor sets the ripple property to `null` when given a non `mdc-textfield--box` element', () => {
  const component = new MDCTextfield(getFixture());
  assert.isNull(component.ripple);
});

test('#constructor when given a `mdc-textfield--box` element, initializes a default ripple when no ' +
     'ripple factory given', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextfield(root);
  assert.instanceOf(component.ripple, MDCRipple);
});

test('#destroy cleans up the ripple if present', () => {
  const root = getFixture();
  root.classList.add(cssClasses.BOX);
  const component = new MDCTextfield(root, undefined, (el) => new FakeRipple(el));
  component.destroy();
  td.verify(component.ripple.destroy());
});

test('#destroy accounts for ripple nullability', () => {
  const component = new MDCTextfield(getFixture());
  assert.doesNotThrow(() => component.destroy());
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTextfield(root);
  return {root, component};
}

test('#initialSyncWithDom sets disabled if input element is not disabled', () => {
  const {component} = setupTest();
  component.initialSyncWithDom();
  assert.isNotOk(component.disabled);
});

test('get/set disabled updates the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-textfield__input');
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

test('#adapter.addClassToLabel adds a class to the label element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClassToLabel('foo');
  assert.isOk(root.querySelector('.mdc-textfield__label').classList.contains('foo'));
});

test('#adapter.addClassToLabel does nothing if no label element present', () => {
  const {root, component} = setupTest();
  root.removeChild(root.querySelector('.mdc-textfield__label'));
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.addClassToLabel('foo'));
});

test('#adapter.removeClassFromLabel removes a class from the label element', () => {
  const {root, component} = setupTest();
  const label = root.querySelector('.mdc-textfield__label');
  label.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromLabel('foo');
  assert.isNotOk(label.classList.contains('foo'));
});

test('#adapter.removeClassFromLabel does nothing if no label element present', () => {
  const {root, component} = setupTest();
  root.removeChild(root.querySelector('.mdc-textfield__label'));
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.removeClassFromLabel('foo'));
});

test('#adapter.registerInputFocusHandler adds a "focus" event handler on the input element', () => {
  const {root, component} = setupTest();
  const handler = td.func('focusHandler');
  component.getDefaultFoundation().adapter_.registerInputFocusHandler(handler);
  domEvents.emit(root.querySelector('.mdc-textfield__input'), 'focus');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterInputFocusHandler removes a "focus" event handler from the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-textfield__input');
  const handler = td.func('focusHandler');
  input.addEventListener('focus', handler);
  component.getDefaultFoundation().adapter_.deregisterInputFocusHandler(handler);
  domEvents.emit(input, 'focus');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.registerInputBlurHandler adds a "blur" event handler on the input element', () => {
  const {root, component} = setupTest();
  const handler = td.func('blurHandler');
  component.getDefaultFoundation().adapter_.registerInputBlurHandler(handler);
  domEvents.emit(root.querySelector('.mdc-textfield__input'), 'blur');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.registerTextFieldInteractionHandler adds a "blur" event handler on the input element', () => {
  const {root, component} = setupTest();
  const handler = td.func('textFieldInteractionHandler');
  component.getDefaultFoundation().adapter_.registerTextFieldInteractionHandler(handler);
  domEvents.emit(root, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterInputBlurHandler removes a "blur" event handler from the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-textfield__input');
  const handler = td.func('blurHandler');
  input.addEventListener('blur', handler);
  component.getDefaultFoundation().adapter_.deregisterInputBlurHandler(handler);
  domEvents.emit(input, 'blur');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.registerInputInputHandler adds an "input" event handler on the input element', () => {
  const {root, component} = setupTest();
  const handler = td.func('inputHandler');
  component.getDefaultFoundation().adapter_.registerInputInputHandler(handler);
  domEvents.emit(root.querySelector('.mdc-textfield__input'), 'input');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterInputInputHandler removes an "input" event handler from the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-textfield__input');
  const handler = td.func('inputHandler');
  input.addEventListener('input', handler);
  component.getDefaultFoundation().adapter_.deregisterInputInputHandler(handler);
  domEvents.emit(input, 'input');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.registerInputKeydownHandler adds a "keydown" event handler on the input element', () => {
  const {root, component} = setupTest();
  const handler = td.func('inputHandler');
  component.getDefaultFoundation().adapter_.registerInputKeydownHandler(handler);
  domEvents.emit(root.querySelector('.mdc-textfield__input'), 'keydown');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterInputInputHandler removes a "keydown" event handler from the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-textfield__input');
  const handler = td.func('keydownHandler');
  input.addEventListener('keydown', handler);
  component.getDefaultFoundation().adapter_.deregisterInputKeydownHandler(handler);
  domEvents.emit(input, 'keydown');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.getNativeInput returns the component input element', () => {
  const {root, component} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getNativeInput(),
    root.querySelector('.mdc-textfield__input')
  );
});

test('#adapter.addClassToHelptext does nothing if no help text element present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.addClassToHelptext('foo'));
});

test('#adapter.addClassToHelptext adds a class to the helptext element when present', () => {
  const {component} = setupTest();
  component.helptextElement = getHelptext();
  component.getDefaultFoundation().adapter_.addClassToHelptext('foo');
  assert.isOk(component.helptextElement.classList.contains('foo'));
});

test('#adapter.removeClassFromHelptext does nothing if no help text element present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.removeClassFromHelptext('foo'));
});

test('#adapter.removeClassFromHelptext removes a class from the helptext element when present', () => {
  const {component} = setupTest();
  const helptext = getHelptext();
  component.helptextElement = helptext;
  helptext.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromHelptext('foo');
  assert.isNotOk(helptext.classList.contains('foo'));
});

test('#adapter.helptextHasClass does nothing if no help text element present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.helptextHasClass('foo'));
});

test('#adapter.helptextHasClass returns whether or not the help text contains a certain class', () => {
  const {component} = setupTest();
  const helptext = getHelptext();
  component.helptextElement = helptext;
  helptext.classList.add('foo');
  assert.isOk(component.getDefaultFoundation().adapter_.helptextHasClass('foo'));
  helptext.classList.remove('foo');
  assert.isNotOk(component.getDefaultFoundation().adapter_.helptextHasClass('foo'));
});

test('#adapter.setHelptextAttr does nothing if no help text element present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.helptextHasClass('foo'));
});

test('#adapter.setHelptextAttr sets an attribute to a certain value on the help text element', () => {
  const {component} = setupTest();
  const helptext = getHelptext();
  component.helptextElement = helptext;
  component.getDefaultFoundation().adapter_.setHelptextAttr('aria-label', 'foo');
  assert.equal(helptext.getAttribute('aria-label'), 'foo');
});

test('#adapter.removeHelptextAttr does nothing if no help text element present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.removeHelptextAttr('aria-label'));
});

test('#adapter.removeHelptextAttr removes an attribute on the help text element', () => {
  const {component} = setupTest();
  const helptext = getHelptext();
  helptext.setAttribute('aria-label', 'foo');
  component.helptextElement = helptext;
  component.getDefaultFoundation().adapter_.removeHelptextAttr('aria-label');
  assert.isNotOk(helptext.hasAttribute('aria-label'));
});

test(`#adapter.notifyLeadingIconAction emits ${strings.LEADING_ICON_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('leadingHandler');

  component.listen(strings.LEADING_ICON_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyLeadingIconAction();

  td.verify(handler(td.matchers.anything()));
});

test(`#adapter.notifyTrailingIconAction emits ${strings.TRAILING_ICON_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('trailingHandler');

  component.listen(strings.TRAILING_ICON_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyTrailingIconAction();

  td.verify(handler(td.matchers.anything()));
});
