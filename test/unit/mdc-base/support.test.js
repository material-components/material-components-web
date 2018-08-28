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

import {assert} from 'chai';
import bel from 'bel';
import td from 'testdouble';

import {createMockRaf} from '../helpers/raf';
import {MDCSupport} from '../../../packages/mdc-base/support';

suite('MDCBase - support');

function setupTest() {
  const support = new MDCSupport();
  return {support};
}

/** @return {!HTMLElement} */
function createFlexItemMaxHeightBugFixture() {
  // The 1px borders are necessary to force IE to calculate box sizing correctly.
  const element = bel`
<section style="box-sizing: border-box; display: flex; flex-direction: column; max-height: 200px;
                opacity: 0.001; position: fixed; top: -9999px; left: -9999px;
                border: 1px solid transparent;">
  <header style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Header</header>
  <article style="box-sizing: border-box; flex-grow: 1; overflow: auto;
                  border: 1px solid transparent;">
    <div style="height: 500px;">Content</div>
  </article>
  <footer style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Footer</footer>
<section>
`;
  document.body.appendChild(element);
  return element;
}

/** @param {!HTMLElement} element */
function destroyFlexItemMaxHeightBugFixture(element) {
  document.body.removeChild(element);
}

test('#hasFlexItemMaxHeightBug returns false when flex item is scrollable.', function() {
  const {support} = setupTest();

  support.isScrollable = td.func('isScrollable');
  td.when(support.isScrollable(td.matchers.anything())).thenReturn(true);

  assert.isFalse(support.hasFlexItemMaxHeightBug);
});

test('#hasFlexItemMaxHeightBug returns true when flex item is not scrollable.', function() {
  const {support} = setupTest();

  support.isScrollable = td.func('isScrollable');
  td.when(support.isScrollable(td.matchers.anything())).thenReturn(false);

  // Call the getter twice to make code coverage happy
  assert.isTrue(support.hasFlexItemMaxHeightBug);
  assert.isTrue(support.hasFlexItemMaxHeightBug);
});

test('#isScrollable compares height properties', function() {
  const {support} = setupTest();

  assert.isTrue(support.isScrollable({scrollHeight: 2, offsetHeight: 1}), 'scrollHeight > offsetHeight');
  assert.isFalse(support.isScrollable({scrollHeight: 1, offsetHeight: 1}), 'scrollHeight === offsetHeight');
  assert.isFalse(support.isScrollable({scrollHeight: 1, offsetHeight: 2}), 'scrollHeight < offsetHeight');
});

test('#fixFlexItemMaxHeightBug does nothing when bug is not present', function(done) {
  const {support} = setupTest();

  const flexContainerEl = createFlexItemMaxHeightBugFixture();
  const flexItemEl = flexContainerEl.querySelector('article');

  const mockRaf = createMockRaf();

  Object.defineProperty(support, 'hasFlexItemMaxHeightBug', {
    get: () => false,
  });

  support.fixFlexItemMaxHeightBug(flexItemEl);

  mockRaf.flush();
  mockRaf.restore();

  requestAnimationFrame(() => {
    assert.equal(mockRaf.pendingFrames.length, 0);
    destroyFlexItemMaxHeightBugFixture(flexContainerEl);
    done();
  });
});

test('#fixFlexItemMaxHeightBug makes child flex item scrollable', function(done) {
  const {support} = setupTest();

  const flexContainerEl = createFlexItemMaxHeightBugFixture();
  const flexItemEl = flexContainerEl.querySelector('article');

  Object.defineProperty(support, 'hasFlexItemMaxHeightBug', {
    get: () => true,
  });

  support.fixFlexItemMaxHeightBug(flexItemEl);

  requestAnimationFrame(() => {
    // If the fix worked, the height of the scrollable area should be greater than the element's bounding box height.
    assert.isAbove(flexItemEl.scrollHeight, flexItemEl.offsetHeight);
    destroyFlexItemMaxHeightBugFixture(flexContainerEl);
    done();
  });
});

test('#fixFlexItemMaxHeightBug restores flex-basis to its original value of ""', function(done) {
  const {support} = setupTest();

  const flexContainerEl = createFlexItemMaxHeightBugFixture();
  const flexItemEl = flexContainerEl.querySelector('article');
  flexItemEl.style.flexBasis = '';

  Object.defineProperty(support, 'hasFlexItemMaxHeightBug', {
    get: () => true,
  });

  support.fixFlexItemMaxHeightBug(flexItemEl);

  requestAnimationFrame(() => {
    assert.equal(flexItemEl.style.flexBasis, '');
    destroyFlexItemMaxHeightBugFixture(flexContainerEl);
    done();
  });
});

test('#fixFlexItemMaxHeightBug restores flex-basis to its original value of "auto"', function(done) {
  const {support} = setupTest();

  const flexContainerEl = createFlexItemMaxHeightBugFixture();
  const flexItemEl = flexContainerEl.querySelector('article');
  flexItemEl.style.flexBasis = 'auto';

  Object.defineProperty(support, 'hasFlexItemMaxHeightBug', {
    get: () => true,
  });

  support.fixFlexItemMaxHeightBug(flexItemEl);

  requestAnimationFrame(() => {
    assert.equal(flexItemEl.style.flexBasis, 'auto');
    destroyFlexItemMaxHeightBugFixture(flexContainerEl);
    done();
  });
});
