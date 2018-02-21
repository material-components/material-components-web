/**
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

function getFixture(removeIcon) {
  const html = bel`
    <div>
        <header class="mdc-top-app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a href="#" class="material-icons mdc-top-app-bar__menu-icon">menu</a>
          <span class="mdc-top-app-bar__title">Title</span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" 
        role="top-app-bar">
          <a href="#" class="material-icons mdc-top-app-bar__icon" aria-label="Download" alt="Download">
          file_download</a>
          <a href="#" class="material-icons mdc-top-app-bar__icon" aria-label="Print this page" alt="Print this page">
          print</a>
          <a href="#" class="material-icons mdc-top-app-bar__icon" aria-label="Bookmark this page" 
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
    const icon = html.querySelector('.mdc-top-app-bar__menu-icon');
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

function setupTest(removeIcon = false) {
  const fixture = getFixture(removeIcon);
  const root = fixture.querySelector('.mdc-top-app-bar');
  const adjust = fixture.querySelector('.mdc-top-app-bar-fixed-adjust');
  const icon = root.querySelector('.mdc-top-app-bar__menu-icon');
  const component = new MDCTopAppBar(root, undefined, (el) => new FakeRipple(el));

  return {root, adjust, component, icon};
}

suite('MDCTopAppBar');

test('attachTo initializes and returns an MDCTopAppBar instance', () => {
  assert.isTrue(MDCTopAppBar.attachTo(getFixture()) instanceof MDCTopAppBar);
});

test('constructor instantiates icon ripples', () => {
  const {root, component} = setupTest();
  const totalIcons = root.querySelectorAll('.mdc-top-app-bar__icon, .mdc-top-app-bar__menu-icon').length;

  assert.isTrue(component.iconRipples_.length === totalIcons);
});

test('destroy destroys icon ripples', () => {
  const {component} = setupTest();
  component.destroy();
  component.iconRipples_.forEach((icon) => {
    td.verify(icon.destroy());
  });
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

test('registerNavigationIconInteractionHandler does not add a handler to the nav icon ', () => {
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

test('#adapter.deregisterNavigationIconInteractionHandler removes a handler from the nav icon ' +
  'element for a given event', () => {
  const {component, icon} = setupTest();
  const handler = td.func('eventHandler');

  icon.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterNavigationIconInteractionHandler('click', handler);
  domEvents.emit(icon, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});
