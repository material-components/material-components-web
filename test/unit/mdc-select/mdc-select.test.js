/**
 * @license
 * Copyright 2018 Google Inc.
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

import {assert, expect} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {install as installClock} from '../helpers/clock';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';

import {MDCRipple, MDCRippleFoundation} from '../../../packages/mdc-ripple/index';
import {MDCSelect} from '../../../packages/mdc-select/index';
import {cssClasses, strings} from '../../../packages/mdc-select/constants';
import {MDCNotchedOutline} from '../../../packages/mdc-notched-outline/index';
import {MDCMenu, MDCMenuFoundation} from '../../../packages/mdc-menu/index';
import {MDCMenuSurfaceFoundation} from '../../../packages/mdc-menu-surface/index';
import {MDCSelectFoundation} from '../../../packages/mdc-select/foundation';
import {MDCSelectIcon} from '../../../packages/mdc-select/icon';

const LABEL_WIDTH = 100;

class FakeLabel {
  constructor() {
    this.float = td.func('label.float');
    this.getWidth = td.func('label.getWidth');

    td.when(this.getWidth()).thenReturn(LABEL_WIDTH);
  }
}

class FakeBottomLine {
  constructor() {
    this.activate = td.func('bottomLine.activate');
    this.deactivate = td.func('bottomLine.deactivate');
    this.setRippleCenter = td.func('bottomLine.setRippleCenter');
  }
}

class FakeOutline {
  constructor() {
    this.destroy = td.func('.destroy');
    this.notch = td.func('.notch');
    this.closeNotch = td.func('.closeNotch');
  }
}

class FakeMenu {
  constructor() {
    this.destroy = td.func('.destroy');
    this.items = [];
    this.hoistMenuToBody = td.func('.hoistMenuToBody');
    this.setAnchorElement = td.func('.setAnchorElement');
    this.setAnchorCorner = td.func('.setAnchorCorner');
    this.listen = td.func('.listen');
    this.unlisten = td.func('.listen');
  }
}

class FakeIcon {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

class FakeHelperText {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

function getFixture() {
  return bel`
    <div class="mdc-select mdc-select--with-leading-icon">
      <div class="mdc-select__anchor">
        <input type="hidden" name="select">
        <i class="mdc-select__icon material-icons">code</i>
        <div class="mdc-select__selected-text"></div>
        <i class="mdc-select__dropdown-icon"></i>
        <span class="mdc-floating-label">Pick a Food Group</span>
        <div class="mdc-line-ripple"></div>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-list">
          <li class="mdc-list-item" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            Orange
          </li>
          <li class="mdc-list-item" data-value="apple">
            Apple
          </li>
        </ul>
      </div>
    </div>
  `;
}

function getOutlineFixture() {
  return bel`
    <div class="mdc-select mdc-select--outlined mdc-select--with-leading-icon">
      <div class="mdc-select__anchor">
        <input type="hidden" name="select">
        <i class="mdc-select__icon material-icons">code</i>
        <div class="mdc-select__selected-text"></div>
        <i class="mdc-select__dropdown-icon"></i>
        <div class="mdc-notched-outline">
          <div class="mdc-notched-outline__leading"></div>
          <div class="mdc-notched-outline__notch">
            <span class="mdc-floating-label">Pick a Food Group</span>
          </div>
          <div class="mdc-notched-outline__trailing"></div>
        </div>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-list">
          <li class="mdc-list-item" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            Orange
          </li>
          <li class="mdc-list-item" data-value="apple">
            Apple
          </li>
        </ul>
      </div>
    </div>
  `;
}

function getHelperTextFixture(root = getFixture()) {
  const containerDiv = document.createElement('div');
  root.querySelector('.mdc-select__selected-text').setAttribute('aria-controls', 'test-helper-text');
  containerDiv.appendChild(root);
  containerDiv.appendChild(bel`<p class="mdc-select-helper-text" id="test-helper-text">Hello World</p>`);
  return containerDiv;
}

function setupTest(hasOutline = false, hasLabel = true, hasMockFoundation = false,
  hasMockMenu = true, hasHelperText = false) {
  // Clean up: Remove all menu elements from DOM first.
  const menuEls = document.querySelectorAll(strings.MENU_SELECTOR);
  [].forEach.call(menuEls, (el) => el.parentElement.removeChild(el));

  const bottomLine = new FakeBottomLine();
  const label = new FakeLabel();
  const fixture = hasOutline ? getOutlineFixture() : getFixture();
  const anchor = fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR);
  const container = hasHelperText ? getHelperTextFixture(fixture) : null;
  const selectedText = fixture.querySelector(strings.SELECTED_TEXT_SELECTOR);
  const labelEl = fixture.querySelector(strings.LABEL_SELECTOR);
  const bottomLineEl = fixture.querySelector(strings.LINE_RIPPLE_SELECTOR);
  const menuSurface = fixture.querySelector(strings.MENU_SELECTOR);
  const MockFoundationConstructor = td.constructor(MDCSelectFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const mockMenu = new FakeMenu();

  const outline = new FakeOutline();
  const icon = new FakeIcon();
  const helperText = new FakeHelperText();

  if (!hasLabel) {
    labelEl.parentElement.removeChild(labelEl);
  }

  if (container) {
    document.body.appendChild(container);
  }

  const component = new MDCSelect(fixture,
    hasMockFoundation ? mockFoundation : undefined,
    () => label,
    () => bottomLine,
    () => outline,
    hasMockMenu ? () => mockMenu : (el) => new MDCMenu(el),
    () => icon,
    () => helperText);

  return {fixture, anchor, selectedText, label, labelEl, bottomLine, bottomLineEl,
    component, outline, menuSurface, mockFoundation, mockMenu, icon, helperText, container};
}

function setupWithMockFoundation() {
  return setupTest(false, true, true);
}

suite('MDCSelect');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCSelect.attachTo(getFixture()) instanceof MDCSelect);
});

test('#get/setSelectedIndex', () => {
  const hasMockFoundation = false;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  assert.equal(component.selectedIndex, -1);
  component.selectedIndex = 1;
  assert.equal(component.selectedIndex, 1);
  menuSurface.parentElement.removeChild(menuSurface);
});

test('#get/setSelectedIndex 2x removes previously selected element', () => {
  const hasMockFoundation = false;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  assert.equal(component.selectedIndex, -1);
  component.selectedIndex = 1;
  component.selectedIndex = 2;
  assert.equal(component.selectedIndex, 2);
  assert.equal(menuSurface.querySelectorAll('.mdc-list-item--selected').length, 1);
  menuSurface.parentElement.removeChild(menuSurface);
});

test('#get/set disabled', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  component.disabled = true;
  td.verify(mockFoundation.setDisabled(true), {times: 1});
  component.disabled = false;
  td.verify(mockFoundation.setDisabled(false), {times: 2}); // called once at initialization, once when setting to false
});

test('#get/set required true', () => {
  const {fixture, component, selectedText} = setupTest();
  assert.isFalse(component.required);

  component.required = true;
  assert.isTrue(component.required);
  assert.isTrue(fixture.classList.contains(cssClasses.REQUIRED));
  assert.strictEqual(selectedText.getAttribute('aria-required'), 'true');
});

test('#get/set required false', () => {
  const {fixture, component, selectedText} = setupTest();
  assert.isFalse(component.required);

  component.required = false;
  assert.isFalse(component.required);
  assert.isFalse(fixture.classList.contains(cssClasses.REQUIRED));
  assert.strictEqual(selectedText.getAttribute('aria-required'), 'false');
});

test('#get value', () => {
  const hasMockFoundation = false;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  assert.equal(component.value, '');
  component.selectedIndex = 2;
  assert.equal(component.value, 'apple');
  component.selectedIndex = 1;
  assert.equal(component.value, 'orange');
  menuSurface.parentElement.removeChild(menuSurface);
});

test('#set value calls foundation.setValue', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  component.value = 'orange';
  td.verify(mockFoundation.setValue('orange'), {times: 1});
});

test('#get valid forwards to foundation', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

  component.valid;
  td.verify(mockFoundation.isValid());
});

test('#set valid forwards to foundation', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

  component.valid = false;
  td.verify(mockFoundation.setValid(false));
  component.valid = true;
  td.verify(mockFoundation.setValid(true));
});

test('#get selectedIndex calls foundation.getSelectedIndex', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  component.selectedIndex;
  td.verify(mockFoundation.getSelectedIndex(), {times: 1});
});

test('#set selectedIndex calls foundation.setSelectedIndex', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  component.selectedIndex = 1;
  td.verify(mockFoundation.setSelectedIndex(1, /** closeMenu */ true), {times: 1});
});

test('#set disabled calls foundation.setDisabled', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  component.disabled = true;
  td.verify(mockFoundation.setDisabled(true), {times: 1});
});

test('#set leadingIconAriaLabel calls foundation.setLeadingIconAriaLabel', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  component.leadingIconAriaLabel = true;
  td.verify(mockFoundation.setLeadingIconAriaLabel(true), {times: 1});
});

test('#set leadingIconContent calls foundation.setLeadingIconAriaLabel', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {component, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  component.leadingIconContent = 'hello_world';
  td.verify(mockFoundation.setLeadingIconContent('hello_world'), {times: 1});
});

test('#set helperTextContent calls foundation.setHelperTextContent', () => {
  const {component} = setupTest();
  component.foundation_.setHelperTextContent = td.func();
  component.helperTextContent = 'hello_world';
  td.verify(component.foundation_.setHelperTextContent('hello_world'), {times: 1});
});

test('#initialSyncWithDOM sets the selected index if an option has the selected class', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__anchor">
        <div class="mdc-select__selected-text"></div>
        <label class="mdc-floating-label">Pick a Food Group</label>
        <div class="mdc-line-ripple"></div>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-list">
          <li class="mdc-list-item" data-value=""></li>
          <li class="mdc-list-item mdc-list-item--selected" data-value="orange">
            Orange
          </li>
          <li class="mdc-list-item" data-value="apple">
            Apple
          </li>
        </ul>
      </div>
    </div>
  `;
  const component = new MDCSelect(fixture, /* foundation */ undefined);
  assert.equal(component.selectedIndex, 1);
});

test('#initialSyncWithDOM disables the select if the disabled class is found', () => {
  const fixture = bel`
    <div class="mdc-select mdc-select--disabled">
      <div class="mdc-select__anchor">
        <div class="mdc-select__selected-text"></div>
        <label class="mdc-floating-label">Pick a Food Group</label>
        <div class="mdc-line-ripple"></div>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-list">
          <li class="mdc-list-item mdc-list-item--selected" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            Orange
          </li>
          <li class="mdc-list-item" data-value="apple">
            Apple
          </li>
        </ul>
      </div>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.isTrue(component.disabled);
});

test('instantiates ripple', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getFixture();
  const clock = installClock();

  const component = MDCSelect.attachTo(fixture);
  clock.runToFrame();

  assert.instanceOf(component.ripple_, MDCRipple);
  const anchor = fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR);
  assert.isTrue(anchor.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
});

test(`#constructor instantiates an outline on the ${cssClasses.OUTLINE_SELECTOR} element if present`, () => {
  const root = getOutlineFixture();
  const component = new MDCSelect(root);
  assert.instanceOf(component.outline_, MDCNotchedOutline);
});

test('handles ripple focus properly', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getFixture();
  const clock = installClock();

  MDCSelect.attachTo(fixture);
  clock.runToFrame();

  const selectedText = fixture.querySelector('.mdc-select__selected-text');

  domEvents.emit(selectedText, 'focus');
  clock.runToFrame();

  const anchor = fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR);
  assert.isTrue(anchor.classList.contains(MDCRippleFoundation.cssClasses.BG_FOCUSED));
});

test('#destroy removes the ripple', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getFixture();
  const clock = installClock();

  const component = new MDCSelect(fixture);
  clock.runToFrame();

  const anchor = fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR);

  assert.isTrue(anchor.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
  component.destroy();
  clock.runToFrame();
  assert.isFalse(anchor.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
});

test('#destroy cleans up the outline if present', () => {
  const {component, outline} = setupTest();
  component.outline_ = outline;
  component.destroy();
  td.verify(outline.destroy());
});

test(`does not instantiate ripple when ${cssClasses.OUTLINED} class is present`, () => {
  const hasOutline = true;
  const {component} = setupTest(hasOutline);
  assert.isUndefined(component.ripple_);
  assert.doesNotThrow(
    () => component.destroy());
});

test('adapter#addClass adds a class to the root element', () => {
  const {component, fixture} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(fixture.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {component, fixture} = setupTest();
  fixture.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(fixture.classList.contains('foo'));
});

test('adapter#hasClass returns true if a class exists on the root element', () => {
  const {component, fixture} = setupTest();
  fixture.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#floatLabel does not throw error if label does not exist', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__anchor">
        <div class="mdc-select__selected-text"></div>
        <div class="mdc-line-ripple"></div>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-list">
          <li class="mdc-list-item mdc-list-item--selected" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            Orange
          </li>
          <li class="mdc-list-item" data-value="apple">
            Apple
          </li>
        </ul>
      </div>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.floatLabel('foo'));
});

test('adapter#activateBottomLine and adapter.deactivateBottomLine ' +
  'does not throw error if bottomLine does not exist', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__anchor">
        <div class="mdc-select__selected-text"></div>
        <label class="mdc-floating-label">Pick a Food Group</label>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-list">
          <li class="mdc-list-item mdc-list-item--selected" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            Orange
          </li>
          <li class="mdc-list-item" data-value="apple">
            Apple
          </li>
        </ul>
      </div>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.activateBottomLine());
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.deactivateBottomLine());
});

test('adapter#floatLabel adds a class to the label', () => {
  const {component, label} = setupTest();

  component.getDefaultFoundation().adapter_.floatLabel('foo');
  td.verify(label.float('foo'));
});

test('adapter#activateBottomLine adds active class to the bottom line', () => {
  const {component, bottomLine} = setupTest();

  component.getDefaultFoundation().adapter_.activateBottomLine();
  td.verify(bottomLine.activate());
});

test('adapter#deactivateBottomLine removes active class from the bottom line', () => {
  const {component, bottomLine} = setupTest();

  component.getDefaultFoundation().adapter_.deactivateBottomLine();
  td.verify(bottomLine.deactivate());
});

test('adapter#notchOutline proxies labelWidth to the outline', () => {
  const hasOutline = true;
  const {component, outline} = setupTest(hasOutline);

  component.getDefaultFoundation().adapter_.notchOutline(LABEL_WIDTH);
  td.verify(outline.notch(LABEL_WIDTH), {times: 1});
});

test('adapter#notchOutline does not proxy values to the outline if it does not exist', () => {
  const hasOutline = false;
  const {component, outline} = setupTest(hasOutline);

  component.getDefaultFoundation().adapter_.notchOutline(LABEL_WIDTH);
  td.verify(outline.notch(LABEL_WIDTH), {times: 0});
});

test('adapter#closeOutline closes the outline if there is an outline', () => {
  const hasOutline = true;
  const {component, outline} = setupTest(hasOutline);
  const adapter = component.getDefaultFoundation().adapter_;
  td.reset();
  adapter.closeOutline();
  td.verify(outline.closeNotch(), {times: 1});
});

test('adapter#closeOutline does nothing if there is no outline', () => {
  const hasOutline = false;
  const {component, outline} = setupTest(hasOutline);
  const adapter = component.getDefaultFoundation().adapter_;

  adapter.closeOutline();
  td.verify(outline.closeNotch(), {times: 0});
});

test('adapter#getLabelWidth returns the width of the label', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getLabelWidth(), LABEL_WIDTH);
});

test('adapter#getLabelWidth returns 0 if the label does not exist', () => {
  const hasOutline = true;
  const hasLabel = false;
  const {component} = setupTest(hasOutline, hasLabel);

  assert.equal(component.getDefaultFoundation().adapter_.getLabelWidth(), 0);
});

test('adapter#getSelectedMenuItem returns the selected element', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

  const index = 1;
  const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
  const adapter = component.getDefaultFoundation().adapter_;
  menuItem.classList.add(cssClasses.SELECTED_ITEM_CLASS);

  expect(adapter.getSelectedMenuItem()).to.equal(menuItem);
});

test('adapter#setAttributeAtIndex sets attribute value correctly', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

  const index = 1;
  const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
  const valueToSet = 'foo';

  assert.notEqual(valueToSet, menuItem.getAttribute(strings.VALUE_ATTR));
  expect(menuItem.getAttribute(strings.VALUE_ATTR)).not.to.equal(valueToSet);
  const adapter = component.getDefaultFoundation().adapter_;
  adapter.setAttributeAtIndex(index, strings.VALUE_ATTR, valueToSet);

  expect(menuItem.getAttribute(strings.VALUE_ATTR)).to.equal(valueToSet);
});

test('adapter#removeAttributeAtIndex removes attribute value correctly', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

  const index = 1;
  const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
  const attrToRemove = 'foo';
  menuItem.setAttribute(attrToRemove, '0');

  const adapter = component.getDefaultFoundation().adapter_;
  adapter.removeAttributeAtIndex(index, attrToRemove);

  expect(menuItem.hasAttribute(attrToRemove)).to.be.false;
});

test('adapter#setSelectedText sets the select text content correctly', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, selectedText} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  const adapter = component.getDefaultFoundation().adapter_;

  const textToSet = 'foo';
  assert.notEqual(textToSet, selectedText.textContent);
  adapter.setSelectedText(textToSet);
  assert.equal(textToSet, selectedText.textContent);
  document.body.removeChild(fixture);
});

test('adapter#getSelectedTextAttr sets the select text content correctly', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, selectedText} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  const adapter = component.getDefaultFoundation().adapter_;

  assert.isFalse(selectedText.hasAttribute('foo'));
  selectedText.setAttribute('foo', '1');
  assert.equal(adapter.getSelectedTextAttr('foo'), '1');
  document.body.removeChild(fixture);
});

test('adapter#setSelectedTextAttr sets the select text content correctly', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, selectedText} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  const adapter = component.getDefaultFoundation().adapter_;

  assert.isFalse(selectedText.hasAttribute('foo'));
  adapter.setSelectedTextAttr('foo', '1');
  assert.equal(selectedText.getAttribute('foo'), '1');
  document.body.removeChild(fixture);
});

test('adapter#openMenu causes the menu to open', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, mockMenu} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  const adapter = component.getDefaultFoundation().adapter_;
  adapter.openMenu();
  assert.isTrue(mockMenu.open);
  document.body.removeChild(fixture);
});

test('adapter#closeMenu causes the menu to close', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, mockMenu} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  const adapter = component.getDefaultFoundation().adapter_;
  adapter.openMenu();
  adapter.closeMenu();
  assert.isFalse(mockMenu.open);
  document.body.removeChild(fixture);
});

test('adapter#isMenuOpen returns true if the menu is opened, and false if not', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  const adapter = component.getDefaultFoundation().adapter_;
  assert.isFalse(adapter.isMenuOpen());
  adapter.openMenu();
  assert.isTrue(adapter.isMenuOpen());
  document.body.removeChild(fixture);
});

test('adapter#setMenuWrapFocus', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, mockMenu} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  const adapter = component.getDefaultFoundation().adapter_;

  adapter.setMenuWrapFocus(false);
  assert.isFalse(mockMenu.wrapFocus);
  adapter.setMenuWrapFocus(true);
  assert.isTrue(mockMenu.wrapFocus);
  document.body.removeChild(fixture);
});

test('adapter#getMenuItemValues returns the correct menu item values', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);

  const adapter = component.getDefaultFoundation().adapter_;
  expect(adapter.getMenuItemValues()).to.eql(['', 'orange', 'apple']);

  document.body.removeChild(fixture);
});

test('adapter#getMenuItemAttr returns the menu item attribute', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

  const index = 1;
  const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
  const adapter = component.getDefaultFoundation().adapter_;

  expect(adapter.getMenuItemAttr(menuItem, strings.VALUE_ATTR)).to.equal('orange');
});

test('adapter#addClassAtIndex adds class correctly', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component} =
    setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);

  const adapter = component.getDefaultFoundation().adapter_;
  const index = 1;
  const menuItem = document.querySelectorAll('.mdc-list-item')[index];

  adapter.addClassAtIndex(index, cssClasses.SELECTED_ITEM_CLASS);
  assert.isTrue(menuItem.classList.contains(cssClasses.SELECTED_ITEM_CLASS));
  document.body.removeChild(fixture);
});

test('adapter#removeClassAtIndex removes class correctly', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component} =
    setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);

  const adapter = component.getDefaultFoundation().adapter_;
  const index = 1;
  const menuItem = document.querySelectorAll('.mdc-list-item')[index];

  adapter.removeClassAtIndex(index, cssClasses.SELECTED_ITEM_CLASS);
  assert.isFalse(menuItem.classList.contains(cssClasses.SELECTED_ITEM_CLASS));
  document.body.removeChild(fixture);
});

test('focus event triggers foundation.handleFocus()', () => {
  const {selectedText, mockFoundation} = setupWithMockFoundation();
  domEvents.emit(selectedText, 'focus');
  td.verify(mockFoundation.handleFocus(), {times: 1});
});

test('blur event triggers foundation.handleBlur()', () => {
  const {selectedText, mockFoundation} = setupWithMockFoundation();
  domEvents.emit(selectedText, 'blur');
  td.verify(mockFoundation.handleBlur(), {times: 1});
});

test('#destroy removes the change handler', () => {
  const {component, selectedText, mockFoundation} = setupWithMockFoundation();
  component.destroy();
  domEvents.emit(selectedText, 'change');
  td.verify(mockFoundation.handleChange(), {times: 0});
});

test('#destroy removes the focus handler', () => {
  const {component, selectedText, mockFoundation} = setupWithMockFoundation();
  component.destroy();
  domEvents.emit(selectedText, 'focus');
  td.verify(mockFoundation.handleFocus(), {times: 0});
});

test('#destroy removes the blur handler', () => {
  const {component, selectedText, mockFoundation} = setupWithMockFoundation();
  component.destroy();
  domEvents.emit(selectedText, 'blur');
  td.verify(mockFoundation.handleBlur(), {times: 0});
});

test('#destroy removes the click handler', () => {
  const {component, selectedText, mockFoundation} = setupWithMockFoundation();
  component.destroy();
  domEvents.emit(selectedText, 'click');
  td.verify(mockFoundation.handleClick(), {times: 0});
});

test('#destroy calls menu#destroy', () => {
  const {component, mockMenu} = setupTest();
  component.destroy();
  td.verify(mockMenu.destroy(), {times: 1});
});

test(`#destroy removes the listener for ${MDCMenuFoundation.strings.SELECTED_EVENT} event`, () => {
  const hasMockFoundation = false;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, mockFoundation, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation,
    hasMockMenu);
  document.body.appendChild(fixture);
  component.destroy();

  const evtType = MDCMenuFoundation.strings.SELECTED_EVENT;
  const detail = {index: 1};
  let evt;
  if (typeof CustomEvent === 'function') {
    evt = new CustomEvent(evtType, {
      detail,
      bubbles: false,
    });
  } else {
    evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(evtType, false, false, detail);
  }
  menuSurface.dispatchEvent(evt);
  td.verify(mockFoundation.setSelectedIndex(1), {times: 0});

  document.body.removeChild(fixture);
});

test('#destroy removes the click listener', () => {
  const {component, selectedText} = setupTest();
  const clientX = 200;
  component.foundation_.handleClick = td.func();
  component.destroy();
  domEvents.emit(selectedText, 'click', {clientX});
  td.verify(component.foundation_.handleClick(200), {times: 0});
});

test('click on the selectedText calls foundation.handleClick()', () => {
  const {component, selectedText} = setupTest();
  const clientX = 200;
  component.foundation_.handleClick = td.func();
  domEvents.emit(selectedText, 'click', {clientX});
  td.verify(component.foundation_.handleClick(200), {times: 1});
});

test('click on the selectedText focuses on the selectedText element', () => {
  const {selectedText} = setupTest();
  const clientX = 200;
  selectedText.focus = td.func();
  domEvents.emit(selectedText, 'click', {clientX});
  td.verify(selectedText.focus(), {times: 1});
});

test('menu surface opened event causes the first element (if not element is selected) to be focused', () => {
  const hasMockFoundation = false;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  component.selectedIndex = -1;

  const event = document.createEvent('Event');
  event.initEvent(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, false, true);
  menuSurface.dispatchEvent(event);

  assert.equal(document.activeElement, menuSurface.querySelector('.mdc-list-item'));
  document.body.removeChild(fixture);
});

test('menu surface opened event handler calls Foundation#handleMenuOpened', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, mockFoundation, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);

  const event = document.createEvent('Event');
  event.initEvent(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, false, true);
  menuSurface.dispatchEvent(event);
  td.verify(mockFoundation.handleMenuOpened(), {times: 1});

  document.body.removeChild(fixture);
});

test('menu surface opened event causes selected element to be focused', () => {
  const hasMockFoundation = false;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, component, menuSurface} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  component.selectedIndex = 1;
  const event = document.createEvent('Event');
  event.initEvent(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, false, true);
  menuSurface.dispatchEvent(event);

  assert.equal(document.activeElement, menuSurface.querySelector('.mdc-list-item--selected'));
  assert.equal(component.selectedIndex, 1);
  document.body.removeChild(fixture);
});

test('menu surface closed event does not call foundation.handleBlur if selected-text is focused', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, menuSurface, mockFoundation, selectedText} = setupTest(hasOutline, hasLabel,
    hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  fixture.querySelector('.mdc-select__selected-text').tabIndex = 0;
  fixture.querySelector('.mdc-select__selected-text').focus();
  const event = document.createEvent('Event');
  event.initEvent(MDCMenuSurfaceFoundation.strings.CLOSED_EVENT, false, true);
  menuSurface.dispatchEvent(event);
  td.verify(mockFoundation.handleMenuClosed(), {times: 1});

  td.verify(mockFoundation.handleBlur(), {times: 0});
  assert.isFalse(selectedText.hasAttribute('aria-expanded'));
  document.body.removeChild(fixture);
});

test('menu surface closed event calls foundation.handleBlur if selected-text is not focused', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, menuSurface, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  document.body.focus();
  const event = document.createEvent('Event');
  event.initEvent(MDCMenuSurfaceFoundation.strings.CLOSED_EVENT, false, true);
  menuSurface.dispatchEvent(event);

  td.verify(mockFoundation.handleBlur(), {times: 1});
  document.body.removeChild(fixture);
});

test('keydown event is added to selected-text when initialized', () => {
  const {fixture, mockFoundation} = setupWithMockFoundation();
  document.body.appendChild(fixture);
  domEvents.emit(fixture.querySelector('.mdc-select__selected-text'), 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.anything()), {times: 1});
  document.body.removeChild(fixture);
});

test('keydown event is removed from selected-text when destroyed', () => {
  const {fixture, mockFoundation, component} = setupWithMockFoundation();
  document.body.appendChild(fixture);
  component.destroy();
  domEvents.emit(fixture.querySelector('.mdc-select__selected-text'), 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.anything()), {times: 0});
  document.body.removeChild(fixture);
});

test('menu surface selected event causes the select to update', () => {
  const hasMockFoundation = true;
  const hasMockMenu = false;
  const hasOutline = false;
  const hasLabel = true;
  const {fixture, menuSurface, mockFoundation} = setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
  document.body.appendChild(fixture);
  const evtType = MDCMenuFoundation.strings.SELECTED_EVENT;
  const detail = {index: 1};
  let evt;
  if (typeof CustomEvent === 'function') {
    evt = new CustomEvent(evtType, {
      detail,
      bubbles: false,
    });
  } else {
    evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(evtType, false, false, detail);
  }
  menuSurface.dispatchEvent(evt);
  td.verify(mockFoundation.setSelectedIndex(1, /** closeMenu */ true), {times: 1});

  document.body.removeChild(fixture);
});

test('#constructor instantiates a leading icon if an icon element is present', () => {
  const root = getFixture();
  const component = new MDCSelect(root);
  assert.instanceOf(component.leadingIcon_, MDCSelectIcon);
  assert.isTrue(root.classList.contains(cssClasses.WITH_LEADING_ICON));
});

test('#constructor instantiates the helper text if present', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasLabel = true;
  const hasOutline = false;
  const hasHelperText = true;
  const {container, component} = setupTest(hasLabel, hasOutline, hasMockFoundation, hasMockMenu,
    hasHelperText);

  assert.instanceOf(component.helperText_, FakeHelperText);
  document.body.removeChild(container);
});

test('#constructor does not instantiate the helper text if the aria-controls id does not match an element', () => {
  const containerDiv = getHelperTextFixture();
  containerDiv.querySelector('.mdc-select-helper-text').id = 'hello-world';
  document.body.appendChild(containerDiv);

  const component = new MDCSelect(containerDiv.querySelector('.mdc-select'));

  assert.isUndefined(component.helperText_);
  document.body.removeChild(containerDiv);
});

test('#destroy destroys the helper text if it exists', () => {
  const hasMockFoundation = true;
  const hasMockMenu = true;
  const hasLabel = true;
  const hasOutline = false;
  const hasHelperText = true;
  const {container, helperText, component} = setupTest(hasLabel, hasOutline, hasMockFoundation, hasMockMenu,
    hasHelperText);

  component.destroy();
  td.verify(helperText.destroy(), {times: 1});
  document.body.removeChild(container);
});
