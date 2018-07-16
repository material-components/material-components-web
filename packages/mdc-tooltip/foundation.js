/**
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
      getControllerBoundingRect: () => /* {width: number, height: number} */
      ({width: 0, height: 0, offsetTop: 0, offsetBottom: 0}),
      setStyle: (/* propertyName: string, value: string */) => {},
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

    /** @public {number} */
    this.gap = 12;

    /** @public {number} */
    this.showDelay = 1500;
  }

  /**
   * Touch End handler to hide the tooltip.
   */
  handleTouchEnd() {
    this.hide();
  }

  /**
   * Blur handler to hide the tooltip.
   */
  handleBlur() {
    this.hide();
  }

  /**
   * Mouse Leave handler to hide the tooltip.
   */
  handleMouseLeave() {
    this.hide();
  }

  /**
   * Touch Start handler to show the tooltip delayed.
   */
  handleTouchStart() {
    this.showDelayed();
  }

  /**
   * Focus handler to show the tooltip delayed.
   */
  handleFocus() {
    this.showDelayed();
  }

  /**
   * Mouse Enter handler to show the tooltip delayed.
   */
  handleMouseEnter() {
    this.showDelayed();
  }

  calcPosition_() {
    const ctrlRect = this.adapter_.getControllerBoundingRect();

    const tooltipHeight = this.adapter_.getRootHeight();
    const tooltipWidth = this.adapter_.getRootWidth();
    const ctrlOffsetTop = ctrlRect.top;
    const ctrlOffsetLeft = ctrlRect.left;
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

    return {
      top,
      left
    };
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

    const calculatedPos = this.calcPosition_();

    this.adapter_.setStyle('top', calculatedPos.top.toString() + 'px');
    this.adapter_.setStyle('left', calculatedPos.left.toString() + 'px');
  }

  showDelayed() {
    this.showTimeout_ = setTimeout(() => {
      this.show();
    }, this.showDelay);
  }

  show() {
    this.setDirection_();
    this.displayed_ = true;
    this.adapter_.addClass(cssClasses.SHOW);
  }

  hide() {
    this.adapter_.addClass(cssClasses.ANIMATION);
    this.adapter_.removeClass(cssClasses.SHOW);
    this.displayed_ = false;

    clearTimeout(this.showTimeout_);
  }

  destroy() {
    this.removeEventListeners_();
    clearTimeout(this.showTimeout_);
  }
}

export default MDCTooltipFoundation;
