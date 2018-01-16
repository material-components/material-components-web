/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {InteractivityProvider, ToolbarProvider, HotSwapper} from '../interactivity.js';
import * as dom from '../dom.js';
import * as util from '../util.js';
import * as pony from '../ponyfill.js';

const classes = {
  MDC_LIST_ITEM: 'mdc-list-item',
  THEME_MENU_ITEM_SELECTED: 'demo-theme-menu__list-item--selected',
  COMPONENT_SECTION: 'demo-component-section',
  COMPONENT_SECTION_FLASH: 'demo-component-section--flash',
  COMPONENT_SECTION_PERMALINK: 'demo-component-section__permalink',
  COMPONENT_SECTION_HEADING_FOCUS_WITHIN: 'demo-component-section__heading--focus-within',
};

const attributes = {
  THEME_NAME: 'data-theme',
};

const ids = {
  THEME_STYLESHEET: 'theme-stylesheet',
  THEME_COLOR_MENU: 'theme-color-menu',
  THEME_COLOR_MENU_ACTION: 'theme-color-action',
};

const events = {
  MDC_SIMPLE_MENU_SELECTED: 'MDCSimpleMenu:selected',
};

class Permalinker extends InteractivityProvider {
  /** @param {!Element|!Document} root */
  static attachTo(root) {
    const instance = new Permalinker(root);
    instance.initialize();
    return instance;
  }

  /** @private {number} */
  static get flashDurationMs_() {
    return 200;
  }

  /** @override */
  initialize() {
    this.root_.addEventListener('focusin', (evt) => {
      if (evt.target.classList.contains(classes.COMPONENT_SECTION_PERMALINK)) {
        evt.target.parentElement.classList.add(classes.COMPONENT_SECTION_HEADING_FOCUS_WITHIN);
      }
    });

    this.root_.addEventListener('focusout', (evt) => {
      if (evt.target.classList.contains(classes.COMPONENT_SECTION_PERMALINK)) {
        evt.target.parentElement.classList.remove(classes.COMPONENT_SECTION_HEADING_FOCUS_WITHIN);
      }
    });

    this.window_.addEventListener('hashchange', () => this.flashCurrentSection_());
    this.flashCurrentSection_();
  }

  // TODO(acdvorak): Replace page URL hash with current section on scroll
  /** @private */
  flashCurrentSection_() {
    const id = location.href.split('#')[1];
    if (!id) {
      return;
    }

    const anchor = this.document_.getElementById(id);
    if (!anchor) {
      return;
    }

    const section = pony.closest(anchor, `.${classes.COMPONENT_SECTION}`);
    if (!section) {
      return;
    }

    section.classList.add(classes.COMPONENT_SECTION_FLASH);
    setTimeout(() => {
      section.classList.remove(classes.COMPONENT_SECTION_FLASH);
    }, Permalinker.flashDurationMs_);
  }
}

class ThemePicker extends HotSwapper {
  /**
   * @param {!Element|!Document} root
   * @param {!ToolbarProvider} toolbarProvider
   */
  static attachTo(root, toolbarProvider) {
    const instance = new ThemePicker(root);
    instance.initialize(toolbarProvider);
    return instance;
  }

  /**
   * @param {!ToolbarProvider} toolbarProvider
   * @override
   */
  initialize(toolbarProvider) {
    /** @type {!ToolbarProvider} */
    this.toolbarProvider_ = toolbarProvider;

    /** @type {?Element} */
    this.themeMenuEl_ = this.getElementById_(ids.THEME_COLOR_MENU);

    this.registerThemeMenuOpenHandler_();
    this.registerThemeMenuChangeHandler_();
    this.registerUrlChangeHandler_();
    this.selectCurrentThemeInMenu_();
  }

  /** @private */
  registerThemeMenuOpenHandler_() {
    const menu = new mdc.menu.MDCSimpleMenu(this.themeMenuEl_);
    const actionEl = this.getElementById_(ids.THEME_COLOR_MENU_ACTION);
    actionEl.addEventListener('click', () => menu.open = !menu.open);
  }

  /** @private */
  registerThemeMenuChangeHandler_() {
    this.themeMenuEl_.addEventListener(events.MDC_SIMPLE_MENU_SELECTED, (evt) => {
      const safeNewTheme = getSafeDemoTheme(evt.detail.item.getAttribute(attributes.THEME_NAME));
      this.swapTheme_(safeNewTheme);
      this.pushHistoryState_(safeNewTheme);
    });
  }

  /** @private */
  registerUrlChangeHandler_() {
    this.window_.addEventListener('popstate', (evt) => {
      const getDefaultState = () => ({theme: getSafeDemoThemeFromUri()});
      const unsafeNewTheme = (evt.state || getDefaultState()).theme;
      const safeNewTheme = getSafeDemoTheme(unsafeNewTheme);
      this.swapTheme_(safeNewTheme);
    });
  }

  /** @private */
  pushHistoryState_(safeNewTheme) {
    const hash = this.window_.location.hash || '';
    const url = `?theme=${unwrapSafeDemoTheme(safeNewTheme) + hash}`;
    const data = {theme: unwrapSafeDemoTheme(safeNewTheme)};
    history.pushState(data, '', url);
  }

  /**
   * @param {!SafeTheme} safeNewTheme
   * @private
   */
  swapTheme_(safeNewTheme) {
    const oldLink = this.getElementById_(ids.THEME_STYLESHEET);
    const newUri = `/assets/theme/theme-${unwrapSafeDemoTheme(safeNewTheme)}.css`;
    this.hotSwapStylesheet_(oldLink, newUri);
    this.selectThemeInMenu_(safeNewTheme);
  }

  /** @private */
  selectCurrentThemeInMenu_() {
    this.selectThemeInMenu_(getSafeDemoThemeFromUri());
  }

  /**
   * @param {!SafeTheme} safeNewTheme
   * @private
   */
  selectThemeInMenu_(safeNewTheme) {
    const selectedMenuItemClass = classes.THEME_MENU_ITEM_SELECTED;
    const mdcListItemClass = classes.MDC_LIST_ITEM;
    const themeAttr = attributes.THEME_NAME;
    const menuActionId = ids.THEME_COLOR_MENU_ACTION;

    const unwrappedSafeNewTheme = unwrapSafeDemoTheme(safeNewTheme);
    const oldSelectedItems = dom.getAll(`.${selectedMenuItemClass}[${themeAttr}]`, this.themeMenuEl_);
    const newSelectedItem =
      this.themeMenuEl_.querySelector(`.${mdcListItemClass}[${themeAttr}="${unwrappedSafeNewTheme}"]`);

    oldSelectedItems.forEach((colorIcon) => colorIcon.classList.remove(selectedMenuItemClass));
    newSelectedItem.classList.add(selectedMenuItemClass);

    this.getElementById_(menuActionId).setAttribute(themeAttr, unwrappedSafeNewTheme);
  }
}

const initializers = {
  permalinker(root) {
    Permalinker.attachTo(root);
  },

  themePicker(root) {
    ThemePicker.attachTo(root, ToolbarProvider.attachTo(root));
  },

  button() {
    dom.getAll('.mdc-button').forEach((button) => {
      mdc.ripple.MDCRipple.attachTo(button);
    });
  },

  checkbox() {
    document.querySelector('#indeterminate-checkbox').indeterminate = true;

    document.querySelector('#checkbox-toggle--indeterminate').addEventListener('click', () => {
      const checkboxes = dom.getAll('.demo-checkbox-wrapper .mdc-checkbox__native-control');
      checkboxes.forEach(function(checkbox) {
        checkbox.indeterminate = !checkbox.indeterminate;
      });
    });

    document.querySelector('#checkbox-toggle--align-end').addEventListener('click', () => {
      const formFields = dom.getAll('.demo-checkbox-wrapper.mdc-form-field');
      formFields.forEach(function(formField) {
        formField.classList.toggle('mdc-form-field--align-end');
      });
    });
  },

  drawer() {
    const drawerEl = document.querySelector('.mdc-drawer--temporary');
    const drawer = new mdc.drawer.MDCTemporaryDrawer(drawerEl);

    dom.getAll('.demo-drawer-toggle').forEach((toggleElem) => {
      toggleElem.addEventListener('click', () => {
        drawer.open = true;
      });
    });

    drawerEl.addEventListener('MDCTemporaryDrawer:open', () => {
      console.log('Received MDCTemporaryDrawer:open');
    });

    drawerEl.addEventListener('MDCTemporaryDrawer:close', () => {
      console.log('Received MDCTemporaryDrawer:close');
    });
  },

  fab() {
    dom.getAll('.mdc-fab').forEach((fab) => {
      mdc.ripple.MDCRipple.attachTo(fab);
    });
  },

  iconToggle() {
    dom.getAll('.mdc-icon-toggle').forEach((iconToggleEl) => {
      mdc.iconToggle.MDCIconToggle.attachTo(iconToggleEl);
    });
  },

  linearProgress() {
    dom.getAll('.mdc-linear-progress').forEach((progressEl) => {
      const linearProgress = mdc.linearProgress.MDCLinearProgress.attachTo(progressEl);
      linearProgress.progress = 0.5;
      if (progressEl.dataset.buffer) {
        linearProgress.buffer = 0.75;
      }
    });
  },

  ripple() {
    dom.getAll('.mdc-ripple-surface').forEach((surface) => {
      mdc.ripple.MDCRipple.attachTo(surface);
    });
  },

  select() {
    dom.getAll('.mdc-select:not(select)').forEach((select) => {
      mdc.select.MDCSelect.attachTo(select);
    });
  },

  slider() {
    dom.getAll('.mdc-slider').forEach((slider) => {
      mdc.slider.MDCSlider.attachTo(slider);
    });
  },

  tab() {
    dom.getAll('.mdc-tab-bar').forEach((tabBar) => {
      mdc.tabs.MDCTabBar.attachTo(tabBar);
    });
  },

  textfield() {
    dom.getAll('.mdc-text-field').forEach((textField) => {
      mdc.textField.MDCTextField.attachTo(textField);
    });
  },

  radio() {
    dom.getAll('.mdc-form-field.demo-radio-form-field').forEach((formField) => {
      const formFieldInstance = new mdc.formField.MDCFormField(formField);
      const radio = formField.querySelector('.mdc-radio');
      if (radio) {
        formFieldInstance.input = new mdc.radio.MDCRadio(radio);
      }
    });
  },
};

demoReady(() => {
  const root = document;
  util.objectForEach(initializers, (initializer) => initializer(root));
});
