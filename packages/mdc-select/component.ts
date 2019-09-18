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

import {MDCComponent} from '@material/base/component';
import {CustomEventListener, SpecificEventListener} from '@material/base/types';
import {MDCFloatingLabel, MDCFloatingLabelFactory} from '@material/floating-label/component';
import {MDCLineRipple, MDCLineRippleFactory} from '@material/line-ripple/component';
import * as menuSurfaceConstants from '@material/menu-surface/constants';
import {MDCMenu, MDCMenuFactory} from '@material/menu/component';
import * as menuConstants from '@material/menu/constants';
import {MDCMenuItemEvent} from '@material/menu/types';
import {MDCNotchedOutline, MDCNotchedOutlineFactory} from '@material/notched-outline/component';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCSelectAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCSelectFoundation} from './foundation';
import {MDCSelectHelperText, MDCSelectHelperTextFactory} from './helper-text/component';
import {MDCSelectIcon, MDCSelectIconFactory} from './icon/component';
import {MDCSelectEventDetail, MDCSelectFoundationMap} from './types';

export class MDCSelect extends MDCComponent<MDCSelectFoundation> {
  static attachTo(root: Element): MDCSelect {
    return new MDCSelect(root);
  }

  // Root container for select (anchor) element and menu.
  protected root_!: HTMLElement; // assigned in MDCComponent constructor

  private ripple_!: MDCRipple | null;

  private menu_!: MDCMenu; // assigned in menuSetup_()

  private selectAnchor_!: HTMLElement; // assigned in initialize()
  private selectedText_!: HTMLElement; // assigned in initialize()

  private menuElement_!: Element; // assigned in menuSetup_()
  private leadingIcon_?: MDCSelectIcon; // assigned in initialize()
  private helperText_!: MDCSelectHelperText | null; // assigned in initialize()
  private lineRipple_!: MDCLineRipple | null; // assigned in initialize()
  private label_!: MDCFloatingLabel | null; // assigned in initialize()
  private outline_!: MDCNotchedOutline | null; // assigned in initialize()
  private handleChange_!: SpecificEventListener<'change'>; // assigned in initialize()
  private handleFocus_!: SpecificEventListener<'focus'>; // assigned in initialize()
  private handleBlur_!: SpecificEventListener<'blur'>; // assigned in initialize()
  private handleClick_!: SpecificEventListener<'click'>; // assigned in initialize()
  private handleKeydown_!: SpecificEventListener<'keydown'>; // assigned in initialize()
  private handleMenuOpened_!: EventListener; // assigned in initialize()
  private handleMenuClosed_!: EventListener; // assigned in initialize()
  private handleMenuItemAction_!: CustomEventListener<MDCMenuItemEvent>; // assigned in initialize()

  initialize(
      labelFactory: MDCFloatingLabelFactory = (el) => new MDCFloatingLabel(el),
      lineRippleFactory: MDCLineRippleFactory = (el) => new MDCLineRipple(el),
      outlineFactory: MDCNotchedOutlineFactory = (el) => new MDCNotchedOutline(el),
      menuFactory: MDCMenuFactory = (el) => new MDCMenu(el),
      iconFactory: MDCSelectIconFactory = (el) => new MDCSelectIcon(el),
      helperTextFactory: MDCSelectHelperTextFactory = (el) => new MDCSelectHelperText(el),
  ) {
    this.selectAnchor_ = this.root_.querySelector(strings.SELECT_ANCHOR_SELECTOR) as HTMLElement;
    this.selectedText_ = this.root_.querySelector(strings.SELECTED_TEXT_SELECTOR) as HTMLElement;

    if (!this.selectedText_) {
      throw new Error(
          'MDCSelect: Missing required element: The following selector must be present: ' +
          `'${strings.SELECTED_TEXT_SELECTOR}'`,
      );
    }

    if (this.selectedText_.hasAttribute(strings.ARIA_CONTROLS)) {
      const helperTextElement = document.getElementById(this.selectedText_.getAttribute(strings.ARIA_CONTROLS)!);
      if (helperTextElement) {
        this.helperText_ = helperTextFactory(helperTextElement);
      }
    }

    this.menuSetup_(menuFactory);

    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    this.label_ = labelElement ? labelFactory(labelElement) : null;

    const lineRippleElement = this.root_.querySelector(strings.LINE_RIPPLE_SELECTOR);
    this.lineRipple_ = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;

    const outlineElement = this.root_.querySelector(strings.OUTLINE_SELECTOR);
    this.outline_ = outlineElement ? outlineFactory(outlineElement) : null;

    const leadingIcon = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    if (leadingIcon) {
      this.leadingIcon_ = iconFactory(leadingIcon);
    }

    if (!this.root_.classList.contains(cssClasses.OUTLINED)) {
      this.ripple_ = this.createRipple_();
    }
  }

  /**
   * Initializes the select's event listeners and internal state based
   * on the environment's state.
   */
  initialSyncWithDOM() {
    this.handleChange_ = () => this.foundation_.handleChange(/* didChange */ true);
    this.handleFocus_ = () => this.foundation_.handleFocus();
    this.handleBlur_ = () => this.foundation_.handleBlur();
    this.handleClick_ = (evt) => {
      this.selectedText_.focus();
      this.foundation_.handleClick(this.getNormalizedXCoordinate_(evt));
    };
    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleMenuItemAction_ = (evt) => this.foundation_.handleMenuItemAction(evt.detail.index);
    this.handleMenuOpened_ = () => this.foundation_.handleMenuOpened();
    this.handleMenuClosed_ = () => this.foundation_.handleMenuClosed();

    this.selectedText_.addEventListener('focus', this.handleFocus_);
    this.selectedText_.addEventListener('blur', this.handleBlur_);

    this.selectedText_.addEventListener('click', this.handleClick_ as EventListener);

    this.selectedText_!.addEventListener('keydown', this.handleKeydown_);
    this.menu_!.listen(menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed_);
    this.menu_!.listen(menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened_);
    this.menu_!.listen(menuConstants.strings.SELECTED_EVENT, this.handleMenuItemAction_);
    this.foundation_.init();

    // Initially sync floating label
    this.foundation_.handleChange(/* didChange */ false);

    // Sets disabled state in foundation
    this.disabled = this.root_.classList.contains(cssClasses.DISABLED);
  }

  destroy() {
    this.selectedText_.removeEventListener('change', this.handleChange_);
    this.selectedText_.removeEventListener('focus', this.handleFocus_);
    this.selectedText_.removeEventListener('blur', this.handleBlur_);
    this.selectedText_.removeEventListener('keydown', this.handleKeydown_);
    this.selectedText_.removeEventListener('click', this.handleClick_ as EventListener);

    this.menu_.unlisten(menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed_);
    this.menu_.unlisten(menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened_);
    this.menu_.unlisten(menuConstants.strings.SELECTED_EVENT, this.handleMenuItemAction_);
    this.menu_.destroy();

    if (this.ripple_) {
      this.ripple_.destroy();
    }
    if (this.outline_) {
      this.outline_.destroy();
    }
    if (this.leadingIcon_) {
      this.leadingIcon_.destroy();
    }
    if (this.helperText_) {
      this.helperText_.destroy();
    }

    super.destroy();
  }

  get value(): string {
    return this.foundation_.getValue();
  }

  set value(value: string) {
    this.foundation_.setValue(value);
  }

  get selectedIndex(): number {
    return this.foundation_.getSelectedIndex();
  }

  set selectedIndex(selectedIndex: number) {
    this.foundation_.setSelectedIndex(selectedIndex, /** closeMenu */ true);
  }

  get disabled(): boolean {
    return this.foundation_.getDisabled();
  }

  set disabled(disabled: boolean) {
    this.foundation_.setDisabled(disabled);
  }

  set leadingIconAriaLabel(label: string) {
    this.foundation_.setLeadingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the leading icon.
   */
  set leadingIconContent(content: string) {
    this.foundation_.setLeadingIconContent(content);
  }

  /**
   * Sets the text content of the helper text.
   */
  set helperTextContent(content: string) {
    this.foundation_.setHelperTextContent(content);
  }

  /**
   * Sets the current invalid state of the select.
   */
  set valid(isValid: boolean) {
    this.foundation_.setValid(isValid);
  }

  /**
   * Checks if the select is in a valid state.
   */
  get valid(): boolean {
    return this.foundation_.isValid();
  }

  /**
   * Sets the control to the required state.
   */
  set required(isRequired: boolean) {
    this.foundation_.setRequired(isRequired);
  }

  /**
   * Returns whether the select is required.
   */
  get required(): boolean {
    return this.foundation_.getRequired();
  }

  /**
   * Recomputes the outline SVG path for the outline element.
   */
  layout() {
    this.foundation_.layout();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCSelectAdapter = {
      ...this.getSelectAdapterMethods_(),
      ...this.getCommonAdapterMethods_(),
      ...this.getOutlineAdapterMethods_(),
      ...this.getLabelAdapterMethods_(),
    };
    return new MDCSelectFoundation(adapter, this.getFoundationMap_());
  }

  /**
   * Handles setup for the menu.
   */
  private menuSetup_(menuFactory: MDCMenuFactory) {
    this.menuElement_ = this.root_.querySelector(strings.MENU_SELECTOR)!;
    this.menu_ = menuFactory(this.menuElement_);
  }

  private createRipple_(): MDCRipple {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter({root_: this.selectAnchor_}),
      registerInteractionHandler: (evtType, handler) => this.selectedText_.addEventListener(evtType, handler),
      deregisterInteractionHandler: (evtType, handler) => this.selectedText_.removeEventListener(evtType, handler),
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCRipple(this.selectAnchor_, new MDCRippleFoundation(adapter));
  }

  private getSelectAdapterMethods_() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      getSelectedMenuItem: () => this.menuElement_!.querySelector(strings.SELECTED_ITEM_SELECTOR),
      getMenuItemAttr: (menuItem: Element, attr: string) => menuItem.getAttribute(attr),
      setSelectedText: (text: string) => this.selectedText_.textContent = text,
      isSelectedTextFocused: () => document.activeElement === this.selectedText_,
      getSelectedTextAttr: (attr: string) => this.selectedText_.getAttribute(attr),
      setSelectedTextAttr: (attr: string, value: string) => this.selectedText_.setAttribute(attr, value),
      openMenu: () => this.menu_.open = true,
      closeMenu: () => this.menu_.open = false,
      getAnchorElement: () => this.root_.querySelector(strings.SELECT_ANCHOR_SELECTOR)!,
      setMenuAnchorElement: (anchorEl: HTMLElement) => this.menu_.setAnchorElement(anchorEl),
      setMenuAnchorCorner: (anchorCorner: menuSurfaceConstants.Corner) => this.menu_.setAnchorCorner(anchorCorner),
      setMenuWrapFocus: (wrapFocus: boolean) => this.menu_.wrapFocus = wrapFocus,
      setAttributeAtIndex: (index: number, attributeName: string, attributeValue: string) =>
        this.menu_.items[index].setAttribute(attributeName, attributeValue),
      removeAttributeAtIndex: (index: number, attributeName: string) =>
        this.menu_.items[index].removeAttribute(attributeName),
      focusMenuItemAtIndex: (index: number) => (this.menu_.items[index] as HTMLElement).focus(),
      getMenuItemCount: () => this.menu_.items.length,
      getMenuItemValues: () => this.menu_.items.map((el) => el.getAttribute(strings.VALUE_ATTR) || ''),
      getMenuItemTextAtIndex: (index: number) => this.menu_.items[index].textContent as string,
      addClassAtIndex: (index: number, className: string) => this.menu_.items[index].classList.add(className),
      removeClassAtIndex: (index: number, className: string) => this.menu_.items[index].classList.remove(className),
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getCommonAdapterMethods_() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: (className: string) => this.root_.classList.add(className),
      removeClass: (className: string) => this.root_.classList.remove(className),
      hasClass: (className: string) => this.root_.classList.contains(className),
      setRippleCenter: (normalizedX: number) => this.lineRipple_ && this.lineRipple_.setRippleCenter(normalizedX),
      activateBottomLine: () => this.lineRipple_ && this.lineRipple_.activate(),
      deactivateBottomLine: () => this.lineRipple_ && this.lineRipple_.deactivate(),
      notifyChange: (value: string) => {
        const index = this.selectedIndex;
        this.emit<MDCSelectEventDetail>(strings.CHANGE_EVENT, {value, index}, true /* shouldBubble  */);
      },
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getOutlineAdapterMethods_() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      hasOutline: () => Boolean(this.outline_),
      notchOutline: (labelWidth: number) => this.outline_ && this.outline_.notch(labelWidth),
      closeOutline: () => this.outline_ && this.outline_.closeNotch(),
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getLabelAdapterMethods_() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      hasLabel: () => !!this.label_,
      floatLabel: (shouldFloat: boolean) => this.label_ && this.label_.float(shouldFloat),
      getLabelWidth: () => this.label_ ? this.label_.getWidth() : 0,
    };
    // tslint:enable:object-literal-sort-keys
  }

  /**
   * Calculates where the line ripple should start based on the x coordinate within the component.
   */
  private getNormalizedXCoordinate_(evt: MouseEvent | TouchEvent): number {
    const targetClientRect = (evt.target as Element).getBoundingClientRect();
    const xCoordinate = this.isTouchEvent_(evt) ? evt.touches[0].clientX : evt.clientX;
    return xCoordinate - targetClientRect.left;
  }

  private isTouchEvent_(evt: MouseEvent | TouchEvent): evt is TouchEvent {
    return Boolean((evt as TouchEvent).touches);
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   */
  private getFoundationMap_(): Partial<MDCSelectFoundationMap> {
    return {
      helperText: this.helperText_ ? this.helperText_.foundation : undefined,
      leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
    };
  }
}
