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
    res.set('Access-Control-Allow-Origin', '*.github.com');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Max-Age', '3600');

    // Prevent GitHub Camo from caching images
    // https://github.com/github/markup/issues/224#issuecomment-33454537
    res.set('Cache-Control', 'no-cache');
    res.set('Expires', '0');

    // Send response to OPTIONS requests and terminate the function execution
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
    }
  }

  /**
   * @param {{url: string}} req
   * @return {!Promise<!GitHubStatusInfo>}
   * @private
   */
  async parseGitHubStatus_(req) {
    const reqQueryString = require('url').parse(req.url).query;
    const reqQueryParams = new URLSearchParams(reqQueryString);
    const ref = reqQueryParams.get('ref') || 'master';

    let statusResponse;
    try {
      statusResponse = await this.octokit_.repos.getCombinedStatusForRef({
        owner: 'material-components',
        repo: 'material-components-web',
        ref,
      });
    } catch (err) {
      return {
        state: null,
        color: 'lightgrey',
        message: '404 not found',
        targetUrl: null,
      };
    }

    const isButterBot = (status) => status.context === 'screenshot-test/butter-bot';
    const butterBotStatus = statusResponse.data.statuses.filter(isButterBot)[0];
    if (!butterBotStatus) {
      return {
        state: 'pending',
        color: 'lightgrey',
        message: 'pending',
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

    // E.g.: desc = "87 of 581 (15.0%) - 0 diffs"
    // eslint-disable-next-line no-unused-vars
    const [, strDone, strTotal, strPercent, strDiffsSoFar] =
      (/(\d+) of (\d+) \(([\d.]+%)\) - (\d+) diffs?/.exec(desc) || []);
    const numDiffsSoFar = parseInt(strDiffsSoFar, 10);
    if (isFinite(numDiffsSoFar)) {
      const flooredPercent = parseInt(strPercent, 10) + '%';
      const message = `${flooredPercent} - ${numDiffsSoFar} diff${numDiffsSoFar === 1 ? '' : 's'}`;
      return {
        state: 'running',
        color: numDiffsSoFar === 0 ? 'yellow' : 'red',
        message,
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
    const messageEncoded = encodeURI(message.replace(/-/g, '--').replace(/_/g, '__'));
    this.redirect_(req, res, `https://img.shields.io/badge/screenshots-${messageEncoded}-${color}.svg`);
  }

  async handleUrlRequest(req, res) {
    this.allowCORS_(req, res);

    /** @type {!GitHubStatusInfo} */
    const status = await this.parseGitHubStatus_(req);
    const {targetUrl} = status;
    if (targetUrl) {
      this.redirect_(req, res, targetUrl, /* addAnalytics */ true);
    } else {
      this.redirect_(req, res, 'https://github.com/material-components/material-components-web');
    }
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

    if (addAnalytics) {
      resQueryParams.set('utm_source', 'github');
      resQueryParams.set('utm_medium', 'shield');
    }

    const resQueryString = resQueryParams.toString() ? `?${resQueryParams.toString()}` : '';
    const redirectUrl = destinationUrl.replace(/\?.*$/, '') + resQueryString;
    res.redirect(redirectUrl);
  }
}

const screenshotShieldServer = new ScreenshotShieldServer();

exports.screenshotShieldSvg = (req, res) => screenshotShieldServer.handleShieldRequest(req, res);
exports.screenshotShieldUrl = (req, res) => screenshotShieldServer.handleUrlRequest(req, res);
