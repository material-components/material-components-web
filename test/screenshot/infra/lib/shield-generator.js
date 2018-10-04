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

const CloudDatastore = require('../lib/cloud-datastore');
const {ShieldState} = require('../types/status-types');

/**
 * @typedef {{
 *   color: string,
 *   message: string,
 *   targetUrl: ?string,
 *   shieldState: !ShieldState,
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
    svgUrl = this.mergeUrlParams_(req, svgUrl, /* addAnalytics */ false);

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
    const targetUrl = config.targetUrl || 'https://github.com/material-components/material-components-web';
    const addAnalytics = targetUrl.includes('report/report.html');
    this.redirect_(req, res, targetUrl, addAnalytics);
  }

  /**
   * @param {{url: string}} req
   * @return {!Promise<!ShieldConfig>}
   * @private
   */
  async getShieldConfig_(req) {
    const query = require('url').parse(req.url).query;
    const params = new URLSearchParams(query);
    const getLastParam = (key) => {
      const all = params.getAll(key);
      return all[all.length - 1];
    };

    const gitRef = this.getGitRef_(getLastParam('ref'));
    const shieldState = this.getShieldState_(getLastParam('state'));

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
   * @return {?ShieldState}
   * @private
   */
  getShieldState_(shieldStateParam) {
    if (!shieldStateParam) {
      return ShieldState.META_TERMINAL_STATE;
    }
    if (shieldStateParam === '*' || shieldStateParam === 'any' || shieldStateParam === 'all') {
      return null;
    }
    return ShieldState[shieldStateParam.toUpperCase()];
  }

  /**
   * @param {string} gitRef
   * @param {?ShieldState} reqShieldState
   * @return {!Promise<!ShieldConfig>}
   * @private
   */
  async getShieldConfigFromDatastore_(gitRef, reqShieldState) {
    // TODO(acdvorak): Return the first terminal status (passed, failed, error) by default instead of just "passed".
    /** @type {?DatastoreScreenshotStatus} */
    const datastoreScreenshotStatus = await this.cloudDatastore_.getScreenshotStatus(gitRef, reqShieldState);

    if (!datastoreScreenshotStatus) {
      return {
        color: 'lightgrey',
        message: 'unknown',
        targetUrl: null,
        shieldState: ShieldState.UNKNOWN,
      };
    }

    const actualShieldState = datastoreScreenshotStatus.state;
    const targetUrl = datastoreScreenshotStatus.target_url;
    const numDone = datastoreScreenshotStatus.num_screenshots_finished;
    const numTotal = datastoreScreenshotStatus.num_screenshots_total;
    const numDiffs = datastoreScreenshotStatus.num_diffs;
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

    if (actualShieldState === ShieldState.RUNNING || actualShieldState === ShieldState.STARTING) {
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

  /**
   * @param {{url: string}} req
   * @param {{redirect: function(string)}} res
   * @param {string} destinationUrl
   * @param {boolean} addAnalytics
   * @return {string}
   * @private
   */
  redirect_(req, res, destinationUrl, addAnalytics) {
    res.redirect(this.mergeUrlParams_(req, destinationUrl, addAnalytics));
  }

  /**
   * @param {{url: string}} req
   * @param {string} destinationUrl
   * @param {boolean} addAnalytics
   * @return {string}
   * @private
   */
  mergeUrlParams_(req, destinationUrl, addAnalytics) {
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
    resQueryParams.delete('state');

    if (addAnalytics) {
      resQueryParams.set('utm_source', 'github');
      resQueryParams.set('utm_medium', 'shield');
    }

    const resQueryString = resQueryParams.toString() ? `?${resQueryParams.toString()}` : '';
    return destinationUrl.replace(/\?.*$/, '') + resQueryString;
  }
}

module.exports = ShieldGenerator;
