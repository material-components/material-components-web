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

import {MDCTopAppBar} from '../../../packages/mdc-top-app-bar';
import {strings} from '../../../packages/mdc-top-app-bar/constants';

function getFixture() {
  return bel`
    <div>
        <header class="mdc-top-app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a href="#" class="material-icons mdc-top-app-bar__menu-icon">menu</a>
          <span class="mdc-top-app-bar__title">Title</span>
        </section>
        <section id="iconSection" class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" 
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
}

function setupTest() {
  const fixture = getFixture();
  const root = fixture.querySelector('.mdc-top-app-bar');
  const adjust = fixture.querySelector('.mdc-top-app-bar-fixed-adjust');
  const component = new MDCTopAppBar(root);
  return {root, adjust, component};
}

suite('MDCTopAppBar');

test('attachTo initializes and returns an MDCTopAppBar instance', () => {
  assert.isOk(MDCTopAppBar.attachTo(getFixture()) instanceof MDCTopAppBar);
});

test('navIcon click listener is added to the navicon', (done) => {
  const element = getFixture();
  const icon = element.querySelector(strings.MENU_ICON_SELECTOR);

  MDCTopAppBar.attachTo(element);
  element.addEventListener(strings.NAVIGATION_EVENT, function() {
    done();
  });

  icon.click();
});

test('navIcon click listener is removed during destroy', (done) => {
  const element = getFixture();
  const icon = element.querySelector(strings.MENU_ICON_SELECTOR);
  const toolbar = MDCTopAppBar.attachTo(element);
  element.addEventListener(strings.NAVIGATION_EVENT, function() {
    done(new Error('navIcon eventListener should have been removed'));
  });

  toolbar.destroy();

  icon.click();
  done();
});

test('adapter#hasClass returns true if the root element has specified class', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#hasClass returns false if the root element does not have specified class', () => {
  const {component} = setupTest();
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});
