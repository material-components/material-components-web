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

import {strings, cssClasses} from './constants';
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
      addAttributeToTopAppBar: (/* attribute: string, value: string */) => {},
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
    this.isCollapsed = false;
    this.lastScrollPosition = 0;
    this.toolbarHeight = this.adapter_.getTopAppBarHeight();
    // docked is used to indicate if the top app bar is 100% showing or hidden
    this.docked = true;
    // State variable for current scroll position
    this.currentAppBarScrollPosition = this.toolbarHeight;
    // holder for our resizeTimeout event to throttle resize events
    this.resizeTimeout = null;

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
    this.adapter_.addAttributeToTopAppBar('style', '');
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
      if (this.isCollapsed) {
        this.adapter_.removeClass(cssClasses.SHORT_COLLAPSED_CLASS);
        this.isCollapsed = false;
      }
    } else {
      if (!this.isCollapsed) {
        this.adapter_.addClass(cssClasses.SHORT_COLLAPSED_CLASS);
        this.isCollapsed = true;
      }
    }
  }

  topAppBarScrollHandler_() {
    let currentScroll = this.adapter_.getViewportScrollY();
    if (currentScroll < 0) currentScroll = 0;
    const diff = currentScroll - this.lastScrollPosition;
    this.lastScrollPosition = currentScroll;

    this.currentAppBarScrollPosition -= diff;
    if (this.currentAppBarScrollPosition < 0) {
      this.currentAppBarScrollPosition = 0;
    } if (this.currentAppBarScrollPosition > this.toolbarHeight) {
      this.currentAppBarScrollPosition = this.toolbarHeight;
    }

    this.moveTopAppBar();
  }

  moveTopAppBar() {
    if (this.docked) {
      // If it's already docked and the user is still scrolling in the same direction, do nothing
      if (!(this.currentAppBarScrollPosition === 0 || this.currentAppBarScrollPosition === this.toolbarHeight)) {
        const offset = (this.currentAppBarScrollPosition - this.toolbarHeight);
        this.adapter_.addAttributeToTopAppBar('style', 'top: ' + offset + 'px;');
        this.docked = false;
      }
    } else {
      if (this.currentAppBarScrollPosition === 0 || this.currentAppBarScrollPosition === this.toolbarHeight) {
        this.docked = true;
      }
      const offset = (this.currentAppBarScrollPosition - this.toolbarHeight);
      this.adapter_.addAttributeToTopAppBar('style', 'top: ' + offset + 'px;');
    }
  }

  topAppBarResizeHandler_() {
    if (!this.resizeTimeout) {
      this.resizeTimeout = setTimeout((function() {
        this.resizeTimeout = null;
        this.throttledResizeHandler_();
      }).bind(this), 100);
    }
  }

  throttledResizeHandler_() {
    const currentHeight = this.adapter_.getTopAppBarHeight();
    if (this.toolbarHeight !== currentHeight) {
      this.docked = false;
      if (this.currentAppBarScrollPosition === this.toolbarHeight) {
        this.currentAppBarScrollPosition = currentHeight;
      }
      this.toolbarHeight = currentHeight;
    }
    this.topAppBarScrollHandler_();
  }
}

export default MDCTopAppBarFoundation;
