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

/**
 * Adds the given event handler to the queue. It will be executed asynchronously after all external JS and CSS resources
 * have finished loading (as determined by continuous long-polling with a timeout). If this function is called after all
 * resources have finished loading, the given handler function will be invoked synchronously (in the same call stack).
 * Handlers are invoked in FIFO order.
 * @param {function(!Document|!Element) : undefined} handler
 */
window.demoReady = (function(root) {
  var POLL_INTERVAL_MS = 100;
  var POLL_MAX_WAIT_MS = 60 * 1000;

  var isReadyCached = false;
  var isDomLoaded = false;
  var handlers = [];
  var testDom = null;
  var startTimeMs = null;
  var pollTimer = null;

  function isReady() {
    if (isReadyCached) {
      return true;
    }
    ensureDetectionDom();
    isReadyCached = getComputedStyle(testDom).position === 'relative' &&
      (Boolean(window.mdc) || (isDomLoaded && !root.querySelector('script[src*="material-components-web.js"]')));
    return isReadyCached;
  }

  function ensureDetectionDom() {
    if (testDom) {
      return;
    }
    testDom = document.createElement('div');
    testDom.classList.add('demo-ready-detect');
    document.body.appendChild(testDom);
  }

  function removeDetectionDom() {
    if (!testDom) {
      return;
    }
    document.body.removeChild(testDom);
    testDom = null;
  }

  function startTimer() {
    if (pollTimer) {
      return;
    }
    startTimeMs = Date.now();
    pollTimer = setInterval(tick, POLL_INTERVAL_MS);
    window.addEventListener('load', function() {
      tick();
    });
  }

  function tick() {
    if (isReady()) {
      clearInterval(pollTimer);
      removeDetectionDom();
      invokeHandlers();
      return;
    }

    var elapsedTimeMs = Date.now() - startTimeMs;
    if (elapsedTimeMs > POLL_MAX_WAIT_MS) {
      clearInterval(pollTimer);
      removeDetectionDom();
      console.error('Timed out waiting for JS and CSS to load after ' + POLL_MAX_WAIT_MS + ' ms');
      return;
    }
  }

  function invokeHandlers() {
    handlers.forEach(function(handler) {
      handler(root);
    });
    handlers.length = 0;
  }

  root.addEventListener('DOMContentLoaded', function() {
    isDomLoaded = true;
  });

  return function addHandler(handler) {
    if (isReady()) {
      handler(root);
      return;
    }
    handlers.push(handler);
    startTimer();
  };
})(document);
