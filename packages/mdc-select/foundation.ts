/**
 * @license
 * Copyright 2016 Google Inc.
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

import {MDCFoundation} from '@material/base/foundation';
import {normalizeKey} from '@material/dom/keyboard';
import {Corner} from '@material/menu-surface/constants';

import {MDCSelectAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';
import {MDCSelectHelperTextFoundation} from './helper-text/foundation';
import {MDCSelectIconFoundation} from './icon/foundation';
import {MDCSelectFoundationMap} from './types';

export class MDCSelectFoundation extends MDCFoundation<MDCSelectAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get numbers() {
    return numbers;
  }

  static get strings() {
    return strings;
  }

  /**
   * See {@link MDCSelectAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCSelectAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      activateBottomLine: () => undefined,
      deactivateBottomLine: () => undefined,
      getSelectedMenuItem: () => null,
      hasLabel: () => false,
      floatLabel: () => undefined,
      getLabelWidth: () => 0,
      hasOutline: () => false,
      notchOutline: () => undefined,
      closeOutline: () => undefined,
      setRippleCenter: () => undefined,
      notifyChange: () => undefined,
      setSelectedText: () => undefined,
      isSelectAnchorFocused: () => false,
      getSelectAnchorAttr: () => '',
      setSelectAnchorAttr: () => undefined,
      openMenu: () => undefined,
      closeMenu: () => undefined,
      getAnchorElement: () => null,
      setMenuAnchorElement: () => undefined,
      setMenuAnchorCorner: () => undefined,
      setMenuWrapFocus: () => undefined,
      setAttributeAtIndex: () => undefined,
      focusMenuItemAtIndex: () => undefined,
      getMenuItemCount: () => 0,
      getMenuItemValues: () => [],
      getMenuItemTextAtIndex: () => '',
      getMenuItemAttr: () => '',
      addClassAtIndex: () => undefined,
      removeClassAtIndex: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private readonly leadingIcon: MDCSelectIconFoundation|undefined;
  private readonly helperText: MDCSelectHelperTextFoundation|undefined;

  // Index of the currently selected menu item.
  private selectedIndex: number = numbers.UNSET_INDEX;
  // VALUE_ATTR values of the menu items.
  private menuItemValues: string[] = [];
  // Disabled state
  private disabled = false;
  // isMenuOpen is used to track the state of the menu by listening to the
  // MDCMenuSurface:closed event For reference, menu.open will return false if
  // the menu is still closing, but isMenuOpen returns false only after the menu
  // has closed
  private isMenuOpen = false;
  // By default, select is invalid if it is required but no value is selected.
  private useDefaultValidation = true;
  private customValidity = true;

  /* istanbul ignore next: optional argument is not a branch statement */
  /**
   * @param adapter
   * @param foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter?: Partial<MDCSelectAdapter>, foundationMap: Partial<MDCSelectFoundationMap> = {}) {
    super({...MDCSelectFoundation.defaultAdapter, ...adapter});

    this.leadingIcon = foundationMap.leadingIcon;
    this.helperText = foundationMap.helperText;
  }

  /** Returns the index of the currently selected menu item, or -1 if none. */
  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  setSelectedIndex(index: number, closeMenu = false) {
    if (index >= this.adapter.getMenuItemCount()) {
      return;
    }

    this.removeSelectionAtIndex(this.selectedIndex);
    this.setSelectionAtIndex(index);

    if (closeMenu) {
      this.adapter.closeMenu();
    }

    this.handleChange();
  }

  setValue(value: string) {
    const index = this.menuItemValues.indexOf(value);
    this.setSelectedIndex(index);
  }

  getValue() {
    const listItem = this.adapter.getSelectedMenuItem();
    if (listItem) {
      return this.adapter.getMenuItemAttr(listItem, strings.VALUE_ATTR) || '';
    }
    return '';
  }

  getDisabled() {
    return this.disabled;
  }

  setDisabled(isDisabled: boolean) {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.adapter.addClass(cssClasses.DISABLED);
      this.adapter.closeMenu();
    } else {
      this.adapter.removeClass(cssClasses.DISABLED);
    }

    if (this.leadingIcon) {
      this.leadingIcon.setDisabled(this.disabled);
    }

    this.adapter.setSelectAnchorAttr('tabindex', this.disabled ? '-1' : '0');
    this.adapter.setSelectAnchorAttr('aria-disabled', this.disabled.toString());
  }

  /**
   * @param content Sets the content of the helper text.
   */
  setHelperTextContent(content: string) {
    if (this.helperText) {
      this.helperText.setContent(content);
    }
  }

  /**
   * Re-calculates if the notched outline should be notched and if the label
   * should float.
   */
  layout() {
    if (this.adapter.hasLabel()) {
      const optionHasValue = this.getValue().length > 0;
      const isFocused = this.adapter.hasClass(cssClasses.FOCUSED);
      const shouldFloatAndNotch = optionHasValue || isFocused;

      this.notchOutline(shouldFloatAndNotch);
      this.adapter.floatLabel(shouldFloatAndNotch);
    }
  }

  /**
   * Synchronizes the list of options with the state of the foundation. Call
   * this whenever menu options are dynamically updated.
   */
  layoutOptions() {
    this.menuItemValues = this.adapter.getMenuItemValues();
    const selectedIndex = this.menuItemValues.indexOf(this.getValue());
    this.setSelectionAtIndex(selectedIndex);
  }

  handleMenuOpened() {
    if (this.menuItemValues.length === 0) {
      return;
    }

    // Menu should open to the last selected element, should open to first menu item otherwise.
    const focusItemIndex = this.selectedIndex >= 0 ? this.selectedIndex : 0;
    this.adapter.focusMenuItemAtIndex(focusItemIndex);
  }

  handleMenuClosed() {
    this.adapter.removeClass(cssClasses.ACTIVATED);
    this.isMenuOpen = false;
    this.adapter.setSelectAnchorAttr('aria-expanded', 'false');

    // Unfocus the select if menu is closed without a selection
    if (!this.adapter.isSelectAnchorFocused()) {
      this.blur();
    }
  }

  /**
   * Handles value changes, via change event or programmatic updates.
   */
  handleChange() {
    this.layout();
    this.adapter.notifyChange(this.getValue());

    const isRequired = this.adapter.hasClass(cssClasses.REQUIRED);
    if (isRequired && this.useDefaultValidation) {
      this.setValid(this.isValid());
      if (this.helperText) {
        this.helperText.setValidity(this.isValid());
      }
    }
  }

  handleMenuItemAction(index: number) {
    this.setSelectedIndex(index, /** closeMenu */ true);
  }

  /**
   * Handles focus events from select element.
   */
  handleFocus() {
    this.adapter.addClass(cssClasses.FOCUSED);
    this.layout();

    this.adapter.activateBottomLine();
    if (this.helperText) {
      this.helperText.showToScreenReader();
    }
  }

  /**
   * Handles blur events from select element.
   */
  handleBlur() {
    if (this.isMenuOpen) {
      return;
    }
    this.blur();
  }

  handleClick(normalizedX: number) {
    if (this.isMenuOpen) {
      return;
    }
    this.adapter.setRippleCenter(normalizedX);

    this.adapter.addClass(cssClasses.ACTIVATED);
    this.adapter.openMenu();
    this.isMenuOpen = true;
    this.adapter.setSelectAnchorAttr('aria-expanded', 'true');
  }

  handleKeydown(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      return;
    }

    const isEnter = normalizeKey(event) === 'Enter';
    const isSpace = normalizeKey(event) === 'Spacebar';
    const arrowUp = normalizeKey(event) === 'ArrowUp';
    const arrowDown = normalizeKey(event) === 'ArrowDown';

    if (this.adapter.hasClass(cssClasses.FOCUSED) &&
        (isEnter || isSpace || arrowUp || arrowDown)) {
      if (arrowUp && this.selectedIndex > 0) {
        this.setSelectedIndex(this.selectedIndex - 1);
      } else if (
          arrowDown &&
          this.selectedIndex < this.adapter.getMenuItemCount() - 1) {
        this.setSelectedIndex(this.selectedIndex + 1);
      }

      this.adapter.addClass(cssClasses.ACTIVATED);
      this.adapter.openMenu();
      this.isMenuOpen = true;
      this.adapter.setSelectAnchorAttr('aria-expanded', 'true');
      event.preventDefault();
    }
  }

  /**
   * Opens/closes the notched outline.
   */
  notchOutline(openNotch: boolean) {
    if (!this.adapter.hasOutline()) {
      return;
    }
    const isFocused = this.adapter.hasClass(cssClasses.FOCUSED);

    if (openNotch) {
      const labelScale = numbers.LABEL_SCALE;
      const labelWidth = this.adapter.getLabelWidth() * labelScale;
      this.adapter.notchOutline(labelWidth);
    } else if (!isFocused) {
      this.adapter.closeOutline();
    }
  }

  /**
   * Sets the aria label of the leading icon.
   */
  setLeadingIconAriaLabel(label: string) {
    if (this.leadingIcon) {
      this.leadingIcon.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the leading icon.
   */
  setLeadingIconContent(content: string) {
    if (this.leadingIcon) {
      this.leadingIcon.setContent(content);
    }
  }

  setUseDefaultValidation(useDefaultValidation: boolean) {
    this.useDefaultValidation = useDefaultValidation;
  }

  setValid(isValid: boolean) {
    if (!this.useDefaultValidation) {
      this.customValidity = isValid;
    }

    this.adapter.setSelectAnchorAttr('aria-invalid', (!isValid).toString());
    if (isValid) {
      this.adapter.removeClass(cssClasses.INVALID);
    } else {
      this.adapter.addClass(cssClasses.INVALID);
    }
  }

  isValid() {
    if (this.useDefaultValidation &&
        this.adapter.hasClass(cssClasses.REQUIRED) &&
        !this.adapter.hasClass(cssClasses.DISABLED)) {
      // See notes for required attribute under https://www.w3.org/TR/html52/sec-forms.html#the-select-element
      // TL;DR: Invalid if no index is selected, or if the first index is selected and has an empty value.
      return this.selectedIndex !== numbers.UNSET_INDEX &&
          (this.selectedIndex !== 0 || Boolean(this.getValue()));
    }
    return this.customValidity;
  }

  setRequired(isRequired: boolean) {
    if (isRequired) {
      this.adapter.addClass(cssClasses.REQUIRED);
    } else {
      this.adapter.removeClass(cssClasses.REQUIRED);
    }
    this.adapter.setSelectAnchorAttr('aria-required', isRequired.toString());
  }

  getRequired() {
    return this.adapter.getSelectAnchorAttr('aria-required') === 'true';
  }

  init() {
    const anchorEl = this.adapter.getAnchorElement();
    if (anchorEl) {
      this.adapter.setMenuAnchorElement(anchorEl);
      this.adapter.setMenuAnchorCorner(Corner.BOTTOM_START);
    }
    this.adapter.setMenuWrapFocus(false);

    this.setDisabled(this.adapter.hasClass(cssClasses.DISABLED));
    this.layoutOptions();
    this.layout();
  }

  /**
   * Unfocuses the select component.
   */
  private blur() {
    this.adapter.removeClass(cssClasses.FOCUSED);
    this.layout();
    this.adapter.deactivateBottomLine();

    const isRequired = this.adapter.hasClass(cssClasses.REQUIRED);
    if (isRequired && this.useDefaultValidation) {
      this.setValid(this.isValid());
      if (this.helperText) {
        this.helperText.setValidity(this.isValid());
      }
    }
  }

  private setSelectionAtIndex(index: number) {
    this.selectedIndex = index;

    if (index === numbers.UNSET_INDEX) {
      this.adapter.setSelectedText('');
      return;
    }

    this.adapter.setSelectedText(
        this.adapter.getMenuItemTextAtIndex(index).trim());
    this.adapter.addClassAtIndex(index, cssClasses.SELECTED_ITEM_CLASS);
    this.adapter.setAttributeAtIndex(index, strings.ARIA_SELECTED_ATTR, 'true');
  }

  private removeSelectionAtIndex(index: number) {
    if (index !== numbers.UNSET_INDEX) {
      this.adapter.removeClassAtIndex(index, cssClasses.SELECTED_ITEM_CLASS);
      this.adapter.setAttributeAtIndex(
          index, strings.ARIA_SELECTED_ATTR, 'false');
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSelectFoundation;
