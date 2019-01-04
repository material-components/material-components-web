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

import MDCComponent from '@material/base/component';
import {MDCFloatingLabel} from '@material/floating-label/index';
import {MDCLineRipple} from '@material/line-ripple/index';
import {MDCMenu} from '@material/menu/index';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';
import {MDCNotchedOutline} from '@material/notched-outline/index';
import MDCSelectFoundation from './foundation';
import {cssClasses, strings} from './constants';

/* eslint-disable no-unused-vars */
import {MDCSelectAdapter, FoundationMapType} from './adapter';
import {MDCSelectIcon, MDCSelectIconFoundation} from './icon/index';
import {MDCSelectHelperText, MDCSelectHelperTextFoundation} from './helper-text/index';
/* eslint-enable no-unused-vars */

// Closure has issues with {this as that} syntax.
import * as menuSurfaceConstants from '@material/menu-surface/constants';
import * as menuConstants from '@material/menu/constants';

const VALIDATION_ATTR_WHITELIST = ['required', 'aria-required'];

/**
 * @extends MDCComponent<!MDCSelectFoundation>
 */
class MDCSelect extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.nativeControl_;
    /** @private {?Element} */
    this.selectedText_;
    /** @private {?Element} */
    this.hiddenInput_;
    /** @private {?MDCSelectIcon} */
    this.leadingIcon_;
    /** @private {?MDCSelectHelperText} */
    this.helperText_;
    /** @private {?Element} */
    this.menuElement_;
    /** @type {?MDCMenu} */
    this.menu_;
    /** @type {?MDCRipple} */
    this.ripple;
    /** @private {?MDCLineRipple} */
    this.lineRipple_;
    /** @private {?MDCFloatingLabel} */
    this.label_;
    /** @private {?MDCNotchedOutline} */
    this.outline_;
    /** @private {!Function} */
    this.handleChange_;
    /** @private {!Function} */
    this.handleFocus_;
    /** @private {!Function} */
    this.handleBlur_;
    /** @private {!Function} */
    this.handleClick_;
    /** @private {!Function} */
    this.handleKeydown_;
    /** @private {!Function} */
    this.handleMenuOpened_;
    /** @private {!Function} */
    this.handleMenuClosed_;
    /** @private {!Function} */
    this.handleMenuSelected_;
    /** @private {boolean} */
    this.menuOpened_ = false;
    /** @private {!MutationObserver} */
    this.validationObserver_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCSelect}
   */
  static attachTo(root) {
    return new MDCSelect(root);
  }

  /**
   * @return {string} The value of the select.
   */
  get value() {
    return this.foundation_.getValue();
  }

  /**
   * @param {string} value The value to set on the select.
   */
  set value(value) {
    this.foundation_.setValue(value);
  }

  /**
   * @return {number} The selected index of the select.
   */
  get selectedIndex() {
    let selectedIndex;
    if (this.menuElement_) {
      const selectedEl = /** @type {!HTMLElement} */ (this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR));
      selectedIndex = this.menu_.items.indexOf(selectedEl);
    } else {
      selectedIndex = this.nativeControl_.selectedIndex;
    }
    return selectedIndex;
  }

  /**
   * @param {number} selectedIndex The index of the option to be set on the select.
   */
  set selectedIndex(selectedIndex) {
    this.foundation_.setSelectedIndex(selectedIndex);
  }

  /**
   * @return {boolean} True if the select is disabled.
   */
  get disabled() {
    return this.root_.classList.contains(cssClasses.DISABLED) ||
      (this.nativeControl_ ? this.nativeControl_.disabled : false);
  }

  /**
   * @param {boolean} disabled Sets the select disabled or enabled.
   */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  /**
   * Sets the aria label of the leading icon.
   * @param {string} label
   */
  set leadingIconAriaLabel(label) {
    this.foundation_.setLeadingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the leading icon.
   * @param {string} content
   */
  set leadingIconContent(content) {
    this.foundation_.setLeadingIconContent(content);
  }

  /**
   * Sets the text content of the helper text.
   * @param {string} content
   */
  set helperTextContent(content) {
    this.foundation_.setHelperTextContent(content);
  }

  /**
   * Sets the current invalid state of the select.
   * @param {boolean} isValid
   */
  set valid(isValid) {
    this.foundation_.setValid(isValid);
  }

  /**
   * Checks if the select is in a valid state.
   * @return {boolean}
   */
  get valid() {
    return this.foundation_.isValid();
  }

  /**
   * Sets the control to the required state.
   * @param {boolean} isRequired
   */
  set required(isRequired) {
    if (this.nativeControl_) {
      this.nativeControl_.required = isRequired;
    } else {
      if (isRequired) {
        this.selectedText_.setAttribute('aria-required', isRequired.toString());
      } else {
        this.selectedText_.removeAttribute('aria-required');
      }
    }
  }

  /**
   * Returns whether the select is required.
   * @return {boolean}
   */
  get required() {
    if (this.nativeControl_) {
      return this.nativeControl_.required;
    } else {
      return this.selectedText_.getAttribute('aria-required') === 'true';
    }
  }

  /**
   * Recomputes the outline SVG path for the outline element.
   */
  layout() {
    this.foundation_.layout();
  }


  /**
   * @param {(function(!Element): !MDCLineRipple)=} lineRippleFactory A function which creates a new MDCLineRipple.
   * @param {(function(!Element): !MDCFloatingLabel)=} labelFactory A function which creates a new MDCFloatingLabel.
   * @param {(function(!Element): !MDCNotchedOutline)=} outlineFactory A function which creates a new MDCNotchedOutline.
   * @param {(function(!Element): !MDCMenu)=} menuFactory A function which creates a new MDCMenu.
   * @param {(function(!Element): !MDCSelectIcon)=} iconFactory A function which creates a new MDCSelectIcon.
   * @param {(function(!Element): !MDCSelectHelperText)=} helperTextFactory A function which creates a new
   * MDCSelectHelperText.
   */
  initialize(
    labelFactory = (el) => new MDCFloatingLabel(el),
    lineRippleFactory = (el) => new MDCLineRipple(el),
    outlineFactory = (el) => new MDCNotchedOutline(el),
    menuFactory = (el) => new MDCMenu(el),
    iconFactory = (el) => new MDCSelectIcon(el),
    helperTextFactory = (el) => new MDCSelectHelperText(el)) {
    this.nativeControl_ = /** @type {HTMLElement} */ (this.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR));
    this.selectedText_ = /** @type {HTMLElement} */ (this.root_.querySelector(strings.SELECTED_TEXT_SELECTOR));

    if (this.selectedText_) {
      this.enhancedSelectSetup_(menuFactory);
    }

    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }
    const lineRippleElement = this.root_.querySelector(strings.LINE_RIPPLE_SELECTOR);
    if (lineRippleElement) {
      this.lineRipple_ = lineRippleFactory(lineRippleElement);
    }
    const outlineElement = this.root_.querySelector(strings.OUTLINE_SELECTOR);
    if (outlineElement) {
      this.outline_ = outlineFactory(outlineElement);
    }

    const leadingIcon = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    if (leadingIcon) {
      this.root_.classList.add(cssClasses.WITH_LEADING_ICON);
      this.leadingIcon_ = iconFactory(leadingIcon);

      if (this.menuElement_) {
        this.menuElement_.classList.add(cssClasses.WITH_LEADING_ICON);
      }
    }
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;
    if (element.hasAttribute(strings.ARIA_CONTROLS)) {
      const helperTextElement = document.getElementById(element.getAttribute(strings.ARIA_CONTROLS));
      if (helperTextElement) {
        this.helperText_ = helperTextFactory(helperTextElement);
      }
    }

    if (!this.root_.classList.contains(cssClasses.OUTLINED)) {
      this.ripple = this.initRipple_();
    }

    // The required state needs to be sync'd before the mutation observer is added.
    this.initialSyncRequiredState_();
    this.addMutationObserverForRequired_();
  }

  /**
   * Handles setup for the enhanced menu.
   * @private
   */
  enhancedSelectSetup_(menuFactory) {
    const isDisabled = this.root_.classList.contains(cssClasses.DISABLED);
    this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
    this.hiddenInput_ = this.root_.querySelector(strings.HIDDEN_INPUT_SELECTOR);
    this.menuElement_ = /** @type {HTMLElement} */ (this.root_.querySelector(strings.MENU_SELECTOR));
    this.menu_ = menuFactory(this.menuElement_);
    this.menu_.hoistMenuToBody();
    this.menu_.setAnchorElement(/** @type {!HTMLElement} */ (this.root_));
    this.menu_.setAnchorCorner(menuSurfaceConstants.Corner.BOTTOM_START);
    this.menu_.wrapFocus = false;
  }

  /**
   * @private
   * @return {!MDCRipple}
   */
  initRipple_() {
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      registerInteractionHandler: (type, handler) => element.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => element.removeEventListener(type, handler),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
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
      if (this.selectedText_) this.selectedText_.focus();
      this.foundation_.handleClick(this.getNormalizedXCoordinate_(evt));
    };
    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleMenuSelected_ = (evtData) => this.selectedIndex = evtData.detail.index;
    this.handleMenuOpened_ = () => {
      // Menu should open to the last selected element.
      if (this.selectedIndex >= 0) {
        this.menu_.items[this.selectedIndex].focus();
      }
    };
    this.handleMenuClosed_ = () => {
      // menuOpened_ is used to track the state of the menu opening or closing since the menu.open function
      // will return false if the menu is still closing and this method listens to the closed event which
      // occurs after the menu is already closed.
      this.menuOpened_ = false;
      this.selectedText_.removeAttribute('aria-expanded');
      if (document.activeElement !== this.selectedText_) {
        this.foundation_.handleBlur();
      }
    };

    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;

    element.addEventListener('change', this.handleChange_);
    element.addEventListener('focus', this.handleFocus_);
    element.addEventListener('blur', this.handleBlur_);

    ['mousedown', 'touchstart'].forEach((evtType) => {
      element.addEventListener(evtType, this.handleClick_);
    });

    if (this.menuElement_) {
      this.selectedText_.addEventListener('keydown', this.handleKeydown_);
      this.menu_.listen(menuSurfaceConstants.strings.CLOSED_EVENT, this.handleMenuClosed_);
      this.menu_.listen(menuSurfaceConstants.strings.OPENED_EVENT, this.handleMenuOpened_);
      this.menu_.listen(menuConstants.strings.SELECTED_EVENT, this.handleMenuSelected_);

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
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;

    element.removeEventListener('change', this.handleChange_);
    element.removeEventListener('focus', this.handleFocus_);
    element.removeEventListener('blur', this.handleBlur_);
    element.removeEventListener('keydown', this.handleKeydown_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      element.removeEventListener(evtType, this.handleClick_);
    });

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

  /**
   * @return {!MDCSelectFoundation}
   */
  getDefaultFoundation() {
    return new MDCSelectFoundation(
      /** @type {!MDCSelectAdapter} */ (Object.assign(
        this.nativeControl_ ? this.getNativeSelectAdapterMethods_() : this.getEnhancedSelectAdapterMethods_(),
        this.getCommonAdapterMethods_(),
        this.getOutlineAdapterMethods_(),
        this.getLabelAdapterMethods_())
      ),
      this.getFoundationMap_()
    );
  }

  /**
   * @return {!{
   *   getValue: function(): string,
   *   setValue: function(string): string,
   *   openMenu: function(): void,
   *   closeMenu: function(): void,
   *   isMenuOpen: function(): boolean,
   *   setSelectedIndex: function(number): void,
   *   setDisabled: function(boolean): void
   * }}
   * @private
   */
  getNativeSelectAdapterMethods_() {
    return {
      getValue: () => this.nativeControl_.value,
      setValue: (value) => this.nativeControl_.value = value,
      openMenu: () => {},
      closeMenu: () => {},
      isMenuOpen: () => false,
      setSelectedIndex: (index) => {
        this.nativeControl_.selectedIndex = index;
      },
      setDisabled: (isDisabled) => this.nativeControl_.disabled = isDisabled,
      setValid: (isValid) => {
        isValid ? this.root_.classList.remove(cssClasses.INVALID) : this.root_.classList.add(cssClasses.INVALID);
      },
      checkValidity: () => this.nativeControl_.checkValidity(),
    };
  }

  /**
   * @return {!{
   *   getValue: function(): string,
   *   setValue: function(string): string,
   *   openMenu: function(): void,
   *   closeMenu: function(): void,
   *   isMenuOpen: function(): boolean,
   *   setSelectedIndex: function(number): void,
   *   setDisabled: function(boolean): void
   * }}
   * @private
   */
  getEnhancedSelectAdapterMethods_() {
    return {
      getValue: () => {
        const listItem = this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR);
        if (listItem && listItem.hasAttribute(strings.ENHANCED_VALUE_ATTR)) {
          return listItem.getAttribute(strings.ENHANCED_VALUE_ATTR);
        }
        return '';
      },
      setValue: (value) => {
        const element =
          /** @type {HTMLElement} */ (this.menuElement_.querySelector(`[${strings.ENHANCED_VALUE_ATTR}="${value}"]`));
        this.setEnhancedSelectedIndex_(element ? this.menu_.items.indexOf(element) : -1);
      },
      openMenu: () => {
        if (this.menu_ && !this.menu_.open) {
          this.menu_.open = true;
          this.menuOpened_ = true;
          this.selectedText_.setAttribute('aria-expanded', 'true');
        }
      },
      closeMenu: () => {
        if (this.menu_ && this.menu_.open) {
          this.menu_.open = false;
        }
      },
      isMenuOpen: () => this.menu_ && this.menuOpened_,
      setSelectedIndex: (index) => {
        this.setEnhancedSelectedIndex_(index);
      },
      setDisabled: (isDisabled) => {
        this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
        this.selectedText_.setAttribute('aria-disabled', isDisabled.toString());
        if (this.hiddenInput_) {
          this.hiddenInput_.disabled = isDisabled;
        }
      },
      checkValidity: () => {
        const classList = this.root_.classList;
        if (classList.contains(cssClasses.REQUIRED) && !classList.contains(cssClasses.DISABLED)) {
          // See notes for required attribute under https://www.w3.org/TR/html52/sec-forms.html#the-select-element
          // TL;DR: Invalid if no index is selected, or if the first index is selected and has an empty value.
          return this.selectedIndex !== -1 && (this.selectedIndex !== 0 || this.value);
        } else {
          return true;
        }
      },
      setValid: (isValid) => {
        this.selectedText_.setAttribute('aria-invalid', (!isValid).toString());
        isValid ? this.root_.classList.remove(cssClasses.INVALID) : this.root_.classList.add(cssClasses.INVALID);
      },
    };
  }

  /**
   * @return {!{
   *   addClass: function(string): void,
   *   removeClass: function(string): void,
   *   hasClass: function(string): void,
   *   setRippleCenter: function(number): void,
   *   activateBottomLine: function(): void,
   *   deactivateBottomLine: function(): void,
   *   notifyChange: function(string): void
   * }}
   * @private
   */
  getCommonAdapterMethods_() {
    return {
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      setRippleCenter: (normalizedX) => this.lineRipple_ && this.lineRipple_.setRippleCenter(normalizedX),
      activateBottomLine: () => this.lineRipple_ && this.lineRipple_.activate(),
      deactivateBottomLine: () => this.lineRipple_ && this.lineRipple_.deactivate(),
      notifyChange: (value) => {
        const index = this.selectedIndex;
        this.emit(strings.CHANGE_EVENT, {value, index}, true /* shouldBubble  */);
      },
    };
  }

  /**
   * @return {!{
   *   hasOutline: function(): boolean,
   *   notchOutline: function(number, boolean): undefined,
   *   closeOutline: function(): undefined,
   * }}
   */
  getOutlineAdapterMethods_() {
    return {
      hasOutline: () => !!this.outline_,
      notchOutline: (labelWidth) => {
        if (this.outline_) {
          this.outline_.notch(labelWidth);
        }
      },
      closeOutline: () => {
        if (this.outline_) {
          this.outline_.closeNotch();
        }
      },
    };
  }

  /**
   * @return {!{
   *   floatLabel: function(boolean): undefined,
   *   getLabelWidth: function(): number,
   * }}
   */
  getLabelAdapterMethods_() {
    return {
      floatLabel: (shouldFloat) => {
        if (this.label_) {
          this.label_.float(shouldFloat);
        }
      },
      getLabelWidth: () => {
        return this.label_ ? this.label_.getWidth() : 0;
      },
    };
  }

  /**
   * Calculates where the line ripple should start based on the x coordinate within the component.
   * @param {!(MouseEvent|TouchEvent)} evt
   * @return {number} normalizedX
   */
  getNormalizedXCoordinate_(evt) {
    const targetClientRect = evt.target.getBoundingClientRect();
    const xCoordinate = evt.clientX;
    return xCoordinate - targetClientRect.left;
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   * @return {!FoundationMapType}
   */
  getFoundationMap_() {
    return {
      leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
      helperText: this.helperText_ ? this.helperText_.foundation : undefined,
    };
  }

  /**
   * Sets the selected index of the enhanced menu.
   * @param {number} index
   * @private
   */
  setEnhancedSelectedIndex_(index) {
    const selectedItem = this.menu_.items[index];
    this.selectedText_.textContent = selectedItem ? selectedItem.textContent.trim() : '';
    const previouslySelected = this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR);

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

  initialSyncRequiredState_() {
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;
    const isRequired = element.required || element.getAttribute('aria-required') === 'true'
      || this.root_.classList.contains(cssClasses.REQUIRED);
    if (isRequired) {
      if (this.nativeControl_) {
        this.nativeControl_.required = true;
      } else {
        this.selectedText_.setAttribute('aria-required', 'true');
      }
      this.root_.classList.add(cssClasses.REQUIRED);
    }
  }

  addMutationObserverForRequired_() {
    const observerHandler = (attributesList) => {
      attributesList.some((attributeName) => {
        if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
          if (this.selectedText_) {
            if (this.selectedText_.getAttribute('aria-required') === 'true') {
              this.root_.classList.add(cssClasses.REQUIRED);
            } else {
              this.root_.classList.remove(cssClasses.REQUIRED);
            }
          } else {
            if (this.nativeControl_.required) {
              this.root_.classList.add(cssClasses.REQUIRED);
            } else {
              this.root_.classList.remove(cssClasses.REQUIRED);
            }
          }
          return true;
        }
      });
    };

    const getAttributesList = (mutationsList) => mutationsList.map((mutation) => mutation.attributeName);
    const observer = new MutationObserver((mutationsList) => observerHandler(getAttributesList(mutationsList)));
    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;
    observer.observe(element, {attributes: true});
    this.validationObserver_ = observer;
  };
}

export {MDCSelect, MDCSelectFoundation,
  MDCSelectHelperText, MDCSelectHelperTextFoundation,
  MDCSelectIcon, MDCSelectIconFoundation};
