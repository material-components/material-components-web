/**
 * @license
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

import MDCFoundation from '@material/base/foundation';
import MDCTextFieldIconAdapter from './adapter';
import {cssClasses, strings} from './constants';


/**
 * @extends {MDCFoundation<!MDCTextFieldIconAdapter>}
 * @final
 */
class MDCTextFieldIconFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCTextFieldIconAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextFieldIconAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextFieldIconAdapter} */ ({
      setAttr: () => {},
      eventTargetHasClass: () => {},
      notifyIconAction: () => {},
    });
  }

  /**
   * @param {!MDCTextFieldIconAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextFieldIconAdapter} */ ({})) {
    super(Object.assign(MDCTextFieldIconFoundation.defaultAdapter, adapter));
  }

  /**
   * Sets the content of the helper text field.
   * @param {string} content
   */
  setDisabled(disabled) {
    if (disabled) {
      this.adapter_.setIconAttr('tabindex', '-1');
    } else {
      this.adapter_.setIconAttr('tabindex', '0');
    }
  }

  /**
   * Handles a text field interaction event
   * @param {!Event} evt
   */
  handleTextFieldInteraction(evt) {
    const {target, type} = evt;
    const {TEXT_FIELD_ICON} = MDCTextFieldInputFoundation.cssClasses;
    const targetIsIcon = this.adapter_.eventTargetHasClass(target, TEXT_FIELD_ICON);
    const eventTriggersNotification = type === 'click' || evt.key === 'Enter' || evt.keyCode === 13;
    if (targetIsIcon && eventTriggersNotification) {
      this.adapter_.notifyIconAction();
    }
  }
}

export default MDCTextFieldIconFoundation;
