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
import {numbers as listConstants} from '@material/list/constants';
import {MDCListFoundation} from '@material/list/foundation';
import {MDCListActionEvent, MDCListIndex} from '@material/list/types';
import {MDCMenuSurface, MDCMenuSurfaceFactory} from '@material/menu-surface/component';
import {Corner} from '@material/menu-surface/constants';
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/foundation';
import {MDCMenuDistance} from '@material/menu-surface/types';

import {MDCMenuAdapter} from './adapter';
import {cssClasses, DefaultFocusState, strings} from './constants';
import {MDCMenuFoundation} from './foundation';
import {MDCMenuItemComponentEventDetail} from './types';

/** MDC Menu Factory */
export type MDCMenuFactory = (el: Element, foundation?: MDCMenuFoundation) =>
    MDCMenu;

/** MDC Menu */
export class MDCMenu extends MDCComponent<MDCMenuFoundation> {
  static override attachTo(root: Element) {
    return new MDCMenu(root);
  }

  private menuSurfaceFactory!:
      MDCMenuSurfaceFactory;             // assigned in initialize()
  private listFactory!: MDCListFactory;  // assigned in initialize()

  private menuSurface!: MDCMenuSurface;  // assigned in initialSyncWithDOM()
  private list!: MDCList|null;           // assigned in initialSyncWithDOM()

  private handleKeydown!:
      SpecificEventListener<'keydown'>;  // assigned in initialSyncWithDOM()
  private handleItemAction!:
      CustomEventListener<MDCListActionEvent>;  // assigned in
                                                // initialSyncWithDOM()
  private handleMenuSurfaceOpened!:
      EventListener;  // assigned in initialSyncWithDOM()

  override initialize(
      menuSurfaceFactory:
          MDCMenuSurfaceFactory = (el) => new MDCMenuSurface(el),
      listFactory: MDCListFactory = (el) => new MDCList(el)) {
    this.menuSurfaceFactory = menuSurfaceFactory;
    this.listFactory = listFactory;
  }

  override initialSyncWithDOM() {
    this.menuSurface = this.menuSurfaceFactory(this.root);

    const list = this.root.querySelector(strings.LIST_SELECTOR);
    if (list) {
      this.list = this.listFactory(list);
      this.list.wrapFocus = true;
    } else {
      this.list = null;
    }

    this.handleKeydown = (evt) => {
      this.foundation.handleKeydown(evt);
    };
    this.handleItemAction = (evt) => {
      this.foundation.handleItemAction(this.items[evt.detail.index]);
    };
    this.handleMenuSurfaceOpened = () => {
      this.foundation.handleMenuSurfaceOpened();
    };

    this.menuSurface.listen(
        MDCMenuSurfaceFoundation.strings.OPENED_EVENT,
        this.handleMenuSurfaceOpened);
    this.listen('keydown', this.handleKeydown);
    this.listen(MDCListFoundation.strings.ACTION_EVENT, this.handleItemAction);
  }

  override destroy() {
    if (this.list) {
      this.list.destroy();
    }

    this.menuSurface.destroy();
    this.menuSurface.unlisten(
        MDCMenuSurfaceFoundation.strings.OPENED_EVENT,
        this.handleMenuSurfaceOpened);
    this.unlisten('keydown', this.handleKeydown);
    this.unlisten(
        MDCListFoundation.strings.ACTION_EVENT, this.handleItemAction);
    super.destroy();
  }

  get open(): boolean {
    return this.menuSurface.isOpen();
  }

  set open(value: boolean) {
    if (value) {
      this.menuSurface.open();
    } else {
      this.menuSurface.close();
    }
  }

  get wrapFocus(): boolean {
    return this.list ? this.list.wrapFocus : false;
  }

  set wrapFocus(value: boolean) {
    if (this.list) {
      this.list.wrapFocus = value;
    }
  }

  /**
   * Sets whether the menu has typeahead functionality.
   * @param value Whether typeahead is enabled.
   */
  set hasTypeahead(value: boolean) {
    if (this.list) {
      this.list.hasTypeahead = value;
    }
  }

  /**
   * @return Whether typeahead logic is currently matching some user prefix.
   */
  get typeaheadInProgress() {
    return this.list ? this.list.typeaheadInProgress : false;
  }

  /**
   * Given the next desired character from the user, adds it to the typeahead
   * buffer. Then, attempts to find the next option matching the buffer. Wraps
   * around if at the end of options.
   *
   * @param nextChar The next character to add to the prefix buffer.
   * @param startingIndex The index from which to start matching. Only relevant
   *     when starting a new match sequence. To start a new match sequence,
   *     clear the buffer using `clearTypeaheadBuffer`, or wait for the buffer
   *     to clear after a set interval defined in list foundation. Defaults to
   *     the currently focused index.
   * @return The index of the matched item, or -1 if no match.
   */
  typeaheadMatchItem(nextChar: string, startingIndex?: number): number {
    if (this.list) {
      return this.list.typeaheadMatchItem(nextChar, startingIndex);
    }
    return -1;
  }

  /**
   * Layout the underlying list element in the case of any dynamic updates
   * to its structure.
   */
  layout() {
    if (this.list) {
      this.list.layout();
    }
  }

  /**
   * Return the items within the menu. Note that this only contains the set of
   * elements within the items container that are proper list items, and not
   * supplemental / presentational DOM elements.
   */
  get items(): Element[] {
    return this.list ? this.list.listElements : [];
  }

  /**
   * Turns on/off the underlying list's single selection mode. Used mainly
   * by select menu.
   *
   * @param singleSelection Whether to enable single selection mode.
   */
  set singleSelection(singleSelection: boolean) {
    if (this.list) {
      this.list.singleSelection = singleSelection;
    }
  }

  /**
   * Retrieves the selected index. Only applicable to select menus.
   * @return The selected index, which is a number for single selection and
   *     radio lists, and an array of numbers for checkbox lists.
   */
  get selectedIndex(): MDCListIndex {
    return this.list ? this.list.selectedIndex : listConstants.UNSET_INDEX;
  }

  /**
   * Sets the selected index of the list. Only applicable to select menus.
   * @param index The selected index, which is a number for single selection and
   *     radio lists, and an array of numbers for checkbox lists.
   */
  set selectedIndex(index: MDCListIndex) {
    if (this.list) {
      this.list.selectedIndex = index;
    }
  }

  set quickOpen(quickOpen: boolean) {
    this.menuSurface.quickOpen = quickOpen;
  }

  /**
   * Sets default focus state where the menu should focus every time when menu
   * is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by
   * default.
   * @param focusState Default focus state.
   */
  setDefaultFocusState(focusState: DefaultFocusState) {
    this.foundation.setDefaultFocusState(focusState);
  }

  /**
   * @param corner Default anchor corner alignment of top-left menu corner.
   */
  setAnchorCorner(corner: Corner) {
    this.menuSurface.setAnchorCorner(corner);
  }

  setAnchorMargin(margin: Partial<MDCMenuDistance>) {
    this.menuSurface.setAnchorMargin(margin);
  }

  /**
   * Sets the list item as the selected row at the specified index.
   * @param index Index of list item within menu.
   */
  setSelectedIndex(index: number) {
    this.foundation.setSelectedIndex(index);
  }

  /**
   * Sets the enabled state to isEnabled for the menu item at the given index.
   * @param index Index of the menu item
   * @param isEnabled The desired enabled state of the menu item.
   */
  setEnabled(index: number, isEnabled: boolean): void {
    this.foundation.setEnabled(index, isEnabled);
  }

  /**
   * @return The item within the menu at the index specified.
   */
  getOptionByIndex(index: number): Element|null {
    const items = this.items;

    if (index < items.length) {
      return this.items[index];
    } else {
      return null;
    }
  }

  /**
   * @param index A menu item's index.
   * @return The primary text within the menu at the index specified.
   */
  getPrimaryTextAtIndex(index: number): string {
    const item = this.getOptionByIndex(index);
    if (item && this.list) {
      return this.list.getPrimaryText(item) || '';
    }
    return '';
  }

  setFixedPosition(isFixed: boolean) {
    this.menuSurface.setFixedPosition(isFixed);
  }

  setIsHoisted(isHoisted: boolean) {
    this.menuSurface.setIsHoisted(isHoisted);
  }

  setAbsolutePosition(x: number, y: number) {
    this.menuSurface.setAbsolutePosition(x, y);
  }

  /**
   * Sets the element that the menu-surface is anchored to.
   */
  setAnchorElement(element: Element) {
    this.menuSurface.anchorElement = element;
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
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
      getAttributeFromElementAtIndex: (index, attr) => {
        const list = this.items;
        return list[index].getAttribute(attr);
      },
      elementContainsClass: (element, className) =>
          element.classList.contains(className),
      closeSurface: (skipRestoreFocus: boolean) => {
        this.menuSurface.close(skipRestoreFocus);
      },
      getElementIndex: (element) => this.items.indexOf(element),
      notifySelected: (evtData) => {
        this.emit<MDCMenuItemComponentEventDetail>(strings.SELECTED_EVENT, {
          index: evtData.index,
          item: this.items[evtData.index],
        });
      },
      getMenuItemCount: () => this.items.length,
      focusItemAtIndex: (index) => {
        (this.items[index] as HTMLElement).focus();
      },
      focusListRoot: () => {
        (this.root.querySelector(strings.LIST_SELECTOR) as HTMLElement).focus();
      },
      isSelectableItemAtIndex: (index) =>
          !!closest(this.items[index], `.${cssClasses.MENU_SELECTION_GROUP}`),
      getSelectedSiblingOfItemAtIndex: (index) => {
        const selectionGroupEl =
            closest(this.items[index], `.${cssClasses.MENU_SELECTION_GROUP}`) as
            HTMLElement;
        const selectedItemEl = selectionGroupEl.querySelector(
            `.${cssClasses.MENU_SELECTED_LIST_ITEM}`);
        return selectedItemEl ? this.items.indexOf(selectedItemEl) : -1;
      },
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCMenuFoundation(adapter);
  }
}
