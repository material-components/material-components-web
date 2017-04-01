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
import {MDCFoundation} from '@material/base';
import {cssClasses, strings, numbers} from './constants';

export default class MDCToolbarFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter() {
    return {
      hasClass: (/* className: string */) => /* boolean */ false,
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      registerScrollHandler: (/* handler: EventListener */) => {},
      deregisterScrollHandler: (/* handler: EventListener */) => {},
      registerResizeHandler: (/* handler: EventListener */) => {},
      deregisterResizeHandler: (/* handler: EventListener */) => {},
      getViewportWidth: () => /* number */ 0,
      getViewportScrollY: () => /* number */ 0,
      getOffsetHeight: () => /* number */ 0,
      getFlexibleRowElementOffsetHeight: () => /* number */ 0,
      notifyChange: (/* evtData: {detail: number} */) => {},
      setStyleForRootElement: (/* property: string, value: string */) => {},
      setStyleForTitleElement: (/* property: string, value: string */) => {},
      setStyleForFlexibleRowElement: (/* property: string, value: string */) => {},
      setStyleForFixedAdjustElement: (/* property: string, value: string */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCToolbarFoundation.defaultAdapter, adapter));
    this.resizeHandler_ = () => this.setKeyHeights();
    this.scrollHandler_ = () => this.changeToolbarStyles();
    this.resizeFrame_ = 0;
    this.scrollFrame_ = 0;
    this.executedLastChange_ = false;

    // Initialize toolbar behavior configuaration variables
    this.keyHeights = {
      'toolbarRowHeight': 0,
      // Calculated Height ratio. We use ratio to calculate corresponding heights in resize event.
      'toolbarRatio': 0,  // The ratio of toolbar height to row height
      'flexibleExpansionRatio': 0, // The ratio of flexible space height to row height
      'maxTranslateYRatio': 0, // The ratio of max toolbar move up distance to row height
      'scrollThesholdRatio': 0, // The ratio of max scrollTop that we should listen to to row height
      // Derived Heights based on the above key ratios.
      'toolbarHeight': 0,
      'flexibleExpansionHeight': 0, // Flexible row minus toolbar height (derived)
      'maxTranslateYDistance': 0, // When toolbar only fix last row (derived)
      'scrollTheshold': 0,
    };
    // Toolbar fixed behavior
    // If fixed is targeted only at the last row
    this.fixedLastrow_ = false;
    // If toolbar is fixed
    this.fixedAllRow_ = false;
    // Toolbar flexible behavior
    // If the first row is flexible
    this.hasFlexibleRow_ = false;
    // If use the default behavior
    this.useFlexDefaultBehavior_ = false;
  }

  init() {
    this.fixedAllRow_ = this.adapter_.hasClass(MDCToolbarFoundation.cssClasses.FIXED);
    this.fixedLastrow_ = this.adapter_.hasClass(MDCToolbarFoundation.cssClasses.FIXED_LASTROW);
    this.hasFlexibleRow_ = this.adapter_.hasClass(MDCToolbarFoundation.cssClasses.TOOLBAR_ROW_FLEXIBLE);
    if (this.hasFlexibleRow_) {
      this.useFlexDefaultBehavior_ = this.adapter_.hasClass(MDCToolbarFoundation.cssClasses.USE_FLEX_DEFAULT_BEHAVIOR);
    }
    this.initKeyRatio_();
    this.setKeyHeights_({isInit: true});
    this.adapter_.addClass(MDCToolbarFoundation.cssClasses.ROOT);
    this.adapter_.registerResizeHandler(this.resizeHandler_);
    this.adapter_.registerScrollHandler(this.scrollHandler_);
  }

  destroy() {
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    this.adapter_.deregisterScrollHandler(this.scrollHandler_);
  }

  setKeyHeights() {
    if (this.resizeFrame_ !== 0) {
      cancelAnimationFrame(this.resizeFrame_);
    }
    this.resizeFrame_ = requestAnimationFrame(() => {
      this.setKeyHeights_();
    });
  }

  changeAdjustElementStyles() {
    if (this.fixedLastrow_ || this.fixedAllRow_) {
      this.adapter_.setStyleForFixedAdjustElement('marginTop', `${this.keyHeights.toolbarHeight}px`);
    }
  }

  changeToolbarStyles() {
    if (this.scrollFrame_ !== 0) {
      cancelAnimationFrame(this.scrollFrame_);
    }

    this.scrollFrame_ = requestAnimationFrame(() => {
      const scrollTop = this.adapter_.getViewportScrollY();

      if (this.scrolledOutOfTheshold_(scrollTop)) {
        return; // return early if it is already out of theshold.
      }

      const flexibleExpansionRatio = this.getFlexibleExpansionRatio(scrollTop);
      this.adapter_.notifyChange(flexibleExpansionRatio);
      this.changeToolbarFlexibleState_(flexibleExpansionRatio);
      if (this.fixedLastrow_) {
        this.changeToolbarFixedState_(scrollTop);
      }
      if (this.hasFlexibleRow_) {
        this.changeFlexibleRowElementStyles_(flexibleExpansionRatio);
      }
    });
  }

  getFlexibleExpansionRatio(scrollTop) {
    const delta = 0.0001;
    return Math.max(0, 1 - scrollTop / (this.keyHeights.flexibleExpansionHeight + delta));
  }

  initKeyRatio_() {
    this.keyHeights.toolbarRowHeight = this.getRowHeight_();
    const flexibleRowMaxRatio = this.adapter_.getFlexibleRowElementOffsetHeight() / this.keyHeights.toolbarRowHeight;
    this.keyHeights.toolbarRatio = this.adapter_.getOffsetHeight() / this.keyHeights.toolbarRowHeight;
    this.keyHeights.flexibleExpansionRatio = flexibleRowMaxRatio - 1;
    this.keyHeights.maxTranslateYRatio = this.fixedLastrow_? this.keyHeights.toolbarRatio - flexibleRowMaxRatio : 0;
    this.keyHeights.scrollThesholdRatio = (this.fixedLastrow_? this.keyHeights.toolbarRatio : flexibleRowMaxRatio) - 1;
  }

  getRowHeight_() {
    const breakpoint = MDCToolbarFoundation.numbers.TOOLBAR_MOBILE_BREAKPOINT;
    return this.adapter_.getViewportWidth() <= breakpoint ?
      MDCToolbarFoundation.numbers.TOOLBAR_ROW_MOBILE_HEIGHT : MDCToolbarFoundation.numbers.TOOLBAR_ROW_HEIGHT;
  }

  scrolledOutOfTheshold_(scrollTop) {
    if (scrollTop > this.keyHeights.scrollTheshold) {
      if (this.executedLastChange_) {
        return true;
      }
      this.executedLastChange_ = true;
    } else {
      this.executedLastChange_ = false;
    }
    return false;
  }

  setKeyHeights_({isInit = false} = {}) {
    const newToolbarRowHeight = this.getRowHeight_();
    if (newToolbarRowHeight !== this.keyHeights.toolbarRowHeight || isInit) {
      this.keyHeights.toolbarRowHeight = newToolbarRowHeight;
      this.keyHeights.toolbarHeight = this.keyHeights.toolbarRatio * this.keyHeights.toolbarRowHeight;
      this.keyHeights.flexibleExpansionHeight =
        this.keyHeights.flexibleExpansionRatio * this.keyHeights.toolbarRowHeight;
      this.keyHeights.maxTranslateYDistance = this.keyHeights.maxTranslateYRatio * this.keyHeights.toolbarRowHeight;
      this.keyHeights.scrollTheshold = this.keyHeights.scrollThesholdRatio * this.keyHeights.toolbarRowHeight;
      this.changeAdjustElementStyles();
      this.changeToolbarStyles();
    }
  }

  changeToolbarFlexibleState_(flexibleExpansionRatio) {
    this.adapter_.removeClass(MDCToolbarFoundation.cssClasses.FLEXIBLE_MAX);
    this.adapter_.removeClass(MDCToolbarFoundation.cssClasses.FLEXIBLE_MIN);
    if (flexibleExpansionRatio === 1) {
      this.adapter_.addClass(MDCToolbarFoundation.cssClasses.FLEXIBLE_MAX);
    } else if (flexibleExpansionRatio === 0) {
      this.adapter_.addClass(MDCToolbarFoundation.cssClasses.FLEXIBLE_MIN);
    }
  }

  changeToolbarFixedState_(scrollTop) {
    const translateDistance = Math.max(0, Math.min(
      scrollTop - this.keyHeights.flexibleExpansionHeight,
      this.keyHeights.maxTranslateYDistance));
    this.adapter_.setStyleForRootElement('transform', `translateY(${-translateDistance}px)`);
    if (translateDistance === this.keyHeights.maxTranslateYDistance) {
      this.adapter_.addClass(MDCToolbarFoundation.cssClasses.FIXED_AT_LAST_ROW);
    } else {
      this.adapter_.removeClass(MDCToolbarFoundation.cssClasses.FIXED_AT_LAST_ROW);
    }
  }

  changeFlexibleRowElementStyles_(flexibleExpansionRatio) {
    if (this.fixedLastrow_ || this.fixedAllRow_) {
      const height = this.keyHeights.flexibleExpansionHeight * flexibleExpansionRatio;
      this.adapter_.setStyleForFlexibleRowElement('height',
        `${height + this.keyHeights.toolbarRowHeight}px`);
    }
    if (this.useFlexDefaultBehavior_) {
      this.changeElementStylesDefaultBehavior_(flexibleExpansionRatio);
    }
  }

  changeElementStylesDefaultBehavior_(flexibleExpansionRatio) {
    const maxTitleSize = MDCToolbarFoundation.numbers.MAX_TITLE_SIZE;
    const minTitleSize = MDCToolbarFoundation.numbers.MIN_TITLE_SIZE;
    const currentTitleSize = (maxTitleSize - minTitleSize) * flexibleExpansionRatio + minTitleSize;
    if (this.fixedLastrow_ || this.fixedAllRow_) {
      const height = this.keyHeights.flexibleExpansionHeight * flexibleExpansionRatio;
      this.adapter_.setStyleForTitleElement('transform', `translateY(${height}px)`);
    }
    this.adapter_.setStyleForTitleElement('fontSize', `${currentTitleSize}rem`);
  }
}
