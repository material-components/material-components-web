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
 *   type: string,
 *   color: string,
 *   message: string,
 *   targetUrl: ?string,
 *   state: ?string,
 * }} ShieldConfig
 */

class ShieldGenerator {
  constructor() {
    this.octokit_ = octokit();
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
      const svgResponse = await request({method: 'GET', uri: svgUrl});
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
    const reqQueryString = require('url').parse(req.url).query;
    const reqQueryParams = new URLSearchParams(reqQueryString);

    const gitRefParam = reqQueryParams.get('ref');
    const maxGitRefsParam = parseInt(reqQueryParams.get('max'), 10);
    const typeParam = reqQueryParams.get('type');
    const latestParam = reqQueryParams.get('latest') !== null;

    // Number of GitHub commits to search through for a matching status.
    // Valid values: 1 through 50. Defaults to 25.
    const maxGitRefs = latestParam ? 1 : Math.min(50, Math.max(1, maxGitRefsParam || 25));

    let [, refName, separator, initialOffset] = (/^(.+?)([~^])(\d+)$/.exec(gitRefParam) || []);
    refName = refName || 'master';
    separator = separator || '~';
    initialOffset = parseInt(initialOffset, 10) || 0;

    const shieldConfigs = [];

    for (let curRefOffset = initialOffset; curRefOffset < initialOffset + maxGitRefs; curRefOffset++) {
      /** @type {!ShieldConfig} */
      const shieldConfig = await this.getGitHubCommitStatus_(`${refName}${separator}${curRefOffset}`);
      if (typeParam) {
        if (typeParam === shieldConfig.type) {
          return shieldConfig;
        }
      } else if (this.isTerminalState_(shieldConfig)) {
        return shieldConfig;
      }
      shieldConfigs.push(shieldConfig);
    }
    return shieldConfigs[0];
  }

  /**
   *
   * @param {!ShieldConfig} shieldConfig
   * @return {boolean}
   * @private
   */
  isTerminalState_(shieldConfig) {
    return shieldConfig.type === 'error' || shieldConfig.type === 'failed' || shieldConfig.type === 'passed';
  }

  /**
   * @param {string} ref
   * @return {!Promise<!ShieldConfig>}
   * @private
   */
  async getGitHubCommitStatus_(ref) {
    let statusResponse;
    try {
      statusResponse = await this.octokit_.repos.getCombinedStatusForRef({
        owner: 'material-components',
        repo: 'material-components-web',
        ref,
      });
    } catch (err) {
      return {
        type: '404',
        color: 'lightgrey',
        message: '404 not found',
        targetUrl: null,
        state: null,
      };
    }

    const isButterBot = (status) => status.context === 'screenshot-test/butter-bot';
    const isTravisCiFinished = (status) => status.context.indexOf('travis') > -1 && status.state === 'success';
    const butterBotStatus = statusResponse.data.statuses.filter(isButterBot)[0];
    const travisCiFinishedStatus = statusResponse.data.statuses.filter(isTravisCiFinished)[0];
    if (!butterBotStatus) {
      if (travisCiFinishedStatus) {
        return {
          type: 'skipped',
          color: 'lightgrey',
          message: 'skipped',
          targetUrl: null,
          state: null,
        };
      }
      return {
        type: 'pending',
        color: 'lightgrey',
        message: 'pending',
        targetUrl: null,
        state: 'pending',
      };
    }

    /** @type {string} */
    const state = butterBotStatus.state;

    /** @type {string} */
    const targetUrl = butterBotStatus.target_url;

    /** @type {string} */
    const desc = butterBotStatus.description;

    return (
      this.getRunningStatus_(desc, state, targetUrl) ||
      this.getPassedStatus_(desc, state, targetUrl) ||
      this.getFailedStatus_(desc, state, targetUrl) ||
      this.getErrorStatus_(desc, state, targetUrl)
    );
  }

  getRunningStatus_(desc, state, targetUrl) {
    // E.g.: desc = "87 of 581 (15.0%) - 0 diffs"
    // eslint-disable-next-line no-unused-vars
    const [, strDone, strTotal, strPercent, strDiffsSoFar] =
      (/(\d+) of (\d+) \(([\d.]+%)\) - (\d+) diffs?/.exec(desc) || []);
    const numDiffsSoFar = parseInt(strDiffsSoFar, 10);

    if (isFinite(numDiffsSoFar)) {
      const flooredPercent = parseInt(strPercent, 10) + '%';
      const message = `${flooredPercent} - ${numDiffsSoFar.toLocaleString()} diff${numDiffsSoFar === 1 ? '' : 's'}`;
      return {
        type: 'running',
        color: numDiffsSoFar === 0 ? 'yellow' : 'red',
        message,
        targetUrl,
        state,
      };
    }

    return null;
  }

  getPassedStatus_(desc, state, targetUrl) {
    const [, strPassed] = (/All (\d+) screenshots match/.exec(desc) || []);
    const numPassed = parseInt(strPassed, 10);

    if (isFinite(numPassed)) {
      return {
        type: 'passed',
        color: 'brightgreen',
        message: `${numPassed.toLocaleString()} pass`,
        targetUrl,
        state,
      };
    }

    return null;
  }

  getFailedStatus_(desc, state, targetUrl) {
    const [, strDiffsTotal] = (/(\d+) screenshots? differ/.exec(desc) || []);
    const numDiffsTotal = parseInt(strDiffsTotal, 10);

    if (isFinite(numDiffsTotal)) {
      return {
        type: 'failed',
        color: 'red',
        message: `${numDiffsTotal.toLocaleString()} diff${numDiffsTotal === 1 ? '' : 's'}`,
        targetUrl,
        state,
      };
    }

    return null;
  }

  getErrorStatus_(desc, state, targetUrl) {
    if (state === 'error' || state === 'failure') {
      return {
        type: 'error',
        color: 'red',
        message: state,
        targetUrl,
        state,
      };
    }

    return {
      type: 'unknown',
      color: 'lightgrey',
      message: (state || 'unknown').toLowerCase(),
      targetUrl,
      state,
    };
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
