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

const octokit = require('@octokit/rest');

/**
 * @typedef {{
 *   state: ?string,
 *   color: string,
 *   message: string,
 *   targetUrl: ?string,
 * }} GitHubStatusInfo
 */

class ScreenshotShieldServer {
  constructor() {
    this.octokit_ = octokit();
  }

  /** @private */
  allowCORS_(req, res) {
    // Set CORS headers
    // e.g. allow GETs from any origin with the Content-Type header
    // and cache preflight response for an 3600s
    res.set('Access-Control-Allow-Origin', '*.github.com');
    // res.set('Access-Control-Allow-Origin', '*'); // TODO(acdvorak)
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    // Send response to OPTIONS requests and terminate the function execution
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
    }
  }

  /**
   * @return {!Promise<!GitHubStatusInfo>}
   * @private
   */
  async parseGitHubStatus_(req) {
    const reqQueryString = require('url').parse(req.url).query;
    const reqQueryParams = new URLSearchParams(reqQueryString);
    const ref = reqQueryParams.get('ref') || 'master';

    const response = await this.octokit_.repos.getCombinedStatusForRef({
      owner: 'material-components',
      repo: 'material-components-web',
      ref,
    });

    const isButterBot = (status) => status.context === 'screenshot-test/butter-bot';
    const butterBotStatus = response.data.statuses.filter(isButterBot)[0];
    if (!butterBotStatus) {
      return {
        state: null,
        color: 'lightgrey',
        message: 'unknown',
        targetUrl: null,
      };
    }

    /** @type {string} */
    const state = butterBotStatus.state;

    /** @type {string} */
    const targetUrl = butterBotStatus.target_url;

    /** @type {string} */
    const desc = butterBotStatus.description;

    const [, strPassed] = (/All (\d+) screenshots match/.exec(desc) || []);
    const numPassed = parseInt(strPassed, 10);
    if (isFinite(numPassed)) {
      return {
        state,
        color: 'brightgreen',
        message: `${numPassed} pass`,
        targetUrl,
      };
    }

    const [, strDiffsSoFar] = (/(\d+) diffs?/.exec(desc) || []);
    const numDiffsSoFar = parseInt(strDiffsSoFar, 10);
    if (isFinite(numDiffsSoFar)) {
      return {
        state,
        color: 'red',
        message: `${numDiffsSoFar} diff${numDiffsSoFar === 1 ? '' : 's'}`,
        targetUrl,
      };
    }

    const [, strDiffsTotal] = (/(\d+) screenshots? differ/.exec(desc) || []);
    const numDiffsTotal = parseInt(strDiffsTotal, 10);
    if (isFinite(numDiffsTotal)) {
      return {
        state,
        color: 'red',
        message: `${numDiffsTotal} diff${numDiffsTotal === 1 ? '' : 's'}`,
        targetUrl,
      };
    }

    if (state === 'error') {
      return {
        state,
        color: 'red',
        message: 'error',
        targetUrl,
      };
    }

    if (state === 'failure') {
      return {
        state,
        color: 'red',
        message: 'failure',
        targetUrl,
      };
    }
  }

  async handleShieldRequest(req, res) {
    this.allowCORS_(req, res);

    /** @type {!GitHubStatusInfo} */
    const status = await this.parseGitHubStatus_(req);
    const {message, color} = status;
    const messageEncoded = encodeURI(message);
    this.redirect_(req, res, `https://img.shields.io/badge/screenshots-${messageEncoded}-${color}.svg`);
  }

  async handleUrlRequest(req, res) {
    this.allowCORS_(req, res);

    /** @type {!GitHubStatusInfo} */
    const status = await this.parseGitHubStatus_(req);
    const {targetUrl} = status;
    if (targetUrl) {
      this.redirect_(req, res, targetUrl);
    } else {
      this.redirect_(req, res, 'https://github.com/material-components/material-components-web');
    }
  }

  redirect_(req, res, destinationUrl) {
    const destQueryString = require('url').parse(destinationUrl).query;
    const destQueryParams = new URLSearchParams(destQueryString);
    const reqQueryString = require('url').parse(req.url).query;
    const reqQueryParams = new URLSearchParams(reqQueryString);

    const resQueryParams = new URLSearchParams();
    for (const [key, value] of destQueryParams) {
      resQueryParams.append(key, value);
    }
    for (const [key, value] of reqQueryParams) {
      resQueryParams.append(key, value);
    }

    const resQueryString = resQueryParams.toString() ? `?${resQueryParams.toString()}` : '';
    const redirectUrl = destinationUrl.replace(/\?.*$/, '') + resQueryString;
    res.redirect(redirectUrl);
  }
}

const screenshotShieldServer = new ScreenshotShieldServer();

exports.screenshotShieldSvg = (req, res) => screenshotShieldServer.handleShieldRequest(req, res);
exports.screenshotShieldUrl = (req, res) => screenshotShieldServer.handleUrlRequest(req, res);
