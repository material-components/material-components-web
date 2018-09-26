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

import {MDCComponent} from '@material/base/index';
import {MDCFloatingLabel} from '@material/floating-label/index';
import {MDCLineRipple} from '@material/line-ripple/index';
import {MDCMenu} from '@material/menu/index';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';
import {MDCNotchedOutline} from '@material/notched-outline/index';

import MDCSelectFoundation from './foundation';
import MDCSelectAdapter from './adapter';
import {cssClasses, strings} from './constants';
import {strings as menuSurfaceStrings, Corner} from '@material/menu-surface/constants';
import {strings as menuStrings} from '@material/menu/constants';

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
    /** @private {boolean} */
    this.menuOpened_ = false;
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
      const selectedElement =this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR);
      selectedIndex = this.menu_.items.indexOf(selectedElement);
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
    return this.root_.classList.contains(cssClasses.DISABLED) || (this.nativeControl_ && this.nativeControl_.disabled);
  }

  /**
   * @param {boolean} disabled Sets the select disabled or enabled.
   */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
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
   */
  initialize(
    labelFactory = (el) => new MDCFloatingLabel(el),
    lineRippleFactory = (el) => new MDCLineRipple(el),
    outlineFactory = (el) => new MDCNotchedOutline(el)) {
    this.nativeControl_ = this.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR);
    this.selectedText_ = this.root_.querySelector('.mdc-select__selected-text');

    if (this.selectedText_) {
      this.enhancedSelectSetup_();
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

    if (!this.root_.classList.contains(cssClasses.OUTLINED)) {
      this.ripple = this.initRipple_();
    }
  }

  /**
   * Handles setup for the enhanced menu.
   * @private
   */
  enhancedSelectSetup_() {
    const isDisabled = this.root_.classList.contains(cssClasses.DISABLED);
    this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
    this.menuElement_ = this.root_.querySelector(strings.MENU_SELECTOR);
    this.menu_ = new MDCMenu(this.menuElement_);
    this.menu_.hoistMenuToBody();
    this.menu_.setAnchorElement(this.root_);
    this.menu_.setAnchorCorner(Corner.BOTTOM_START);
    this.menu_.listen(menuSurfaceStrings.CLOSED_EVENT, () => {
      // menuOpened_ is used to track the state of the menu opening or closing since the menu.open function
      // will return false if the menu is still closing and this method listens to the closed event which
      // occurs after the menu is already closed.
      this.menuOpened_ = false;
      if (document.activeElement !== this.selectedText_) {
        this.foundation_.handleBlur();
      }
    });

    // Menu should open to the last selected element.
    this.menu_.listen(menuSurfaceStrings.OPENED_EVENT, () => {
      if (this.selectedIndex >= 0) {
        this.menu_.items[this.selectedIndex].focus();
      }
    });

    this.menu_.listen(menuStrings.SELECTED_EVENT, (evtData) => {
      this.selectedIndex = evtData.detail.index;
    });
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
    this.handleChange_ = () => this.foundation_.handleChange();
    this.handleFocus_ = () => this.foundation_.handleFocus();
    this.handleBlur_ = () => this.foundation_.handleBlur();
    this.handleClick_ = (evt) => this.foundation_.handleClick(this.getNormalizedXCoordinate_(evt));
    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);

    const element = this.nativeControl_ ? this.nativeControl_ : this.selectedText_;

    element.addEventListener('change', this.handleChange_);
    element.addEventListener('focus', this.handleFocus_);
    element.addEventListener('blur', this.handleBlur_);
    element.addEventListener('keydown', this.handleKeydown_);

    ['mousedown', 'touchstart'].forEach((evtType) => {
      element.addEventListener(evtType, this.handleClick_);
    });

    if (this.menuElement_ && this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR)) {
      // If an element is selected, the select should set the initial selected text.
      const enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
      enhancedAdapterMethods.setValue(enhancedAdapterMethods.getValue());
    }

    // Initially sync floating label
    this.foundation_.handleChange();

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
    ['mousedown', 'touchstart'].forEach((evtType) => {
      element.removeEventListener(evtType, this.handleClick_);
    });

    if (this.ripple) {
      this.ripple.destroy();
    }
    if (this.outline_) {
      this.outline_.destroy();
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
      )
    );
  }

  /**
   * @return {!{
   *   getValue: function(): string,
   *   setValue: function(string): string,
   *   openMenu: function(): void,
   *   closeMenu: function(): void,
   *   isMenuOpened: function(): boolean,
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
      isMenuOpened: () => false,
      setSelectedIndex: (index) => {
        this.nativeControl_.selectedIndex = index;
      },
      setDisabled: (isDisabled) => this.nativeControl_.disabled = isDisabled,
    };
  }

  /**
   * @return {!{
   *   getValue: function(): string,
   *   setValue: function(string): string,
   *   openMenu: function(): void,
   *   closeMenu: function(): void,
   *   isMenuOpened: function(): boolean,
   *   setSelectedIndex: function(number): void,
   *   setDisabled: function(boolean): void
   * }}
   * @private
   */
  getEnhancedSelectAdapterMethods_() {
    return {
      getValue: () => {
        const listItem = this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR);
        if (listItem) {
          if (listItem.value) {
            return listItem.value;
          } else {
            return listItem.textContent.trim();
          }
        }
        return '';
      },
      setValue: (value) => {
        const element = this.menuElement_.querySelector(`[value="${value}"]`);
        if (element) {
          this.setEnhancedSelectedIndex_(this.menu_.items.indexOf(element));
        } else {
          this.selectedText_.textContent = value;
        }
      },
      openMenu: () => {
        if (this.menu_ && !this.menu_.open) {
          this.menu_.open = true;
          this.menuOpened_ = true;
        }
      },
      closeMenu: () => {
        if (this.menu_ && this.menu_.open) {
          this.menu_.open = false;
        }
      },
      isMenuOpened: () => this.menu_ && this.menuOpened_,
      setSelectedIndex: (index) => {
        this.setEnhancedSelectedIndex_(index);
      },
      setDisabled: (isDisabled) => {
        this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
        this.root_.classList[isDisabled ? 'add' : 'remove'](cssClasses.DISABLED);
      },
    };
  }

  /**
   * Sets the selected index of the enhanced menu.
   * @param {number} index
   * @private
   */
  setEnhancedSelectedIndex_(index) {
    const selectedItem = this.menu_.items[index];
    this.selectedText_.textContent = selectedItem.textContent.trim();
    const previouslySelected = this.menuElement_.querySelector(strings.SELECTED_ITEM_SELECTOR);

    if (previouslySelected) {
      previouslySelected.classList.remove(cssClasses.SELECTED_ITEM_CLASS);
      previouslySelected.removeAttribute('aria-selected');
    }

    selectedItem.classList.add(cssClasses.SELECTED_ITEM_CLASS);
    selectedItem.setAttribute('aria-selected', 'true');

    this.layout();
  }

  /**
   * @return {!{
   *   addClass: function(string): void,
   *   removeClass: function(string): void,
   *   hasClass: function(string): void,
   *   isRtl: function(): boolean,
   *   setRippleCenter: function(number): void,
   *   activateBottomLine: function(): void,
   *   deactivateBottomLine: function(): void
   * }}
   * @private
   */
  getCommonAdapterMethods_() {
    return {
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      isRtl: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      setRippleCenter: (normalizedX) => this.lineRipple_ && this.lineRipple_.setRippleCenter(normalizedX),
      activateBottomLine: () => this.lineRipple_ && this.lineRipple_.activate(),
      deactivateBottomLine: () => this.lineRipple_ && this.lineRipple_.deactivate(),
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
      notchOutline: (labelWidth, isRtl) => {
        if (this.outline_) {
          this.outline_.notch(labelWidth, isRtl);
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
   *   hasLabel: function(): boolean,
   *   floatLabel: function(boolean): undefined,
   *   getLabelWidth: function(): number,
   * }}
   */
  getLabelAdapterMethods_() {
    return {
      hasLabel: () => !!this.label_,
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
}

export {MDCSelect, MDCSelectFoundation};
