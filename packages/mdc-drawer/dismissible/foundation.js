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
      hasClass: (/* className: string */) => {},
      computeBoundingRect: () => {},
      setStyleAppContent: (/* propertyName: string, value: string */) => {},
      addClassAppContent: (/* className: string */) => {},
      removeClassAppContent: (/* className: string */) => {},
      isRtl: () => {},
      notifyClose: () => {},
      notifyOpen: () => {},
      trapFocusOnSurface: () => {},
      untrapFocusOnSurface: () => {},
    });
  }

  /**
   * Function to open the drawer.
   */
  open() {
    if (this.isOpen() || this.isOpening() || this.isClosing()) {
      return;
    }
    this.adapter_.addClass(cssClasses.OPEN);
    this.adapter_.addClass(cssClasses.ANIMATE);
    delay(() => this.adapter_.addClass(cssClasses.OPENING));
  }

  /**
   * Function to close the drawer.
   */
  close() {
    if (!this.isOpen() || this.isOpening() || this.isClosing()) {
      return;
    }

    this.adapter_.addClass(cssClasses.CLOSING);
  }

  /** @protected */
  opened() {}

  /** @protected */
  closed() {}

  /**
   * Returns true if drawer is in open state.
   * @return {boolean}
   */
  isOpen() {
    return this.adapter_.hasClass(cssClasses.OPEN);
  }

  /**
   * Returns true if drawer is animating open.
   * @return {boolean}
   */
  isOpening() {
    return this.adapter_.hasClass(cssClasses.OPENING);
  }

  /**
   * Returns true if drawer is animating closed.
   * @return {boolean}
   */
  isClosing() {
    return this.adapter_.hasClass(cssClasses.CLOSING);
  }

  /**
   * Keydown handler to close drawer when key is escape.
   * @param evt
   */
  handleKeydown(evt) {
    const {keyCode, key} = evt;

    const isEscape = key === 'Escape' || keyCode === 27;
    if (isEscape) {
      this.close();
    }
  }

  /**
   * Handles a transition end event on the root element.
   * @param {!Event} evt
   */
  handleTransitionEnd() {
    const {OPENING, CLOSING, OPEN, ANIMATE} = cssClasses;
    if (this.isClosing()) {
      this.adapter_.removeClass(OPEN);
      this.closed();
      this.adapter_.notifyClose();
    } else {
      this.opened();
      this.adapter_.notifyOpen();
    }

    this.adapter_.removeClass(ANIMATE);
    this.adapter_.removeClass(OPENING);
    this.adapter_.removeClass(CLOSING);
  }
}

const delay = function(fn) {
  setTimeout(fn, 10);
};

export default MDCDismissibleDrawerFoundation;
