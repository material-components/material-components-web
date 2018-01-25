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

import * as dom from './dom.js';
import * as pony from './ponyfill.js';
import * as util from './util.js';

const classes = {
  TOOLBAR_PROGRESS_BAR_ACTIVE: 'demo-toolbar-progress-bar--active',
};

const attrs = {
  HOT_SWAP: 'data-hot',
  IS_LOADING: 'data-is-loading',
};

const ids = {
  TOOLBAR_PROGRESS_BAR: 'demo-toolbar-progress-bar',
};

/** @abstract */
export class InteractivityProvider {
  constructor(root) {
    /** @protected {!Document|!Element} */
    this.root_ = root;

    /** @protected {!Document} */
    this.document_ = dom.getDocument(this.root_);

    /** @protected {!Window} */
    this.window_ = dom.getWindow(this.root_);
  }

  lazyInit() {}

  /**
   * @param {string} selector
   * @param {!Document|!Element=} root
   * @return {!Array<!Element>}
   * @protected
   */
  querySelectorAll_(selector, root = this.root_) {
    return dom.getAll(selector, root);
  }
}

export class ToolbarProvider extends InteractivityProvider {
  /** @param {!Document|!Element} root */
  static attachTo(root) {
    const instance = new ToolbarProvider(root);
    instance.lazyInit();
    return instance;
  }

  /** @override */
  lazyInit() {
    /** @type {?Element} */
    this.progressBarEl_ = this.root_.getElementById(ids.TOOLBAR_PROGRESS_BAR);
  }

  /** @param {boolean} isLoading */
  setIsLoading(isLoading) {
    if (!this.progressBarEl_) {
      return;
    }

    if (isLoading) {
      this.progressBarEl_.classList.add(classes.TOOLBAR_PROGRESS_BAR_ACTIVE);
    } else {
      this.progressBarEl_.classList.remove(classes.TOOLBAR_PROGRESS_BAR_ACTIVE);
    }
  }
}

/** @type {?HotSwapper} */
let hotSwapperInstance = null;

export class HotSwapper extends InteractivityProvider {
  /**
   * @param {!Document|!Element} root
   * @param {!ToolbarProvider} toolbarProvider
   */
  static attachTo(root, toolbarProvider) {
    const instance = new HotSwapper(root);
    instance.lazyInit(toolbarProvider);
    return instance;
  }

  /** @private {number} */
  static get hotUpdateWaitPeriodMs_() {
    return 250;
  }

  /**
   * @param {!ToolbarProvider} toolbarProvider
   * @override
   */
  lazyInit(toolbarProvider) {
    /** @type {!ToolbarProvider} */
    this.toolbarProvider_ = toolbarProvider;

    /** @type {!Array<string>} */
    this.pendingRequests_ = [];

    this.registerHotUpdateHandler_();
  }

  /** @private */
  registerHotUpdateHandler_() {
    const hotSwapAllStylesheets = util.debounce(() => {
      this.hotSwapAllStylesheets_();
    }, HotSwapper.hotUpdateWaitPeriodMs_);

    this.window_.addEventListener('message', (evt) => {
      if (this.isWebpackRecompileStart_(evt)) {
        this.toolbarProvider_.setIsLoading(true);
      } else if (this.isWebpackRecompileEnd_(evt)) {
        hotSwapAllStylesheets();
      }
    });
  }

  /**
   * @param {!Event} evt
   * @return {boolean}
   * @private
   */
  isWebpackRecompileStart_(evt) {
    return Boolean(evt.data) && evt.data.type === 'webpackInvalid';
  }

  /**
   * @param {!Event} evt
   * @return {boolean}
   * @private
   */
  isWebpackRecompileEnd_(evt) {
    return typeof evt.data === 'string' && evt.data.indexOf('webpackHotUpdate') === 0;
  }

  /** @private */
  hotSwapAllStylesheets_() {
    this.querySelectorAll_(`link[${attrs.HOT_SWAP}]:not([${attrs.IS_LOADING}])`).forEach((link) => {
      this.hotSwapStylesheet(link);
    });
  }

  /**
   * @param {!Element} oldLink
   * @param {string=} newUri
   */
  hotSwapStylesheet(oldLink, newUri) {
    const oldUri = oldLink.getAttribute('href');

    // Reload existing stylesheet
    if (!newUri) {
      newUri = oldUri;
    }

    // Force IE 11 and Edge to bypass the cache and request a fresh copy of the CSS.
    newUri = this.bustCache_(newUri);

    this.swapItLikeItsHot_(oldLink, oldUri, newUri);
  }

  /**
   * @param {!Element} oldLink
   * @param {string} oldUri
   * @param {string} newUri
   * @private
   */
  swapItLikeItsHot_(oldLink, oldUri, newUri) {
    this.logHotSwap_('swapping', oldUri, newUri, '...');

    // Ensure that oldLink has a unique ID so we can remove all stale stylesheets from the DOM after newLink loads.
    // This is a more robust approach than holding a reference to oldLink and removing it directly, because a user might
    // quickly switch themes several times before the first stylesheet finishes loading (especially over a slow network)
    // and each new stylesheet would try to remove the first one, leaving multiple conflicting stylesheets in the DOM.
    if (!oldLink.id) {
      oldLink.id = `stylesheet-${Math.floor(Math.random() * Date.now())}`;
    }

    const newLink = /** @type {!Element} */ (oldLink.cloneNode(false));
    newLink.setAttribute('href', newUri);
    newLink.setAttribute(attrs.IS_LOADING, 'true');

    // IE 11 and Edge fire the `load` event twice for `<link>` elements.
    newLink.addEventListener('load', util.debounce(() => {
      this.handleStylesheetLoad_(newLink, newUri, oldUri);
    }, 50));

    oldLink.parentNode.insertBefore(newLink, oldLink);

    this.pendingRequests_.push(newUri);
    this.toolbarProvider_.setIsLoading(true);
  }

  /**
   * @param {!Element} newLink
   * @param {string} newUri
   * @param {string} oldUri
   * @private
   */
  handleStylesheetLoad_(newLink, newUri, oldUri) {
    this.pendingRequests_.splice(this.pendingRequests_.indexOf(newUri), 1);
    if (this.pendingRequests_.length === 0) {
      this.toolbarProvider_.setIsLoading(false);
    }

    setTimeout(() => {
      this.purgeOldStylesheets_(newLink);

      // Remove the 'loading' attribute *after* purging old stylesheets to avoid purging this one.
      newLink.removeAttribute(attrs.IS_LOADING);

      this.logHotSwap_('swapped', oldUri, newUri, '!');
    });
  }

  /**
   * @param {!Element} newLink
   * @private
   */
  purgeOldStylesheets_(newLink) {
    let oldLinks;

    const getOldLinks = () => this.querySelectorAll_(`link[id="${newLink.id}"]:not([${attrs.IS_LOADING}])`);

    while ((oldLinks = getOldLinks()).length > 0) {
      oldLinks.forEach((oldLink) => {
        // Link has already been detached from the DOM. I'm not sure what causes this to happen; I've only seen it in
        // IE 11 and/or Edge so far, and only occasionally.
        if (!oldLink.parentNode) {
          return;
        }
        oldLink.parentNode.removeChild(oldLink);
      });
    }
  }

  /**
   * Adds a timestamp to the given URI to force IE 11 and Edge to bypass the cache and request a fresh copy of the CSS.
   * @param oldUri
   * @return {string}
   * @private
   */
  bustCache_(oldUri) {
    const newUri = oldUri
      // Remove previous timestamp param (if present)
      .replace(/[?&]timestamp=\d+(&|$)/, '')
      // Remove trailing '?' or '&' char (if present)
      .replace(/[?&]$/, '');
    const separator = newUri.indexOf('?') === -1 ? '?' : '&';
    return `${newUri}${separator}timestamp=${Date.now()}`;
  }

  /**
   * @param {string} verb
   * @param {string} oldUri
   * @param {string} newUri
   * @param {string} trailingPunctuation
   * @private
   */
  logHotSwap_(verb, oldUri, newUri, trailingPunctuation) {
    const swapMessage = `"${oldUri}"${newUri ? ` with "${newUri}"` : ''}`;
    console.log(`Hot ${verb} stylesheet ${swapMessage}${trailingPunctuation}`);
  }

  /**
   * @param {!Document|!Element} root
   * @return {!HotSwapper}
   */
  static getInstance(root) {
    if (!hotSwapperInstance) {
      hotSwapperInstance = HotSwapper.attachTo(root, ToolbarProvider.attachTo(root));
    }
    return hotSwapperInstance;
  }
}

class HashLinker extends InteractivityProvider {
  /** @param {!Document|!Element} root */
  static attachTo(root) {
    const instance = new HashLinker(root);
    instance.lazyInit();
    return instance;
  }

  /** @override */
  lazyInit() {
    this.root_.addEventListener('click', (evt) => {
      if (this.shouldPreventDefault_(evt)) {
        evt.preventDefault();
      }
    });
  }

  /** @private */
  shouldPreventDefault_(evt) {
    return pony.closest(evt.target, 'a[href="#"], [data-demo-disable-hash-link-navigation] a[href^="#"]');
  }
}

/** @param {!Document|!Element} root */
export function init(root) {
  HotSwapper.getInstance(root);
  HashLinker.attachTo(root);
}
