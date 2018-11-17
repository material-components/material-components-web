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

import bel from 'bel';
import {assert} from 'chai';
import {install as installClock} from '../helpers/clock';
import * as util from '../../../packages/mdc-snackbar/util';
import {strings, numbers} from '../../../packages/mdc-snackbar/constants';

const {ARIA_LIVE_DELAY_MS} = numbers;
const {ARIA_LIVE_LABEL_TEXT_ATTR} = strings;

suite('MDCSnackbar - util');

test('#announce temporarily disables ARIA attributes and then restores them', () => {
  const fixture = bel`
<div>
  <div class="aria" role="status" aria-live="polite">
    <div class="label"></div>
  </div>
</div>`;
  const clock = installClock();

  const ariaEl = fixture.querySelector('.aria');
  const labelEl = fixture.querySelector('.label');

  const labelText = 'Foo';
  labelEl.textContent = labelText;

  util.announce(ariaEl, labelEl);

  // Trim to remove `&nbsp;` (see comment in util.js)
  assert.equal(labelEl.textContent.trim(), '');
  assert.equal(ariaEl.getAttribute('aria-live'), 'off');

  clock.tick(ARIA_LIVE_DELAY_MS);

  assert.equal(labelEl.textContent, labelText);
  assert.equal(ariaEl.getAttribute('aria-live'), 'polite');
});

test('#announce prevents flicker by displaying label text on ::before pseudo-element and then removing it', () => {
  const fixture = bel`
<div>
  <div class="aria" role="status" aria-live="polite">
    <div class="label"></div>
  </div>
</div>`;
  const clock = installClock();

  const ariaEl = fixture.querySelector('.aria');
  const labelEl = fixture.querySelector('.label');

  const labelText = 'Foo';
  labelEl.textContent = labelText;

  util.announce(ariaEl, labelEl);

  assert.equal(labelEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR), labelText);

  clock.tick(ARIA_LIVE_DELAY_MS);

  assert.equal(labelEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR), null);
});

test('#announce second argument is optional', () => {
  const fixture = bel`
<div>
  <div class="aria label" role="status" aria-live="polite"></div>
</div>`;
  const clock = installClock();

  const ariaEl = fixture.querySelector('.aria');

  const labelText = 'Foo';
  ariaEl.textContent = labelText;

  util.announce(ariaEl);

  // Trim to remove `&nbsp;` (see comment in util.js)
  assert.equal(ariaEl.textContent.trim(), '');
  assert.equal(ariaEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR), labelText);
  assert.equal(ariaEl.getAttribute('aria-live'), 'off');

  clock.tick(ARIA_LIVE_DELAY_MS);

  assert.equal(ariaEl.textContent, labelText);
  assert.equal(ariaEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR), null);
  assert.equal(ariaEl.getAttribute('aria-live'), 'polite');
});

test('#announce does nothing if textContent is empty', () => {
  const fixture = bel`
<div>
  <div class="aria" role="status" aria-live="polite">
    <div class="label"></div>
  </div>
</div>`;

  const ariaEl = fixture.querySelector('.aria');
  const labelEl = fixture.querySelector('.label');

  util.announce(ariaEl, labelEl);

  assert.equal(labelEl.textContent.trim(), '');
  assert.equal(labelEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR), null);
  assert.equal(ariaEl.getAttribute('aria-live'), 'polite');
});
