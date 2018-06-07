/**
 * @license
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

import MDCFoundation from '@material/base/foundation';
/* eslint-disable no-unused-vars */
import {MDCSelectionControlState} from '@material/selection-control/index';
import MDCSwitchAdapter from './adapter';
/* eslint-enable no-unused-vars */
import {cssClasses, strings} from './constants';

/**
 * @extends {MDCFoundation<!MDCSwitchAdapter>}
 */
class MDCSwitchFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return {!MDCSwitchAdapter} */
  static get defaultAdapter() {
    return /** @type {!MDCSwitchAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      registerChangeHandler: (/* handler: EventListener */) => {},
      deregisterChangeHandler: (/* handler: EventListener */) => {},
      getNativeControl: () => /* !MDCSelectionControlState */ {},
    });
  }

  constructor(adapter) {
    super(Object.assign(MDCSwitchFoundation.defaultAdapter, adapter));

    this.changeHandler_ = /** @private {!EventListener} */ (
      () => this.handleChange());
  }

  init() {
    this.adapter_.registerChangeHandler(this.changeHandler_);
  }

  destroy() {
    this.adapter_.deregisterChangeHandler(this.changeHandler_);
  }

  /** @return {boolean} */
  isChecked() {
    return this.getNativeControl_().checked;
  }

  /** @param {boolean} checked */
  setChecked(checked) {
    this.getNativeControl_().checked = checked;
    this.updateCheckedStyling_();
  }

  /** @return {boolean} */
  isDisabled() {
    return this.getNativeControl_().disabled;
  }

  /** @param {boolean} disabled */
  setDisabled(disabled) {
    this.getNativeControl_().disabled = disabled;
    if (disabled) {
      this.adapter_.addClass(cssClasses.DISABLED);
    } else {
      this.adapter_.removeClass(cssClasses.DISABLED);
    }
  }

  /**
   * Handles the change event for the switch.
   */
  handleChange() {
    this.updateCheckedStyling_();
  }

  /**
   * @return {!MDCSelectionControlState}
   * @private
   */
  getNativeControl_() {
    return this.adapter_.getNativeControl() || {
      checked: false,
      disabled: false,
    };
  }

  updateCheckedStyling_() {
    this.isChecked() ? this.adapter_.addClass(cssClasses.TOGGLED_ON) : this.adapter_.removeClass(cssClasses.TOGGLED_ON);
  }
}

export default MDCSwitchFoundation;
