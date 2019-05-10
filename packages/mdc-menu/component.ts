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

import {MDCComponent} from '@material/base/component';
import {CustomEventListener, SpecificEventListener} from '@material/base/types';
import {closest} from '@material/dom/ponyfill';
import {MDCList, MDCListFactory} from '@material/list/component';
import {MDCListFoundation} from '@material/list/foundation';
import {MDCListActionEvent} from '@material/list/types';
import {MDCMenuSurface, MDCMenuSurfaceFactory} from '@material/menu-surface/component';
import {Corner} from '@material/menu-surface/constants';
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/foundation';
import {MDCMenuDistance} from '@material/menu-surface/types';
import {MDCMenuAdapter} from './adapter';
import {cssClasses, DefaultFocusState, strings} from './constants';
import {MDCMenuFoundation} from './foundation';
import {MDCMenuItemComponentEventDetail} from './types';

export type MDCMenuFactory = (el: Element, foundation?: MDCMenuFoundation) => MDCMenu;

export class MDCMenu extends MDCComponent<MDCMenuFoundation> {
  static attachTo(root: Element) {
    return new MDCMenu(root);
  }

  private menuSurfaceFactory_!: MDCMenuSurfaceFactory; // assigned in initialize()
  private listFactory_!: MDCListFactory; // assigned in initialize()

  private menuSurface_!: MDCMenuSurface; // assigned in initialSyncWithDOM()
  private list_!: MDCList | null; // assigned in initialSyncWithDOM()

  private handleKeydown_!: SpecificEventListener<'keydown'>; // assigned in initialSyncWithDOM()
  private handleItemAction_!: CustomEventListener<MDCListActionEvent>; // assigned in initialSyncWithDOM()
  private handleMenuSurfaceOpened_!: EventListener; // assigned in initialSyncWithDOM()

  initialize(
      menuSurfaceFactory: MDCMenuSurfaceFactory = (el) => new MDCMenuSurface(el),
      listFactory: MDCListFactory = (el) => new MDCList(el)) {
    this.menuSurfaceFactory_ = menuSurfaceFactory;
    this.listFactory_ = listFactory;
  }

  initialSyncWithDOM() {
    this.menuSurface_ = this.menuSurfaceFactory_(this.root_);

    const list = this.root_.querySelector(strings.LIST_SELECTOR);
    if (list) {
      this.list_ = this.listFactory_(list);
      this.list_.wrapFocus = true;
    } else {
      this.list_ = null;
    }

    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleItemAction_ = (evt) => this.foundation_.handleItemAction(this.items[evt.detail.index]);
    this.handleMenuSurfaceOpened_ = () => this.foundation_.handleMenuSurfaceOpened();

    this.menuSurface_.listen(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.handleMenuSurfaceOpened_);
    this.listen('keydown', this.handleKeydown_);
    this.listen(MDCListFoundation.strings.ACTION_EVENT, this.handleItemAction_);
  }

  destroy() {
    if (this.list_) {
      this.list_.destroy();
    }

    this.menuSurface_.destroy();
    this.menuSurface_.unlisten(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.handleMenuSurfaceOpened_);
    this.unlisten('keydown', this.handleKeydown_);
    this.unlisten(MDCListFoundation.strings.ACTION_EVENT, this.handleItemAction_);
    super.destroy();
  }

  get open(): boolean {
    return this.menuSurface_.open;
  }

  set open(value: boolean) {
    this.menuSurface_.open = value;
  }

  get wrapFocus(): boolean {
    return this.list_ ? this.list_.wrapFocus : false;
  }

  set wrapFocus(value: boolean) {
    if (this.list_) {
      this.list_.wrapFocus = value;
    }
  }

  /**
   * Return the items within the menu. Note that this only contains the set of elements within
   * the items container that are proper list items, and not supplemental / presentational DOM
   * elements.
   */
  get items(): Element[] {
    return this.list_ ? this.list_.listElements : [];
  }

  set quickOpen(quickOpen: boolean) {
    this.menuSurface_.quickOpen = quickOpen;
  }

  /**
   * Sets default focus state where the menu should focus every time when menu
   * is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by
   * default.
   * @param focusState Default focus state.
   */
  setDefaultFocusState(focusState: DefaultFocusState) {
    this.foundation_.setDefaultFocusState(focusState);
  }

  /**
   * @param corner Default anchor corner alignment of top-left menu corner.
   */
  setAnchorCorner(corner: Corner) {
    this.menuSurface_.setAnchorCorner(corner);
  }

  setAnchorMargin(margin: Partial<MDCMenuDistance>) {
    this.menuSurface_.setAnchorMargin(margin);
  }

  /**
   * Sets the list item as the selected row at the specified index.
   * @param index Index of list item within menu.
   */
  setSelectedIndex(index: number) {
    this.foundation_.setSelectedIndex(index);
  }

  /**
   * @return The item within the menu at the index specified.
   */
  getOptionByIndex(index: number): Element | null {
    const items = this.items;

    if (index < items.length) {
      return this.items[index];
    } else {
      return null;
    }
  }

  setFixedPosition(isFixed: boolean) {
    this.menuSurface_.setFixedPosition(isFixed);
  }

  hoistMenuToBody() {
    this.menuSurface_.hoistMenuToBody();
  }

  setIsHoisted(isHoisted: boolean) {
    this.menuSurface_.setIsHoisted(isHoisted);
  }

  setAbsolutePosition(x: number, y: number) {
    this.menuSurface_.setAbsolutePosition(x, y);
  }

  /**
   * Sets the element that the menu-surface is anchored to.
   */
  setAnchorElement(element: Element) {
    this.menuSurface_.anchorElement = element;
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCMenuAdapter = {
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
      notifySelected: (evtData) => this.emit<MDCMenuItemComponentEventDetail>(strings.SELECTED_EVENT, {
        index: evtData.index,
        item: this.items[evtData.index],
      }),
      getMenuItemCount: () => this.items.length,
      focusItemAtIndex: (index) => (this.items[index] as HTMLElement).focus(),
      focusListRoot: () => (this.root_.querySelector(strings.LIST_SELECTOR) as HTMLElement).focus(),
      isSelectableItemAtIndex: (index) => !!closest(this.items[index], `.${cssClasses.MENU_SELECTION_GROUP}`),
      getSelectedSiblingOfItemAtIndex: (index) => {
        const selectionGroupEl = closest(this.items[index], `.${cssClasses.MENU_SELECTION_GROUP}`) as HTMLElement;
        const selectedItemEl = selectionGroupEl.querySelector(`.${cssClasses.MENU_SELECTED_LIST_ITEM}`);
        return selectedItemEl ? this.items.indexOf(selectedItemEl) : -1;
      },
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCMenuFoundation(adapter);
  }
}
