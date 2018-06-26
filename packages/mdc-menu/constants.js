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

/** @enum {string} */
const cssClasses = {
  ROOT: 'mdc-menu',
  OPEN: 'mdc-menu-surface--open',
  ANIMATING_OPEN: 'mdc-menu-surface--animating-open',
  ANIMATING_CLOSED: 'mdc-menu-surface--animating-closed',
  SELECTED_LIST_ITEM: 'mdc-list-item--selected',
};

/** @enum {string} */
const strings = {
  ITEMS_SELECTOR: '.mdc-list',
  SELECTED_EVENT: 'MDCMenu:selected',
  CANCEL_EVENT: 'MDCMenu:cancel',
  ARIA_DISABLED_ATTR: 'aria-disabled',
  LIST_SELECTOR: '.mdc-list',
  MENU_SURFACE_SELECTOR: '.mdc-menu-surface',
};

export {cssClasses, strings};
