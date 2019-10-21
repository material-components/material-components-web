/**
 * @license
 * Copyright 2019 Google Inc.
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

import 'url-search-params-polyfill';

const progressControllers = [];
[].forEach.call(document.querySelectorAll('.mdc-circular-progress'), (progressEl) => {
  const circularProgress = mdc.circularProgress.MDCCircularProgress.attachTo(progressEl);

  // TODO(acdvorak): Implement this in MDCLinearProgress initialSyncWithDOM()
  let progressValue = parseFloat(progressEl.getAttribute('data-test-circular-progress-value'));

  circularProgress.progress = progressValue;
  /*setInterval(() => {
    if (Math.abs(progressValue - 1) < 0.001) {
      progressValue = 0;
    } else if (progressValue == 0) {
      progressValue = 0.1;
    } else {
      progressValue = (progressValue + 0.1) % 1;
    }

    circularProgress.progress = progressValue;
  }, 750);*/
  progressControllers.push(circularProgress);
});

const enableAnimationCheckboxEl = document.querySelector('#test-circular-progress-enable-animation');

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('enable_animation') && params.get('enable_animation') !== 'false') {
    document.body.classList.remove('test-animation--paused');
    enableAnimationCheckboxEl.checked = true;
  } else {
    document.body.classList.add('test-animation--paused');
    enableAnimationCheckboxEl.checked = false;
  }
}

enableAnimationCheckboxEl.addEventListener('change', (evt) => {
  const params = new URLSearchParams(window.location.search);
  if (evt.target.checked) {
    params.set('enable_animation', 'true');
  } else {
    params.delete('enable_animation');
  }
  const path = window.location.pathname;
  const qs = String(params) ? '?' + String(params) : '';
  const hash = window.location.hash;
  window.history.replaceState({}, 'title', `${path}${qs}${hash}`);
  setTimeout(checkUrlParams, 100);
});

window.addEventListener('popstate', checkUrlParams);

checkUrlParams();

window.mdc.testFixture.notifyDomReady();
