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

import td from 'testdouble';

import {testFoundation, captureHandlers} from './helpers';
import {cssClasses} from '../../../packages/mdc-ripple/constants';

suite('MDCRippleFoundation - Activation Logic');

testFoundation(`adds ${cssClasses.BG_ACTIVE} on mousedown`, ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.mousedown();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_ACTIVE));
});

testFoundation(`adds ${cssClasses.BG_ACTIVE} on touchstart`, ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.touchstart();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_ACTIVE));
});

testFoundation(`adds ${cssClasses.BG_ACTIVE} on pointerdown`, ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.pointerdown();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_ACTIVE));
});

testFoundation(`adds ${cssClasses.BG_ACTIVE} on keydown when surface is made active`,
    ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  td.when(adapter.isSurfaceActive()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  handlers.keydown();
  mockRaf.flush();

  td.verify(adapter.addClass(cssClasses.BG_ACTIVE));
});

testFoundation(`adds ${cssClasses.BG_ACTIVE} on public activate() call`, ({foundation, adapter, mockRaf}) => {
  td.when(adapter.isSurfaceActive()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  foundation.activate();
  mockRaf.flush();

  td.verify(adapter.addClass(cssClasses.BG_ACTIVE));
});

testFoundation('does not redundantly add classes on touchstart followed by mousedown',
    ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.touchstart();
  mockRaf.flush();
  handlers.mousedown();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_ACTIVE), {times: 1});
});

testFoundation('does not redundantly add classes on touchstart followed by pointerstart',
    ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.touchstart();
  mockRaf.flush();
  handlers.pointerdown();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_ACTIVE), {times: 1});
});

testFoundation('removes deactivation classes on activate to ensure ripples can be retriggered',
    ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.mousedown();
  mockRaf.flush();
  handlers.mouseup();
  mockRaf.flush();
  handlers.mousedown();
  mockRaf.flush();

  td.verify(adapter.removeClass(cssClasses.BG_BOUNDED_ACTIVE_FILL));
  td.verify(adapter.removeClass(cssClasses.FG_UNBOUNDED_DEACTIVATION));
  td.verify(adapter.removeClass(cssClasses.FG_BOUNDED_ACTIVE_FILL));
});

testFoundation('displays the foreground ripple on activation when unbounded', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  td.when(adapter.computeBoundingRect()).thenReturn({width: 100, height: 100, left: 0, top: 0});
  td.when(adapter.isUnbounded()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  handlers.mousedown({pageX: 0, pageY: 0});
  mockRaf.flush();

  td.verify(adapter.addClass(cssClasses.FG_UNBOUNDED_ACTIVATION));
});
