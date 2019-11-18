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

import {assert} from 'chai';
import bel from 'bel';

import {MDCLinearProgress, MDCLinearProgressFoundation} from '../../../packages/mdc-linear-progress/index.ts';

function getFixture() {
  return bel`
    <div role="progressbar" class="mdc-linear-progress" aria-label="Unit Test Progress Bar" aria-valuemin="0"
      aria-valuemax="1" aria-valuenow="0">
      <div class="mdc-linear-progress__buffering-dots"></div>
      <div class="mdc-linear-progress__buffer"></div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
    </div>
  `;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCLinearProgress(root);
  return {root, component};
}

suite('MDCLinearProgress');

test('attachTo initializes and returns a MDCLinearProgress instance', () => {
  assert.isOk(MDCLinearProgress.attachTo(getFixture()) instanceof MDCLinearProgress);
});

test('set indeterminate', () => {
  const {root, component} = setupTest();

  component.determinate = false;
  assert.isOk(root.classList.contains('mdc-linear-progress--indeterminate'));
  assert.equal(undefined, root.getAttribute(MDCLinearProgressFoundation.strings.ARIA_VALUENOW));
});

test('set progress', () => {
  const {root, component} = setupTest();

  component.progress = 0.5;
  const primaryBar = root.querySelector(MDCLinearProgressFoundation.strings.PRIMARY_BAR_SELECTOR);
  assert.equal('scaleX(0.5)', primaryBar.style.transform);
  assert.equal('0.5', root.getAttribute(MDCLinearProgressFoundation.strings.ARIA_VALUENOW));
});

test('set buffer', () => {
  const {root, component} = setupTest();

  component.buffer = 0.5;
  const buffer = root.querySelector(MDCLinearProgressFoundation.strings.BUFFER_SELECTOR);
  assert.equal('scaleX(0.5)', buffer.style.transform);
});

test('set reverse', () => {
  const {root, component} = setupTest();

  component.reverse = true;
  assert.isOk(root.classList.contains('mdc-linear-progress--reversed'));
});

test('open and close', () => {
  const {root, component} = setupTest();

  component.close();
  assert.isOk(root.classList.contains('mdc-linear-progress--closed'));

  component.open();
  assert.isNotOk(root.classList.contains('mdc-linear-progress--closed'));
});
