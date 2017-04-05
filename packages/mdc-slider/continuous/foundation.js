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

/* eslint object-curly-spacing: [error, always, { "objectsInObjects": false }], arrow-parens: [error, as-needed] */

import { MDCFoundation } from '@material/base';
import { cssClasses, strings } from './constants';

export default class MDCSliderFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => {},
      addInputClass: (/* className: string */) => {},
      removeInputClass: (/* className: string */) => {},
      getNativeInput: (/* HTMLInputElement */) => {},
      registerHandler: (/* type: string, handler: EventListener */) => {},
      deregisterHandler: (/* type: string, handler: EventListener */) => {},
      registerRootHandler: (/* type: string, handler: EventListener */) => {},
      deregisterRootHandler: (/* type: string, handler: EventListener */) => {},
      setAttr: (/* name: string, value: string */) => {},
      setLowerStyle: (/* name: string, value: number */) => {},
      setUpperStyle: (/* name: string, value: number */) => {},
      hasNecessaryDom: (/* boolean */) => false,
      notifyChange: (/* evtData: {value: number} */) => {},
      detectIsIE: (/* boolean */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCSliderFoundation.defaultAdapter, adapter));

    // Browser feature detection.
    this.isIE_ = adapter.detectIsIE();

    this.touchMoveHandler_ = evt => this.handleTouchMove_(evt);
    this.inputHandler = evt => this.onInput_(evt);
    this.changeHandler = evt => this.onChange_(evt);
    this.mouseUpHandler = evt => this.onMouseUp_(evt);
    this.containerMouseDownHandler = evt => this.onContainerMouseDown_(evt);
  }

  init() {
    const { ROOT, UPGRADED } = MDCSliderFoundation.cssClasses;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    this.adapter_.addClass(UPGRADED);
    this.adapter_.registerHandler('input', this.inputHandler);
    this.adapter_.registerHandler('change', this.changeHandler);
    this.adapter_.registerHandler('mouseup', this.mouseUpHandler);
    this.adapter_.registerHandler('touchmove', this.touchMoveHandler_);
    this.adapter_.registerHandler('touchstart', this.touchMoveHandler_);
    this.adapter_.registerRootHandler('mousedown', this.containerMouseDownHandler);
    this.updateValueStyles_();
  }

  destroy() {
    this.adapter_.deregisterHandler('input', this.inputHandler);
    this.adapter_.deregisterHandler('change', this.changeHandler);
    this.adapter_.deregisterHandler('mouseup', this.mouseUpHandler);
    this.adapter_.deregisterHandler('touchmove', this.touchMoveHandler_);
    this.adapter_.deregisterHandler('touchstart', this.touchMoveHandler_);
    this.adapter_.deregisterRootHandler('mousedown', this.containerMouseDownHandler);
    this.adapter_.removeClass(MDCSliderFoundation.cssClasses.UPGRADED);
  }

  onInput_(event) {
    this.updateValueStyles_();
  }

  onChange_(event) {
    this.updateValueStyles_();
  }

  onMouseUp_(event) {
    event.target.blur();
  }

  handleTouchMove_(event) {
    const input_ = this.getNativeInput();
    const value = input_.max / input_.offsetWidth * (event.touches[0].clientX - input_.offsetLeft);
    input_.value = value;

    event.preventDefault();

    // create a new event on the slider element to ensure
    // listeners receive the input event

    const newEvent = new Event('input', {
      target: event.target,
      buttons: event.buttons,
      clientX: event.touches[0].clientX,
      clientY: input_.getBoundingClientRect().y,
    });
    input_.dispatchEvent(newEvent);
  }

  onContainerMouseDown_(event) {
    const input_ = this.getNativeInput();
    // If this click is not on the parent element (but rather some child)
    // ignore. It may still bubble up.
    if (event.target !== input_.parentElement) {
      return;
    }
    // Discard the original event and create a new event that
    // is on the slider element.
    event.preventDefault();
    const newEvent = new MouseEvent('mousedown', {
      target: event.target,
      buttons: event.buttons,
      clientX: event.clientX,
      clientY: input_.getBoundingClientRect().y,
    });
    input_.dispatchEvent(newEvent);
  }

  updateValueStyles_() {
    const { ARIA_VALUENOW } = MDCSliderFoundation.strings;

    // Calculate and apply percentages to div structure behind slider.
    const element = this.getNativeInput();
    const fraction = (element.value - element.min) / (element.max - element.min);
    if (fraction === 0) {
      this.adapter_.addInputClass(MDCSliderFoundation.cssClasses.LOWEST_VALUE);
    } else {
      this.adapter_.removeInputClass(MDCSliderFoundation.cssClasses.LOWEST_VALUE);
    }

    if (!this.isIE_) {
      this.adapter_.setLowerStyle('flex', fraction);
      this.adapter_.setLowerStyle('webkitFlex', fraction);
      this.adapter_.setUpperStyle('flex', 1 - fraction);
      this.adapter_.setUpperStyle('webkitFlex', 1 - fraction);
    }

    const { value } = element;
    this.adapter_.setAttr(ARIA_VALUENOW, value);
    this.adapter_.notifyChange({ value });
  }

  isDisabled() {
    return this.getNativeInput().disabled;
  }

  setDisabled(disabled) {
    this.getNativeInput().disabled = disabled;
  }

  getNativeInput() {
    return this.adapter_.getNativeInput() || {
      disabled: false,
    };
  }
}
