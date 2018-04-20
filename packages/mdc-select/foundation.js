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
import {cssClasses, strings} from './constants';

export default class MDCSelectFoundation extends MDCFoundation {
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
      floatLabel: (/* value: boolean */) => {},
      activateBottomLine: () => {},
      deactivateBottomLine: () => {},
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      getSelectedIndex: () => /* number */ -1,
      setSelectedIndex: (/* index: number */) => {},
      setDisabled: (/* disabled: boolean */) => {},
      getValue: () => /* string */ '',
      setValue: (/* value: string */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCSelectFoundation.defaultAdapter, adapter));

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

  setSelectedIndex(index) {
    this.adapter_.setSelectedIndex(index);
    this.floatLabelWithValue_();
  }

  setValue(value) {
    this.adapter_.setValue(value);
    this.setSelectedIndex(this.adapter_.getSelectedIndex());
  }

  setDisabled(disabled) {
    const {DISABLED} = MDCSelectFoundation.cssClasses;
    this.adapter_.setDisabled(disabled);
    if (disabled) {
      this.adapter_.addClass(DISABLED);
    } else {
      this.adapter_.removeClass(DISABLED);
    }
  }

  floatLabelWithValue_() {
    const optionHasValue = this.adapter_.getValue().length > 0;
    this.adapter_.floatLabel(optionHasValue);
  }

  handleFocus_() {
    this.adapter_.floatLabel(true);
    this.adapter_.activateBottomLine();
  }

  handleBlur_() {
    this.floatLabelWithValue_();
    this.adapter_.deactivateBottomLine();
  }

  handleSelect_() {
    this.setSelectedIndex(this.adapter_.getSelectedIndex());
  }
}
