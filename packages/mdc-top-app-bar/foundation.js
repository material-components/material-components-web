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

import {strings, cssClasses, numbers} from './constants';
import MDCTopAppBarAdapter from './adapter';
import MDCFoundation from '@material/base/foundation';

/**
 * @extends {MDCFoundation<!MDCTopAppBarAdapter>}
 * @final
 */
class MDCTopAppBarFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /**
   * {@see MDCTopAppBarAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTopAppBarAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTopAppBarAdapter} */ ({
      hasClass: (/* className: string */) => {},
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      setStyle: (/* attribute: string, value: string */) => {},
      getTopAppBarHeight: () => {},
      registerNavigationIconInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterNavigationIconInteractionHandler: (/* type: string, handler: EventListener */) => {},
      notifyNavigationIconClicked: () => {},
      registerScrollHandler: (/* handler: EventListener */) => {},
      deregisterScrollHandler: (/* handler: EventListener */) => {},
      registerResizeHandler: (/* handler: EventListener */) => {},
      deregisterResizeHandler: (/* handler: EventListener */) => {},
      getViewportScrollY: () => /* number */ 0,
      getTotalActionItems: () => /* number */ 0,
    });
  }

  /**
   * @param {!MDCTopAppBarAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCTopAppBarFoundation.defaultAdapter, adapter));
    // State variable for the current top app bar state
    /** @private {boolean} */
    this.isCollapsed_ = false;
    // Used for diffs of current scroll position vs previous scroll position
    /** @private {number} */
    this.lastScrollPosition_ = this.adapter_.getViewportScrollY();
    // Used to verify when the top app bar is completely showing or completely hidden
    /** @private {number} */
    this.topAppBarHeight_ = this.adapter_.getTopAppBarHeight();
    // isDocked_ is used to indicate if the top app bar is 100% showing or hidden
    /** @private {boolean} */
    this.isDocked_ = true;
    // Variable for current scroll position of the top app bar
    /** @private {number} */
    this.currentAppBarScrollPosition_ = this.topAppBarHeight_;
    // Used to prevent the top app bar from being scrolled out of view during resize events
    /** @private {boolean} */
    this.isCurrentlyBeingResized_ = false;
    // The timeout that's used to throttle the resize events
    /** @private {number} */
    this.resizeThrottleId_ = -1;
    // The timeout that's used to debounce flipping the isCurrentlyBeingResized_ variable after a resize
    /** @private {number} */
    this.resizeDebounceId_ = -1;

    this.navClickHandler_ = () => this.adapter_.notifyNavigationIconClicked();
    this.scrollHandler_ = () => this.shortAppBarScrollHandler_();
    this.defaultScrollHandler_ = () => this.topAppBarScrollHandler_();
    this.defaultResizeHandler_ = () => this.topAppBarResizeHandler_();
  }

  init() {
    const isShortTopAppBar = this.adapter_.hasClass(cssClasses.SHORT_CLASS);

    if (isShortTopAppBar) {
      this.initShortTopAppBar_();
    } else {
      this.adapter_.registerScrollHandler(this.defaultScrollHandler_);
      this.adapter_.registerResizeHandler(this.defaultResizeHandler_);
    }

    this.adapter_.registerNavigationIconInteractionHandler('click', this.navClickHandler_);
  }

  destroy() {
    this.adapter_.deregisterNavigationIconInteractionHandler('click', this.navClickHandler_);
    this.adapter_.deregisterScrollHandler(this.scrollHandler_);
    this.adapter_.deregisterScrollHandler(this.defaultScrollHandler_);
    this.adapter_.deregisterResizeHandler(this.defaultResizeHandler_);
    this.adapter_.setStyle('top', 'auto');
  }

  /**
   * Used to set the initial style of the short top app bar
   */
  initShortTopAppBar_() {
    const isAlwaysCollapsed = this.adapter_.hasClass(cssClasses.SHORT_COLLAPSED_CLASS);

    if (this.adapter_.getTotalActionItems() > 0) {
      this.adapter_.addClass(cssClasses.SHORT_HAS_ACTION_ITEM_CLASS);
    }

    if (!isAlwaysCollapsed) {
      this.adapter_.registerScrollHandler(this.scrollHandler_);
      this.shortAppBarScrollHandler_();
    }
  }

  /**
   * Scroll handler for applying/removing the collapsed modifier class
   * on the short top app bar.
   */
  shortAppBarScrollHandler_() {
    const currentScroll = this.adapter_.getViewportScrollY();

    if (currentScroll <= 0) {
      if (this.isCollapsed_) {
        this.adapter_.removeClass(cssClasses.SHORT_COLLAPSED_CLASS);
        this.isCollapsed_ = false;
      }
    } else {
      if (!this.isCollapsed_) {
        this.adapter_.addClass(cssClasses.SHORT_COLLAPSED_CLASS);
        this.isCollapsed_ = true;
      }
    }
  }

  /**
   * Function to determine if the DOM needs to update and executes
   * @private
   * @returns {boolean}
   */
  isUpdateRequired() {
    const fullyShown = this.currentAppBarScrollPosition_ === 0;
    const fullyHidden = this.currentAppBarScrollPosition_ === this.topAppBarHeight_;
    let updateRequired = false;

    if (this.isDocked_) {
      // If it's already docked and the user is still scrolling in the same direction, do nothing
      if (!(fullyShown || fullyHidden)) {
        // Otherwise update the toolbar position
        this.isDocked_ = false;
        updateRequired = true;
      }
    } else {
      // If it's not docked but the position now indicates fully docked, toggle the docked variable
      if (fullyShown || fullyHidden) {
        this.isDocked_ = true;
      }
      updateRequired = true;
    }
    return updateRequired;
  }
  /**
   * Function to move the top app bar if needed.
   * @private
   */
  moveTopAppBar_() {
    if (this.isUpdateRequired()) {
      // Once the top app bar is fully hidden we use the max potential top app bar height as our offset
      // so the top app bar doesn't show if the window resizes and the new height > the old height.
      let offset = (this.currentAppBarScrollPosition_ - this.topAppBarHeight_);
      if (Math.abs(offset) === this.topAppBarHeight_) {
        offset = -numbers.MAX_TOP_APP_BAR_HEIGHT;
      }

      this.adapter_.setStyle('top', offset + 'px');
    }
  }

  /**
   * Scroll handler for the default scroll behavior of the top app bar.
   * @private
   */
  topAppBarScrollHandler_() {
    const currentScrollPosition = Math.max(this.adapter_.getViewportScrollY(), 0);
    const diff = currentScrollPosition - this.lastScrollPosition_;
    this.lastScrollPosition_ = currentScrollPosition;

    // If the window is being resized the lastScrollPosition_ needs to be updated but the
    // current scroll of the top app bar should stay in the same position.
    if (!this.isCurrentlyBeingResized_) {
      this.currentAppBarScrollPosition_ -= diff;

      if (this.currentAppBarScrollPosition_ < 0) {
        this.currentAppBarScrollPosition_ = 0;
      } else if (this.currentAppBarScrollPosition_ > this.topAppBarHeight_) {
        this.currentAppBarScrollPosition_ = this.topAppBarHeight_;
      }

      requestAnimationFrame(() => this.moveTopAppBar_());
    }
  }

  /**
   * Top app bar resize handler that throttle/debounce functions that execute updates
   * @private
   */
  topAppBarResizeHandler_() {
    // Throttle resize events 10 p/s
    if (!this.resizeThrottleId_) {
      this.resizeThrottleId_ = setTimeout((function() {
        this.resizeThrottleId_ = -1;
        this.throttledResizeHandler_();
      }).bind(this), 100);
    }

    this.isCurrentlyBeingResized_ = true;

    if (this.resizeDebounceId_) {
      clearTimeout(this.resizeDebounceId_);
    }

    this.resizeDebounceId_ = setTimeout((function() {
      this.topAppBarScrollHandler_();
      this.isCurrentlyBeingResized_ = false;
    }).bind(this), 100);
  }

  /**
   * Throttled function that updates the top app bar scrolled values if the
   * top app bar height changes.
   * @private
   */
  throttledResizeHandler_() {
    const currentHeight = this.adapter_.getTopAppBarHeight();
    if (this.topAppBarHeight_ !== currentHeight) {
      this.isDocked_ = false;

      // Since the top app bar has a different height depending on the screen width, this
      // will ensure that the top app bar remains in the correct location if
      // completely hidden and a resize makes the top app bar a different height.
      this.currentAppBarScrollPosition_ -= this.topAppBarHeight_ - currentHeight;
      this.topAppBarHeight_ = currentHeight;
    }
    this.topAppBarScrollHandler_();
  }
}

export default MDCTopAppBarFoundation;
