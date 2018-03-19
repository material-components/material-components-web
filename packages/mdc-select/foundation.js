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

import {MDCFoundation} from '@material/base/index';
import {cssClasses, strings} from './constants';
import {MDCMenuFoundation} from '@material/menu/index';

const OPENER_KEYS = [
  {key: 'ArrowUp', keyCode: 38, forType: 'keydown'},
  {key: 'ArrowDown', keyCode: 40, forType: 'keydown'},
  {key: 'Space', keyCode: 32, forType: 'keyup'},
];

export default class MDCSelectFoundation extends MDCFoundation {
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
      floatLabel: (/* value: boolean */) => {},
      activateBottomLine: () => {},
      deactivateBottomLine: () => {},
      setAttr: (/* attr: string, value: string */) => {},
      rmAttr: (/* attr: string */) => {},
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerOptionsInteractionHandler: (/* type: string, handler: EventListener */) => {},

      getComputedStyleValue: (/* propertyName: string */) => /* string */ '',
      setStyle: (/* propertyName: string, value: string */) => {},
      create2dRenderingContext: () => /* {font: string, measureText: (string) => {width: number}} */ ({
        font: '',
        measureText: () => ({width: 0}),
      }),

      isMenuOpen: () => /* boolean */ false,
      setSelectedTextContent: (/* textContent: string */) => {},
      getNumberOfOptions: () => /* number */ 0,
      getTextForOptionAtIndex: (/* index: number */) => /* string */ '',
      getValueForOptionAtIndex: (/* index: number */) => /* string */ '',
      setAttrForOptionAtIndex: (/* index: number, attr: string, value: string */) => {},
      rmAttrForOptionAtIndex: (/* index: number, attr: string */) => {},
      getOffsetTopForOptionAtIndex: (/* index: number */) => /* number */ 0,
      notifyChange: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCSelectFoundation.defaultAdapter, adapter));
    // this.ctx_ = null;
    this.selectedIndex_ = -1;
    this.disabled_ = false;
    this.isFocused_ = false;

    /** @private {number} */
    // this.animationRequestId_ = 0;

    this.focusHandler_ = (evt) => this.handleFocus_(evt);
    this.blurHandler_ = (evt) => this.handleBlur_(evt);
    this.selectionHandler_ = (evt) => this.handleSelect_(evt);
  }

  init() {
    this.ctx_ = this.adapter_.create2dRenderingContext();
    this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
    this.adapter_.registerInteractionHandler('blur', this.blurHandler_);
    this.adapter_.registerInteractionHandler('change', this.selectionHandler_);
  }

  destroy() {
    // Drop reference to context object to prevent potential leaks
    this.ctx_ = null;
    // cancelAnimationFrame(this.animationRequestId_);
    this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
    this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);
    this.adapter_.deregisterInteractionHandler('change', this.selectionHandler_);
  }

  getSelectedIndex() {
    return this.selectedIndex_;
  }

  setSelectedIndex(index) {
    const prevSelectedIndex = this.selectedIndex_;
    if (prevSelectedIndex >= 0) {
      this.adapter_.rmAttrForOptionAtIndex(this.selectedIndex_, 'aria-selected');
    }

    this.selectedIndex_ = index >= 0 && index < this.adapter_.getNumberOfOptions() ? index : -1;
    let selectedTextContent = '';
    if (this.selectedIndex_ >= 0) {
      selectedTextContent = this.adapter_.getTextForOptionAtIndex(this.selectedIndex_).trim();
      this.adapter_.setAttrForOptionAtIndex(this.selectedIndex_, 'aria-selected', 'true');
      this.adapter_.floatLabel(true);
    } else {
      if (!this.adapter_.isMenuOpen()) {
        this.adapter_.floatLabel(false);
      }
    }
    this.adapter_.setSelectedTextContent(selectedTextContent);
  }

  setDisabled(disabled) {
    const {DISABLED} = MDCSelectFoundation.cssClasses;
    this.disabled_ = disabled;
    if (this.disabled_) {
      this.adapter_.addClass(DISABLED);
      this.adapter_.setAttr('aria-disabled', 'true');
    } else {
      this.adapter_.removeClass(DISABLED);
      this.adapter_.rmAttr('aria-disabled');
    }
  }

  // resize() {
  //   const font = this.adapter_.getComputedStyleValue('font');
  //   const letterSpacing = parseFloat(this.adapter_.getComputedStyleValue('letter-spacing'));
  //
  //   if (font) {
  //     this.ctx_.font = font;
  //   } else {
  //     const primaryFontFamily = this.adapter_.getComputedStyleValue('font-family').split(',')[0];
  //     const fontSize = this.adapter_.getComputedStyleValue('font-size');
  //     this.ctx_.font = `${fontSize} ${primaryFontFamily}`;
  //   }
  //
  //   let maxTextLength = 0;
  //
  //   for (let i = 0, l = this.adapter_.getNumberOfOptions(); i < l; i++) {
  //     const surfacePaddingRight = parseInt(this.adapter_.getComputedStyleValue('padding-right'), 10);
  //     const surfacePaddingLeft = parseInt(this.adapter_.getComputedStyleValue('padding-left'), 10);
  //     const selectBoxAddedPadding = surfacePaddingRight + surfacePaddingLeft;
  //     const txt = this.adapter_.getTextForOptionAtIndex(i).trim();
  //     const {width} = this.ctx_.measureText(txt);
  //     const addedSpace = letterSpacing * txt.length;
  //
  //     maxTextLength =
  //       Math.max(maxTextLength, Math.ceil(width + addedSpace + selectBoxAddedPadding));
  //   }
  //
  //   this.adapter_.setStyle('width', `${maxTextLength}px`);
  // }

  handleFocus_() {
    console.log("FOCUS!")
    this.isFocused_ = true;
    this.adapter_.activateBottomLine();
  }

  handleBlur_() {
    console.log("Blur")
    this.isFocused_ = false;
    this.adapter_.deactivateBottomLine();
  }

  handleSelect_(evt) {
    const index = this.adapter_.getIndexByValue(evt.target.value);

    if (index !== this.selectedIndex_) {
      this.setSelectedIndex(index);
    }
  }
}
