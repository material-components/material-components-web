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
  function QueryString(map) {
    this.params_ = map;
  }

  QueryString.prototype.contains = function(key) {
    return key in this.params_;
  };

  QueryString.prototype.getFirst = function(key, opt_default) {
    var defaultValue = typeof opt_default === 'undefined' ? null : opt_default;
    var list = this.getAll(key);
    return list.length ? list[0] : defaultValue;
  };

  QueryString.prototype.getLast = function(key, opt_default) {
    var defaultValue = typeof opt_default === 'undefined' ? null : opt_default;
    var list = this.getAll(key);
    return list.length ? list[list.length - 1] : defaultValue;
  };

  QueryString.prototype.getAll = function(key, opt_default) {
    var defaultValue = typeof opt_default === 'undefined' ? [] : opt_default;
    return key in this.params_ ? this.params_[key] : defaultValue;
  };

  QueryString.parse = function(opt_uri) {
    var uri = typeof opt_uri === 'undefined' ? window.location.href : opt_uri;

    if (uri.indexOf('?') === -1) {
      return new QueryString({});
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

  window.parseQueryString = function(opt_uri) {
    return QueryString.parse(opt_uri);
  };
})();
