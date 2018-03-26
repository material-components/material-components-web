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
import {MDCRipple} from '@material/ripple/index';
import {MDCSelectBottomLine} from './bottom-line/index';
import {MDCSelectLabel} from './label/index';

import MDCSelectFoundation from './foundation';
import {strings} from './constants';

export {MDCSelectFoundation};

export class MDCSelect extends MDCComponent {
  static attachTo(root) {
    return new MDCSelect(root);
  }

  get value() {
    return this.foundation_.getValue();
  }

  set value(value) {
    this.foundation_.setValue(value);
  }

  get options() {
    return [].slice.call(this.surface_.options);
  }

  get selectedOptions() {
    return [].slice.call(this.surface_.selectedOptions);
  }

  get selectedIndex() {
    return this.foundation_.getSelectedIndex();
  }

  set selectedIndex(selectedIndex) {
    this.foundation_.setSelectedIndex(selectedIndex);
  }

  get disabled() {
    return this.foundation_.disabled;
  }

  set disabled(disabled) {
    this.foundation_.disabled = disabled;
  }

  item(index) {
    return this.surface_.item(index);
  }

  indexByValue_(value) {
    // NOTE: IE11 precludes us from using Array.prototype.find
    for (let i = 0, options = this.options, option; (option = options[i]); i++) {
      if (option.value === value) {
        return i;
      }
    }
    return null;
  }

  initialize(
    labelFactory = (el) => new MDCSelectLabel(el),
    bottomLineFactory = (el) => new MDCSelectBottomLine(el)) {
    this.surface_ = this.root_.querySelector(strings.SURFACE_SELECTOR);
    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }
    const bottomLineElement = this.root_.querySelector(strings.BOTTOM_LINE_SELECTOR);
    if (bottomLineElement) {
      this.bottomLine_ = bottomLineFactory(bottomLineElement);
    }

    this.ripple = new MDCRipple(this.root_);
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
      activateBottomLine: () => this.bottomLine_.activate(),
      deactivateBottomLine: () => this.bottomLine_.deactivate(),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      rmAttr: (attr, value) => this.root_.removeAttribute(attr, value),
      setDisabled: (disabled) => this.surface_.disabled = disabled,
      registerInteractionHandler: (type, handler) => this.surface_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.surface_.removeEventListener(type, handler),
      getNumberOfOptions: () => this.options.length,
      getIndexForOptionValue: (value) => this.indexByValue_(value),
      getValueForOptionAtIndex: (index) => this.options[index].value,
      setSelectedIndex: (index) => this.surface_.selectedIndex = index,
      getValue: () => this.surface_.value,
      setValue: (value) => this.surface_.value = value,
      setAttrForOptionAtIndex: (index, attr, value) => this.options[index].setAttribute(attr, value),
      rmAttrForOptionAtIndex: (index, attr) => this.options[index].removeAttribute(attr),
    });
  }

  initialSyncWithDOM() {
    const selectedOption = this.selectedOptions[0];
    const idx = selectedOption ? this.options.indexOf(selectedOption) : -1;
    if (idx >= 0 && selectedOption.value) {
      this.selectedIndex = idx;
    }

    if (this.root_.getAttribute('aria-disabled') === 'true') {
      this.disabled = true;
    }
  }
}
