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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC List. Provides an interface for managing focus.
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 *
 * @record
 */
class MDCListAdapter {
  /** @return {Number} */
  getListItemCount() {}

  /**
   * @return {Number} */
  getFocusedElementIndex() {}

  /** @param {Element} node */
  getListItemIndex(node) {}

  /**
   * Focuses list item at the index specified.
   * @param {Number} ndx
   */
  focusItemAtIndex(ndx) {}

  /**
   * Sets the tabindex to the value specified for all button/a element children of
   * the list item at the index specified.
   * @param {Number} listItemIndex
   * @param {Number} tabIndexValue
   */
  setTabIndexForListItemChildren(listItemIndex, tabIndexValue) {}
}

export {MDCListAdapter};
