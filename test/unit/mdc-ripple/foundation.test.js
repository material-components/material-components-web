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

import test from 'tape';
import td from 'testdouble';

import MDCRippleFoundation from '../../../packages/mdc-ripple/foundation';
import {cssClasses, strings, numbers} from '../../../packages/mdc-ripple/constants';

import {testFoundation} from './helpers';

test('cssClasses returns constants.cssClasses', (t) => {
  t.deepEqual(MDCRippleFoundation.cssClasses, cssClasses);
  t.end();
});

test('strings returns constants.strings', (t) => {
  t.deepEqual(MDCRippleFoundation.strings, strings);
  t.end();
});

test('numbers returns constants.numbers', (t) => {
  t.deepEqual(MDCRippleFoundation.numbers, numbers);
  t.end();
});

test('defaultAdapter returns a complete adapter implementation', (t) => {
  const {defaultAdapter} = MDCRippleFoundation;
  const methods = Object.keys(defaultAdapter).filter((k) => typeof defaultAdapter[k] === 'function');

  t.equal(methods.length, Object.keys(defaultAdapter).length, 'Every adapter key must be a function');
  t.deepEqual(methods, [
    'browserSupportsCssVars', 'isUnbounded', 'isSurfaceActive', 'addClass', 'removeClass',
    'registerInteractionHandler', 'deregisterInteractionHandler', 'registerResizeHandler',
    'deregisterResizeHandler', 'updateCssVariable', 'computeBoundingRect', 'getWindowPageOffset',
  ]);
  // Test default methods
  methods.forEach((m) => t.doesNotThrow(defaultAdapter[m]));

  t.end();
});

testFoundation(`#init calls adapter.addClass("${cssClasses.ROOT}")`, (t) => {
  const {adapter, foundation, mockRaf} = t.data;
  foundation.init();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.addClass(cssClasses.ROOT)));
  t.end();
});

testFoundation('#init adds unbounded class when adapter indicates unbounded', (t) => {
  const {adapter, foundation, mockRaf} = t.data;
  td.when(adapter.isUnbounded()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.addClass(cssClasses.UNBOUNDED)));
  t.end();
});

testFoundation('#init does not add unbounded class when adapter does not indicate unbounded (default)', (t) => {
  const {adapter, foundation, mockRaf} = t.data;
  foundation.init();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.addClass(cssClasses.UNBOUNDED), {times: 0}));
  t.end();
});

testFoundation('#init gracefully exits when css variables are not supported', false, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  foundation.init();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.addClass(cssClasses.ROOT), {times: 0}));
  t.end();
});

testFoundation(`#init sets ${strings.VAR_SURFACE_WIDTH} css variable to the clientRect's width`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  td.when(adapter.computeBoundingRect()).thenReturn({width: 200, height: 100});
  foundation.init();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_SURFACE_WIDTH, '200px')));
  t.end();
});

testFoundation(`#init sets ${strings.VAR_SURFACE_HEIGHT} css variable to the clientRect's height`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  td.when(adapter.computeBoundingRect()).thenReturn({width: 200, height: 100});
  foundation.init();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_SURFACE_HEIGHT, '100px')));
  t.end();
});

testFoundation(`#init sets ${strings.VAR_FG_SIZE} to the circumscribing circle's diameter`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  const size = 200;
  td.when(adapter.computeBoundingRect()).thenReturn({width: size, height: size / 2});
  foundation.init();
  mockRaf.flush();
  const initialSize = size * numbers.INITIAL_ORIGIN_SCALE;

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_FG_SIZE, `${initialSize}px`)));
  t.end();
});

testFoundation(`#init sets ${strings.VAR_FG_UNBOUNDED_TRANSFORM_DURATION} based on the max radius`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  const width = 200;
  const height = 100;
  td.when(adapter.computeBoundingRect()).thenReturn({width, height});
  foundation.init();
  mockRaf.flush();

  const expectedDiameter = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  const expectedRadius = expectedDiameter + numbers.PADDING;
  const expectedDuration = 1000 * Math.sqrt(expectedRadius / 1024);
  const {VAR_FG_UNBOUNDED_TRANSFORM_DURATION: expectedCssVar} = strings;
  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(expectedCssVar, `${expectedDuration}ms`)));
  t.end();
});

testFoundation(`#init centers via ${strings.VAR_LEFT} and ${strings.VAR_TOP} when unbounded`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  const width = 200;
  const height = 100;
  const maxSize = Math.max(width, height);
  const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

  td.when(adapter.computeBoundingRect()).thenReturn({width, height});
  td.when(adapter.isUnbounded()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_LEFT,
      `${Math.round((width / 2) - (initialSize / 2))}px`)));
  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_TOP,
      `${Math.round((height / 2) - (initialSize / 2))}px`)));
  t.end();
});

testFoundation('#init registers events for all types of common interactions', (t) => {
  const {foundation, adapter} = t.data;
  const expectedEvents = [
    'mousedown', 'mouseup',
    'touchstart', 'touchend',
    'pointerdown', 'pointerup',
    'keydown', 'keyup',
    'focus', 'blur',
  ];
  foundation.init();

  expectedEvents.forEach((evt) => {
    t.doesNotThrow(() => td.verify(adapter.registerInteractionHandler(evt, td.matchers.isA(Function))));
  });
  t.end();
});

testFoundation('#init registers an event for when a resize occurs', (t) => {
  const {foundation, adapter} = t.data;
  foundation.init();

  t.doesNotThrow(() => td.verify(adapter.registerResizeHandler(td.matchers.isA(Function))));
  t.end();
});

testFoundation('#destroy unregisters all bound interaction handlers', (t) => {
  const {foundation, adapter} = t.data;
  const handlers = {};

  td.when(
    adapter.registerInteractionHandler(td.matchers.isA(String), td.matchers.isA(Function))
  ).thenDo((type, handler) => {
    handlers[type] = handler;
  });
  foundation.init();
  foundation.destroy();

  Object.keys(handlers).forEach((type) => {
    t.doesNotThrow(() => td.verify(adapter.deregisterInteractionHandler(type, handlers[type])));
  });
  t.end();
});

testFoundation('#destroy unregisters the resize handler', (t) => {
  const {foundation, adapter} = t.data;
  let resizeHandler;
  td.when(adapter.registerResizeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    resizeHandler = handler;
  });
  foundation.init();
  foundation.destroy();

  t.doesNotThrow(() => td.verify(adapter.deregisterResizeHandler(resizeHandler)));
  t.end();
});

testFoundation(`#destroy removes ${cssClasses.ROOT}`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  foundation.destroy();
  mockRaf.flush();
  t.doesNotThrow(() => td.verify(adapter.removeClass(cssClasses.ROOT)));
  t.end();
});

testFoundation(`#destroy removes ${cssClasses.UNBOUNDED}`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  foundation.destroy();
  mockRaf.flush();
  t.doesNotThrow(() => td.verify(adapter.removeClass(cssClasses.UNBOUNDED)));
  t.end();
});

testFoundation('#destroy removes all CSS variables', (t) => {
  const cssVars = Object.keys(strings).filter((s) => s.indexOf('VAR_') === 0).map((s) => strings[s]);
  const {foundation, adapter, mockRaf} = t.data;
  foundation.destroy();
  mockRaf.flush();
  cssVars.forEach((cssVar) => {
    t.doesNotThrow(() => td.verify(adapter.updateCssVariable(cssVar, null)));
  });
  t.end();
});

testFoundation(`#layout sets ${strings.VAR_SURFACE_WIDTH} css variable to the clientRect's width`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  td.when(adapter.computeBoundingRect()).thenReturn({width: 200, height: 100});
  foundation.layout();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_SURFACE_WIDTH, '200px')));
  t.end();
});

testFoundation(`#layout sets ${strings.VAR_SURFACE_HEIGHT} css variable to the clientRect's height`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  td.when(adapter.computeBoundingRect()).thenReturn({width: 200, height: 100});
  foundation.layout();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_SURFACE_HEIGHT, '100px')));
  t.end();
});

testFoundation(`#layout sets ${strings.VAR_FG_SIZE} to the circumscribing circle's diameter`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  const width = 200;
  const height = 100;
  const maxSize = Math.max(width, height);
  const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

  td.when(adapter.computeBoundingRect()).thenReturn({width, height});
  foundation.layout();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_FG_SIZE, `${initialSize}px`)));
  t.end();
});

testFoundation(`#layout sets ${strings.VAR_FG_SCALE} based on the difference between the ` +
               'proportion of the max radius and the initial size', (t) => {
  const {foundation, adapter, mockRaf} = t.data;
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

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_FG_SCALE, fgScale)));
  t.end();
});

testFoundation(`#layout sets ${strings.VAR_FG_UNBOUNDED_TRANSFORM_DURATION} based on the max radius`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  const width = 200;
  const height = 100;

  td.when(adapter.computeBoundingRect()).thenReturn({width, height});
  foundation.layout();
  mockRaf.flush();

  const expectedDiameter = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  const expectedRadius = expectedDiameter + numbers.PADDING;
  const expectedDuration = 1000 * Math.sqrt(expectedRadius / 1024);

  const {VAR_FG_UNBOUNDED_TRANSFORM_DURATION: expectedCssVar} = strings;
  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(expectedCssVar, `${expectedDuration}ms`)));
  t.end();
});

testFoundation(`#layout centers via ${strings.VAR_LEFT} and ${strings.VAR_TOP} when unbounded`, (t) => {
  const {foundation, adapter, mockRaf} = t.data;
  const width = 200;
  const height = 100;
  const maxSize = Math.max(width, height);
  const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

  td.when(adapter.computeBoundingRect()).thenReturn({width, height});
  td.when(adapter.isUnbounded()).thenReturn(true);
  foundation.layout();
  mockRaf.flush();

  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_LEFT,
      `${Math.round((width / 2) - (initialSize / 2))}px`)));
  t.doesNotThrow(() => td.verify(adapter.updateCssVariable(strings.VAR_TOP,
      `${Math.round((height / 2) - (initialSize / 2))}px`)));
  t.end();
});

testFoundation('#layout debounces calls within the same frame', (t) => {
  const {foundation, mockRaf} = t.data;
  foundation.layout();
  foundation.layout();
  foundation.layout();
  t.equal(mockRaf.pendingFrames.length, 1);
  t.end();
});

testFoundation('#layout resets debounce latch when layout frame is run', (t) => {
  const {foundation, mockRaf} = t.data;
  foundation.layout();
  mockRaf.flush();
  foundation.layout();
  t.equal(mockRaf.pendingFrames.length, 1);
  t.end();
});
