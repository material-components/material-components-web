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
/** @enum {string} */
const cssClasses = {
  DISMISSIBLE: 'mdc-drawer--dismissible',
  MODAL: 'mdc-drawer--modal',
  RAIL: 'mdc-drawer--rail',
  OPEN: 'mdc-drawer--open',
  ANIMATE: 'mdc-drawer--animate',
  ANIMATING_CLOSE: 'mdc-drawer--animating-close',
  ANIMATING_OPEN: 'mdc-drawer--animating-open',
  APP_CONTENT_ANIMATE_CLOSE: 'mdc-drawer-app-content--animating-close',
  APP_CONTENT_ANIMATE_OPEN: 'mdc-drawer-app-content--animating-open',
};

/** @enum {string} */
const strings = {
  APP_CONTENT_SELECTOR: '.mdc-drawer-app-content',
  CLOSE_EVENT: 'MDCDrawer:close',
  OPEN_EVENT: 'MDCDrawer:open',
};

export {cssClasses, strings};
