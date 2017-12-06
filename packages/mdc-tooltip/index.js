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

import MDCComponent from '@material/base/component';
import MDCTooltipFoundation from './foundation';
// import MDCRippleAdapter from './adapter';
import {getCorrectEventName} from '@material/animation';

/**
 * @extends MDCComponent<!MDCTooltipFoundation>
 */
class MDCTooltip extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCTooltip}
   */
  static attachTo(root) {
    return new MDCTooltip(root);
  }

  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** {Element} */
    this.controller_;
  }

  /** @type {boolean} */
  get visible() {
    return this.foundation_.displayed_;
  }

  show() {
    this.foundation_.show_();
  }

  hide() {
    this.foundation_.hide_();
  }

  reset() {
    this.foundation_.hide_();
    this.foundation_.resetTooltip_();
  }

  initialize() {
    // Need this to make tests work...
    if (!this.root_.classList.contains('mdc-tooltip')) {
      this.root_ = this.root_.querySelector('.mdc-tooltip');
    }

    const controllerID = this.root_.getAttribute('for');
    if (controllerID === null) {
      this.controller_ = this.root_.parentElement;
      // move this.root_ outside of the parentElement;
      const parent = this.controller_.parentElement;
      parent.appendChild(this.root_);
    } else {
      this.controller_ = document.getElementById(controllerID);
      if (this.controller_ === null) {
        throw new ReferenceError('MDCTooltip: Control Element not found. Make sure "for" points to a valid ID');
      }
    }
  }

  /**
   * @param {!MDCTooltip} instance
   * @return {!MDCTooltipAdapter}
   */
  static createAdapter(instance) {
    return {
      addClass: (className) => instance.root_.classList.add(className),
      removeClass: (className) => instance.root_.classList.remove(className),
      getClassList: () => instance.root_.classList,
      computeBoundingRect: () => instance.root_.getBoundingClientRect(),
      computeControllerBoundingRect: () => {
        const pos = instance.controller_.getBoundingClientRect();
        pos.offsetTop = instance.controller_.offsetTop;
        pos.offsetLeft = instance.controller_.offsetLeft;
        return pos;
      },
      setStyle: (propertyName, value) => instance.root_.style.setProperty(propertyName, value),
      registerListener: (type, handler) => instance.controller_.addEventListener(type, handler),
      deregisterListener: (type, handler) => instance.controller_.removeEventListener(type, handler),
      registerTransitionEndHandler:
        (handler) => instance.root_.addEventListener(getCorrectEventName(window, 'transitionend'), handler),
      deregisterTransitionEndHandler:
        (handler) => instance.root_.removeEventListener(getCorrectEventName(window, 'transitionend'), handler),
      registerWindowListener: (type, handler) => window.addEventListener(type, handler),
      deregisterWindowListener: (type, handler) => window.removeEventListener(type, handler),
    };
  }

  /** @return {!MDCTooltipFoundation} */
  getDefaultFoundation() {
    return new MDCTooltipFoundation(MDCTooltip.createAdapter(this));
  }
}

export {MDCTooltip, MDCTooltipFoundation};
