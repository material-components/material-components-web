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
      computeBoundingRect: () => /* {width: number, height: number} */({width: 0, height: 0}),
      computeControllerBoundingRect: () => /* {width: number, height: number} */
        ({width: 0, height: 0, offsetTop: 0, offsetBottom: 0}),
      setStyle: (/* propertyName: string, value: string */) => {},
      registerListener: (/* type: string, handler: EventListener */) => {},
      deregisterListener: (/* type: string, handler: EventListener */) => {},
      registerTransitionEndHandler: (/* handler: EventListener */) => {},
      deregisterTransitionEndHandler: (/* handler: EventListener */) => {},
      registerWindowListener: (/* type: string, handler: EventListener */) => {},
      deregisterWindowListener: (/* type: string, handler: EventListener */) => {},
    });
  }

  constructor(adapter) {
    super(Object.assign(MDCTooltipFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.displayed_ = false;

    /** @private {?string} */
    this.direction_ = null;

    /** @private {number} */
    this.gap = 12;
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
  }

  addEventListeners_() {
    this.adapter_.registerListener('mouseenter', this.show_.bind(this));
    this.adapter_.registerListener('focus', this.show_.bind(this));
    this.adapter_.registerListener('touchstart', this.show_.bind(this));
    this.adapter_.registerListener('mouseleave', this.hide_.bind(this));
    this.adapter_.registerListener('blur', this.hide_.bind(this));
    this.adapter_.registerListener('touchend', this.hide_.bind(this));

    this.adapter_.registerWindowListener('load', this.resetTooltip_.bind(this));
    this.adapter_.registerTransitionEndHandler(this.resetTooltip_.bind(this));
    this.adapter_.registerWindowListener('resize', this.resetTooltip_.bind(this));
  }

  resetTooltip_() {
    if (!this.displayed_) {
      const controllerPos = this.adapter_.computeControllerBoundingRect();
      const tooltipPos = this.adapter_.computeBoundingRect();
      const top = controllerPos.offsetTop + controllerPos.height / 2 - tooltipPos.height / 2;
      const left = controllerPos.offsetLeft + controllerPos.width / 2 - tooltipPos.width / 2;
      this.adapter_.setStyle('left', left.toString() + 'px');
      this.adapter_.setStyle('top', top.toString() + 'px');
    }
  }

  show_() {
    this.displayed_ = true;
    this.setDirection_();
    this.adapter_.addClass(cssClasses.OPEN);

    const tooltipPos = this.adapter_.computeBoundingRect();
    const controllerPos = this.adapter_.computeControllerBoundingRect();

    if (this.direction_ === 'bottom') {
      const top = controllerPos.offsetTop + controllerPos.height + this.gap;
      this.adapter_.setStyle('top', top.toString() + 'px');
    } else if (this.direction_ === 'top') {
      const top = controllerPos.offsetTop - tooltipPos.height - this.gap;
      this.adapter_.setStyle('top', top.toString() + 'px');
    } else if (this.direction_ === 'right') {
      const left = controllerPos.offsetLeft + controllerPos.width + this.gap;
      this.adapter_.setStyle('left', left.toString() + 'px');
    } else if (this.direction_ === 'left') {
      const left = controllerPos.offsetLeft - tooltipPos.width - this.gap;
      this.adapter_.setStyle('left', left.toString() + 'px');
    } else {
      throw new RangeError('MDCTooltip: direction = ' + this.direction_ + 'is unkown!');
    }
  }

  hide_() {
    this.displayed_ = false;
    this.adapter_.removeClass(cssClasses.OPEN);
  }

  destroy() {
    this.removeEventListeners_();
  }

  removeEventListeners_() {
    this.adapter_.deregisterWindowListener('resize', this.resetTooltip_);
    this.adapter_.deregisterTransitionEndHandler(this.resetTooltip_);
    this.adapter_.deregisterWindowListener('load', this.resetTooltip_);

    this.adapter_.deregisterListener('touchend', this.hide_);
    this.adapter_.deregisterListener('blur', this.hide_);
    this.adapter_.deregisterListener('mouseleave', this.hide_);
    this.adapter_.deregisterListener('touchstart', this.show_);
    this.adapter_.deregisterListener('focus', this.show_);
    this.adapter_.deregisterListener('mouseenter', this.show_);
  }
}

export default MDCTooltipFoundation;
