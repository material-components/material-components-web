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

import * as util from './util.js';

const classes = {
  MDC_LIST_ITEM: 'mdc-list-item',
  TOOLBAR_PROGRESS_BAR_ACTIVE: 'demo-toolbar-progress-bar--active',
  THEME_MENU_ITEM_SELECTED: 'demo-theme-menu__list-item--selected',
  COMPONENT_SECTION: 'demo-component-section',
  COMPONENT_SECTION_FLASH: 'demo-component-section--flash',
  COMPONENT_SECTION_PERMALINK: 'demo-component-section__permalink',
  COMPONENT_SECTION_HEADING_FOCUS_WITHIN: 'demo-component-section__heading--focus-within',
};

const attributes = {
  DATA_THEME: 'data-theme',
};

const ids = {
  THEME_STYLESHEET: 'theme-stylesheet',
  TOOLBAR_PROGRESS_BAR: 'demo-toolbar-progress-bar',
  RTL_ACTION: 'rtl-action',
  THEME_COLOR_MENU: 'theme-color-menu',
  THEME_COLOR_MENU_ACTION: 'theme-color-action',
};

const events = {
  MDC_SIMPLE_MENU_SELECTED: 'MDCSimpleMenu:selected',
};

class InteractivityManager {
  constructor(root) {
    /** @protected {!Document|!Element} */
    this.root_ = root;

    /** @protected {!Document} */
    this.document_ = this.root_.ownerDocument || this.root_;

    /** @protected {!Window} */
    this.window_ = this.document_.defaultView || this.document_.parentWindow;
  }

  initialize() {}

  /**
   * @param {string} id
   * @param {!Document|!Element=} opt_root
   * @protected
   */
  getElementById_(id, opt_root) {
    const root = opt_root || this.root_;
    return root.querySelector(`#${id}`);
  }
}

class ToolbarManager extends InteractivityManager {
  /** @param {!Document|!Element} root */
  static attachTo(root) {
    const instance = new ToolbarManager(root);
    instance.initialize();
    return instance;
  }

  /** @override */
  initialize() {
    this.progressBarEl_ = this.getElementById_(ids.TOOLBAR_PROGRESS_BAR);
  }

  /** @param {boolean} isLoading */
  setIsLoading(isLoading) {
    if (isLoading) {
      this.progressBarEl_.classList.add(classes.TOOLBAR_PROGRESS_BAR_ACTIVE);
    } else {
      this.progressBarEl_.classList.remove(classes.TOOLBAR_PROGRESS_BAR_ACTIVE);
    }
  }
}

class Permalinker extends InteractivityManager {
  /** @param {!Document|!Element} root */
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
    this.root_.addEventListener('focusin', function(e) {
      if (e.target.classList.contains(classes.COMPONENT_SECTION_PERMALINK)) {
        e.target.parentElement.classList.add(classes.COMPONENT_SECTION_HEADING_FOCUS_WITHIN);
      }
    });

    this.root_.addEventListener('focusout', function(e) {
      if (e.target.classList.contains(classes.COMPONENT_SECTION_PERMALINK)) {
        e.target.parentElement.classList.remove(classes.COMPONENT_SECTION_HEADING_FOCUS_WITHIN);
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

    const section = util.closest(anchor, `.${classes.COMPONENT_SECTION}`);
    if (!section) {
      return;
    }

    section.classList.add(classes.COMPONENT_SECTION_FLASH);
    setTimeout(() => {
      section.classList.remove(classes.COMPONENT_SECTION_FLASH);
    }, Permalinker.flashDurationMs_);
  }
}

class Themer extends InteractivityManager {
  /**
   * @param {!Document|!Element} root
   * @param {!ToolbarManager} toolbarManager
   */
  static attachTo(root, toolbarManager) {
    const instance = new Themer(root);
    instance.initialize(toolbarManager);
    return instance;
  }

  /** @private {number} */
  static get hotUpdateWaitPeriodMs_() {
    return 250;
  }

  /**
   * @param {!ToolbarManager} toolbarManager
   * @override
   */
  initialize(toolbarManager) {
    this.toolbarManager_ = toolbarManager;
    this.themeMenuEl_ = this.getElementById_(ids.THEME_COLOR_MENU);

    this.registerRTLToggleHandler_();
    this.registerThemeMenuOpenHandler_();
    this.registerThemeMenuChangeHandler_();
    this.registerHotUpdateHandler_();
    this.registerUrlChangeHandler_();
    this.selectCurrentThemeInMenu_();
  }

  /** @private */
  registerRTLToggleHandler_() {
    this.getElementById_(ids.RTL_ACTION).addEventListener('click', (e) => {
      this.toggleRTL_(e);
    });
  }

  /** @private */
  registerThemeMenuOpenHandler_() {
    const menu = new mdc.menu.MDCSimpleMenu(this.themeMenuEl_);
    const actionEl = this.getElementById_(ids.THEME_COLOR_MENU_ACTION);
    actionEl.addEventListener('click', () => {
      menu.open = !menu.open;
    });
  }

  /** @private */
  registerThemeMenuChangeHandler_() {
    this.themeMenuEl_.addEventListener(events.MDC_SIMPLE_MENU_SELECTED, (e) => {
      const safeNewTheme = getSafeDemoTheme(e.detail.item.getAttribute(attributes.DATA_THEME));
      this.swapTheme_(safeNewTheme);
      this.pushHistoryState_(safeNewTheme);
    });
  }

  /** @private */
  registerHotUpdateHandler_() {
    const hotSwapAllStylesheets = util.debounce(() => this.hotSwapAllStylesheets_(), Themer.hotUpdateWaitPeriodMs_);

    // TODO(acdvorak): Add IE 11 support?
    this.window_.addEventListener('message', (event) => {
      if (typeof event.data === 'string' && event.data.indexOf('webpackHotUpdate') === 0) {
        hotSwapAllStylesheets();
      }
    });
  }

  /** @private */
  registerUrlChangeHandler_() {
    this.window_.addEventListener('popstate', (event) => {
      const getDefaultState = () => ({theme: getSafeDemoThemeFromUri()});
      const unsafeNewTheme = (event.state || getDefaultState()).theme;
      const safeNewTheme = getSafeDemoTheme(unsafeNewTheme);
      this.swapTheme_(safeNewTheme);
    });
  }

  /** @private */
  toggleRTL_(e) {
    const docEl = this.document_.documentElement;
    if (docEl.getAttribute('dir') === 'rtl') {
      docEl.setAttribute('dir', 'ltr');
      e.target.innerHTML = 'format_align_left';
    } else {
      docEl.setAttribute('dir', 'rtl');
      e.target.innerHTML = 'format_align_right';
    }
  }

  /** @private */
  hotSwapAllStylesheets_() {
    util.getAll('link[data-hot]', this.document_.head).forEach((link) => {
      this.hotSwapStylesheet_(link);
    });
  }

  /** @private */
  hotSwapStylesheet_(oldLink, newUri) {
    // Don't reload the CSS if the user clicked on the current theme a second time.
    // TODO(acdvorak): Test this in all browsers.
    if (oldLink.getAttribute('href') === newUri) {
      return;
    }

    const swapMessage = `"${oldLink.getAttribute('href')}"${newUri ? ` with "${newUri}"` : ''}`;
    console.log(`Hot swapping stylesheet ${swapMessage}...`);

    this.toolbarManager_.setIsLoading(true);

    const newLink = oldLink.cloneNode(false);
    if (newUri) {
      newLink.href = newUri;
    }
    newLink.addEventListener('load', () => {
      console.log(`Hot swapped stylesheet ${swapMessage}!`);
      setTimeout(() => {
        // Already removed from DOM
        if (!oldLink.parentNode) {
          return;
        }
        oldLink.parentNode.removeChild(oldLink);
      });
      this.toolbarManager_.setIsLoading(false);
    });

    oldLink.parentNode.insertBefore(newLink, oldLink);
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
    const themeAttr = attributes.DATA_THEME;
    const menuActionId = ids.THEME_COLOR_MENU_ACTION;

    const unwrappedSafeNewTheme = unwrapSafeDemoTheme(safeNewTheme);
    const oldSelectedItems = util.getAll(`.${selectedMenuItemClass}[${themeAttr}]`, this.themeMenuEl_);
    const newSelectedItem =
      this.themeMenuEl_.querySelector(`.${mdcListItemClass}[${themeAttr}="${unwrappedSafeNewTheme}"]`);

    oldSelectedItems.forEach((colorIcon) => colorIcon.classList.remove(selectedMenuItemClass));
    newSelectedItem.classList.add(selectedMenuItemClass);

    this.getElementById_(menuActionId).setAttribute(themeAttr, unwrappedSafeNewTheme);
  }
}

/** @param {!Document|!Element} root */
export function init(root) {
  Permalinker.attachTo(root);
  Themer.attachTo(root, ToolbarManager.attachTo(root));
}
