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

import {assert, expect} from 'chai';
import bel from 'bel';
import td from 'testdouble';
import domEvents from 'dom-events';

import {MDCTooltip} from '../../../packages/mdc-tooltip';

const tooltipShowEvents = ['focus', 'mouseenter', 'touchstart'];
const tooltipHideEvents = ['blur', 'mouseleave', 'touchend'];
const controllerListenerTypes = tooltipShowEvents.concat(tooltipHideEvents);

function getFixture() {
  return bel`
    <div id="wrapper">
      <div id="dummy"></div>
      <button class="mdc-fab material-icons" id="example" aria-label="Favorite">
        <span class="mdc-fab__icon">
          arrow_forward
        </span>
        <span id="tooltip" class="mdc-tooltip">Right Tooltip</span>
      </button>
    </div>
  `;
}
function getFixtureUsingFor() {
  return bel`
    <div id="wrapper">
      <div id="dummy"></div>
      <button class="mdc-fab material-icons" id="example" aria-label="Favorite">
        <span class="mdc-fab__icon">
          arrow_forward
        </span>
      </button>
      <span id="tooltip" class="mdc-tooltip" for="example">Right Tooltip</span>
    </div>
  `;
}

function setupTest() {
  const wrapper = getFixture();
  const root = wrapper.querySelector('#tooltip');
  const controller = wrapper.querySelector('#example');
  const component = new MDCTooltip(wrapper);
  return {root, component, controller, wrapper};
}

suite('MDCTooltip');

test('initializes and returns a MDCTooltip instance with "new"', () => {
  const wrapper = getFixture();
  assert.isOk(new MDCTooltip(wrapper) instanceof MDCTooltip);
});

test('initializes and returns a MDCTooltip instance with "attachTo"', () => {
  assert.isOk(MDCTooltip.attachTo(getFixture()) instanceof MDCTooltip);
});

test('initializes and returns a MDCTooltip instance, using "for" attr', () => {
  const wrapper = getFixtureUsingFor();
  document.body.appendChild(wrapper);
  assert.isOk(new MDCTooltip(wrapper) instanceof MDCTooltip);
  document.body.removeChild(wrapper);
});

test('initializes throws Ref error cause ID is not found', () => {
  const wrapper = getFixtureUsingFor();
  const root = wrapper.querySelector('#tooltip');
  expect(function() {
    MDCTooltip.attachTo(root);
  }).to.throw(ReferenceError);
});


test('hide() delegates to the foundation', () => {
  const {component} = setupTest();
  component.foundation_.hide_ = td.function();
  component.hide();
  td.verify(component.foundation_.hide_());
});

test('show() delegates to the foundation', () => {
  const {component} = setupTest();
  component.foundation_.show_ = td.function();
  component.show();
  td.verify(component.foundation_.show_());
});

test('reset() hides, and recenter to controller', () => {
  const {component} = setupTest();

  component.foundation_.hide_ = td.function();
  component.foundation_.resetTooltip_ = td.function();

  component.reset();

  td.verify(component.foundation_.hide_());
  td.verify(component.foundation_.resetTooltip_());
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

test('adapter#getClassList adds a class to the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.getClassList();
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#setStyle sets the correct style on root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setStyle('transform', 'translateY(-56px)');
  assert.equal(root.style.getPropertyValue('transform'), 'translateY(-56px)');
});

test('adapter#registerWindowListener registers the handler for window - resize & load', () => {
  const {component} = setupTest();
  const handler = td.func('handler');
  component.getDefaultFoundation().adapter_.registerWindowListener('resize', handler);
  component.getDefaultFoundation().adapter_.registerWindowListener('load', handler);

  domEvents.emit(window, 'resize');
  domEvents.emit(window, 'load');

  try {
    td.verify(handler(td.matchers.anything()), {times: 2});
  } finally {
    window.removeEventListener('resize', handler);
    window.removeEventListener('load', handler);
  }
});

test('adapter#deregisterWindowListener unlistens the handler for window', () => {
  const {component} = setupTest();
  const handler = td.func('handler');
  window.addEventListener('resize', handler);
  window.addEventListener('load', handler);
  component.getDefaultFoundation().adapter_.deregisterWindowListener('resize', handler);
  component.getDefaultFoundation().adapter_.deregisterWindowListener('load', handler);

  domEvents.emit(window, 'load');
  domEvents.emit(window, 'resize');
  try {
    td.verify(handler(td.matchers.anything()), {times: 0});
  } finally {
    // Just to be safe
    window.removeEventListener('resize', handler);
    window.removeEventListener('load', handler);
  }
});

test('adapter#registerListener registers the handler for controller - focus', () => {
  const {component, controller} = setupTest();
  const handler = td.func('handler');

  for (let i = 0; i < controllerListenerTypes.length; i++) {
    component.getDefaultFoundation().adapter_.registerListener(controllerListenerTypes[i], handler);
    domEvents.emit(controller, controllerListenerTypes[i]);
  }

  try {
    td.verify(handler(td.matchers.anything()), {times: 6});
  } finally {
    for (let i = 0; i < controllerListenerTypes.length; i++) {
      controller.removeEventListener(controllerListenerTypes[i], handler);
    }
  }
});

test('adapter#deregisterListener unlistens the handler for controller', () => {
  const {component, controller} = setupTest();
  const handler = td.func('handler');

  for (let i = 0; i < controllerListenerTypes.length; i++) {
    controller.addEventListener(controllerListenerTypes[i], handler);
    component.getDefaultFoundation().adapter_.deregisterListener(controllerListenerTypes[i], handler);
    domEvents.emit(controller, controllerListenerTypes[i]);
  }

  try {
    td.verify(handler(td.matchers.anything()), {times: 0});
  } finally {
    // Just to be safe
    for (let i = 0; i < controllerListenerTypes.length; i++) {
      controller.removeEventListener(controllerListenerTypes[i], handler);
    }
  }
});

test('adapter#registerTransitionEndHandler adds a transition end event listener on the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionEndHandler');
  component.getDefaultFoundation().adapter_.registerTransitionEndHandler(handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterTransitionEndHandler removes a transition end event listener on the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('transitionEndHandler');
  root.addEventListener('transitionend', handler);

  component.getDefaultFoundation().adapter_.deregisterTransitionEndHandler(handler);
  domEvents.emit(root, 'transitionend');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('Return Visible == True if the tooltip is displayed', () => {
  const {component} = setupTest();
  component.show();
  assert.isOk(component.visible === true);
});

test('Return Visible == False if the tooltip is hidden', () => {
  const {component} = setupTest();
  component.show();
  component.hide();
  assert.isOk(component.visible === false);
});


