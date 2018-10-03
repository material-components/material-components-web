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

require('url-search-params-polyfill');

const request = require('request-promise-native');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const ShieldState = mdcProto.ShieldState;

const CloudDatastore = require('../lib/cloud-datastore');

/**
 * @typedef {{
 *   color: string,
 *   message: string,
 *   targetUrl: ?string,
 *   shieldState: !mdc.proto.ShieldState,
 * }} ShieldConfig
 */

class ShieldGenerator {
  constructor() {
    /**
     * @type {!CloudDatastore}
     * @private
     */
    this.cloudDatastore_ = new CloudDatastore();

    /**
     * @type {!Map<string, string>}
     * @private
     */
    this.svgCache_ = new Map();
  }

  async handleSvgRequest(req, res) {
    this.setResponseHeaders_(req, res);

    // Send response to OPTIONS requests and terminate function execution.
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    /** @type {!ShieldConfig} */
    const config = await this.getShieldConfig_(req);
    const {message, color, targetUrl} = config;

    // Dashes and underscores are special reserved characters in shield.io URLs (dashes are used as URL separators and
    // underscores get converted to spaces). To render a literal dash or underscore character, you need to escape it by
    // passing two of them.
    const messageEncoded = encodeURI(message.replace(/-/g, '--').replace(/_/g, '__'));

    let svgUrl = `https://img.shields.io/badge/screenshots-${messageEncoded}-${color}.svg`;
    if (targetUrl) {
      svgUrl += `?link=${targetUrl}`;
    }

    try {
      const svgResponse = await this.fetchSVG_(svgUrl);
      res.set('Content-Type', 'image/svg+xml;charset=utf-8');
      res.send(svgResponse);
    } catch (err) {
      res.set('Content-Type', 'text/plain;charset=utf-8');
      res.send(500, err);
    }
  }

  async handleUrlRequest(req, res) {
    this.setResponseHeaders_(req, res);

    // Send response to OPTIONS requests and terminate function execution.
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    /** @type {!ShieldConfig} */
    const config = await this.getShieldConfig_(req);
    const {targetUrl} = config;
    if (targetUrl) {
      this.redirect_(req, res, targetUrl, /* addAnalytics */ true);
    } else {
      this.redirect_(req, res, 'https://github.com/material-components/material-components-web');
    }
  }

  /**
   * @param {{url: string}} req
   * @return {!Promise<!ShieldConfig>}
   * @private
   */
  async getShieldConfig_(req) {
    const query = require('url').parse(req.url).query;
    const params = new URLSearchParams(query);

    const gitRef = this.getGitRef_(params.get('ref'));
    const shieldState = this.getShieldState_(params.get('state'));

    return await this.getShieldConfigFromDatastore_(gitRef, shieldState);
  }

  /**
   * @param {?string} gitRefParam
   * @return {string}
   * @private
   */
  getGitRef_(gitRefParam) {
    return gitRefParam || 'master';
  }

  /**
   * @param {?string} shieldStateParam
   * @return {?mdc.proto.ShieldState}
   * @private
   */
  getShieldState_(shieldStateParam) {
    if (!shieldStateParam) {
      return ShieldState.PASSED;
    }
    if (shieldStateParam === '*' || shieldStateParam === 'any' || shieldStateParam === 'all') {
      return null;
    }
    return ShieldState[shieldStateParam.toUpperCase()];
  }

  /**
   * @param {string} gitRef
   * @param {?mdc.proto.ShieldState} reqShieldState
   * @return {!Promise<!ShieldConfig>}
   * @private
   */
  async getShieldConfigFromDatastore_(gitRef, reqShieldState) {
    // TODO(acdvorak): Return the first terminal status (passed, failed, error) by default instead of just "passed".
    /** @type {?CloudStatus} */
    const cloudStatus = await this.cloudDatastore_.getStatus(gitRef, reqShieldState);

    if (!cloudStatus) {
      return {
        color: 'lightgrey',
        message: 'unknown',
        targetUrl: null,
        shieldState: ShieldState.UNKNOWN,
      };
    }

    const actualShieldState = cloudStatus.state;
    const targetUrl = cloudStatus.target_url;
    const numDone = cloudStatus.num_screenshots_finished;
    const numTotal = cloudStatus.num_screenshots_total;
    const numDiffs = cloudStatus.num_diffs;
    const numPercent = numTotal > 0 ? (100 * numDone / numTotal) : 0;

    const strTotal = numTotal.toLocaleString();
    const strDiffs = numDiffs.toLocaleString();
    const strPercent = `${Math.floor(numPercent)}%`;

    const pluralDiffs = numDiffs === 1 ? '' : 's';

    if (actualShieldState === ShieldState.PASSED) {
      return {
        color: 'brightgreen',
        message: `${strTotal} pass`,
        targetUrl,
        shieldState: actualShieldState,
      };
    }

    if (actualShieldState === ShieldState.FAILED) {
      return {
        color: 'red',
        message: `${strDiffs} diff${pluralDiffs}`,
        targetUrl,
        shieldState: actualShieldState,
      };
    }

    if (actualShieldState === ShieldState.ERROR) {
      return {
        color: 'red',
        message: 'error',
        targetUrl,
        shieldState: actualShieldState,
      };
    }

    if (actualShieldState === ShieldState.RUNNING || actualShieldState === ShieldState.INITIALIZING) {
      return {
        color: numDiffs > 0 ? 'red' : 'yellow',
        message: `${strPercent} - ${numDiffs} diff${pluralDiffs}`,
        targetUrl,
        shieldState: actualShieldState,
      };
    }

    return {
      color: 'lightgrey',
      message: 'unknown',
      targetUrl,
      shieldState: actualShieldState,
    };
  }

  /**
   * @param {string} url
   * @return {!Promise<string>}
   * @private
   */
  async fetchSVG_(url) {
    if (!this.svgCache_.has(url)) {
      const svg = await request({method: 'GET', uri: url});
      console.log('svg:', svg);
      this.svgCache_.set(url, svg);
    }
    return this.svgCache_.get(url);
  }

  setResponseHeaders_(req, res) {
    // Prevent GitHub Camo from caching images.
    // See https://github.com/github/markup/issues/224#issuecomment-33454537
    res.set('Cache-Control', 'no-cache');
    res.set('Expires', '0');
    res.set('Vary', 'Accept-Encoding');
  }

  redirect_(req, res, destinationUrl, addAnalytics) {
    const destQueryString = require('url').parse(destinationUrl).query;
    const destQueryParams = new URLSearchParams(destQueryString);
    const reqQueryString = require('url').parse(req.url).query;
    const reqQueryParams = new URLSearchParams(reqQueryString);

    const resQueryParams = new URLSearchParams();
    for (const [key, value] of destQueryParams) {
      resQueryParams.set(key, value);
    }
    for (const [key, value] of reqQueryParams) {
      resQueryParams.set(key, value);
    }

    resQueryParams.delete('ref');
    resQueryParams.delete('max');
    resQueryParams.delete('type');
    resQueryParams.delete('latest');

    if (addAnalytics) {
      resQueryParams.set('utm_source', 'github');
      resQueryParams.set('utm_medium', 'shield');
    }

    const resQueryString = resQueryParams.toString() ? `?${resQueryParams.toString()}` : '';
    const redirectUrl = destinationUrl.replace(/\?.*$/, '') + resQueryString;
    res.redirect(redirectUrl);
  }
}

module.exports = ShieldGenerator;
