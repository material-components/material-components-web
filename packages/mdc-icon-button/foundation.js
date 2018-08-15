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
import {MDCIconButtonToggleAdapter, IconButtonToggleEvent} from './adapter';
import {cssClasses, strings} from './constants';

/**
 * @extends {MDCFoundation<!MDCIconButtonToggleAdapter>}
 */
class MDCIconButtonToggleFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => {},
      setAttr: () => {},
      notifyChange: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCIconButtonToggleFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.disabled_ = false;
  }

  init() {
    this.adapter_.setAttr(strings.ARIA_PRESSED, `${this.isOn()}`);
  }

  handleClick() {
    this.toggle();
    this.adapter_.notifyChange(/** @type {!IconButtonToggleEvent} */ ({isOn: this.isOn()}));
  }

  /** @return {boolean} */
  isOn() {
    return this.adapter_.hasClass(cssClasses.ICON_BUTTON_ON);
  }

  /** @param {boolean=} isOn */
  toggle(isOn = !this.isOn()) {
    if (isOn) {
      this.adapter_.addClass(cssClasses.ICON_BUTTON_ON);
    } else {
      this.adapter_.removeClass(cssClasses.ICON_BUTTON_ON);
    }

    this.adapter_.setAttr(strings.ARIA_PRESSED, `${isOn}`);
  }
}

/** @record */
class IconButtonToggleState {}

export default MDCIconButtonToggleFoundation;
