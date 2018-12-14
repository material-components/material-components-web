/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
    this.handleKeydown_;
    /** @private {!Function} */
    this.handleClick_;
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

    const list = this.root_.querySelector(strings.LIST_SELECTOR);
    if (list) {
      this.list_ = listFactory(list);
      this.list_.wrapFocus = true;
    }
  }

  initialSyncWithDOM() {
    this.afterOpenedCallback_ = () => this.handleAfterOpened_();
    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleClick_ = (evt) => this.foundation_.handleClick(evt);

    this.menuSurface_.listen(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.afterOpenedCallback_);
    this.listen('keydown', this.handleKeydown_);
    this.listen('click', this.handleClick_);
  }

  destroy() {
    if (this.list_) {
      this.list_.destroy();
    }

    this.menuSurface_.destroy();
    this.menuSurface_.unlisten(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.afterOpenedCallback_);
    this.unlisten('keydown', this.handleKeydown_);
    this.unlisten('click', this.handleClick_);
    super.destroy();
  }

  /** @return {boolean} */
  get open() {
    return this.menuSurface_.open;
  }

  /** @param {boolean} value */
  set open(value) {
    this.menuSurface_.open = value;
  }

  /** @return {boolean} */
  get wrapFocus() {
    return this.list_.wrapFocus;
  }

  /** @param {boolean} value */
  set wrapFocus(value) {
    this.list_.wrapFocus = value;
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
    return this.list_.listElements;
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
  setFixedPosition(isFixed) {
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
   * @param {number} x
   * @param {number} y
   */
  setAbsolutePosition(x, y) {
    this.menuSurface_.setAbsolutePosition(x, y);
  }

  /**
   * Sets the element that the menu-surface is anchored to.
   * @param {!HTMLElement} element
   */
  setAnchorElement(element) {
    this.menuSurface_.anchorElement = element;
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
        list[index].classList.add(className);
      },
      removeClassFromElementAtIndex: (index, className) => {
        const list = this.items;
        list[index].classList.remove(className);
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
        const list = this.items;
        list[index].setAttribute(attr, value);
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
        const list = this.items;
        list[index].removeAttribute(attr);
      },
      elementContainsClass: (element, className) => element.classList.contains(className),
      closeSurface: () => this.open = false,
      getElementIndex: (element) => this.items.indexOf(element),
      getParentElement: (element) => element.parentElement,
      getSelectedElementIndex: (selectionGroup) => {
        return this.items.indexOf(selectionGroup.querySelector(`.${cssClasses.MENU_SELECTED_LIST_ITEM}`));
      },
      notifySelected: (evtData) => this.emit(strings.SELECTED_EVENT, {
        index: evtData.index,
        item: this.items[evtData.index],
      }),
    });
  }
}

export {MDCMenuFoundation, MDCMenu, AnchorMargin, Corner};
