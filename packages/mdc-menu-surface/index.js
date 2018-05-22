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

import MDCComponent from '@material/base/component';
import {getTransformPropertyName} from './util';
import {MDCMenuSurfaceFoundation, AnchorMargin} from './foundation';
import {MDCMenuSurfaceAdapter} from './adapter';
import {Corner, CornerBit, strings} from './constants';

/**
 * @extends MDCComponent<!MDCMenuSurfaceFoundation>
 */
class MDCMenuSurface extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @private {!Array<Element>} */
    this.focusableElements_ = [];
    /** @private {!Element} */
    this.previousFocus_;
    /** @private {!Element} */
    this.anchorElement;
  }

  /**
   * @param {!Element} root
   * @return {!MDCMenuSurface}
   */
  static attachTo(root) {
    return new MDCMenuSurface(root);
  }

  initialSyncWithDOM() {
    if (this.root_.parentElement && this.root_.parentElement.classList.contains('mdc-menu-surface--anchor')) {
      this.anchorElement = this.root_.parentElement;
    }

    this.focusableElements_ = [].slice.call(this.root_.querySelectorAll(strings.FOCUSABLE_ELEMENTS));
  }

  /** @return {boolean} */
  get open() {
    return this.foundation_.isOpen();
  }

  /** @param {boolean} value */
  set open(value) {
    if (value) {
      this.show();
    } else {
      this.foundation_.close();
    }
  }

  /** @param {{focusIndex: ?number}=} options */
  show({focusIndex = null} = {}) {
    this.focusableElements_ = [].slice.call(this.root_.querySelectorAll(strings.FOCUSABLE_ELEMENTS));
    this.foundation_.open({focusIndex: focusIndex});
  }

  hide() {
    this.foundation_.close();
  }

  /**
   * @param {Corner} corner Default anchor corner alignment of top-left
   *     surface corner.
   */
  setAnchorCorner(corner) {
    this.foundation_.setAnchorCorner(corner);
  }

  /**
   * @param {AnchorMargin} margin
   */
  setAnchorMargin(margin) {
    this.foundation_.setAnchorMargin(margin);
  }

  /** @param {boolean} quickOpen */
  set quickOpen(quickOpen) {
    this.foundation_.setQuickOpen(quickOpen);
  }

  /** @return {!MDCMenuSurfaceFoundation} */
  getDefaultFoundation() {
    return new MDCMenuSurfaceFoundation(
      /** @type {!MDCMenuSurfaceAdapter} */ (Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        getAttributeForEventTarget: (target, attributeName) => target.getAttribute(attributeName),
        getIndexForEventTarget: (target) => this.focusableElements_.indexOf(target),
        hasAnchor: () => !!this.anchorElement,
        registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
        deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
        registerBodyClickHandler: (handler) => document.body.addEventListener('click', handler),
        deregisterBodyClickHandler: (handler) => document.body.removeEventListener('click', handler),
        notifyClose: () => this.emit(MDCMenuSurfaceFoundation.strings.CLOSE_EVENT, {}),
        isElementInContainer: (el) => {
          return (this.root_ === el) ? true : this.root_.contains(el);
        },
        isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
        setTransformOrigin: (origin) => {
          this.root_.style[`${getTransformPropertyName(window)}-origin`] = origin;
        },
      },
      this.getFocusAdapterMethods_(),
      this.getDimensionAdapterMethods_())
      ));
  }

  /**
   * @return {{
   * focus: function(),
   * isFocused: function(): boolean,
   * saveFocus: function(),
   * restoreFocus: function(),
   * getNumberFocusableElements: function(): number,
   * getFocusedElementIndex: function(): number,
   * focusElementAtIndex: function(number)
   * }}
   * @private
   */
  getFocusAdapterMethods_() {
    return {
      focus: () => this.root_.focus(),
      isFocused: () => document.activeElement === this.root_,
      saveFocus: () => {
        this.previousFocus_ = document.activeElement ? document.activeElement: null;
      },
      restoreFocus: () => {
        if (this.previousFocus_) {
          this.previousFocus_.focus();
        }
      },
      getNumberFocusableElements: () => this.focusableElements_.length,
      getFocusedElementIndex: () => this.focusableElements_.indexOf(document.activeElement),
      focusElementAtIndex: (index) => this.focusableElements_[index] && this.focusableElements_[index].focus(),
    };
  }

  /**
   * @return {{
   * getInnerDimensions: function(),
   * getAnchorDimensions: function(): (HTMLElement | null | * | ClientRect),
   * getWindowDimensions: function(),
   * setPosition: function(*),
   * setMaxHeight: function(string)}}
   * @private
   */
  getDimensionAdapterMethods_() {
    return {
      getInnerDimensions: () => {
        return {width: this.root_.offsetWidth, height: this.root_.offsetHeight};
      },
      getAnchorDimensions: () => this.anchorElement && this.anchorElement.getBoundingClientRect(),
      getWindowDimensions: () => {
        return {width: window.innerWidth, height: window.innerHeight};
      },
      setPosition: (position) => {
        this.root_.style.left = 'left' in position ? position.left : null;
        this.root_.style.right = 'right' in position ? position.right : null;
        this.root_.style.top = 'top' in position ? position.top : null;
        this.root_.style.bottom = 'bottom' in position ? position.bottom : null;
      },
      setMaxHeight: (height) => {
        this.root_.style.maxHeight = height;
      },
    };
  }
}

export {MDCMenuSurfaceFoundation, MDCMenuSurface, AnchorMargin, Corner, CornerBit};
