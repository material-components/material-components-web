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

import {TRANSFORM_PROP} from './helpers';
import {cssClasses, strings} from '../constants';
import {MDCSlider} from '../index';
import {emitEvent} from '../../../testing/dom/events';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
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
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCSlider(root);
  return {root, component};
}

describe('MDCSlider', () => {
  setUpMdcTestEnvironment();

  it('attachTo() instantiates and returns an MDCSlider instance', () => {
    expect(MDCSlider.attachTo(getFixture())).toEqual(jasmine.any(MDCSlider));
  });

  it('get/set value', () => {
    const {component} = setupTest();
    component.value = 50;

    expect(component.value).toEqual(50);
  });

  it('get/set min', () => {
    const {component} = setupTest();
    component.min = 10;

    expect(component.min).toEqual(10);
  });

  it('get/set max', () => {
    const {component} = setupTest();
    component.max = 80;

    expect(component.max).toEqual(80);
  });

  it('get/set step', () => {
    const {component} = setupTest();
    component.step = 2.5;

    expect(component.step).toEqual(2.5);
  });

  it('get/set disabled', () => {
    const {component} = setupTest();
    component.disabled = true;

    expect(component.disabled).toBe(true);
  });

  it('#layout lays out the component', () => {
    const {root, component} = setupTest();
    jasmine.clock().tick(1);

    component.value = 50;
    jasmine.clock().tick(1);

    root.style.position = 'absolute';
    root.style.left = '0';
    root.style.top = '0';
    root.style.width = '100px';

    document.body.appendChild(root);
    component.layout();
    jasmine.clock().tick(1);

    const thumbContainer = root.querySelector(strings.THUMB_CONTAINER_SELECTOR) as HTMLElement;
    expect(thumbContainer.style.getPropertyValue(TRANSFORM_PROP)).toContain('translateX(50px)');

    document.body.removeChild(root);
  });

  it('#initialSyncWithDOM syncs the min property with aria-valuemin', () => {
    const root = getFixture();
    root.setAttribute('aria-valuemin', '10');

    const component = new MDCSlider(root);
    expect(component.min).toEqual(10);
  });

  it('#initialSyncWithDOM adds an aria-valuemin attribute if not present', () => {
    const root = getFixture();
    root.removeAttribute('aria-valuemin');

    const component = new MDCSlider(root);
    expect(root.getAttribute('aria-valuemin')).toEqual(String(component.min));
  });

  it('#initialSyncWithDOM syncs the max property with aria-valuemax', () => {
    const root = getFixture();
    root.setAttribute('aria-valuemax', '80');

    const component = new MDCSlider(root);
    expect(component.max).toEqual(80);
  });

  it('#initialSyncWithDOM adds an aria-valuemax attribute if not present', () => {
    const root = getFixture();
    root.removeAttribute('aria-valuemax');

    const component = new MDCSlider(root);
    expect(root.getAttribute('aria-valuemax')).toEqual(String(component.max));
  });

  it('#initialSyncWithDOM syncs a custom range with aria-valuemin and aria-valuemax', () => {
    const root = getFixture();
    root.setAttribute('aria-valuemin', '2001');
    root.setAttribute('aria-valuemax', '2017');

    const component = new MDCSlider(root);
    expect(component.min).toEqual(2001);
    expect(component.max).toEqual(2017);
  });

  it('#initialSyncWithDOM syncs the value property with aria-valuenow for continuous slider', () => {
    const root = getFixture();
    root.setAttribute('aria-valuenow', '30');

    const component = new MDCSlider(root);
    expect(component.value).toEqual(30);
  });

  it('#initialSyncWithDOM syncs the value property with aria-valuenow for discrete slider', () => {
    const root = getFixture();
    root.classList.add(cssClasses.DISCRETE);
    root.setAttribute('aria-valuenow', '30');

    const component = new MDCSlider(root);
    expect(component.value).toEqual(30);
  });

  it('#initialSyncWithDOM adds an aria-valuenow attribute if not present', () => {
    const root = getFixture();
    root.removeAttribute('aria-valuenow');

    const component = new MDCSlider(root);
    expect(root.getAttribute('aria-valuenow')).toEqual(String(component.value));
  });

  it('#initialSyncWithDOM syncs the step property with data-step', () => {
    const root = getFixture();
    root.setAttribute('data-step', '2.5');

    const component = new MDCSlider(root);
    expect(component.step).toEqual(2.5);
  });

  it('#initialSyncWithDOM disables the slider if aria-disabled is present on the component', () => {
    const root = getFixture();
    root.setAttribute('aria-disabled', 'true');

    const component = new MDCSlider(root);
    expect(component.disabled).toBe(true);
  });

  it('#initialSyncWithDOM does not disable the component if aria-disabled is "false"', () => {
    const root = getFixture();
    root.setAttribute('aria-disabled', 'false');

    const component = new MDCSlider(root);
    expect(component.disabled).toBe(false);
  });

  it('#stepUp increments the slider by a given value', () => {
    const {component} = setupTest();
    component.stepUp(10);

    expect(component.value).toEqual(10);
  });

  it('#stepUp increments the slider by 1 if no value given', () => {
    const {component} = setupTest();
    component.stepUp();

    expect(component.value).toEqual(1);
  });

  it('#stepUp increments the slider by the step value if no value given and a step is set', () => {
    const {component} = setupTest();
    component.step = 5;
    component.stepUp();

    expect(component.value).toEqual(5);
  });

  it('#stepDown decrements the slider by a given value', () => {
    const {component} = setupTest();
    component.value = 15;
    component.stepDown(10);

    expect(component.value).toEqual(5);
  });

  it('#stepDown decrements the slider by 1 if no value given', () => {
    const {component} = setupTest();
    component.value = 10;
    component.stepDown();

    expect(component.value).toEqual(9);
  });

  it('#stepDown decrements the slider by the step value if no value given and a step is set', () => {
    const {component} = setupTest();
    component.step = 5;
    component.value = 15;
    component.stepDown();

    expect(component.value).toEqual(10);
  });

  it('adapter#hasClass checks if a class exists on root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');

    expect((component.getDefaultFoundation() as any).adapter_.hasClass('foo')).toBe(true);
  });

  it('adapter#addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.addClass('foo');

    expect(root.className).toContain('foo');
  });

  it('adapter#removeClass removes a class from the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter_.removeClass('foo');

    expect(root.className).not.toContain('foo');
  });

  it('adapter#getAttribute retrieves an attribute value from the root element', () => {
    const {root, component} = setupTest();
    root.setAttribute('data-foo', 'bar');

    expect((component.getDefaultFoundation() as any).adapter_.getAttribute('data-foo')).toEqual('bar');
  });

  it('adapter#setAttribute sets an attribute on the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.setAttribute('data-foo', 'bar');

    expect(root.getAttribute('data-foo')).toEqual('bar');
  });

  it('adapter#removeAttribute removes an attribute from the root element', () => {
    const {root, component} = setupTest();
    root.setAttribute('data-foo', 'bar');
    (component.getDefaultFoundation() as any).adapter_.removeAttribute('data-foo');

    expect(root.hasAttribute('data-foo')).toBe(false);
  });

  it('adapter#computeBoundingRect computes the client rect on the root element', () => {
    const {root, component} = setupTest();
    expect(
      (component.getDefaultFoundation() as any).adapter_.computeBoundingRect()).toEqual(root.getBoundingClientRect()
    );
  });

  it('adapter#getTabIndex gets the tabIndex property of the root element', () => {
    const {root, component} = setupTest();
    expect(root.tabIndex).toEqual(0, 'sanity check');

    expect((component.getDefaultFoundation() as any).adapter_.getTabIndex()).toEqual(root.tabIndex);
  });

  it('adapter#registerInteractionHandler adds an event listener to the root element', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('interactionHandler');

    (component.getDefaultFoundation() as any).adapter_.registerInteractionHandler('click', handler);
    emitEvent(root, 'click');

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('interactionHandler');

    root.addEventListener('click', handler);
    (component.getDefaultFoundation() as any).adapter_.deregisterInteractionHandler('click', handler);
    emitEvent(root, 'click');

    expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#registerThumbContainerInteractionHandler adds an event listener to the thumb container element', () => {
    const {root, component} = setupTest();
    const thumbContainer = root.querySelector(strings.THUMB_CONTAINER_SELECTOR) as HTMLElement;
    const handler = jasmine.createSpy('interactionHandler');

    (component.getDefaultFoundation() as any).adapter_.registerThumbContainerInteractionHandler('click', handler);
    emitEvent(thumbContainer, 'click');

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#deregisterThumbContainerInteractionHandler removes an event listener from ' +
       'the thumb container element', () => {
    const {root, component} = setupTest();
    const thumbContainer = root.querySelector(strings.THUMB_CONTAINER_SELECTOR) as HTMLElement;
    const handler = jasmine.createSpy('interactionHandler');

    thumbContainer.addEventListener('click', handler);
    (component.getDefaultFoundation() as any).adapter_.deregisterThumbContainerInteractionHandler('click', handler);
    emitEvent(thumbContainer, 'click');

    expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#registerBodyInteractionHandler adds an event listener to the body element', () => {
    const {component} = setupTest();
    const handler = jasmine.createSpy('interactionHandler');

    (component.getDefaultFoundation() as any).adapter_.registerBodyInteractionHandler('click', handler);
    emitEvent(document.body, 'click');
    document.body.removeEventListener('click', handler);

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#deregisterBodyInteractionHandler removes an event listener from the body element', () => {
    const {component} = setupTest();
    const handler = jasmine.createSpy('interactionHandler');

    document.body.addEventListener('click', handler);
    (component.getDefaultFoundation() as any).adapter_.deregisterBodyInteractionHandler('click', handler);
    emitEvent(document.body, 'click');
    // Just in case deregisterBodyInteractionHandler doesn't work as expected
    document.body.removeEventListener('click', handler);

    expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#registerResizeHandler adds an event listener for the window\'s "resize" event', () => {
    const {component} = setupTest();
    const handler = jasmine.createSpy('resizeHandler');

    (component.getDefaultFoundation() as any).adapter_.registerResizeHandler(handler);
    emitEvent(window, 'resize');
    window.removeEventListener('resize', handler);

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#deregisterResizeHandler removes an event listener for the window\'s "resize" event', () => {
    const {component} = setupTest();
    const handler = jasmine.createSpy('resizeHandler');

    window.addEventListener('resize', handler);
    (component.getDefaultFoundation() as any).adapter_.deregisterResizeHandler(handler);
    emitEvent(window, 'resize');
    // Just in case deregisterResizeHandler doesn't work as expected
    window.removeEventListener('resize', handler);

    expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('adapter#notifyInput emits a MDCSlider:input event with the slider instance as its detail', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('inputHandler');

    root.addEventListener(strings.INPUT_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter_.notifyInput();

    expect(handler).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: component,
    }));
  });

  it('adapter#notifyChange emits a MDCSlider:change event with the slider instance as its detail', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('changeHandler');

    root.addEventListener(strings.CHANGE_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter_.notifyChange();

    expect(handler).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: component,
    }));
  });

  it('adapter#setThumbContainerStyleProperty sets a style property on the thumb container element', () => {
    const {root, component} = setupTest();
    const thumbContainer = root.querySelector(strings.THUMB_CONTAINER_SELECTOR) as HTMLElement;

    const div = document.createElement('div');
    div.style.backgroundColor = 'black';

    (component.getDefaultFoundation() as any).adapter_.setThumbContainerStyleProperty('background-color', 'black');

    expect(thumbContainer.style.backgroundColor).toEqual(div.style.backgroundColor);
  });

  it('adapter#setTrackStyleProperty sets a style property on the track element', () => {
    const {root, component} = setupTest();
    const track = root.querySelector(strings.TRACK_SELECTOR) as HTMLElement;

    const div = document.createElement('div');
    div.style.backgroundColor = 'black';

    (component.getDefaultFoundation() as any).adapter_.setTrackStyleProperty('background-color', 'black');

    expect(track.style.backgroundColor).toEqual(div.style.backgroundColor);
  });

  it('adapter#setMarkerValue changes the value on pin value markers', () => {
    const {root, component} = setupTest();
    const pinValueMarker = root.querySelector(strings.PIN_VALUE_MARKER_SELECTOR) as HTMLElement;

    (component.getDefaultFoundation() as any).adapter_.setMarkerValue(10);

    expect(pinValueMarker.innerHTML).toEqual('10');
  });

  it('adapter#isRTL returns true when component is in an RTL context', () => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('dir', 'rtl');
    const {root, component} = setupTest();
    wrapper.appendChild(root);
    document.body.appendChild(wrapper);

    expect((component.getDefaultFoundation() as any).adapter_.isRTL()).toBe(true);

    document.body.removeChild(wrapper);
  });

  it('adapter#isRTL returns false when component is not in an RTL context', () => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('dir', 'ltr');
    const {root, component} = setupTest();
    wrapper.appendChild(root);
    document.body.appendChild(wrapper);

    expect((component.getDefaultFoundation() as any).adapter_.isRTL()).toBe(false);

    document.body.removeChild(wrapper);
  });

});
