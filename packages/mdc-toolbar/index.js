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

import {MDCComponent} from '@material/base/index';
import {MDCRipple} from '@material/ripple/index';

import MDCToolbarFoundation from './foundation';
import * as util from './util';

export {MDCToolbarFoundation};
export {util};

export class MDCToolbar extends MDCComponent {
  static attachTo(root) {
    return new MDCToolbar(root);
  }

  get firstRowElement_() {
    return this.root_.querySelector(MDCToolbarFoundation.strings.FIRST_ROW_SELECTOR);
  }

  get titleElement_() {
    return this.root_.querySelector(MDCToolbarFoundation.strings.TITLE_SELECTOR);
  }

  set fixedAdjustElement(fixedAdjustElement) {
    this.fixedAdjustElement_ = fixedAdjustElement;
    this.foundation_.updateAdjustElementStyles();
  }

  get fixedAdjustElement() {
    return this.fixedAdjustElement_;
  }

  initialize() {
    this.ripples_ = [].map.call(this.root_.querySelectorAll(MDCToolbarFoundation.strings.ICON_SELECTOR), (icon) => {
      const ripple = MDCRipple.attachTo(icon);
      ripple.unbounded = true;
      return ripple;
    });
  }

  destroy() {
    this.ripples_.forEach((ripple) => {
      ripple.destroy();
    });
    super.destroy();
  }


  getDefaultFoundation() {
    return new MDCToolbarFoundation({
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      registerScrollHandler: (handler) => window.addEventListener('scroll', handler, util.applyPassive()),
      deregisterScrollHandler: (handler) => window.removeEventListener('scroll', handler, util.applyPassive()),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      getViewportWidth: () => window.innerWidth,
      getViewportScrollY: () => window.pageYOffset,
      getOffsetHeight: () => this.root_.offsetHeight,
      getFirstRowElementOffsetHeight: () => this.firstRowElement_.offsetHeight,
      notifyChange: (evtData) => this.emit(MDCToolbarFoundation.strings.CHANGE_EVENT, evtData),
      setStyle: (property, value) => this.root_.style.setProperty(property, value),
      setStyleForTitleElement: (property, value) => this.titleElement_.style.setProperty(property, value),
      setStyleForFlexibleRowElement: (property, value) => this.firstRowElement_.style.setProperty(property, value),
      setStyleForFixedAdjustElement: (property, value) => {
        if (this.fixedAdjustElement) {
          this.fixedAdjustElement.style.setProperty(property, value);
        }
      },
    });
  }
}
