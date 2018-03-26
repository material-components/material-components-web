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

import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
import MDCRippleAdapter from '@material/ripple/adapter';

import {strings} from './constants';

/** @record */
class RipplePaintSurface extends RippleCapableSurface {}

/** @type {?Element} */
RipplePaintSurface.prototype.paintSurface;

/**
 * @extends MDCRipple
 */
class MDCTabRipple extends MDCRipple {
  /**
   * @param {!RipplePaintSurface} instance
   * @return {!MDCRippleAdapter}
   */
  static createAdapter(instance) {
    return /** @type {!MDCRippleAdapter} */ (Object.assign({}, MDCRipple.createAdapter(instance), {
      addClass: (className) => instance.paintSurface.classList.add(className),
      removeClass: (className) => instance.paintSurface.classList.remove(className),
      updateCssVariable: (varName, value) => instance.paintSurface.style.setProperty(varName, value),
    }));
  }

  /**
   * @param {!Element} root
   * @return {!MDCTabRipple}
   */
  static attachTo(root) {
    return new MDCTabRipple(root);
  }

  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @type {?Element} */
    this.paintSurface_ = null;
  }

  /** @return {?Element} */
  get paintSurface() {
    if (!this.paintSurface_) {
      this.paintSurface_ = this.root_.querySelector(strings.RIPPLE_SELECTOR);
    }
    return this.paintSurface_;
  }

  /**
   * @return {!MDCRippleFoundation}
   * @override
   */
  getDefaultFoundation() {
    return new MDCRippleFoundation(MDCTabRipple.createAdapter(this));
  }
}

export default MDCTabRipple;
