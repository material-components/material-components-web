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

import MDCComponent from '@material/base/component';
import {MDCMenuFoundation} from './foundation';
import {strings, cssClasses} from './constants';
import {MDCMenuSurface, Corner} from '@material/menu-surface/index';
import {MDCMenuSurfaceFoundation, AnchorMargin} from '@material/menu-surface/foundation';
import {MDCList} from '@material/list/index';

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
    /** @private {!Function} */
    this.afterOpenedCallback_;
  }

  /**
   * @param {!HTMLElement} root
   * @return {!MDCMenu}
   */
  static attachTo(root) {
    return new MDCMenu(root);
  }

  initialize(
    menuSurfaceFactory = (el) => new MDCMenuSurface(el),
    listFactory = (el) => new MDCList(el)) {
    this.menuSurface_ = menuSurfaceFactory(this.root_);
    this.afterOpenedCallback_ = () => this.handleAfterOpened_();

    const list = this.root_.querySelector(strings.LIST_SELECTOR);
    if (list) {
      this.list_ = listFactory(list);
      this.list_.wrapFocus = true;
    }
    this.menuSurface_.listen(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.afterOpenedCallback_);
  }

  destroy() {
    if (this.list_) {
      this.list_.destroy();
    }

    this.menuSurface_.destroy();
    this.menuSurface_.unlisten(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.afterOpenedCallback_);
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
  }

  hide() {
    this.deregisterListeners_();
    this.menuSurface_.hide();
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left
   *     menu corner.
   */
  setAnchorCorner(corner) {
    this.menuSurface_.setAnchorCorner(corner);
  }

  /**
   * @param {!AnchorMargin} margin
   */
  setAnchorMargin(margin) {
    this.menuSurface_.setAnchorMargin(margin);
  }

  /**
   * Return the items within the menu. Note that this only contains the set of elements within
   * the items container that are proper list items, and not supplemental / presentational DOM
   * elements.
   * @return {!Array<!HTMLElement>}
   */
  get items() {
    return this.list_.listElements_;
  }

  /**
   * Return the item within the menu at the index specified.
   * @param {number} index
   * @return {?HTMLElement}
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

  /** @param {boolean} isFixed */
  set fixed(isFixed) {
    this.menuSurface_.setFixedPosition(isFixed);
  }

  hoistMenuToBody() {
    this.menuSurface_.hoistMenuToBody();
  }

  /** @param {boolean} isHoisted */
  setIsHoisted(isHoisted) {
    this.menuSurface_.setIsHoisted(isHoisted);
  }

  /**
   * Sets the element that the menu-surface is anchored to.
   * @param {!HTMLElement} element
   */
  setAnchorElement(element) {
    this.menuSurface_.anchorElement = element;
  }

  registerListeners_() {
    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('click', this.handleClick_);
  }

  deregisterListeners_() {
    this.root_.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener('click', this.handleClick_);
  }

  handleAfterOpened_() {
    const list = this.items;
    if (list.length > 0) {
      list[0].focus();
    }
  }

  /** @return {!MDCMenuFoundation} */
  getDefaultFoundation() {
    return new MDCMenuFoundation({
      addClassToElementAtIndex: (index, className) => {
        const list = this.items;
        if (list.length > index) {
          list[index].classList.add(className);
        }
      },
      removeClassFromElementAtIndex: (index, className) => {
        const list = this.items;
        if (list.length > index) {
          list[index].classList.remove(className);
        }
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
        const list = this.items;
        if (list.length > index) {
          list[index].setAttribute(attr, value);
        }
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
        const list = this.items;
        if (list.length > index) {
          list[index].removeAttribute(attr);
        }
      },
      elementContainsClass: (element, className) => element.classList.contains(className),
      closeSurface: () => this.hide(),
      getElementIndex: (element) => this.items.indexOf(element),
      getParentElement: (element) => element.parentElement,
      getSelectedElementIndex: (selectionGroup) => {
        return this.items.indexOf(selectionGroup.querySelector(`.${cssClasses.MENU_SELECTED_LIST_ITEM}`));
      },
      notifySelected: (evtData) => this.emit(strings.SELECTED_EVENT, {
        index: evtData.index,
        item: this.items[evtData.index],
      }),
      getCheckbox: (index) => {
        const list = this.items;
        if (list.length > index) {
          return list[index].querySelector(strings.CHECKBOX_SELECTOR);
        } else {
          return null;
        }
      },
      toggleCheckbox: (checkBox) => {
        if (checkBox) {
          checkBox.checked = !checkBox.checked;
          const event = document.createEvent('Event');
          event.initEvent('change', false, true);
          checkBox.dispatchEvent(event);
        }
      },
    });
  }
}

export {MDCMenuFoundation, MDCMenu, AnchorMargin, Corner};
