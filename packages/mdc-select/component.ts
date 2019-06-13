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
import {MDCRippleCapableSurface} from '@material/ripple/types';
import {MDCSelectAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCSelectFoundation} from './foundation';
import {MDCSelectHelperText, MDCSelectHelperTextFactory} from './helper-text/component';
import {MDCSelectIcon, MDCSelectIconFactory} from './icon/component';
import {MDCSelectEventDetail, MDCSelectFoundationMap} from './types';

const VALIDATION_ATTR_WHITELIST = ['required', 'aria-required'];

export class MDCSelect extends MDCComponent<MDCSelectFoundation> implements MDCRippleCapableSurface {
  static attachTo(root: Element): MDCSelect {
    return new MDCSelect(root);
  }

  // Public visibility for this property is required by MDCRippleCapableSurface.
  root_!: HTMLElement; // assigned in MDCComponent constructor

  ripple!: MDCRipple | null;

  private menu_!: MDCMenu | null; // assigned in enhancedSelectSetup_()
  private isMenuOpen_!: boolean; // assigned in initialize()

  // Exactly one of these fields must be non-null.
  private nativeControl_!: HTMLSelectElement | null; // assigned in initialize()
  private selectedText_!: HTMLElement | null; // assigned in initialize()

  private targetElement_!: HTMLElement; // assigned in initialize()

  private hiddenInput_!: HTMLInputElement | null; // assigned in enhancedSelectSetup_()
  private menuElement_!: Element | null; // assigned in enhancedSelectSetup_()
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
  private handleMenuSelected_!: CustomEventListener<MDCMenuItemEvent>; // assigned in initialize()
  private validationObserver_!: MutationObserver; // assigned in initialize()

  initialize(
      labelFactory: MDCFloatingLabelFactory = (el) => new MDCFloatingLabel(el),
      lineRippleFactory: MDCLineRippleFactory = (el) => new MDCLineRipple(el),
      outlineFactory: MDCNotchedOutlineFactory = (el) => new MDCNotchedOutline(el),
      menuFactory: MDCMenuFactory = (el) => new MDCMenu(el),
      iconFactory: MDCSelectIconFactory = (el) => new MDCSelectIcon(el),
      helperTextFactory: MDCSelectHelperTextFactory = (el) => new MDCSelectHelperText(el),
  ) {
    this.isMenuOpen_ = false;
    this.nativeControl_ = this.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR);
    this.selectedText_ = this.root_.querySelector(strings.SELECTED_TEXT_SELECTOR);

    const targetElement = this.nativeControl_ || this.selectedText_;
    if (!targetElement) {
      throw new Error(
          'MDCSelect: Missing required element: Exactly one of the following selectors must be present: ' +
          `'${strings.NATIVE_CONTROL_SELECTOR}' or '${strings.SELECTED_TEXT_SELECTOR}'`,
      );
    }

    this.targetElement_ = targetElement;
    if (this.targetElement_.hasAttribute(strings.ARIA_CONTROLS)) {
      const helperTextElement = document.getElementById(this.targetElement_.getAttribute(strings.ARIA_CONTROLS)!);
      if (helperTextElement) {
        this.helperText_ = helperTextFactory(helperTextElement);
      }
    }

    if (this.selectedText_) {
      this.enhancedSelectSetup_(menuFactory);
    }

    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    this.label_ = labelElement ? labelFactory(labelElement) : null;

    const lineRippleElement = this.root_.querySelector(strings.LINE_RIPPLE_SELECTOR);
    this.lineRipple_ = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;

    const outlineElement = this.root_.querySelector(strings.OUTLINE_SELECTOR);
    this.outline_ = outlineElement ? outlineFactory(outlineElement) : null;

    const leadingIcon = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    if (leadingIcon) {
      this.root_.classList.add(cssClasses.WITH_LEADING_ICON);
      this.leadingIcon_ = iconFactory(leadingIcon);

      if (this.menuElement_) {
        this.menuElement_.classList.add(cssClasses.WITH_LEADING_ICON);
      }
    }

    if (!this.root_.classList.contains(cssClasses.OUTLINED)) {
      this.ripple = this.createRipple_();
    }

    // The required state needs to be sync'd before the mutation observer is added.
    this.initialSyncRequiredState_();
    this.addMutationObserverForRequired_();
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
      if (this.selectedText_) {
        this.selectedText_.focus();
      }
      this.foundation_.handleClick(this.getNormalizedXCoordinate_(evt));
    };
    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleMenuSelected_ = (evtData) => this.selectedIndex = evtData.detail.index;
    this.handleMenuOpened_ = () => {
      this.foundation_.handleMenuOpened();

      if (this.menu_!.items.length === 0) {
        return;
      }

      // Menu should open to the last selected element, should open to first menu item otherwise.
      const focusItemIndex = this.selectedIndex >= 0 ? this.selectedIndex : 0;
      const focusItemEl = this.menu_!.items[focusItemIndex] as HTMLElement;
      focusItemEl.focus();
    };
    this.handleMenuClosed_ = () => {
      this.foundation_.handleMenuClosed();

      // isMenuOpen_ is used to track the state of the menu opening or closing since the menu.open function
      // will return false if the menu is still closing and this method listens to the closed event which
      // occurs after the menu is already closed.
      this.isMenuOpen_ = false;
      this.selectedText_!.removeAttribute('aria-expanded');
      if (document.activeElement !== this.selectedText_) {
        this.foundation_.handleBlur();
      }
    };

    this.targetElement_.addEventListener('change', this.handleChange_);
    this.targetElement_.addEventListener('focus', this.handleFocus_);
    this.targetElement_.addEventListener('blur', this.handleBlur_);

    this.targetElement_.addEventListener('click', this.handleClick_ as EventListener);

    if (this.menuElement_) {
      this.selectedText_!.addEventListener('keydown', this.handleKeydown_);
      this.menu_!.listen(menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed_);
      this.menu_!.listen(menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened_);
      this.menu_!.listen(menuConstants.strings.SELECTED_EVENT, this.handleMenuSelected_);

      if (this.hiddenInput_ && this.hiddenInput_.value) {
        // If the hidden input already has a value, use it to restore the select's value.
        // This can happen e.g. if the user goes back or (in some browsers) refreshes the page.
        const enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
        enhancedAdapterMethods.setValue(this.hiddenInput_.value);
      } else if (this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR)) {
        // If an element is selected, the select should set the initial selected text.
        const enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
        enhancedAdapterMethods.setValue(enhancedAdapterMethods.getValue());
      }
    }

    // Initially sync floating label
    this.foundation_.handleChange(/* didChange */ false);

    if (this.root_.classList.contains(cssClasses.DISABLED)
        || (this.nativeControl_ && this.nativeControl_.disabled)) {
      this.disabled = true;
    }
  }

  destroy() {
    this.targetElement_.removeEventListener('change', this.handleChange_);
    this.targetElement_.removeEventListener('focus', this.handleFocus_);
    this.targetElement_.removeEventListener('blur', this.handleBlur_);
    this.targetElement_.removeEventListener('keydown', this.handleKeydown_);
    this.targetElement_.removeEventListener('click', this.handleClick_ as EventListener);

    if (this.menu_) {
      this.menu_.unlisten(menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed_);
      this.menu_.unlisten(menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened_);
      this.menu_.unlisten(menuConstants.strings.SELECTED_EVENT, this.handleMenuSelected_);
      this.menu_.destroy();
    }

    if (this.ripple) {
      this.ripple.destroy();
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
    if (this.validationObserver_) {
      this.validationObserver_.disconnect();
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
    let selectedIndex = -1;
    if (this.menuElement_ && this.menu_) {
      const selectedEl = this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR)!;
      selectedIndex = this.menu_.items.indexOf(selectedEl);
    } else if (this.nativeControl_) {
      selectedIndex = this.nativeControl_.selectedIndex;
    }
    return selectedIndex;
  }

  set selectedIndex(selectedIndex: number) {
    this.foundation_.setSelectedIndex(selectedIndex);
  }

  get disabled(): boolean {
    return this.root_.classList.contains(cssClasses.DISABLED) ||
        (this.nativeControl_ ? this.nativeControl_.disabled : false);
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
    if (this.nativeControl_) {
      this.nativeControl_.required = isRequired;
    } else {
      if (isRequired) {
        this.selectedText_!.setAttribute('aria-required', isRequired.toString());
      } else {
        this.selectedText_!.removeAttribute('aria-required');
      }
    }
  }

  /**
   * Returns whether the select is required.
   */
  get required(): boolean {
    if (this.nativeControl_) {
      return this.nativeControl_.required;
    } else {
      return this.selectedText_!.getAttribute('aria-required') === 'true';
    }
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
      ...(this.nativeControl_ ? this.getNativeSelectAdapterMethods_() : this.getEnhancedSelectAdapterMethods_()),
      ...this.getCommonAdapterMethods_(),
      ...this.getOutlineAdapterMethods_(),
      ...this.getLabelAdapterMethods_(),
    };
    return new MDCSelectFoundation(adapter, this.getFoundationMap_());
  }

  /**
   * Handles setup for the enhanced menu.
   */
  private enhancedSelectSetup_(menuFactory: MDCMenuFactory) {
    const isDisabled = this.root_.classList.contains(cssClasses.DISABLED);
    this.selectedText_!.setAttribute('tabindex', isDisabled ? '-1' : '0');
    this.hiddenInput_ = this.root_.querySelector(strings.HIDDEN_INPUT_SELECTOR);
    this.menuElement_ = this.root_.querySelector(strings.MENU_SELECTOR)!;
    this.menu_ = menuFactory(this.menuElement_);
    this.menu_.hoistMenuToBody();
    this.menu_.setAnchorElement(this.root_);
    this.menu_.setAnchorCorner(menuSurfaceConstants.Corner.BOTTOM_START);
    this.menu_.wrapFocus = false;
  }

  private createRipple_(): MDCRipple {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      registerInteractionHandler: (evtType, handler) => this.targetElement_.addEventListener(evtType, handler),
      deregisterInteractionHandler: (evtType, handler) => this.targetElement_.removeEventListener(evtType, handler),
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCRipple(this.root_, new MDCRippleFoundation(adapter));
  }

  private getNativeSelectAdapterMethods_() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      getValue: () => this.nativeControl_!.value,
      setValue: (value: string) => {
        this.nativeControl_!.value = value;
      },
      openMenu: () => undefined,
      closeMenu: () => undefined,
      isMenuOpen: () => false,
      setSelectedIndex: (index: number) => {
        this.nativeControl_!.selectedIndex = index;
      },
      setDisabled: (isDisabled: boolean) => {
        this.nativeControl_!.disabled = isDisabled;
      },
      setValid: (isValid: boolean) => {
        if (isValid) {
          this.root_.classList.remove(cssClasses.INVALID);
        } else {
          this.root_.classList.add(cssClasses.INVALID);
        }
      },
      checkValidity: () => this.nativeControl_!.checkValidity(),
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getEnhancedSelectAdapterMethods_() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      getValue: () => {
        const listItem = this.menuElement_!.querySelector(strings.SELECTED_ITEM_SELECTOR);
        if (listItem && listItem.hasAttribute(strings.ENHANCED_VALUE_ATTR)) {
          return listItem.getAttribute(strings.ENHANCED_VALUE_ATTR) || '';
        }
        return '';
      },
      setValue: (value: string) => {
        const element = this.menuElement_!.querySelector(`[${strings.ENHANCED_VALUE_ATTR}="${value}"]`);
        this.setEnhancedSelectedIndex_(element ? this.menu_!.items.indexOf(element) : -1);
      },
      openMenu: () => {
        if (this.menu_ && !this.menu_.open) {
          this.menu_.open = true;
          this.isMenuOpen_ = true;
          this.selectedText_!.setAttribute('aria-expanded', 'true');
        }
      },
      closeMenu: () => {
        if (this.menu_ && this.menu_.open) {
          this.menu_.open = false;
        }
      },
      isMenuOpen: () => Boolean(this.menu_) && this.isMenuOpen_,
      setSelectedIndex: (index: number) => this.setEnhancedSelectedIndex_(index),
      setDisabled: (isDisabled: boolean) => {
        this.selectedText_!.setAttribute('tabindex', isDisabled ? '-1' : '0');
        this.selectedText_!.setAttribute('aria-disabled', isDisabled.toString());
        if (this.hiddenInput_) {
          this.hiddenInput_.disabled = isDisabled;
        }
      },
      checkValidity: () => {
        const classList = this.root_.classList;
        if (classList.contains(cssClasses.REQUIRED) && !classList.contains(cssClasses.DISABLED)) {
          // See notes for required attribute under https://www.w3.org/TR/html52/sec-forms.html#the-select-element
          // TL;DR: Invalid if no index is selected, or if the first index is selected and has an empty value.
          return this.selectedIndex !== -1 && (this.selectedIndex !== 0 || Boolean(this.value));
        } else {
          return true;
        }
      },
      setValid: (isValid: boolean) => {
        this.selectedText_!.setAttribute('aria-invalid', (!isValid).toString());
        if (isValid) {
          this.root_.classList.remove(cssClasses.INVALID);
        } else {
          this.root_.classList.add(cssClasses.INVALID);
        }
      },
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
    return {
      floatLabel: (shouldFloat: boolean) => this.label_ && this.label_.float(shouldFloat),
      getLabelWidth: () => this.label_ ? this.label_.getWidth() : 0,
    };
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

  private setEnhancedSelectedIndex_(index: number) {
    const selectedItem = this.menu_!.items[index];
    this.selectedText_!.textContent = selectedItem ? selectedItem.textContent!.trim() : '';
    const previouslySelected = this.menuElement_!.querySelector(strings.SELECTED_ITEM_SELECTOR);

    if (previouslySelected) {
      previouslySelected.classList.remove(cssClasses.SELECTED_ITEM_CLASS);
      previouslySelected.removeAttribute(strings.ARIA_SELECTED_ATTR);
    }

    if (selectedItem) {
      selectedItem.classList.add(cssClasses.SELECTED_ITEM_CLASS);
      selectedItem.setAttribute(strings.ARIA_SELECTED_ATTR, 'true');
    }

    // Synchronize hidden input's value with data-value attribute of selected item.
    // This code path is also followed when setting value directly, so this covers all cases.
    if (this.hiddenInput_) {
      this.hiddenInput_.value = selectedItem ? selectedItem.getAttribute(strings.ENHANCED_VALUE_ATTR) || '' : '';
    }

    this.layout();
  }

  private initialSyncRequiredState_() {
    const isRequired =
        (this.targetElement_ as HTMLSelectElement).required
        || this.targetElement_.getAttribute('aria-required') === 'true'
        || this.root_.classList.contains(cssClasses.REQUIRED);
    if (isRequired) {
      if (this.nativeControl_) {
        this.nativeControl_.required = true;
      } else {
        this.selectedText_!.setAttribute('aria-required', 'true');
      }
      this.root_.classList.add(cssClasses.REQUIRED);
    }
  }

  private addMutationObserverForRequired_() {
    const observerHandler = (attributesList: string[]) => {
      attributesList.some((attributeName) => {
        if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) === -1) {
          return false;
        }

        if (this.selectedText_) {
          if (this.selectedText_.getAttribute('aria-required') === 'true') {
            this.root_.classList.add(cssClasses.REQUIRED);
          } else {
            this.root_.classList.remove(cssClasses.REQUIRED);
          }
        } else {
          if (this.nativeControl_!.required) {
            this.root_.classList.add(cssClasses.REQUIRED);
          } else {
            this.root_.classList.remove(cssClasses.REQUIRED);
          }
        }

        return true;
      });
    };

    const getAttributesList = (mutationsList: MutationRecord[]): string[] => {
      return mutationsList
          .map((mutation) => mutation.attributeName)
          .filter((attributeName) => attributeName) as string[];
    };
    const observer = new MutationObserver((mutationsList) => observerHandler(getAttributesList(mutationsList)));
    observer.observe(this.targetElement_, {attributes: true});
    this.validationObserver_ = observer;
  }
}
