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

import 'url-search-params-polyfill';

[].forEach.call(document.querySelectorAll('.mdc-linear-progress'), (progressEl) => {
  const linearProgress = mdc.linearProgress.MDCLinearProgress.attachTo(progressEl);

  // TODO(acdvorak): Implement this in MDCLinearProgress initialSyncWithDOM()
  const progressValue = parseFloat(progressEl.getAttribute('data-test-linear-progress-value'));
  const bufferValue = parseFloat(progressEl.getAttribute('data-test-linear-progress-buffer'));

  if (progressValue > 0) {
    linearProgress.progress = progressValue;
  }

  if (bufferValue > 0) {
    linearProgress.buffer = bufferValue;
  }
});

const enableAnimationCheckboxEl = document.querySelector('#test-linear-progress-enable-animation');

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
