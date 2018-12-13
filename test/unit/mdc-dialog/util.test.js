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
import td from 'testdouble';
import {assert} from 'chai';

import * as util from '../../../packages/mdc-dialog/util';

suite('MDCDialog - util');

// Babel transpiles optional function arguments into `if` statements. Istanbul (our code coverage tool) then reports the
// transpiled `else` branch as lacking coverage, but the coverage report UI doesn't tell you where the missing branches
// are. See https://github.com/gotwarlost/istanbul/issues/582#issuecomment-334683612.
// createFocusTrapInstance() has two optional arguments, so code coverage reports two missed branches.
test('createFocusTrapInstance covers `if` branches added by Babel transpilation of optional arguments', () => {
  const surface = bel`<div></div>`;
  util.createFocusTrapInstance(surface);
});

test('createFocusTrapInstance creates a properly configured focus trap instance', () => {
  const surface = bel`<div></div>`;
  const yesBtn = bel`<button></button>`;
  const focusTrapFactory = td.func('focusTrapFactory');
  const properlyConfiguredFocusTrapInstance = {};
  td.when(focusTrapFactory(surface, {
    initialFocus: yesBtn,
    escapeDeactivates: false,
    clickOutsideDeactivates: true,
  })).thenReturn(properlyConfiguredFocusTrapInstance);

  const instance = util.createFocusTrapInstance(surface, focusTrapFactory, yesBtn);
  assert.equal(instance, properlyConfiguredFocusTrapInstance);
});

test('isScrollable returns false when element has no content', () => {
  const parent = bel`<div></div>`;

  // Element.scrollHeight only returns the correct value when the element is attached to the DOM.
  document.body.appendChild(parent);
  try {
    assert.isFalse(util.isScrollable(parent));
  } finally {
    document.body.removeChild(parent);
  }
});

test('isScrollable returns false when element content does not overflow its bounding box', () => {
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

test('isScrollable returns true when element content overflows its bounding box', () => {
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

test('areTopsMisaligned returns false when array is empty', () => {
  assert.isFalse(util.areTopsMisaligned([]));
});

test('areTopsMisaligned returns false when array only contains one element', () => {
  const parent = bel`
<div style="display: flex;
            position: relative;
            flex-direction: row;
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

test('areTopsMisaligned returns false when elements have same offsetTop', () => {
  const parent = bel`
<div style="display: flex;
            position: relative;
            flex-direction: row;
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

test('areTopsMisaligned returns true when elements have different "top" values', () => {
  const parent = bel`
<div style="display: flex;
            position: relative;
            flex-direction: column;
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
    assert.isTrue(util.areTopsMisaligned(buttons));
  } finally {
    document.body.removeChild(parent);
  }
});
