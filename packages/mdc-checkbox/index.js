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
import {getMatchesProperty} from '@material/ripple/util';
import {getCorrectEventName} from '@material/animation';

import MDCCheckboxFoundation from './foundation';

export {MDCCheckboxFoundation};

export class MDCCheckbox extends MDCComponent {
  static attachTo(root) {
    return new MDCCheckbox(root);
  }

  get nativeCb_() {
    const {NATIVE_CONTROL_SELECTOR} = MDCCheckboxFoundation.strings;
    return this.root_.querySelector(NATIVE_CONTROL_SELECTOR);
  }

  constructor(...args) {
    super(...args);
    this.ripple_ = this.initRipple_();
  }

  initRipple_() {
    const MATCHES = getMatchesProperty(HTMLElement.prototype);
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      isUnbounded: () => true,
      isSurfaceActive: () => this.nativeCb_[MATCHES](':active'),
      registerInteractionHandler: (type, handler) => this.nativeCb_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.nativeCb_.removeEventListener(type, handler),
      computeBoundingRect: () => {
        const {left, top} = this.root_.getBoundingClientRect();
        const DIM = 40;
        return {
          top,
          left,
          right: left + DIM,
          bottom: top + DIM,
          width: DIM,
          height: DIM,
        };
      },
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  getDefaultFoundation() {
    return new MDCCheckboxFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      registerAnimationEndHandler:
        (handler) => this.root_.addEventListener(getCorrectEventName(window, 'animationend'), handler),
      deregisterAnimationEndHandler:
        (handler) => this.root_.removeEventListener(getCorrectEventName(window, 'animationend'), handler),
      registerChangeHandler: (handler) => this.nativeCb_.addEventListener('change', handler),
      deregisterChangeHandler: (handler) => this.nativeCb_.removeEventListener('change', handler),
      getNativeControl: () => this.nativeCb_,
      forceLayout: () => this.root_.offsetWidth,
      isAttachedToDOM: () => Boolean(this.root_.parentNode),
    });
  }

  get ripple() {
    return this.ripple_;
  }

  get checked() {
    return this.foundation_.isChecked();
  }

  set checked(checked) {
    this.foundation_.setChecked(checked);
  }

  get indeterminate() {
    return this.foundation_.isIndeterminate();
  }

  set indeterminate(indeterminate) {
    this.foundation_.setIndeterminate(indeterminate);
  }

  get disabled() {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  get value() {
    return this.foundation_.getValue();
  }

  set value(value) {
    this.foundation_.setValue(value);
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }
}
