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

import MDCComponent from '@material/base/component';
import MDCIconButtonToggleFoundation from './foundation';
import {MDCRipple} from '@material/ripple/index';

/**
 * @extends {MDCComponent<!MDCIconButtonToggleFoundation>}
 */
class MDCIconButtonToggle extends MDCComponent {
  static attachTo(root) {
    return new MDCIconButtonToggle(root);
  }

  constructor(...args) {
    super(...args);

    /** @private {!MDCRipple} */
    this.ripple_ = this.initRipple_();
  }

  /** @return {!Element} */
  get iconEl_() {
    const {'iconInnerSelector': sel} = this.root_.dataset;
    return sel ?
      /** @type {!Element} */ (this.root_.querySelector(sel)) : this.root_;
  }

  /**
   * @return {!MDCRipple}
   * @private
   */
  initRipple_() {
    const ripple = new MDCRipple(this.root_);
    ripple.unbounded = true;
    return ripple;
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  /** @return {!MDCIconButtonToggleFoundation} */
  getDefaultFoundation() {
    return new MDCIconButtonToggleFoundation({
      addClass: (className) => this.iconEl_.classList.add(className),
      removeClass: (className) => this.iconEl_.classList.remove(className),
      registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
      setText: (text) => this.iconEl_.textContent = text,
      getAttr: (name) => this.root_.getAttribute(name),
      setAttr: (name, value) => this.root_.setAttribute(name, value),
      notifyChange: (evtData) => this.emit(MDCIconButtonToggleFoundation.strings.CHANGE_EVENT, evtData),
    });
  }

  initialSyncWithDOM() {
    this.on = this.root_.getAttribute(MDCIconButtonToggleFoundation.strings.ARIA_PRESSED) === 'true';
  }

  /** @return {!MDCRipple} */
  get ripple() {
    return this.ripple_;
  }

  /** @return {boolean} */
  get on() {
    return this.foundation_.isOn();
  }

  /** @param {boolean} isOn */
  set on(isOn) {
    this.foundation_.toggle(isOn);
  }

  refreshToggleData() {
    this.foundation_.refreshToggleData();
  }
}

export {MDCIconButtonToggle, MDCIconButtonToggleFoundation};
