/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {MDCDrawer} from '../../../packages/mdc-drawer';

function getFixtureWithAppContent() {
  return bel`
    <div class="body-content">
      <div class="mdc-drawer mdc-drawer--dismissible">
        <div class="mdc-drawer__scrollable">
        <div class="mdc-list-group">
          <nav class="mdc-list">
            <a class="mdc-list-item mdc-list-item--activated demo-drawer-list-item" href="#">
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
            </a>
          </nav>
        </div>
      </div>
      <div class="mdc-drawer-app-content">
        <p>App content</p>
      </div>
    </div>
  `;
}

function getFixture() {
  return bel`
  <div class="body-content">
    <div class="mdc-drawer mdc-drawer--dismissible">
      <div class="mdc-drawer__scrollable">
      <div class="mdc-list-group">
        <nav class="mdc-list">
          <a class="mdc-list-item mdc-list-item--activated demo-drawer-list-item" href="#">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
          </a>
        </nav>
      </div>
    </div>
  </div>
`;
}

function setupTest(withAppContent) {
  const root = withAppContent ? getFixtureWithAppContent() : getFixture();
  const drawer = root.querySelector('.mdc-drawer');
  const appContent = root.querySelector('.mdc-drawer-app-content');
  const component = new MDCDrawer(drawer);
  return {appContent, root, drawer, component};
}
suite('MDCDrawer');

test('attachTo initializes and returns a MDCDrawer instance', () => {
  const drawer = getFixture().querySelector('.mdc-drawer');
  assert.isTrue(MDCDrawer.attachTo(drawer) instanceof MDCDrawer);
});

test('#initialize creates appContent element', () => {
  const {component} = setupTest(true);
  assert.exists(component.appContent_);
});

test('#initialize does not create appContent element if it doesn\'t exists', () => {
  const {component} = setupTest();
  assert.notExists(component.appContent_);
});

test('#get open calls foundation.isOpen', () => {
  const {component} = setupTest();
  component.foundation_.isOpen = td.func();
  component.open;
  td.verify(component.foundation_.isOpen(), {times: 1});
});

test('#set open true calls foundation.open', () => {
  const {component} = setupTest();
  component.foundation_.open = td.func();
  component.open = true;
  td.verify(component.foundation_.open(), {times: 1});
});

test('#set open false calls foundation.close', () => {
  const {component} = setupTest();
  component.foundation_.close = td.func();
  component.open = false;
  td.verify(component.foundation_.close(), {times: 1});
});

test('keydown event calls foundation.handleKeydown method', () => {
  const {component} = setupTest();
  component.foundation_.handleKeydown = td.func();
  component.initialSyncWithDOM();
  domEvents.emit(document, 'keydown');
  td.verify(component.foundation_.handleKeydown(td.matchers.isA(Object)), {times: 1});
});

test('transitionend event calls foundation.handleTransitionEnd method', () => {
  const {component, drawer} = setupTest();
  component.foundation_.handleTransitionEnd = td.func();
  component.initialSyncWithDOM();
  domEvents.emit(drawer, 'transitionend');
  td.verify(component.foundation_.handleTransitionEnd(td.matchers.isA(Object)), {times: 1});
});

test('#destroy removes keydown event listener', () => {
  const {component} = setupTest();
  const originalRemove = document.removeEventListener;
  document.removeEventListener = td.func();
  component.destroy();
  td.verify(document.removeEventListener('keydown', td.matchers.isA(Function)), {times: 1});
  document.removeEventListener = originalRemove;
});

test('#destroy removes transitionend event listener', () => {
  const {component, drawer} = setupTest();
  drawer.removeEventListener = td.func();
  component.destroy();
  td.verify(drawer.removeEventListener('transitionend', td.matchers.isA(Function)), {times: 1});
});

test('adapter#addClass adds class to drawer', () => {
  const {component, drawer} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('test-class');
  assert.isTrue(drawer.classList.contains('test-class'));
});

test('adapter#removeClass adds class to drawer', () => {
  const {component, drawer} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('test-class');

  component.getDefaultFoundation().adapter_.removeClass('test-class');
  assert.isFalse(drawer.classList.contains('test-class'));
});

test('adapter#hasClass returns true when class is on drawer element', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('test-class');
  const hasClass = component.getDefaultFoundation().adapter_.hasClass('test-class');
  assert.isTrue(hasClass);
});

test('adapter#hasClass returns false when there is no class on drawer element', () => {
  const {component} = setupTest();
  const hasClass = component.getDefaultFoundation().adapter_.hasClass('test-class');
  assert.isFalse(hasClass);
});

test('adapter#setStyleAppContent updates styles on the appContent', () => {
  const {appContent, component} = setupTest(true);
  component.getDefaultFoundation().adapter_.setStyleAppContent('display', 'inline-block');
  assert.equal(appContent.style['display'], 'inline-block');
});

test('adapter#setStyleAppContent doesn\'t throw an error if appContent element does not exist', () => {
  const {component} = setupTest();
  assert.doesNotThrow(component.getDefaultFoundation().adapter_.setStyleAppContent);
});

test('adapter#computeBoundingRect returns the client rect object on the root element', () => {
  const {root, drawer, component} = setupTest();
  document.body.appendChild(root);
  assert.deepEqual(component.getDefaultFoundation().adapter_.computeBoundingRect(), drawer.getBoundingClientRect());
  document.body.removeChild(root);
});

test('adapter#addClassAppContent adds class to appContent element', () => {
  const {component, appContent} = setupTest(true);
  component.getDefaultFoundation().adapter_.addClassAppContent('test-class');
  assert.isTrue(appContent.classList.contains('test-class'));
});

test('adapter#addClassAppContent doesn\'t add a class if there is no appContent element', () => {
  const {component} = setupTest();
  assert.doesNotThrow(component.getDefaultFoundation().adapter_.addClassAppContent);
});

test('adapter#removeClassAppContent removes class from appContent element', () => {
  const {component, appContent} = setupTest(true);
  component.getDefaultFoundation().adapter_.addClassAppContent('test-class');

  component.getDefaultFoundation().adapter_.removeClassAppContent('test-class');
  assert.isFalse(appContent.classList.contains('test-class'));
});

test('adapter#removeClassAppContent doesn\'t remove class if there is no appContent element', () => {
  const {component} = setupTest();
  assert.doesNotThrow(component.getDefaultFoundation().adapter_.removeClassAppContent);
});

test('adapter#isRtl returns true if dir="rtl"', () => {
  const fixture = bel`
    <div class="body-content" dir='rtl'>
      <div class="mdc-drawer mdc-drawer--dismissible"></div>
    </div>
  `;
  const drawer = fixture.querySelector('.mdc-drawer');
  const component = new MDCDrawer(drawer);
  document.body.appendChild(fixture);
  assert.isTrue(component.getDefaultFoundation().adapter_.isRtl());
});

test('adapter#isRtl returns false if dir not set', () => {
  const fixture = bel`
    <div class="body-content">
      <div class="mdc-drawer mdc-drawer--dismissible"></div>
    </div>
  `;
  const drawer = fixture.querySelector('.mdc-drawer');
  const component = new MDCDrawer(drawer);
  document.body.appendChild(fixture);
  assert.isFalse(component.getDefaultFoundation().adapter_.isRtl());
});
