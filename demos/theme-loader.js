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

(function() {
  var TRUSTED_THEMES = ['baseline', 'black', 'dark', 'white', 'yellow'];
  var DEFAULT_THEME = TRUSTED_THEMES[0];
  var PRIVATE_TYPE_MARKER = {};

  /**
   * A strongly-typed wrapper around a string that is guaranteed to be safe to inject into HTML.
   * Inspired by the Closure library's SafeHtml class:
   * https://google.github.io/closure-library/api/goog.html.SafeHtml.html
   * @struct
   * @final
   * @private
   */
  function SafeTheme() {
    /** @type {!Object} */
    this.PRIVATE_TYPE_MARKER_ = PRIVATE_TYPE_MARKER;

    /** @type {string} */
    this.PRIVATE_SAFE_VALUE_ = '';
  }

  function createSafeTheme(safeValue) {
    var safeTheme = new SafeTheme();
    safeTheme.PRIVATE_SAFE_VALUE_ = safeValue;
    return safeTheme;
  }

  /**
   * @param {string} unsafeThemeName
   * @returns {!SafeTheme}
   */
  window.getSafeDemoTheme = function(unsafeThemeName) {
    if (TRUSTED_THEMES.indexOf(unsafeThemeName) > -1) {
      return createSafeTheme(unsafeThemeName);
    }
    return createSafeTheme(DEFAULT_THEME);
  };

  /**
   * @param {string|undefined=} opt_uri
   * @returns {!SafeTheme}
   */
  window.getSafeDemoThemeFromUri = function(opt_uri) {
    return getSafeDemoTheme(parseQueryString(opt_uri).getLast('theme'));
  };

  /**
   * @param {!SafeTheme} safeTheme
   * @returns {string}
   */
  window.unwrapSafeDemoTheme = function(safeTheme) {
    if (safeTheme instanceof SafeTheme &&
        safeTheme.constructor === SafeTheme &&
        safeTheme.PRIVATE_TYPE_MARKER_ === PRIVATE_TYPE_MARKER) {
      return safeTheme.PRIVATE_SAFE_VALUE_;
    }
    console.error('Expected object of type SafeTheme, but got', safeTheme);
    return 'type_error:SafeTheme';
  };

  /** @type {string} */
  var unwrappedSafeTheme = unwrapSafeDemoTheme(getSafeDemoThemeFromUri());

  // TODO(acdvorak): Is document.write necessary to block page rendering until the CSS loads? It's inherently unsafe;
  // would document.createElement('link') work instead?
  document.write(
    '<link rel="stylesheet" href="/assets/theme/theme-' + unwrappedSafeTheme + '.css" id="theme-stylesheet" data-hot>');
})();
