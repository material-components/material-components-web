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
      isSelectedTextFocused: () => false,
      getSelectedTextAttr: () => '',
      setSelectedTextAttr: () => undefined,
      openMenu: () => undefined,
      closeMenu: () => undefined,
      getAnchorElement: () => null,
      setMenuAnchorElement: () => undefined,
      setMenuAnchorCorner: () => undefined,
      setMenuWrapFocus: () => undefined,
      setAttributeAtIndex: () => undefined,
      removeAttributeAtIndex: () => undefined,
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

  private readonly leadingIcon_: MDCSelectIconFoundation | undefined;
  private readonly helperText_: MDCSelectHelperTextFoundation | undefined;

  // Index of the currently selected menu item.
  private selectedIndex_: number = numbers.UNSET_INDEX;
  // VALUE_ATTR values of the menu items.
  private readonly menuItemValues_: string[];
  // Disabled state
  private disabled_ = false;
  // isMenuOpen_ is used to track the state of the menu by listening to the MDCMenuSurface:closed event
  // For reference, menu.open will return false if the menu is still closing, but isMenuOpen_ returns false only after
  // the menu has closed
  private isMenuOpen_ = false;

  /* istanbul ignore next: optional argument is not a branch statement */
  /**
   * @param adapter
   * @param foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter?: Partial<MDCSelectAdapter>, foundationMap: Partial<MDCSelectFoundationMap> = {}) {
    super({...MDCSelectFoundation.defaultAdapter, ...adapter});

    this.leadingIcon_ = foundationMap.leadingIcon;
    this.helperText_ = foundationMap.helperText;

    this.menuItemValues_ = this.adapter_.getMenuItemValues();
  }

  /** Returns the index of the currently selected menu item, or -1 if none. */
  getSelectedIndex(): number {
    return this.selectedIndex_;
  }

  setSelectedIndex(index: number, closeMenu = false) {
    if (index >= this.adapter_.getMenuItemCount()) {
      return;
    }

    const previouslySelectedIndex = this.selectedIndex_;
    this.selectedIndex_ = index;

    if (this.selectedIndex_ === numbers.UNSET_INDEX) {
      this.adapter_.setSelectedText('');
    } else {
      this.adapter_.setSelectedText(this.adapter_.getMenuItemTextAtIndex(this.selectedIndex_)!.trim());
    }

    if (previouslySelectedIndex !== numbers.UNSET_INDEX) {
      this.adapter_.removeClassAtIndex(previouslySelectedIndex, cssClasses.SELECTED_ITEM_CLASS);
      this.adapter_.removeAttributeAtIndex(previouslySelectedIndex, strings.ARIA_SELECTED_ATTR);
    }
    if (this.selectedIndex_ !== numbers.UNSET_INDEX) {
      this.adapter_.addClassAtIndex(this.selectedIndex_, cssClasses.SELECTED_ITEM_CLASS);
      this.adapter_.setAttributeAtIndex(this.selectedIndex_, strings.ARIA_SELECTED_ATTR, 'true');
    }
    this.layout();

    if (closeMenu) {
      this.adapter_.closeMenu();
    }

    this.handleChange();
  }

  setValue(value: string) {
    const index = this.menuItemValues_.indexOf(value);
    this.setSelectedIndex(index);
    this.handleChange();
  }

  getValue() {
    const listItem = this.adapter_.getSelectedMenuItem();
    if (listItem) {
      return this.adapter_.getMenuItemAttr(listItem, strings.VALUE_ATTR) || '';
    }
    return '';
  }

  getDisabled() {
    return this.disabled_;
  }

  setDisabled(isDisabled: boolean) {
    this.disabled_ = isDisabled;
    if (this.disabled_) {
      this.adapter_.addClass(cssClasses.DISABLED);
      this.adapter_.closeMenu();
    } else {
      this.adapter_.removeClass(cssClasses.DISABLED);
    }

    if (this.leadingIcon_) {
      this.leadingIcon_.setDisabled(this.disabled_);
    }

    this.adapter_.setSelectedTextAttr('tabindex', this.disabled_ ? '-1' : '0');
    this.adapter_.setSelectedTextAttr('aria-disabled', this.disabled_.toString());
  }

  /**
   * @param content Sets the content of the helper text.
   */
  setHelperTextContent(content: string) {
    if (this.helperText_) {
      this.helperText_.setContent(content);
    }
  }

  layout() {
    if (this.adapter_.hasLabel()) {
      const openNotch = this.getValue().length > 0;
      this.notchOutline(openNotch);
    }
  }

  handleMenuOpened() {
    if (this.adapter_.getMenuItemValues().length === 0) {
      return;
    }

    this.adapter_.addClass(cssClasses.ACTIVATED);

    // Menu should open to the last selected element, should open to first menu item otherwise.
    const focusItemIndex = this.selectedIndex_ >= 0 ? this.selectedIndex_ : 0;
    this.adapter_.focusMenuItemAtIndex(focusItemIndex);
  }

  handleMenuClosed() {
    this.adapter_.removeClass(cssClasses.ACTIVATED);
    this.isMenuOpen_ = false;
    this.adapter_.setSelectedTextAttr('aria-expanded', 'false');

    // Unfocus the select if menu is closed without a selection
    if (!this.adapter_.isSelectedTextFocused()) {
      this.blur_();
    }
  }

  /**
   * Handles value changes, via change event or programmatic updates.
   */
  handleChange() {
    this.updateLabel_();
    this.adapter_.notifyChange(this.getValue());

    const isRequired = this.adapter_.hasClass(cssClasses.REQUIRED);
    if (isRequired) {
      this.setValid(this.isValid());
      if (this.helperText_) {
        this.helperText_.setValidity(this.isValid());
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
    this.adapter_.addClass(cssClasses.FOCUSED);

    if (this.adapter_.hasLabel()) {
      this.adapter_.floatLabel(true);
      this.notchOutline(true);
    }

    this.adapter_.activateBottomLine();
    if (this.helperText_) {
      this.helperText_.showToScreenReader();
    }
  }

  /**
   * Handles blur events from select element.
   */
  handleBlur() {
    if (this.isMenuOpen_) {
      return;
    }
    this.blur_();
  }

  handleClick(normalizedX: number) {
    if (this.isMenuOpen_) {
      return;
    }
    this.adapter_.setRippleCenter(normalizedX);

    this.adapter_.openMenu();
    this.isMenuOpen_ = true;
    this.adapter_.setSelectedTextAttr('aria-expanded', 'true');
  }

  handleKeydown(event: KeyboardEvent) {
    if (this.isMenuOpen_) {
      return;
    }

    const isEnter = event.key === 'Enter' || event.keyCode === 13;
    const isSpace = event.key === 'Space' || event.keyCode === 32;
    const arrowUp = event.key === 'ArrowUp' || event.keyCode === 38;
    const arrowDown = event.key === 'ArrowDown' || event.keyCode === 40;

    if (this.adapter_.hasClass(cssClasses.FOCUSED) && (isEnter || isSpace || arrowUp || arrowDown)) {
      this.adapter_.openMenu();
      this.isMenuOpen_ = true;
      this.adapter_.setSelectedTextAttr('aria-expanded', 'true');
      event.preventDefault();
    }
  }

  /**
   * Opens/closes the notched outline.
   */
  notchOutline(openNotch: boolean) {
    if (!this.adapter_.hasOutline()) {
      return;
    }
    const isFocused = this.adapter_.hasClass(cssClasses.FOCUSED);

    if (openNotch) {
      const labelScale = numbers.LABEL_SCALE;
      const labelWidth = this.adapter_.getLabelWidth() * labelScale;
      this.adapter_.notchOutline(labelWidth);
    } else if (!isFocused) {
      this.adapter_.closeOutline();
    }
  }

  /**
   * Sets the aria label of the leading icon.
   */
  setLeadingIconAriaLabel(label: string) {
    if (this.leadingIcon_) {
      this.leadingIcon_.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the leading icon.
   */
  setLeadingIconContent(content: string) {
    if (this.leadingIcon_) {
      this.leadingIcon_.setContent(content);
    }
  }

  setValid(isValid: boolean) {
    this.adapter_.setSelectedTextAttr('aria-invalid', (!isValid).toString());
    if (isValid) {
      this.adapter_.removeClass(cssClasses.INVALID);
    } else {
      this.adapter_.addClass(cssClasses.INVALID);
    }
  }

  isValid() {
    if (this.adapter_.hasClass(cssClasses.REQUIRED) && !this.adapter_.hasClass(cssClasses.DISABLED)) {
      // See notes for required attribute under https://www.w3.org/TR/html52/sec-forms.html#the-select-element
      // TL;DR: Invalid if no index is selected, or if the first index is selected and has an empty value.
      return this.selectedIndex_ !== numbers.UNSET_INDEX &&
        (this.selectedIndex_ !== 0 || Boolean(this.getValue()));
    }
    return true;
  }

  setRequired(isRequired: boolean) {
    if (isRequired) {
      this.adapter_.addClass(cssClasses.REQUIRED);
    } else {
      this.adapter_.removeClass(cssClasses.REQUIRED);
    }
    this.adapter_.setSelectedTextAttr('aria-required', isRequired.toString());
  }

  getRequired() {
    return this.adapter_.getSelectedTextAttr('aria-required') === 'true';
  }

  init() {
    const anchorEl = this.adapter_.getAnchorElement();
    if (anchorEl) {
      this.adapter_.setMenuAnchorElement(anchorEl);
      this.adapter_.setMenuAnchorCorner(Corner.BOTTOM_START);
    }
    this.adapter_.setMenuWrapFocus(false);

    const value = this.getValue();
    if (value) {
      this.setValue(value);
    }

    // Initially sync floating label
    this.updateLabel_();
  }

  /**
   * Notches the outline and floats the label when appropriate.
   */
  private updateLabel_() {
    const value = this.getValue();
    const optionHasValue = value.length > 0;

    if (this.adapter_.hasLabel()) {
      this.notchOutline(optionHasValue);

      if (!this.adapter_.hasClass(cssClasses.FOCUSED)) {
        this.adapter_.floatLabel(optionHasValue);
      }
    }
  }

  /**
   * Unfocuses the select component.
   */
  private blur_() {
    this.adapter_.removeClass(cssClasses.FOCUSED);
    this.updateLabel_();
    this.adapter_.deactivateBottomLine();

    const isRequired = this.adapter_.hasClass(cssClasses.REQUIRED);
    if (isRequired) {
      this.setValid(this.isValid());
      if (this.helperText_) {
        this.helperText_.setValidity(this.isValid());
      }
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSelectFoundation;
