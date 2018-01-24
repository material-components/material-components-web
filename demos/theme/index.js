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

import {HotSwapper, InteractivityProvider, ToolbarProvider, init as initInteractivity} from '../interactivity.js';
import * as dom from '../dom.js';
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
  MDC_MENU_SELECTED: 'MDCMenu:selected',
};

class Permalinker extends InteractivityProvider {
  /** @param {!Document|!Element} root */
  static attachTo(root) {
    const instance = new Permalinker(root);
    instance.lazyInit();
    return instance;
  }

  /** @private {number} */
  static get flashDurationMs_() {
    return 200;
  }

  /** @override */
  lazyInit() {
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

class ThemePicker extends InteractivityProvider {
  /**
   * @param {!Document|!Element} root
   * @param {!HotSwapper} hotSwapper
   * @param {!ToolbarProvider} toolbarProvider
   */
  static attachTo(root, hotSwapper, toolbarProvider) {
    const instance = new ThemePicker(root);
    instance.lazyInit(hotSwapper, toolbarProvider);
    return instance;
  }

  /**
   * @param {!HotSwapper} hotSwapper
   * @param {!ToolbarProvider} toolbarProvider
   * @override
   */
  lazyInit(hotSwapper, toolbarProvider) {
    /** @type {!HotSwapper} */
    this.hotSwapper_ = hotSwapper;

    /** @type {!ToolbarProvider} */
    this.toolbarProvider_ = toolbarProvider;

    /** @type {?Element} */
    this.themeMenuEl_ = this.root_.getElementById(ids.THEME_COLOR_MENU);

    this.registerThemeMenuOpenHandler_();
    this.registerThemeMenuChangeHandler_();
    this.registerUrlChangeHandler_();
    this.selectCurrentThemeInMenu_();
  }

  /** @private */
  registerThemeMenuOpenHandler_() {
    const menu = new mdc.menu.MDCMenu(this.themeMenuEl_);
    const actionEl = this.root_.getElementById(ids.THEME_COLOR_MENU_ACTION);
    actionEl.addEventListener('click', () => menu.open = !menu.open);
  }

  /** @private */
  registerThemeMenuChangeHandler_() {
    this.themeMenuEl_.addEventListener(events.MDC_MENU_SELECTED, (evt) => {
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

  /**
   * @param {!SafeTheme} safeNewTheme
   * @private
   */
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
    const oldLink = this.root_.getElementById(ids.THEME_STYLESHEET);
    const newUri = `/assets/theme/theme-${unwrapSafeDemoTheme(safeNewTheme)}.css`;
    this.hotSwapper_.hotSwapStylesheet(oldLink, newUri);
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

    this.root_.getElementById(menuActionId).setAttribute(themeAttr, unwrappedSafeNewTheme);
  }
}

demoReady((root) => {
  initInteractivity(root);
  Permalinker.attachTo(root);
  ThemePicker.attachTo(root, HotSwapper.getInstance(root), ToolbarProvider.attachTo(root));
});
