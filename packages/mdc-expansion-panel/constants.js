/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @enum {string} */
const strings = {
  EXPANSION_ICON_SELECTOR: '.mdc-expansion-panel__expansion-icon',
  CHANGE_EVENT: 'MDCExpansionPanel:change',
  EXPAND_EVENT: 'MDCExpansionPanel:expand',
  COLLAPSE_EVENT: 'MDCExpansionPanel:collapse',
};

/** @enum {string} */
const cssClasses = {
  ROOT: 'mdc-expansion-panel',
  EXPANDED: 'mdc-expansion-panel--expanded',
  COLLAPSED: 'mdc-expansion-panel--collapsed',
  COLLAPSING: 'mdc-expansion-panel--collapsing',
  EXPANDING: 'mdc-expansion-panel--expanding',
  NO_CLICK: 'mdc-expansion-panel--no-click',
  ICON: 'mdc-expansion-panel__expansion-icon',
  ICON_EXPANDED: 'mdc-expansion-panel__expansion-icon--expanded',
  ACTIONS: 'mdc-expansion-panel__actions',
};

/** @enum {number} */
const numbers = {
  COLLAPSED_HEIGHT: 48,
  EXPANDED_VERTICAL_MARGIN: 16,
};

export {cssClasses, strings, numbers};
