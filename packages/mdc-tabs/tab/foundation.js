/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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
import {cssClasses, strings} from './constants';

export default class MDCTabFoundation extends MDCFoundation {
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
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      getOffsetWidth: () => /* number */ 0,
      getOffsetLeft: () => /* number */ 0,
      notifySelected: () => {},
    };
  }

  constructor(adapter = {}) {
    super(Object.assign(MDCTabFoundation.defaultAdapter, adapter));

    this.computedWidth_ = 0;
    this.computedLeft_ = 0;
    this.isActive_ = false;
    this.preventDefaultOnClick_ = false;

    this.clickHandler_ = (evt) => {
      if (this.preventDefaultOnClick_) {
        evt.preventDefault();
      }
      this.adapter_.notifySelected();
    };

    this.keydownHandler_ = (evt) => {
      if (evt.key && evt.key === 'Enter' || evt.keyCode === 13) {
        this.adapter_.notifySelected();
      }
    };
  }

  init() {
    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
  }

  getComputedWidth() {
    return this.computedWidth_;
  }

  getComputedLeft() {
    return this.computedLeft_;
  }

  isActive() {
    return this.isActive_;
  }

  setActive(isActive) {
    this.isActive_ = isActive;
    if (this.isActive_) {
      this.adapter_.addClass(cssClasses.ACTIVE);
    } else {
      this.adapter_.removeClass(cssClasses.ACTIVE);
    }
  }

  preventsDefaultOnClick() {
    return this.preventDefaultOnClick_;
  }

  setPreventDefaultOnClick(preventDefaultOnClick) {
    this.preventDefaultOnClick_ = preventDefaultOnClick;
  }

  measureSelf() {
    this.computedWidth_ = this.adapter_.getOffsetWidth();
    this.computedLeft_ = this.adapter_.getOffsetLeft();
  }
}
