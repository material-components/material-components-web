/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {MDCTab, MDCTabFoundation} from '../tab';
import MDCTabBarFoundation from './foundation';

export {MDCTabBarFoundation};

export class MDCTabBar extends MDCComponent {
  static attachTo(root) {
    return new MDCTabBar(root);
  }

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

  initialize(tabFactory = (el) => new MDCTab(el)) {
    this.indicator_ = this.root_.querySelector(MDCTabBarFoundation.strings.INDICATOR_SELECTOR);
    this.tabs_ = this.gatherTabs_(tabFactory);
    this.tabSelectedHandler_ = ({detail}) => {
      const {tab} = detail;
      this.setActiveTab_(tab, true);
    };
  }

  getDefaultFoundation() {
    return new MDCTabBarFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      bindOnMDCTabSelectedEvent: () => this.listen(
        MDCTabFoundation.strings.SELECTED_EVENT, this.tabSelectedHandler_),
      unbindOnMDCTabSelectedEvent: () => this.unlisten(
        MDCTabFoundation.strings.SELECTED_EVENT, this.tabSelectedHandler_),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      getOffsetWidth: () => this.root_.offsetWidth,
      setStyleForIndicator: (propertyName, value) => this.indicator_.style.setProperty(propertyName, value),
      getOffsetWidthForIndicator: () => this.indicator_.offsetWidth,
      notifyChange: (evtData) => this.emit(MDCTabBarFoundation.strings.CHANGE_EVENT, evtData),
      getNumberOfTabs: () => this.tabs.length,
      isTabActiveAtIndex: (index) => this.tabs[index].isActive,
      setTabActiveAtIndex: (index, isActive) => {
        this.tabs[index].isActive = isActive;
      },
      isDefaultPreventedOnClickForTabAtIndex: (index) => this.tabs[index].preventDefaultOnClick,
      setPreventDefaultOnClickForTabAtIndex: (index, preventDefaultOnClick) => {
        this.tabs[index].preventDefaultOnClick = preventDefaultOnClick;
      },
      measureTabAtIndex: (index) => this.tabs[index].measureSelf(),
      getComputedWidthForTabAtIndex: (index) => this.tabs[index].computedWidth,
      getComputedLeftForTabAtIndex: (index) => this.tabs[index].computedLeft,
    });
  }

  gatherTabs_(tabFactory) {
    const tabElements = [].slice.call(this.root_.querySelectorAll(MDCTabBarFoundation.strings.TAB_SELECTOR));
    return tabElements.map((el) => tabFactory(el));
  }

  setActiveTabIndex_(activeTabIndex, notifyChange) {
    this.foundation_.switchToTabAtIndex(activeTabIndex, notifyChange);
  }

  layout() {
    this.foundation_.layout();
  }

  setActiveTab_(activeTab, notifyChange) {
    const indexOfTab = this.tabs.indexOf(activeTab);
    if (indexOfTab < 0) {
      throw new Error('Invalid tab component given as activeTab: Tab not found within this component\'s tab list');
    }
    this.setActiveTabIndex_(indexOfTab, notifyChange);
  }
}
