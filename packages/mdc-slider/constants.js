/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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

/** @enum {string} */
const strings = {
  TRACK_SELECTOR: '.mdc-slider__track',
  TRACK_FILL_SELECTOR: '.mdc-slider__track-fill',
  TICK_MARK_SET_SELECTOR: '.mdc-slider__tick-mark-set',
  LAST_TICK_MARK_SELECTOR: '.mdc-slider__tick-mark:last-child',
  THUMB_SELECTOR: '.mdc-slider__thumb',
  VALUE_LABEL_SELECTOR: '.mdc-slider__value-label',
  VALUE_LABEL_TEXT_SELECTOR: '.mdc-slider__value-label-text',
  ARIA_VALUEMIN: 'aria-valuemin',
  ARIA_VALUEMAX: 'aria-valuemax',
  ARIA_VALUENOW: 'aria-valuenow',
  ARIA_DISABLED: 'aria-disabled',
  DATA_STEP: 'data-step',
  CHANGE_EVENT: 'MDCSlider:change',
  INPUT_EVENT: 'MDCSlider:input',
};

const cssClasses = {
  SLIDER: 'mdc-slider',
  TRACK: 'mdc-slider__track',
  TRACK_FILL: 'mdc-slider__track-fill',
  TICK_MARK: 'mdc-slider__tick-mark',
  ACTIVE: 'mdc-slider--active',
  IN_TRANSIT: 'mdc-slider--in-transit',
  DISCRETE: 'mdc-slider--discrete',
  PRESSED: 'mdc-slider--pressed',
};

export {strings, cssClasses};
