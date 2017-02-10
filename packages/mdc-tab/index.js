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

import {MDCComponent} from '@material/base';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple';
import {getMatchesProperty} from '@material/ripple/util';

import MDCTabsFoundation from './foundation';

export {MDCTabsFoundation};

export class MDCTabs extends MDCComponent {
  static attachTo(root) {
    return new MDCTabs(root);
  }

  get tabsBar_() {
    return this.root_.querySelector('.mdc-tabs__tab-bar');
  }

  get tabsContainer_() {
    return this.root_.querySelector(MDCTabsFoundation.strings.TABS_SELECTOR);
  }

  get tabs() {
    const {tabsContainer_: tabsContainer} = this;
    return [].slice.call(tabsContainer.querySelectorAll('.mdc-tabs__tab[role]'));
  }

  get activeTabs() {
    return this.root_.querySelectorAll('.mdc-tabs__tab--active');
  }

  get panels() {
    const {root_: root} = this;
    return [].slice.call(root.querySelectorAll('.mdc-tabs__panel'));
  }

  get selectedIndex() {
    return this.foundation_.getSelectedIndex();
  }

  set selectedIndex(selectedIndex) {
    this.foundation_.setSelectedIndex(selectedIndex);
  }

  constructor(...args) {
    super(...args);
    this.ripple_ = this.initRipple_();
  }

  initRipple_() {
    const MATCHES = getMatchesProperty(HTMLElement.prototype);
    const adapter = Object.assign(MDCRipple.createAdapter(this.tabsBar_), {
      isUnbounded: () => false,
      isSurfaceActive: () => this.tabsBar_[MATCHES](':active'),
      addClass: (className) => this.tabsBar_.classList.add(className),
      removeClass: (className) => this.tabsBar_.classList.remove(className),
      registerInteractionHandler: (type, handler) => this.tabsBar_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.tabsBar_.removeEventListener(type, handler),
      updateCssVariable: (varName, value) => this.tabsBar_.style.setProperty(varName, value),
      computeBoundingRect: () => {
        const {left, top} = this.tabsBar_.getBoundingClientRect();
        const DIM = 40;
        return {
          top,
          left,
          right: left + DIM,
          bottom: top + DIM,
          width: DIM,
          height: DIM,
        };
      },
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.tabsBar_, foundation);
  }

  getDefaultFoundation() {
    return new MDCTabsFoundation({
      hasClass: (className) => this.root_.classList.contains(className),
      hasNecessaryDom: () => Boolean(this.tabsContainer_),
      registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
      getIndexForEventTarget: (target) => this.tabs.indexOf(target),
      addClassForTabAtIndex: (index, className) => this.tabs[index].classList.add(className),
      removeClassForTabAtIndex: (index, className) => this.tabs[index].classList.remove(className),
      setAttrForTabAtIndex: (index, attr, value) => this.tabs[index].setAttribute(attr, value),
      rmAttrForTabAtIndex: (index, attr) => this.tabs[index].removeAttribute(attr),
      getNumberOfTabs: () => this.tabs.length,
      addClassForPanelAtIndex: (index, className) => this.panels[index].classList.add(className),
      removeClassForPanelAtIndex: (index, className) => this.panels[index].classList.remove(className),
    });
  }

  initialSyncWithDOM() {
    const activeTab = this.activeTabs[0];
    const idx = activeTab ? this.tabs.indexOf(activeTab) : -1;
    if (idx >= 0) {
      this.selectedIndex = idx;
    }
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }
}
