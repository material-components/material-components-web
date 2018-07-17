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

import {MDCTooltip} from '../../../packages/mdc-tooltip';
import MDCTooltipFoundation from '../../../packages/mdc-tooltip/foundation';

const eventInfo = {
  'click': 'handleClick',
  'mouseenter': 'handleMouseEnter',
  'focus': 'handleFocus',
  'touchstart': 'handleTouchStart',
  'mouseleave': 'handleMouseLeave',
  'touchend': 'handleTouchEnd',
  'blur': 'handleBlur',
};

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

function setupTest(mockFoundationFlag) {
  const wrapper = getFixture();
  const root = wrapper.querySelector('#tooltip');
  const controller = wrapper.querySelector('#example');

  if (mockFoundationFlag) {
    const MockFoundationCtor = td.constructor(MDCTooltipFoundation);
    const mockFoundation = new MockFoundationCtor();
    const component = new MDCTooltip(wrapper, mockFoundation);
    return {root, component, controller, wrapper, mockFoundation};
  } else {
    const component = new MDCTooltip(wrapper);
    return {root, component, controller, wrapper};
  }
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
  const {component} = setupTest(false);
  component.foundation_.hide = td.function();
  component.hide();
  td.verify(component.foundation_.hide());
});

test('show() delegates to the foundation', () => {
  const {component} = setupTest(false);
  component.foundation_.show = td.function();
  component.show();
  td.verify(component.foundation_.show());
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest(false);
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest(false);
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('adapter#getClassList adds a class to the root element', () => {
  const {root, component} = setupTest(false);
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.getClassList();
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#setStyle sets the correct style on root element', () => {
  const {root, component} = setupTest(false);
  component.getDefaultFoundation().adapter_.setStyle('transform', 'translateY(-56px)');
  assert.equal(root.style.getPropertyValue('transform'), 'translateY(-56px)');
});

test('Return Visible == True if the tooltip is displayed', () => {
  const {component} = setupTest(false);
  component.show();
  assert.isOk(component.visible === true);
});

test('Return Visible == False if the tooltip is hidden', () => {
  const {component} = setupTest(false);
  component.show();
  component.hide();
  assert.isOk(component.visible === false);
});

test('hideDelay() getter/setter', () => {
  const {component} = setupTest(false);
  component.hideDelay = 100;
  assert.isOk(component.hideDelay === 100);
});

test('showDelay() getter/setter', () => {
  const {component} = setupTest(false);
  component.showDelay = 100;
  assert.isOk(component.showDelay === 100);
});

test('gap() getter/setter', () => {
  const {component} = setupTest(false);
  component.gap = 100;
  assert.isOk(component.gap === 100);
});

test('click handler is added to controlling element', () => {
  const {controller, mockFoundation} = setupTest(true);
  const event = document.createEvent('Event');
  event.initEvent('click', false, true);
  controller.dispatchEvent(event);
  td.verify(mockFoundation.handleClick(event), {times: 1});
});

test('click handler is removed from the controlling element on destroy', () => {
  const {component, controller, mockFoundation} = setupTest(true);
  component.destroy();
  const event = document.createEvent('Event');
  event.initEvent('click', false, true);
  controller.dispatchEvent(event);
  td.verify(mockFoundation.handleClick(event), {times: 0});
});

Object.keys(eventInfo).forEach( (key) => {
  test(key + ' handler is added to controlling element', () => {
    const {controller, mockFoundation} = setupTest(true);
    const event = document.createEvent('Event');
    event.initEvent(key, false, true);
    controller.dispatchEvent(event);
    td.verify(mockFoundation[eventInfo[key]](event), {times: 1});
  });

  test(key + ' handler is removed from the controlling element on destroy', () => {
    const {component, controller, mockFoundation} = setupTest(true);
    component.destroy();
    const event = document.createEvent('Event');
    event.initEvent(key, false, true);
    controller.dispatchEvent(event);
    td.verify(mockFoundation[eventInfo[key]](event), {times: 0});
  });
});
