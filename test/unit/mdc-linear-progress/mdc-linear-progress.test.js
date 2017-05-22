/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import bel from 'bel';

import {MDCLinearProgress, MDCLinearProgressFoundation} from '../../../packages/mdc-linear-progress';

function getFixture() {
  return bel`
    <div role="progressbar" class="mdc-linear-progress">
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
});

test('set progress', () => {
  const {root, component} = setupTest();

  component.progress = 0.5;
  const primaryBar = root.querySelector(MDCLinearProgressFoundation.strings.PRIMARY_BAR_SELECTOR);
  assert.equal('scaleX(0.5)', primaryBar.style.transform);
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
