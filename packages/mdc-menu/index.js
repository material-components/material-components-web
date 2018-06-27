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

import MDCComponent from '@material/base/component';
import {MDCMenuFoundation, AnchorMargin} from './foundation';
import {strings} from './constants';
import {MDCMenuSurface} from '@material/menu-surface';
import {MDCList} from '@material/list';

/**
 * @extends MDCComponent<!MDCMenuFoundation>
 */
class MDCMenu extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);
    /** @private {!MDCMenuSurface} */
    this.menuSurface_;
    /** @private {!MDCList} */
    this.list_;
    /** @private {!Function} */
    this.handleKeydown_ = this.foundation_.handleKeydown.bind(this.foundation_);
    /** @private {!Function} */
    this.handleClick_ = this.foundation_.handleClick.bind(this.foundation_);
  }

  /**
   * @param {!Element} root
   * @return {!MDCMenu}
   */
  static attachTo(root) {
    return new MDCMenu(root);
  }

  initialize(
    menuSurfaceFactory = (el) => new MDCMenuSurface(el),
    listFactory = (el) => new MDCList(el)) {
    this.menuSurface_ = menuSurfaceFactory(this.root_);

    const list = this.root_.querySelector(strings.LIST_SELECTOR);
    if (list) {
      this.list_ = listFactory(list);
      this.list_.wrapFocus = true;
    }
  }

  destroy() {
    if (this.list_) {
      this.list_.destroy();
    }

    this.menuSurface_.destroy();
    this.deregisterListeners_();
    super.destroy();
  }

  /** @return {boolean} */
  get open() {
    return this.menuSurface_.open;
  }

  /** @param {boolean} value */
  set open(value) {
    if (value) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.menuSurface_.show();
    this.registerListeners_();
    this.list_.listElements_[0].focus();
  }

  hide() {
    this.deregisterListeners_();
    this.menuSurface_.hide();
  }

  /**
   * @param {Corner} corner Default anchor corner alignment of top-left
   *     menu corner.
   */
  setAnchorCorner(corner) {
    this.menuSurface_.setAnchorCorner(corner);
  }

  /**
   * @param {AnchorMargin} margin
   */
  setAnchorMargin(margin) {
    this.menuSurface_.setAnchorMargin(margin);
  }

  /**
   * Return the item container element inside the component.
   * @return {?Element}
   */
  get itemsContainer_() {
    return this.list_.root_;
  }

  /**
   * Return the items within the menu. Note that this only contains the set of elements within
   * the items container that are proper list items, and not supplemental / presentational DOM
   * elements.
   * @return {!Array<!Element>}
   */
  get items() {
    if (this.list_) {
      return this.list_.listElements_;
    }
  }

  /**
   * Return the item within the menu at the index specified.
   * @param {number} index
   * @return {?Element}
   */
  getOptionByIndex(index) {
    const items = this.items;

    if (index < items.length) {
      return this.items[index];
    } else {
      return null;
    }
  }

  /** @param {boolean} quickOpen */
  set quickOpen(quickOpen) {
    this.menuSurface_.quickOpen = quickOpen;
  }


  registerListeners_() {
    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('click', this.handleClick_);
  }

  deregisterListeners_() {
    this.root_.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener('click', this.handleClick_);
  }

  /** @return {!MDCMenuFoundation} */
  getDefaultFoundation() {
    return new MDCMenuFoundation({
      selectElementAtIndex: (index) => {
        const list = this.items;
        if (list && list.length > index && list[index].parentElement.classList.contains('mdc-menu--selection-group')) {
          list[index].classList.add('mdc-menu-item--selected');
          list[index].setAttribute('aria-selected', 'true');
        }
      },
      closeSurface: () => this.hide(),
      getFocusedElementIndex: () => this.items.indexOf(document.activeElement),
      removeClassFromSelectionGroup: (index) => {
        const ele = this.items[index];
        if (ele.parentElement && ele.parentElement.classList.contains('mdc-menu--selection-group')) {
          [].slice.call(ele.parentElement.children).forEach((listItem) => {
            listItem.classList.remove('mdc-menu-item--selected');
            listItem.removeAttribute('aria-selected');
          });
        }
      },
      notifySelected: (evtData) => this.emit(MDCMenuFoundation.strings.SELECTED_EVENT, {
        index: evtData.index,
        item: this.items[evtData.index],
      }),
    });
  }
}

export {MDCMenuFoundation, MDCMenu, AnchorMargin};
