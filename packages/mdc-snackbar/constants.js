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

const ROOT = 'mdc-snackbar';

export const cssClasses = {
  ROOT,
  TEXT: `${ROOT}__text`,
  ACTION_WRAPPER: `${ROOT}__action-wrapper`,
  ACTION_BUTTON: `${ROOT}__action-button`,
  ACTIVE: `${ROOT}--active`,
  MULTILINE: `${ROOT}--multiline`,
  ACTION_ON_BOTTOM: `${ROOT}--action-on-bottom`,
};

export const strings = {
  TEXT_SELECTOR: `.${cssClasses.TEXT}`,
  ACTION_WRAPPER_SELECTOR: `.${cssClasses.ACTION_WRAPPER}`,
  ACTION_BUTTON_SELECTOR: `.${cssClasses.ACTION_BUTTON}`,
};

export const numbers = {
  MESSAGE_TIMEOUT: 2750,
};
