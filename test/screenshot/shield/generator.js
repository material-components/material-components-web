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
const request = require('request-promise-native');

/**
 * @typedef {{
 *   state: ?string,
 *   color: string,
 *   message: string,
 *   targetUrl: ?string,
 * }} GitHubStatusInfo
 */

class ShieldGenerator {
  constructor() {
    this.octokit_ = octokit();
  }

  async handleSvgRequest(req, res) {
    this.setResponseHeaders_(req, res);

    /** @type {!GitHubStatusInfo} */
    const status = await this.parseGitHubStatus_(req);
    const {message, color, targetUrl} = status;
    const messageEncoded = encodeURI(message.replace(/-/g, '--').replace(/_/g, '__'));
    const svgUrl = `https://img.shields.io/badge/screenshots-${messageEncoded}-${color}.svg?link=${targetUrl}`;

    try {
      const svgResponse = await request({method: 'GET', uri: svgUrl});
      res.set('Content-Type', 'image/svg+xml;charset=utf-8');
      res.send(svgResponse);
    } catch (err) {
      res.send(500, err);
    }
  }

  async handleUrlRequest(req, res) {
    this.setResponseHeaders_(req, res);

    /** @type {!GitHubStatusInfo} */
    const status = await this.parseGitHubStatus_(req);
    const {targetUrl} = status;
    if (targetUrl) {
      this.redirect_(req, res, targetUrl, /* addAnalytics */ true);
    } else {
      this.redirect_(req, res, 'https://github.com/material-components/material-components-web');
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

    return (
      this.getProgressStatus_(desc, targetUrl) ||
      this.getPassedStatus_(desc, state, targetUrl) ||
      this.getFailedStatus_(desc, state, targetUrl) ||
      this.getErrorStatus_(state, targetUrl)
    );
  }

  getProgressStatus_(desc, targetUrl) {
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

    return null;
  }

  getPassedStatus_(desc, state, targetUrl) {
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

    return null;
  }

  getFailedStatus_(desc, state, targetUrl) {
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

    return null;
  }

  getErrorStatus_(state, targetUrl) {
    if (state === 'error' || state === 'failure') {
      return {
        state,
        color: 'red',
        message: state,
        targetUrl,
      };
    }

    return {
      state,
      color: 'lightgrey',
      message: (state || 'unknown').toLowerCase(),
      targetUrl,
    };
  }

  setResponseHeaders_(req, res) {
    // Allow CORS requests.
    // See https://cloud.google.com/functions/docs/writing/http#handling_cors_requests
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Max-Age', '3600');

    // Prevent GitHub Camo from caching images.
    // See https://github.com/github/markup/issues/224#issuecomment-33454537
    res.set('Cache-Control', 'no-cache');
    res.set('Expires', '0');
    res.set('Vary', 'Accept-Encoding');

    // Send response to OPTIONS requests and terminate function execution.
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
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

module.exports = ShieldGenerator;
