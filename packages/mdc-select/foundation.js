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

import {MDCFoundation} from '@material/base/index';
import {cssClasses, numbers, strings} from './constants';

export default class MDCSelectFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get numbers() {
    return numbers;
  }

  static get strings() {
    return strings;
  }

  get disabled() {
    return this.disabled_;
  }

  set disabled(disabled) {
    const {DISABLED} = MDCSelectFoundation.cssClasses;
    this.disabled_ = disabled;
    this.adapter_.setDisabled(disabled);
    if (this.disabled_) {
      this.adapter_.addClass(DISABLED);
    } else {
      this.adapter_.removeClass(DISABLED);
    }
  }

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      floatLabel: (/* value: boolean */) => {},
      activateBottomLine: () => {},
      deactivateBottomLine: () => {},
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      getNumberOfOptions: () => /* number */ 0,
      getIndexForOptionValue: (/* value: string */) => /* number */ -1,
      getValueForOptionAtIndex: (/* index: number */) => /* index */ '',
      getValue: () => /* string */ '',
      setValue: (/* value: string */) => {},
      getSelectedIndex: () => /* number */ -1,
      setSelectedIndex: (/* index: number */) => {},
      setDisabled: (/* disabled: boolean */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCSelectFoundation.defaultAdapter, adapter));
    this.disabled_ = false;

    this.focusHandler_ = (evt) => this.handleFocus_(evt);
    this.blurHandler_ = (evt) => this.handleBlur_(evt);
    this.selectionHandler_ = (evt) => this.handleSelect_(evt);
  }

  init() {
    this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
    this.adapter_.registerInteractionHandler('blur', this.blurHandler_);
    this.adapter_.registerInteractionHandler('change', this.selectionHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
    this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);
    this.adapter_.deregisterInteractionHandler('change', this.selectionHandler_);
  }

  getSelectedIndex() {
    return this.adapter_.getSelectedIndex();
  }

  setSelectedIndex(index) {
    const {IS_CHANGING} = MDCSelectFoundation.cssClasses;
    const {SELECT_TEXT_TRANSITION_TIME} = MDCSelectFoundation.numbers;
    const isIndexInRange = index >= 0 && index < this.adapter_.getNumberOfOptions();

    const selectedIndex = isIndexInRange ? index : -1;
    this.adapter_.setSelectedIndex(selectedIndex);
    this.adapter_.addClass(IS_CHANGING);

    const optionHasValue = selectedIndex > -1 ? !!this.adapter_.getValueForOptionAtIndex(selectedIndex) : false;
    this.adapter_.floatLabel(optionHasValue);

    setTimeout(() => {
      this.adapter_.removeClass(IS_CHANGING);
    }, SELECT_TEXT_TRANSITION_TIME);
  }

  getValue() {
    return this.adapter_.getValue();
  }

  setValue(value) {
    let index = this.adapter_.getIndexForOptionValue(value);
    index = !index && null !== 0 ? -1 : index;

    this.adapter_.setValue(value);
    this.setSelectedIndex(index);
  }

  handleFocus_() {
    this.adapter_.activateBottomLine();
  }

  handleBlur_() {
    this.adapter_.deactivateBottomLine();
  }

  handleSelect_(evt) {
    const index = this.adapter_.getIndexForOptionValue(evt.target.value);
    this.setSelectedIndex(index);
  }
}
