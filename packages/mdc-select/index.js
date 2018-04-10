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

import {MDCComponent} from '@material/base/index';
import {MDCFloatingLabel} from '@material/floating-label/index';
import {MDCLineRipple} from '@material/line-ripple/index';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';

import MDCSelectFoundation from './foundation';
import {cssClasses, strings} from './constants';

export {MDCSelectFoundation};

export class MDCSelect extends MDCComponent {
  static attachTo(root) {
    return new MDCSelect(root);
  }

  get value() {
    return this.nativeControl_.value;
  }

  set value(value) {
    this.foundation_.setValue(value);
  }

  get selectedIndex() {
    return this.nativeControl_.selectedIndex;
  }

  set selectedIndex(selectedIndex) {
    this.foundation_.setSelectedIndex(selectedIndex);
  }

  get disabled() {
    return this.nativeControl_.disabled;
  }

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  initialize(
    labelFactory = (el) => new MDCFloatingLabel(el),
    lineRippleFactory = (el) => new MDCLineRipple(el)) {
    this.nativeControl_ = this.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR);
    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }
    const lineRippleElement = this.root_.querySelector(strings.LINE_RIPPLE_SELECTOR);
    if (lineRippleElement) {
      this.lineRipple_ = lineRippleFactory(lineRippleElement);
    }

    if (this.root_.classList.contains(cssClasses.BOX)) {
      this.ripple = this.initRipple_();
    }
  }

  initRipple_() {
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      registerInteractionHandler: (type, handler) => this.nativeControl_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.nativeControl_.removeEventListener(type, handler),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  getDefaultFoundation() {
    return new MDCSelectFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      floatLabel: (value) => {
        if (this.label_) {
          this.label_.float(value);
        }
      },
      activateBottomLine: () => {
        if (this.lineRipple_) {
          this.lineRipple_.activate();
        }
      },
      deactivateBottomLine: () => {
        if (this.lineRipple_) {
          this.lineRipple_.deactivate();
        }
      },
      setDisabled: (disabled) => this.nativeControl_.disabled = disabled,
      registerInteractionHandler: (type, handler) => this.nativeControl_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.nativeControl_.removeEventListener(type, handler),
      getSelectedIndex: () => this.nativeControl_.selectedIndex,
      setSelectedIndex: (index) => this.nativeControl_.selectedIndex = index,
      getValue: () => this.nativeControl_.value,
      setValue: (value) => this.nativeControl_.value = value,
    });
  }

  initialSyncWithDOM() {
    // needed to sync floating label
    this.selectedIndex = this.nativeControl_.selectedIndex;

    if (this.nativeControl_.disabled) {
      this.disabled = true;
    }
  }

  destroy() {
    if (this.ripple) {
      this.ripple.destroy();
    }
    super.destroy();
  }
}
