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

import bel from 'bel';
import lolex from 'lolex';
import td from 'testdouble';
import {assert} from 'chai';

import MDCDialogUtil from '../../../packages/mdc-dialog/util';
import {numbers} from '../../../packages/mdc-dialog/constants';

suite('MDCDialog - util');

/** @return {!HTMLElement} */
function createFlexItemBugFixture() {
  const element = bel`
<section style="box-sizing: border-box; display: flex; flex-direction: column; max-height: 200px;
                opacity: 0.001; position: fixed; top: -9999px; left: -9999px;
                border: 1px solid transparent;">
  <header style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Header</header>
  <article style="box-sizing: border-box; flex-grow: 1; overflow: auto;
                  border: 1px solid transparent;">
    <div style="height: 500px"></div>
  </article>
  <footer style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Footer</footer>
<section>
`;
  document.body.appendChild(element);
  return element;
}

function destroyFlexItemBugFixture(element) {
  document.body.removeChild(element);
}

// Babel transpiles optional function arguments into `if` statements. Istanbul (our code coverage tool) then reports the
// transpiled `else` branch as lacking coverage, but the coverage report UI doesn't tell you where the missing branches
// are. See https://github.com/gotwarlost/istanbul/issues/582#issuecomment-334683612.
// createFocusTrapInstance() has two optional arguments, so code coverage reports two missed branches.
test('#createFocusTrapInstance covers `if` branches added by Babel transpilation of optional arguments', () => {
  const util = new MDCDialogUtil();
  const surface = bel`<div></div>`;
  util.createFocusTrapInstance(surface);
});

test('#createFocusTrapInstance creates a properly configured focus trap instance', () => {
  const util = new MDCDialogUtil();
  const surface = bel`<div></div>`;
  const yesBtn = bel`<button></button>`;
  const focusTrapFactory = td.func('focusTrapFactory');
  const properlyConfiguredFocusTrapInstance = {};
  td.when(focusTrapFactory(surface, {
    initialFocus: yesBtn,
    clickOutsideDeactivates: false,
  })).thenReturn(properlyConfiguredFocusTrapInstance);

  const instance = util.createFocusTrapInstance(surface, yesBtn, focusTrapFactory);
  assert.equal(instance, properlyConfiguredFocusTrapInstance);
});

test('#isScrollable returns false when element has no content', () => {
  const util = new MDCDialogUtil();
  const parent = bel`<div></div>`;

  // Element.scrollHeight only returns the correct value when the element is attached to the DOM.
  document.body.appendChild(parent);
  try {
    assert.isFalse(util.isScrollable(parent));
  } finally {
    document.body.removeChild(parent);
  }
});

test('#isScrollable returns false when element content does not overflow its bounding box', () => {
  const util = new MDCDialogUtil();
  const parent = bel`
<div style="height: 20px; overflow: auto;">
  <div style="height: 10px;"></div>
</div>`;

  // Element.scrollHeight only returns the correct value when the element is attached to the DOM.
  document.body.appendChild(parent);
  try {
    assert.isFalse(util.isScrollable(parent));
  } finally {
    document.body.removeChild(parent);
  }
});

test('#isScrollable returns true when element content overflows its bounding box', () => {
  const util = new MDCDialogUtil();
  const parent = bel`
<div style="height: 20px; overflow: auto;">
  <div style="height: 30px;"></div>
</div>`;

  // Element.scrollHeight only returns the correct value when the element is attached to the DOM.
  document.body.appendChild(parent);
  try {
    assert.isTrue(util.isScrollable(parent));
  } finally {
    document.body.removeChild(parent);
  }
});

test('#areTopsMisaligned returns true when array is empty', () => {
  const util = new MDCDialogUtil();
  assert.isFalse(util.areTopsMisaligned([]));
});

test('#areTopsMisaligned returns false when array only contains one element', () => {
  const util = new MDCDialogUtil();
  const parent = bel`
<div style="display: flex;
            position: relative;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;">
  <button>1</button>
</div>`;
  const buttons = parent.querySelectorAll('button');

  // HTMLElement.offsetTop only returns the correct value when the element is attached to the DOM.
  document.body.appendChild(parent);
  try {
    assert.isFalse(util.areTopsMisaligned(buttons));
  } finally {
    document.body.removeChild(parent);
  }
});

test('#areTopsMisaligned returns false when elements have same offsetTop', () => {
  const util = new MDCDialogUtil();
  const parent = bel`
<div style="display: flex;
            position: relative;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;">
  <button>1</button>
  <button>2</button>
</div>`;
  const buttons = parent.querySelectorAll('button');

  // HTMLElement.offsetTop only returns the correct value when the element is attached to the DOM.
  document.body.appendChild(parent);
  try {
    assert.isFalse(util.areTopsMisaligned(buttons));
  } finally {
    document.body.removeChild(parent);
  }
});

test('#areTopsMisaligned returns true when elements have different "top" values', () => {
  const util = new MDCDialogUtil();
  const parent = bel`
<div style="display: flex;
            position: relative;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;">
  <button>1</button>
  <button style="position: relative; top: 1px;">2</button>
</div>`;
  const buttons = parent.querySelectorAll('button');

  // HTMLElement.offsetTop only returns the correct value when the element is attached to the DOM.
  document.body.appendChild(parent);
  try {
    assert.isTrue(util.areTopsMisaligned(buttons));
  } finally {
    document.body.removeChild(parent);
  }
});

test('#areTopsMisaligned returns true when elements have different heights in a vertically-centered container', () => {
  const util = new MDCDialogUtil();
  const parent = bel`
<div style="display: flex;
            position: relative;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;">
  <button>1</button>
  <button style="height: 100px;">2</button>
</div>`;
  const buttons = parent.querySelectorAll('button');

  // HTMLElement.offsetTop only returns the correct value when the element is attached to the DOM.
  document.body.appendChild(parent);
  try {
    assert.isTrue(util.areTopsMisaligned(buttons));
  } finally {
    document.body.removeChild(parent);
  }
});

// TODO(acdvorak): CACHING! hasFlexItemMaxHeightBug_ gets cached.
test('#hasFlexItemMaxHeightBug returns false when child flex item is scrollable', () => {
  const util = new MDCDialogUtil();
  util.isScrollable = td.func('isScrollable');
  td.when(util.isScrollable(td.matchers.anything())).thenReturn(true);

  assert.isFalse(util.hasFlexItemMaxHeightBug());
});

test('#hasFlexItemMaxHeightBug returns true when child flex item is not scrollable', () => {
  const util = new MDCDialogUtil();
  util.isScrollable = td.func('isScrollable');
  td.when(util.isScrollable(td.matchers.anything())).thenReturn(false);

  assert.isTrue(util.hasFlexItemMaxHeightBug());
});

test('#hasFlexItemMaxHeightBug caches its return value', () => {
  const util = new MDCDialogUtil();
  util.isScrollable = td.func('isScrollable');

  td.when(util.isScrollable(td.matchers.anything())).thenReturn(false);
  assert.isTrue(util.hasFlexItemMaxHeightBug());

  td.when(util.isScrollable(td.matchers.anything())).thenReturn(true);
  assert.isTrue(util.hasFlexItemMaxHeightBug());
});

test('#fixFlexItemMaxHeightBug does nothing if bug is not present', () => {
  const util = new MDCDialogUtil();
  util.isScrollable = td.func('isScrollable');
  td.when(util.isScrollable(td.matchers.anything())).thenReturn(true);

  const clock = lolex.install();
  const callback = td.func('callback');
  const intervalMs = numbers.IE_FLEX_OVERFLOW_BUG_INTERVAL_MS;
  const numIterations = numbers.IE_FLEX_OVERFLOW_BUG_ITERATIONS;
  const flexContainer = createFlexItemBugFixture();
  const flexItem = flexContainer.querySelector('article');

  util.fixFlexItemMaxHeightBug(flexItem, callback);

  for (let i = 0; i < numIterations; i++) {
    clock.tick(intervalMs);
  }

  td.verify(callback(), {times: 0});

  clock.uninstall();
  destroyFlexItemBugFixture(flexContainer);
});

test('#fixFlexItemMaxHeightBug invokes callback on every iteration', () => {
  const util = new MDCDialogUtil();
  util.hasFlexItemMaxHeightBug = td.func('hasFlexItemMaxHeightBug');
  td.when(util.hasFlexItemMaxHeightBug()).thenReturn(true);

  const clock = lolex.install();
  const callback = td.func('callback');
  const intervalMs = numbers.IE_FLEX_OVERFLOW_BUG_INTERVAL_MS;
  const numIterations = numbers.IE_FLEX_OVERFLOW_BUG_ITERATIONS;
  const flexContainer = createFlexItemBugFixture();
  const flexItem = flexContainer.querySelector('article');

  util.fixFlexItemMaxHeightBug(flexItem, callback);

  for (let i = 0; i < numIterations; i++) {
    clock.tick(intervalMs);
  }

  td.verify(callback(), {times: numIterations});

  clock.uninstall();
  destroyFlexItemBugFixture(flexContainer);
});

test('#fixFlexItemMaxHeightBug enables scrolling in child flex item', () => {
  const util = new MDCDialogUtil();
  util.hasFlexItemMaxHeightBug = td.func('hasFlexItemMaxHeightBug');
  td.when(util.hasFlexItemMaxHeightBug()).thenReturn(true);

  const callback = td.func('callback');
  const intervalMs = numbers.IE_FLEX_OVERFLOW_BUG_INTERVAL_MS;
  const numIterations = numbers.IE_FLEX_OVERFLOW_BUG_ITERATIONS;
  const flexContainer = createFlexItemBugFixture();
  const flexItem = flexContainer.querySelector('article');

  util.fixFlexItemMaxHeightBug(flexItem, callback);

  setTimeout(() => {
    assert.isTrue(util.isScrollable(flexItem));

    destroyFlexItemBugFixture(flexContainer);
    done();
  }, intervalMs * numIterations + 500);
});

test('#fixFlexItemMaxHeightBug restores original flex-basis value of "" (empty string)', () => {
  const util = new MDCDialogUtil();
  util.hasFlexItemMaxHeightBug = td.func('hasFlexItemMaxHeightBug');
  td.when(util.hasFlexItemMaxHeightBug()).thenReturn(true);

  const callback = td.func('callback');
  const intervalMs = numbers.IE_FLEX_OVERFLOW_BUG_INTERVAL_MS;
  const numIterations = numbers.IE_FLEX_OVERFLOW_BUG_ITERATIONS;
  const flexContainer = createFlexItemBugFixture();
  const flexItem = flexContainer.querySelector('article');

  util.fixFlexItemMaxHeightBug(flexItem, callback);

  setTimeout(() => {
    assert.equal(flexItem.style['flex-basis'], '');

    destroyFlexItemBugFixture(flexContainer);
    done();
  }, intervalMs * numIterations + 500);
});

test('#fixFlexItemMaxHeightBug restores original flex-basis value of "auto"', () => {
  const util = new MDCDialogUtil();
  util.hasFlexItemMaxHeightBug = td.func('hasFlexItemMaxHeightBug');
  td.when(util.hasFlexItemMaxHeightBug()).thenReturn(true);

  const callback = td.func('callback');
  const intervalMs = numbers.IE_FLEX_OVERFLOW_BUG_INTERVAL_MS;
  const numIterations = numbers.IE_FLEX_OVERFLOW_BUG_ITERATIONS;
  const flexContainer = createFlexItemBugFixture();
  const flexItem = flexContainer.querySelector('article');
  flexItem.style['flex-basis'] = 'auto';

  util.fixFlexItemMaxHeightBug(flexItem, callback);

  setTimeout(() => {
    assert.equal(flexItem.style['flex-basis'], 'auto');

    destroyFlexItemBugFixture(flexContainer);
    done();
  }, intervalMs * numIterations + 500);
});
