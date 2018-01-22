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

import MDCBottomLineAdapter from './adapter';
import MDCBottomLineFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCBottomLineFoundation>}
 * @final
 */
class MDCBottomLine extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCBottomLine}
   */
  static attachTo(root) {
    return new MDCBottomLine(root);
  }

  /**
   * @return {!MDCBottomLineFoundation}
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCBottomLineFoundation}
   */
  getDefaultFoundation() {
    return new MDCBottomLineFoundation(/** @type {!MDCBottomLineAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      notifyAnimationEnd: () => {
        this.emit(MDCBottomLineFoundation.strings.ANIMATION_END_EVENT, {});
      },
    })));
  }
}

export {MDCBottomLine, MDCBottomLineFoundation};
