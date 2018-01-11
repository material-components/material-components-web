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

class Toolbarifier {
  constructor(root) {
    /** @type {!Document|!HTMLElement} */
    this.root_ = root;

    /** @type {!Document} */
    this.document_ = this.root_.ownerDocument || this.root_;

    /** @type {!Window} */
    this.window_ = this.document_.defaultView || this.document_.parentWindow;
  }

  setIsLoading(isLoading) {
    const barEl = this.root_.querySelector('#demo-toolbar-progress-bar');
    if (isLoading) {
      barEl.classList.add('demo-toolbar-progress-bar--active');
    } else {
      barEl.classList.remove('demo-toolbar-progress-bar--active');
    }
  }
}

class Permalinker {
  constructor(root) {
    /** @type {!Document|!HTMLElement} */
    this.root_ = root;

    /** @type {!Document} */
    this.document_ = this.root_.ownerDocument || this.root_;

    /** @type {!Window} */
    this.window_ = this.document_.defaultView || this.document_.parentWindow;
  }

  initialize() {
    this.root_.addEventListener('focusin', function(e) {
      if (e.target.classList.contains('demo-component-section__permalink')) {
        e.target.parentElement.classList.add('demo-component-section__heading--focus');
      }
    });
    this.root_.addEventListener('focusout', function(e) {
      if (e.target.classList.contains('demo-component-section__permalink')) {
        e.target.parentElement.classList.remove('demo-component-section__heading--focus');
      }
    });

    this.window_.addEventListener('hashchange', () => this.flashCurrentSection_());
    this.flashCurrentSection_();
  }

  flashCurrentSection_() {
    const id = location.href.split('#')[1];
    if (!id) {
      return;
    }
    const anchor = this.document_.getElementById(id);
    if (!anchor) {
      return;
    }
    const section = util.closest(anchor, '.demo-component-section');
    if (!section) {
      return;
    }
    section.classList.add('demo-component-section--flash');
    setTimeout(() => {
      section.classList.remove('demo-component-section--flash');
    }, 200);
  }
}

class Themer {
  constructor(root, toolbarifier) {
    /** @type {!Document|!HTMLElement} */
    this.root_ = root;

    /** @type {!Document} */
    this.document_ = this.root_.ownerDocument || this.root_;

    /** @type {!Window} */
    this.window_ = this.document_.defaultView || this.document_.parentWindow;

    /** @type {!Toolbarifier} */
    this.toolbarifier_ = toolbarifier;
  }

  initialize() {
    this.themeActionEl_ = this.root_.querySelector('#theme-color-action');
    this.themeMenuEl_ = this.root_.querySelector('#theme-color-menu');

    const themeMenu = new mdc.menu.MDCSimpleMenu(this.themeMenuEl_);

    this.themeActionEl_.addEventListener('click', () => {
      themeMenu.open = !themeMenu.open;
    });

    this.root_.querySelector('#rtl-action').addEventListener('click', (e) => {
      this.toggleRTL_(e);
    });

    this.themeMenuEl_.addEventListener('MDCSimpleMenu:selected', (e) => {
      this.swapTheme_(e.detail.item.getAttribute('data-theme'));
    });

    const hotSwapAllStylesheets = util.debounce(() => {
      this.hotSwapAllStylesheets_();
    }, 250);

    // TODO(acdvorak): Add IE 11 support?
    this.window_.addEventListener('message', (event) => {
      if (typeof event.data === 'string' && event.data.indexOf('webpackHotUpdate') === 0) {
        hotSwapAllStylesheets();
      }
    });

    this.window_.addEventListener('popstate', (event) => {
      const newTheme = (event.state || {theme: getDemoThemeFromUrl()}).theme;
      this.swapThemeImpl_(newTheme);
    });

    this.swapThemeImpl_(getDemoThemeFromUrl());
  }

  hotSwapAllStylesheets_() {
    util.getAll('link[data-hot]', this.document_.head).forEach((link) => {
      this.hotSwapStylesheet_(link);
    });
  }

  hotSwapStylesheet_(oldLink, newUrl) {
    // Don't reload the CSS if the user clicked on the current theme a second time.
    // TODO(acdvorak): Test this in all browsers.
    if (oldLink.getAttribute('href') === newUrl) {
      return;
    }

    const swapMessage = '"' + oldLink.getAttribute('href') + '"' + (newUrl ? ' with "' + newUrl + '"' : '');
    console.log('Hot swapping stylesheet ' + swapMessage + '...');

    this.toolbarifier_.setIsLoading(true);

    const newLink = oldLink.cloneNode(false);
    if (newUrl) {
      newLink.href = newUrl;
    }
    newLink.addEventListener('load', () => {
      console.log('Hot swapped stylesheet ' + swapMessage + '!');
      setTimeout(() => {
        // Already removed from DOM
        if (!oldLink.parentNode) {
          return;
        }
        oldLink.parentNode.removeChild(oldLink);
      }, 0);
      this.toolbarifier_.setIsLoading(false);
    });

    oldLink.parentNode.insertBefore(newLink, oldLink);
  }

  swapTheme_(newTheme) {
    const hash = this.window_.location.hash || '';
    history.pushState({theme: newTheme}, '', '?theme=' + newTheme + hash);
    this.swapThemeImpl_(newTheme);
  }

  swapThemeImpl_(newTheme) {
    // TODO(acdvorak): Centralize DEFAULT_THEME
    newTheme = newTheme || 'baseline';

    this.hotSwapStylesheet_(this.root_.querySelector('#theme-stylesheet'), '/assets/theme/theme-' + newTheme + '.css');

    const selectedItems = util.getAll('.demo-theme-menu__list-item--selected[data-theme]', this.themeMenuEl_);
    selectedItems.forEach((colorIcon) => {
      colorIcon.classList.remove('demo-theme-menu__list-item--selected');
    });
    this.root_.querySelector('.mdc-list-item[data-theme="' + newTheme + '"]')
      .classList.add('demo-theme-menu__list-item--selected');

    this.root_.querySelector('#theme-color-action').setAttribute('data-theme', newTheme);
  }

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
}

export function init() {
  new Permalinker(document).initialize();
  new Themer(document, new Toolbarifier(document)).initialize();
}
