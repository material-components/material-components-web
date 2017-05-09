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

import {MDCComponent} from '@material/base';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple';

import MDCIconToggleFoundation from './foundation';

export {MDCIconToggleFoundation};

export class MDCIconToggle extends MDCComponent {
  static attachTo(root) {
    return new MDCIconToggle(root);
  }

  constructor(...args) {
    super(...args);
    this.ripple_ = this.initRipple_();
  }

  get iconEl_() {
    const {iconInnerSelector: sel} = this.root_.dataset;
    return sel ? this.root_.querySelector(sel) : this.root_;
  }

  initRipple_() {
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      isUnbounded: () => true,
      isSurfaceActive: () => this.foundation_.isKeyboardActivated(),
      computeBoundingRect: () => {
        const dim = 48;
        const {left, top} = this.root_.getBoundingClientRect();
        return {
          left,
          top,
          width: dim,
          height: dim,
          right: left + dim,
          bottom: left + dim,
        };
      },
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  getDefaultFoundation() {
    return new MDCIconToggleFoundation({
      addClass: (className) => this.iconEl_.classList.add(className),
      removeClass: (className) => this.iconEl_.classList.remove(className),
      registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
      setText: (text) => {
        this.iconEl_.textContent = text;
      },
      getTabIndex: () => /* number */ this.root_.tabIndex,
      setTabIndex: (tabIndex) => {
        this.root_.tabIndex = tabIndex;
      },
      getAttr: (name, value) => this.root_.getAttribute(name, value),
      setAttr: (name, value) => this.root_.setAttribute(name, value),
      rmAttr: (name) => this.root_.removeAttribute(name),
      notifyChange: (evtData) => this.emit(MDCIconToggleFoundation.strings.CHANGE_EVENT, evtData),
    });
  }

  initialSyncWithDOM() {
    this.on = this.root_.getAttribute(MDCIconToggleFoundation.strings.ARIA_PRESSED) === 'true';
    this.disabled = this.root_.getAttribute(MDCIconToggleFoundation.strings.ARIA_DISABLED) === 'true';
  }

  get on() {
    return this.foundation_.isOn();
  }

  set on(isOn) {
    this.foundation_.toggle(isOn);
  }

  get disabled() {
    return this.foundation_.isDisabled();
  }

  set disabled(isDisabled) {
    this.foundation_.setDisabled(isDisabled);
  }

  refreshToggleData() {
    this.foundation_.refreshToggleData();
  }
}
