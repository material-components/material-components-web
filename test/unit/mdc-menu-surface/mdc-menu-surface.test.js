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

import {MDCMenuSurface, MDCMenuSurfaceFoundation} from '../../../packages/mdc-menu-surface/index';
import {Corner, cssClasses, strings} from '../../../packages/mdc-menu-surface/constants';
import {getTransformPropertyName} from '../../../packages/mdc-menu-surface/util';

function getFixture(open, fixedPosition = false) {
  const openClass = open ? 'mdc-menu-surface--open' : '';
  const fixedClass = fixedPosition ? 'mdc-menu-surface--fixed' : '';

  return bel`
    <div class="mdc-menu-surface ${openClass} ${fixedClass}" tabindex="-1">
      <ul class="mdc-list" role="menu">
        <li class="mdc-list-item" role="menuitem" tabindex="0">Item</a>
        <li role="separator"></li>
        <li class="mdc-list-item" role="menuitem" tabindex="0">Another Item</a>
      </nav>
    </div>
  `;
}

function getAnchorFixture(menuFixture) {
  const anchorEl = bel`
    <div class="mdc-menu-surface--anchor">
      <button class="mdc-button">Open</button>
    </div>
  `;
  anchorEl.appendChild(menuFixture);
  return anchorEl;
}

function setupTest({open = false, fixedPosition = false, withAnchor = false} = {}) {
  const root = getFixture(open, fixedPosition);
  const MockFoundationConstructor = td.constructor(MDCMenuSurfaceFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const anchor = withAnchor ? getAnchorFixture(root) : undefined;
  const component = new MDCMenuSurface(root, mockFoundation);
  return {root, mockFoundation, anchor, component};
}

suite('MDCMenuSurface');

test('attachTo initializes and returns a MDCMenuSurface instance', () => {
  assert.isTrue(MDCMenuSurface.attachTo(getFixture()) instanceof MDCMenuSurface);
});

test('initialSyncWithDOM registers key handler on the menu surface', () => {
  const {root, component, mockFoundation} = setupTest();
  domEvents.emit(root, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.isA(Event)), {times: 1});
  component.destroy();
});

test('destroy deregisters key handler on the menu surface', () => {
  const {root, component, mockFoundation} = setupTest();
  component.destroy();
  domEvents.emit(root, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.isA(Event)), {times: 0});
});

test('get/set open', () => {
  const {component, mockFoundation} = setupTest();
  td.when(mockFoundation.isOpen()).thenReturn(true);
  component.open = true;
  assert.isTrue(component.open);

  td.when(mockFoundation.isOpen()).thenReturn(false);
  component.open = false;
  assert.isFalse(component.open);
});

test('open=true opens the menu surface', () => {
  const {component, mockFoundation} = setupTest();
  component.open = true;
  td.verify(mockFoundation.open());
});

test(`${strings.OPENED_EVENT} causes the body click handler to be registered`, () => {
  const {root, mockFoundation} = setupTest();
  domEvents.emit(root, strings.OPENED_EVENT);
  domEvents.emit(document.body, 'click');
  td.verify(mockFoundation.handleBodyClick(td.matchers.isA(Event)), {times: 1});
});

test('open=true does not throw error if no focusable elements', () => {
  const {root, component, mockFoundation} = setupTest();

  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  assert.doesNotThrow(() => {
    component.open = true;
  });
  td.verify(mockFoundation.open());
});

test('open=false closes the menu surface', () => {
  const {component, mockFoundation} = setupTest();
  component.open = false;
  td.verify(mockFoundation.close());
});

test(`${strings.CLOSED_EVENT} causes the body click handler to be deregistered`, () => {
  const {root, mockFoundation} = setupTest();
  domEvents.emit(root, strings.CLOSED_EVENT);
  domEvents.emit(document.body, 'click');
  td.verify(mockFoundation.handleBodyClick(td.matchers.isA(Event)), {times: 0});
});

test('setMenuSurfaceAnchorElement', () => {
  const {component} = setupTest();
  const myElement = {};
  component.setMenuSurfaceAnchorElement(myElement);
  assert.equal(component.anchorElement, myElement);
});

test('anchorElement is properly initialized when the DOM contains an anchor', () => {
  const {component, anchor} = setupTest({withAnchor: true});
  assert.equal(component.anchorElement, anchor);
});

test('hoistMenuToBody', () => {
  const {root, component, mockFoundation} = setupTest();
  const div = document.createElement('div');
  div.appendChild(root);
  document.body.appendChild(div);
  component.hoistMenuToBody();

  td.verify(mockFoundation.setIsHoisted(true));
  assert.equal(root.parentElement, document.body);

  document.body.removeChild(root);
  document.body.removeChild(div);
});

test('setIsHoisted', () => {
  const {component, mockFoundation} = setupTest();
  component.setIsHoisted(true);
  td.verify(mockFoundation.setIsHoisted(true));
});

test('setFixedPosition is called when CSS class is present', () => {
  const {mockFoundation} = setupTest({fixedPosition: true});
  td.verify(mockFoundation.setFixedPosition(true));
});

test('setFixedPosition is true', () => {
  const {root, component, mockFoundation} = setupTest();
  component.setFixedPosition(true);
  assert.isTrue(root.classList.contains(cssClasses.FIXED));
  td.verify(mockFoundation.setFixedPosition(true));
});

test('setFixedPosition is false', () => {
  const {root, component, mockFoundation} = setupTest();
  component.setFixedPosition(false);
  assert.isFalse(root.classList.contains(cssClasses.FIXED));
  td.verify(mockFoundation.setFixedPosition(false));
});

test('setAbsolutePosition calls the foundation setAbsolutePosition function', () => {
  const {component, mockFoundation} = setupTest();
  component.setAbsolutePosition(10, 10);
  td.verify(mockFoundation.setAbsolutePosition(10, 10));
  td.verify(mockFoundation.setIsHoisted(true));
});

test('setAnchorCorner', () => {
  const {component, mockFoundation} = setupTest();
  component.setAnchorCorner(Corner.TOP_START);
  td.verify(mockFoundation.setAnchorCorner(Corner.TOP_START));
});

test('setAnchorMargin with all object properties defined', () => {
  const {component, mockFoundation} = setupTest();
  component.setAnchorMargin({top: 0, right: 0, bottom: 0, left: 0});
  td.verify(mockFoundation.setAnchorMargin({top: 0, right: 0, bottom: 0, left: 0}));
});

test('setAnchorMargin with empty object', () => {
  const {component, mockFoundation} = setupTest();
  component.setAnchorMargin({});
  td.verify(mockFoundation.setAnchorMargin({}));
});

test('setQuickOpen', () => {
  const {component, mockFoundation} = setupTest();
  component.quickOpen = false;
  td.verify(mockFoundation.setQuickOpen(false));
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('adapter#hasClass returns true if the root element has specified class', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#hasClass returns false if the root element does not have specified class', () => {
  const {component} = setupTest();
  assert.isFalse(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#getInnerDimensions returns the dimensions of the container', () => {
  const {root, component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getInnerDimensions().width, root.offsetWidth);
  assert.equal(component.getDefaultFoundation().adapter_.getInnerDimensions().height, root.offsetHeight);
});

test(`adapter#notifyClose fires an ${strings.CLOSED_EVENT} custom event`, () => {
  const {root, component} = setupTest();
  const handler = td.func('notifyClose handler');
  root.addEventListener(strings.CLOSED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClose();
  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyOpen fires an ${strings.OPENED_EVENT} custom event`, () => {
  const {root, component} = setupTest();
  const handler = td.func('notifyOpen handler');
  root.addEventListener(strings.OPENED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyOpen();
  td.verify(handler(td.matchers.anything()));
});

test('adapter#restoreFocus restores focus saved by adapter#saveFocus', () => {
  const {root, component} = setupTest({open: true});
  const button = bel`<button>Foo</button>`;
  document.body.appendChild(button);
  document.body.appendChild(root);
  button.focus();
  component.getDefaultFoundation().adapter_.saveFocus();
  root.focus();
  component.getDefaultFoundation().adapter_.restoreFocus();
  assert.equal(document.activeElement, button);
  document.body.removeChild(button);
  document.body.removeChild(root);
});

test('adapter#restoreFocus does not restore focus if never called adapter#saveFocus', () => {
  const {root, component} = setupTest({open: true});
  const button = bel`<button>Foo</button>`;
  document.body.appendChild(button);
  document.body.appendChild(root);
  button.focus();
  root.focus();
  component.getDefaultFoundation().adapter_.restoreFocus();
  assert.equal(document.activeElement, root);
  document.body.removeChild(button);
  document.body.removeChild(root);
});

test('adapter#restoreFocus does nothing if the active focused element is not in the menu-surface', () => {
  const {root, component} = setupTest({open: true});
  const button = bel`<button>Foo</button>`;
  document.body.appendChild(button);
  document.body.appendChild(root);
  button.focus();
  component.getDefaultFoundation().adapter_.restoreFocus();
  assert.equal(document.activeElement, button);
  document.body.removeChild(button);
  document.body.removeChild(root);
});

test('adapter#isFocused returns whether the menu surface is focused', () => {
  const {root, component} = setupTest({open: true});
  document.body.appendChild(root);
  root.focus();
  assert.isTrue(component.getDefaultFoundation().adapter_.isFocused());
  document.body.removeChild(root);
});

test('adapter#hasAnchor returns true if the menu surface has an anchor', () => {
  const anchor = bel`<div class="mdc-menu-surface--anchor"></div>`;
  const {root, component} = setupTest({open: true});
  anchor.appendChild(root);
  component.initialSyncWithDOM();
  assert.isTrue(component.getDefaultFoundation().adapter_.hasAnchor());
});

test('adapter#hasAnchor returns false if it does not have an anchor', () => {
  const notAnAnchor = bel`<div></div>`;
  const {root, component} = setupTest({open: true});
  notAnAnchor.appendChild(root);
  component.initialSyncWithDOM();
  assert.isFalse(component.getDefaultFoundation().adapter_.hasAnchor());
});

test('adapter#getAnchorDimensions returns the dimensions of the anchor element', () => {
  const anchor = bel`<div class="mdc-menu-surface--anchor" style="height: 21px; width: 42px;"></div>`;
  const {root, component} = setupTest({open: true});
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  component.initialSyncWithDOM();
  assert.equal(component.getDefaultFoundation().adapter_.getAnchorDimensions().height, 21);
  assert.equal(component.getDefaultFoundation().adapter_.getAnchorDimensions().width, 42);
  document.body.removeChild(anchor);
});

test('adapter#getAnchorDimensions returns undefined if there is no anchor element', () => {
  const {root, component} = setupTest({open: true});
  document.body.appendChild(root);
  component.initialSyncWithDOM();
  assert.isNull(component.getDefaultFoundation().adapter_.getAnchorDimensions());
  document.body.removeChild(root);
});

test('adapter#getWindowDimensions returns the dimensions of the window', () => {
  const {root, component} = setupTest({open: true});
  document.body.appendChild(root);
  assert.equal(component.getDefaultFoundation().adapter_.getWindowDimensions().height, window.innerHeight);
  assert.equal(component.getDefaultFoundation().adapter_.getWindowDimensions().width, window.innerWidth);
  document.body.removeChild(root);
});

test('adapter#getBodyDimensions returns the body dimensions', () => {
  const {root, component} = setupTest({open: true});
  document.body.appendChild(root);
  assert.equal(component.getDefaultFoundation().adapter_.getBodyDimensions().height, document.body.clientHeight);
  assert.equal(component.getDefaultFoundation().adapter_.getBodyDimensions().width, document.body.clientWidth);
  document.body.removeChild(root);
});

test('adapter#getWindowScroll returns the scroll position of the window when not scrolled', () => {
  const {root, component} = setupTest({open: true});
  document.body.appendChild(root);
  assert.equal(component.getDefaultFoundation().adapter_.getWindowScroll().x, window.pageXOffset);
  assert.equal(component.getDefaultFoundation().adapter_.getWindowScroll().y, window.pageYOffset);
  document.body.removeChild(root);
});

test('adapter#isRtl returns true for RTL documents', () => {
  const anchor = bel`<div dir="rtl" class="mdc-menu-surface--anchor"></div>`;
  const {root, component} = setupTest({open: true});
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  assert.isTrue(component.getDefaultFoundation().adapter_.isRtl());
  document.body.removeChild(anchor);
});

test('adapter#isRtl returns false for explicit LTR documents', () => {
  const anchor = bel`<div dir="ltr" class="mdc-menu-surface--anchor"></div>`;
  const {root, component} = setupTest({open: true});
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  assert.isFalse(component.getDefaultFoundation().adapter_.isRtl());
  document.body.removeChild(anchor);
});

test('adapter#isRtl returns false for implicit LTR documents', () => {
  const anchor = bel`<div class="mdc-menu-surface--anchor"></div>`;
  const {root, component} = setupTest({open: true});
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  assert.isFalse(component.getDefaultFoundation().adapter_.isRtl());
  document.body.removeChild(anchor);
});

test('adapter#isElementInContainer returns true if element is in the menu surface', () => {
  const anchor = bel`<div class="mdc-menu-surface--anchor"></div>`;
  const {root, component} = setupTest({open: true});
  const button = document.createElement('button');
  root.appendChild(button);
  anchor.appendChild(root);
  document.body.appendChild(anchor);

  assert.isTrue(component.getDefaultFoundation().adapter_.isElementInContainer(button));
  document.body.removeChild(anchor);
});

test('adapter#isElementInContainer returns true if element is the menu surface', () => {
  const anchor = bel`<div class="mdc-menu-surface--anchor"></div>`;
  const {root, component} = setupTest({open: true});
  anchor.appendChild(root);
  document.body.appendChild(anchor);

  assert.isTrue(component.getDefaultFoundation().adapter_.isElementInContainer(root));
  document.body.removeChild(anchor);
});

test('adapter#isElementInContainer returns false if element is not in the menu surface', () => {
  const anchor = bel`<div class="mdc-menu-surface--anchor"></div>`;
  const {root, component} = setupTest({open: true});
  const button = document.createElement('button');
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  document.body.appendChild(button);

  assert.isFalse(component.getDefaultFoundation().adapter_.isElementInContainer(button));
  document.body.removeChild(anchor);
  document.body.removeChild(button);
});

test('adapter#setTransformOrigin sets the correct transform origin on the menu surface element', () => {
  const {root, component} = setupTest();
  // Write expected value and read canonical value from browser.
  root.style.webkitTransformOrigin = root.style.transformOrigin = 'left top 10px';
  const expected = root.style.getPropertyValue(`${getTransformPropertyName(window)}-origin`);
  // Reset value.
  root.style.webkitTransformOrigin = root.style.transformOrigin = '';

  component.getDefaultFoundation().adapter_.setTransformOrigin('left top 10px');
  assert.equal(root.style.getPropertyValue(`${getTransformPropertyName(window)}-origin`), expected);
});

test('adapter#setPosition sets the correct position on the menu surface element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setPosition({top: 10, left: 11});
  assert.equal(root.style.top, '10px');
  assert.equal(root.style.left, '11px');
  component.getDefaultFoundation().adapter_.setPosition({bottom: 10, right: 11});
  assert.equal(root.style.bottom, '10px');
  assert.equal(root.style.right, '11px');
});

test('adapter#setMaxHeight sets the maxHeight style on the menu surface element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setMaxHeight('100px');
  assert.equal(root.style.maxHeight, '100px');
});
