/**
 * @license
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

import MDCComponent from '@material/base/component';

import {MDCTextFieldInputAdapter} from './adapter';
import MDCTextFieldInputFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCTextFieldInputFoundation>}
 * @final
 */
class MDCTextFieldInput extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCTextFieldInput}
   */
  static attachTo(root) {
    return new MDCTextFieldInput(root);
  }

  /**
   * @return {MDCTextFieldInputFoundation}.
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCTextFieldFoundation}
   */
  getDefaultFoundation() {
    return new MDCTextFieldInputFoundation(/** @type {!MDCTextFieldInputAdapter} */ (Object.assign({
      registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      getNativeInput: () => this.root_,
      notifyFocusAction: () => this.emit(MDCTextFieldInputFoundation.strings.FOCUS_EVENT, {}),
      notifyBlurAction: () => this.emit(MDCTextFieldInputFoundation.strings.BLUR_EVENT, {}),
      notifyPressedAction: () => this.emit(MDCTextFieldInputFoundation.strings.PRESSED_EVENT, {}),
    })));
  }
}

export {MDCTextFieldInput, MDCTextFieldInputFoundation};
