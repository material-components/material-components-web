/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
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

import {createMockRaf} from '../helpers/raf';
import {TRANSFORM_PROP} from './helpers';

import {cssClasses, strings} from '../../../packages/mdc-slider/constants';
import {MDCSlider} from '../../../packages/mdc-slider';

suite('MDCSlider');

function getFixture() {
  return bel`
    <div class="mdc-slider" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div class="mdc-slider__track-container">
        <div class="mdc-slider__track"></div>
        <div class="mdc-slider__track-marker-container"></div>
      </div>
      <div class="mdc-slider__thumb-container">
        <div class="mdc-slider__pin">
          <span class="mdc-slider__pin-value-marker">30</span>
        </div>
        <svg class="mdc-slider__thumb" width="21" height="21">
          <circle cx="10.5" cy="10.5" r="7.875"></circle>
        </svg>
        <div class="mdc-slider__focus-ring"></div>
      </div>
    </div>`;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCSlider(root);
  return {root, component};
}

test('attachTo() instantiates and returns an MDCSlider instance', () => {
  assert.instanceOf(MDCSlider.attachTo(getFixture()), MDCSlider);
});

test('get/set value', () => {
  const {component} = setupTest();
  component.value = 50;

  assert.equal(component.value, 50);
});

test('get/set min', () => {
  const {component} = setupTest();
  component.min = 10;

  assert.equal(component.min, 10);
});

test('get/set max', () => {
  const {component} = setupTest();
  component.max = 80;

  assert.equal(component.max, 80);
});

test('get/set step', () => {
  const {component} = setupTest();
  component.step = 2.5;

  assert.equal(component.step, 2.5);
});

test('get/set disabled', () => {
  const {component} = setupTest();
  component.disabled = true;

  assert.isTrue(component.disabled);
});

test('#layout lays out the component', () => {
  const raf = createMockRaf();
  const {root, component} = setupTest();
  raf.flush();

  component.value = 50;
  raf.flush();

  Object.assign(root.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100px',
  });

  document.body.appendChild(root);
  component.layout();
  raf.flush();

  const thumbContainer = root.querySelector(strings.THUMB_CONTAINER_SELECTOR);
  assert.include(thumbContainer.style.getPropertyValue(TRANSFORM_PROP), 'translateX(50px)');

  document.body.removeChild(root);
  raf.restore();
});

test('#initialSyncWithDOM syncs the min property with aria-valuemin', () => {
  const root = getFixture();
  root.setAttribute('aria-valuemin', '10');

  const component = new MDCSlider(root);
  assert.equal(component.min, 10);
});

test('#initialSyncWithDOM adds an aria-valuemin attribute if not present', () => {
  const root = getFixture();
  root.removeAttribute('aria-valuemin');

  const component = new MDCSlider(root);
  assert.equal(root.getAttribute('aria-valuemin'), String(component.min));
});

test('#initialSyncWithDOM syncs the max property with aria-valuemax', () => {
  const root = getFixture();
  root.setAttribute('aria-valuemax', '80');

  const component = new MDCSlider(root);
  assert.equal(component.max, 80);
});

test('#initialSyncWithDOM adds an aria-valuemax attribute if not present', () => {
  const root = getFixture();
  root.removeAttribute('aria-valuemax');

  const component = new MDCSlider(root);
  assert.equal(root.getAttribute('aria-valuemax'), String(component.max));
});

test('#initialSyncWithDOM syncs the value property with aria-valuenow for continuous slider', () => {
  const root = getFixture();
  root.setAttribute('aria-valuenow', '30');

  const component = new MDCSlider(root);
  assert.equal(component.value, 30);
});

test('#initialSyncWithDOM syncs the value property with aria-valuenow for discrete slider', () => {
  const root = getFixture();
  root.classList.add(cssClasses.DISCRETE);
  root.setAttribute('aria-valuenow', '30');

  const component = new MDCSlider(root);
  assert.equal(component.value, 30);
});

test('#initialSyncWithDOM adds an aria-valuenow attribute if not present', () => {
  const root = getFixture();
  root.removeAttribute('aria-valuenow');

  const component = new MDCSlider(root);
  assert.equal(root.getAttribute('aria-valuenow'), String(component.value));
});

test('#initialSyncWithDOM syncs the step property with data-step', () => {
  const root = getFixture();
  root.setAttribute('data-step', '2.5');

  const component = new MDCSlider(root);
  assert.equal(component.step, 2.5);
});

test('#initialSyncWithDOM disables the slider if aria-disabled is present on the component', () => {
  const root = getFixture();
  root.setAttribute('aria-disabled', 'true');

  const component = new MDCSlider(root);
  assert.isTrue(component.disabled);
});

test('#initialSyncWithDOM does not disable the component if aria-disabled is "false"', () => {
  const root = getFixture();
  root.setAttribute('aria-disabled', 'false');

  const component = new MDCSlider(root);
  assert.isFalse(component.disabled);
});

test('#stepUp increments the slider by a given value', () => {
  const {component} = setupTest();
  component.stepUp(10);

  assert.equal(component.value, 10);
});

test('#stepUp increments the slider by 1 if no value given', () => {
  const {component} = setupTest();
  component.stepUp();

  assert.equal(component.value, 1);
});

test('#stepUp increments the slider by the step value if no value given and a step is set', () => {
  const {component} = setupTest();
  component.step = 5;
  component.stepUp();

  assert.equal(component.value, 5);
});

test('#stepDown decrements the slider by a given value', () => {
  const {component} = setupTest();
  component.value = 15;
  component.stepDown(10);

  assert.equal(component.value, 5);
});

test('#stepDown decrements the slider by 1 if no value given', () => {
  const {component} = setupTest();
  component.value = 10;
  component.stepDown();

  assert.equal(component.value, 9);
});

test('#stepDown decrements the slider by the step value if no value given and a step is set', () => {
  const {component} = setupTest();
  component.step = 5;
  component.value = 15;
  component.stepDown();

  assert.equal(component.value, 10);
});

test('adapter#hasClass checks if a class exists on root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');

  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');

  assert.include(root.className, 'foo');
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');

  assert.notInclude(root.className, 'foo');
});

test('adapter#getAttribute retrieves an attribute value from the root element', () => {
  const {root, component} = setupTest();
  root.setAttribute('data-foo', 'bar');

  assert.equal(component.getDefaultFoundation().adapter_.getAttribute('data-foo'), 'bar');
});

test('adapter#setAttribute sets an attribute on the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttribute('data-foo', 'bar');

  assert.equal(root.getAttribute('data-foo'), 'bar');
});

test('adapter#removeAttribute removes an attribute from the root element', () => {
  const {root, component} = setupTest();
  root.setAttribute('data-foo', 'bar');
  component.getDefaultFoundation().adapter_.removeAttribute('data-foo');

  assert.isFalse(root.hasAttribute('data-foo'));
});

test('adapter#computeBoundingRect computes the client rect on the root element', () => {
  const {root, component} = setupTest();
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.computeBoundingRect(),
    root.getBoundingClientRect()
  );
});

test('adapter#getTabIndex gets the tabIndex property of the root element', () => {
  const {root, component} = setupTest();
  assert.equal(root.tabIndex, 0, 'sanity check');

  assert.equal(component.getDefaultFoundation().adapter_.getTabIndex(), root.tabIndex);
});

test('adapter#registerInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('interactionHandler');

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('interactionHandler');

  root.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerThumbContainerInteractionHandler adds an event listener to the thumb container element', () => {
  const {root, component} = setupTest();
  const thumbContainer = root.querySelector(strings.THUMB_CONTAINER_SELECTOR);
  const handler = td.func('interactionHandler');

  component.getDefaultFoundation().adapter_.registerThumbContainerInteractionHandler('click', handler);
  domEvents.emit(thumbContainer, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterThumbContainerInteractionHandler removes an event listener from ' +
     'the thumb container element', () => {
  const {root, component} = setupTest();
  const thumbContainer = root.querySelector(strings.THUMB_CONTAINER_SELECTOR);
  const handler = td.func('interactionHandler');

  thumbContainer.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterThumbContainerInteractionHandler('click', handler);
  domEvents.emit(thumbContainer, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerBodyInteractionHandler adds an event listener to the body element', () => {
  const {component} = setupTest();
  const handler = td.func('interactionHandler');

  component.getDefaultFoundation().adapter_.registerBodyInteractionHandler('click', handler);
  domEvents.emit(document.body, 'click');
  document.body.removeEventListener('click', handler);

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterBodyInteractionHandler removes an event listener from the body element', () => {
  const {component} = setupTest();
  const handler = td.func('interactionHandler');

  document.body.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterBodyInteractionHandler('click', handler);
  domEvents.emit(document.body, 'click');
  // Just in case deregisterBodyInteractionHandler doesn't work as expected
  document.body.removeEventListener('click', handler);

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerResizeHandler adds an event listener for the window\'s "resize" event', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');

  component.getDefaultFoundation().adapter_.registerResizeHandler(handler);
  domEvents.emit(window, 'resize');
  window.removeEventListener('resize', handler);

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterResizeHandler removes an event listener for the window\'s "resize" event', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');

  window.addEventListener('resize', handler);
  component.getDefaultFoundation().adapter_.deregisterResizeHandler(handler);
  domEvents.emit(window, 'resize');
  // Just in case deregisterResizeHandler doesn't work as expected
  window.removeEventListener('resize', handler);

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#notifyInput emits a MDCSlider:input event with the slider instance as its detail', () => {
  const {root, component} = setupTest();
  const handler = td.func('inputHandler');

  root.addEventListener(strings.INPUT_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyInput();

  td.verify(handler(td.matchers.argThat(({detail}) => detail === component)));
});

test('adapter#notifyChange emits a MDCSlider:change event with the slider instance as its detail', () => {
  const {root, component} = setupTest();
  const handler = td.func('changeHandler');

  root.addEventListener(strings.CHANGE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyChange();

  td.verify(handler(td.matchers.argThat(({detail}) => detail === component)));
});

test('adapter#setThumbContainerStyleProperty sets a style property on the thumb container element', () => {
  const {root, component} = setupTest();
  const thumbContainer = root.querySelector(strings.THUMB_CONTAINER_SELECTOR);

  const div = bel`<div></div>`;
  div.style.backgroundColor = 'black';

  component.getDefaultFoundation().adapter_.setThumbContainerStyleProperty('background-color', 'black');

  assert.equal(thumbContainer.style.backgroundColor, div.style.backgroundColor);
});

test('adapter#setTrackStyleProperty sets a style property on the track element', () => {
  const {root, component} = setupTest();
  const track = root.querySelector(strings.TRACK_SELECTOR);

  const div = bel`<div></div>`;
  div.style.backgroundColor = 'black';

  component.getDefaultFoundation().adapter_.setTrackStyleProperty('background-color', 'black');

  assert.equal(track.style.backgroundColor, div.style.backgroundColor);
});

test('adapter#setMarkerValue changes the value on pin value markers', () => {
  const {root, component} = setupTest();
  const pinValueMarker = root.querySelector(strings.PIN_VALUE_MARKER_SELECTOR);

  component.getDefaultFoundation().adapter_.setMarkerValue(10);

  assert.equal(pinValueMarker.innerHTML, 10);
});

test('adapter#appendTrackMarkers appends correct number of markers to track', () => {
  const {root, component} = setupTest();
  const markerContainer = root.querySelector(strings.TRACK_MARKER_CONTAINER_SELECTOR);

  component.getDefaultFoundation().adapter_.appendTrackMarkers(1);

  assert.equal(markerContainer.firstChild.className, 'mdc-slider__track-marker');
  assert.equal(markerContainer.childNodes.length, 1);
});

test('adapter#removeTrackMarkers all markers from track', () => {
  const {root, component} = setupTest();
  const markerContainer = root.querySelector(strings.TRACK_MARKER_CONTAINER_SELECTOR);

  component.getDefaultFoundation().adapter_.appendTrackMarkers(1);
  assert.equal(markerContainer.childNodes.length, 1);

  component.getDefaultFoundation().adapter_.removeTrackMarkers();
  assert.equal(markerContainer.childNodes.length, 0);
});

test('adapter#setLastTrackMarkersStyleProperty all markers from track', () => {
  const {root, component} = setupTest();

  // We need to first append one marker to the container
  component.getDefaultFoundation().adapter_.appendTrackMarkers(1);
  const lastMarker = root.querySelector(strings.LAST_TRACK_MARKER_SELECTOR);

  const div = bel`<div></div>`;
  div.style.flex = 0.5;

  component.getDefaultFoundation().adapter_.setLastTrackMarkersStyleProperty('flex', 0.5);

  assert.equal(lastMarker.style.flex, div.style.flex);
});

test('adapter#isRTL returns true when component is in an RTL context', () => {
  const wrapper = bel`<div dir="rtl"></div>`;
  const {root, component} = setupTest();
  wrapper.appendChild(root);
  document.body.appendChild(wrapper);

  assert.isTrue(component.getDefaultFoundation().adapter_.isRTL());

  document.body.removeChild(wrapper);
});

test('adapter#isRTL returns false when component is not in an RTL context', () => {
  const wrapper = bel`<div dir="ltr"></div>`;
  const {root, component} = setupTest();
  wrapper.appendChild(root);
  document.body.appendChild(wrapper);

  assert.isFalse(component.getDefaultFoundation().adapter_.isRTL());

  document.body.removeChild(wrapper);
});
