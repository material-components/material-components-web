/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import MDCComponent from '@material/base/component';

import {MDCTab, MDCTabFoundation} from '@material/tab/index';
import {MDCTabScroller} from '@material/tab-scroller/index';

import MDCTabBarAdapter from './adapter';
import MDCTabBarFoundation from './foundation';

let tabIdCounter = 0;

/**
 * @extends {MDCComponent<!MDCTabBarFoundation>}
 * @final
 */
class MDCTabBar extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);

    /** @private {!Array<!MDCTab>} */
    this.tabList_;

    /** @private {?MDCTabScroller} */
    this.tabScroller_;

    /** @private {?function(?Event): undefined} */
    this.handleTabInteraction_;

    /** @private {?function(?Event): undefined} */
    this.handleKeyDown_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTabBar}
   */
  static attachTo(root) {
    return new MDCTabBar(root);
  }

  set focusOnActivate(focusOnActivate) {
    this.tabList_.forEach((tab) => tab.focusOnActivate = focusOnActivate);
  }

  set useAutomaticActivation(useAutomaticActivation) {
    this.foundation_.setUseAutomaticActivation(useAutomaticActivation);
  }

  /**
   * @param {(function(!Element): !MDCTab)=} tabFactory A function which creates a new MDCTab
   * @param {(function(!Element): !MDCTabScroller)=} tabScrollerFactory A function which creates a new MDCTabScroller
   */
  initialize(
    tabFactory = (el) => new MDCTab(el),
    tabScrollerFactory = (el) => new MDCTabScroller(el)) {
    this.tabList_ = this.instantiateTabs_(tabFactory);
    this.tabScroller_ = this.instantiateTabScroller_(tabScrollerFactory);
  }

  initialSyncWithDOM() {
    this.handleTabInteraction_ = (evt) => this.foundation_.handleTabInteraction(evt);
    this.handleKeyDown_ = (evt) => this.foundation_.handleKeyDown(evt);

    this.root_.addEventListener(MDCTabFoundation.strings.INTERACTED_EVENT, this.handleTabInteraction_);
    this.root_.addEventListener('keydown', this.handleKeyDown_);

    for (let i = 0; i < this.tabList_.length; i++) {
      if (this.tabList_[i].active) {
        this.scrollIntoView(i);
        break;
      }
    }
  }

  destroy() {
    super.destroy();
    this.root_.removeEventListener(MDCTabFoundation.strings.INTERACTED_EVENT, this.handleTabInteraction_);
    this.root_.removeEventListener('keydown', this.handleKeyDown_);
    this.tabList_.forEach((tab) => tab.destroy());
    this.tabScroller_.destroy();
  }

  /**
   * @return {!MDCTabBarFoundation}
   */
  getDefaultFoundation() {
    return new MDCTabBarFoundation(
      /** @type {!MDCTabBarAdapter} */ ({
        scrollTo: (scrollX) => this.tabScroller_.scrollTo(scrollX),
        incrementScroll: (scrollXIncrement) => this.tabScroller_.incrementScroll(scrollXIncrement),
        getScrollPosition: () => this.tabScroller_.getScrollPosition(),
        getScrollContentWidth: () => this.tabScroller_.getScrollContentWidth(),
        getOffsetWidth: () => this.root_.offsetWidth,
        isRTL: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
        setActiveTab: (index) => this.foundation_.activateTab(index),
        activateTabAtIndex: (index, clientRect) => this.tabList_[index].activate(clientRect),
        deactivateTabAtIndex: (index) => this.tabList_[index].deactivate(),
        focusTabAtIndex: (index) => this.tabList_[index].focus(),
        getTabIndicatorClientRectAtIndex: (index) => this.tabList_[index].computeIndicatorClientRect(),
        getTabDimensionsAtIndex: (index) => this.tabList_[index].computeDimensions(),
        getPreviousActiveTabIndex: () => {
          for (let i = 0; i < this.tabList_.length; i++) {
            if (this.tabList_[i].active) {
              return i;
            }
          }
          return -1;
        },
        getFocusedTabIndex: () => {
          const tabElements = this.getTabElements_();
          const activeElement = document.activeElement;
          return tabElements.indexOf(activeElement);
        },
        getIndexOfTabById: (id) => {
          for (let i = 0; i < this.tabList_.length; i++) {
            if (this.tabList_[i].id === id) {
              return i;
            }
          }
          return -1;
        },
        getTabListLength: () => this.tabList_.length,
        notifyTabActivated: (index) => this.emit(MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT, {index}, true),
      })
    );
  }

  /**
   * Activates the tab at the given index
   * @param {number} index The index of the tab
   */
  activateTab(index) {
    this.foundation_.activateTab(index);
  }

  /**
   * Scrolls the tab at the given index into view
   * @param {number} index THe index of the tab
   */
  scrollIntoView(index) {
    this.foundation_.scrollIntoView(index);
  }

  /**
   * Returns all the tab elements in a nice clean array
   * @return {!Array<!Element>}
   * @private
   */
  getTabElements_() {
    return [].slice.call(this.root_.querySelectorAll(MDCTabBarFoundation.strings.TAB_SELECTOR));
  }

  /**
   * Instantiates tab components on all child tab elements
   * @param {(function(!Element): !MDCTab)} tabFactory
   * @return {!Array<!MDCTab>}
   * @private
   */
  instantiateTabs_(tabFactory) {
    return this.getTabElements_().map((el) => {
      el.id = el.id || `mdc-tab-${++tabIdCounter}`;
      return tabFactory(el);
    });
  }

  /**
   * Instantiates tab scroller component on the child tab scroller element
   * @param {(function(!Element): !MDCTabScroller)} tabScrollerFactory
   * @return {?MDCTabScroller}
   * @private
   */
  instantiateTabScroller_(tabScrollerFactory) {
    const tabScrollerElement = this.root_.querySelector(MDCTabBarFoundation.strings.TAB_SCROLLER_SELECTOR);
    if (tabScrollerElement) {
      return tabScrollerFactory(tabScrollerElement);
    }
    return null;
  }
}

export {MDCTabBar, MDCTabBarFoundation};
