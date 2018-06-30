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
    'addClass', 'removeClass', 'containsEventTarget', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerDocumentInteractionHandler', 'deregisterDocumentInteractionHandler',
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

testFoundation('#init registers events for interactions on root element', ({foundation, adapter}) => {
  foundation.init();

  td.verify(adapter.registerInteractionHandler(td.matchers.isA(String), td.matchers.isA(Function)));
});

testFoundation('#init registers a resize handler for unbounded ripple', ({foundation, adapter}) => {
  td.when(adapter.isUnbounded()).thenReturn(true);
  foundation.init();

  td.verify(adapter.registerResizeHandler(td.matchers.isA(Function)));
});

testFoundation('#init does not register a resize handler for bounded ripple', ({foundation, adapter}) => {
  td.when(adapter.isUnbounded()).thenReturn(false);
  foundation.init();

  td.verify(adapter.registerResizeHandler(td.matchers.isA(Function)), {times: 0});
});

testFoundation('#init does not register events if CSS custom properties not supported', ({foundation, adapter}) => {
  td.when(adapter.browserSupportsCssVars()).thenReturn(false);
  foundation.init();

  td.verify(adapter.registerInteractionHandler(td.matchers.isA(String), td.matchers.isA(Function)), {times: 0});
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

  td.verify(adapter.deregisterDocumentInteractionHandler(td.matchers.isA(String), td.matchers.isA(Function)));
});

testFoundation('#destroy unregisters the resize handler for unbounded ripple', ({foundation, adapter}) => {
  let resizeHandler;
  td.when(adapter.isUnbounded()).thenReturn(true);
  td.when(adapter.registerResizeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    resizeHandler = handler;
  });
  foundation.init();
  foundation.destroy();

  td.verify(adapter.deregisterResizeHandler(resizeHandler));
});

testFoundation('#destroy does not unregister resize handler for bounded ripple', ({foundation, adapter}) => {
  td.when(adapter.isUnbounded()).thenReturn(false);
  foundation.init();
  foundation.destroy();

  td.verify(adapter.deregisterResizeHandler(td.matchers.isA(Function)), {times: 0});
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

testFoundation(`#destroy removes ${cssClasses.FG_ACTIVATION} if activation is interrupted`,
  ({foundation, adapter, mockRaf}) => {
    foundation.activationTimer_ = 1;
    foundation.destroy();
    mockRaf.flush();

    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION));
  });

testFoundation('#destroy removes all CSS variables', ({foundation, adapter, mockRaf}) => {
  const cssVars = Object.keys(strings).filter((s) => s.indexOf('VAR_') === 0).map((s) => strings[s]);
  foundation.destroy();
  mockRaf.flush();
  cssVars.forEach((cssVar) => {
    td.verify(adapter.updateCssVariable(cssVar, null));
  });
});

testFoundation('#destroy clears the timer if activation is interrupted',
  ({foundation, mockRaf}) => {
    foundation.init();
    mockRaf.flush();

    foundation.activationTimer_ = 1;
    foundation.destroy();
    mockRaf.flush();

    assert.equal(foundation.activationTimer_, 0);
  });

testFoundation('#destroy does nothing if CSS custom properties are not supported', ({foundation, adapter, mockRaf}) => {
  const isA = td.matchers.isA;
  td.when(adapter.browserSupportsCssVars()).thenReturn(false);
  foundation.destroy();
  mockRaf.flush();

  td.verify(adapter.deregisterInteractionHandler(isA(String), isA(Function)), {times: 0});
  td.verify(adapter.deregisterResizeHandler(isA(Function)), {times: 0});
  td.verify(adapter.removeClass(isA(String)), {times: 0});
  td.verify(adapter.updateCssVariable(isA(String), isA(String)), {times: 0});
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

testFoundation('#setUnbounded adds unbounded class when unbounded is truthy', ({adapter, foundation}) => {
  foundation.setUnbounded(true);
  td.verify(adapter.addClass(cssClasses.UNBOUNDED));
});

testFoundation('#setUnbounded removes unbounded class when unbounded is falsy', ({adapter, foundation}) => {
  foundation.setUnbounded(false);
  td.verify(adapter.removeClass(cssClasses.UNBOUNDED));
});
