/**
 * @license
 * Copyright 2017 Google Inc.
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

(function() {
  var TRUSTED_THEMES = ['baseline', 'black', 'dark', 'shrine'];
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

  /** @return {string} */
  SafeTheme.prototype.toString = function() {
    return 'SafeTheme{' + this.PRIVATE_SAFE_VALUE_ + '}';
  };

  function createSafeTheme(unsafeValue) {
    var safeValue = TRUSTED_THEMES.indexOf(unsafeValue) > -1 ? unsafeValue : DEFAULT_THEME;
    var safeTheme = new SafeTheme();
    safeTheme.PRIVATE_SAFE_VALUE_ = safeValue;
    return safeTheme;
  }

  /**
   * @param {string} unsafeThemeName
   * @return {!SafeTheme}
   */
  window.getSafeDemoTheme = function(unsafeThemeName) {
    return createSafeTheme(unsafeThemeName);
  };

  /**
   * @param {string=} uri
   * @return {!SafeTheme}
   */
  window.getSafeDemoThemeFromUri = function(uri) {
    return getSafeDemoTheme(parseQueryString(uri).getLast('theme'));
  };

  /**
   * @param {!SafeTheme} safeTheme
   * @return {string}
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
  var unwrappedThemeStr = unwrapSafeDemoTheme(getSafeDemoThemeFromUri());

  // Avoid a FOUC by injecting the stylesheet directly into the HTML stream while the browser is parsing the page.
  // This causes the browser to block page rendering until the CSS has finished loading.
  document.write(
    '<link rel="stylesheet" href="/assets/theme/theme-' + unwrappedThemeStr + '.css" id="theme-stylesheet" data-hot>');
})();
