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

import {createFixture, html} from '../../../testing/dom';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {numbers, strings} from '../constants';
import * as util from '../util';

const {ARIA_LIVE_DELAY_MS} = numbers;
const {ARIA_LIVE_LABEL_TEXT_ATTR} = strings;

describe('MDCSnackbar - util', () => {
  setUpMdcTestEnvironment();

  it('#announce temporarily disables ARIA attributes and then restores them',
     () => {
       const fixture = createFixture(html`
        <div>
          <div class="aria" role="status" aria-live="polite">
            <div class="label"></div>
          </div>
        </div>`);

       const ariaEl = fixture.querySelector('.aria')!;
       const labelEl = fixture.querySelector('.label')!;

       const labelText = 'Foo';
       labelEl.textContent = labelText;

       util.announce(ariaEl, labelEl);

       // Trim to remove `&nbsp;` (see comment in util.ts)
       expect(labelEl.textContent.trim()).toEqual('');
       expect(ariaEl.getAttribute('aria-live')).toEqual('off');

       jasmine.clock().tick(ARIA_LIVE_DELAY_MS);

       expect(labelEl.textContent).toEqual(labelText);
       expect(ariaEl.getAttribute('aria-live')).toEqual('polite');
     });

  it('#announce prevents flicker by displaying label text on ::before pseudo-element and then removing it',
     () => {
       const fixture = createFixture(`
        <div>
          <div class="aria" role="status" aria-live="polite">
            <div class="label"></div>
          </div>
        </div>`);

       const ariaEl = fixture.querySelector('.aria')!;
       const labelEl = fixture.querySelector('.label')!;

       const labelText = 'Foo';
       labelEl.textContent = labelText;

       util.announce(ariaEl, labelEl);

       expect(labelEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR))
           .toEqual(labelText);

       jasmine.clock().tick(ARIA_LIVE_DELAY_MS);

       expect(labelEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR)).toEqual(null);
     });

  it('#announce second argument is optional', () => {
    const fixture = createFixture(html`
      <div>
        <div class="aria label" role="status" aria-live="polite"></div>
      </div>`);

    const ariaEl = fixture.querySelector('.aria')!;

    const labelText = 'Foo';
    ariaEl.textContent = labelText;

    util.announce(ariaEl);

    // Trim to remove `&nbsp;` (see comment in util.ts)
    expect(ariaEl.textContent.trim()).toEqual('');
    expect(ariaEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR)).toEqual(labelText);
    expect(ariaEl.getAttribute('aria-live')).toEqual('off');

    jasmine.clock().tick(ARIA_LIVE_DELAY_MS);

    expect(ariaEl.textContent).toEqual(labelText);
    expect(ariaEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR)).toBeNull();
    expect(ariaEl.getAttribute('aria-live')).toEqual('polite');
  });

  it('#announce does nothing if textContent is empty', () => {
    const fixture = createFixture(html`
      <div>
        <div class="aria" role="status" aria-live="polite">
          <div class="label"></div>
        </div>
      </div>`);

    const ariaEl = fixture.querySelector('.aria')!;
    const labelEl = fixture.querySelector('.label')!;

    util.announce(ariaEl, labelEl);

    expect(labelEl.textContent!.trim()).toEqual('');
    expect(labelEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR)).toBeNull();
    expect(ariaEl.getAttribute('aria-live')).toEqual('polite');
  });

  it('#announce does nothing if aria-live was not present', () => {
    const fixture = createFixture(html`
      <div>
        <div class="aria label" role="status">Foo</div>
      </div>`);
    const ariaEl = fixture.querySelector('.aria')!;

    util.announce(ariaEl);

    expect(ariaEl.getAttribute('aria-live')).toBeNull();
    expect(ariaEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR)).toBeNull();

    jasmine.clock().tick(ARIA_LIVE_DELAY_MS);

    expect(ariaEl.getAttribute('aria-live')).toBeNull();
    expect(ariaEl.getAttribute(ARIA_LIVE_LABEL_TEXT_ATTR)).toBeNull();
  });
});
