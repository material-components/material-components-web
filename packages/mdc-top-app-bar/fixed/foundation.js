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

import {cssClasses} from '../constants';
import MDCTopAppBarAdapter from '../adapter';
import MDCTopAppBarFoundation from '../foundation';

/**
 * @extends {MDCTopAppBarFoundation<!MDCFixedTopAppBarFoundation>}
 * @final
 */
class MDCFixedTopAppBarFoundation extends MDCTopAppBarFoundation {
  /**
   * @param {!MDCTopAppBarAdapter} adapter
   */
  constructor(adapter) {
    super(adapter);
    /** State variable for the previous scroll iteration top app bar state */
    this.wasScrolled_ = false;

    this.scrollHandler_ = () => this.fixedScrollHandler_();
  }

  init() {
    super.init();
    this.adapter_.registerScrollHandler(this.scrollHandler_);
  }

  destroy() {
    super.destroy();
    this.adapter_.deregisterScrollHandler(this.scrollHandler_);
  }

  /**
   * Scroll handler for applying/removing the modifier class
   * on the fixed top app bar.
   */
  fixedScrollHandler_() {
    const currentScroll = this.adapter_.getViewportScrollY();

    if (currentScroll <= 0) {
      if (this.wasScrolled_) {
        this.adapter_.removeClass(cssClasses.FIXED_SCROLLED_CLASS);
        this.wasScrolled_ = false;
      }
    } else {
      if (!this.wasScrolled_) {
        this.adapter_.addClass(cssClasses.FIXED_SCROLLED_CLASS);
        this.wasScrolled_ = true;
      }
    }
  }
}

export default MDCFixedTopAppBarFoundation;
