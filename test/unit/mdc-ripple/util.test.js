/**
 * @license
 * Copyright 2016 Google Inc.
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
import {createMockWindowForCssVariables} from './helpers';
import td from 'testdouble';
import * as util from '../../../packages/mdc-ripple/util';

suite('MDCRipple - util');

test('#supportsCssVariables returns true when CSS.supports() returns true for css vars', () => {
  const windowObj = createMockWindowForCssVariables();
  td.when(windowObj.CSS.supports('--css-vars', td.matchers.anything())).thenReturn(true);
  assert.isOk(util.supportsCssVariables(windowObj, true));
  assert.equal(windowObj.appendedNodes, 0, 'All nodes created in #supportsCssVariables should be removed');
});

test('#supportsCssVariables returns true when feature-detecting its way around Safari < 10', () => {
  const windowObj = createMockWindowForCssVariables();
  td.when(windowObj.CSS.supports('--css-vars', td.matchers.anything())).thenReturn(false);
  td.when(windowObj.CSS.supports(td.matchers.contains('(--css-vars:'))).thenReturn(true);
  td.when(windowObj.CSS.supports('color', '#00000000')).thenReturn(true);
  assert.isOk(util.supportsCssVariables(windowObj, true), 'true iff both CSS Vars and #rgba are supported');

  td.when(windowObj.CSS.supports(td.matchers.contains('(--css-vars:'))).thenReturn(false);
  assert.isNotOk(util.supportsCssVariables(windowObj, true), 'false if #rgba is supported but not CSS Vars');
  td.when(windowObj.CSS.supports(td.matchers.contains('(--css-vars:'))).thenReturn(true);

  td.when(windowObj.CSS.supports('color', '#00000000')).thenReturn(false);
  assert.isNotOk(util.supportsCssVariables(windowObj, true), 'false if CSS Vars are supported but not #rgba');
  assert.equal(windowObj.appendedNodes, 0, 'All nodes created in #supportsCssVariables should be removed');
});

test('#supportsCssVariables returns true when getComputedStyle returns null (e.g. Firefox hidden iframes)', () => {
  const windowObj = createMockWindowForCssVariables();
  td.when(windowObj.CSS.supports('--css-vars', td.matchers.anything())).thenReturn(true);
  td.when(windowObj.getComputedStyle(td.matchers.anything())).thenReturn(null);
  assert.isOk(util.supportsCssVariables(windowObj, true), 'true if getComputedStyle returns null');
  assert.equal(windowObj.appendedNodes, 0, 'All nodes created in #supportsCssVariables should be removed');
});

test('#supportsCssVariables returns false when CSS.supports() returns false for css vars', () => {
  const windowObj = {
    CSS: {
      supports: td.function('.supports'),
    },
  };
  td.when(windowObj.CSS.supports('--css-vars', td.matchers.anything())).thenReturn(false);
  assert.isNotOk(util.supportsCssVariables(windowObj, true));
});

test('#supportsCssVariables returns false when CSS.supports is not a function', () => {
  const windowObj = {
    CSS: {
      supports: 'nope',
    },
  };
  assert.isNotOk(util.supportsCssVariables(windowObj, true));
});

test('#supportsCssVariables returns false when CSS is not an object', () => {
  const windowObj = {
    CSS: null,
  };
  assert.isNotOk(util.supportsCssVariables(windowObj, true));
});

test('#getNormalizedEventCoords maps event coords into the relative coordinates of the given rect', () => {
  const ev = {type: 'mousedown', pageX: 70, pageY: 70};
  const pageOffset = {x: 10, y: 10};
  const clientRect = {left: 50, top: 50};

  assert.deepEqual(util.getNormalizedEventCoords(ev, pageOffset, clientRect), {
    x: 10,
    y: 10,
  });
});

test('#getNormalizedEventCoords works with touchstart events', () => {
  const ev = {type: 'touchstart', changedTouches: [{pageX: 70, pageY: 70}]};
  const pageOffset = {x: 10, y: 10};
  const clientRect = {left: 50, top: 50};

  assert.deepEqual(util.getNormalizedEventCoords(ev, pageOffset, clientRect), {
    x: 10,
    y: 10,
  });
});
