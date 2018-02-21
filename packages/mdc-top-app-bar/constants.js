/**
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

/** @enum {string} */
const strings = {
  NAVIGATION_EVENT: 'MDCTopAppBar:nav',
  TOPAPPBAR_SELECTOR: '.mdc-top-app-bar',
  TITLE_SELECTOR: '.mdc-top-app-bar__title',
  NAVIGATION_ICON_SELECTOR: '.mdc-top-app-bar__navigation-icon',
  ACTION_ICON_SELECTOR: '.mdc-top-app-bar__icon',
};

/** @enum {string} */
const cssClasses = {
  SHORT_CLASS: 'mdc-top-app-bar--short',
  RIGHT_ICON_CLASS: 'mdc-top-app-bar--short__right-icon',
  SHORT_CLOSED_CLASS: 'mdc-top-app-bar--short-collapsed',
};

export {strings, cssClasses};
