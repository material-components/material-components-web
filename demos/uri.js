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
  /**
   * @param {!Object=} map
   * @constructor
   */
  function QueryString(map) {
    this.params_ = map || {};
  }

  /**
   * @param {string} key
   * @return {boolean}
   */
  QueryString.prototype.contains = function(key) {
    return key in this.params_;
  };

  /**
   * @param {string} key
   * @param {string=} defaultIfNotPresent
   * @return {?string}
   */
  QueryString.prototype.getFirst = function(key, defaultIfNotPresent) {
    var defaultValue = typeof defaultIfNotPresent === 'undefined' ? null : defaultIfNotPresent;
    var list = this.getAll(key);
    return list.length ? list[0] : defaultValue;
  };

  /**
   * @param {string} key
   * @param {string=} defaultIfNotPresent
   * @return {?string}
   */
  QueryString.prototype.getLast = function(key, defaultIfNotPresent) {
    var defaultValue = typeof defaultIfNotPresent === 'undefined' ? null : defaultIfNotPresent;
    var list = this.getAll(key);
    return list.length ? list[list.length - 1] : defaultValue;
  };

  /**
   * @param {string} key
   * @param {string=} defaultIfNotPresent
   * @return {!Array<string>}
   */
  QueryString.prototype.getAll = function(key, defaultIfNotPresent) {
    var defaultValue = typeof defaultIfNotPresent === 'undefined' ? [] : defaultIfNotPresent;
    return key in this.params_ ? this.params_[key] : defaultValue;
  };

  /**
   * @param {string=} uri
   * @return {!QueryString}
   */
  QueryString.parse = function(uri) {
    uri = typeof uri === 'undefined' ? window.location.href : uri;

    if (uri.indexOf('?') === -1) {
      return new QueryString();
    }

    var qsList = uri
      // Remove the first '?' character and everything before it
      .replace(/^.*[?]/, '')
      // Remove the first '#' character and everything after it
      .replace(/#.*$/, '')
      // Split entire query string into an array of 'key=value' strings
      .split('&');

    var qsMap = {};
    qsList.forEach(function(query) {
      var split = query.split('=');
      var key = split[0].replace(/\[\]$/, ''); // Remove trailing '[]', if present
      var value = decodeURIComponent((split[1] || '').replace(/[+]/g, ' '));
      if (!(key in qsMap)) {
        qsMap[key] = [];
      }
      qsMap[key].push(value);
    });

    return new QueryString(qsMap);
  };

  /**
   * @param {string=} uri
   * @return {!QueryString}
   */
  window.parseQueryString = function(uri) {
    return QueryString.parse(uri);
  };
})();
