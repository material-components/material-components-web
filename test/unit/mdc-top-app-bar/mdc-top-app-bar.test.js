/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';

import {MDCTopAppBar} from '../../../packages/mdc-top-app-bar';
import {strings} from '../../../packages/mdc-top-app-bar/constants';
import MDCTopAppBarFoundation from '../../../packages/mdc-top-app-bar/foundation';
import MDCFixedTopAppBarFoundation from '../../../packages/mdc-top-app-bar/fixed/foundation';
import MDCShortTopAppBarFoundation from '../../../packages/mdc-top-app-bar/short/foundation';

const MENU_ICONS_COUNT = 3;

function getFixture(removeIcon) {
  const html = bel`
    <div>
        <header class="mdc-top-app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
          <span class="mdc-top-app-bar__title">Title</span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" 
        role="top-app-bar">
          <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Download" alt="Download">
          file_download</a>
          <a href="#" class="material-icons mdc-top-app-bar__action-item" 
             aria-label="Print this page" alt="Print this page">
          print</a>
          <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Bookmark this page" 
          alt="Bookmark this page">bookmark</a>
          <div class="mdc-menu-anchor">
            <div class="mdc-menu" tabindex="-1" id="demo-menu">
              <ul class="mdc-menu__items mdc-list" role="menu" aria-hidden="true" style="transform: scale(1, 1);">
              </ul>
            </div>
          </div>
        </section>
      </div>
    </header>
      <main class="mdc-top-app-bar-fixed-adjust">
      </main>
    </div>
  `;

  if (removeIcon) {
    const icon = html.querySelector(strings.NAVIGATION_ICON_SELECTOR);
    icon.parentNode.removeChild(icon);
  }

  return html;
}

class FakeRipple {
  constructor(root) {
    this.root = root;
    this.destroy = td.func('.destroy');
    this.unbounded = null;
  }
}

function setupTest(removeIcon = false, rippleFactory = (el) => new FakeRipple(el)) {
  const fixture = getFixture(removeIcon);
  const root = fixture.querySelector(strings.ROOT_SELECTOR);
  const icon = root.querySelector(strings.NAVIGATION_ICON_SELECTOR);
  const component = new MDCTopAppBar(root, undefined, rippleFactory);

  return {root, component, icon};
}

suite('MDCTopAppBar');

test('attachTo initializes and returns an MDCTopAppBar instance', () => {
  assert.isTrue(MDCTopAppBar.attachTo(getFixture()) instanceof MDCTopAppBar);
});

test('constructor instantiates icon ripples for all icons', () => {
  const rippleFactory = td.function();
  // Including navigation icon.
  const totalIcons = MENU_ICONS_COUNT + 1;

  td.when(rippleFactory(td.matchers.anything()), {times: totalIcons}).thenReturn((el) => new FakeRipple(el));
  setupTest(/** removeIcon */ false, rippleFactory);
});

test('constructor does not instantiate ripple for nav icon when not present', () => {
  const rippleFactory = td.function();
  const totalIcons = MENU_ICONS_COUNT;

  td.when(rippleFactory(td.matchers.anything()), {times: totalIcons}).thenReturn((el) => new FakeRipple(el));
  setupTest(/** removeIcon */ true, rippleFactory);
});

test('destroy destroys icon ripples', () => {
  const {component} = setupTest();
  component.destroy();
  component.iconRipples_.forEach((icon) => {
    td.verify(icon.destroy());
  });
});

test('getDefaultFoundation returns the appropriate foundation for default', () => {
  const fixture = getFixture();
  const root = fixture.querySelector(strings.ROOT_SELECTOR);
  const component = new MDCTopAppBar(root, undefined, (el) => new FakeRipple(el));
  assert.isTrue(component.foundation_ instanceof MDCTopAppBarFoundation);
  assert.isFalse(component.foundation_ instanceof MDCShortTopAppBarFoundation);
  assert.isFalse(component.foundation_ instanceof MDCFixedTopAppBarFoundation);
});

test('getDefaultFoundation returns the appropriate foundation for fixed', () => {
  const fixture = getFixture();
  const root = fixture.querySelector(strings.ROOT_SELECTOR);
  root.classList.add(MDCTopAppBarFoundation.cssClasses.FIXED_CLASS);
  const component = new MDCTopAppBar(root, undefined, (el) => new FakeRipple(el));
  assert.isFalse(component.foundation_ instanceof MDCShortTopAppBarFoundation);
  assert.isTrue(component.foundation_ instanceof MDCFixedTopAppBarFoundation);
});

test('getDefaultFoundation returns the appropriate foundation for short', () => {
  const fixture = getFixture();
  const root = fixture.querySelector(strings.ROOT_SELECTOR);
  root.classList.add(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS);
  const component = new MDCTopAppBar(root, undefined, (el) => new FakeRipple(el));
  assert.isTrue(component.foundation_ instanceof MDCShortTopAppBarFoundation);
  assert.isFalse(component.foundation_ instanceof MDCFixedTopAppBarFoundation);
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

test('adapter#setStyle sets a style attribute on the root element', () => {
  const {root, component} = setupTest();
  assert.isFalse(root.style.getPropertyValue('top') === '1px');
  component.getDefaultFoundation().adapter_.setStyle('top', '1px');
  assert.isTrue(root.style.getPropertyValue('top') === '1px');
});

test('registerNavigationIconInteractionHandler does not add a handler to the nav icon if the nav icon is null', () => {
  const {component} = setupTest(true);
  const handler = td.func('eventHandler');

  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.registerNavigationIconInteractionHandler('click', handler));
});

test('#adapter.registerNavigationIconInteractionHandler adds a handler to the nav icon ' +
  'element for a given event', () => {
  const {component, icon} = setupTest();
  const handler = td.func('eventHandler');
  component.getDefaultFoundation().adapter_.registerNavigationIconInteractionHandler('click', handler);
  domEvents.emit(icon, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterScrollHandler does not remove a handler from the nav icon if the nav icon is null ', () => {
  const {component} = setupTest(true);
  const handler = td.func('eventHandler');

  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.deregisterNavigationIconInteractionHandler('click', handler));
});

test('#adapter.deregisterNavigationIconInteractionHandler removes a handler from the nav icon ' +
  'element for a given event', () => {
  const {component, icon} = setupTest();
  const handler = td.func('eventHandler');

  icon.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterNavigationIconInteractionHandler('click', handler);
  domEvents.emit(icon, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.registerScrollHandler adds a scroll handler to the window ' +
  'element for a given event', () => {
  const {component} = setupTest();
  const handler = td.func('scrollHandler');
  component.getDefaultFoundation().adapter_.registerScrollHandler(handler);

  domEvents.emit(window, 'scroll');
  try {
    td.verify(handler(td.matchers.anything()));
  } finally {
    // Just to be safe
    window.removeEventListener('scroll', handler);
  }
});

test('#adapter.deregisterScrollHandler removes a scroll handler from the window ' +
  'element for a given event', () => {
  const {component} = setupTest();
  const handler = td.func('scrollHandler');
  window.addEventListener('scroll', handler);
  component.getDefaultFoundation().adapter_.deregisterScrollHandler(handler);
  domEvents.emit(window, 'scroll');
  try {
    td.verify(handler(td.matchers.anything()), {times: 0});
  } finally {
    // Just to be safe
    window.removeEventListener('scroll', handler);
  }
});

test('#adapter.registerResizeHandler adds a resize handler to the window', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');
  component.getDefaultFoundation().adapter_.registerResizeHandler(handler);

  domEvents.emit(window, 'resize');
  try {
    td.verify(handler(td.matchers.anything()));
  } finally {
    // Just to be safe
    window.removeEventListener('resize', handler);
  }
});

test('#adapter.deregisterResizeHandler removes a resize handler from the window', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');
  window.addEventListener('resize', handler);
  component.getDefaultFoundation().adapter_.deregisterResizeHandler(handler);
  domEvents.emit(window, 'resize');
  try {
    td.verify(handler(td.matchers.anything()), {times: 0});
  } finally {
    // Just to be safe
    window.removeEventListener('resize', handler);
  }
});

test('adapter#getViewportScrollY returns scroll distance', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getViewportScrollY(), window.pageYOffset);
});

test('adapter#getTotalActionItems returns the number of action items on the opposite side of the menu', () => {
  const {root, component} = setupTest();
  const adapterReturn = component.getDefaultFoundation().adapter_.getTotalActionItems();
  const actual = root.querySelectorAll(strings.ACTION_ITEM_SELECTOR).length;
  assert.isTrue(adapterReturn === actual);
});
