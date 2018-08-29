/**
 * @license
 * Copyright 2018 Google Inc.
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

'use strict';

require('url-search-params-polyfill');

class Analytics {
  /**
   * See:
   * - https://support.google.com/analytics/answer/1033863?hl=en
   * - https://ga-dev-tools.appspot.com/campaign-url-builder/
   * @param {string} url
   * @param {string} source
   * @param {string|undefined=} type
   * @param {string|undefined=} campaign
   * @param {string|undefined=} medium
   * @param {!Object<string, string>|undefined=} extraParams
   * @return {string}
   */
  getUrl({
    url,
    source,
    type = undefined,
    campaign = undefined,
    medium = undefined,
    extraParams = undefined,
  } = {}) {
    const [resource, oldQuery] = url.split('?');
    const params = new URLSearchParams(oldQuery);
    params.set('utm_source', source);
    if (type) {
      params.set('utm_content', type);
    }
    if (campaign) {
      params.set('utm_campaign', campaign);
    }
    if (medium) {
      params.set('utm_medium', medium);
    }
    if (extraParams) {
      for (const [key, value] of Object.entries(extraParams)) {
        params.set(key, value);
      }
    }
    const newQuery = params.toString();
    if (!newQuery) {
      return resource;
    }
    return `${resource}?${newQuery}`;
  }
}

module.exports = Analytics;
