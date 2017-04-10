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

/* eslint object-curly-spacing: [error, always, { "objectsInObjects": false }], arrow-parens: [error, as-needed] */

import { MDCComponent } from '@material/base';
import MDCSliderFoundation from './foundation';

export { MDCSliderFoundation };

export class MDCSlider extends MDCComponent {
  static attachTo(root) {
    return new MDCSlider(root);
  }

  get inputControl_() {
    const { INPUT_SELECTOR } = MDCSliderFoundation.strings;
    return this.root_.querySelector(INPUT_SELECTOR);
  }
  /* Return the input element inside the component. */
  get input_() {
    return this.root_.querySelector(MDCSliderFoundation.strings.INPUT_SELECTOR);
  }

  get lower_() {
    return this.root_.querySelector(MDCSliderFoundation.strings.BACKGROUND_LOWER_SELECTOR);
  }

  get upper_() {
    return this.root_.querySelector(MDCSliderFoundation.strings.BACKGROUND_UPPER_SELECTOR);
  }

  getDefaultFoundation() {
    const input_ = this.input_;
    const lower_ = this.lower_;
    const upper_ = this.upper_;

    return new MDCSliderFoundation({
      addClass: className => this.root_.classList.add(className),
      removeClass: className => this.root_.classList.remove(className),
      hasClass: className => this.root_.classList.contains(className),
      addInputClass: className => input_.classList.add(className),
      registerHandler: (eventName, handler) => this.inputControl_.addEventListener(eventName, handler, false),
      deregisterHandler: (eventName, handler) => this.inputControl_.removeEventListener(eventName, handler, false),
      registerRootHandler: (eventName, handler) => this.root_.addEventListener(eventName, handler, false),
      deregisterRootHandler: (eventName, handler) => this.root_.removeEventListener(eventName, handler, false),
      removeInputClass: className => input_.classList.remove(className),
      setAttr: (name, value) => input_.setAttribute(name, value),
      setLowerStyle: (name, value) => lower_.style[name] = value,
      setUpperStyle: (name, value) => upper_.style[name] = value,
      getNativeInput: () => this.inputControl_,
      hasNecessaryDom: () => Boolean(input_) && Boolean(lower_) && Boolean(upper_),
      notifyChange: evtData => this.emit('MDCSlider:change', evtData),
      detectIsIE: () => window.navigator.msPointerEnabled,
    });
  }

  get disabled() {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }
}
