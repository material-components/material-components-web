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

import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCRippleFoundation from '../../../packages/mdc-ripple/foundation';
import {cssClasses, strings, numbers} from '../../../packages/mdc-ripple/constants';

import {testFoundation} from './helpers';

suite('MDCRippleFoundation');

test('cssClasses returns constants.cssClasses', () => {
  assert.deepEqual(MDCRippleFoundation.cssClasses, cssClasses);
});

test('strings returns constants.strings', () => {
  assert.deepEqual(MDCRippleFoundation.strings, strings);
});

test('numbers returns constants.numbers', () => {
  assert.deepEqual(MDCRippleFoundation.numbers, numbers);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCRippleFoundation, [
    'browserSupportsCssVars', 'isUnbounded', 'isSurfaceActive', 'isSurfaceDisabled',
    'addClass', 'removeClass', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerResizeHandler', 'deregisterResizeHandler', 'updateCssVariable',
    'computeBoundingRect', 'getWindowPageOffset',
  ]);
});

testFoundation(`#init calls adapter.addClass("${cssClasses.ROOT}")`, ({adapter, foundation, mockRaf}) => {
  foundation.init();
  mockRaf.flush();

  td.verify(adapter.addClass(cssClasses.ROOT));
});

testFoundation('#init adds unbounded class when adapter indicates unbounded', ({adapter, foundation, mockRaf}) => {
  td.when(adapter.isUnbounded()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  td.verify(adapter.addClass(cssClasses.UNBOUNDED));
});

testFoundation('#init does not add unbounded class when adapter does not indicate unbounded (default)',
  ({adapter, foundation, mockRaf}) => {
    foundation.init();
    mockRaf.flush();

    td.verify(adapter.addClass(cssClasses.UNBOUNDED), {times: 0});
  });

testFoundation('#init gracefully exits when css variables are not supported', false,
  ({foundation, adapter, mockRaf}) => {
    foundation.init();
    mockRaf.flush();

    td.verify(adapter.addClass(cssClasses.ROOT), {times: 0});
  });

testFoundation(`#init sets ${strings.VAR_FG_SIZE} to the circumscribing circle's diameter`,
  ({foundation, adapter, mockRaf}) => {
    const size = 200;
    td.when(adapter.computeBoundingRect()).thenReturn({width: size, height: size / 2});
    foundation.init();
    mockRaf.flush();
    const initialSize = size * numbers.INITIAL_ORIGIN_SCALE;

    td.verify(adapter.updateCssVariable(strings.VAR_FG_SIZE, `${initialSize}px`));
  });

testFoundation(`#init centers via ${strings.VAR_LEFT} and ${strings.VAR_TOP} when unbounded`,
  ({foundation, adapter, mockRaf}) => {
    const width = 200;
    const height = 100;
    const maxSize = Math.max(width, height);
    const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height});
    td.when(adapter.isUnbounded()).thenReturn(true);
    foundation.init();
    mockRaf.flush();

    td.verify(adapter.updateCssVariable(strings.VAR_LEFT,
      `${Math.round((width / 2) - (initialSize / 2))}px`));
    td.verify(adapter.updateCssVariable(strings.VAR_TOP,
      `${Math.round((height / 2) - (initialSize / 2))}px`));
  });

testFoundation('#init registers events for all types of common interactions', ({foundation, adapter}) => {
  const expectedEvents = [
    'mousedown', 'mouseup',
    'touchstart', 'touchend',
    'pointerdown', 'pointerup',
    'keydown', 'keyup',
    'focus', 'blur',
  ];
  foundation.init();

  expectedEvents.forEach((evt) => {
    td.verify(adapter.registerInteractionHandler(evt, td.matchers.isA(Function)));
  });
});

testFoundation('#init registers an event for when a resize occurs', ({foundation, adapter}) => {
  foundation.init();

  td.verify(adapter.registerResizeHandler(td.matchers.isA(Function)));
});

testFoundation('#destroy not supported', ({foundation, adapter}) => {
  const handlers = {};

  td.when(
    adapter.registerInteractionHandler(td.matchers.isA(String), td.matchers.isA(Function))
  ).thenDo((type, handler) => {
    handlers[type] = handler;
  });
  foundation.init();
  td.when(adapter.browserSupportsCssVars()).thenReturn(false);
  foundation.destroy();

  Object.keys(handlers).forEach((type) => {
    td.verify(adapter.deregisterInteractionHandler(type, handlers[type]), {times: 0});
  });
});

testFoundation('#destroy unregisters all bound interaction handlers', ({foundation, adapter}) => {
  const handlers = {};

  td.when(
    adapter.registerInteractionHandler(td.matchers.isA(String), td.matchers.isA(Function))
  ).thenDo((type, handler) => {
    handlers[type] = handler;
  });
  foundation.init();
  foundation.destroy();

  Object.keys(handlers).forEach((type) => {
    td.verify(adapter.deregisterInteractionHandler(type, handlers[type]));
  });
});

testFoundation('#destroy unregisters the resize handler', ({foundation, adapter}) => {
  let resizeHandler;
  td.when(adapter.registerResizeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    resizeHandler = handler;
  });
  foundation.init();
  foundation.destroy();

  td.verify(adapter.deregisterResizeHandler(resizeHandler));
});

testFoundation(`#destroy removes ${cssClasses.ROOT}`, ({foundation, adapter, mockRaf}) => {
  foundation.destroy();
  mockRaf.flush();
  td.verify(adapter.removeClass(cssClasses.ROOT));
});

testFoundation(`#destroy removes ${cssClasses.UNBOUNDED}`, ({foundation, adapter, mockRaf}) => {
  foundation.destroy();
  mockRaf.flush();
  td.verify(adapter.removeClass(cssClasses.UNBOUNDED));
});

testFoundation('#destroy removes all CSS variables', ({foundation, adapter, mockRaf}) => {
  const cssVars = Object.keys(strings).filter((s) => s.indexOf('VAR_') === 0).map((s) => strings[s]);
  foundation.destroy();
  mockRaf.flush();
  cssVars.forEach((cssVar) => {
    td.verify(adapter.updateCssVariable(cssVar, null));
  });
});

testFoundation(`#layout sets ${strings.VAR_FG_SIZE} to the circumscribing circle's diameter`,
  ({foundation, adapter, mockRaf}) => {
    const width = 200;
    const height = 100;
    const maxSize = Math.max(width, height);
    const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height});
    foundation.layout();
    mockRaf.flush();

    td.verify(adapter.updateCssVariable(strings.VAR_FG_SIZE, `${initialSize}px`));
  });

testFoundation(`#layout sets ${strings.VAR_FG_SCALE} based on the difference between the ` +
               'proportion of the max radius and the initial size', ({foundation, adapter, mockRaf}) => {
  const width = 200;
  const height = 100;

  td.when(adapter.computeBoundingRect()).thenReturn({width, height});
  foundation.layout();
  mockRaf.flush();

  const maxSize = Math.max(width, height);
  const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
  const surfaceDiameter = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  const maxRadius = surfaceDiameter + numbers.PADDING;
  const fgScale = maxRadius / initialSize;

  td.verify(adapter.updateCssVariable(strings.VAR_FG_SCALE, fgScale));
});

testFoundation(`#layout centers via ${strings.VAR_LEFT} and ${strings.VAR_TOP} when unbounded`,
  ({foundation, adapter, mockRaf}) => {
    const width = 200;
    const height = 100;
    const maxSize = Math.max(width, height);
    const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height});
    td.when(adapter.isUnbounded()).thenReturn(true);
    foundation.layout();
    mockRaf.flush();

    td.verify(adapter.updateCssVariable(strings.VAR_LEFT,
      `${Math.round((width / 2) - (initialSize / 2))}px`));
    td.verify(adapter.updateCssVariable(strings.VAR_TOP,
      `${Math.round((height / 2) - (initialSize / 2))}px`));
  });

testFoundation('#layout debounces calls within the same frame', ({foundation, mockRaf}) => {
  foundation.layout();
  foundation.layout();
  foundation.layout();
  assert.equal(mockRaf.pendingFrames.length, 1);
});

testFoundation('#layout resets debounce latch when layout frame is run', ({foundation, mockRaf}) => {
  foundation.layout();
  mockRaf.flush();
  foundation.layout();
  assert.equal(mockRaf.pendingFrames.length, 1);
});
