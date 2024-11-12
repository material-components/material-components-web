/**
 * @license
 * Copyright 2020 Google Inc.
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

import {MDCMenu, MDCMenuFoundation} from '../../mdc-menu/index';
import {Corner} from '../../mdc-menu-surface/constants';
import {MDCMenuSurfaceFoundation} from '../../mdc-menu-surface/index';
import {MDCNotchedOutline} from '../../mdc-notched-outline/index';
import {MDCRipple, MDCRippleFoundation} from '../../mdc-ripple/index';
import {supportsCssVariables} from '../../mdc-ripple/util';
import {emitEvent} from '../../../testing/dom/events';
import {createFixture, html} from '../../../testing/dom/index';
import {checkNumTimesSpyCalledWithArgs, createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {cssClasses, strings} from '../constants';
import {MDCSelectFoundation} from '../foundation';
import {MDCSelectIcon} from '../icon';
import {MDCSelect} from '../index';

const LABEL_WIDTH = 100;

class FakeLabel {
  float: jasmine.Spy = jasmine.createSpy('label.float');
  getWidth: jasmine.Spy = jasmine.createSpy('label.getWidth');
  setRequired: jasmine.Spy = jasmine.createSpy('label.setRequired');

  constructor() {
    this.getWidth.and.returnValue(LABEL_WIDTH);
  }
}

class FakeBottomLine {
  activate: jasmine.Spy = jasmine.createSpy('bottomLine.activate');
  deactivate: jasmine.Spy = jasmine.createSpy('bottomLine.deactivate');
  setRippleCenter: jasmine.Spy =
      jasmine.createSpy('bottomLine.setRippleCenter');
}

class FakeOutline {
  destroy: jasmine.Spy = jasmine.createSpy('.destroy');
  notch: jasmine.Spy = jasmine.createSpy('.notch');
  closeNotch: jasmine.Spy = jasmine.createSpy('.closeNotch');
}

class FakeMenu {
  destroy: jasmine.Spy = jasmine.createSpy('.destroy');
  items: HTMLElement[] = [];
  selectedIndex: number = -1;
  hoistMenuToBody: jasmine.Spy = jasmine.createSpy('.hoistMenuToBody');
  setAnchorElement: jasmine.Spy = jasmine.createSpy('.setAnchorElement');
  setAnchorCorner: jasmine.Spy = jasmine.createSpy('.setAnchorCorner');
  typeaheadMatchItem: jasmine.Spy = jasmine.createSpy('.typeaheadMatchItem');
  listen: jasmine.Spy = jasmine.createSpy('.listen');
  unlisten: jasmine.Spy = jasmine.createSpy('.listen');
  layout: jasmine.Spy = jasmine.createSpy('.layout');

  open: boolean = false;
  wrapFocus: boolean = false;
  typeaheadInProgress: boolean = false;
}

class FakeIcon {
  destroy: jasmine.Spy = jasmine.createSpy('.destroy');
}

class FakeHelperText {
  destroy: jasmine.Spy = jasmine.createSpy('.destroy');
}

function getFixture() {
  return createFixture(html`
    <div class="mdc-select mdc-select--with-leading-icon">
      <input type="hidden" name="test-input">
      <div class="mdc-select__anchor">
        <span class="mdc-select__ripple"></span>
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5" focusable="false">
            <polygon
                class="mdc-select__dropdown-icon-inactive"
                stroke="none"
                fill-rule="evenodd"
                points="7 10 12 15 17 10">
            </polygon>
            <polygon
                class="mdc-select__dropdown-icon-active"
                stroke="none"
                fill-rule="evenodd"
                points="7 15 12 10 17 15">
            </polygon>
          </svg>
        </span>
        <span class="mdc-floating-label">Pick a Food Group</span>
        <span class="mdc-line-ripple"></span>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-deprecated-list">
          <li class="mdc-deprecated-list-item" data-value="" aria-label="Empty"></li>
          <li class="mdc-deprecated-list-item" data-value="orange" aria-label="Orange">
            <span class="mdc-deprecated-list-item__text">Orange</span>
          </li>
          <li class="mdc-deprecated-list-item" data-value="apple" aria-label="Apple">
            <span class="mdc-deprecated-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
}

function getOutlineFixture() {
  return createFixture(html`
    <div class="mdc-select mdc-select--outlined mdc-select--with-leading-icon">
      <input type="hidden" name="test-input">
      <div class="mdc-select__anchor">
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5" focusable="false">
            <polygon
                class="mdc-select__dropdown-icon-inactive"
                stroke="none"
                fill-rule="evenodd"
                points="7 10 12 15 17 10">
            </polygon>
            <polygon
                class="mdc-select__dropdown-icon-active"
                stroke="none"
                fill-rule="evenodd"
                points="7 15 12 10 17 15">
            </polygon>
          </svg>
        </span>
        <span class="mdc-notched-outline">
          <span class="mdc-notched-outline__leading"></span>
          <span class="mdc-notched-outline__notch">
            <span class="mdc-floating-label">Pick a Food Group</span>
          </span>
          <span class="mdc-notched-outline__trailing"></span>
        </span>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-deprecated-list">
          <li class="mdc-deprecated-list-item" data-value=""></li>
          <li class="mdc-deprecated-list-item" data-value="orange">
            <span class="mdc-deprecated-list-item__text">Orange</span>
          </li>
          <li class="mdc-deprecated-list-item" data-value="apple">
            <span class="mdc-deprecated-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
}

function getHelperTextFixture(root = getFixture()) {
  const containerDiv = document.createElement('div');
  root.querySelector<HTMLElement>(strings.SELECT_ANCHOR_SELECTOR)!.setAttribute(
      'aria-controls', 'test-helper-text');
  containerDiv.appendChild(root);
  containerDiv.appendChild(createFixture(
      html`<p class="mdc-select-helper-text" id="test-helper-text">Hello World</p>`));
  return containerDiv;
}

function setupTest(
    hasOutline = false, hasLabel = true, hasMockFoundation = false,
    hasMockMenu = true, hasHelperText = false) {
  // Clean up: Remove all menu elements from DOM first.
  const menuEls = document.querySelectorAll<HTMLElement>(strings.MENU_SELECTOR);
  [].forEach.call(
      menuEls, (el: HTMLElement) => el.parentElement!.removeChild(el));

  const bottomLine = new FakeBottomLine();
  const label = new FakeLabel();
  const fixture = hasOutline ? getOutlineFixture() : getFixture();
  const anchor =
      fixture.querySelector<HTMLElement>(strings.SELECT_ANCHOR_SELECTOR)!;
  const container = hasHelperText ? getHelperTextFixture(fixture) : null;
  const selectedText =
      fixture.querySelector<HTMLElement>(strings.SELECTED_TEXT_SELECTOR)!;
  const labelEl = fixture.querySelector<HTMLElement>(strings.LABEL_SELECTOR)!;
  const bottomLineEl =
      fixture.querySelector<HTMLElement>(strings.LINE_RIPPLE_SELECTOR)!;
  const menuSurface =
      fixture.querySelector<HTMLElement>(strings.MENU_SELECTOR)!;
  const mockFoundation = createMockFoundation(MDCSelectFoundation);
  const mockMenu = new FakeMenu();

  const outline = new FakeOutline();
  const icon = new FakeIcon();
  const helperText = new FakeHelperText();

  if (!hasLabel) {
    labelEl.parentElement!.removeChild(labelEl);
  }

  if (container) {
    document.body.appendChild(container);
  }

  const component = new MDCSelect(
      fixture, hasMockFoundation ? mockFoundation : undefined, () => label,
      () => bottomLine, () => outline,
      hasMockMenu ? () => mockMenu : (el: HTMLElement) => new MDCMenu(el),
      () => icon, () => helperText);

  return {
    fixture,
    anchor,
    selectedText,
    label,
    labelEl,
    bottomLine,
    bottomLineEl,
    component,
    outline,
    menuSurface,
    mockFoundation,
    mockMenu,
    icon,
    helperText,
    container
  };
}

function setupWithMockFoundation() {
  return setupTest(false, true, true);
}

describe('MDCSelect', () => {
  setUpMdcTestEnvironment();

  it('attachTo returns a component instance', () => {
    expect(MDCSelect.attachTo(getFixture()) instanceof MDCSelect).toBeTruthy();
  });

  it('#get/setSelectedIndex', () => {
    const hasMockFoundation = false;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, menuSurface} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    expect(component.selectedIndex).toEqual(0);
    component.selectedIndex = 1;
    expect(component.selectedIndex).toEqual(1);
    menuSurface.parentElement!.removeChild(menuSurface);
  });

  it('#get/setSelectedIndex 2x removes previously selected element', () => {
    const hasMockFoundation = false;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, menuSurface} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    expect(component.selectedIndex).toEqual(0);
    component.selectedIndex = 1;
    component.selectedIndex = 2;
    expect(component.selectedIndex).toEqual(2);
    expect(menuSurface
               .querySelectorAll<HTMLElement>(
                   '.mdc-deprecated-list-item--selected')
               .length)
        .toEqual(1);
    menuSurface.parentElement!.removeChild(menuSurface);
  });

  it('#get/set disabled', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.disabled = true;
    checkNumTimesSpyCalledWithArgs(mockFoundation.setDisabled, [true], 1);
    expect((component as any).hiddenInput.disabled).toBeTrue();
    component.disabled = false;
    checkNumTimesSpyCalledWithArgs(mockFoundation.setDisabled, [false], 1);
    expect((component as any).hiddenInput.disabled).toBeFalse();
  });

  it('#get/set required true', () => {
    const {fixture, component, anchor} = setupTest();
    expect(component.required).toBe(false);

    component.required = true;
    expect(component.required).toBe(true);
    expect(fixture).toHaveClass(cssClasses.REQUIRED);
    expect(anchor.getAttribute('aria-required')).toBe('true');
  });

  it('#get/set required false', () => {
    const {fixture, component, anchor} = setupTest();
    expect(component.required).toBe(false);

    component.required = false;
    expect(component.required).toBe(false);
    expect(fixture).not.toHaveClass(cssClasses.REQUIRED);
    expect(anchor.getAttribute('aria-required')).toBe('false');
  });

  it('#get value', () => {
    const hasMockFoundation = false;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, menuSurface} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    expect(component.value).toEqual('');
    component.selectedIndex = 2;
    expect(component.value).toEqual('apple');
    component.selectedIndex = 1;
    expect(component.value).toEqual('orange');
    menuSurface.parentElement!.removeChild(menuSurface);
  });

  it('#set value calls foundation.setValue', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.value = 'orange';
    expect(mockFoundation.setValue).toHaveBeenCalledWith('orange');
    expect(mockFoundation.setValue).toHaveBeenCalledTimes(1);
  });

  it('#setValue calls foundation.setValue with params', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.setValue('orange', /** skipNotify */ true);
    expect(mockFoundation.setValue).toHaveBeenCalledWith('orange', true);
  });

  it('#layout calls foundation.layout', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.layout();
    expect(mockFoundation.layout).toHaveBeenCalled();
  });

  it('#layoutOptions calls foundation.layoutOptions and menu.layout', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation, mockMenu} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.layoutOptions();
    expect(mockFoundation.layoutOptions).toHaveBeenCalled();
    expect(mockMenu.layout).toHaveBeenCalled();
  });

  it('#layoutOptions refreshes menu options cache', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component['menuItemValues'] = [];
    component.layoutOptions();
    expect(component['menuItemValues']).toEqual(['', 'orange', 'apple']);
  });

  it('#set useDefaultValidation forwards to foundation', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

    component.useDefaultValidation = false;
    expect(mockFoundation.setUseDefaultValidation).toHaveBeenCalled();
  });

  it('#get valid forwards to foundation', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

    component.valid;
    expect(mockFoundation.isValid).toHaveBeenCalled();
  });

  it('#set valid forwards to foundation', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

    component.valid = false;
    expect(mockFoundation.setValid).toHaveBeenCalledWith(false);
    component.valid = true;
    expect(mockFoundation.setValid).toHaveBeenCalledWith(true);
  });

  it('#get selectedIndex calls foundation.getSelectedIndex', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.selectedIndex;
    expect(mockFoundation.getSelectedIndex).toHaveBeenCalledTimes(1);
  });

  it('#set selectedIndex calls foundation.setSelectedIndex', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.selectedIndex = 1;
    expect(mockFoundation.setSelectedIndex)
        .toHaveBeenCalledWith(1, /** closeMenu */ true);
  });

  it('#setSelectedIndex calls foundation.setSelectedIndex with params', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.setSelectedIndex(1, true);
    expect(mockFoundation.setSelectedIndex)
        .toHaveBeenCalledWith(1, /** closeMenu */ true, /** skipNotify */ true);
  });

  it('#set disabled calls foundation.setDisabled', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.disabled = true;
    expect(mockFoundation.setDisabled).toHaveBeenCalledWith(true);
  });

  it('#set leadingIconAriaLabel calls foundation.setLeadingIconAriaLabel',
     () => {
       const hasMockFoundation = true;
       const hasMockMenu = true;
       const hasOutline = false;
       const hasLabel = true;
       const {component, mockFoundation} =
           setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
       component.leadingIconAriaLabel = 'true';
       expect(mockFoundation.setLeadingIconAriaLabel)
           .toHaveBeenCalledWith('true');
     });

  it('#set leadingIconContent calls foundation.setLeadingIconAriaLabel', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.leadingIconContent = 'hello_world';
    expect(mockFoundation.setLeadingIconContent)
        .toHaveBeenCalledWith('hello_world');
    expect(mockFoundation.setLeadingIconContent).toHaveBeenCalledTimes(1);
  });

  it('#set helperTextContent calls foundation.setHelperTextContent', () => {
    const {component} = setupTest();
    (component as any).foundation.setHelperTextContent = jasmine.createSpy('');
    component.helperTextContent = 'hello_world';
    expect((component as any).foundation.setHelperTextContent)
        .toHaveBeenCalledWith('hello_world');
    expect((component as any).foundation.setHelperTextContent)
        .toHaveBeenCalledTimes(1);
  });

  it('#initialSyncWithDOM sets the selected index and hidden input value' +
         ' if an option has the selected class',
     () => {
       const fixture = createFixture(html`
        <div class="mdc-select">
          <input type="hidden" name="test-input">
          <div class="mdc-select__anchor">
            <span class="mdc-select__ripple"></span>
            <i class="mdc-select__icon material-icons">code</i>
            <span class="mdc-select__selected-text"></span>
            <span class="mdc-select__dropdown-icon">
              <svg
                  width="10px"
                  height="5px"
                  viewBox="7 10 10 5" focusable="false">
                <polygon
                    class="mdc-select__dropdown-icon-inactive"
                    stroke="none"
                    fill-rule="evenodd"
                    points="7 10 12 15 17 10">
                </polygon>
                <polygon
                    class="mdc-select__dropdown-icon-active"
                    stroke="none"
                    fill-rule="evenodd"
                    points="7 15 12 10 17 15">
                </polygon>
              </svg>
            </span>
            <span class="mdc-floating-label">Pick a Food Group</span>
            <span class="mdc-line-ripple"></span>
          </div>

          <div class="mdc-select__menu mdc-menu mdc-menu-surface">
            <ul class="mdc-deprecated-list">
              <li class="mdc-deprecated-list-item" data-value=""></li>
              <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" data-value="orange">
                <span class="mdc-deprecated-list-tem__text">Orange</span>
              </li>
              <li class="mdc-deprecated-list-item" data-value="apple">
                <span class="mdc-deprecated-list-tem__text">Apple</span>
              </li>
            </ul>
          </div>
        </div>
      `);
       const component = new MDCSelect(fixture, /* foundation */ undefined);
       expect(component.selectedIndex).toEqual(1);
       expect((component as any).hiddenInput.value).toEqual('orange');
     });

  it('#initialSyncWithDOM sets value if hidden input has value', () => {
    const fixture = createFixture(html`
      <div class="mdc-select mdc-select--with-leading-icon">
        <input type="hidden" name="test-input" value="orange">
        <div class="mdc-select__anchor">
          <span class="mdc-select__ripple"></span>
          <i class="mdc-select__icon material-icons">code</i>
          <span class="mdc-select__selected-text"></span>
          <span class="mdc-select__dropdown-icon">
            <svg
                width="10px"
                height="5px"
                viewBox="7 10 10 5" focusable="false">
              <polygon
                  class="mdc-select__dropdown-icon-inactive"
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 10 12 15 17 10">
              </polygon>
              <polygon
                  class="mdc-select__dropdown-icon-active"
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 15 12 10 17 15">
              </polygon>
            </svg>
          </span>
          <span class="mdc-floating-label">Pick a Food Group</span>
          <span class="mdc-line-ripple"></span>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface">
          <ul class="mdc-deprecated-list">
            <li class="mdc-deprecated-list-item" data-value=""></li>
            <li class="mdc-deprecated-list-item" data-value="orange">
              <span class="mdc-deprecated-list-item__text">Orange</span>
            </li>
            <li class="mdc-deprecated-list-item" data-value="apple">
              <span class="mdc-deprecated-list-item__text">Apple</span>
            </li>
          </ul>
        </div>
      </div>`);

    const component = new MDCSelect(fixture, /* foundation */ undefined);
    expect(component.selectedIndex).toEqual(1);
  });

  it('#initialSyncWithDOM sets the selected index if empty option has the selected class',
     () => {
       const fixture = createFixture(html`
        <div class="mdc-select">
          <div class="mdc-select__anchor">
            <span class="mdc-select__ripple"></span>
            <i class="mdc-select__icon material-icons">code</i>
            <span class="mdc-select__selected-text"></span>
            <span class="mdc-select__dropdown-icon">
              <svg
                  width="10px"
                  height="5px"
                  viewBox="7 10 10 5" focusable="false">
                <polygon
                    class="mdc-select__dropdown-icon-inactive"
                    stroke="none"
                    fill-rule="evenodd"
                    points="7 10 12 15 17 10">
                </polygon>
                <polygon
                    class="mdc-select__dropdown-icon-active"
                    stroke="none"
                    fill-rule="evenodd"
                    points="7 15 12 10 17 15">
                </polygon>
              </svg>
            </span>
            <span class="mdc-floating-label">Pick a Food Group</span>
            <span class="mdc-line-ripple"></span>
          </div>

          <div class="mdc-select__menu mdc-menu mdc-menu-surface">
            <ul class="mdc-deprecated-list">
              <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" data-value=""></li>
              <li class="mdc-deprecated-list-item" data-value="orange">
                Orange
              </li>
              <li class="mdc-deprecated-list-item" data-value="apple">
                Apple
              </li>
            </ul>
          </div>
        </div>
      `);
       const component = new MDCSelect(fixture, /* foundation */ undefined);
       expect(component.selectedIndex).toEqual(0);
     });

  it('#initialSyncWithDOM disables the select if the disabled class is found',
     () => {
       const fixture = createFixture(html`
    <div class="mdc-select mdc-select--disabled">
      <div class="mdc-select__anchor">
        <span class="mdc-select__ripple"></span>
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5" focusable="false">
            <polygon
                class="mdc-select__dropdown-icon-inactive"
                stroke="none"
                fill-rule="evenodd"
                points="7 10 12 15 17 10">
            </polygon>
            <polygon
                class="mdc-select__dropdown-icon-active"
                stroke="none"
                fill-rule="evenodd"
                points="7 15 12 10 17 15">
            </polygon>
          </svg>
        </span>
        <span class="mdc-floating-label">Pick a Food Group</span>
        <span class="mdc-line-ripple"></span>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-deprecated-list">
          <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" data-value=""></li>
          <li class="mdc-deprecated-list-item" data-value="orange">
            <span class="mdc-deprecated-list-item__text">Orange</span>
          </li>
          <li class="mdc-deprecated-list-item" data-value="apple">
            <span class="mdc-deprecated-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
       const component = new MDCSelect(fixture);
       expect(component.disabled).toBe(true);
     });

  it('instantiates ripple', () => {
    if (!supportsCssVariables(window, true)) {
      return;
    }

    const fixture = getFixture();

    const component = MDCSelect.attachTo(fixture);
    jasmine.clock().tick(1);

    expect((component as any).ripple).toEqual(jasmine.any(MDCRipple));
    const anchor =
        fixture.querySelector<HTMLElement>(strings.SELECT_ANCHOR_SELECTOR)!;
    expect(anchor).toHaveClass(MDCRippleFoundation.cssClasses.ROOT);
  });

  it(`#constructor instantiates an outline on the ${
         strings.OUTLINE_SELECTOR} element if present`,
     () => {
       const root = getOutlineFixture();
       const component = new MDCSelect(root);
       expect((component as any).outline)
           .toEqual(jasmine.any(MDCNotchedOutline));
     });

  it('handles ripple focus properly', () => {
    if (!supportsCssVariables(window, true)) {
      return;
    }

    const fixture = getFixture();

    MDCSelect.attachTo(fixture);
    jasmine.clock().tick(1);

    const anchor =
        fixture.querySelector<HTMLElement>(strings.SELECT_ANCHOR_SELECTOR)!;

    emitEvent(anchor, 'focus');
    jasmine.clock().tick(1);

    expect(anchor).toHaveClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);
  });

  it('#destroy removes the ripple', () => {
    if (!supportsCssVariables(window, true)) {
      return;
    }

    const fixture = getFixture();

    const component = new MDCSelect(fixture);
    jasmine.clock().tick(1);

    const anchor =
        fixture.querySelector<HTMLElement>(strings.SELECT_ANCHOR_SELECTOR)!;

    expect(anchor).toHaveClass(MDCRippleFoundation.cssClasses.ROOT);
    component.destroy();
    jasmine.clock().tick(1);
    expect(anchor).not.toHaveClass(MDCRippleFoundation.cssClasses.ROOT);
  });

  it('#destroy cleans up the outline if present', () => {
    const {component, outline} = setupTest();
    (component as any).outline = outline;
    component.destroy();
    expect(outline.destroy).toHaveBeenCalled();
  });

  it(`does not instantiate ripple when ${cssClasses.OUTLINED} class is present`,
     () => {
       const hasOutline = true;
       const {component} = setupTest(hasOutline);
       expect((component as any).ripple).toBe(undefined);
       expect(() => {
         component.destroy();
       }).not.toThrow();
     });

  it('adapter#addClass adds a class to the root element', () => {
    const {component, fixture} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(fixture).toHaveClass('foo');
  });

  it('adapter#removeClass removes a class from the root element', () => {
    const {component, fixture} = setupTest();
    fixture.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(fixture).not.toHaveClass('foo');
  });

  it('adapter#hasClass returns true if a class exists on the root element',
     () => {
       const {component, fixture} = setupTest();
       fixture.classList.add('foo');
       expect((component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(true);
     });

  it('adapter#floatLabel does not throw error if label does not exist', () => {
    const fixture = createFixture(html`
    <div class="mdc-select">
      <div class="mdc-select__anchor">
        <span class="mdc-select__ripple"></span>
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5" focusable="false">
            <polygon
                class="mdc-select__dropdown-icon-inactive"
                stroke="none"
                fill-rule="evenodd"
                points="7 10 12 15 17 10">
            </polygon>
            <polygon
                class="mdc-select__dropdown-icon-active"
                stroke="none"
                fill-rule="evenodd"
                points="7 15 12 10 17 15">
            </polygon>
          </svg>
        </span>
        <span class="mdc-line-ripple"></span>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-deprecated-list">
          <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" data-value=""></li>
          <li class="mdc-deprecated-list-item" data-value="orange">
            <span class="mdc-deprecated-list-item__text">Orange</span>
          </li>
          <li class="mdc-deprecated-list-item" data-value="apple">
            <span class="mdc-deprecated-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
    const component = new MDCSelect(fixture);
    expect(
        () =>
            (component.getDefaultFoundation() as any).adapter.floatLabel('foo'))
        .not.toThrow();
  });

  it('adapter#activateBottomLine and adapter.deactivateBottomLine ' +
         'does not throw error if bottomLine does not exist',
     () => {
       const fixture = createFixture(html`
    <div class="mdc-select">
      <div class="mdc-select__anchor">
        <span class="mdc-select__ripple"></span>
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5" focusable="false">
            <polygon
                class="mdc-select__dropdown-icon-inactive"
                stroke="none"
                fill-rule="evenodd"
                points="7 10 12 15 17 10">
            </polygon>
            <polygon
                class="mdc-select__dropdown-icon-active"
                stroke="none"
                fill-rule="evenodd"
                points="7 15 12 10 17 15">
            </polygon>
          </svg>
        </span>
        <span class="mdc-floating-label">Pick a Food Group</span>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul class="mdc-deprecated-list">
          <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" data-value=""></li>
          <li class="mdc-deprecated-list-item" data-value="orange">
            <span class="mdc-deprecated-list-item__text">Orange</span>
          </li>
          <li class="mdc-deprecated-list-item" data-value="apple">
            <span class="mdc-deprecated-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
       const component = new MDCSelect(fixture);
       expect(
           () => (component.getDefaultFoundation() as any)
                     .adapter.activateBottomLine())
           .not.toThrow();
       expect(
           () => (component.getDefaultFoundation() as any)
                     .adapter.deactivateBottomLine())
           .not.toThrow();
     });

  it('adapter#floatLabel adds a class to the label', () => {
    const {component, label} = setupTest();

    (component.getDefaultFoundation() as any).adapter.floatLabel('foo');
    expect(label.float).toHaveBeenCalledWith('foo');
  });

  it('adapter#activateBottomLine adds active class to the bottom line', () => {
    const {component, bottomLine} = setupTest();

    (component.getDefaultFoundation() as any).adapter.activateBottomLine();
    expect(bottomLine.activate).toHaveBeenCalled();
  });

  it('adapter#deactivateBottomLine removes active class from the bottom line',
     () => {
       const {component, bottomLine} = setupTest();

       (component.getDefaultFoundation() as any).adapter.deactivateBottomLine();
       expect(bottomLine.deactivate).toHaveBeenCalled();
     });

  it('adapter#notchOutline proxies labelWidth to the outline', () => {
    const hasOutline = true;
    const {component, outline} = setupTest(hasOutline);

    (component.getDefaultFoundation() as any).adapter.notchOutline(LABEL_WIDTH);
    expect(outline.notch).toHaveBeenCalledWith(LABEL_WIDTH);
    expect(outline.notch).toHaveBeenCalledTimes(1);
  });

  it('adapter#notchOutline does not proxy values to the outline if it does not exist',
     () => {
       const hasOutline = false;
       const {component, outline} = setupTest(hasOutline);

       (component.getDefaultFoundation() as any)
           .adapter.notchOutline(LABEL_WIDTH);
       expect(outline.notch).not.toHaveBeenCalledWith(LABEL_WIDTH);
     });

  it('adapter#notifyChange updates hidden input', () => {
    const {component} = setupTest();
    component['getDefaultFoundation']()['adapter'].notifyChange('foo');
    expect((component as any).hiddenInput.value).toEqual('foo');
  });

  it('adapter#closeOutline closes the outline if there is an outline', () => {
    const hasOutline = true;
    const {component, outline} = setupTest(hasOutline);
    const adapter = (component.getDefaultFoundation() as any).adapter;
    adapter.closeOutline();
    expect(outline.closeNotch).toHaveBeenCalled();
  });

  it('adapter#closeOutline does nothing if there is no outline', () => {
    const hasOutline = false;
    const {component, outline} = setupTest(hasOutline);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    adapter.closeOutline();
    expect(outline.closeNotch).not.toHaveBeenCalled();
  });

  it('adapter#getLabelWidth returns the width of the label', () => {
    const {component} = setupTest();
    expect((component.getDefaultFoundation() as any).adapter.getLabelWidth())
        .toEqual(LABEL_WIDTH);
  });

  it('adapter#getLabelWidth returns 0 if the label does not exist', () => {
    const hasOutline = true;
    const hasLabel = false;
    const {component} = setupTest(hasOutline, hasLabel);

    expect((component.getDefaultFoundation() as any).adapter.getLabelWidth())
        .toEqual(0);
  });

  it('adapter#focusMenuItemAtIndex', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, menuSurface, fixture} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const index = 1;
    const menuItem = menuSurface.querySelectorAll<HTMLElement>(
        '.mdc-deprecated-list-item')[index];
    const adapter = (component.getDefaultFoundation() as any).adapter;

    adapter.focusMenuItemAtIndex(index);
    expect(document.activeElement).toEqual(menuItem);
    document.body.removeChild(fixture);
  });

  it('adapter#setSelectedText sets the select text content correctly', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, selectedText} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    const textToSet = 'foo';
    expect(selectedText.textContent).not.toEqual(textToSet);
    adapter.setSelectedText(textToSet);
    expect(selectedText.textContent).toEqual(textToSet);
    document.body.removeChild(fixture);
  });

  it('adapter#setSelectedText, by product by setting selectedIndex,' +
         ' sets the selected text aria-label correctly',
     () => {
       const hasMockFoundation = false;
       const hasMockMenu = false;
       const hasOutline = false;
       const hasLabel = true;
       const {fixture, component, selectedText} =
           setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
       document.body.appendChild(fixture);

       component.selectedIndex = 2;
       expect(selectedText.getAttribute('aria-label')).toEqual('Apple');
       document.body.removeChild(fixture);
     });

  it('adapter#isSelectAnchorFocused', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, anchor} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    anchor.tabIndex = 0;
    anchor.focus();
    const adapter = (component.getDefaultFoundation() as any).adapter;

    expect(adapter.isSelectAnchorFocused()).toBe(true);
    document.body.removeChild(fixture);
  });

  it('adapter#getSelectAnchorAttr gets the attribute content correctly', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, anchor} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    expect(anchor.hasAttribute('foo')).toBe(false);
    anchor.setAttribute('foo', '1');
    expect(adapter.getSelectAnchorAttr('foo')).toEqual('1');
    document.body.removeChild(fixture);
  });

  it('adapter#setSelectAnchorAttr sets the attribute content correctly', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, anchor} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    expect(anchor.hasAttribute('data-foo')).toBe(false);
    adapter.setSelectAnchorAttr('data-foo', '1');
    expect(anchor.getAttribute('data-foo')).toEqual('1');
    document.body.removeChild(fixture);
  });

  it('adapter#openMenu causes the menu to open', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, mockMenu} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;
    adapter.openMenu();
    expect(mockMenu.open).toBe(true);
    document.body.removeChild(fixture);
  });

  it('adapter#closeMenu causes the menu to close', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, mockMenu} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;
    adapter.openMenu();
    adapter.closeMenu();
    expect(mockMenu.open).toBe(false);
    document.body.removeChild(fixture);
  });

  it('adapter#getAnchorElement', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, anchor} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    expect(adapter.getAnchorElement()).toEqual(anchor);
    document.body.removeChild(fixture);
  });

  it('adapter#setMenuAnchorElement', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, mockMenu, anchor} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    adapter.setMenuAnchorElement(anchor);
    expect(mockMenu.setAnchorElement).toHaveBeenCalledWith(anchor);
    document.body.removeChild(fixture);
  });

  it('adapter#setMenuAnchorCorner', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, mockMenu} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    adapter.setMenuAnchorCorner(Corner.BOTTOM_START);
    expect(mockMenu.setAnchorCorner).toHaveBeenCalledWith(Corner.BOTTOM_START);
    document.body.removeChild(fixture);
  });

  it('adapter#setMenuWrapFocus', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, mockMenu} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    adapter.setMenuWrapFocus(false);
    expect(mockMenu.wrapFocus).toBe(false);
    adapter.setMenuWrapFocus(true);
    expect(mockMenu.wrapFocus).toBe(true);
    document.body.removeChild(fixture);
  });

  it('adapter#getMenuItemCount returns the correct number of menu items',
     () => {
       const hasMockFoundation = true;
       const hasMockMenu = false;
       const hasOutline = false;
       const hasLabel = true;
       const {fixture, component} =
           setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
       document.body.appendChild(fixture);

       const adapter = (component.getDefaultFoundation() as any).adapter;
       expect(adapter.getMenuItemCount()).toEqual(3);

       document.body.removeChild(fixture);
     });

  it('adapter#getMenuItemValues returns the correct menu item values', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);

    const adapter = (component.getDefaultFoundation() as any).adapter;
    expect(adapter.getMenuItemValues()).toEqual(['', 'orange', 'apple']);

    document.body.removeChild(fixture);
  });

  it('adapter#getMenuItemAttr returns the menu item attribute', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, menuSurface} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

    const index = 1;
    const menuItem = menuSurface.querySelectorAll<HTMLElement>(
        '.mdc-deprecated-list-item')[index];
    const adapter = (component.getDefaultFoundation() as any).adapter;

    expect(adapter.getMenuItemAttr(menuItem, strings.VALUE_ATTR))
        .toEqual('orange');
  });

  it('adapter#isTypeaheadInProgress queries menu state', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, mockMenu} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;

    mockMenu.typeaheadInProgress = false;
    expect(adapter.isTypeaheadInProgress()).toBe(false);
    mockMenu.typeaheadInProgress = true;
    expect(adapter.isTypeaheadInProgress()).toBe(true);
    document.body.removeChild(fixture);
  });

  it('adapter#typeaheadMatchItem calls menu method', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, mockMenu} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const adapter = (component.getDefaultFoundation() as any).adapter;
    mockMenu.typeaheadMatchItem.and.returnValue(2);

    expect(adapter.typeaheadMatchItem('a', 4)).toEqual(2);
    expect(mockMenu.typeaheadMatchItem).toHaveBeenCalledWith('a', 4);
    document.body.removeChild(fixture);
  });

  it('focus event triggers foundation.handleFocus()', () => {
    const {anchor, mockFoundation} = setupWithMockFoundation();
    emitEvent(anchor, 'focus');
    expect(mockFoundation.handleFocus).toHaveBeenCalledTimes(1);
  });

  it('blur event triggers foundation.handleBlur()', () => {
    const {anchor, mockFoundation} = setupWithMockFoundation();
    emitEvent(anchor, 'blur');
    expect(mockFoundation.handleBlur).toHaveBeenCalledTimes(1);
  });

  it('#destroy removes the focus handler', () => {
    const {component, anchor, mockFoundation} = setupWithMockFoundation();
    component.destroy();
    emitEvent(anchor, 'focus');
    expect(mockFoundation.handleFocus).not.toHaveBeenCalled();
  });

  it('#destroy removes the blur handler', () => {
    const {component, anchor, mockFoundation} = setupWithMockFoundation();
    component.destroy();
    emitEvent(anchor, 'blur');
    expect(mockFoundation.handleBlur).not.toHaveBeenCalled();
  });

  it('#destroy removes the click handler', () => {
    const {component, anchor, mockFoundation} = setupWithMockFoundation();
    component.destroy();
    emitEvent(anchor, 'click');
    expect(mockFoundation.handleClick).not.toHaveBeenCalled();
  });

  it('#destroy calls menu#destroy', () => {
    const {component, mockMenu} = setupTest();
    component.destroy();
    expect(mockMenu.destroy).toHaveBeenCalledTimes(1);
  });

  it(`#destroy removes the listener for ${
         MDCMenuFoundation.strings.SELECTED_EVENT} event`,
     () => {
       const hasMockFoundation = false;
       const hasMockMenu = false;
       const hasOutline = false;
       const hasLabel = true;
       const {fixture, component, mockFoundation, menuSurface} =
           setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
       document.body.appendChild(fixture);
       component.destroy();

       const eventType = MDCMenuFoundation.strings.SELECTED_EVENT;
       const detail = {index: 1};
       let event;
       if (typeof CustomEvent === 'function') {
         event = new CustomEvent(eventType, {
           detail,
           bubbles: false,
         });
       } else {
         event = document.createEvent('CustomEvent');
         event.initCustomEvent(eventType, false, false, detail);
       }
       menuSurface.dispatchEvent(event);
       expect(mockFoundation.setSelectedIndex).not.toHaveBeenCalledWith(1);

       document.body.removeChild(fixture);
     });

  it('#destroy removes the click listener', () => {
    const {component, anchor} = setupTest();
    (component as any).foundation.handleClick =
        jasmine.createSpy('handleClick');
    component.destroy();
    emitEvent(anchor, 'click');
    expect((component as any).foundation.handleClick).not.toHaveBeenCalled();
  });

  it('click on the anchor calls foundation.handleClick()', () => {
    const {component, anchor} = setupTest();
    (component as any).foundation.handleClick = jasmine.createSpy('');
    emitEvent(anchor, 'click');
    expect((component as any).foundation.handleClick).toHaveBeenCalled();
  });

  it('click on the anchor focuses on the anchor element', () => {
    const {anchor} = setupTest();
    anchor.focus = jasmine.createSpy('focus');
    emitEvent(anchor, 'click');
    expect(anchor.focus).toHaveBeenCalledTimes(1);
  });

  it('menu surface opened event causes the first element (if no element is selected) to be focused',
     () => {
       const hasMockFoundation = false;
       const hasMockMenu = false;
       const hasOutline = false;
       const hasLabel = true;
       const {fixture, component, menuSurface} =
           setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
       document.body.appendChild(fixture);
       component.selectedIndex = -1;

       emitEvent(
           menuSurface, MDCMenuSurfaceFoundation.strings.OPENED_EVENT,
           {bubbles: false, cancelable: true});

       expect(document.activeElement)
           .toEqual(menuSurface.querySelector<HTMLElement>(
               '.mdc-deprecated-list-item'));
       document.body.removeChild(fixture);
     });

  it('menu surface opened event handler calls Foundation#handleMenuOpened',
     () => {
       const hasMockFoundation = true;
       const hasMockMenu = false;
       const hasOutline = false;
       const hasLabel = true;
       const {fixture, mockFoundation, menuSurface} =
           setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
       document.body.appendChild(fixture);

       const event = document.createEvent('Event');
       event.initEvent(
           MDCMenuSurfaceFoundation.strings.OPENED_EVENT, false, true);
       emitEvent(
           menuSurface, MDCMenuSurfaceFoundation.strings.OPENED_EVENT,
           {bubbles: false, cancelable: true});
       expect(mockFoundation.handleMenuOpened).toHaveBeenCalledTimes(1);

       document.body.removeChild(fixture);
     });

  it('menu surface opened event causes selected element to be focused', () => {
    const hasMockFoundation = false;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component, menuSurface} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    component.selectedIndex = 1;
    emitEvent(
        menuSurface, MDCMenuSurfaceFoundation.strings.OPENED_EVENT,
        {bubbles: false, cancelable: true});

    expect(document.activeElement)
        .toEqual(menuSurface.querySelector<HTMLElement>(
            '.mdc-deprecated-list-item--selected'));
    expect(component.selectedIndex).toEqual(1);
    document.body.removeChild(fixture);
  });

  it('keydown event is added to select anchor when initialized', () => {
    const {fixture, mockFoundation} = setupWithMockFoundation();
    document.body.appendChild(fixture);
    emitEvent(
        fixture.querySelector<HTMLElement>(strings.SELECT_ANCHOR_SELECTOR) as
            HTMLElement,
        'keydown');
    expect(mockFoundation.handleKeydown)
        .toHaveBeenCalledWith(jasmine.anything());
    expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
    document.body.removeChild(fixture);
  });

  it('keydown event is removed from select anchor when destroyed', () => {
    const {fixture, mockFoundation, component} = setupWithMockFoundation();
    document.body.appendChild(fixture);
    component.destroy();
    emitEvent(
        fixture.querySelector<HTMLElement>(strings.SELECT_ANCHOR_SELECTOR) as
            HTMLElement,
        'keydown');
    expect(mockFoundation.handleKeydown)
        .not.toHaveBeenCalledWith(jasmine.anything());
    document.body.removeChild(fixture);
  });

  it('menu surface selected event causes the select to update', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, menuSurface, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const eventType = MDCMenuFoundation.strings.SELECTED_EVENT;
    const detail = {index: 1};
    let event;
    if (typeof CustomEvent === 'function') {
      event = new CustomEvent(eventType, {
        detail,
        bubbles: false,
      });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventType, false, false, detail);
    }
    menuSurface.dispatchEvent(event);
    expect(mockFoundation.handleMenuItemAction).toHaveBeenCalledWith(1);
    expect(mockFoundation.handleMenuItemAction).toHaveBeenCalledTimes(1);

    document.body.removeChild(fixture);
  });

  it('menu surface closed event sets aria-expanded to false', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, menuSurface, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);
    const eventType = MDCMenuSurfaceFoundation.strings.CLOSING_EVENT;
    let event;
    if (typeof CustomEvent === 'function') {
      event = new CustomEvent(eventType, {
        bubbles: false,
      });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventType, false, false, null);
    }
    menuSurface.dispatchEvent(event);
    expect(mockFoundation.handleMenuClosing).toHaveBeenCalledTimes(1);

    document.body.removeChild(fixture);
  });

  it('#constructor instantiates a leading icon if an icon element is present',
     () => {
       const root = getFixture();
       const component = new MDCSelect(root);
       expect((component as any).leadingIcon)
           .toEqual(jasmine.any(MDCSelectIcon));
       expect(root).toHaveClass(cssClasses.WITH_LEADING_ICON);
     });

  it('#constructor instantiates the helper text if present', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasLabel = true;
    const hasOutline = false;
    const hasHelperText = true;
    const {container, component} = setupTest(
        hasLabel, hasOutline, hasMockFoundation, hasMockMenu, hasHelperText);

    expect((component as any).helperText).toEqual(jasmine.any(FakeHelperText));
    document.body.removeChild(container as HTMLElement);
  });

  it('#constructor does not instantiate the helper text if the aria-controls id does not match an element',
     () => {
       const containerDiv = getHelperTextFixture();
       containerDiv.querySelector<HTMLElement>('.mdc-select-helper-text')!.id =
           'hello-world';
       document.body.appendChild(containerDiv);

       const component = new MDCSelect(
           containerDiv.querySelector<HTMLElement>('.mdc-select') as
           HTMLElement);
       expect((component as any).helperText).toBe(undefined);
       document.body.removeChild(containerDiv as HTMLElement);
     });

  it('#destroy destroys the helper text if it exists', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasLabel = true;
    const hasOutline = false;
    const hasHelperText = true;
    const {container, helperText, component} = setupTest(
        hasLabel, hasOutline, hasMockFoundation, hasMockMenu, hasHelperText);

    component.destroy();
    expect(helperText.destroy).toHaveBeenCalledTimes(1);
    document.body.removeChild(container as HTMLElement);
  });
});
