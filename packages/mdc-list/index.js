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
import MDCComponent from '../mdc-base/component';
import {MDCListFoundation} from './foundation';
import {strings} from './constants';

/**
 * @extends MDCComponent<!MDCistFoundation>
 */
export class MDCList extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);
    /** @private {!Function} */
    this.handleKeydown_ = null;
  }
  /**
   * @param {!Element} root
   * @return {!MDCList}
   */
  static attachTo(root) {
    return new MDCList(root);
  }

  destroy() {
    this.root_.removeEventListener('keydown', this.handleKeydown_);
  }

  initialSyncWithDOM() {
    this.handleKeydown_ = this.foundation_.handleKeydown.bind(this.foundation_);
    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.layout();
  }

  layout() {
    if (this.root_) {
      const direction = this.root_.getAttribute(strings.ARIA_ORIENTATION);
      this.foundation_.isVertical = direction !== strings.ARIA_ORIENTATION_VERTICAL;

      Array.from(this.root_.querySelectorAll('.mdc-list-item:not([tabIndex])'))
        .forEach((ele) => {
          ele.setAttribute('tabIndex', -1);
        });
    }
  }

  get vertical() {
    return this.foundation_.isVertical;
  }

  set vertical(value) {
    this.foundation_.isVertical = value;
  }

  get listElements_() {
    return Array.from(this.root_.querySelectorAll('.mdc-list-item'));
  }

  set wrapFocus(value) {
    this.foundation_.wrapFocus = value;
  }

  /** @return {!MDCListFoundation} */
  getDefaultFoundation() {
    return new MDCListFoundation(/** @type {!MDCListAdapter} */{
      getListItemCount: () => this.listElements_.length,
      getCurrentFocusedIndex: () => this.listElements_.indexOf(document.activeElement),
      focusItemAtIndex: (ndx) => this.listElements_[ndx].focus(),
      addEventListener: (type, action) => this.root_.addEventListener(type, action),
      removeEventListener: (type, action) => this.root_.removeEventListener(type, action),
    });
  }
}
