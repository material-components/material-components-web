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
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      setText: (/* text: string */) => {},
      getAttr: (/* name: string */) => /* string */ '',
      setAttr: (/* name: string, value: string */) => {},
      notifyChange: (/* evtData: IconButtonToggleEvent */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCIconButtonToggleFoundation.defaultAdapter, adapter));

    const {ARIA_PRESSED} = MDCIconButtonToggleFoundation.strings;

    /** @private {boolean} */
    this.on_ = this.adapter_.getAttr(ARIA_PRESSED) === 'true';

    /** @private {boolean} */
    this.disabled_ = false;

    /** @private {?IconButtonToggleState} */
    this.toggleOnData_ = null;

    /** @private {?IconButtonToggleState} */
    this.toggleOffData_ = null;

    this.clickHandler_ = /** @private {!EventListener} */ (
      () => this.toggleFromEvt_());
  }

  init() {
    this.refreshToggleData();
    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
  }

  refreshToggleData() {
    this.toggleOnData_ = {
      label: this.adapter_.getAttr(strings.DATA_TOGGLE_ON_LABEL),
      content: this.adapter_.getAttr(strings.DATA_TOGGLE_ON_CONTENT),
      cssClass: this.adapter_.getAttr(strings.DATA_TOGGLE_ON_CLASS),
    };
    this.toggleOffData_ = {
      label: this.adapter_.getAttr(strings.DATA_TOGGLE_OFF_LABEL),
      content: this.adapter_.getAttr(strings.DATA_TOGGLE_OFF_CONTENT),
      cssClass: this.adapter_.getAttr(strings.DATA_TOGGLE_OFF_CLASS),
    };
  }

  /** @private */
  toggleFromEvt_() {
    this.toggle();
    const {on_: isOn} = this;
    this.adapter_.notifyChange(/** @type {!IconButtonToggleEvent} */ ({isOn}));
  }

  /** @return {boolean} */
  isOn() {
    return this.on_;
  }

  /** @param {boolean=} isOn */
  toggle(isOn = !this.on_) {
    this.on_ = isOn;

    const {ARIA_LABEL, ARIA_PRESSED} = MDCIconButtonToggleFoundation.strings;

    this.adapter_.setAttr(ARIA_PRESSED, this.on_.toString());

    const {cssClass: classToRemove} =
        this.on_ ? this.toggleOffData_ : this.toggleOnData_;

    if (classToRemove) {
      this.adapter_.removeClass(classToRemove);
    }

    const {content, label, cssClass} = this.on_ ? this.toggleOnData_ : this.toggleOffData_;

    if (cssClass) {
      this.adapter_.addClass(cssClass);
    }
    if (content) {
      this.adapter_.setText(content);
    }
    if (label) {
      this.adapter_.setAttr(ARIA_LABEL, label);
    }
  }
}

/** @record */
class IconButtonToggleState {}

/**
 * The aria-label value of the icon toggle, or undefined if there is no aria-label.
 * @export {string|undefined}
 */
IconButtonToggleState.prototype.label;

/**
 * The text for the icon toggle, or undefined if there is no text.
 * @export {string|undefined}
 */
IconButtonToggleState.prototype.content;

/**
 * The CSS class to add to the icon toggle, or undefined if there is no CSS class.
 * @export {string|undefined}
 */
IconButtonToggleState.prototype.cssClass;

export default MDCIconButtonToggleFoundation;
