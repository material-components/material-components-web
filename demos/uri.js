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
