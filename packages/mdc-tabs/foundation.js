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

import {MDCFoundation} from '@material/base';

const ROOT = 'mdc-tabs';

export default class MDCTabsFoundation extends MDCFoundation {
  static get cssClasses() {
    return {
      ROOT,
    };
  }

  static get strings() {
    return {
      TAB_CONTAINER_SELECTOR: `.${ROOT}`,
      TAB_BAR_SELECTOR: `.${ROOT}__tab-bar`,
    };
  }

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => {},
      hasNecessaryDom: () => {},
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerResizeHandler: (/* handler: EventListener */) => {},
      deregisterResizeHandler: (/* handler: EventListener */) => {},
      registerLoadHandler: (/* handler: EventListener */) => {},
      deregisterLoadHandler: (handler/* handler: EventListener */) => {},
      getIndexForEventTarget: (/* target: EventTarget */) => {},
      addClassForTabAtIndex: (/* index: int, className: string */) => {},
      removeClassForTabAtIndex: (/* index: int, className: string */) => {},
      setAttrForTabAtIndex: (/* index: int, attr: string, value: string */) => {},
      rmAttrForTabAtIndex: (/* index: int, attr: string */) => {},
      getNumberOfTabs: () => {},
      addClassForPanelAtIndex: (/* index: int, className: string */) => {},
      removeClassForPanelAtIndex: (/* index: int, className: string */) => {},
      getWidthForTabAtIndex: (/* index: int */) => {},
      getPositionForTabAtIndex: (/* index: int */) => {},
      setCSSForInkBar: (/* attr: string, value: string */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCTabsFoundation.defaultAdapter, adapter));
    this.selectedIndex_ = -1;

    this.clickHandler_ = (evt) => {
      evt.preventDefault();
      const index = this.adapter_.getIndexForEventTarget(evt.target);
      if (index >= 0) {
        this.setSelectedIndex(index);
      }
    };

    this.resizeHandler_ = (evt) => {
      evt.preventDefault();
      this.updateInkBar();
    }
  }

  init() {
    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
    this.adapter_.registerResizeHandler(this.resizeHandler_);
    this.adapter_.registerLoadHandler(this.resizeHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    this.adapter_.deregisterLoadHandler(this.resizeHandler_);
  }

  getSelectedIndex() {
    return this.selectedIndex_;
  }

  setSelectedIndex(index) {
    this.prevSelectedIndex_ = this.selectedIndex_;
    this.selectedIndex_ = index >= 0 && index < this.adapter_.getNumberOfTabs() ? index : -1;

    if (this.prevSelectedIndex_ >= 0) {
      this.adapter_.rmAttrForTabAtIndex(this.prevSelectedIndex_, 'aria-selected');
      this.adapter_.removeClassForTabAtIndex(this.prevSelectedIndex_, 'mdc-tabs__tab--active');
      this.adapter_.removeClassForPanelAtIndex(this.prevSelectedIndex_, 'mdc-tabs__panel--active');
    }

    if (this.selectedIndex_ >= 0) {
      this.adapter_.setAttrForTabAtIndex(this.selectedIndex_, 'aria-selected', 'true');
      this.adapter_.addClassForTabAtIndex(this.selectedIndex_, 'mdc-tabs__tab--active');
      this.adapter_.addClassForPanelAtIndex(this.selectedIndex_, 'mdc-tabs__panel--active');
    }

    this.updateInkBar()
    this.updateContent()
  }

  updateInkBar() {
    let width = this.adapter_.getWidthForTabAtIndex(this.selectedIndex_);
    let position = this.adapter_.getPositionForTabAtIndex(this.selectedIndex_);
    this.adapter_.setCSSForInkBar('width', `${width}px`);
    this.adapter_.setCSSForInkBar('left', `${position}px`);
    this.adapter_.setCSSForInkBar('right', `${position+width}px`)
  }

  updateContent() {
    this.adapter_.removeClassForPanelAtIndex(this.selectedIndex_, "mdc-tabs__panel--left");
    this.adapter_.removeClassForPanelAtIndex(this.selectedIndex_, "mdc-tabs__panel--right");

    for (let i = 0; i < this.adapter_.getNumberOfTabs(); i++) {
      this.adapter_.removeClassForPanelAtIndex(i, "mdc-tabs__panel--left");
      this.adapter_.removeClassForPanelAtIndex(i, "mdc-tabs__panel--right");
      if (i > this.selectedIndex_) {
        this.adapter_.addClassForPanelAtIndex(i, "mdc-tabs__panel--right");
      }
      if (i < this.selectedIndex_) {
        this.adapter_.addClassForPanelAtIndex(i, "mdc-tabs__panel--left");
      }
    }
  }
}
