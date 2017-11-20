/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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
import td from 'testdouble';

import {testFoundation, captureHandlers} from './helpers';
import {cssClasses, strings} from '../../../packages/mdc-ripple/constants';

suite('MDCRippleFoundation - General Events');

testFoundation('re-lays out the component on resize event', ({foundation, adapter, mockRaf}) => {
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
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.focus();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_FOCUSED));
});

testFoundation('deactivates the background on blur', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.blur();
  mockRaf.flush();
  td.verify(adapter.removeClass(cssClasses.BG_FOCUSED));
});
