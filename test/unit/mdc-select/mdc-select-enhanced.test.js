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

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {createMockRaf} from '../helpers/raf';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';

import {MDCRipple, MDCRippleFoundation} from '../../../packages/mdc-ripple';
import {MDCSelect} from '../../../packages/mdc-select';
import {cssClasses} from '../../../packages/mdc-select/constants';
import {MDCNotchedOutline} from '../../../packages/mdc-notched-outline';

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

function getFixture() {
  return bel`
    <div class="mdc-select">
      <div class="mdc-select__selected-text"></div>
      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
      <ul class="mdc-list">
        <li class="mdc-list-item mdc-list-item--selected"></li>
        <li class="mdc-list-item" value="orange">          
          Orange
        </li>
        <li class="mdc-list-item" value="apple">
          Apple
        </li> 
      </ul>
      </div>
      <label class="mdc-floating-label">Pick a Food Group</label>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
}

function getOutlineFixture() {
  return bel`
    <div class="mdc-select mdc-select--outlined">
    <div class="mdc-select__selected-text"></div>
      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
      <ul class="mdc-list">
        <li class="mdc-list-item mdc-list-item--selected"></li>
        <li class="mdc-list-item" value="orange">          
          Orange
        </li>
        <li class="mdc-list-item" value="apple">
          Apple
        </li> 
      </ul>
      </div>
      <label class="mdc-floating-label">Pick a Food Group</label>
      <div class="mdc-notched-outline">
        <svg>
          <path class="mdc-notched-outline__path">
        </svg>
      </div>   
      <div class="mdc-notched-outline__idle"/>
    </div>
  `;
}

suite('MDCSelect-Enhanced');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCSelect.attachTo(getFixture()) instanceof MDCSelect);
});

function setupTest(hasOutline = false, hasLabel = true) {
  const bottomLine = new FakeBottomLine();
  const label = new FakeLabel();
  const fixture = hasOutline ? getOutlineFixture() : getFixture();
  const selectedText = fixture.querySelector('.mdc-select__selected-text');
  const labelEl = fixture.querySelector('.mdc-floating-label');
  const bottomLineEl = fixture.querySelector('.mdc-line-ripple');
  const outline = new FakeOutline();

  if (!hasLabel) {
    fixture.removeChild(labelEl);
  }

  const component = new MDCSelect(fixture, /* foundation */ undefined, () => label, () => bottomLine, () => outline);

  return {fixture, selectedText, label, labelEl, bottomLine, bottomLineEl, component, outline};
}

test('#get/setSelectedIndex', () => {
  const {component} = setupTest();
  assert.equal(component.selectedIndex, 0);
  component.selectedIndex = 1;
  assert.equal(component.selectedIndex, 1);
});

test('#get/set disabled', () => {
  const {component} = setupTest();
  assert.isFalse(component.disabled);
  component.disabled = true;
  assert.isTrue(component.disabled);
});

test('#get value', () => {
  const {component} = setupTest();
  assert.equal(component.value, '');
  component.selectedIndex = 2;
  assert.equal(component.value, 'apple');
  component.selectedIndex = 1;
  assert.equal(component.value, 'orange');
});

test('#set value calls foundation.handleChange', () => {
  const {component} = setupTest();
  component.foundation_.handleChange = td.func();
  component.value = 'orange';
  td.verify(component.foundation_.handleChange(), {times: 1});
});

test('#set selectedIndex calls foundation.handleChange', () => {
  const {component} = setupTest();
  component.foundation_.handleChange = td.func();
  component.selectedIndex = 1;
  td.verify(component.foundation_.handleChange(), {times: 1});
});

test('#set disabled calls foundation.updateDisabledStyle', () => {
  const {component} = setupTest();
  component.foundation_.updateDisabledStyle = td.func();
  component.disabled = true;
  td.verify(component.foundation_.updateDisabledStyle(true), {times: 1});
});

test('#initialSyncWithDOM sets the selected index if an option has the selected class', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__selected-text"></div>
      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
      <ul class="mdc-list">
        <li class="mdc-list-item"></li>
        <li class="mdc-list-item mdc-list-item--selected" value="orange">          
          Orange
        </li>
        <li class="mdc-list-item" value="apple">
          Apple
        </li> 
      </ul>
      </div>
      <label class="mdc-floating-label">Pick a Food Group</label>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
  const component = new MDCSelect(fixture, /* foundation */ undefined);
  assert.equal(component.selectedIndex, 1);
});

test('#initialSyncWithDOM disables the select if the disabled class is found', () => {
  const fixture = bel`
    <div class="mdc-select mdc-select--disabled">
      <div class="mdc-select__selected-text"></div>
      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
      <ul class="mdc-list">
        <li class="mdc-list-item mdc-list-item--selected"></li>
        <li class="mdc-list-item" value="orange">          
          Orange
        </li>
        <li class="mdc-list-item" value="apple">
          Apple
        </li> 
      </ul>
      </div>
      <label class="mdc-floating-label">Pick a Food Group</label>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.isTrue(component.disabled);
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

test('adapter_.floatLabel does not throw error if label does not exist', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__selected-text"></div>
      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
      <ul class="mdc-list">
        <li class="mdc-list-item mdc-list-item--selected"></li>
        <li class="mdc-list-item" value="orange">          
          Orange
        </li>
        <li class="mdc-list-item" value="apple">
          Apple
        </li> 
      </ul>
      </div>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.floatLabel('foo'));
});

test('adapter.activateBottomLine and adapter.deactivateBottomLine ' +
  'does not throw error if bottomLine does not exist', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__selected-text"></div>
      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
      <ul class="mdc-list">
        <li class="mdc-list-item mdc-list-item--selected"></li>
        <li class="mdc-list-item" value="orange">          
          Orange
        </li>
        <li class="mdc-list-item" value="apple">
          Apple
        </li> 
      </ul>
      </div>
      <label class="mdc-floating-label">Pick a Food Group</label>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.activateBottomLine());
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.deactivateBottomLine());
});


test('#adapter.isRtl returns true when the root element is in an RTL context' +
  'and false otherwise', () => {
  const wrapper = bel`<div dir="rtl"></div>`;
  const {fixture, component} = setupTest();
  assert.isFalse(component.getDefaultFoundation().adapter_.isRtl());

  wrapper.appendChild(fixture);
  document.body.appendChild(wrapper);
  assert.isTrue(component.getDefaultFoundation().adapter_.isRtl());

  document.body.removeChild(wrapper);
});

test('instantiates ripple', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getFixture();
  const raf = createMockRaf();

  const component = MDCSelect.attachTo(fixture);
  raf.flush();

  assert.instanceOf(component.ripple, MDCRipple);
  assert.isTrue(fixture.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
  raf.restore();
});

test(`#constructor instantiates an outline on the ${cssClasses.OUTLINE_SELECTOR} element if present`, () => {
  const root = getFixture();
  root.appendChild(bel`<div class="mdc-notched-outline"></div>`);
  const component = new MDCSelect(root);
  assert.instanceOf(component.outline_, MDCNotchedOutline);
});

test('handles ripple focus properly', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getFixture();
  const raf = createMockRaf();

  MDCSelect.attachTo(fixture);
  raf.flush();

  const selectedText = fixture.querySelector('.mdc-select__selected-text');

  domEvents.emit(selectedText, 'focus');
  raf.flush();

  assert.isTrue(fixture.classList.contains(MDCRippleFoundation.cssClasses.BG_FOCUSED));
  raf.restore();
});

test('#destroy removes the ripple', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getFixture();
  const raf = createMockRaf();

  const component = new MDCSelect(fixture);
  raf.flush();

  assert.isTrue(fixture.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
  component.destroy();
  raf.flush();

  assert.isFalse(fixture.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
  raf.restore();
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
  assert.isUndefined(component.ripple);
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

test('adapter#notchOutline proxies labelWidth and isRtl to the outline', () => {
  const hasOutline = true;
  const {component, outline} = setupTest(hasOutline);
  const isRtl = false;

  component.getDefaultFoundation().adapter_.notchOutline(LABEL_WIDTH, isRtl);
  td.verify(outline.notch(LABEL_WIDTH, isRtl), {times: 1});
});

test('adapter#notchOutline does not proxy values to the outline if it does not exist', () => {
  const hasOutline = false;
  const {component, outline} = setupTest(hasOutline);
  const isRtl = false;

  component.getDefaultFoundation().adapter_.notchOutline(LABEL_WIDTH, isRtl);
  td.verify(outline.notch(LABEL_WIDTH, isRtl), {times: 0});
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

test('change event triggers foundation.handleChange()', () => {
  const {component, selectedText} = setupTest();
  component.foundation_.handleChange = td.func();
  domEvents.emit(selectedText, 'change');
  td.verify(component.foundation_.handleChange(), {times: 1});
});

test('focus event triggers foundation.handleFocus()', () => {
  const {component, selectedText} = setupTest();
  component.foundation_.handleFocus = td.func();
  domEvents.emit(selectedText, 'focus');
  td.verify(component.foundation_.handleFocus(), {times: 1});
});

test('blur event triggers foundation.handleBlur()', () => {
  const {component, selectedText} = setupTest();
  component.foundation_.handleBlur = td.func();
  domEvents.emit(selectedText, 'blur');
  td.verify(component.foundation_.handleBlur(), {times: 1});
});

test('#destroy removes the change handler', () => {
  const {component, selectedText} = setupTest();
  component.foundation_.handleChange = td.func();
  component.destroy();
  domEvents.emit(selectedText, 'change');
  td.verify(component.foundation_.handleChange(), {times: 0});
});

test('#destroy removes the focus handler', () => {
  const {component, selectedText} = setupTest();
  component.foundation_.handleFocus = td.func();
  component.destroy();
  domEvents.emit(selectedText, 'focus');
  td.verify(component.foundation_.handleFocus(), {times: 0});
});

test('#destroy removes the blur handler', () => {
  const {component, selectedText} = setupTest();
  component.foundation_.handleBlur = td.func();
  component.destroy();
  domEvents.emit(selectedText, 'blur');
  td.verify(component.foundation_.handleBlur(), {times: 0});
});

test('mousedown on the select sets the line ripple origin', () => {
  const {bottomLine, fixture} = setupTest();
  const event = document.createEvent('MouseEvent');
  const clientX = 200;
  const clientY = 200;
  // IE11 mousedown event.
  event.initMouseEvent('mousedown', true, true, window, 0, 0, 0, clientX, clientY, false, false, false, false, 0, null);
  fixture.querySelector('.mdc-select__selected-text').dispatchEvent(event);

  td.verify(bottomLine.setRippleCenter(200), {times: 1});
});

test('mousedown on the select does nothing if the it does not have a lineRipple', () => {
  const hasOutline = true;
  const {bottomLine, fixture} = setupTest(hasOutline);
  const event = document.createEvent('MouseEvent');
  const clientX = 200;
  const clientY = 200;
  // IE11 mousedown event.
  event.initMouseEvent('mousedown', true, true, window, 0, 0, 0, clientX, clientY, false, false, false, false, 0, null);
  fixture.querySelector('.mdc-select__selected-text').dispatchEvent(event);

  td.verify(bottomLine.setRippleCenter(200), {times: 0});
});

test('#destroy removes the mousedown listener', () => {
  const {bottomLine, component, fixture} = setupTest();
  const event = document.createEvent('MouseEvent');
  const clientX = 200;
  const clientY = 200;

  component.destroy();
  // IE11 mousedown event.
  event.initMouseEvent('mousedown', true, true, window, 0, 0, 0, clientX, clientY, false, false, false, false, 0, null);
  fixture.querySelector('.mdc-select__selected-text').dispatchEvent(event);

  td.verify(bottomLine.setRippleCenter(200), {times: 0});
});
