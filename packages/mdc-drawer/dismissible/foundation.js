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

import MDCDrawerAdapter from '../adapter';
import MDCFoundation from '@material/base/foundation';
import {cssClasses, strings} from '../constants';

/**
 * @extends {MDCFoundation<!MDCDrawerAdapter>}
 */
class MDCDismissibleDrawerFoundation extends MDCFoundation {

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter() {
    return /** @type {!MDCDrawerAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      computeBoundingRect: () => {},
      setStyleAppContent: (/* propertyName: string, value: string */) => {},
    });
  }
  /**
   * @param {!MDCDrawerAdapter} adapter
   */
  constructor(adapter) {
    super(adapter);

    /**
     * isOpen_ is used to indicate if the drawer is open.
     * @private {boolean}
     */
    this.isOpen_ = false;
  }

  /**
   * Function to open the drawer.
   */
  open() {
    const isOpen = this.adapter_.hasClass(cssClasses.OPEN);
    const isOpening = this.adapter_.hasClass(cssClasses.ANIMATING_OPEN);
    const isClosing = this.adapter_.hasClass(cssClasses.ANIMATING_CLOSE);
    if (isOpen || isOpening || isClosing) {
      return;
    }
    const appContentRectFirst = this.adapter_.computeAppContentBoundingRect();
    this.adapter_.addClass(cssClasses.OPEN);
    this.adapter_.addClass(cssClasses.ANIMATING_OPEN);
    this.isOpen_ = true;
    const appContentRectLast = this.adapter_.computeAppContentBoundingRect();
    this.animateAppContent(appContentRectFirst, appContentRectLast);
  }

  /**
   * Function to close the drawer.
   */
  close() {
    const isOpen = this.adapter_.hasClass(cssClasses.OPEN);
    const isOpening = this.adapter_.hasClass(cssClasses.ANIMATING_OPEN);
    const isClosing = this.adapter_.hasClass(cssClasses.ANIMATING_CLOSE);
    if (!isOpen || isOpening || isClosing) {
      return;
    }
    const appContentRectFirst = this.adapter_.computeAppContentBoundingRect();
    // setup drawer for last position for FLIP method
    this.adapter_.removeClass(cssClasses.OPEN);
    this.adapter_.addClass(cssClasses.ANIMATING_CLOSE);
    const appContentRectLast = this.adapter_.computeAppContentBoundingRect();

    // add back width for animation setup
    this.adapter_.addClass(cssClasses.OPEN);
    this.isOpen_ = false;
    this.animateAppContent(appContentRectFirst, appContentRectLast);
  }

  animateAppContent(appContentRectFirst, appContentRectLast) {
    const invert = appContentRectFirst.left - appContentRectLast.left;
    const isOpening = invert < 0;
    const {APP_CONTENT_ANIMATE_OPEN, APP_CONTENT_ANIMATE_CLOSE} = cssClasses;
    console.log(invert);
    if (isOpening) {
      this.adapter_.setStyleAppContent('transform', `translateX(${invert}px)`);
    }

    this.adapter_.computeAppContentBoundingRect();

    requestAnimationFrame(() => {
      const animateClass = isOpening ? APP_CONTENT_ANIMATE_OPEN : APP_CONTENT_ANIMATE_CLOSE;
      this.adapter_.addClassAppContent(animateClass);
      // this.adapter_.setStyleAppContent('transform', '');
      this.adapter_.setStyleAppContent('transform', isOpening ? '' : `translateX(${-invert}px)`);
    });
  }

  /**
   * Returns true if drawer is in open state.
   * @return {boolean}
   */
  isOpen() {
    return this.isOpen_;
  }

  /**
   * Keydown handler to close drawer when key is escape.
   * @param evt
   */
  handleKeydown() {
    this.close();
  }

  /**
   * Handles a transition end event on the root element.
   * @param {!Event} evt
   */
  handleTransitionEnd() {
    const {APP_CONTENT_ANIMATE_OPEN, APP_CONTENT_ANIMATE_CLOSE, ANIMATING_OPEN, ANIMATING_CLOSE, OPEN} = cssClasses;
    if (this.adapter_.hasClass(ANIMATING_CLOSE)) {
      this.adapter_.removeClass(OPEN);
    }
    this.adapter_.removeClassAppContent(APP_CONTENT_ANIMATE_OPEN);
    this.adapter_.removeClassAppContent(APP_CONTENT_ANIMATE_CLOSE);
    this.adapter_.removeClass(ANIMATING_OPEN);
    this.adapter_.removeClass(ANIMATING_CLOSE);
    this.adapter_.setStyleAppContent('transform', '');
  }
}

export default MDCDismissibleDrawerFoundation;
