/**
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

/** @enum {string} */
const strings = {
  ARIA_HIDDEN: 'aria-hidden',
  ROLE: 'role',
  INPUT_SELECTOR: '.mdc-textfield__input',
  LABEL_SELECTOR: '.mdc-textfield__label',
  ICON_SELECTOR: '.mdc-textfield__icon',
  ICON_EVENT: 'MDCTextfield:icon',
  BOTTOM_LINE_SELECTOR: '.mdc-textfield__bottom-line',
};

/** @enum {string} */
const cssClasses = {
  ROOT: 'mdc-textfield',
  UPGRADED: 'mdc-textfield--upgraded',
  DISABLED: 'mdc-textfield--disabled',
  FOCUSED: 'mdc-textfield--focused',
  INVALID: 'mdc-textfield--invalid',
  HELPTEXT_PERSISTENT: 'mdc-textfield-helptext--persistent',
  HELPTEXT_VALIDATION_MSG: 'mdc-textfield-helptext--validation-msg',
  LABEL_FLOAT_ABOVE: 'mdc-textfield__label--float-above',
  LABEL_SHAKE: 'mdc-textfield__label--shake',
  BOX: 'mdc-textfield--box',
  TEXT_FIELD_ICON: 'mdc-textfield__icon',
  TEXTAREA: 'mdc-textfield--textarea',
  BOTTOM_LINE_ACTIVE: 'mdc-textfield__bottom-line--active',
};

export {cssClasses, strings};
