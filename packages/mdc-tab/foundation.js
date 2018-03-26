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
import MDCTabAdapter from './adapter';
import {
  cssClasses,
  strings,
} from './constants';

/**
 * @extends {MDCFoundation<!MDCTabAdapter>}
 * @final
 */
class MDCTabFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * @see MDCTabAdapter for typing information
   * @return {!MDCTabAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTabAdapter} */ ({
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      registerIndicatorEventHandler: () => {},
      deregisterIndicatorEventHandler: () => {},
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => {},
      setAttr: () => {},
      getIndicatorClientRect: () => {},
      setIndicatorStyleProperty: () => {},
      indicatorHasClass: () => {},
    });
  }

  /** @param {!MDCTabAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCTabFoundation.defaultAdapter, adapter));

    /** @private {function(!Event): undefined} */
    this.handleRootTransitionEnd_ = (evt) => this.handleRootTransitionEnd(evt);

    /** @private {function(Event=): undefined} */
    this.handleIndicatorTransitionEnd_ = (evt) => this.handleIndicatorTransitionEnd(evt);
  }

  /**
   * Handles the "transitionend" event for the root element
   * @param {!Event} evt A browser event
   */
  handleRootTransitionEnd(evt) {
    // Early exit for ripple
    if (evt.pseudoElement) {
      return;
    }
    this.adapter_.deregisterEventHandler('transitionend', this.handleRootTransitionEnd_);
    this.adapter_.removeClass(cssClasses.ANIMATING_ACTIVATE);
    this.adapter_.removeClass(cssClasses.ANIMATING_DEACTIVATE);
  }

  /**
   * Handles the "transitionend" event for the indicator
   */
  handleIndicatorTransitionEnd() {
    this.adapter_.deregisterIndicatorEventHandler('transitionend', this.handleIndicatorTransitionEnd_);
    this.adapter_.removeClass(cssClasses.ANIMATING_INDICATOR);
  }

  /**
   * Returns the Tab's active state
   * @return {boolean}
   */
  isActive() {
    return this.adapter_.hasClass(cssClasses.ACTIVE);
  }

  /**
   * Activates the Tab
   * @param {ClientRect=} previousTabIndicatorRect
   */
  activate(previousTabIndicatorRect) {
    // Early exit
    if (this.isActive()) {
      return;
    }

    this.activateTab_();
    this.activateIndicator_(previousTabIndicatorRect);
  }

  /**
   * Activates the tab
   * @private
   */
  activateTab_() {
    this.adapter_.registerEventHandler('transitionend', this.handleRootTransitionEnd_);
    this.adapter_.addClass(cssClasses.ANIMATING_ACTIVATE);
    this.adapter_.addClass(cssClasses.ACTIVE);
    this.adapter_.setAttr(strings.ARIA_SELECTED, 'true');
  }

  /**
   * Activates the tab indicator
   * @param {ClientRect=} previousTabIndicatorRect
   * @private
   */
  activateIndicator_(previousTabIndicatorRect) {
    if (!previousTabIndicatorRect || this.adapter_.indicatorHasClass(cssClasses.INDICATOR_ICON)) {
      return;
    }

    const currentTabIndicatorRect = this.adapter_.getIndicatorClientRect();
    const widthDelta = previousTabIndicatorRect.width / currentTabIndicatorRect.width;
    const xPosition = previousTabIndicatorRect.left - currentTabIndicatorRect.left;
    this.adapter_.setIndicatorStyleProperty('transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);
    // Force repaint
    this.adapter_.getIndicatorClientRect();
    requestAnimationFrame(() => {
      this.adapter_.addClass(cssClasses.ANIMATING_INDICATOR);
      this.adapter_.setIndicatorStyleProperty('transform', '');
    });
    this.adapter_.registerIndicatorEventHandler('transitionend', this.handleIndicatorTransitionEnd_);
  }

  /**
   * Deactivates the Tab
   */
  deactivate() {
    // Early exit
    if (!this.isActive()) {
      return;
    }
    this.adapter_.registerEventHandler('transitionend', this.handleRootTransitionEnd_);
    this.adapter_.addClass(cssClasses.ANIMATING_DEACTIVATE);
    this.adapter_.removeClass(cssClasses.ACTIVE);
    this.adapter_.setAttr(strings.ARIA_SELECTED, 'false');
  }

  /**
   * @return {!ClientRect}
   */
  getIndicatorClientRect() {
    return this.adapter_.getIndicatorClientRect();
  }
}

export default MDCTabFoundation;
