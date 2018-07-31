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
      setNativeControlChecked: (/* checked: boolean */) => {},
      isNativeControlChecked: () => /* boolean */ {},
      setNativeControlDisabled: (/* disabled: boolean */) => {},
      isNativeControlDisabled: () => /* boolean */ {},
    });
  }

  constructor(adapter) {
    super(Object.assign(MDCSwitchFoundation.defaultAdapter, adapter));
  }

  /** @override */
  init() {
    // Do an initial state update based on the state of the native control.
    this.handleChange();
  }

  /** @return {boolean} */
  isChecked() {
    return this.adapter_.isNativeControlChecked();
  }

  /** @param {boolean} checked */
  setChecked(checked) {
    this.adapter_.setNativeControlChecked(checked);
    this.updateCheckedStyling_(checked);
  }

  /** @return {boolean} */
  isDisabled() {
    return this.adapter_.isNativeControlDisabled();
  }

  /** @param {boolean} disabled */
  setDisabled(disabled) {
    this.adapter_.setNativeControlDisabled(disabled);
    if (disabled) {
      this.adapter_.addClass(cssClasses.DISABLED);
    } else {
      this.adapter_.removeClass(cssClasses.DISABLED);
    }
  }

  /**
   * Handles the change event for the switch native control.
   */
  handleChange() {
    this.updateCheckedStyling_(this.isChecked());
  }

  /**
   * Updates the styling of the switch based on its checked state.
   * @param {boolean} checked
   * @private
   */
  updateCheckedStyling_(checked) {
    if (checked) {
      this.adapter_.addClass(cssClasses.CHECKED);
    } else {
      this.adapter_.removeClass(cssClasses.CHECKED);
    }
  }
}

export default MDCSwitchFoundation;
