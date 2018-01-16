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

const attributes = {
  HOT_SWAP: 'data-hot',
};

const ids = {
  TOOLBAR_PROGRESS_BAR: 'demo-toolbar-progress-bar',
  RTL_ACTION: 'rtl-action',
};

/** @abstract */
export class InteractivityProvider {
  constructor(root) {
    /** @protected {!Element|!Document} */
    this.root_ = root;

    /** @protected {!Document} */
    this.document_ = this.root_.ownerDocument || this.root_;

    /** @protected {!Window} */
    this.window_ = this.document_.defaultView || this.document_.parentWindow;
  }

  initialize() {}

  /**
   * @param {string} id
   * @param {!Element|!Document=} opt_root
   * @return {?Element}
   * @protected
   */
  getElementById_(id, opt_root) {
    const root = opt_root || this.root_;
    return root.querySelector(`#${id}`);
  }

  /**
   * @param {string} selector
   * @param {!Element|!Document=} opt_root
   * @return {!Array<!Element>}
   * @protected
   */
  querySelectorAll_(selector, opt_root) {
    const root = opt_root || this.root_;
    return dom.getAll(selector, root);
  }
}

export class ToolbarProvider extends InteractivityProvider {
  /** @param {!Element|!Document} root */
  static attachTo(root) {
    const instance = new ToolbarProvider(root);
    instance.initialize();
    return instance;
  }

  /** @override */
  initialize() {
    /** @type {?Element} */
    this.progressBarEl_ = this.getElementById_(ids.TOOLBAR_PROGRESS_BAR);
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

export class HotSwapper extends InteractivityProvider {
  constructor(root) {
    super(root);

    /** @type {number} */
    this.numPending_ = 0;
  }

  /**
   * @param {!Element|!Document} root
   * @param {!ToolbarProvider} toolbarProvider
   */
  static attachTo(root, toolbarProvider) {
    const instance = new HotSwapper(root);
    instance.initialize(toolbarProvider);
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
  initialize(toolbarProvider) {
    /** @type {!ToolbarProvider} */
    this.toolbarProvider_ = toolbarProvider;

    /** @type {?Element} */
    this.rtlActionEl_ = this.getElementById_(ids.RTL_ACTION);

    this.registerRTLToggleHandler_();
    this.registerHotUpdateHandler_();
  }

  /** @private */
  registerRTLToggleHandler_() {
    if (!this.rtlActionEl_) {
      return;
    }
    this.rtlActionEl_.addEventListener('click', (evt) => this.toggleRTL_(evt));
  }

  /** @private */
  registerHotUpdateHandler_() {
    const hotSwapAllStylesheets = util.debounce(() => this.hotSwapAllStylesheets_(), HotSwapper.hotUpdateWaitPeriodMs_);
    this.window_.addEventListener('message', (evt) => {
      if (this.isWebpackRecompileStart_(evt)) {
        this.toolbarProvider_.setIsLoading(true);
      } else if (this.isWebpackRecompileEnd_(evt)) {
        hotSwapAllStylesheets();
      }
    });
  }

  isWebpackRecompileStart_(evt) {
    return Boolean(evt.data) && evt.data.type === 'webpackInvalid';
  }

  isWebpackRecompileEnd_(evt) {
    return typeof evt.data === 'string' && evt.data.indexOf('webpackHotUpdate') === 0;
  }

  /** @private */
  toggleRTL_(evt) {
    const el = this.document_.documentElement;
    if (el.getAttribute('dir') === 'rtl') {
      el.setAttribute('dir', 'ltr');
      evt.target.innerHTML = 'format_align_left';
    } else {
      el.setAttribute('dir', 'rtl');
      evt.target.innerHTML = 'format_align_right';
    }
  }

  /** @private */
  hotSwapAllStylesheets_() {
    dom.getAll(`link[${attributes.HOT_SWAP}]`, this.document_.head).forEach((link) => {
      this.hotSwapStylesheet_(link);
    });
  }

  /** @protected */
  hotSwapStylesheet_(oldLink, newUri) {
    // Remove query string from old URI
    const oldUri = (oldLink.getAttribute('href') || '').replace(/[?].*$/, '');

    // oldLink was probably detached from the DOM
    if (!oldUri) {
      return;
    }

    if (!newUri) {
      newUri = oldUri;
    }

    // Force IE 11 and Edge to bypass the cache and request a fresh copy of the CSS.
    newUri += `?timestamp=${Date.now()}`;

    const logHotSwap = (verb, trailingPunctuation) => {
      const swapMessage = `"${oldUri}"${newUri ? ` with "${newUri}"` : ''}`;
      console.log(`Hot ${verb} stylesheet ${swapMessage}${trailingPunctuation}`);
    };

    logHotSwap('swapping', '...');

    this.toolbarProvider_.setIsLoading(true);
    this.numPending_++;

    const newLink = oldLink.cloneNode(false);
    newLink.setAttribute('href', newUri);
    newLink.addEventListener('load', () => {
      logHotSwap('swapped', '!');

      setTimeout(() => {
        // Link has already been detached from the DOM. I'm not sure what causes this to happen; I've only seen it in
        // IE 11 and/or Edge so far, and only occasionally.
        if (!oldLink.parentNode) {
          return;
        }
        oldLink.parentNode.removeChild(oldLink);
      });

      this.numPending_--;
      if (this.numPending_ === 0) {
        this.toolbarProvider_.setIsLoading(false);
      }
    });

    oldLink.parentNode.insertBefore(newLink, oldLink);
  }
}

/** @param {!Element|!Document} root */
export function init(root) {
  HotSwapper.attachTo(root, ToolbarProvider.attachTo(root));
}
