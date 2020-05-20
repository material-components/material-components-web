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

  private ripple!: MDCRipple|null;

  private menu!: MDCMenu;  // assigned in menuSetup()

  private selectAnchor!: HTMLElement;       // assigned in initialize()
  private selectedText!: HTMLElement;       // assigned in initialize()

  private menuElement!: Element;                  // assigned in menuSetup()
  private leadingIcon?: MDCSelectIcon;            // assigned in initialize()
  private helperText!: MDCSelectHelperText|null;  // assigned in initialize()
  private lineRipple!: MDCLineRipple|null;        // assigned in initialize()
  private label!: MDCFloatingLabel|null;          // assigned in initialize()
  private outline!: MDCNotchedOutline|null;       // assigned in initialize()
  private handleChange!:
      SpecificEventListener<'change'>;  // assigned in initialize()
  private handleFocus!:
      SpecificEventListener<'focus'>;  // assigned in initialize()
  private handleBlur!:
      SpecificEventListener<'blur'>;  // assigned in initialize()
  private handleClick!:
      SpecificEventListener<'click'>;  // assigned in initialize()
  private handleKeydown!:
      SpecificEventListener<'keydown'>;      // assigned in initialize()
  private handleMenuOpened!: EventListener;  // assigned in initialize()
  private handleMenuClosed!: EventListener;  // assigned in initialize()
  private handleMenuItemAction!:
      CustomEventListener<MDCMenuItemEvent>;  // assigned in initialize()

  initialize(
      labelFactory: MDCFloatingLabelFactory = (el) => new MDCFloatingLabel(el),
      lineRippleFactory: MDCLineRippleFactory = (el) => new MDCLineRipple(el),
      outlineFactory: MDCNotchedOutlineFactory = (el) => new MDCNotchedOutline(el),
      menuFactory: MDCMenuFactory = (el) => new MDCMenu(el),
      iconFactory: MDCSelectIconFactory = (el) => new MDCSelectIcon(el),
      helperTextFactory: MDCSelectHelperTextFactory = (el) => new MDCSelectHelperText(el),
  ) {
    this.selectAnchor =
        this.root_.querySelector(strings.SELECT_ANCHOR_SELECTOR) as HTMLElement;
    this.selectedText =
        this.root_.querySelector(strings.SELECTED_TEXT_SELECTOR) as HTMLElement;

    if (!this.selectedText) {
      throw new Error(
          'MDCSelect: Missing required element: The following selector must be present: ' +
          `'${strings.SELECTED_TEXT_SELECTOR}'`,
      );
    }

    if (this.selectAnchor.hasAttribute(strings.ARIA_CONTROLS)) {
      const helperTextElement = document.getElementById(
          this.selectAnchor.getAttribute(strings.ARIA_CONTROLS)!);
      if (helperTextElement) {
        this.helperText = helperTextFactory(helperTextElement);
      }
    }

    this.menuSetup(menuFactory);

    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    this.label = labelElement ? labelFactory(labelElement) : null;

    const lineRippleElement = this.root_.querySelector(strings.LINE_RIPPLE_SELECTOR);
    this.lineRipple =
        lineRippleElement ? lineRippleFactory(lineRippleElement) : null;

    const outlineElement = this.root_.querySelector(strings.OUTLINE_SELECTOR);
    this.outline = outlineElement ? outlineFactory(outlineElement) : null;

    const leadingIcon = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    if (leadingIcon) {
      this.leadingIcon = iconFactory(leadingIcon);
    }

    if (!this.root_.classList.contains(cssClasses.OUTLINED)) {
      this.ripple = this.createRipple();
    }
  }

  /**
   * Initializes the select's event listeners and internal state based
   * on the environment's state.
   */
  initialSyncWithDOM() {
    this.handleChange = () => {
      this.foundation_.handleChange();
    };
    this.handleFocus = () => {
      this.foundation_.handleFocus();
    };
    this.handleBlur = () => {
      this.foundation_.handleBlur();
    };
    this.handleClick = (evt) => {
      this.selectAnchor.focus();
      this.foundation_.handleClick(this.getNormalizedXCoordinate(evt));
    };
    this.handleKeydown = (evt) => {
      this.foundation_.handleKeydown(evt);
    };
    this.handleMenuItemAction = (evt) => {
      this.foundation_.handleMenuItemAction(evt.detail.index);
    };
    this.handleMenuOpened = () => {
      this.foundation_.handleMenuOpened();
    };
    this.handleMenuClosed = () => {
      this.foundation_.handleMenuClosed();
    };

    this.selectAnchor.addEventListener('focus', this.handleFocus);
    this.selectAnchor.addEventListener('blur', this.handleBlur);

    this.selectAnchor.addEventListener(
        'click', this.handleClick as EventListener);

    this.selectAnchor.addEventListener('keydown', this.handleKeydown);
    this.menu.listen(
        menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed);
    this.menu.listen(
        menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened);
    this.menu.listen(
        menuConstants.strings.SELECTED_EVENT, this.handleMenuItemAction);
  }

  destroy() {
    this.selectAnchor.removeEventListener('change', this.handleChange);
    this.selectAnchor.removeEventListener('focus', this.handleFocus);
    this.selectAnchor.removeEventListener('blur', this.handleBlur);
    this.selectAnchor.removeEventListener('keydown', this.handleKeydown);
    this.selectAnchor.removeEventListener(
        'click', this.handleClick as EventListener);

    this.menu.unlisten(
        menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed);
    this.menu.unlisten(
        menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened);
    this.menu.unlisten(
        menuConstants.strings.SELECTED_EVENT, this.handleMenuItemAction);
    this.menu.destroy();

    if (this.ripple) {
      this.ripple.destroy();
    }
    if (this.outline) {
      this.outline.destroy();
    }
    if (this.leadingIcon) {
      this.leadingIcon.destroy();
    }
    if (this.helperText) {
      this.helperText.destroy();
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
   * Enables or disables the default validation scheme where a required select
   * must be non-empty. Set to false for custom validation.
   * @param useDefaultValidation Set this to false to ignore default
   *     validation scheme.
   */
  set useDefaultValidation(useDefaultValidation: boolean) {
    this.foundation_.setUseDefaultValidation(useDefaultValidation);
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
   * Re-calculates if the notched outline should be notched and if the label
   * should float.
   */
  layout() {
    this.foundation_.layout();
  }

  /**
   * Synchronizes the list of options with the state of the foundation. Call
   * this whenever menu options are dynamically updated.
   */
  layoutOptions() {
    this.foundation_.layoutOptions();
    this.menu.layout();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCSelectAdapter = {
      ...this.getSelectAdapterMethods(),
      ...this.getCommonAdapterMethods(),
      ...this.getOutlineAdapterMethods(),
      ...this.getLabelAdapterMethods(),
    };
    return new MDCSelectFoundation(adapter, this.getFoundationMap());
  }

  /**
   * Handles setup for the menu.
   */
  private menuSetup(menuFactory: MDCMenuFactory) {
    this.menuElement = this.root_.querySelector(strings.MENU_SELECTOR)!;
    this.menu = menuFactory(this.menuElement);
    this.menu.hasTypeahead = true;
  }

  private createRipple(): MDCRipple {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter({root_: this.selectAnchor}),
      registerInteractionHandler: (evtType, handler) => {
        this.selectAnchor.addEventListener(evtType, handler);
      },
      deregisterInteractionHandler: (evtType, handler) => {
        this.selectAnchor.removeEventListener(evtType, handler);
      },
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCRipple(this.selectAnchor, new MDCRippleFoundation(adapter));
  }

  private getSelectAdapterMethods() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      getSelectedMenuItem: () =>
          this.menuElement.querySelector(strings.SELECTED_ITEM_SELECTOR),
      getMenuItemAttr: (menuItem: Element, attr: string) =>
          menuItem.getAttribute(attr),
      setSelectedText: (text: string) => {
        this.selectedText.textContent = text;
      },
      isSelectAnchorFocused: () => document.activeElement === this.selectAnchor,
      getSelectAnchorAttr: (attr: string) =>
          this.selectAnchor.getAttribute(attr),
      setSelectAnchorAttr: (attr: string, value: string) => {
        this.selectAnchor.setAttribute(attr, value);
      },
      openMenu: () => {
        this.menu.open = true;
      },
      closeMenu: () => {
        this.menu.open = false;
      },
      getAnchorElement: () =>
          this.root_.querySelector(strings.SELECT_ANCHOR_SELECTOR)!,
      setMenuAnchorElement: (anchorEl: HTMLElement) => {
        this.menu.setAnchorElement(anchorEl);
      },
      setMenuAnchorCorner: (anchorCorner: menuSurfaceConstants.Corner) => {
        this.menu.setAnchorCorner(anchorCorner);
      },
      setMenuWrapFocus: (wrapFocus: boolean) => {
        this.menu.wrapFocus = wrapFocus;
      },
      setAttributeAtIndex:
          (index: number, attributeName: string, attributeValue: string) => {
            this.menu.items[index].setAttribute(attributeName, attributeValue);
          },
      removeAttributeAtIndex: (index: number, attributeName: string) => {
        this.menu.items[index].removeAttribute(attributeName);
      },
      focusMenuItemAtIndex: (index: number) => {
        (this.menu.items[index] as HTMLElement).focus();
      },
      getMenuItemCount: () => this.menu.items.length,
      getMenuItemValues: () => this.menu.items.map(
          (el) => el.getAttribute(strings.VALUE_ATTR) || ''),
      getMenuItemTextAtIndex: (index: number) =>
          this.menu.items[index].textContent as string,
      addClassAtIndex: (index: number, className: string) => {
        this.menu.items[index].classList.add(className);
      },
      removeClassAtIndex: (index: number, className: string) => {
        this.menu.items[index].classList.remove(className);
      },
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getCommonAdapterMethods() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: (className: string) => {
        this.root_.classList.add(className);
      },
      removeClass: (className: string) => {
        this.root_.classList.remove(className);
      },
      hasClass: (className: string) => this.root_.classList.contains(className),
      setRippleCenter: (normalizedX: number) => {
        this.lineRipple && this.lineRipple.setRippleCenter(normalizedX)
      },
      activateBottomLine: () => {
        this.lineRipple && this.lineRipple.activate();
      },
      deactivateBottomLine: () => {
        this.lineRipple && this.lineRipple.deactivate();
      },
      notifyChange: (value: string) => {
        const index = this.selectedIndex;
        this.emit<MDCSelectEventDetail>(strings.CHANGE_EVENT, {value, index}, true /* shouldBubble  */);
      },
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getOutlineAdapterMethods() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      hasOutline: () => Boolean(this.outline),
      notchOutline: (labelWidth: number) => {
        this.outline && this.outline.notch(labelWidth);
      },
      closeOutline: () => {
        this.outline && this.outline.closeNotch();
      },
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getLabelAdapterMethods() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      hasLabel: () => !!this.label,
      floatLabel: (shouldFloat: boolean) => {
        this.label && this.label.float(shouldFloat);
      },
      getLabelWidth: () => this.label ? this.label.getWidth() : 0,
    };
    // tslint:enable:object-literal-sort-keys
  }

  /**
   * Calculates where the line ripple should start based on the x coordinate within the component.
   */
  private getNormalizedXCoordinate(evt: MouseEvent|TouchEvent): number {
    const targetClientRect = (evt.target as Element).getBoundingClientRect();
    const xCoordinate =
        this.isTouchEvent(evt) ? evt.touches[0].clientX : evt.clientX;
    return xCoordinate - targetClientRect.left;
  }

  private isTouchEvent(evt: MouseEvent|TouchEvent): evt is TouchEvent {
    return Boolean((evt as TouchEvent).touches);
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   */
  private getFoundationMap(): Partial<MDCSelectFoundationMap> {
    return {
      helperText: this.helperText ? this.helperText.foundation : undefined,
      leadingIcon: this.leadingIcon ? this.leadingIcon.foundation : undefined,
    };
  }
}
