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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {MDCRippleFoundation} from '../../../packages/mdc-ripple/foundation';
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

testFoundation(`#init calls adapter.addClass("${cssClasses.ROOT}")`, ({adapter, foundation, clock}) => {
  foundation.init();
  clock.runToFrame();

  td.verify(adapter.addClass(cssClasses.ROOT));
});

testFoundation('#init adds unbounded class when adapter indicates unbounded', ({adapter, foundation, clock}) => {
  td.when(adapter.isUnbounded()).thenReturn(true);
  foundation.init();
  clock.runToFrame();

  td.verify(adapter.addClass(cssClasses.UNBOUNDED));
});

testFoundation('#init does not add unbounded class when adapter does not indicate unbounded (default)',
  ({adapter, foundation, clock}) => {
    foundation.init();
    clock.runToFrame();

    td.verify(adapter.addClass(cssClasses.UNBOUNDED), {times: 0});
  });

testFoundation('#init gracefully exits when css variables are not supported', false,
  ({foundation, adapter, clock}) => {
    foundation.init();
    clock.runToFrame();

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

testFoundation('#init only registers focus/blur if CSS custom properties not supported', ({foundation, adapter}) => {
  td.when(adapter.browserSupportsCssVars()).thenReturn(false);
  foundation.init();

  td.verify(adapter.registerInteractionHandler(td.matchers.isA(String), td.matchers.isA(Function)), {times: 2});
  td.verify(adapter.registerInteractionHandler('focus', td.matchers.isA(Function)));
  td.verify(adapter.registerInteractionHandler('blur', td.matchers.isA(Function)));
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

testFoundation(`#destroy removes ${cssClasses.ROOT}`, ({foundation, adapter, clock}) => {
  foundation.destroy();
  clock.runToFrame();
  td.verify(adapter.removeClass(cssClasses.ROOT));
});

testFoundation(`#destroy removes ${cssClasses.UNBOUNDED}`, ({foundation, adapter, clock}) => {
  foundation.destroy();
  clock.runToFrame();
  td.verify(adapter.removeClass(cssClasses.UNBOUNDED));
});

testFoundation(`#destroy removes ${cssClasses.FG_ACTIVATION} if activation is interrupted`,
  ({foundation, adapter, clock}) => {
    foundation.activationTimer_ = 1;
    foundation.destroy();
    clock.runToFrame();

    assert.equal(foundation.activationTimer_, 0);
    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION));
  });

testFoundation(`#destroy removes ${cssClasses.FG_DEACTIVATION} if deactivation is interrupted`,
  ({foundation, adapter, clock}) => {
    foundation.fgDeactivationRemovalTimer_ = 1;
    foundation.destroy();
    clock.runToFrame();

    assert.equal(foundation.fgDeactivationRemovalTimer_, 0);
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));
  });

testFoundation('#destroy removes all CSS variables', ({foundation, adapter, clock}) => {
  const cssVars = Object.keys(strings).filter((s) => s.indexOf('VAR_') === 0).map((s) => strings[s]);
  foundation.destroy();
  clock.runToFrame();
  cssVars.forEach((cssVar) => {
    td.verify(adapter.updateCssVariable(cssVar, null));
  });
});

testFoundation('#destroy clears the timer if activation is interrupted',
  ({foundation, clock}) => {
    foundation.init();
    clock.runToFrame();

    foundation.activationTimer_ = 1;
    foundation.destroy();
    clock.runToFrame();

    assert.equal(foundation.activationTimer_, 0);
  });

testFoundation('#destroy when CSS custom properties are not supported', ({foundation, adapter, clock}) => {
  const isA = td.matchers.isA;
  td.when(adapter.browserSupportsCssVars()).thenReturn(false);
  foundation.destroy();
  clock.runToFrame();

  // #destroy w/o CSS vars still calls event deregistration functions (to deregister focus/blur; the rest are no-ops)
  td.verify(adapter.deregisterInteractionHandler('focus', isA(Function)));
  td.verify(adapter.deregisterInteractionHandler('blur', isA(Function)));
  // #destroy w/o CSS vars doesn't change any CSS classes or custom properties
  td.verify(adapter.removeClass(isA(String)), {times: 0});
  td.verify(adapter.updateCssVariable(isA(String), isA(String)), {times: 0});
});

testFoundation(`#layout sets ${strings.VAR_FG_SIZE} to the circumscribing circle's diameter`,
  ({foundation, adapter, clock}) => {
    const width = 200;
    const height = 100;
    const maxSize = Math.max(width, height);
    const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height});
    foundation.layout();
    clock.runToFrame();

    td.verify(adapter.updateCssVariable(strings.VAR_FG_SIZE, `${initialSize}px`));
  });

testFoundation(`#layout always sets ${strings.VAR_FG_SIZE} to even number`,
  ({foundation, adapter, clock}) => {
    const width = 36;
    const height = 36;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height});
    td.when(adapter.isUnbounded()).thenReturn(true);
    foundation.layout();
    clock.runToFrame();

    const isEvenNumber = (pixel) => (parseInt(pixel, 10) % 2 === 0);
    td.verify(adapter.updateCssVariable(strings.VAR_FG_SIZE, td.matchers.argThat(isEvenNumber)));
  });

testFoundation(`#layout sets ${strings.VAR_FG_SCALE} based on the difference between the ` +
               'proportion of the max radius and the initial size', ({foundation, adapter, clock}) => {
  const width = 200;
  const height = 100;

  td.when(adapter.computeBoundingRect()).thenReturn({width, height});
  foundation.layout();
  clock.runToFrame();

  const maxSize = Math.max(width, height);
  const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
  const surfaceDiameter = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  const maxRadius = surfaceDiameter + numbers.PADDING;
  const fgScale = `${maxRadius / initialSize}`;

  td.verify(adapter.updateCssVariable(strings.VAR_FG_SCALE, fgScale));
});

testFoundation(`#layout centers via ${strings.VAR_LEFT} and ${strings.VAR_TOP} when unbounded`,
  ({foundation, adapter, clock}) => {
    const width = 200;
    const height = 100;
    const maxSize = Math.max(width, height);
    const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height});
    td.when(adapter.isUnbounded()).thenReturn(true);
    foundation.layout();
    clock.runToFrame();

    td.verify(adapter.updateCssVariable(strings.VAR_LEFT,
      `${Math.round((width / 2) - (initialSize / 2))}px`));
    td.verify(adapter.updateCssVariable(strings.VAR_TOP,
      `${Math.round((height / 2) - (initialSize / 2))}px`));
  });

testFoundation('#layout debounces calls within the same frame', ({foundation, clock}) => {
  foundation.layout();
  foundation.layout();
  foundation.layout();
  assert.equal(clock.countTimers(), 1);
});

testFoundation('#layout resets debounce latch when layout frame is run', ({foundation, clock}) => {
  foundation.layout();
  clock.runToFrame();
  foundation.layout();
  assert.equal(clock.countTimers(), 1);
});

testFoundation('#setUnbounded adds unbounded class when unbounded is truthy', ({adapter, foundation}) => {
  foundation.setUnbounded(true);
  td.verify(adapter.addClass(cssClasses.UNBOUNDED));
});

testFoundation('#setUnbounded removes unbounded class when unbounded is falsy', ({adapter, foundation}) => {
  foundation.setUnbounded(false);
  td.verify(adapter.removeClass(cssClasses.UNBOUNDED));
});
