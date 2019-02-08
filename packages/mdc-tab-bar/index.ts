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

import {MDCComponent} from '@material/base/component';

import {MDCTabScroller} from '@material/tab-scroller/index';
import {MDCTab, MDCTabFoundation} from '@material/tab/index';

import MDCTabBarFoundation from './foundation';

let tabIdCounter = 0;

type TabFactory = (el: HTMLElement) => MDCTab;
type TabScrollerFactory = (el: HTMLElement) => MDCTabScroller;

/**
 * @final
 */
class MDCTabBar extends MDCComponent<MDCTabBarFoundation> {

  static attachTo(root: Element): MDCTabBar {
    return new MDCTabBar(root);
  }

  root_!: HTMLElement;
  tabList_!: MDCTab[];
  tabScroller_!: MDCTabScroller | null;
  handleTabInteraction_!: EventListenerOrEventListenerObject;
  handleKeyDown_!: EventListenerOrEventListenerObject;

  set focusOnActivate(focusOnActivate: boolean) {
    this.tabList_.forEach((tab) => tab.focusOnActivate = focusOnActivate);
  }

  set useAutomaticActivation(useAutomaticActivation: boolean) {
    this.foundation_.setUseAutomaticActivation(useAutomaticActivation);
  }

  /**
   * @param {(function(!Element): !MDCTab)=} tabFactory A function which creates a new MDCTab
   * @param {(function(!Element): !MDCTabScroller)=} tabScrollerFactory A function which creates a new MDCTabScroller
   */
  initialize(
    tabFactory: TabFactory = (el: HTMLElement) => new MDCTab(el),
    tabScrollerFactory: TabScrollerFactory = (el: HTMLElement) => new MDCTabScroller(el)) {
    this.tabList_ = this.instantiateTabs_(tabFactory);
    this.tabScroller_ = this.instantiateTabScroller_(tabScrollerFactory);
  }

  initialSyncWithDOM() {
    this.handleTabInteraction_ = (
      (evt: CustomEvent) => this.foundation_.handleTabInteraction(evt)) as EventListenerOrEventListenerObject;
    this.handleKeyDown_ = (
      (evt: KeyboardEvent) => this.foundation_.handleKeyDown(evt)) as EventListenerOrEventListenerObject;

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
    if (this.tabScroller_) {
      this.tabScroller_.destroy();
    }
  }

  getDefaultFoundation(): MDCTabBarFoundation {
    return new MDCTabBarFoundation({
      activateTabAtIndex: (index, clientRect) => this.tabList_[index].activate(clientRect),
      deactivateTabAtIndex: (index) => this.tabList_[index].deactivate(),
      focusTabAtIndex: (index) => this.tabList_[index].focus(),
      getFocusedTabIndex: () => {
        const tabElements = this.getTabElements_();
        const activeElement = document.activeElement as HTMLElement;
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
      getOffsetWidth: () => this.root_.offsetWidth,
      getPreviousActiveTabIndex: () => {
        for (let i = 0; i < this.tabList_.length; i++) {
          if (this.tabList_[i].active) {
            return i;
          }
        }
        return -1;
      },
      getScrollContentWidth: () => (this.tabScroller_ as MDCTabScroller).getScrollContentWidth(),
      getScrollPosition: () => (this.tabScroller_ as MDCTabScroller).getScrollPosition(),
      getTabDimensionsAtIndex: (index) => this.tabList_[index].computeDimensions(),
      getTabIndicatorClientRectAtIndex: (index) => this.tabList_[index].computeIndicatorClientRect(),
      getTabListLength: () => this.tabList_.length,
      incrementScroll: (scrollXIncrement) => (this.tabScroller_ as MDCTabScroller).incrementScroll(scrollXIncrement),
      isRTL: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      notifyTabActivated: (index) => this.emit(MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT, {index}, true),
      scrollTo: (scrollX) => (this.tabScroller_ as MDCTabScroller).scrollTo(scrollX),
      setActiveTab: (index) => this.foundation_.activateTab(index),
    });
  }

  /**
   * Activates the tab at the given index
   * @param {number} index The index of the tab
   */
  activateTab(index: number) {
    this.foundation_.activateTab(index);
  }

  /**
   * Scrolls the tab at the given index into view
   * @param {number} index THe index of the tab
   */
  scrollIntoView(index: number) {
    this.foundation_.scrollIntoView(index);
  }

  /**
   * Returns all the tab elements in a nice clean array
   * @return {!Array<!Element>}
   * @private
   */
  private getTabElements_(): HTMLElement[] {
    return [].slice.call(this.root_.querySelectorAll(MDCTabBarFoundation.strings.TAB_SELECTOR));
  }

  /**
   * Instantiates tab components on all child tab elements
   * @param {(function(!Element): !MDCTab)} tabFactory
   * @return {!Array<!MDCTab>}
   * @private
   */
  private instantiateTabs_(tabFactory: TabFactory): MDCTab[] {
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
  private instantiateTabScroller_(tabScrollerFactory: TabScrollerFactory): MDCTabScroller | null {
    const tabScrollerElement = this.root_.querySelector(
      MDCTabBarFoundation.strings.TAB_SCROLLER_SELECTOR) as HTMLElement;
    if (tabScrollerElement) {
      return tabScrollerFactory(tabScrollerElement);
    }
    return null;
  }
}

export {MDCTabBar, MDCTabBarFoundation};
