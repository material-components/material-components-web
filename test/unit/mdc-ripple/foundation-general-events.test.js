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
import td from 'testdouble';

import {captureHandlers} from '../helpers/foundation';
import {testFoundation} from './helpers';
import {cssClasses, strings} from '../../../packages/mdc-ripple/constants';

suite('MDCRippleFoundation - General Events');

testFoundation('re-lays out the component on resize event for unbounded ripple', ({foundation, adapter, mockRaf}) => {
  td.when(adapter.isUnbounded()).thenReturn(true);
  td.when(adapter.computeBoundingRect()).thenReturn({
    width: 100,
    height: 200,
  }, {
    width: 50,
    height: 100,
  });
  let resizeHandler = null;
  td.when(adapter.registerResizeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    resizeHandler = handler;
  });
  foundation.init();
  mockRaf.flush();

  const isResizeHandlerFunction = typeof resizeHandler === 'function';
  assert.isOk(isResizeHandlerFunction, 'sanity check for resize handler');
  if (!isResizeHandlerFunction) {
    // Short-circuit test so further ones don't fail.
    return;
  }

  td.verify(adapter.updateCssVariable(strings.VAR_FG_SIZE, '120px'));

  resizeHandler();
  mockRaf.flush();

  td.verify(adapter.updateCssVariable(strings.VAR_FG_SIZE, '60px'));
});

testFoundation('debounces layout within the same frame on resize', ({foundation, adapter, mockRaf}) => {
  td.when(adapter.isUnbounded()).thenReturn(true);
  td.when(adapter.computeBoundingRect()).thenReturn({
    width: 100,
    height: 200,
  }, {
    width: 50,
    height: 100,
  });
  let resizeHandler = null;
  td.when(adapter.registerResizeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    resizeHandler = handler;
  });
  foundation.init();
  mockRaf.flush();
  const isResizeHandlerFunction = typeof resizeHandler === 'function';
  assert.isOk(isResizeHandlerFunction, 'sanity check for resize handler');
  if (!isResizeHandlerFunction) {
    // Short-circuit test so further ones don't fail.
    return;
  }

  resizeHandler();
  resizeHandler();
  resizeHandler();
  mockRaf.flush();
  td.verify(
    adapter.updateCssVariable(strings.VAR_FG_SIZE, td.matchers.isA(String)),
    {
      times: 2,
    }
  );
});

testFoundation('activates the background on focus', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  foundation.init();
  mockRaf.flush();

  handlers.focus();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_FOCUSED));
});

testFoundation('deactivates the background on blur', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  foundation.init();
  mockRaf.flush();

  handlers.blur();
  mockRaf.flush();
  td.verify(adapter.removeClass(cssClasses.BG_FOCUSED));
});
