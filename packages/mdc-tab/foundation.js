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
      TABS_SELECTOR: `.${ROOT}__tab-bar`,
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
      getIndexForEventTarget: (/* target: EventTarget */) => {},
      addClassForTabAtIndex: (/* index: int, className: string */) => {},
      removeClassForTabAtIndex: (/* index: int, className: string */) => {},
      setAttrForTabAtIndex: (/* index: int, attr: string, value: string */) => {},
      rmAttrForTabAtIndex: (/* index: int, attr: string */) => {},
      getNumberOfTabs: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCTabsFoundation.defaultAdapter, adapter));
    this.selectedIndex_ = -1;

    this.clickHandler_ = (evt) => {
      evt.preventDefault();
      const index = this.adapter_.getIndexForEventTarget(evt.target);
      this.setSelectedIndex(index);
    };
  }

  init() {
    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
  }

  getSelectedIndex() {
    return this.selectedIndex_;
  }

  setSelectedIndex(index) {
    const prevSelectedIndex = this.selectedIndex_;
    if (prevSelectedIndex >= 0) {
      this.adapter_.rmAttrForTabAtIndex(prevSelectedIndex, 'aria-selected');
      this.adapter_.removeClassForTabAtIndex(prevSelectedIndex, 'mdc-tabs__tab--active');
      this.adapter_.removeClassForPanelAtIndex(this.selectedIndex_, 'mdc-tabs__panel--active');
    }

    this.selectedIndex_ = index >= 0 && index < this.adapter_.getNumberOfTabs() ? index : -1;
    if (this.selectedIndex_ >= 0) {
      this.adapter_.setAttrForTabAtIndex(this.selectedIndex_, 'aria-selected', 'true');
      this.adapter_.addClassForTabAtIndex(this.selectedIndex_, 'mdc-tabs__tab--active');
      this.adapter_.addClassForPanelAtIndex(this.selectedIndex_, 'mdc-tabs__panel--active');
    }
  }
}
