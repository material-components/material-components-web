/**
 * @license
 * Copyright 2017 Google Inc.
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

import {MDCComponent} from '@material/base/component';
import {applyPassive} from '@material/dom/events';
import {MDCSliderAdapter} from './adapter';
import {strings} from './constants';
import {MDCSliderFoundation} from './foundation';

export class MDCSlider extends MDCComponent<MDCSliderFoundation> {
  static attachTo(root: Element) {
    return new MDCSlider(root);
  }

  protected root_!: HTMLElement; // assigned in MDCComponent constructor

  private thumbContainer_!: HTMLElement; // assigned in initialize()
  private track_!: HTMLElement; // assigned in initialize()
  private pinValueMarker_!: HTMLElement; // assigned in initialize()
  private trackMarkerContainer_!: HTMLElement; // assigned in initialize()

  get value(): number {
    return this.foundation_.getValue();
  }

  set value(value: number) {
    this.foundation_.setValue(value);
  }

  get min(): number {
    return this.foundation_.getMin();
  }

  set min(min: number) {
    this.foundation_.setMin(min);
  }

  get max(): number {
    return this.foundation_.getMax();
  }

  set max(max: number) {
    this.foundation_.setMax(max);
  }

  get step(): number {
    return this.foundation_.getStep();
  }

  set step(step: number) {
    this.foundation_.setStep(step);
  }

  get disabled(): boolean {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled: boolean) {
    this.foundation_.setDisabled(disabled);
  }

  initialize() {
    this.thumbContainer_ = this.root_.querySelector<HTMLElement>(strings.THUMB_CONTAINER_SELECTOR)!;
    this.track_ = this.root_.querySelector<HTMLElement>(strings.TRACK_SELECTOR)!;
    this.pinValueMarker_ = this.root_.querySelector<HTMLElement>(strings.PIN_VALUE_MARKER_SELECTOR)!;
    this.trackMarkerContainer_ = this.root_.querySelector<HTMLElement>(strings.TRACK_MARKER_CONTAINER_SELECTOR)!;
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCSliderAdapter = {
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      getAttribute: (name) => this.root_.getAttribute(name),
      setAttribute: (name, value) => this.root_.setAttribute(name, value),
      removeAttribute: (name) => this.root_.removeAttribute(name),
      computeBoundingRect: () => this.root_.getBoundingClientRect(),
      getTabIndex: () => this.root_.tabIndex,
      registerInteractionHandler: (evtType, handler) => this.listen(evtType, handler, applyPassive()),
      deregisterInteractionHandler: (evtType, handler) => this.unlisten(evtType, handler, applyPassive()),
      registerThumbContainerInteractionHandler: (evtType, handler) => {
        this.thumbContainer_.addEventListener(evtType, handler, applyPassive());
      },
      deregisterThumbContainerInteractionHandler: (evtType, handler) => {
        this.thumbContainer_.removeEventListener(evtType, handler, applyPassive());
      },
      registerBodyInteractionHandler: (evtType, handler) => document.body.addEventListener(evtType, handler),
      deregisterBodyInteractionHandler: (evtType, handler) => document.body.removeEventListener(evtType, handler),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      notifyInput: () => this.emit<MDCSlider>(strings.INPUT_EVENT, this), // TODO(acdvorak): Create detail interface
      notifyChange: () => this.emit<MDCSlider>(strings.CHANGE_EVENT, this), // TODO(acdvorak): Create detail interface
      setThumbContainerStyleProperty: (propertyName, value) => {
        this.thumbContainer_.style.setProperty(propertyName, value);
      },
      setTrackStyleProperty: (propertyName, value) => this.track_.style.setProperty(propertyName, value),
      setMarkerValue: (value) => this.pinValueMarker_.innerText = value.toLocaleString(),
      appendTrackMarkers: (numMarkers) => {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < numMarkers; i++) {
          const marker = document.createElement('div');
          marker.classList.add('mdc-slider__track-marker');
          frag.appendChild(marker);
        }
        this.trackMarkerContainer_.appendChild(frag);
      },
      removeTrackMarkers: () => {
        while (this.trackMarkerContainer_.firstChild) {
          this.trackMarkerContainer_.removeChild(this.trackMarkerContainer_.firstChild);
        }
      },
      setLastTrackMarkersStyleProperty: (propertyName, value) => {
        // We remove and append new nodes, thus, the last track marker must be dynamically found.
        const lastTrackMarker = this.root_.querySelector<HTMLElement>(strings.LAST_TRACK_MARKER_SELECTOR)!;
        lastTrackMarker.style.setProperty(propertyName, value);
      },
      isRTL: () => getComputedStyle(this.root_).direction === 'rtl',
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCSliderFoundation(adapter);
  }

  initialSyncWithDOM() {
    const origValueNow = this.parseFloat_(this.root_.getAttribute(strings.ARIA_VALUENOW), this.value);
    const min = this.parseFloat_(this.root_.getAttribute(strings.ARIA_VALUEMIN), this.min);
    const max = this.parseFloat_(this.root_.getAttribute(strings.ARIA_VALUEMAX), this.max);

    // min and max need to be set in the right order to avoid throwing an error
    // when the new min is greater than the default max.
    if (min >= this.max) {
      this.max = max;
      this.min = min;
    } else {
      this.min = min;
      this.max = max;
    }

    this.step = this.parseFloat_(this.root_.getAttribute(strings.STEP_DATA_ATTR), this.step);
    this.value = origValueNow;
    this.disabled = (
        this.root_.hasAttribute(strings.ARIA_DISABLED) &&
        this.root_.getAttribute(strings.ARIA_DISABLED) !== 'false'
    );
    this.foundation_.setupTrackMarker();
  }

  layout() {
    this.foundation_.layout();
  }

  stepUp(amount = (this.step || 1)) {
    this.value += amount;
  }

  stepDown(amount = (this.step || 1)) {
    this.value -= amount;
  }

  private parseFloat_(str: string | null, defaultValue: number) {
    const num = parseFloat(str!); // tslint:disable-line:ban
    const isNumeric = typeof num === 'number' && isFinite(num);
    return isNumeric ? num : defaultValue;
  }
}
