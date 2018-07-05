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

import MDCFoundation from '@material/base/foundation';
import MDCTooltipAdapter from './adapter';
import cssClasses from './constants';

/**
 * @extends {MDCFoundation<!MDCTooltipAdapter>}
 */
class MDCTooltipFoundation extends MDCFoundation {
  /** @return enum {cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return {!MDCTooltipAdapter} */
  static get defaultAdapter() {
    return /** @type {!MDCTooltipAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      getClassList: () => /* [classNames: string] */ [],
      getRootWidth: () => /* type: number */ 0,
      getRootHeight: () => /* type: number */ 0,
      getControllerWidth: () => /* type: number */ 0,
      getControllerHeight: () => /* type: number */ 0,
      getControllerOffsetTop: () => /* type: number */ 0,
      getControllerOffsetLeft: () => /* type: number */ 0,
      setStyle: (/* propertyName: string, value: string */) => {},
      registerListener: (/* type: string, handler: EventListener */) => {},
      deregisterListener: (/* type: string, handler: EventListener */) => {}
    });
  }

  constructor(adapter) {
    super(Object.assign(MDCTooltipFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.displayed_ = false;

    /** @private {?string} */
    this.direction_ = null;

    /** @private {?number} */
    this.showTimeout_ = null;

    /** @private {?number} */
    this.hideTimeout_ = null;

    /** @public {number} */
    this.gap = 12;

    /** @public {number} */
    this.showDelay = 0;

    /** @public {number} */
    this.hideDelay = 1500;
  }

  init() {
    this.addEventListeners_();
  }

  setDirection_() {
    this.direction_ = 'bottom';
    const possibleDirections = {};
    possibleDirections[cssClasses.DIRECTION_BOTTOM] = 'bottom';
    possibleDirections[cssClasses.DIRECTION_TOP] = 'top';
    possibleDirections[cssClasses.DIRECTION_LEFT] = 'left';
    possibleDirections[cssClasses.DIRECTION_RIGHT] = 'right';

    const classNames = this.adapter_.getClassList();

    for (let i = 0; i < classNames.length; i++) {
      if (possibleDirections[classNames[i]] !== undefined) {
        this.direction_ = possibleDirections[classNames[i]];
      }
    }

    const tooltipHeight = this.adapter_.getRootHeight();
    const tooltipWidth = this.adapter_.getRootWidth();
    const ctrlOffsetTop = this.adapter_.getControllerOffsetTop();
    const ctrlOffsetLeft = this.adapter_.getControllerOffsetLeft();
    const ctrlHeight = this.adapter_.getControllerHeight();
    const ctrlWidth = this.adapter_.getControllerWidth();

    let top = ctrlOffsetTop + ctrlHeight / 2 - tooltipHeight / 2;
    let left = ctrlOffsetLeft + ctrlWidth / 2 - tooltipWidth / 2;

    if (this.direction_ === 'top') {
      top = ctrlOffsetTop - tooltipHeight - this.gap;
    } else if (this.direction_ === 'right') {
      left = ctrlOffsetLeft + ctrlWidth + this.gap;
    } else if (this.direction_ === 'left') {
      left = ctrlOffsetLeft - tooltipWidth - this.gap;
    } else {
      top = ctrlOffsetTop + ctrlHeight + this.gap;
    }

    this.adapter_.setStyle('top', top.toString() + 'px');
    this.adapter_.setStyle('left', left.toString() + 'px');
  }

  addEventListeners_() {
    this.adapter_.registerListener('mouseenter', this.showDelayed_.bind(this));
    this.adapter_.registerListener('focus', this.showDelayed_.bind(this));
    this.adapter_.registerListener('touchstart', this.showDelayed_.bind(this));
    this.adapter_.registerListener('mouseleave', this.hide_.bind(this));
    this.adapter_.registerListener('blur', this.hide_.bind(this));
    this.adapter_.registerListener('touchend', this.hide_.bind(this));
  }

  showDelayed_() {
    this.showTimeout_ = setTimeout(() => {
      this.show_();
    }, this.showDelay)
  }

  show_() {;
    this.setDirection_();
    this.displayed_ = true;
    this.adapter_.removeClass(cssClasses.HIDE);
    this.adapter_.addClass(cssClasses.SHOW);
    this.hideTimeout_ = setTimeout(() => {
      this.hide_();
    }, this.hideDelay);
  }

  hide_() {
    if(this.displayed_) {
      this.adapter_.removeClass(cssClasses.SHOW);
      this.adapter_.addClass(cssClasses.HIDE);
    }
    this.displayed_ = false;

    if(this.showTimeout_ != null){
      clearTimeout(this.showTimeout_);
      this.showTimeout_ = null;
    }
    if(this.hideTimeout_ != null){
      clearTimeout(this.hideTimeout_);
      this.hideTimeout_ = null;
    }
  }

  destroy() {
    this.removeEventListeners_();
  }

  removeEventListeners_() {
    this.adapter_.deregisterListener('touchend', this.hide_);
    this.adapter_.deregisterListener('blur', this.hide_);
    this.adapter_.deregisterListener('mouseleave', this.hide_);
    this.adapter_.deregisterListener('touchstart', this.show_);
    this.adapter_.deregisterListener('focus', this.show_);
    this.adapter_.deregisterListener('mouseenter', this.show_);
  }
}

export default MDCTooltipFoundation;
