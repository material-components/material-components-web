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

// I have to import the foundation to get the constants, because closure won't let me
// do import {strings as MDCExpansionPanelFoundation.strings}
import MDCExpansionPanelFoundation from '../foundation';

/** @enum {string} */
const strings = {
  CHILD_SELECTOR: `.${MDCExpansionPanelFoundation.cssClasses.ROOT}`,
  CHANGE_EVENT: 'MDCExpansionPanelAccordion:change',
};

/** @enum {string} */
const cssClasses = {
  ROOT: 'mdc-expansion-panel-accordion',
  EXCLUDED: 'mdc-expansion-panel-accordion--excluded',
};

export {cssClasses, strings};
