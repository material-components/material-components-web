/**
 * @license
 * Copyright 2017 Google Inc.
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

import {MDCTab, MDCTabFoundation} from '../tab/index';
import MDCTabBarFoundation from './foundation';

export {MDCTabBarFoundation};

type TabFactory = (el: HTMLElement) => MDCTab;

export class MDCTabBar extends MDCComponent<MDCTabBarFoundation> {
  static attachTo(root: Element) {
    return new MDCTabBar(root);
  }

  tabs_!: MDCTab[];
  indicator_!: HTMLElement;
  root_!: HTMLElement;
  tabSelectedHandler_!: (evt: CustomEvent) => void;

  get tabs() {
    return this.tabs_;
  }

  get activeTab() {
    const activeIndex = this.foundation_.getActiveTabIndex();
    return this.tabs[activeIndex];
  }

  set activeTab(tab) {
    this.setActiveTab_(tab, false);
  }

  get activeTabIndex() {
    return this.foundation_.getActiveTabIndex();
  }

  set activeTabIndex(index) {
    this.setActiveTabIndex_(index, false);
  }

  initialize(tabFactory: TabFactory = (el: HTMLElement) => new MDCTab(el)) {
    this.indicator_ = this.root_.querySelector(MDCTabBarFoundation.strings.INDICATOR_SELECTOR) as HTMLElement;
    this.tabs_ = this.gatherTabs_(tabFactory);
    this.tabSelectedHandler_ = ({detail}) => {
      const {tab} = detail;
      this.setActiveTab_(tab, true);
    };
  }

  getDefaultFoundation() {
    return new MDCTabBarFoundation({
      addClass: (className) => this.root_.classList.add(className),
      bindOnMDCTabSelectedEvent: () => this.listen(
        MDCTabFoundation.strings.SELECTED_EVENT, this.tabSelectedHandler_),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      getComputedLeftForTabAtIndex: (index) => this.tabs[index].computedLeft,
      getComputedWidthForTabAtIndex: (index) => this.tabs[index].computedWidth,
      getNumberOfTabs: () => this.tabs.length,
      getOffsetWidth: () => this.root_.offsetWidth,
      getOffsetWidthForIndicator: () => this.indicator_.offsetWidth,
      isDefaultPreventedOnClickForTabAtIndex: (index) => this.tabs[index].preventDefaultOnClick,
      isTabActiveAtIndex: (index) => this.tabs[index].isActive,
      measureTabAtIndex: (index) => this.tabs[index].measureSelf(),
      notifyChange: (evtData) => this.emit(MDCTabBarFoundation.strings.CHANGE_EVENT, evtData),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      removeClass: (className) => this.root_.classList.remove(className),
      setPreventDefaultOnClickForTabAtIndex: (index, preventDefaultOnClick) => {
        this.tabs[index].preventDefaultOnClick = preventDefaultOnClick;
      },
      setStyleForIndicator: (propertyName, value) => this.indicator_.style.setProperty(propertyName, value),
      setTabActiveAtIndex: (index, isActive) => {
        this.tabs[index].isActive = isActive;
      },
      unbindOnMDCTabSelectedEvent: () => this.unlisten(
        MDCTabFoundation.strings.SELECTED_EVENT, this.tabSelectedHandler_),
    });
  }

  gatherTabs_(tabFactory: TabFactory) {
    const tabElements = [].slice.call(this.root_.querySelectorAll(MDCTabBarFoundation.strings.TAB_SELECTOR));
    return tabElements.map((el) => tabFactory(el));
  }

  setActiveTabIndex_(activeTabIndex: number, notifyChange: boolean) {
    this.foundation_.switchToTabAtIndex(activeTabIndex, notifyChange);
  }

  layout() {
    this.foundation_.layout();
  }

  setActiveTab_(activeTab: MDCTab, notifyChange: boolean) {
    const indexOfTab = this.tabs.indexOf(activeTab);
    if (indexOfTab < 0) {
      throw new Error('Invalid tab component given as activeTab: Tab not found within this component\'s tab list');
    }
    this.setActiveTabIndex_(indexOfTab, notifyChange);
  }
}
