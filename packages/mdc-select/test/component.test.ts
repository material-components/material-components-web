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
import {getFixture as createFixture} from '../../../testing/dom/index';
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
  hoistMenuToBody: jasmine.Spy = jasmine.createSpy('.hoistMenuToBody');
  setAnchorElement: jasmine.Spy = jasmine.createSpy('.setAnchorElement');
  setAnchorCorner: jasmine.Spy = jasmine.createSpy('.setAnchorCorner');
  listen: jasmine.Spy = jasmine.createSpy('.listen');
  unlisten: jasmine.Spy = jasmine.createSpy('.listen');
  layout: jasmine.Spy = jasmine.createSpy('.layout');

  open: boolean = false;
  wrapFocus: boolean = false;
}

class FakeIcon {
  destroy: jasmine.Spy = jasmine.createSpy('.destroy');
}

class FakeHelperText {
  destroy: jasmine.Spy = jasmine.createSpy('.destroy');
}

function getFixture() {
  return createFixture(`
    <div class="mdc-select mdc-select--with-leading-icon">
      <div class="mdc-select__anchor">
        <span class="mdc-select__ripple"></span>
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5">
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
        <ul class="mdc-list">
          <li class="mdc-list-item" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            <span class="mdc-list-item__text">Orange</span>
          </li>
          <li class="mdc-list-item" data-value="apple">
            <span class="mdc-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
}

function getOutlineFixture() {
  return createFixture(`
    <div class="mdc-select mdc-select--outlined mdc-select--with-leading-icon">
      <div class="mdc-select__anchor">
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5">
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
        <ul class="mdc-list">
          <li class="mdc-list-item" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            <span class="mdc-list-item__text">Orange</span>
          </li>
          <li class="mdc-list-item" data-value="apple">
            <span class="mdc-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
}

function getHelperTextFixture(root = getFixture()) {
  const containerDiv = document.createElement('div');
  root.querySelector(strings.SELECT_ANCHOR_SELECTOR)!.setAttribute(
      'aria-controls', 'test-helper-text');
  containerDiv.appendChild(root);
  containerDiv.appendChild(createFixture(
      `<p class="mdc-select-helper-text" id="test-helper-text">Hello World</p>`));
  return containerDiv;
}

function setupTest(
    hasOutline = false, hasLabel = true, hasMockFoundation = false,
    hasMockMenu = true, hasHelperText = false) {
  // Clean up: Remove all menu elements from DOM first.
  const menuEls = document.querySelectorAll(strings.MENU_SELECTOR);
  [].forEach.call(
      menuEls, (el: HTMLElement) => el.parentElement!.removeChild(el));

  const bottomLine = new FakeBottomLine();
  const label = new FakeLabel();
  const fixture = hasOutline ? getOutlineFixture() : getFixture();
  const anchor =
      fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR) as HTMLElement;
  const container = hasHelperText ? getHelperTextFixture(fixture) : null;
  const selectedText =
      fixture.querySelector(strings.SELECTED_TEXT_SELECTOR) as HTMLElement;
  const labelEl = fixture.querySelector(strings.LABEL_SELECTOR) as HTMLElement;
  const bottomLineEl =
      fixture.querySelector(strings.LINE_RIPPLE_SELECTOR) as HTMLElement;
  const menuSurface =
      fixture.querySelector(strings.MENU_SELECTOR) as HTMLElement;
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
    expect(menuSurface.querySelectorAll('.mdc-list-item--selected').length)
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
    component.disabled = false;
    checkNumTimesSpyCalledWithArgs(mockFoundation.setDisabled, [false], 1);
  });

  it('#get/set required true', () => {
    const {fixture, component, anchor} = setupTest();
    expect(component.required).toBe(false);

    component.required = true;
    expect(component.required).toBe(true);
    expect(fixture.classList.contains(cssClasses.REQUIRED)).toBe(true);
    expect(anchor.getAttribute('aria-required')).toBe('true');
  });

  it('#get/set required false', () => {
    const {fixture, component, anchor} = setupTest();
    expect(component.required).toBe(false);

    component.required = false;
    expect(component.required).toBe(false);
    expect(fixture.classList.contains(cssClasses.REQUIRED)).toBe(false);
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

  it('#layoutOptions calls foundation.layoutOptions', () => {
    const hasMockFoundation = true;
    const hasMockMenu = true;
    const hasOutline = false;
    const hasLabel = true;
    const {component, mockFoundation} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    component.layoutOptions();
    expect(mockFoundation.layoutOptions).toHaveBeenCalled();
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

  it('#initialSyncWithDOM sets the selected index if an option has the selected class',
     () => {
       const fixture = createFixture(`
        <div class="mdc-select">
          <div class="mdc-select__anchor">
            <span class="mdc-select__ripple"></span>
            <i class="mdc-select__icon material-icons">code</i>
            <span class="mdc-select__selected-text"></span>
            <span class="mdc-select__dropdown-icon">
              <svg
                  width="10px"
                  height="5px"
                  viewBox="7 10 10 5">
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
            <ul class="mdc-list">
              <li class="mdc-list-item" data-value=""></li>
              <li class="mdc-list-item mdc-list-item--selected" data-value="orange">
                <span class="mdc-list-tem__text">Orange</span>
              </li>
              <li class="mdc-list-item" data-value="apple">
                <span class="mdc-list-tem__text">Apple</span>
              </li>
            </ul>
          </div>
        </div>
      `);
       const component = new MDCSelect(fixture, /* foundation */ undefined);
       expect(component.selectedIndex).toEqual(1);
     });

  it('#initialSyncWithDOM sets the selected index if empty option has the selected class',
     () => {
       const fixture = createFixture(`
        <div class="mdc-select">
          <div class="mdc-select__anchor">
            <span class="mdc-select__ripple"></span>
            <i class="mdc-select__icon material-icons">code</i>
            <span class="mdc-select__selected-text"></span>
            <span class="mdc-select__dropdown-icon">
              <svg
                  width="10px"
                  height="5px"
                  viewBox="7 10 10 5">
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
      `);
       const component = new MDCSelect(fixture, /* foundation */ undefined);
       expect(component.selectedIndex).toEqual(0);
     });

  it('#initialSyncWithDOM disables the select if the disabled class is found',
     () => {
       const fixture = createFixture(`
    <div class="mdc-select mdc-select--disabled">
      <div class="mdc-select__anchor">
        <span class="mdc-select__ripple"></span>
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5">
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
        <ul class="mdc-list">
          <li class="mdc-list-item mdc-list-item--selected" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            <span class="mdc-list-item__text">Orange</span>
          </li>
          <li class="mdc-list-item" data-value="apple">
            <span class="mdc-list-item__text">Apple</span>
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
        fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR) as HTMLElement;
    expect(anchor.classList.contains(MDCRippleFoundation.cssClasses.ROOT))
        .toBe(true);
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
        fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR) as HTMLElement;

    emitEvent(anchor, 'focus');
    jasmine.clock().tick(1);

    expect(anchor.classList.contains(MDCRippleFoundation.cssClasses.BG_FOCUSED))
        .toBe(true);
  });

  it('#destroy removes the ripple', () => {
    if (!supportsCssVariables(window, true)) {
      return;
    }

    const fixture = getFixture();

    const component = new MDCSelect(fixture);
    jasmine.clock().tick(1);

    const anchor =
        fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR) as HTMLElement;

    expect(anchor.classList.contains(MDCRippleFoundation.cssClasses.ROOT))
        .toBe(true);
    component.destroy();
    jasmine.clock().tick(1);
    expect(anchor.classList.contains(MDCRippleFoundation.cssClasses.ROOT))
        .toBe(false);
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
    (component.getDefaultFoundation() as any).adapter_.addClass('foo');
    expect(fixture.classList.contains('foo')).toBe(true);
  });

  it('adapter#removeClass removes a class from the root element', () => {
    const {component, fixture} = setupTest();
    fixture.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter_.removeClass('foo');
    expect(fixture.classList.contains('foo')).toBe(false);
  });

  it('adapter#hasClass returns true if a class exists on the root element',
     () => {
       const {component, fixture} = setupTest();
       fixture.classList.add('foo');
       expect(
           (component.getDefaultFoundation() as any).adapter_.hasClass('foo'))
           .toBe(true);
     });

  it('adapter#floatLabel does not throw error if label does not exist', () => {
    const fixture = createFixture(`
    <div class="mdc-select">
      <div class="mdc-select__anchor">
        <span class="mdc-select__ripple"></span>
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5">
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
        <ul class="mdc-list">
          <li class="mdc-list-item mdc-list-item--selected" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            <span class="mdc-list-item__text">Orange</span>
          </li>
          <li class="mdc-list-item" data-value="apple">
            <span class="mdc-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
    const component = new MDCSelect(fixture);
    expect(
        () => (component.getDefaultFoundation() as any)
                  .adapter_.floatLabel('foo'))
        .not.toThrow();
  });

  it('adapter#activateBottomLine and adapter.deactivateBottomLine ' +
         'does not throw error if bottomLine does not exist',
     () => {
       const fixture = createFixture(`
    <div class="mdc-select">
      <div class="mdc-select__anchor">
        <span class="mdc-select__ripple"></span>
        <i class="mdc-select__icon material-icons">code</i>
        <span class="mdc-select__selected-text"></span>
        <span class="mdc-select__dropdown-icon">
          <svg
              width="10px"
              height="5px"
              viewBox="7 10 10 5">
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
        <ul class="mdc-list">
          <li class="mdc-list-item mdc-list-item--selected" data-value=""></li>
          <li class="mdc-list-item" data-value="orange">
            <span class="mdc-list-item__text">Orange</span>
          </li>
          <li class="mdc-list-item" data-value="apple">
            <span class="mdc-list-item__text">Apple</span>
          </li>
        </ul>
      </div>
    </div>
  `);
       const component = new MDCSelect(fixture);
       expect(
           () => (component.getDefaultFoundation() as any)
                     .adapter_.activateBottomLine())
           .not.toThrow();
       expect(
           () => (component.getDefaultFoundation() as any)
                     .adapter_.deactivateBottomLine())
           .not.toThrow();
     });

  it('adapter#floatLabel adds a class to the label', () => {
    const {component, label} = setupTest();

    (component.getDefaultFoundation() as any).adapter_.floatLabel('foo');
    expect(label.float).toHaveBeenCalledWith('foo');
  });

  it('adapter#activateBottomLine adds active class to the bottom line', () => {
    const {component, bottomLine} = setupTest();

    (component.getDefaultFoundation() as any).adapter_.activateBottomLine();
    expect(bottomLine.activate).toHaveBeenCalled();
  });

  it('adapter#deactivateBottomLine removes active class from the bottom line',
     () => {
       const {component, bottomLine} = setupTest();

       (component.getDefaultFoundation() as any)
           .adapter_.deactivateBottomLine();
       expect(bottomLine.deactivate).toHaveBeenCalled();
     });

  it('adapter#notchOutline proxies labelWidth to the outline', () => {
    const hasOutline = true;
    const {component, outline} = setupTest(hasOutline);

    (component.getDefaultFoundation() as any)
        .adapter_.notchOutline(LABEL_WIDTH);
    expect(outline.notch).toHaveBeenCalledWith(LABEL_WIDTH);
    expect(outline.notch).toHaveBeenCalledTimes(1);
  });

  it('adapter#notchOutline does not proxy values to the outline if it does not exist',
     () => {
       const hasOutline = false;
       const {component, outline} = setupTest(hasOutline);

       (component.getDefaultFoundation() as any)
           .adapter_.notchOutline(LABEL_WIDTH);
       expect(outline.notch).not.toHaveBeenCalledWith(LABEL_WIDTH);
     });

  it('adapter#closeOutline closes the outline if there is an outline', () => {
    const hasOutline = true;
    const {component, outline} = setupTest(hasOutline);
    const adapter = (component.getDefaultFoundation() as any).adapter_;
    adapter.closeOutline();
    expect(outline.closeNotch).toHaveBeenCalled();
  });

  it('adapter#closeOutline does nothing if there is no outline', () => {
    const hasOutline = false;
    const {component, outline} = setupTest(hasOutline);
    const adapter = (component.getDefaultFoundation() as any).adapter_;

    adapter.closeOutline();
    expect(outline.closeNotch).not.toHaveBeenCalled();
  });

  it('adapter#getLabelWidth returns the width of the label', () => {
    const {component} = setupTest();
    expect((component.getDefaultFoundation() as any).adapter_.getLabelWidth())
        .toEqual(LABEL_WIDTH);
  });

  it('adapter#getLabelWidth returns 0 if the label does not exist', () => {
    const hasOutline = true;
    const hasLabel = false;
    const {component} = setupTest(hasOutline, hasLabel);

    expect((component.getDefaultFoundation() as any).adapter_.getLabelWidth())
        .toEqual(0);
  });

  it('adapter#getSelectedMenuItem returns the selected element', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, menuSurface} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

    const index = 1;
    const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
    const adapter = (component.getDefaultFoundation() as any).adapter_;
    menuItem.classList.add(cssClasses.SELECTED_ITEM_CLASS);

    expect(adapter.getSelectedMenuItem()).toEqual(menuItem);
  });

  it('adapter#setAttributeAtIndex sets attribute value correctly', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, menuSurface} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

    const index = 1;
    const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
    const valueToSet = 'foo';

    expect(menuItem.getAttribute(strings.VALUE_ATTR)).not.toEqual(valueToSet);
    const adapter = (component.getDefaultFoundation() as any).adapter_;
    adapter.setAttributeAtIndex(index, strings.VALUE_ATTR, valueToSet);

    expect(menuItem.getAttribute(strings.VALUE_ATTR)).toEqual(valueToSet);
  });

  it('adapter#removeAttributeAtIndex removes attribute value correctly', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {component, menuSurface} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);

    const index = 1;
    const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
    const attrToRemove = 'foo';
    menuItem.setAttribute(attrToRemove, '0');

    const adapter = (component.getDefaultFoundation() as any).adapter_;
    adapter.removeAttributeAtIndex(index, attrToRemove);

    expect(menuItem.hasAttribute(attrToRemove)).toBe(false);
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
    const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
    const adapter = (component.getDefaultFoundation() as any).adapter_;

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
    const adapter = (component.getDefaultFoundation() as any).adapter_;

    const textToSet = 'foo';
    expect(selectedText.textContent).not.toEqual(textToSet);
    adapter.setSelectedText(textToSet);
    expect(selectedText.textContent).toEqual(textToSet);
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
    const adapter = (component.getDefaultFoundation() as any).adapter_;

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
    const adapter = (component.getDefaultFoundation() as any).adapter_;

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
    const adapter = (component.getDefaultFoundation() as any).adapter_;

    expect(anchor.hasAttribute('foo')).toBe(false);
    adapter.setSelectAnchorAttr('foo', '1');
    expect(anchor.getAttribute('foo')).toEqual('1');
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
    const adapter = (component.getDefaultFoundation() as any).adapter_;
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
    const adapter = (component.getDefaultFoundation() as any).adapter_;
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
    const adapter = (component.getDefaultFoundation() as any).adapter_;

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
    const adapter = (component.getDefaultFoundation() as any).adapter_;

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
    const adapter = (component.getDefaultFoundation() as any).adapter_;

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
    const adapter = (component.getDefaultFoundation() as any).adapter_;

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

       const adapter = (component.getDefaultFoundation() as any).adapter_;
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

    const adapter = (component.getDefaultFoundation() as any).adapter_;
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
    const menuItem = menuSurface.querySelectorAll('.mdc-list-item')[index];
    const adapter = (component.getDefaultFoundation() as any).adapter_;

    expect(adapter.getMenuItemAttr(menuItem, strings.VALUE_ATTR))
        .toEqual('orange');
  });

  it('adapter#addClassAtIndex adds class correctly', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);

    const adapter = (component.getDefaultFoundation() as any).adapter_;
    const index = 1;
    const menuItem = document.querySelectorAll('.mdc-list-item')[index];

    adapter.addClassAtIndex(index, cssClasses.SELECTED_ITEM_CLASS);
    expect(menuItem.classList.contains(cssClasses.SELECTED_ITEM_CLASS))
        .toBe(true);
    document.body.removeChild(fixture);
  });

  it('adapter#removeClassAtIndex removes class correctly', () => {
    const hasMockFoundation = true;
    const hasMockMenu = false;
    const hasOutline = false;
    const hasLabel = true;
    const {fixture, component} =
        setupTest(hasOutline, hasLabel, hasMockFoundation, hasMockMenu);
    document.body.appendChild(fixture);

    const adapter = (component.getDefaultFoundation() as any).adapter_;
    const index = 1;
    const menuItem = document.querySelectorAll('.mdc-list-item')[index];

    adapter.removeClassAtIndex(index, cssClasses.SELECTED_ITEM_CLASS);
    expect(menuItem.classList.contains(cssClasses.SELECTED_ITEM_CLASS))
        .toBe(false);
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

  it('#destroy removes the change handler', () => {
    const {component, anchor, mockFoundation} = setupWithMockFoundation();
    component.destroy();
    emitEvent(anchor, 'change');
    expect(mockFoundation.handleChange).not.toHaveBeenCalled();
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
           .toEqual(menuSurface.querySelector('.mdc-list-item'));
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
        .toEqual(menuSurface.querySelector('.mdc-list-item--selected'));
    expect(component.selectedIndex).toEqual(1);
    document.body.removeChild(fixture);
  });

  it('keydown event is added to select anchor when initialized', () => {
    const {fixture, mockFoundation} = setupWithMockFoundation();
    document.body.appendChild(fixture);
    emitEvent(
        fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR) as HTMLElement,
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
        fixture.querySelector(strings.SELECT_ANCHOR_SELECTOR) as HTMLElement,
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
    expect(mockFoundation.handleMenuItemAction).toHaveBeenCalledWith(1);
    expect(mockFoundation.handleMenuItemAction).toHaveBeenCalledTimes(1);

    document.body.removeChild(fixture);
  });

  it('#constructor instantiates a leading icon if an icon element is present',
     () => {
       const root = getFixture();
       const component = new MDCSelect(root);
       expect((component as any).leadingIcon)
           .toEqual(jasmine.any(MDCSelectIcon));
       expect(root.classList.contains(cssClasses.WITH_LEADING_ICON)).toBe(true);
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
       containerDiv.querySelector('.mdc-select-helper-text')!.id =
           'hello-world';
       document.body.appendChild(containerDiv);

       const component = new MDCSelect(
           containerDiv.querySelector('.mdc-select') as HTMLElement);
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
